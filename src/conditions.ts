import type {GenerationNum, ID, StatusName, Generation} from '@pkmn/data';

import {toID, is} from './utils';

export type Player = 'p1' | 'p2';

export type ConditionName =
  WeatherName | TerrainName | PseudoWeatherName |
  SideConditionName |
  VolatileStatusName | StatusName;

export type ConditionKind =
  'Weather' | 'Terrain' | 'Pseudo Weather' |
  'Side Condition' | // 'Slot Condition' |
  'Volatile Status' | 'Status';

// This primarily exists to convert between Pokémon Showdown's names for these conditions
// (though also supports shortcuts) and the names used internally by the calculator.
const ALIASES: {[id: string]: string} = {
  // Weather
  sandstorm: 'sand',
  sunnyday: 'sun',
  raindance: 'rain',
  desolateland: 'harshsunshine',
  primordialsea: 'heavyrain',
  deltastream: 'strongwinds',
  // Terrain
  electricterrain: 'electric',
  grassyterrain: 'grassy',
  psychicterrain: 'psychic',
  mistyterrain: 'misty',
  // Side Condition
  sr: 'stealthrock',
  gmaxsteelsurge: 'steelsurge',
  gmaxvolcalith: 'volcalith',
  gmaxwildfire: 'wildfire',
  // Status
  sleep: 'slp', asleep: 'slp',
  poison: 'psn', poisoned: 'psn',
  burn: 'brn', burned: 'brn',
  freeze: 'frz', frozen: 'frz',
  paralysis: 'par', paralyzed: 'par',
  toxic: 'tox', badpoisoned: 'tox', badlypoisoned: 'tox',
};

/**
 * 'Conditions' is the umbrella term the calculator uses to refer to all of the various
 * conditions and statuses that can affect state. There are 3 broad categories of conditions:
 *
 *   - Field conditions (weather, terrain, 'pseudo weather')
 *   - Side conditions
 *   - Pokemon conditions (status, 'volatile' statuses)
 *
 * There is a 4th category of 'slot' conditions which are approximately side conditions but
 * only affect a particular slot on a given side, not the entire side (eg. Wish). There are
 * elided as irrelevant for our purposes.
 *
 * Pokémon Showdown treats everything as IDs, but UI's need a more human-friendly way of referencing
 * a specific condition (and, in fact, also needs to map these to a better representation in the
 * client - https://github.com/smogon/pokemon-showdown-client/blob/master/src/battle.ts). The names
 * in this file are mostly chosen based on `@smogon/calc` and Pokémon Showdown for familiarity,
 * though in most cases the name of the move or ability that causes the condition is used.
 */
export const Conditions = new class {
  /**
   * Similar to `Dex#getEffect` but restricted to conditions (so more like `Dex#getPureEffectByID`),
   * searches for a condition named `name` in the respective `gen` and returns the canonical name,
   * kind and optionally what its 'implict' scope is for the purposes of relevance to damage
   * calculations. `gen` is required because certain conditions change categories across generations
   * (Reflect/Light Screen, Mud/Water Sport), as well as to filter out conditions which were not
   * present in the provided generation. Like with other data-getters, this function also handles
   * resolving aliases.
   */
  get(
    gen: Generation,
    name: string
  ): [ConditionName, ConditionKind, (Player | 'field')?] | undefined {
    let id = toID(name);
    id = ALIASES[id] as ID || id;

    let condition: [ConditionName, GenerationNum, Player?];

    if ((is(id, 'mudsport', 'watersport') && gen.num <= 5) ||
        (is(id, 'reflect', 'lightscreen') && gen.num === 1)) {
      condition = Volatiles[id];
      return [condition[0], 'Volatile Status', condition[2]!];
    }

    // Field Conditions
    if ((condition = Weathers[id])) {
      return gen.num >= condition[1] ? [condition[0], 'Weather', 'field'] : undefined;
    } else if ((condition = Terrains[id])) {
      return gen.num >= condition[1] ? [condition[0], 'Terrain', 'field'] : undefined;
    } else if ((condition = PseudoWeathers[id])) {
      return gen.num >= condition[1] ? [condition[0], 'Pseudo Weather', 'field'] : undefined;
    }

    // Side Conditions
    if ((condition = SideConditions[id])) {
      return gen.num >= condition[1] ? [condition[0], 'Side Condition', condition[2]!] : undefined;
    }

    // Pokemon Conditions
    if ((condition = Volatiles[id])) {
      return gen.num >= condition[1]
        ? [condition[0], 'Volatile Status', condition[2]!]
        : undefined;
    } else if (id in Statuses) {
      return [id as StatusName, 'Status'];
    }

    return undefined;
  }
};

// Weather

export type WeatherName =
  'Sand' | 'Sun' | 'Rain' | 'Hail' |
  'Harsh Sunshine' | 'Heavy Rain' | 'Strong Winds';

export const Weathers: {[id: string]: [WeatherName, GenerationNum]} = {
  sand: ['Sand', 2],
  sun: ['Sun', 2],
  rain: ['Rain', 2],
  hail: ['Hail', 2],
  harshsunshine: ['Harsh Sunshine', 6],
  heavyrain: ['Heavy Rain', 6],
  strongwinds: ['Strong Winds', 6],
};

// Terrain

export type TerrainName =
  'Electric' | 'Grassy' | 'Psychic' | 'Misty';

export const Terrains: {[id: string]: [TerrainName, GenerationNum]} = {
  electric: ['Electric', 4],
  grassy: ['Grassy', 4],
  psychic: ['Psychic', 4],
  misty: ['Misty', 4],
};

// Pseudo Weather

export type PseudoWeatherName =
  'Fairy Lock' | 'Gravity' | 'Ion Deluge' |
  'Mud Sport' | 'Water Sport' | 'Echoed Voice' |
  'Trick Room' | 'Magic Room' | 'Wonder Room';

export const PseudoWeathers: {[id: string]: [PseudoWeatherName, GenerationNum]} = {
  gravity: ['Gravity', 4],
  fairylock: ['Fairy Lock', 6],
  iondeluge: ['Ion Deluge', 6],
  trickroom: ['Trick Room', 4],
  magicroom: ['Magic Room', 5],
  wonderroom: ['Wonder Room', 5],
  echoedvoice: ['Echoed Voice', 5],
  // Before Gen 6 these were treated as volatiles
  mudsport: ['Mud Sport', 6],
  watersport: ['Water Sport', 6],
};

// Side Condition

export type SideConditionName =
  'Tailwind' | 'Stealth Rock' | 'Spikes' | 'Toxic Spikes' |
  'Aurora Veil' | 'Light Screen' | 'Reflect' |
  'Safeguard' | 'Quick Guard' | 'Wide Guard' |
  'Steelsurge' | 'Volcalith' | 'Wildfire' |
  'Crafty Shield' | 'Lucky Chant' | 'Mist' | 'Sticky Web';

export const SideConditions: {[id: string]: [SideConditionName, GenerationNum, Player?]} = {
  tailwind: ['Tailwind', 4],
  stealthrock: ['Stealth Rock', 4, 'p2'],
  spikes: ['Spikes', 2, 'p2'],
  auroraveil: ['Aurora Veil', 7],
  steelsurge: ['Steelsurge', 8, 'p2'],
  volcalith: ['Volcalith', 8, 'p2'],
  wildfire: ['Wildfire', 8, 'p2'],
  stickyweb: ['Sticky Web', 6],
  // Before Gen 2 these were treated as a volatiles
  lightscreen: ['Light Screen', 2, 'p2'],
  reflect: ['Reflect', 2, 'p2'],
  // Not really relevant for damage
  toxicspikes: ['Toxic Spikes', 4, 'p2'],
  safeguard: ['Safeguard', 2, 'p2'],
  wideguard: ['Wide Guard', 5, 'p2'],
  quickguard: ['Quick Guard', 5, 'p2'],
  craftyshield: ['Crafty Shield', 6],
  mist: ['Mist', 6],
  // TODO lunardance luckychant waterpledge pursuit
};

// TODO Slot Condition futuremove wish healingwish

// Volatile Status

export type VolatileStatusName =
  'Slow Start' | 'Unburden' | 'Zen Mode' | 'Flash Fire' | 'Parental Bond' | 'Charge' |
  'Leech Seed' | 'Beak Blast' | 'Stall' | 'Gastro Acid' | 'Aqua Ring' | 'Magnet Rise' |
  'Autotomize' | 'Curse' | 'Baneful Bunker' | 'Defense Curl' | 'Protect' | 'Electrify' |
  'Foresight' | 'Helping Hand' | 'Ingrain' | "King's Shield" | 'Max Guard' | 'Dynamax' |
  'Miracle Eye' | 'Minimize' | 'Obstruct' | 'Octolock' | 'Roost' | 'Smack Down' | 'Spiky Shield' |
  'Stockpile' | 'Tar Shot' | 'Uproar' | 'Light Screen' | 'Reflect' | 'Mud Sport' | 'Water Sport';

export const Volatiles: {[id: string]: [VolatileStatusName, GenerationNum, Player?]} = {
  slowstart: ['Slow Start', 4, 'p1'],
  unburden: ['Unburden', 4],
  zenmode: ['Zen Mode', 5],
  flashfire: ['Flash Fire', 3, 'p1'],
  parentalbond: ['Parental Bond', 6, 'p1'],
  charge: ['Charge', 3],
  leechseed: ['Leech Seed', 1, 'p2'],
  stall: ['Stall', 3],
  gastroacid: ['Gastro Acid', 4],
  aquaring: ['Aqua Ring', 4, 'p2'],
  magnetrise: ['Magnet Rise', 4, 'p2'],
  autotomize: ['Autotomize', 5],
  curse: ['Curse', 2, 'p2'],
  banefulbunker: ['Baneful Bunker', 7, 'p2'],
  defensecurl: ['Defense Curl', 2, 'p1'],
  protect: ['Protect', 2, 'p2'],
  electrify: ['Electrify', 6, 'p1'],
  foresight: ['Foresight', 2, 'p1'],
  helpinghand: ['Helping Hand', 3, 'p1'],
  ingrain: ['Ingrain', 3, 'p2'],
  kingsshield: ["King's Shield", 6, 'p2'],
  maxguard: ['Max Guard', 8, 'p2'],
  dynamax: ['Dynamax', 8],
  miracleeye: ['Miracle Eye', 4, 'p2'],
  minimize: ['Minimize', 1, 'p2'],
  obstruct: ['Obstruct', 8, 'p2'],
  roost: ['Roost', 4, 'p2'],
  smackdown: ['Smack Down', 5, 'p2'],
  spikyshield: ['Spiky Shield', 6, 'p2'],
  stockpile: ['Stockpile', 3, 'p1'],
  tarshot: ['Tar Shot', 3, 'p2'],
  // These changed to Pseudo Weathers and Side Conditions respectively in later generations
  mudsport: ['Mud Sport', 3, 'p2'],
  watersport: ['Water Sport', 3, 'p2'],
  lightscreen: ['Light Screen', 1, 'p2'],
  reflect: ['Reflect', 1, 'p2'],
  // Not really relevant for damage
  beakblast: ['Beak Blast', 7, 'p1'],
  octolock: ['Octolock', 8, 'p2'],
  uproar: ['Uproar', 3, 'p1'],
};

// Status

export const Statuses: {[id in StatusName]: string} = {
  slp: 'Sleep',
  psn: 'Poison',
  brn: 'Burn',
  frz: 'Freeze',
  par: 'Paralysis',
  tox: 'Bad Poison',
};
