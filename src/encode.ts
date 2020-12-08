import {State} from './state';
import {is, toID} from './utils';

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
 *
 * The `'desc'` type is lossy (not all of the information from `state` is encoded). Other types of
 * encoding will preserve enough to ensure identical calculation results once parsed, though some
 * irrelevant information may be lost. To ensure all irrelevant information is elided, the `state`
 * must first be simplified, see `Result#simplified`.
 */
export function encode(state: State, type: 'parse' | 'desc' | 'url' = 'parse') {
  const desc = type === 'desc';
  const {gen, gameType, p1, p2, move, field} = state;

  // FIXME note if status we cant find relevant attack stat = just return min
  // if (move.category === 'Status') {
  //   // TODO use z/use max
  //   return `${p1.pokemon.species.name} [${move.name}] vs. ${p2.pokemon.species.name}`;
  // }

  // const atkStat = move.category === 'Special' ? 'spa' :
  //   is(move.name, 'Body Press') ? 'def' : 'atk';
  // const defStat = (move.defensiveCategory || move.category) === 'Special' ? 'spd' : 'def';
  // if (is(move.name, 'Foul Play')) {}

  const buf: string[] = [];
  const levels = getLevels(p1.pokemon, p2.pokemon, desc);
  // TODO p1 atk boosts
  if (levels.p1) buf.push(`Lvl ${levels.p1}`);
  // TODO p1 atk evs
  if (desc) {
    if (p1.pokemon.item) buf.push(p1.pokemon.item);
    if (p1.pokemon.ability) buf.push(p1.pokemon.ability);
    if (p1.pokemon.ability === 'rivalry' && ![p1.pokemon.gender, p2.pokemon.gender].includes('N')) {
      buf.push(p1.pokemon.gender === p1.pokemon.gender ? 'buffed' : 'nerfed');
    }
    if (p1.pokemon.status === 'brn') buf.push('burned');
  }
  buf.push(p1.pokemon.species.name);
  if (desc) {
    if (p1.pokemon.volatiles.helpinghand) buf.push('Helping Hand');
    //  buf.push('Battery boosted'); // TODO battery + special
    if (p2.pokemon.switching) buf.push('switching boosted');
  } else {
    if (p1.pokemon.item) buf.push(`@ ${p1.pokemon.item}`);
  }

  buf.push(desc ? move.name : `[${move.name}]`);
  if (desc) {
    // TODO moveBP, moveType
    if (move.hits) buf.push(`(${move.hits} hits)`);
  }
  buf.push('vs.');

  // TODO p2 def boosts
  if (levels.p2) buf.push(`Lvl ${levels.p2}`);
  // TODO p2 def evs
  if (desc) {
    if (p2.pokemon.item) buf.push(p2.pokemon.item);
    if (p2.pokemon.ability) buf.push(p2.pokemon.ability);
    if (p2.pokemon.volatiles.protect) buf.push('protected');
    if (p2.pokemon.volatiles.dynamax) buf.push('Dynamax');
  }
  buf.push(p2.pokemon.species.name);

  if (desc) {
    if (field.weather && field.terrain) {
      buf.push(`in ${field.weather} and ${field.terrain} Terrain`);
    } else if (field.weather) {
      buf.push(`in ${field.weather}`);
    } else if (field.terrain) {
      buf.push(`in ${field.terrain} Terrain`);
    }
    if (p2.pokemon.volatiles.reflect || p2.sideConditions.reflect) {
      buf.push('through Reflect');
    }
    if (p2.pokemon.volatiles.lightscreen || p2.sideConditions.lightscreen) {
      buf.push('through Light Screen');
    }
    const friendGuard = p2.active?.some(p =>
      p?.ability === 'friendguard' && !p.fainted &&
      (!('position' in p) || p.position !== p2.pokemon.position));
    if (friendGuard) buf.push('with an ally\'s Friend Guard');
    if (p2.sideConditions.auroraveil) buf.push('with an ally\'s Aurora Veil');
    if (move.crit) buf.push('on a critical hit');
  } else {
    if (p2.pokemon.item) buf.push(`@ ${p2.pokemon.item}`);

    if (gen.num !== 8) buf.push(`gen:${gen.num}`);
    if (gameType === 'doubles') buf.push('+doubles');

    // Field
    if (field.weather) buf.push(`+${camelcase(field.weather)}`);
    if (field.terrain) buf.push(`+${toID(field.terrain)}Terrain`);
    // TODO pseudoweather

    // Sides
    // TODO

    // Move
    if (move.crit) buf.push('+crit');
    // FIXME if (move.useZ) buf.push('+z');
    // FIXME if (move.useMax) buf.push('+max');
    if (move.spreadHit) buf.push('+spread');
    if (move.hits) buf.push(`hits:${move.hits}`);
    if (move.magnitude) buf.push(`magnitude:${move.magnitude}`);
    if (move.numConsecutive) buf.push(`consecutive:${move.numConsecutive}`);
  }

  const s = buf.join(' ');
  return type === 'url' ? encodeURL(s) : s;
}

const RE = /[^a-zA-Z0-9]+(.)/g;
function camelcase(s: string) {
  return s.toLowerCase().replace(RE, (_, chr) => chr.toUpperCase());
}

function getLevels(p1: State.Pokemon, p2: State.Pokemon, elide: boolean) {
  if (p1.level !== p2.level) {
    return {
      p1: p1.level === 100 ? undefined : p1.level,
      p2: p2.level === 100 ? undefined : p2.level,
    };
  }
  elide = elide ? [100, 50, 5].includes(p1.level) : p1.level === 100;
  const level = elide ? undefined : p1.level;
  return {p1: level, p2: level};
}
