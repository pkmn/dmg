import { toID, Generations, GenerationNum, ID, Generation, NatureName, GameType } from '@pkmn/data';
import {Conditions, WeatherName, TerrainName} from './conditions';

import {State, bounded} from './state';
import {decodeURL} from './encode';

// Flags can either be specified as key:value or as 'implicits'
const FLAG =
  /^(?:(?:--?)?(\w+)(?:=|:)([-+0-9a-zA-Z_'’", ]+))|((?:--?|\+)[a-zA-Z'’"][0-9a-zA-Z_'’", ]+)$/;
type Flags = {[id: string]: string};

const PHRASE = new RegExp([
  // Attacker Boosts
  /^(?:((?:\+|-)[1-6])?\s+)?/, // 1
  // Attacker Level
  /(?:Lvl?\s*(\d{1,2})\s+)?/, // 2
  // Attacker EVs
  /(?:(\d{1,3}(?:\+|-)?\s*(?:SpA|Atk))?\s+)?/, // 3
  // Attacker Pokemon (@ Attacker Item)?
  /(?:([A-Za-z][-0-9A-Za-z'’ ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)/, // 4 & 5
  // Move
  /\s*\[([-0-9A-Za-z', ]+)\]\s+vs\.?\s+/, // 6
  // Defender Boosts
  /(?:((?:\+|-)[1-6])?\s+)?/, // 7
  // Defender Level
  /(?:Lvl?\s*(\d{1,2})\s+)?/, // 8
  // Defender EVs
  /(?:(\d{1,3}\s*HP)?\s*\/?\s*(\d{1,3}(?:\+|-)?\s*(?:SpD|Def))?\s+)?/, // 9 & 10
  // Defender Pokemon (@ Defender Item)?
  /(?:([A-Za-z][-0-9A-Za-z'’ ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)$/ // 11 & 12
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

export function parse(gens: Generations, s: string, strict = false) {
  const argv = tokenize(decodeURL(s));

  const flags: Flags = {};
  const fragments: string[] = [];
  for (const arg of argv) {
    let m = FLAG.exec(arg)
    if (m) {
      let id: ID;
      let val: string;
      if (m[3]) {
        id = toID(m[3]);
        val = '1';
      } else {
        id = toID(m[1]);
        val = QUOTED.test(m[2]) ? m[2].slice(1, -1) : m[2];
      }
      if (strict && flags[id] && flags[id] !== val) {
        throw new Error(`Conflicting values for flag '${id}': '${flags[id]}' vs. '${val}'`);
      }
      flags[id] = val;
    } else {
      fragments.push(arg);
    }
  }
  const phrase = fragments.join(' ');
  const context = JSON.stringify({phrase, flags});

  const parsed = phrase ? parsePhrase(phrase) : undefined;
  if (phrase && !parsed && strict) {
    throw new Error(`Unable to parse phrase: '${phrase}': ${context}`);
  }


  // FIXME return build(gens, parsed, flags, context, strict);
  return {phrase, flags} as unknown as State;
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
  gens: Generations,
  phrase: Phrase | undefined,
  flags: Flags,
  context: string,
  strict: boolean
) {
  let g: GenerationNum = 8;
  if (flags.gen) {
    const n = Number(flags.gen);
    if (isNaN(n) || bounded('gen', n)) {
      if (strict) throw new Error(`Invalid generation '${flags.gen}': ${context}`);
    } else {
      g = n as GenerationNum;
    }
  }

  const gen = gens.get(g);

  const invalid = (key: string, val: any) => {
    if (strict) {
      throw new Error(`Unsupported or invalid ${key} '${val}' for generation ${g} (${context})`);
    }
  };
  // TODO conflict

  let gameType: GameType = 'singles';
  if (flags.gametype) {
    const gt = flags.gametype;
    if (!(gt === 'singles' || gt === 'doubles') || g <= 2 && gt === 'doubles') {
      invalid('game type', flags.gametype);
    } else {
      gameType = gt;
    }
  }

  const field = buildField(gen, flags, invalid);


  return {gameType, gen, field} as State; // TODO
}

function buildField(
  gen: Generation,
  flags: Flags,
  invalid: (key: string, val: any) => void
) {
  const field: State.Field = {};
  if (flags.weather) {
    const c = Conditions.get(gen, flags.weather);
    if (!c) {
      invalid('weather', flags.weather);
    } else {
      field.weather = c[1] as WeatherName;
    }
  }
  if (flags.terrain) {
    const c = Conditions.get(gen, flags.terrain);
    if (!c) {
      invalid('terrain', flags.terrain);
    } else {
      field.terrain = c[1] as TerrainName;
    }
  }

  // TODO implicits!

  return field;
}

function asBoolean(s: string) {
  const id = toID(s);
  if (['true', '1', 'yes', 'y'].includes(id)) return true;
  if (['false', '0', 'no', 'n'].includes(id)) return false;
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