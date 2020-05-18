import {simplify} from './simplify';
import {Result} from './result';

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

export function encode(result: Result, urlsafe = false) {
  const state = simplify(result);
  let s = '';   // TODO
  return urlsafe ? encodeURL(s) : s;
}