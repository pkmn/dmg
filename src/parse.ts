import type {Generations, GenerationNum, ID, Generation, GameType} from '@pkmn/data';

import {Conditions, WeatherName, TerrainName, ConditionKind} from './conditions';
import {State, bounded} from './state';
import {decodeURL} from './encode';
import {is, toID} from './utils';

// Flags can either be specified as key:value or as 'implicits'
// eslint-disable-next-line max-len
const FLAG = /^(?:(?:--?)?(\w+)(?:=|:)([-+0-9a-zA-Z_'’",:= ]+))|((?:--?|\+)[a-zA-Z'’"][-+0-9a-zA-Z_'’",:= ]+)$/;
const SPLIT_SUBFLAG = /[^0-9a-zA-Z_'’":= ]/;

const _ = Symbol('_');
interface Flags {
  general: {[id: string]: string};
  field: {[id: string]: string} & {[_]: {[k in ConditionKind]?: {[id: string]: string}}};
  p1: {[id: string]: string} & {[_]: {[k in ConditionKind]?: {[id: string]: string}}};
  p2: {[id: string]: string} & {[_]: {[k in ConditionKind]?: {[id: string]: string}}};
  move: {[id: string]: string};
}

const PHRASE = new RegExp([
  // Attacker Boosts
  /^(?:((?:\+|-)[1-6])?\s+)?/, // 1
  // Attacker Level
  /(?:Lvl?\s*(\d{1,2})\s+)?/, // 2
  // Attacker EVs
  /(?:(\d{1,3}(?:\+|-)?\s*(?:SpA|Atk))?\s+)?/, // 3
  // Attacker Pokemon (@ Attacker Item)?
  /(?:([A-Za-z][-0-9A-Za-z'’. ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)/, // 4 & 5
  // Move
  /\s*\[([-0-9A-Za-z', ]+)\]\s+vs\.?\s+/, // 6
  // Defender Boosts
  /(?:((?:\+|-)[1-6])?\s+)?/, // 7
  // Defender Level
  /(?:Lvl?\s*(\d{1,2})\s+)?/, // 8
  // Defender EVs
  /(?:(\d{1,3}\s*HP)?\s*\/?\s*(\d{1,3}(?:\+|-)?\s*(?:SpD|Def))?\s+)?/, // 9 & 10
  // Defender Pokemon (@ Defender Item)?
  /(?:([A-Za-z][-0-9A-Za-z'’. ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)$/, // 11 & 12
].map(r => r.source).join(''), 'i');

const QUOTED = /^['"].*['"]$/;

interface Phrase {
  attacker: ID;
  defender: ID;
  move: ID;
  // Attacker
  attackerBoost?: number;
  attackerLevel?: number;
  attackerNature?: '+' | '-';
  attackerEVs?: {atk?: number; spa?: number};
  attackerItem?: ID;
  // Defender
  defenderBoost?: number;
  defenderLevel?: number;
  defenderNature?: '+' | '-';
  defenderEVs?: {hp?: number; def?: number; spd?: number};
  defenderItem?: ID;
}

export function parse(gens: Generation | Generations, s: string, strict = false) {
  const argv = tokenize(decodeURL(s));

  const raw: Array<[ID, string]> = [];
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
      const n = Number(val);
      if (isNaN(n) || !bounded('gen', n)) {
        if (strict) throw new Error(`Invalid generation flag '${val}'`);
      } else if ((strict || 'num' in gens) && g && g !== n) {
        throw new Error(`Conflicting values for flag '${id}': '${g}' vs. '${val}'`);
      } else {
        g = n as GenerationNum;
      }
      continue;
    }
    raw.push([id, val]);
  }

  const gen = 'num' in gens ? gens : gens.get(g || 8);
  const flags = parseFlags(gen, raw, strict);
  const phrase = fragments.join(' ');
  const context = JSON.stringify({phrase, flags});

  const parsed = phrase ? parsePhrase(phrase) : undefined;
  if (phrase && !parsed && strict) {
    throw new Error(`Unable to parse phrase: '${phrase}': ${context}`);
  }

  // FIXME return build(gen, parsed, flags, context, strict);
  return {phrase, flags} as unknown as State;
}

const UNAMBIGUOUS: {[id: string]: keyof Flags} = {
  gametype: 'general', doubles: 'general', singles: 'general',
  weather: 'field', terrain: 'field',
  move: 'move', usez: 'move', usemax: 'move', crit: 'move', hits: 'move',
};

const CONDITIONS: {[id: string]: ConditionKind} = {
  pseudoweather: 'Pseudo Weather',
  sidecondition: 'Side Condition',
  sideconditions: 'Side Condition',
  volatile: 'Volatile Status',
  volatiles: 'Volatile Status',
  volatilestatus: 'Volatile Status',
  status: 'Status',
};

function parseFlags(gen: Generation, raw: Array<[ID, string]>, strict: boolean) {
  const flags: Flags = {general: {}, field: {[_]: {}}, p1: {[_]: {}}, p2: {[_]: {}}, move: {}};

  const checkConflict = (k: keyof Flags, id: ID, val: string) => {
    if (strict && flags[k][id] && flags[k][id] !== val) {
      throw new Error(`Conflicting values for flag '${id}': '${flags[k][id]}' vs. '${val}'`);
    }
  };

  for (let [id, val] of raw) {
    // Currently safe because no implicits start with 'is' or 'has'. Technically this prefix is
    // only allowed on boolean parameters, but it's not really worth the effort to be strict here
    if (id.startsWith('is') || id.startsWith('has')) id = id.slice(2) as ID;

    // TODO no = > '0' instead of 1?

    if (UNAMBIGUOUS[id]) {
      if (is(id, 'singles', 'doubles')) {
        val = id;
        id = 'gametype' as ID;
      }
      const type = UNAMBIGUOUS[id];
      checkConflict(type, id, val);
      flags[type][id] = val;
    } else if (id === 'pseudoweather') {
      parseConditionFlag(gen, flags, val, strict, 'field', 'Pseudo Weather');
    } else if (id === 'attacker' || id === 'p1') {
      parseConditionFlag(gen, flags, val, strict, 'p1');
    } else if (id === 'defender' || id === 'p2') {
      parseConditionFlag(gen, flags, val, strict, 'p2');
    } else if (id.startsWith('attacker') || id.startsWith('p1')) {
      id = id.slice(id.charAt(0) === 'p' ? 2 : 8) as ID;
      if (CONDITIONS[id]) {
        parseConditionFlag(gen, flags, val, strict, 'p1', CONDITIONS[id]);
        continue;
      }
      checkConflict('p1', id, val);
      flags.p1[id] = val;
    } else if (id.startsWith('defender') || id.startsWith('p2')) {
      id = id.slice(id.charAt(0) === 'p' ? 2 : 8) as ID;
      if (CONDITIONS[id]) {
        parseConditionFlag(gen, flags, val, strict, 'p2', CONDITIONS[id]);
        continue;
      }
      checkConflict('p2', id, val);
      flags.p2[id] = val;
      continue;
    } else {
      parseConditionFlag(gen, flags, `${id}=${val}`, strict);
    }
  }

  return flags;
}

// TODO: handle no/is/has here
function parseFlag(arg: string): [ID, string] | undefined {
  const m = FLAG.exec(arg);
  if (!m) return undefined;
  return m[3] ? [toID(m[3]), '1'] : [toID(m[1]), QUOTED.test(m[2]) ? m[2].slice(1, -1) : m[2]];
}

const FIELD_CONDITIONS: ConditionKind[] = ['Weather', 'Terrain', 'Pseudo Weather'];

function parseConditionFlag(
  gen: Generation,
  flags: Flags,
  s: string,
  strict: boolean,
  scope?: 'p1' | 'p2' | 'field',
  kind?: ConditionKind
) {
  const raw = s.split(SPLIT_SUBFLAG).filter(x => x);
  if (strict && !raw.length) {
    const k = kind ? `${kind} ` : '';
    throw new Error(`Expected '${s}' to contain ${k}conditions but found none`);
  }
  for (const arg of raw) {
    const parsed = parseFlag(arg);
    if (!parsed) throw new Error(`Unable to parse '${arg}' as a flag for a condition from '${s}'`);
    let [id, val] = parsed;

    const condition = Conditions.get(gen, id);
    if (!condition) {
      if (strict) throw new Error(`Unrecognized or invalid condition '${id}' from '${s}'`);
      continue;
    }

    const name = condition[0];
    if (kind && kind !== condition[1]) {
      throw new Error(`Mismatched kind for condition '${name}': '${kind}' vs. '${condition[1]}'`);
    }
    kind = condition[1];
    scope = scope ?? condition[2];
    if (!scope) throw new Error(`Ambiguous implicit condition '${id}`);

    const isField = FIELD_CONDITIONS.includes(kind);
    if ((isField && scope !== 'field') || (!isField && scope === 'field')) {
      throw new Error(`Mismatched scope for condition '${name}'`);
    }

    if (kind === 'Weather' || kind === 'Terrain') {
      id = toID(kind);
      val = toID(name);
      if (strict && flags.field[id] && flags.field[id] !== val) {
        throw new Error(`Conflicting values for flag '${id}': '${flags.field[id]}' vs. '${val}'`);
      }
      flags.field[id] = val;
      continue;
    }

    id = toID(name);
    const conditions = flags[scope][_][kind] = (flags[scope][_][kind] || {});

    if (strict && conditions[id] && conditions[id] !== val) {
      throw new Error(`Conflicting values for condition '${id}': '${conditions[id]}' vs. '${val}'`);
    }
    conditions[id] = val;
  }
}

function parsePhrase(s: string) {
  const m = PHRASE.exec(s);
  if (!m) return undefined;

  const phrase: Phrase = {
    attacker: toID(m[5]),
    defender: toID(m[11]),
    move: toID(m[6]),

    attackerBoost: parseInt(m[1]) || undefined,
    attackerLevel: parseInt(m[2]) || undefined,
    attackerItem: toID(m[5]) || undefined,

    defenderBoost: parseInt(m[7]) || undefined,
    defenderLevel: parseInt(m[8]) || undefined,
    defenderItem: toID(m[12]) || undefined,
  };

  if (m[3]) {
    phrase.attackerNature = m[2].includes('+') ? '+' : m[2].includes('-') ? '-' : undefined;
    phrase.attackerEVs = {};
    phrase.attackerEVs[toID(m[2]).endsWith('atk') ? 'atk' : 'spa'] = parseInt(m[2]) || undefined;
  }
  if (m[9]) phrase.defenderEVs = {hp: parseInt(m[7]) || undefined};
  if (m[10]) {
    phrase.defenderNature = m[8].includes('+') ? '+' : m[8].includes('-') ? '-' : undefined;
    phrase.defenderEVs = phrase.defenderEVs || {};
    phrase.defenderEVs[toID(m[8]).endsWith('def') ? 'def' : 'spd'] = parseInt(m[7]) || undefined;
  }

  return phrase;
}

function build(
  gen: Generation,
  phrase: Phrase | undefined,
  flags: Flags,
  context: string,
  strict: boolean
) {
  const invalid = (k: string, v: any) => {
    if (strict) {
      throw new Error(`Unsupported or invalid ${k} '${v}' for generation ${gen.num} (${context})`);
    }
  };

  let gameType: GameType = 'singles';
  if (flags.general.gametype) {
    const gt = flags.general.gametype;
    if (!(gt === 'singles' || gt === 'doubles') || gen.num <= 2 && gt === 'doubles') {
      invalid('game type', flags.general.gametype);
    } else {
      gameType = gt;
    }
  }

  const field = buildField(gen, flags, invalid);

  // TODO: strictness about unused!
  return {gameType, gen, field} as State; // TODO
}

function buildField(
  gen: Generation,
  flags: Flags,
  invalid: (key: string, val: any) => void
) {
  const field: State.Field = {pseudoWeather: {}};

  if (flags.field.weather) {
    const c = Conditions.get(gen, flags.field.weather);
    if (!c) {
      invalid('weather', flags.field.weather);
    } else {
      field.weather = c[1] as WeatherName;
    }
  }
  if (flags.field.terrain) {
    const c = Conditions.get(gen, flags.field.terrain);
    if (!c) {
      invalid('terrain', flags.field.terrain);
    } else {
      field.terrain = c[1] as TerrainName;
    }
  }
  // TODO what about turning pseudo weather off?
  if (flags.field[_]['Pseudo Weather']) {
    for (const id in flags.field[_]['Pseudo Weather']) {
      field.pseudoWeather[id] = {};
    }
  }

  return field;
}

// FIXME normalize everything as '1' or '0'?
function asBoolean(s: string) {
  const id = toID(s);
  if (is(id, 'true', '1', 'yes', 'y')) return true;
  if (is(id, 'false', '0', 'no', 'n')) return false;
  throw new TypeError(`Invalid boolean flag value: ${s}`);
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
