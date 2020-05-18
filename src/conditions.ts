import {GenerationNum, toID, ID, StatusName, Generation} from '@pkmn/data';

export type Player = 'p1' | 'p2';

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
): [ConditionName, ConditionKind, (Player | 'field')?] | undefined {
  let id = toID(name);
  id = ALIASES[id] as ID || id;

  let condition: [ConditionName, GenerationNum, Player?];

  // Field Conditions
  if ((condition = Weathers[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Weather', 'field'];
  } else if ((condition = Terrains[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Terrain', 'field'];
  } else if ((condition = PseudoWeathers[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Pseudo Weather', 'field'];
  }

  // Side Conditions
  if ((condition = SideConditions[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Side Condition', condition[2]!];
  }

  // Pokemon Conditions
  if ((condition = Volatiles[id]) && condition[1] >= gen.num) {
    return [condition[0], 'Volatile Status', condition[2]!];
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
  sitckyweb: ['Sticky Web', 6],
  // Before Gen 6 these were treated as a volatiles
  lightscreen: ['Light Screen', 2],
  reflect: ['Reflect', 2],
  // Not really relevant for damage
  toxicspikes: ['Toxic Spikes', 4, 'p2'],
  safeguard: ['Safeguard', 2, 'p2'],
  wideguard: ['Wide Guard', 5, 'p2'],
  quickguard: ['Quick Guard', 5, 'p2'],
  craftyshield: ['Crafty Shield', 6],
  mist: ['Mist', 6],
 };

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
  minimize: ['Minimize', 1, 'p1'],
  obstruct: ['Obstruct', 8, 'p2'],
  roost: ['Roost', 4, 'p2'],
  smackdown: ['Smack Down', 5, 'p2'],
  spikyshield: ['Spiky Shield', 6, 'p2'],
  stockpile: ['Stockpile', 3, 'p1'],
  tarshot: ['Tar Shot', 3, 'p2'],
  //These changed to Pseudo Weathers and Side Conditions respectively in later generations
  mudsport: ['Mud Sport', 3],
  watersport: ['Water Sport', 3],
  lightscreen: ['Light Screen', 1],
  reflect: ['Reflect', 1],
  // Noe really relevant for damage
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