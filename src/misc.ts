// TODO obviously rename this file...

export type TerrainName =
  'Electric' | 'Grassy' | 'Psychic' | 'Misty';

export const Terrains: {[id: string]: TerrainName} = {
  electric: 'Electric', electricterrain: 'Electric',
  grassy: 'Grassy', grassyterrain: 'Grassy',
  psychic: 'Psychic', psychicterrain: 'Psychic',
  misty: 'Misty', mistyterrain: 'Misty',
};

export type WeatherName =
  'Sand' | 'Sun' | 'Rain' | 'Hail' |
  'Harsh Sunshine' | 'Heavy Rain' | 'Strong Winds';

export const Weathers: {[id: string]: WeatherName} = {
  sand: 'Sand',  sandstorm: 'Sand',
  sun: 'Sun', sunnyday: 'Sun',
  rain: 'Rain', raindance: 'Rain',
  hail: 'Hail',
  harshsunshine: 'Harsh Sunshine', desolateland: 'Harsh Sunshine',
  heavyrain: 'Heavy Rain', primordialsea: 'Heavy Rain',
  strongwinds: 'Strong Winds', deltastream: 'Strong Winds',
};

export type PseudoWeatherName =
  'Fairy Lock' | 'Gravity' | 'Ion Deluge' |
  'Mud Sport' | 'Water Sport' |
  'Trick Room' | 'Magic Room' | 'Wonder Room';

 export const PseudoWeathers: {[id: string]: PseudoWeatherName} = {
   gravity: 'Gravity',
   fairylock: 'Fairy Lock',
   iondeluge: 'Ion Deluge',
   mudsport: 'Mud Sport',
   watersport: 'Water Sport',
   trickroom: 'Trick Room',
   magicroom: 'Magic Room',
   wonderroom: 'Wonder Room',
 };

 export const SIDE_CONDITIONS: {[id: string]: number} = {
  tailwind: 1, stealthrock: 1, spikes: 3, toxicspikes: 2,
  auroraveil: 1, lightscreen: 1, reflect: 1,
  safeguard: 1, wideguard: 1, quickguard: 1,
  gmaxsteelsurge: 1, gmaxvolcalith: 1, gmaxwildfire: 1,
  craftyshield: 1, luckychant: 1, mist: 1, sitckyweb: 1,
 };

export const VOLATILES: {[id: string]: number} = {
  slowstart: 5, unburden: 1, zenmode: 1, flashfire: 1,
  parentalbond: 1,charge: 1, leechseed: 1, beakblast: 1,
  stall: 1, gastroacid: 1, aquaring: 1, magnetrise: 1,
  autotomize: -1, curse: 1, banefulbunker: 1, defensecurl: 1,
  protect: 1, electricify: 1, foresight: 1, helpinghand: 1,
  ingrain: 1, kingsshield: 1, maxguard: 1, dynamax: 1,
  miracleeye: 1, minimize: 1, obstruct: 1, octolock: 1,
  roost: 1, smackdown: 1, spikyshield: 1, stockpile: 3,
  tarshot: 1, uproar: 1, lightscreen: 1, reflect: 1,
  mudsport: 1, watersport: 1,
};