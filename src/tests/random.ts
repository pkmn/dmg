import {GenerationNum, Generations, Generation, GameType, toID, StatsTable, NatureName, BoostName} from '@pkmn/data';
import {Pokemon, PRNG} from '@pkmn/sim';

import {calculate} from '../mechanics';
import {State, FieldOptions, SideOptions, PokemonOptions,  MoveOptions} from '../state';
import {Weathers, Terrains, PseudoWeathers, SideConditions, Statuses, Volatiles} from '../conditions';
import {is} from '../utils';

import {verify} from './verifier';

export function run(gens: Generations, prng: PRNG) {
  const seed = prng.seed;

  const state = generate(gens, prng);
  const result = calculate(state);

  try {
    verify(state, {
      range: result.range,
      recoil: result.recoil,
      recovery: result.recovery,
    });
  } catch (err) {
    throw err; // TODO
  }
};

function generate(gens: Generations, prng: PRNG) {
  const gen = gens.get(prng.next(1, 8) as GenerationNum);
  const gameType = (gen.num >= 3 && prng.randomChance(1, 4)) ? 'doubles' : 'singles';

  const field = generateField(gen, prng);
  const attacker = generateSide(gen, gameType, prng);
  const defender = generateSide(gen, gameType, prng);
  const move = generateMove(gen, gameType, attacker.pokemon, prng);

  return new State(gen, attacker, defender, move, field, gameType);
}

function generateField(gen: Generation, prng: PRNG) {
  const options: FieldOptions = {};
  if (gen.num >= 2 && prng.randomChance(1, 10)) {
    options.weather = sample(prng, Object.values(Weathers).filter(v => v[1] >= gen.num))[0];
  }
  if (gen.num >= 4) {
    if (prng.randomChance(1, 20)) {
      options.terrain = sample(prng, Object.values(Terrains).filter(v => v[1] >= gen.num))[0];
    }
    const pws = Object.values(PseudoWeathers).filter(v => v[1] >= gen.num);
    options.pseudoWeather = {};
    while (pws.length && prng.randomChance(1, 25)) {
      const pw = toID(sample(prng, pws, true)[0]);
      options.pseudoWeather[pw] = {level: pw === 'echoedvoice' ? prng.next(1, 5) : 1};
    }
  }

  return State.createField(gen, options);
}

function generateSide(gen: Generation, gameType: GameType, prng: PRNG) {
  const options: SideOptions = {};
  const scs = Object.values(SideConditions).filter(v => v[1] >= gen.num);
  options.sideConditions = {};
  while (scs.length && prng.randomChance(1, 8)) {
    const sc = toID(sample(prng, scs, true)[0]);
    options.sideConditions[sc] = {level: sc === 'spikes' && gen.num >= 3 ? prng.next(1, 3) : 1};
  }
  if (gameType === 'doubles' && prng.randomChance(1, 10)) {
    // TODO abilities
  }
  const pokemon = generatePokemon(gen, prng);
  return State.createSide(gen, pokemon, options)
}

const BOOSTS = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];

function generatePokemon(gen: Generation, prng: PRNG) {
  const options: PokemonOptions = {};

  const species = sample(prng, Array.from(gen.species));
  options.level = prng.next(1, 100);
  if (prng.randomChance(1, 100)) options.weighthg = species.weighthg * prng.next() * 2;

  if (gen.num >= 2 && prng.randomChance(99, 100)) {
    options.item = sample(prng, Array.from(gen.items)).name;
  }
  if (gen.num >= 3) options.ability = sample(prng, Object.values(species.abilities));
  if (prng.randomChance(1, 10)) {
    options.status = sample(prng, Object.keys(Statuses));
    if (options.status === 'tox') options.statusData = {toxicTurns: prng.next(1, 16)};
  }

  const volatiles = Object.values(Volatiles).filter(v => v[1] >= gen.num);
  options.volatiles = {};
  while (volatiles.length && prng.randomChance(1, 8)) {
    const v = toID(sample(prng, volatiles, true)[0]);
    options.volatiles[v] = {level: is(v, 'autotomize', 'stockpile') ? prng.next(1, 3) : 1};
  }
  if (prng.randomChance(1, 100)) options.addedType = sample(prng, ['Grass', 'Ghost']);

  const nature = gen.num >= 3 ? sample(prng, Array.from(gen.natures)) : undefined;
  options.nature = nature?.name;
  options.ivs = {};
  options.evs = {};
  const stats: Partial<StatsTable> = {};

  let total = 510;
  // NOTE: we iterate to ensure HP gets handled last after all of the other IVs have been
  // rolled so that if we need to compute the expected HP DV in RBY/GSC we are able to
  const order = Array.from(gen.stats).reverse();
  for (const stat of order) {
    if (gen.num === 1 && stat === 'spa') {
      options.ivs.spa = options.ivs.spd;
      options.evs.spa = options.evs.spd;
      stats.spa = stats.spd;
      continue;
    }
    options.ivs[stat] = stat === 'hp' && gen.num < 3
      ? gen.stats.toIV(gen.stats.getHPDV(options.ivs))
      : prng.next(0, 31);
      options.evs[stat] = prng.next(0, gen.num >= 3 ? Math.min(total, 252) : 252);
    total -= options.evs[stat]!;
    stats[stat] = gen.stats.calc(
      stat, species.baseStats[stat]!, options.ivs[stat], options.evs[stat], options.level, nature);
  }

  // TODO maxhp
  if (prng.randomChance(1, 2)) options.hp = stats.hp! * prng.next();

  options.boosts = {};
  const boosts = BOOSTS.slice() as BoostName[];
  while (boosts && prng.randomChance(1, 10)) {
    options.boosts[sample(prng, boosts, true)] = prng.next(1, 6);
  }

  return State.createPokemon(gen, species.name, options);
}

function generateMove(gen: Generation, gameType: GameType, pokemon: State.Pokemon, prng: PRNG) {
  const options: MoveOptions = {};
  const status = prng.randomChance(1, 200);

  const move = sample(prng, Array.from(gen.moves).filter(m => status ? m.status : !m.status));
  options.crit = prng.randomChance(1, 16);
  if (move.multihit && typeof move.multihit !== 'number') {
    options.hits = prng.next(move.multihit[0], move.multihit[1]);
  }
  if (move.id === 'magnitude') options.magnitude = prng.next(4, 10);
  if (gen.num >= 3 && gameType === 'doubles') options.spreadHit = prng.randomChance(4, 5);
  if (pokemon.item === 'metronome') options.numConsecutive = prng.next(1, 10);

  if (gen.num === 7) {
    // TODO useZ
  } else if (gen.num === 8) {
    // TODO useMax
  }

  return State.createMove(gen, move.name, options, pokemon);
}

function sample<T>(prng: PRNG, arr: T[], remove = false) {
  if (arr.length === 0) throw new RangeError('Cannot sample an empty array');
  const index = prng.next(arr.length);
  const val = arr[index];
  if (remove) {
    arr[index] = arr[arr.length - 1];
    arr.pop();
  }
  if (val === undefined && !Object.prototype.hasOwnProperty.call(arr, index)) {
    throw new RangeError('Cannot sample a sparse array');
  }
  return val;
}