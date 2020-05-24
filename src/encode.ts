import {Result} from './result';
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
 * Encodes state. If passed a `Result`, the result will be simplified first based on its `relevant`
 * fields. Returns a string parseable by `parse` by default (which can then be made URL-safe with
 * `encodeURL`), but can alternatively return the more human-friendly description format.
 */
export function encode(result: State | Result, desc = false) {
  const {gen, p1, p2, move, field} = 'relevant' in result ? result.simplified() : result;

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

  return s;
}