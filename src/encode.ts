import { State } from './state';
import { is } from './utils';

const FORWARD = {'/': '$', '[': '(', ']': ')', '@': '*', ':': '=', ' ': '_'};
const BACKWARD = {'\\$': '/', '\\(': '[', '\\)': ']', '\\*': '@', '=': ':', '_': ' '};

const ENCODE = new RegExp(Object.keys(FORWARD).join('|'), 'g');
const DECODE = new RegExp(Object.keys(BACKWARD).join('|'), 'g');

export function encodeURL(s: string) {
  return s.replace(ENCODE, match => FORWARD[match as keyof typeof FORWARD]);
}

export function decodeURL(s: string) {
  // Even though the encoding scheme is URL-safe, it's not impossible to imagine that someone might
  // have also called encodeURIComponent on it
  return decodeURIComponent(s).replace(DECODE, match => BACKWARD[match as keyof typeof BACKWARD]);
}

/**
 * Encodes `state`. Returns a string parseable by `parse` by default, but can alternatively return a
 * more human-friendly description (`'desc'`) or an a URL-safe one (`'url'`).
 */
export function encode(state: State, type: 'parse' | 'desc' | 'url' = 'parse') {
  const {gen, p1, p2, move, field} = state;

  if (move.category === 'Status') {
     // TODO use z/use max
    return `${p1.pokemon.species.name} [${move.name}] vs ${p2.pokemon.species.name}`;
  }


  const atkStat = move.category === 'Special' ? 'spa' : is(move.name, 'Body Press') ? 'def' : 'atk';
  const defStat = (move.defensiveCategory || move.category) === 'Special' ? 'spd' : 'def';
  if (is(move.name, 'Foul Play')) {

  }

  let s = '';   // TODO

  // TODO: handle makeing
  // prefer phrase, implicits

  return type === 'url' ? encodeURL(s) : s;
}