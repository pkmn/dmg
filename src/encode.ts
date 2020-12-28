import type {Generation, BoostName, StatName, NatureName, StatsTable} from '@pkmn/data';
import {State} from './state';
import {PseudoWeathers, SideConditions, Volatiles, Statuses} from './conditions';
import {has, is} from './utils';
import {computeStats} from './mechanics';
import * as math from './math';

const FORWARD = {
  '/': '$', '{': '(', '}': ')', '[': '(', ']': ')', '@': '*', ':': '=', ' ': '_', '%': '~',
};
const BACKWARD = {
  '$': '/', '{': '[', '}': ']', '(': '[', ')': ']', '*': '@', '=': ':', '_': ' ', '~': '%',
};

const ENCODE = /\/|{|}|\[|\]|@|:| |%/g;
const DECODE = /\$|\{|\}|\(|\)|\*|=|_|~/g;

export function encodeURL(s: string) {
  return s.replace(ENCODE, match => FORWARD[match as keyof typeof FORWARD]);
}

export function decodeURL(s: string) {
  // Even though the encoding scheme is URL-safe, it's not impossible to imagine that someone
  // might have also called encodeURIComponent on it
  try {
    s = decodeURIComponent(s);
  } catch {}
  return s.replace(DECODE, match => BACKWARD[match as keyof typeof BACKWARD]);
}

const display = (s: string) => s.replace(/\W+/g, '');

export function encode(state: State, url = false) {
  const buf: string[] = [];

  const {gen, gameType, p1, p2, move, field} = state;
  const [stats, normal] = getStats(gen, p1.pokemon, p2.pokemon, move);

  if (gen.num !== 8 || gameType !== 'singles') {
    buf.push(`(Gen ${gen.num}${gameType === 'doubles' ? ' Doubles' : ''})`);
  }

  // Attacker
  const consecutive = encodeSide(gen, 'p1', stats, normal, state, buf);

  // Move
  const m = gen.moves.get(move.id)!;
  let moveName: string = m.name;
  if (move.useZ) {
    // Some Z-Moves have aliases which conflict with the 'Z-' sugar
    if (!gen.moves.get(`Z-${moveName}`)) {
      buf.push('+Z');
    } else {
      moveName = `Z-${moveName}`;
    }
  }
  if (move.magnitude && moveName === 'Magnitude') {
    moveName = `${moveName} ${move.magnitude}`;
  } else if (move.basePower !== m.basePower) {
    moveName = `${moveName} ${move.basePower}`;
  }
  buf.push(`[${moveName}]`);

  buf.push('vs.');

  // Defender
  encodeSide(gen, 'p2', stats, normal, state, buf);

  // Field
  if (field.weather) buf.push(`+${display(field.weather)}`);
  if (field.terrain) buf.push(`+${display(field.terrain)}Terrain`);
  for (const id in field.pseudoWeather) {
    const pw = field.pseudoWeather[id];
    const name = display(PseudoWeathers[id][0]);
    buf.push(pw.level && pw.level > 1 ? `${name}:${pw.level}` : `+${name}`);
  }

  // Move (extra)
  if (move.crit) buf.push('+Crit');
  if (move.spread) buf.push('+Spread');
  if (move.hits && (move.hits > 1 || move.multihit)) buf.push(`Hits:${move.hits}`);
  if (consecutive) buf.push(`Consecutive:${consecutive}`);

  const s = buf.join(' ');
  return url ? encodeURL(s) : s;
}

export const ABILITIES: {[id: string]: 'p1' | 'p2'} = {
  aurabreak: 'p2', battery: 'p1', darkaura: 'p2', fairyaura: 'p2', flowergift: 'p2',
  friendguard: 'p2', powerspot: 'p1', steelyspirit: 'p1', stormdrain: 'p2',
};

export const STAT_ORDER: readonly StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
export const RBY_STAT_ORDER: readonly StatName[] = ['hp', 'atk', 'def', 'spa', 'spe'];

function encodeSide(
  gen: Generation,
  p: 'p1' | 'p2',
  stats: {p1: Exclude<StatName, 'hp'>; p2: Exclude<StatName, 'hp'>} | undefined,
  normal: boolean,
  state: State,
  buf: string[]
) {
  const pokemon = state[p].pokemon;
  const order = gen.num === 1 ? RBY_STAT_ORDER : STAT_ORDER;

  // Boosts
  if (!normal || !stats || (stats && !pokemon.boosts[stats[p]]) ||
    Object.values(pokemon.boosts).filter(Boolean).length > 1) {
    for (const boost of [...order.slice(1), 'accuracy', 'evasion'] as BoostName[]) {
      if (!pokemon.boosts[boost]) continue;
      const s = gen.stats.display(boost);
      const name = s === boost ? s.charAt(0).toUpperCase() + s.slice(1) : s;
      buf.push(`${name}Boosts:${pokemon.boosts[boost]}`);
    }
  } else {
    const boost = pokemon.boosts[stats[p]]!;
    buf.push(boost > 0 ? `+$${boost}` : `${boost}`);
  }

  // Level
  if (pokemon.level !== 100) buf.push(`Lvl ${pokemon.level}`);

  // Nature / EVs
  let mandatory: StatName[];
  if (p === 'p1') {
    mandatory = gen.num >= 3 && stats?.[p] && state.move.name !== 'Foul Play' ? [stats[p]] : [];
  } else {
    mandatory = gen.num >= 3 ? (stats?.[p] ? ['hp', stats[p]] : ['hp']) : [];
    if (gen.num >= 3 && state.move.name === 'Foul Play') mandatory.push('atk');
  }
  const evs: Partial<StatsTable> = {};
  for (const stat of order) {
    const val = pokemon.evs?.[stat] ?? (gen.num <= 2 ? 252 : 0);
    if (has || (gen.num <= 2 ? val < 252 : val > 0)) {
      evs[stat] = val;
    }
  }
  encodeEVsAndNature(gen, evs, pokemon.nature, order, buf);

  // HP
  const maxhp = gen.stats.calc(
    'hp',
    pokemon.species.baseStats.hp,
    pokemon.ivs?.hp ?? 31,
    pokemon.evs!.hp ?? (gen.num <= 2 ? 252 : 0),
    pokemon.level
  );
  if (pokemon.hp !== pokemon.maxhp) {
    const hp = math.round(pokemon.hp / pokemon.maxhp);
    buf.push(math.round(hp * pokemon.maxhp) === pokemon.hp ? `${hp}%` : `HP:${pokemon.hp}`);
  }

  // Status
  if (pokemon.status === 'tox') {
    buf.push(pokemon.statusData?.toxicTurns && pokemon.statusData.toxicTurns > 1
      ? `Toxic:${pokemon.statusData.toxicTurns}`
      : '+Toxic');
  } else if (pokemon.status) {
    buf.push(`+${Statuses[pokemon.status]}`);
    if (pokemon.statusData?.toxicTurns) buf.push(`ToxicCounter:${pokemon.statusData.toxicTurns}`);
  }

  if (pokemon.volatiles.dynamax) buf.push('+Dynamax');

  // Ability
  if (shouldAddAbility(pokemon)) buf.push(gen.abilities.get(pokemon.ability!)!.name);

  // Species
  buf.push(pokemon.species.name);

  // Item
  let consecutive = state.move.consecutive;
  if (p === 'p1') {
    if (pokemon.item) {
      const item = gen.items.get(pokemon.item)!;
      if (item.name === 'Metronome' && consecutive) {
        buf.push(`@ ${item.name}:${consecutive}`);
        consecutive = undefined;
      } else {
        buf.push(`@ ${item.name}`);
      }
    }
  } else if (pokemon.item) {
    buf.push(`@ ${gen.items.get(pokemon.item)!.name}`);
  }

  // Gender
  if (pokemon.gender && pokemon.gender !== pokemon.species.gender &&
      is('rivalry', state.p1.pokemon.ability, state.p2.pokemon.ability)) {
    buf.push(`Gender:${pokemon.gender}`);
  }

  // Weight
  if (pokemon.weighthg && pokemon.weighthg !== pokemon.species.weighthg) {
    buf.push(`Weight:${math.round(pokemon.weighthg * 100) / 1000}`);
  }

  // Types
  if (pokemon.addedType) buf.push(`AddedType:${pokemon.addedType}`);

  // Happiness
  if (typeof pokemon.happiness === 'number') buf.push(`Happiness:${pokemon.happiness}`);

  // IVs / DVs
  if (pokemon.ivs) {
    let expected = gen.stats.fill({}, 31);
    // Hidden Power changes the expected IVs - if hypertraining isn't possible the IVs should match
    // the default Hidden Power IVs (which requires a special case for Gen 2...)
    if (state.move.id.startsWith('hiddenpower') && (gen.num <= 6 || pokemon.level !== 100)) {
      const type = gen.types.get(state.move.id.slice(11)) ??
        gen.types.get(gen.types.getHiddenPower(gen.stats.fill({...pokemon.ivs}, 31)).type);
      if (gen.num <= 2) {
        for (const stat of gen.stats) {
          expected[stat] = type?.HPdvs?.[stat] ? gen.stats.toIV(type.HPdvs[stat]!) : 31;
        }
      } else {
        expected = gen.stats.fill({...type!.HPivs}, 31);
      }
    }

    // IV is a `false` if no IVs differ from the expected IVs, a specific stat if only one stat
    // differs (eg. 0 Spe) and `true` if more than one IV is different than expected.
    let iv: StatName | boolean = false;
    const ivs = [];
    for (const stat of order) {
      let val = pokemon.ivs[stat];
      ivs.push(val || 31);
      if (val === undefined) continue;
      if (gen.num <= 2) val = gen.stats.toIV(gen.stats.toDV(val));
      if (val !== expected[stat]) iv = iv === false ? stat : true;
    }
    // If the IVs differ at all from what they will default to we need to encode them, though if
    // only a single differs it gets encoded differently for brevity/clarity.
    if (iv) {
      if (typeof iv === 'string') {
        buf.push(gen.num >= 3
          ? `${gen.stats.display(iv)}IVs:${pokemon.ivs[iv]}`
          : `${gen.stats.display(iv)}DVs:${gen.stats.toDV(pokemon.ivs[iv]!)}`);
      } else {
        buf.push(gen.num >= 3
          ? `IVs:${ivs.join('/')}`
          : `DVs:${ivs.map(v => gen.stats.toDV(v)).join('/')}`);
      }
    }
  }

  // Miscellaneous
  if (pokemon.moveLastTurnResult === false) buf.push('+NoMoveLastTurn');
  if (pokemon.hurtThisTurn === false) buf.push('+NoHurtThisTurn');
  if (pokemon.switching) buf.push(`Switching:${pokemon.switching === 'in' ? 'In' : 'Out'}`);
  if (pokemon.maxhp !== maxhp) buf.push(`MaxHP:${pokemon.maxhp}`);

  // Allies
  let eligible = true;
  const allies = [];
  for (const active of (state[p].active || [])) {
    if (active?.ability) {
      if (!ABILITIES[active.ability]) eligible = false;
      allies.push(gen.abilities.get(active.ability)!.name);
    }
  }
  for (const member of (state[p].team || [])) {
    eligible = false;
    allies.push(member.species.baseStats.atk);
  }
  if (allies.length) {
    if (eligible) {
      buf.push(...allies.map(ability => `+${ability}`));
    } else {
      buf.push(`Allies:${allies.join(',')}`);
    }
  }

  // Side Conditions
  for (const id in state[p].sideConditions) {
    const sc = state[p].sideConditions[id];
    const name = display(SideConditions[id][0]);
    buf.push(sc.level && sc.level > 1 ? `${name}:${sc.level}` : `+${name}`);
  }

  // Volatiles
  for (const id in pokemon.volatiles) {
    if (id === 'dynamax') continue; // handled above
    const v = pokemon.volatiles[id];
    const name = display(Volatiles[id][0]);
    buf.push(v.level && v.level > 1 ? `${name}:${v.level}` : `+${name}`);
  }

  return consecutive;
}

function encodeEVsAndNature(
  gen: Generation,
  evs: Partial<StatsTable>,
  nature: NatureName | undefined,
  order: readonly StatName[],
  buf: string[]
) {
  const n = nature ? gen.natures.get(nature) : undefined;
  if (n?.plus) {
    if (getNature({plus: n.plus, minus: n.minus}, evs) === n.name) {
      const b = [];
      for (const stat of order) {
        if (!(stat in evs)) continue;
        const m = n.plus === stat ? '+' : n.minus === stat ? '-' : '';
        b.push(`${evs[stat]}${m} ${gen.stats.display(stat)}`);
      }
      buf.push(b.join(' / '));
    }
  } else {
    const b = [];
    for (const stat of order) {
      if (!(stat in evs)) continue;
      b.push(`${evs[stat]} ${gen.stats.display(stat)}`);
    }
    if (b.length) buf.push(b.join(' / '));
    if (n?.plus) buf.push(`Nature:${n.name}`);
  }
}

function shouldAddAbility(pokemon: State.Pokemon) {
  const abilities = Object.values(pokemon.species.abilities);
  return pokemon.ability && (abilities.length > 1 || !abilities.includes(pokemon.ability));
}

function getStats(
  gen: Generation, p1: State.Pokemon, p2: State.Pokemon, move: State.Move
): [{p1: Exclude<StatName, 'hp'>; p2: Exclude<StatName, 'hp'>} | undefined, boolean] {
  if (move.category === 'Status') return [undefined, true];
  switch (move.name) {
  case 'Photon Geyser':
  case 'Light That Burns The Sky': {
    const {atk, spa} = computeStats(gen, p1);
    return [atk > spa ? {p1: 'atk', p2: 'def'} : {p1: 'spa', p2: 'spd'}, false];
  }
  case 'Shell Side Arm': {
    const {atk, spa} = computeStats(gen, p1);
    const {def, spd} = computeStats(gen, p2);
    return [(atk / def) > (spa / spd) ? {p1: 'atk', p2: 'def'} : {p1: 'spa', p2: 'spd'}, false];
  }
  case 'Body Press':
    return [{p1: 'def', p2: 'def'}, false];
  default:
    return [{
      p1: move.category === 'Special' ? 'spa' : 'atk',
      p2: move.defensiveCategory
        ? move.defensiveCategory === 'Special' ? 'spd' : 'def'
        : move.category === 'Special' ? 'spd' : 'def',
    }, true];
  }
}

const NATURE_ORDER: readonly NatureName[] = [
  'Hardy', 'Lonely', 'Adamant', 'Naughty', 'Brave',
  'Bold', 'Docile', 'Impish', 'Lax', 'Relaxed',
  'Modest', 'Mild', 'Bashful', 'Rash', 'Quiet',
  'Calm', 'Gentle', 'Careful', 'Quirky', 'Sassy',
  'Timid', 'Hasty', 'Jolly', 'Naive', 'Serious',
];

export function getNature(
  nature: {plus?: StatName; minus?: StatName},
  evs: Partial<StatsTable & {spc: number}> | undefined,
) {
  if (nature.plus === 'hp' || nature.minus === 'hp') throw new Error('Natures cannot modify HP');
  if (nature.plus && nature.minus) return getNatureFromPlusMinus(nature.plus, nature.minus);
  if (!(nature.plus || nature.minus)) return undefined;

  const unspecified: Array<Exclude<StatName, 'hp'>> = [];
  for (const stat of STAT_ORDER) {
    if (stat === 'hp' || evs && stat in evs) continue;
    unspecified.push(stat);
  }
  if (!unspecified.length) return undefined;

  const plus = nature.plus || complement(nature.minus!, unspecified);
  const minus = nature.minus || complement(nature.plus!, unspecified);
  return getNatureFromPlusMinus(plus, minus);
}

function getNatureFromPlusMinus(plus: Exclude<StatName, 'hp'>, minus: Exclude<StatName, 'hp'>) {
  return NATURE_ORDER[(STAT_ORDER.indexOf(plus) - 1) * 5 + (STAT_ORDER.indexOf(minus) - 1)];
}

function complement(stat: Exclude<StatName, 'hp'>, options: Array<Exclude<StatName, 'hp'>>) {
  if (options.length === 1) return options[0];
  // Actually finding the 'optimal' stat to buff/nerf is effectively a fool's errand - the goal here
  // is to use somewhat sane heuristics and choose an underspecified stat that 'best' matches and
  // likely has the least impact on the relevant damage calculation. If the stat that is chosen is
  // at all relevant the user should have specified it.
  const find = (stats: Array<Exclude<StatName, 'hp'>>) => stats.find(s => options.includes(s))!;
  if (stat === 'atk') return find(['spa', 'spd', 'def', 'spe']);
  if (stat === 'spa') return find(['atk', 'def', 'spd', 'spe']);
  if (stat === 'def') return find(['spa', 'atk', 'spd', 'spe']);
  if (stat === 'spd') return find(['atk', 'spa', 'def', 'spe']);
  return find(['spd', 'def', 'spa', 'atk']);
}
