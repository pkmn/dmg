import {ID, toID} from '@pkmn/data';
import * as I from './interface';

export type TerrainName = 'Electric' | 'Grassy' | 'Psychic' | 'Misty';

export const TERRAINS: {[id: string]: TerrainName} = {
  electric: 'Electric',
  electricterrain: 'Electric',
  grassy: 'Grassy',
  grassyterrain: 'Grassy',
  psychic: 'Psychic',
  psychicterrain: 'Psychic',
  misty: 'Misty',
  mistyterrain: 'Misty',
};

export type WeatherName =
  'Sand' | 'Sun' | 'Rain' | 'Hail' | 'Harsh Sunshine' | 'Heavy Rain' | 'Strong Winds';

export const WEATHERS: {[id: string]: WeatherName} = {
  sand: 'Sand',
  sandstorm: 'Sand',
  sun: 'Sun',
  sunnyday: 'Sun',
  rain: 'Rain',
  raindance: 'Rain',
  hail: 'Hail',
  harshsunshine: 'Harsh Sunshine',
  desolateland: 'Harsh Sunshine',
  heavyrain: 'Heavy Rain',
  primordialsea: 'Heavy Rain',
  strongwinds: 'Strong Winds',
  deltastream: 'Strong Winds',
};

export type PseudoWeatherName =
  'Fairy Lock' | 'Gravity' | 'Ion Deluge' |
  'Mud Sport' | 'Water Sport' |
  'Trick Room' | 'Magic Room' |  'Wonder Room';

 export const PSEUDO_WEATHERS: {[id: string]: PseudoWeatherName} = {
   gravity: 'Gravity',
   fairylock: 'Fairy Lock',
   iondeluge: 'Ion Deluge',
   mudsport: 'Mud Sport',
   watersport: 'Water Sport',
   trickroom: 'Trick Room',
   magicroom: 'Magic Room',
   wonderroom: 'Wonder Room',
 };

export class Field implements I.Field {
  readonly weather?: ID;
  readonly terrain?: ID;
  readonly pseudoWeather?: {[id: string]: unknown};

  constructor(field: I.Field = {}) {
    this.weather = field.weather && toID(WEATHERS[field.weather]) || undefined;
    this.terrain = field.terrain && toID(TERRAINS[field.terrain]) || undefined;
    this.pseudoWeather = field.pseudoWeather;
  }
}
