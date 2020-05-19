import { toID, Generations, GenerationNum, ID, Generation, NatureName, GameType } from '@pkmn/data';
import {getCondition, WeatherName, TerrainName} from './conditions';

import {State} from './state';
import {decodeURL} from './encode';

// Flags can either be specified as key:value or as 'implicits'
const FLAG =
  /^(?:(?:--?)?(\w+)(?:=|:)([-+0-9a-zA-Z_'", ]+))|((?:-|\+)[a-zA-Z'"][0-9a-zA-Z_'", ]+)$/;
type Flags = {[id: string]: string};

const PHRASE = new RegExp([
  // Attacker Boosts
  /^(?:((?:\+|-)[1-6])?\s+)?/,
  // Attacker EVs
  /(?:(\d{1,3}(?:\+|-)?\s*(?:SpA|Atk))?\s+)?/,
  // Attacker Pokemon (@ Attacker Item)?
  /(?:([A-Za-z][-0-9A-Za-z' ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)/,
  // Move
  /\s*\[([-0-9A-Za-z' ]+)\]\s+vs\.?\s+/,
  // Defender Boosts
  /(?:((?:\+|-)[1-6])?\s+)?/,
  // Defender EVs
  /(?:(\d{1,3}\s*HP)?\s*\/?\s*(\d{1,3}(?:\+|-)?\s*(?:SpD|Def))?\s+)?/,
  // Defender Pokemon (@ Defender Item)?
  /(?:([A-Za-z][-0-9A-Za-z' ]+)(?:\s*@\s*([A-Za-z][-0-9A-Za-z' ]+))?)$/
].map(r => r.source).join(''), 'i');

const QUOTED = /^['"].*['"]$/;

interface Phrase {
  attacker: ID;
  defender: ID;
  move: ID;

  attackerBoost?: number;
  attackerNature?: '+' | '-';
  attackerEVs?: {atk?: number; spa?: number};
  attackerItem?: ID;

  defenderBoost?: number;
  defenderNature?: '+' | '-';
  defenderEVs?: {hp?: number; def?: number; spd?: number};
  defenderItem?: ID;
}

const BOUNDS: {[key: string]: [number, number]} = {
  level: [0, 100],
  evs: [0, 252],
  ivs: [0, 31],
  dvs: [0, 15],
  gen: [1, 7],
  boosts: [-6, 6],
  toxicCounter: [0, 15],
};

export function parse(gens: Generations, s: string, strict = false) {
  const argv = tokenize(decodeURL(s));
  // const argv = tokenize(s);

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


  // return build(gens, parsed, flags, context, strict);
  return {phrase, flags} as unknown as State; // FIXME
}

function parsePhrase(s: string) {
  const m = PHRASE.exec(s);
  if (!m) return undefined;

  const phrase: Phrase = {
    attacker: toID(m[3]),
    defender: toID(m[9]),
    move: toID(m[5]),

    attackerBoost: parseInt(m[1]) || undefined,
    attackerItem: toID(m[4]) || undefined,

    defenderBoost: parseInt(m[6]) || undefined,
    defenderItem: toID(m[10]) || undefined,
  };

  if (m[2]) {
    phrase.attackerNature = m[2].includes('+') ? '+' : m[2].includes('-') ? '-' : undefined;
    phrase.attackerEVs = {};
    phrase.attackerEVs[toID(m[2]).endsWith('atk') ? 'atk' : 'spa'] = parseInt(m[2]) || undefined;
  }
  if (m[7]) phrase.defenderEVs = {hp: parseInt(m[7]) || undefined};
  if (m[8]) {
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
    if (isNaN(n) || n < 1 || n > 8) {
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
    const c = getCondition(gen, flags.weather);
    if (!c) {
      invalid('weather', flags.weather);
    } else {
      field.weather = {name: c[1] as WeatherName};
    }
  }
  if (flags.terrain) {
    const c = getCondition(gen, flags.terrain);
    if (!c) {
      invalid('terrain', flags.terrain);
    } else {
      field.terrain = {name: c[1] as TerrainName};
    }
  }

  // TODO implicits!

  return field;
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