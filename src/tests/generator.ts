import {Generation, GenerationNum, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {ResultBreakdown} from './helper';

import * as smogon from '@smogon/calc';
import * as pkmn from '../index';

const KEYS: Array<keyof ResultBreakdown> = ['range', 'recoil', 'recovery', 'desc', 'result'];

const gens = new Generations(Dex as any);

export function generate(s: string, pkg: 'dmg' | 'calc' = 'dmg') {
  let encoded = s;
  const results: Array<[GenerationNum, ResultBreakdown]> = [];
  for (let g = 1; g <= 8; g++) {
    const gen = gens.get(g as GenerationNum);
    try {
      const state = pkmn.parse(gen, s, true);
      const breakdown = pkg === 'dmg' ? dmg(state) : calc(state);
      encoded = pkmn.encode(state);
      results.push([gen.num, breakdown]);
    } catch (err) { } // ignore, assume it mean this generation should be skipped
  }

  if (!results.length) throw new Error(`No successful calculations in any generation for '${s}'`);

  const from = results[0][0];
  const to = results[results.length - 1][0];

  let diff = '';
  const last: {gen: number; breakdown: ResultBreakdown} = {gen: from - 1, breakdown: {}};
  for (const [gen, breakdown] of results) {
    if (gen !== last.gen + 1) {
      throw new Error(`Gap in generations with successful calculations: ${last.gen} -> ${gen}`);
    }

    const fields: string[] = [];
    for (const k of KEYS) {
      if (!breakdown[k]) continue;
      const field = breakdownField(k, last.breakdown, breakdown);
      if (field) fields.push(field);
    }
    if (fields.length) diff += `${gen}: {${fields.join(', ')}},\n`;
  }

  let range = '';
  if (from !== 1) {
    range = `, ${from}, `;
    if (to !== 8) range += `${to}, `;
  } else if (to !== 8) {
    range = `, ${from}, ${to}, `;
  }

  return (
    `tests('TODO', ${range}({gen, calculate}) => {
  expect(calculate(${encoded})).toMatch(gen, {
    ${diff}
  });
}`);
}

// PRECONDITION: b[k] !== undefined
function breakdownField(k: keyof ResultBreakdown, a: ResultBreakdown, b: ResultBreakdown) {
  if (Array.isArray(b[k])) {
    if (!a[k] || (a[k]![0] !== b[k]![0] || a[k]![1] !== b[k]![1])) {
      return `${k}: [${b[k]![0]}, ${b[k]![1]}]`;
    }
  } else if (a[k] !== b[k]) {
    return `${k}: '${b[k]}'`;
  }
  return '';
}

function dmg(state: pkmn.State): ResultBreakdown {
  const result = pkmn.calculate(state);

  const breakdown: ResultBreakdown = {
    range: result.range,
    recoil: result.recoil,
    recovery: result.recovery,
  };

  const [pre, post] = result.desc.split(': ');
  breakdown.desc = pre;
  breakdown.result = `(${post.split('(')[1]}`;

  return breakdown;
}

function calc(state: pkmn.State): ResultBreakdown {
  const {gameType, gen, p1, p2} = state;

  const move = new smogon.Move(state.gen, state.move.name, {
    ability: gen.abilities.get(p1.pokemon.ability || '')?.name,
    item: gen.items.get(p1.pokemon.item || '')?.name,
    species: p1.pokemon.species.name,
  });

  const field = new smogon.Field({
    gameType: gameType === 'singles' ? 'Singles' : 'Doubles',
    weather: state.field.weather,
    terrain: state.field.terrain,
    isGravity: !!state.field.pseudoWeather.gravity,
  });

  const [attackerSide, attacker] = calcSideAndPokemon(gen, p1);
  const [defenderSide, defender] = calcSideAndPokemon(gen, p2);
  field.attackerSide = attackerSide;
  field.defenderSide = defenderSide;

  const result = smogon.calculate(gen, attacker, defender, move, field);

  const breakdown: ResultBreakdown = {range: result.range()};
  // BUG: ignoring recoil from @smogon/calc because it's a mess...
  const recovery = result.recovery();
  if (recovery.text) breakdown.recovery = recovery.recovery;

  const [pre, post] = result.desc().split(': ');
  breakdown.desc = pre;
  breakdown.result = `(${post.split('(')[1]}`;

  return breakdown;
}

function calcSideAndPokemon(gen: Generation, state: pkmn.State.Side) {
  const isReflect =
    !!(gen.num <= 2 ? state.pokemon.volatiles.reflect : state.sideConditions.reflect);
  const isLightScreen =
    !!(gen.num <= 2 ? state.pokemon.volatiles.lightscreen : state.sideConditions.lightscreen);
  const isFriendGuard = !!state.active?.some(p =>
    p?.ability === 'friendguard' && !p.fainted && p.position !== state.pokemon.position);
  const isBattery = !!state.active?.some(p =>
    p?.ability === 'battery' && !p.fainted && p.position !== state.pokemon.position);

  const side = new smogon.Side({
    spikes: state.sideConditions.spikes?.level ?? 0,
    steelsurge: !!state.sideConditions.steelsurge,
    isSR: !!state.sideConditions.stealthrock,
    isReflect,
    isLightScreen,
    isProtected: !!state.pokemon.volatiles.protect,
    isSeeded: !!state.pokemon.volatiles.leechseed,
    isForesight: !!state.pokemon.volatiles.foresight,
    isTailwind: !!state.sideConditions.tailwind,
    isHelpingHand: !!state.pokemon.volatiles.foresight,
    isFriendGuard,
    isAuroraVeil: !!state.sideConditions.auroraveil,
    isBattery,
    isSwitching: state.pokemon.switching,
  });

  const pokemon = new smogon.Pokemon(gen, state.pokemon.species.name, {
    level: state.pokemon.level,
    ability: gen.abilities.get(state.pokemon.ability || '')?.name,
    item: gen.items.get(state.pokemon.item || '')?.name,
    isDynamaxed: !!state.pokemon.volatiles.dynamax,
    gender: state.pokemon.gender,
    nature: state.pokemon.nature,
    ivs: state.pokemon.ivs,
    evs: state.pokemon.evs,
    boosts: state.pokemon.boosts,
    // BUG: originalCurHP ¯\_(ツ)_/¯
    status: state.pokemon.status,
    toxicCounter: state.pokemon.statusData?.toxicTurns,
  });

  return [side, pokemon] as [smogon.Side, smogon.Pokemon];
}