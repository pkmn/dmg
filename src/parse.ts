/**
 * FIXME
 *
 * - 60% +CursedBody Gengar (convert HP to percent), include in phrase!
 *   - also handle percent as flag
 * - +z in addition to +useZ
 * - `vs` and `vs.` split if phrase is present
 * - specify allies information...
 * - treat battery/fairyaura etc as side conditions = problem, distinguish ally ability! allies=+FriendGuard,+AuraBreak
 * - handle Nature (when to simplify?)
 * - handle all EVs in phrase
 * - handle gameType in (Gen 4 Doubles)
 * - tox:6 = toxicCounter in status
 * - handle metronome count as @ Metronome:5
 * - support multi phrase with ;
 * - attackerIVs=0/31/31/31/31/0 attackerEVs=0/252/0/252/0/4 (ivs and evs if a vs-implicit)
 */
import type {
  BoostsTable,
  GameType,
  GenderName,
  Generation,
  GenerationNum,
  Generations,
  ID,
  StatName,
  StatsTable,
} from '@pkmn/data';

import {Conditions, ConditionKind, Player} from './conditions';
import {State, bounded} from './state';
import {decodeURL} from './encode';
import {is, toID, has} from './utils';

// Flags can either be specified as key:value or as 'implicits'
// eslint-disable-next-line max-len
const FLAG = /^(?:(?:(?:--?)?(\w+)(?:=|:)([-+0-9a-zA-Z_'’".,:= ]+))|((?:--?|\+)[a-zA-Z'’"][-+0-9a-zA-Z_'’".,:= ]+))$/;
// Used to splits up the 'value' of a flag into multiple logical sub-flags
const SPLIT_SUBFLAG = /[^+0-9a-zA-Z_'’":= ]/;

// This is perhaps an overly cute trick to allow us to repurpose the existing nesting of the Flags
// structure without causing collisions - no input flag can ever match this unique symbol ('_' was
// chosen because '_' usually refers to "the rest" as well as "private" things, and 'conditions' is
// too annoying to continuously type).
const _ = Symbol('_');
interface Flags {
  general: {[id: string]: string};
  field: {[id: string]: string} & {[_]: {[k in ConditionKind]?: {[id: string]: string}}};
  p1: {[id: string]: string} & {[_]: {[k in ConditionKind]?: {[id: string]: string}}};
  p2: {[id: string]: string} & {[_]: {[k in ConditionKind]?: {[id: string]: string}}};
  move: {[id: string]: string};
}

const STATS = (s: string) =>
  ['hp', 'atk', 'def', 'spa', 'spd', 'spc', 'spe'].map(stat => `${stat}${s}`);
const BOOSTS = (s: string) => [...STATS(s).slice(1), `accuracy${s}`, `evasion${s}`];
// Known keys for the various Flags scopes above - in strict mode unknown keys causes errors, note
// that scalar conditions (weather/terrain/status) are 'lifted' out of _ up to the top level
const PLAYER_KNOWN = [
  'species', 'level', 'ability', 'item', 'gender', 'nature', ...STATS('ivs'), ...STATS('dvs'),
  ...STATS('evs'), ...BOOSTS('boosts'), 'happiness', 'hp', 'toxiccounter', 'status', _,
];
const KNOWN = {
  general: ['gametype'],
  field: ['weather', 'terrain', 'pseudoweather', _],
  p1: PLAYER_KNOWN,
  p2: PLAYER_KNOWN,
  move: ['name', 'hits', 'usez', 'crit', 'spread'],
};

// eslint-disable-next-line max-len
const EVS = /(?:(?:\d{1,3}(?:\+|-)?\s*(?:HP|Atk|Def|SpA|SpD|Spe|Spc)(?:\s*\/\s*\d{1,3}(?:\+|-)?\s*(?:HP|Atk|Def|SpA|SpD|Spe|Spc)){0,5})?\s+)?/;

const PHRASE = new RegExp([
  // Attacker Boosts
  /^(?:((?:\+|-)[1-6])?\s+)?/, // 1
  // Attacker Level
  /(?:Lvl?\s*(\d{1,2})\s+)?/, // 2
  // Attacker EVs
  /(?:(\d{1,3}(?:\+|-)?\s*(?:SpA|Atk))?\s+)?/, // 3
  // Attacker Pokemon (@ Attacker Item)?
  /(?:([A-Za-z][-0-9A-Za-zé%'’:. ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)/, // 4 & 5
  // Move
  /\s*\[([-0-9A-Za-z', ]+)\]\s+vs\.?\s+/, // 6
  // Defender Boosts
  /(?:((?:\+|-)[1-6])?\s+)?/, // 7
  // Defender Level
  /(?:Lvl?\s*(\d{1,2})\s+)?/, // 8
  // Defender EVs
  /(?:(\d{1,3}\s*HP)?\s*\/?\s*(\d{1,3}(?:\+|-)?\s*(?:SpD|Def))?\s+)?/, // 9 & 10
  // Defender Pokemon (@ Defender Item)?
  /(?:([A-Za-z][-0-9A-Za-zé%'’:. ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)$/, // 11 & 12
].map(r => r.source).join(''), 'i');

const QUOTED = /^['"].*['"]$/;

interface Phrase {
  p1: {
    id: ID;
    boosts?: number;
    level?: number;
    nature?: '+' | '-';
    // TODO hp?: number;
    evs?: {atk?: number; spa?: number}; // TODO Partial<StatsTable>
    item?: ID;
  };
  move: ID;
  p2: {
    id: ID;
    boosts?: number;
    level?: number;
    nature?: '+' | '-';
    // TODO hp?: number;
    evs?: {hp?: number; def?: number; spd?: number}; // TODO Partial<StatsTable>
    item?: ID;
  };
}

interface Context {
  input: string;
  gen?: number;
  phrase?: {
    input: string;
    output?: Phrase | undefined;
  },
  flags?: {
    input: Array<[ID, string]>;
    output?:  {
      general: {[id: string]: string};
      field: {[id: string]: string | {[k in ConditionKind]?: {[id: string]: string}}};
      p1: {[id: string]: string | {[k in ConditionKind]?: {[id: string]: string}}};
      p2: {[id: string]: string | {[k in ConditionKind]?: {[id: string]: string}}};
      move: {[id: string]: string};
    }
  }
}

// DEBUG
let stringify = JSON.stringify;
try {
  stringify = require('json-stringify-pretty-compact');
} catch {}
// DEBUG

export function parse(gens: Generation | Generations, s: string, strict = false) {
  const context: Context = {input: s};
  // Decode the string in case it was URL encoded and then split up the string into
  // whitespace separated tokens (respecting quotes!)
  console.log(s); // DEBUG
  const argv = tokenize(decodeURL(s));

  // Raw flag key:val in the order they appeared in `s`
  const raw: Array<[ID, string]> = [];
  // Non-flag elements which are to be parsed as the phrase
  const fragments: string[] = [];

  // Because disambiguating implicits depends on the generation (boo!) we must make two passes over
  // the args - once to clean them up and figure out the ordering while determining which gen to
  // use, followed by second pass with disambiguates and scopes the parameters
  let g: GenerationNum | undefined = 'num' in gens ? gens.num : undefined;
  for (const arg of argv) {
    const parsed = parseFlag(arg);
    if (!parsed) {
      fragments.push(arg);
      continue;
    }

    const [id, val] = parsed;
    if (id === 'gen') {
      const n = validateGen(gens, g, val, strict, context);
      if (n) g = n;
      continue;
    }
    raw.push([id, val]);
  }

  const joined = fragments.join(' ');
  context.flags = {input: raw};
  const [gen, phrase] = parseGen(gens, g, joined, strict, context);
  context.gen = gen.num;
  context.phrase = {input: phrase};
  const flags = parseFlags(gen, raw, strict, context);
  context.flags.output = toContext(flags);

  // Useful to include in error messages to reveal how `s` was parsed
  const parsed = phrase ? parsePhrase(phrase) : undefined;
  context.phrase.output = parsed;

  // context = toContext(s, phrase, parsed, raw, flags);
  if (phrase && !parsed && strict) {
    throw new ParseError(`Unable to parse phrase: '${phrase}'`, context);
  }

  console.log(stringify(context, null, 2) + '\n'); // DEBUG
  return build(gen, parsed, flags, context, strict);
}

export class ParseError extends Error {
  readonly context: Context;

  constructor(message: string, context: Context) {
    super(message);
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Generation can be specified as [Gen 4] or [4] as well
const GEN = /\[\s*(?:(?:G|g)en)?\s*(\d)\s*\]/gi;

// Gen can be specified by a flag or by passing in a specific Generation object in addition to
// as part of the phrase. We pull any generation information out of the phrase in addition to
// returning the correct Generation object
function parseGen(
  gens: Generation | Generations,
  g: GenerationNum | undefined,
  s: string,
  strict: boolean,
  context: Context
) {
  let m;
  while ((m = GEN.exec(s))) {
    const n = validateGen(gens, g, m[1], strict, context);
    if (n) g = n;
    s = s.slice(0, m.index) + s.slice(m.index + m[0].length + 1);
  }

  // If no generation flag was specified we can default to the current generation
  const gen = 'num' in gens ? gens : gens.get(g || 8);
  return [gen, s] as const;
}

function validateGen(
  gens: Generation | Generations,
  g: GenerationNum | undefined,
  val: string,
  strict: boolean,
  context: Context
) {
  const n = Number(val);
  if (isNaN(n) || !bounded('gen', n)) {
    if (strict) throw new ParseError(`Invalid generation flag '${val}'`, context);
  } else if ((strict || 'num' in gens) && g && g !== n) {
    throw new ParseError(`Conflicting values for flag generation: '${g}' vs. '${val}'`, context);
  } else {
    return n as GenerationNum;
  }
}

// Map from unambiguous flags to the flag namespace they belong to
const UNAMBIGUOUS: {[id: string]: keyof Flags} = {
  gametype: 'general', doubles: 'general', singles: 'general',
  weather: 'field', terrain: 'field', pseudoweather: 'field',
  move: 'move', usez: 'move', crit: 'move', hits: 'move', spread: 'move',
};

// ConditionKind aliases to allow for flexible flag naming
const CONDITIONS: {[id: string]: ConditionKind} = {
  weather: 'Weather',
  terrain: 'Terrain',
  pseudoweather: 'Pseudo Weather',
  pseudoweathers: 'Pseudo Weather',
  sidecondition: 'Side Condition',
  sideconditions: 'Side Condition',
  volatile: 'Volatile Status',
  volatiles: 'Volatile Status',
  volatilestatus: 'Volatile Status',
  volatilestatuses: 'Volatile Status',
  status: 'Status',
};

function parseFlags(gen: Generation, raw: Array<[ID, string]>, strict: boolean, context: Context) {
  const flags: Flags = {general: {}, field: {[_]: {}}, p1: {[_]: {}}, p2: {[_]: {}}, move: {}};

  const setFlag = (k: keyof Flags, id: ID, val: string) => {
    if (k === 'move' && id === 'move') id = 'name' as ID;
    if (KNOWN[k].includes(id)) {
      // NOTE: all booleans should have been converted to '1' or '0' by parseFlag before this
      if (strict && flags[k][id] && toID(flags[k][id]) !== toID(val)) {
        throw new ParseError(
          `Conflicting values for flag '${id}': '${flags[k][id]}' vs. '${val}'`, context);
      }
      flags[k][id] = val;
    } else if (strict) {
      throw new ParseError(`Unknown flag '${id}'`, context);
    }
  };

  for (let [id, val] of raw) {
    if (UNAMBIGUOUS[id]) {
      if (is(id, 'singles', 'doubles')) {
        val = id;
        id = 'gametype' as ID;
      }
      const type = UNAMBIGUOUS[id];
      if (type === 'field') {
        parseConditionFlag(gen, flags, val, strict, context, 'field', CONDITIONS[id]);
      } else {
        setFlag(type, id, val);
      }
    } else if (id === 'attacker' || id === 'p1') {
      parseConditionFlag(gen, flags, val, strict, context, 'p1');
    } else if (id === 'defender' || id === 'p2') {
      parseConditionFlag(gen, flags, val, strict, context, 'p2');
    } else if (id.startsWith('attacker') || id.startsWith('p1')) {
      id = id.slice(id.charAt(0) === 'p' ? 2 : 8) as ID;
      if (CONDITIONS[id]) {
        parseConditionFlag(gen, flags, val, strict, context, 'p1', CONDITIONS[id]);
        continue;
      }
      setFlag('p1', id, val);
    } else if (id.startsWith('defender') || id.startsWith('p2')) {
      id = id.slice(id.charAt(0) === 'p' ? 2 : 8) as ID;
      if (CONDITIONS[id]) {
        parseConditionFlag(gen, flags, val, strict, context, 'p2', CONDITIONS[id]);
        continue;
      }
      setFlag('p2', id, val);
      continue;
    } else {
      parseConditionFlag(gen, flags, `${id}=${val}`, strict, context);
    }
  }

  return flags;
}

// Conditions that are not boolean flags
const CONDITION_NON_BOOLS =
  ['echoedvoice', 'spikes', 'toxicspikes', 'slowstart', 'autotomize', 'stockpile'] as ID[];
// Boolean flags that are not conditions
const NON_CONDITION_BOOLS = ['usez', 'crit', 'spread'] as ID[];

// Flags which canonically take an 's' suffix
const PLURALS = ['ev', 'iv', 'dv', 'boost'] as ID[];

function parseFlag(arg: string, condition = false): [ID, string] | undefined {
  // 'Type:Null' as part of the phrase will get detected as a flag without this hack...
  if (arg.toLowerCase() === 'type:null') return undefined;
  const m = FLAG.exec(arg);
  if (!m) return undefined;
  if (m[3]) {
    const id = toID(m[3]);
    if (id.startsWith('no')) return [id.slice(2) as ID, '0'];
    if (id.startsWith('is')) return [id.slice(2) as ID, '1'];
    if (id.startsWith('has')) return [id.slice(3) as ID, '1'];
    return [id, '1'];
  } else {
    const id = toID(m[1]);
    const val = QUOTED.test(m[2]) ? m[2].slice(1, -1) : m[2];
    if (id.startsWith('no')) return [id.slice(2) as ID, asBoolean(val) ? '0' : '1'];
    if (id.startsWith('is')) return [id.slice(2) as ID, asBoolean(val) ? '1' : '0'];
    if (id.startsWith('has')) return [id.slice(3) as ID, asBoolean(val) ? '1' : '0'];
    if (!condition && has(NON_CONDITION_BOOLS, id)) return [id, asBoolean(val) ? '1' : '0'];
    if (condition && !has(CONDITION_NON_BOOLS, id)) return [id, asBoolean(val) ? '1' : '0'];
    if (PLURALS.some(p => id.endsWith(p))) return [`${id}s` as ID, val];
    return [id, val];
  }
}

const FIELD_CONDITIONS: ConditionKind[] = ['Weather', 'Terrain', 'Pseudo Weather'];

function parseConditionFlag(
  gen: Generation,
  flags: Flags,
  s: string,
  strict: boolean,
  context: Context,
  scope?: 'p1' | 'p2' | 'field',
  kind?: ConditionKind
) {
  const error = (s: string) => new ParseError(s, context);
  const raw = s.split(SPLIT_SUBFLAG).filter(x => x !== null && x !== undefined);
  if (strict && !raw.length) {
    const k = kind ? `${kind} ` : '';
    throw error(`Expected '${s}' to contain at least one ${k}condition but found none`);
  }

  for (const arg of raw) {
    let parsed = parseFlag(arg, !!kind);
    if (!parsed) {
      parsed = parseFlag(`+${arg}`, !!kind);
      if (!parsed) {
        throw error(`Unable to parse '${arg}' as a flag for a condition from '${s}'`);
      }
    }
    let [id, val] = parsed;

    const condition = Conditions.get(gen, id);
    if (!condition) {
      if (strict) throw error(`Unrecognized or invalid condition '${id}' from '${s}'`);
      continue;
    }

    if (!has(CONDITION_NON_BOOLS, id)) val = asBoolean(val) ? '1' : '0';

    const name = condition[0];
    if (kind && kind !== condition[1]) {
      throw error(`Mismatched kind for condition '${name}': '${kind}' vs. '${condition[1]}'`);
    }

    const ckind = condition[1];
    const cscope = scope ?? condition[2];
    if (!cscope) throw error(`Ambiguous implicit condition '${id}'`);

    const isField = FIELD_CONDITIONS.includes(ckind);
    if ((isField && cscope !== 'field') || (!isField && cscope === 'field')) {
      throw error(`Mismatched scope for condition '${name}'`);
    }

    if (is(ckind, 'Weather', 'Terrain', 'Status')) {
      id = toID(ckind);
      val = toID(name);
      if (strict && flags[cscope][id] && flags[cscope][id] !== val) {
        throw error(`Conflicting values for flag '${id}': '${flags[cscope][id]}' vs. '${val}'`);
      }
      flags[cscope][id] = val;
      continue;
    }

    id = toID(name);
    const conditions = flags[cscope][_][ckind] = (flags[cscope][_][ckind] || {});

    if (strict && conditions[id] && conditions[id] !== val) {
      throw error(`Conflicting values for condition '${id}': '${conditions[id]}' vs. '${val}'`);
    }
    conditions[id] = val;
  }

  return flags;
}

function parsePhrase(s: string) {
  const m = PHRASE.exec(s);
  if (!m) return undefined;

  const phrase: Phrase = {
    p1: {
      id: toID(m[4]),
      boosts: parseInt(m[1]) || undefined,
      level: parseInt(m[2]) || undefined,
      item: toID(m[5]) || undefined,
    },
    move: toID(m[6]),
    p2: {
      id: toID(m[11]),
      boosts: parseInt(m[7]) || undefined,
      level: parseInt(m[8]) || undefined,
      item: toID(m[12]) || undefined,
    },
  };

  if (m[3]) {
    phrase.p1.nature = m[3].includes('+') ? '+' : m[3].includes('-') ? '-' : undefined;
    phrase.p1.evs = {};
    phrase.p1.evs[toID(m[3]).endsWith('atk') ? 'atk' : 'spa'] = parseInt(m[3]) || undefined;
  }
  if (m[9]) phrase.p2.evs = {hp: parseInt(m[9]) || undefined};
  if (m[10]) {
    phrase.p2.nature = m[10].includes('+') ? '+' : m[10].includes('-') ? '-' : undefined;
    phrase.p2.evs = phrase.p2.evs || {};
    phrase.p2.evs[toID(m[10]).endsWith('def') ? 'def' : 'spd'] = parseInt(m[10]) || undefined;
  }

  return phrase;
}

interface Checks {
  conflict<T>(k: string, a: T | undefined, b: T | undefined, required?: boolean): T | undefined;
  number<T>(k: string, a: T | undefined, b?: T | undefined, required?: boolean): number | undefined;
  error(condition: boolean, msg: string): void;
}

const REQUIRED = true;

function build(
  gen: Generation,
  phrase: Phrase | undefined,
  flags: Flags,
  context: Context,
  strict: boolean
): State {
  const conflict = <T>(k: string, a: T | undefined, b: T | undefined, required?: boolean) => {
    if (strict && a && b && toID(a) !== toID(b)) {
      throw new ParseError(`Conflicting values for '${k}': '${a}' vs. '${b}'`, context);
    }
    const val = a ?? b;
    // NOTE: regardless of whether we're strict or not the value is required
    if (!val && required) throw new ParseError(`'${k}' must have a value`, context);
    return val;
  };
  const checks = {
    conflict,
    number<T>(k: string, a: T | undefined, b?: T | undefined, required?: boolean) {
      const n = conflict(k, a, b, required);
      if (!n) return undefined;
      // NOTE: regardless of whether we're strict or not we need a number here
      if (isNaN(+n)) throw new ParseError(`Expected number for '${k}', received '${n}'`, context);
      return +n;
    },
    error(condition: boolean, msg: string) {
      if (strict && condition) throw new ParseError(`${msg}`, context);
    },
  };

  let gameType: GameType = 'singles';
  if (flags.general.gametype) {
    const gt = flags.general.gametype;
    if (!(gt === 'singles' || gt === 'doubles') || gen.num <= 2 && gt === 'doubles') {
      throw new ParseError(`Invalid game type '${gt}' for generation ${gen.num}`, context);
    } else {
      gameType = gt;
    }
  }

  const field = buildField(gen, flags, checks);
  const moveOptions = buildMoveOptions(phrase, flags, checks);
  const moveName = moveOptions.name;

  const p1 = buildSide(gen, 'p1', moveName, phrase, flags, checks);
  const p2 = buildSide(gen, 'p2', moveName, phrase, flags, checks);
  const move = State.createMove(gen, moveName, moveOptions, p1.pokemon);

  return {gameType, gen, field, p1, p2, move};
}

function buildField(gen: Generation, flags: Flags, checks: Checks) {
  const pw = flags.field[_]['Pseudo Weather'];
  const pseudoWeather: {[id: string]: {level?: number}} = {};
  if (pw) {
    for (const id in pw) {
      if (has(CONDITION_NON_BOOLS, id)) {
        pseudoWeather[id] = {
          level: checks.number(`Pseudo Weather ${id}`, pw[id], undefined, REQUIRED),
        };
      }
      if (pw[id] === '1') pseudoWeather[id] = {};
    }
  }

  return State.createField(gen, {
    weather: flags.field.weather,
    terrain: flags.field.terrain,
    pseudoWeather,
  });
}

function buildMoveOptions(
  phrase: Phrase | undefined,
  flags: Flags,
  checks: Checks,
) {
  return {
    name: checks.conflict('move', phrase?.move, flags.move.name, REQUIRED)!,
    hits: checks.number('move hits', flags.move.hits),
    useZ: flags.move.usez ? !!+flags.move.usez : undefined,
    crit: flags.move.crit ? !!+flags.move.crit : undefined,
    spread: flags.move.spread ? !!+flags.move.spread : undefined,
  };
}

function buildSide(
  gen: Generation,
  side: Player,
  move: string,
  phrase: Phrase | undefined,
  flags: Flags,
  checks: Checks,
) {
  const f = flags[side];
  const p = phrase?.[side];
  const c = f[_];

  const fillConditions = (kind: ConditionKind) => {
    const obj: {[id: string]: {level?: number}} = {};
    if (c[kind]) {
      for (const id in c[kind]) {
        if (has(CONDITION_NON_BOOLS, id)) {
          obj[id] = {
            level: checks.number(`${side} ${kind} ${id}`, c[kind]![id], undefined, REQUIRED),
          };
        }
        if (c[kind]![id] === '1') obj[id] = {};
      }
    }
    return obj;
  };

  const sideConditions = fillConditions('Side Condition');

  const name = checks.conflict(`${side} species`, p?.id, f.species, REQUIRED)!;

  let gender: GenderName | undefined = undefined;
  if (f.gender) {
    if (is(f.gender, 'M', 'F', 'N')) {
      gender = f.gender as GenderName;
    } else {
      checks.error(true, `Invalid gender: '${f.gender}'`);
    }
  }

  let stat: StatName | undefined;
  if (p?.evs) {
    for (const s of gen.stats) {
      if (is(s, 'hp', 'spe')) continue;
      if (s in p.evs) {
        stat = s;
        break;
      }
    }
  }

  let nature: string | undefined = undefined;
  if (p?.nature && f.nature) {
    nature = f.nature;
    const n = gen.natures.get(f.nature);
    if (n) { // If the nature is invalid State.createPokemon will throw an error anyway
      const actual = n[p.nature === '+' ? 'plus' : 'minus']!;
      checks.error(actual !== stat, `Conflicting values for ${side} nature: ${f.nature} is ` +
        `${p.nature}${gen.stats.display(actual)} not ${p.nature}${gen.stats.display(stat!)}`);
    }
  } else if (p?.nature) {
    if (stat === 'atk') {
      nature = p.nature === '+' ? 'Adamant' : 'Modest';
    } else if (stat === 'spa') {
      nature = p.nature === '+' ? 'Modest' : 'Adamant';
    } else if (stat === 'def') {
      nature = p.nature === '+' ? 'Lax' : 'Gentle';
    } else if (stat === 'spd') {
      nature = p.nature === '+' ? 'Gentle' : 'Lax';
    }
  } else if (f.nature) {
    nature = f.nature;
  }

  const evs: Partial<StatsTable & {spc: number}> = {};
  const dvs: Partial<StatsTable & {spc: number}> = {};
  const ivs: Partial<StatsTable & {spc: number}> = {};
  const boosts: Partial<BoostsTable & {spc: number}> = {
    accuracy: checks.number(`${side} accuracy boosts`, f.accuracyboosts),
    evasion: checks.number(`${side} evasion boosts`, f.evasionboosts),
  };
  for (const s of [...gen.stats, 'spc'] as (StatName | 'spc')[]) {
    const ev = (p?.evs as StatsTable & {spc: number} | undefined)?.[s];
    const d = gen.stats.display(s);
    evs[s] = checks.number(`${side} ${d} EVs`, ev, f[`${s}evs`] as unknown);
    dvs[s] = checks.number(`${side} ${d} DVs`, f[`${s}dvs`]);
    ivs[s] = checks.number(`${side} ${d} IVs`, f[`${s}ivs`]);

    if (s === 'hp') continue;

    const boost = stat === s ? p?.boosts : undefined;
    boosts[s] = checks.number(`${side} ${d} boosts`, boost, f[`${s}boosts`] as any);
  }

  // Boosts was specified without any EVs - attempt to infer what stat it was meant to boost
  // based on the move being used. BUG: This isn't correct for 'weird' moves, but this doesn't
  // need to be exhaustive - users have numerous ways they can be more explicit here
  if (!stat && p?.boosts) {
    const m = gen.moves.get(move);
    if (m) {
      const s = side === 'p1'
        ? (m.category === 'Physical' ? 'atk' : 'spa')
        : ((m.defensiveCategory ?? m.category) === 'Physical' ? 'def' : 'spd');
      boosts[s] = checks.number(`${side} ${s} boosts`, `${p?.boosts}`, f[`${s}boosts`]);
    } else {
      checks.error(true, `Ambiguous boosts ${p?.boosts} for ${side}`);
    }
  }

  const pokemon = State.createPokemon(gen, name, {
    level: checks.number(`${side} level`, p?.level, f.level as unknown),
    item: checks.conflict(`${side} item`, p?.item, f.item),
    ability: f.ability,
    gender,
    happiness: checks.number(`${side} happiness`, f.happiness),
    hp: checks.number(`${side} HP`, f.hp),
    nature,
    evs,
    ivs,
    dvs,
    boosts,
    status: f.status,
    statusData: f.toxiccounter
      ? {toxicTurns: checks.number(`${side} toxic counter`, f.toxiccounter)}
      : undefined,
    volatiles: fillConditions('Volatile Status'),
  }, move);

  return State.createSide(gen, pokemon, {sideConditions});
}

function asBoolean(s: string) {
  const id = toID(s);
  if (is(id, 'true', '1', 'yes', 'y')) return true;
  if (is(id, 'false', '0', 'no', 'n')) return false;
  throw new TypeError(`Invalid boolean flag value: ${s}`);
}

function toContext(flags: Flags) {
  const field: {[k: string]: unknown} = {...flags.field};
  if (Object.keys(flags.field[_]).length) field._ = flags.field[_];
  const p1: {[k: string]: unknown} = {...flags.p1};
  if (Object.keys(flags.p1[_]).length) p1._ = flags.p1[_];
  const p2: {[k: string]: unknown} = {...flags.p2};
  if (Object.keys(flags.p2[_]).length) p2._ = flags.p2[_];
  // TODO: as Context['flags']['output'];
  return {general: flags.general, field, p1, p2, move: flags.move} as any;
}

// https://github.com/mccormicka/string-argv v0.3.0
// MIT License Copyright 2014 Anthony McCormick

// matches nested quotes until the first space outside of quotes:
//  ([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*)
// or match if not a space ' or "
//   [^\s'"]+
// or match "quoted text" without quotes
//   (['"])([^\5]*?)\5
// `\3` and `\5` are a backreference to the quote style (' or ") captured
const TOKENIZE = /([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*)|[^\s'"]+|(['"])([^\5]*?)\5/gi;

function tokenize(s: string): string[] {
  const args: string[] = [];

  let match: RegExpExecArray | null;
  do {
    // Each call to exec returns the next regex match as an array
    match = TOKENIZE.exec(s);
    if (match !== null) {
      // Index 1 in the array is the captured group if it exists
      // Index 0 is the matched text, which we use if no captured group exists
      args.push(firstString(match[1], match[6], match[0])!);
    }
  } while (match !== null);

  return args;
}

// Accepts any number of arguments, and returns the first one that is a string (even empty string)
function firstString(...args: Array<any>): string | undefined {
  for (const arg of args) {
    if (typeof arg === 'string') return arg;
  }
}
