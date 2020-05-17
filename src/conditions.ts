import {GenerationNum, toID, ID, StatusName, Generation} from '@pkmn/data';

export type ConditionName =
  WeatherName | TerrainName | PseudoWeatherName |
  SideConditionName |
  VolatileStatusName | StatusName;

export type ConditionKind =
  'Weather' | 'Terrain' | 'Pseudo Weather' |
  'Side Condition' | // 'Slot Condition' |
  'Volatile Status' | 'Status';

const ALIASES: {[id: string]: string}  = {
  // Weather
  sandstorm: 'sand',
  sunnyday: 'sun',
  raindance: 'rain',
  desolateland: 'hashsunshine',
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
  sleep: 'slp',
  asleep: 'slp',
  poison: 'psn',
  poisoned: 'psn',
  burn: 'brn',
  burned: 'brn',
  freeze: 'frz',
  frozen: 'frz',
  paralysis: 'par',
  paralyzed: 'par',
  toxic: 'tox',
  badpoisoned: 'tox',
  badlypoisoned: 'tox',
};

// TODO also return the handler?
export function getCondition(
  gen: Generation,
  name: string
): [ConditionName, ConditionKind] | undefined {
  let id = toID(name);
  id = ALIASES[id] as ID || id;

  let condition: [ConditionName, GenerationNum];

  // Field Conditions
  if ((condition = Weathers[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Weather'];
  } else if ((condition = Terrains[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Terrain'];
  } else if ((condition = PseudoWeathers[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Pseudo Weather'];
  }

  // Side Conditions
  if ((condition = SideConditions[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Pseudo Weather'];
  }

  // Pokemon Conditions
  if ((condition = Volatiles[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Volatile Status'];
  } else if (id in Statuses) {
    return [id as StatusName, 'Status'];
  }

  return undefined;
}

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
  'Mud Sport' | 'Water Sport' |
  'Trick Room' | 'Magic Room' | 'Wonder Room';

 export const PseudoWeathers: {[id: string]: [PseudoWeatherName, GenerationNum]} = {
   gravity: ['Gravity', 4],
   fairylock: ['Fairy Lock', 6],
   iondeluge: ['Ion Deluge', 6],
   trickroom: ['Trick Room', 4],
   magicroom: ['Magic Room', 5],
   wonderroom: ['Wonder Room', 5],
  // NOTE: Before Gen 6 these were treated as volatiles
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

 export const SideConditions: {[id: string]: [SideConditionName, GenerationNum]} = {
  tailwind: ['Tailwind', 4],
  stealthrock: ['Stealth Rock', 4],
  spikes: ['Spikes', 2],
  toxicspikes: ['Toxic Spikes', 4],
  auroraveil: ['Aurora Veil', 7],
  safeguard: ['Safeguard', 2],
  wideguard: ['Wide Guard', 5],
  quickguard: ['Quick Guard', 5],
  steelsurge: ['Steelsurge', 8],
  volcalith: ['Volcalith', 8],
  wildfire: ['Wildfire', 8],
  craftyshield: ['Crafty Shield', 6],
  mist: ['Mist', 6],
  sitckyweb: ['Sticky Web', 6],
  // NOTE: Before Gen 6 these were treated as a volatiles
  lightscreen: ['Light Screen', 2],
  reflect: ['Reflect', 2],
 };

// Volatile Status

export type VolatileStatusName =
  'Slow Start' | 'Unburden' | 'Zen Mode' | 'Flash Fire' | 'Parental Bond' | 'Charge' |
  'Leech Seed' | 'Beak Blast' | 'Stall' | 'Gastro Acid' | 'Aqua Ring' | 'Magnet Rise' |
  'Autotomize' | 'Curse' | 'Baneful Bunker' | 'Defense Curl' | 'Protect' | 'Electrify' |
  'Foresight' | 'Helping Hand' | 'Ingrain' | "King's Shield" | 'Max Guard' | 'Dynamax' |
  'Miracle Eye' | 'Minimize' | 'Obstruct' | 'Octolock' | 'Roost' | 'Smack Down' | 'Spiky Shield' |
  'Stockpile' | 'Tar Shot' | 'Uproar' | 'Light Screen' | 'Reflect' | 'Mud Sport' | 'Water Sport';

export const Volatiles: {[id: string]: [VolatileStatusName, GenerationNum]} = {
  slowstart: ['Slow Start', 4],
  unburden: ['Unburden', 4],
  zenmode: ['Zen Mode', 5],
  flashfire: ['Flash Fire', 3],
  parentalbond: ['Parental Bond', 6],
  charge: ['Charge', 3],
  leechseed: ['Leech Seed', 1],
  beakblast: ['Beak Blast', 7],
  stall: ['Stall', 3],
  gastroacid: ['Gastro Acid', 4],
  aquaring: ['Aqua Ring', 4],
  magnetrise: ['Magnet Rise', 4],
  autotomize: ['Autotomize', 5],
  curse: ['Curse', 2],
  banefulbunker: ['Baneful Bunker', 7],
  defensecurl: ['Defense Curl', 2],
  protect: ['Protect', 2],
  electrify: ['Electrify', 6],
  foresight: ['Foresight', 2],
  helpinghand: ['Helping Hand', 3],
  ingrain: ['Ingrain', 3],
  kingsshield: ["King's Shield", 6],
  maxguard: ['Max Guard', 8],
  dynamax: ['Dynamax', 8],
  miracleeye: ['Miracle Eye', 4],
  minimize: ['Minimize', 1],
  obstruct: ['Obstruct', 8],
  octolock: ['Octolock', 8],
  roost: ['Roost', 4],
  smackdown: ['Smack Down', 5],
  spikyshield: ['Spiky Shield', 6],
  stockpile: ['Stockpile', 3],
  tarshot: ['Tar Shot', 3],
  uproar: ['Uproar', 3],
  // NOTE: These changed to Pseudo Weathers and Side Conditions respectively in later generations
  mudsport: ['Mud Sport', 3],
  watersport: ['Water Sport', 3],
  lightscreen: ['Light Screen', 1],
  reflect: ['Reflect', 1],
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