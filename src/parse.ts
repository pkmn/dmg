import { toID, Generations, GenerationNum, ID, Generation,  GameType } from '@pkmn/data';
import { Conditions, WeatherName, TerrainName } from './conditions';

import { State, bounded } from './state';
import { decodeURL } from './encode';
import { is } from './utils';

// Flags can either be specified as key:value or as 'implicits'
const FLAG =
  /^(?:(?:--?)?(\w+)(?:=|:)([-+0-9a-zA-Z_'’",= ]+))|((?:--?|\+)[a-zA-Z'’"][-+0-9a-zA-Z_'’",= ]+)$/;

type Flags = {
  general: {[id: string]: string},
  field: {[id: string]: string},
  p1: {[id: string]: string},
  p2: {[id: string]: string},
  move: {[id: string]: string},
};

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
  /(?:([A-Za-z][-0-9A-Za-z'’. ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)$/ // 11 & 12
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

export function parse(gen: Generation, s: string, strict?: boolean): State;
export function parse(gens: Generations, s: string, strict?: boolean): State;
export function parse(gens: Generation | Generations, s: string, strict = false) {
  const argv = tokenize(decodeURL(s));

  const raw: Array<[ID, string]> = [];
  const fragments: string[] = [];

  // Because disambiguating implicits depends on the generation (boo!) we must make two passes over
  // the args - once to clean them up and figure out the ordering while determining which gen to
  // use, followed by
  let g: GenerationNum | undefined = 'num' in gens ? gens.num : undefined;
  for (const arg of argv) {
    let m = FLAG.exec(arg);
    if (m) {
      let id: ID;
      let val: string;
      if (m[3]) {
        id = toID(m[3]);
        raw.push([id, '1']);
      } else {
        id = toID(m[1]);
        val = QUOTED.test(m[2]) ? m[2].slice(1, -1) : m[2];

        if (id === 'gen') {
          const n = Number(val);
          if (isNaN(n) || !bounded('gen', n)) {
            if (strict) throw new Error(`Invalid generation flag '${val}'`);
          } else if ((strict || 'num' in gens) && g && g !== n) {
            throw new Error(`Conflicting values for flag '${id}': '${g}' vs. '${val}'`);
          } else {
            g = n as GenerationNum;
          }
        } else {
          raw.push([id, val]);
        }
      }
    } else {
      fragments.push(arg);
    }
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

const UNAMBIGUOUS = [
  'gametype', 'weather', 'terrain', 'pseudoweather',
  'move', 'useZ', 'useMax', 'crit', 'hits',
] as ID[];

function parseFlags(gen: Generation, raw: Array<[ID, string]>, strict: boolean) {
  const flags: Flags = {general: {}, field: {}, p1: {}, p2: {}, move: {}};

  const checkConflict = (k: keyof Flags, id: ID, val: string) => {
    if (strict && flags[k][id] && flags[k][id] !== val) {
      throw new Error(`Conflicting values for flag '${id}': '${flags[k][id]}' vs. '${val}'`);
    }
  };

  for (let [id, val] of raw) {
    // Currently safe because no implicits start with 'is' or 'has'. Technically this prefix is
    // only allowed on boolean parameters, but it's not really worth the effort to be strict here
    if (id.startsWith('is') || id.startsWith('has')) id = id.slice(2) as ID;
    if (id.startsWith('attacker') || id.startsWith('defender') || is(id, UNAMBIGUOUS)) {
      checkConflict(id, val);
      flags[id] = val;
      continue;
    }

    const condition = Conditions.get(gen, id);
    if (!condition) {
      if (strict) new Error(`Unrecognized or invalid implicit condition '${id}'`);
      continue;
    }
    const [name, kind, scope] = condition;
    if (!scope) throw new Error(`Ambiguous implicit condition '${id}`);
    if (scope === 'field') {
      const id = toID(kind);
      if (kind === 'Pseudo Weather') {
        flags[id] = `${flags[id]},${toID(name)}`
      } else {
        checkConflict(id, val);
        flags[id] = name;
      }
    } else if (scope === 'p1') { // XXX spikes:3
      flags.attacker = `${flags.atttacker},${toID(name)}`;
    } else {
      flags.defender = `${flags.defender},${toID(name)}`;
    }
  }

  return flags;
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
  // TODO conflict

  let gameType: GameType = 'singles';
  if (flags.gametype) {
    const gt = flags.gametype;
    if (!(gt === 'singles' || gt === 'doubles') || gen.num <= 2 && gt === 'doubles') {
      invalid('game type', flags.gametype);
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

  // TODO implicits!

  return field;
}


function categorizeConditions(gen: Generation, conditions: string, strict: boolean) {
  for (const c of conditions.split(/\W/)) {
    const id = toID(c);
    if (!id) continue;
    const condition = Conditions.get(gen, id);
    if (!condition) {
      if (strict) new Error(`Unrecognized or invalid condition '${id}'`);
      continue;
    }
    const [name, kind, scope] = condition;
    /// XXX spikes: 3
  }
}

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
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === "string") {
      return arg;
    }
  }
}