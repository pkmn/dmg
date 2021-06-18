import {Generation, GenerationNum, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {ResultBreakdown} from '.';
import {VerificationError, verify} from './verifier';

import * as smogon from '@smogon/calc';
import * as pkmn from '../../index';

const KEYS = ['range', 'recoil', 'recovery', 'crash', 'desc', 'result'] as const;

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
    } catch (err) {
      if (err instanceof VerificationError) throw err;
      // else ignore, assume it means this generation should be skipped
    }
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
    const b_ = b[k] as [number, number];
    if (Array.isArray(a[k])) {
      const a_ = a[k] as [number, number];
      if (!a[k] || (a_[0] !== b_[0] || a_[1] !== b_[1])) {
        return `${k}: [${b_[0]}, ${b_[1]}]`;
      }
    } else {
      return `${k}: [${b_[0]}, ${b_[1]}]`;
    }
  } else if (a[k] !== b[k]) {
    return typeof b[k] === 'string' ? `${k}: '${b[k]}'` : `${k}: ${b[k]}`;
  }
  return '';
}

function dmg(state: pkmn.State): ResultBreakdown {
  const result = pkmn.calculate(state);
  verify(state, result);

  const breakdown: ResultBreakdown = {
    range: result.range,
    recovery: result.recovery(),
    recoil: result.recoil(),
    crash: result.crash(),
  };

  const text = result.text('both', '%');
  const colon = text.lastIndexOf(':');
  breakdown.desc = text.slice(0, colon);
  breakdown.result = text.slice(colon + 2);

  return breakdown;
}

function calc(state: pkmn.State): ResultBreakdown {
  const {gameType, gen, p1, p2} = state;

  const move = new smogon.Move(state.gen, state.move.name, {
    ability: gen.abilities.get(p1.pokemon.ability || '')?.name,
    item: gen.items.get(p1.pokemon.item || '')?.name,
    species: p1.pokemon.species.name,
    useZ: state.move.useZ,
    useMax: !!p1.pokemon.volatiles.dynamax,
    isCrit: state.move.crit,
    hits: state.move.hits,
    timesUsedWithMetronome: state.move.consecutive,
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
  // BUG: ignoring recoil/crash from @smogon/calc because it's a mess...
  const recovery = result.recovery();
  if (recovery.text) breakdown.recovery = recovery.recovery;

  const text = result.desc();
  const colon = text.lastIndexOf(':');
  breakdown.desc = text.slice(0, colon);
  breakdown.result = text.slice(colon + 2);

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
    cannonade: !!state.sideConditions.cannonade,
    wildfire: !!state.sideConditions.wildfire,
    vinelash: !!state.sideConditions.vinelash,
    volcalith: !!state.sideConditions.volcalith,
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
    abilityOn: !!(state.pokemon.ability && state.pokemon.volatiles[state.pokemon.ability]),
    item: gen.items.get(state.pokemon.item || '')?.name,
    isDynamaxed: !!state.pokemon.volatiles.dynamax,
    gender: state.pokemon.gender,
    nature: state.pokemon.nature,
    ivs: state.pokemon.ivs,
    evs: state.pokemon.evs,
    boosts: state.pokemon.boosts,
    // BUG: maxhp + hp vs. originalCurHP ¯\_(ツ)_/¯
    status: state.pokemon.status,
    toxicCounter: state.pokemon.statusState?.toxicTurns,
  });

  return [side, pokemon] as [smogon.Side, smogon.Pokemon];
}
