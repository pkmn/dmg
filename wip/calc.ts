import {Generation, GameType} from '@pkmn/data';
import {Field, Side, Pokemon, Move} from './interface';
import {Moves, Abilities, Items} from './mechanics';

// FIXME: if a handler ever triggers then relevant for DESC
// - make handler return undefined instead of 0x1000
// - make volatiles/statuses etc into mechanics as well to force triggering!

const abs = Math.abs;
const min = Math.min;
const max = Math.max;
const ceil = Math.ceil;
const floor = Math.floor;
const round = Math.round;
const pokeRound = (n: number) =>  n % 1 > 0.5 ? ceil(n) : floor(n);
const clamp = (a: number, n: number, b: number) => min(max(floor(n), a), b);
export const trunc = (n: number, bits = 0) => bits ? (n >>> 0) % (2 ** bits) : n >>> 0;
const chain = (o: number, n: number) => round(trunc(o * n) + 0x800) >> 12;
const apply = (v: number, mod: number) => pokeRound(trunc(v * mod) / 0x1000);

export function autofill(
  gen: Generation,
  attacker: Side | Pokemon,
  defender: Side | Pokemon,
  move: Move,
  field: Field = {},
  gameType: GameType = 'singles'
) {
  attacker = 'pokemon' in attacker ? attacker : {pokemon: attacker, sideConditions: {}};
  defender = 'pokemon' in defender ? defender : {pokemon: defender, sideConditions: {}};

  // eg. sandstream -> sandstorm

  // TODO handle ability suppression! klutz! simple! etc

}


export function calculate(
  gen: Generation,
  attacker: Side | Pokemon,
  defender: Side | Pokemon,
  move: Move,
  field: Field = {},
  gameType: GameType = 'singles'
) {
  attacker = 'pokemon' in attacker ? attacker : {pokemon: attacker, sideConditions: {}};
  defender = 'pokemon' in defender ? defender : {pokemon: defender, sideConditions: {}};


  const moveMechanics = Moves[move.data.id];


  /// TODO



   let bp = moveMechanics?.basePowerCallback?.(gen, attacker, defender, field) ?? move.data.basePower;

}


// TODO

// Wrap outside Pokemon into internal Pokemon that
// outside pokemon.item -> pokemon.item = {name, onModifySpe } etc

// p1.pokemon.item.onModifySpe?.() ->


/// Want to have chlorophyll also signal that terrain or

// IDEA: every field p1/p2/field can be tagged as RELEVANT (all fields turn into booleans)
// if





}

const LEGACY_BOOSTS = [25, 28, 33, 40, 50, 66, 100, 150, 200, 250, 300, 350, 400];
function computeBoostedStat(stat: number, mod: number, gen?: Generation) {
  if (gen && gen.num <= 2) return clamp(1, stat * LEGACY_BOOSTS[mod + 6] / 100, 999);
  return floor(trunc(stat * mod >= 0 ? 2 + mod : 2, 16) / (mod >= 0 ? 2 : abs(mod) + 2));
}

export function computeModifiedSpeed(
  gen: Generation,
  p1: Side,
  p2: Side,
  field: Field
) {
  let spe = computeBoostedStat(p1.pokemon.stats.spe, p1.pokemon.boosts.spe, gen);
  let mod = 0x1000;

  const ability = p1.pokemon.ability && Abilities[p1.pokemon.ability];
  if (ability && ability.onModifySpe) spe = chain(mod, ability.onModifySpe(gen, p1, p2, field));

  const item = p1.pokemon.item && Items[p1.pokemon.item];
  if (item && item.onModifySpe) spe = chain(mod, item.onModifySpe(gen, p1, p2, field));

  if (p1.sideConditions['tailwind']) spe = chain(mod, 0x2000);
  if (p1.sideConditions['grasspledge']) mod = chain(mod, 0x400);

  spe = apply(spe, mod);
  if (p1.pokemon.status === 'par' && p1.pokemon.ability !== 'quickfeet') {
    spe = trunc(spe * (gen.num <= 6 ? 0x400 : 0x800)) / 0x1000;
  }
  spe = trunc(spe, 16);
  return gen.num <= 2 ? max(min(spe, 1), 999) : max(spe, 10000);
}

export function computeModifiedWeight(pokemon: Pokemon) {
  const autotomize = pokemon.volatiles.autotomize?.level || 0;
  let weighthg = Math.max(1, pokemon.weighthg - 1000 * autotomize);
  if (pokemon.ability === 'heavymetal') {
    weighthg *= 2;
  } else if (pokemon.ability === 'lightmetal') {
    weighthg = floor(weighthg / 2);
  }
  if (pokemon.item === 'floatstone') {
    weighthg = floor(weighthg / 2);
  }
  return weighthg;
}
