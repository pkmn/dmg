import type {Generation, BoostName, StatName} from '@pkmn/data';
import {State} from './state';
import {Conditions, PseudoWeathers, SideConditions, Volatiles} from './conditions';
import {is, toID} from './utils';
import {computeStats} from './mechanics';

const FORWARD = {'/': '$', '{': '(', '}': ')', '[': '(', ']': ')', '@': '*', ':': '=', ' ': '_'};
const BACKWARD = {'$': '/', '(': '[', ')': ']', '*': '@', '=': ':', '_': ' '};

const ENCODE = /\/|{|}|\[|\]|@|:| /g;
const DECODE = /\$|\{|\}|\(|\)|\*|=|_/g;

const display = (s: string) => s.replace(/\W+/g, '');

export function encodeURL(s: string) {
  return s.replace(ENCODE, match => FORWARD[match as keyof typeof FORWARD]);
}

export function decodeURL(s: string) {
  // Even though the encoding scheme is URL-safe, it's not impossible to imagine that someone might
  // have also called encodeURIComponent on it
  return decodeURIComponent(s).replace(DECODE, match => BACKWARD[match as keyof typeof BACKWARD]);
}

export function encode(state: State, url = false) {
  const {gen, gameType, p1, p2, move, field} = state;

  const stats = getStats(gen, p1.pokemon, p2.pokemon, move);

  const implicits = {p1: [] as string[], p2: [] as string[]};
  const explicits = {p1: [] as string[], p2: [] as string[]};
  for (const side of ['p1', 'p2'] as const) {
    for (const id in state[side].sideConditions) {
      const sc = state[side].sideConditions[id];
      const name = display(SideConditions[id][0]);
      const implicit = Conditions.get(gen, id)?.[2] === side;
      (implicit ? implicits : explicits)[side].push(
        sc.level && sc.level > 1 ? `${name}:${sc.level}` : (implicit ? `+${name}` : name)
      );
    }
    for (const id in state[side].pokemon.volatiles) {
      const v = state[side].pokemon.volatiles[id];
      const name = display(Volatiles[id][0]);
      const implicit = Conditions.get(gen, id)?.[2] === side;
      (implicit ? implicits : explicits)[side].push(
        v.level && v.level > 1 ? `${name}:${v.level}` : (implicit ? `+${name}` : name)
      );
    }
    if (state[side].pokemon.status) implicits[side].push(`+${state[side].pokemon.status}`);
  }

  const buf: string[] = [];
  if (gen.num !== 8) buf.push(`(Gen ${gen.num})`); // FIXME Gen 4 Doubles
  if (gameType === 'doubles') buf.push('+doubles');

  const levels = getLevels(p1.pokemon, p2.pokemon);
  if (stats && p1.pokemon.boosts[stats.p1]) {
    const b = p1.pokemon.boosts[stats.p1]!;
    buf.push(b > 0 ? `+${b}` : `${b}`);
  }
  if (levels.p1) buf.push(`Lvl ${levels.p1}`);
  if (stats && move.name !== 'Foul Play') {
    const evs = p1.pokemon.evs?.[stats.p1];
    if (gen.num <= 2) {
      if ((evs ?? 252) !== 252) buf.push(`${evs} ${gen.stats.display(stats.p1)}`);
    } else {
      const nature = p1.pokemon.nature && gen.natures.get(p1.pokemon.nature);
      const n = nature ? nature.plus === stats.p1 ? '+' : nature.minus === stats.p1 ? '-' : '' : '';
      buf.push(`${evs ?? 0}${n} ${gen.stats.display(stats.p1)}`);
    }
  }
  for (const implicit of implicits.p1) buf.push(implicit);
  buf.push(p1.pokemon.species.name);
  if (p1.pokemon.item) buf.push(`@ ${gen.items.get(p1.pokemon.item)!.name}`);

  buf.push(move.magnitude
    ? `[${gen.moves.get(move.id)!.name} ${move.magnitude}]`
    : `[${gen.moves.get(move.id)!.name}]`);
  buf.push('vs.');

  if (stats && p2.pokemon.boosts[stats.p2]) {
    const b = p2.pokemon.boosts[stats.p2]!;
    buf.push(b > 0 ? `+${b}` : `${b}`);
  }
  if (levels.p2) buf.push(`Lvl ${levels.p2}`);
  if (stats) {
    const hp = p2.pokemon.evs?.hp;
    const def = p2.pokemon.evs?.[stats.p2];
    // FIXME foul play?
    if (gen.num <= 2) {
      if (((hp ?? 252) !== 252) || ((def ?? 252) !== 252)) {
        buf.push(`${hp} HP / ${def} ${gen.stats.display(stats.p1)}`);
      }
    } else {
      const nature = p2.pokemon.nature && gen.natures.get(p2.pokemon.nature);
      const n = nature ? nature.plus === stats.p2 ? '+' : nature.minus === stats.p2 ? '-' : '' : '';
      buf.push(`${hp ?? 0} HP / ${def ?? 0}${n} ${gen.stats.display(stats.p2)}`);
    }
  }
  for (const implicit of implicits.p2) buf.push(implicit);
  buf.push(p2.pokemon.species.name);

  if (p2.pokemon.item) buf.push(`@ ${gen.items.get(p2.pokemon.item)!.name}`);

  // Field
  if (field.weather) buf.push(`+${display(field.weather)}`);
  if (field.terrain) buf.push(`+${toID(field.terrain)}Terrain`);
  for (const id in field.pseudoWeather) {
    const pw = field.pseudoWeather[id];
    const name = display(PseudoWeathers[id][0]);
    buf.push(pw.level && pw.level > 1 ? `${name}:${pw.level}` : `+${name}`);
  }

  // Sides
  for (const side of ['p1', 'p2'] as const) {
    const p = side === 'p1' ? 'attacker' : 'defender';
    const pokemon = state[side].pokemon;
    if (pokemon.ability) {
      buf.push(`${p}Ability:${display(gen.abilities.get(pokemon.ability)!.name)}`);
    }
    if (pokemon.gender) buf.push(`${p}Gender:${pokemon.gender}`);
    if (pokemon.weighthg) buf.push(`${side}Weight:${pokemon.weighthg}`);
    if (typeof pokemon.happiness === 'number') buf.push(`${p}Happiness:${pokemon.happiness}`);
    if (pokemon.ivs) {
      for (const s in pokemon.ivs) {
        const stat = s as StatName;
        const iv = pokemon.ivs[stat] ?? 31;
        if (iv !== 31) {
          buf.push(gen.num <= 2
            ? `${p}${gen.stats.display(stat)}DVs:${gen.stats.toDV(iv)}`
            : `${p}${gen.stats.display(stat)}IVs:${iv}`);
        }
      }
    }
    // FIXME handle nature!!! nature is only relevant if it effects a stat which is also relevant!
    if (pokemon.evs) {
      for (const s in pokemon.evs) {
        if (side === 'p1' && is(s, 'atk') || side === 'p2' && is(s, 'hp', 'spd')) continue;
        const stat = s as StatName;
        const ev = pokemon.evs[stat] ?? (gen.num <= 2 ? 252 : 0);
        if (gen.num <= 2 ? ev < 252 : ev > 0) {
          buf.push(`${p}${gen.stats.display(stat)}EVs:${ev}`);
        }
      }
    }

    for (const b in pokemon.boosts) {
      const boost = b as BoostName;
      if (!pokemon.boosts[boost] || stats?.[side] === boost) continue;
      const s = gen.stats.display(boost);
      const name = s === boost ? s.charAt(0).toUpperCase() + s.slice(1) : s;
      buf.push(`${p}${name}Boosts:${pokemon.boosts[boost]}`);
    }
    const maxhp = gen.stats.calc(
      'hp',
      pokemon.species.baseStats.hp,
      pokemon.ivs?.hp ?? 31,
      pokemon.evs!.hp ?? (gen.num <= 2 ? 252 : 0),
      pokemon.level
    );
    if (pokemon.maxhp !== maxhp) buf.push(`${p}maxHP:${pokemon.maxhp}`);
    if (pokemon.hp !== pokemon.maxhp) buf.push(`${p}HP:${pokemon.hp}`);
    if (pokemon.statusData?.toxicTurns) {
      buf.push(`${p}ToxicCounter:${pokemon.statusData.toxicTurns}`);
    }
    if (explicits[side].length) buf.push(`${p}:${explicits[side].join(',')}`);
  }

  // Move
  if (move.crit) buf.push('+crit');
  // TODO if (move.useZ) buf.push('+z');
  if (move.spread) buf.push('+spread');
  if (move.hits) buf.push(`hits:${move.hits}`);
  if (move.consecutive) buf.push(`consecutive:${move.consecutive}`); // FIXME metronome

  const s = buf.join(' ');
  return url ? encodeURL(s) : s;
}

function getLevels(p1: State.Pokemon, p2: State.Pokemon) {
  if (p1.level !== p2.level) {
    return {
      p1: p1.level === 100 ? undefined : p1.level,
      p2: p2.level === 100 ? undefined : p2.level,
    };
  }
  const level = p1.level === 100 ? undefined : p1.level;
  return {p1: level, p2: level};
}

function getStats(
  gen: Generation, p1: State.Pokemon, p2: State.Pokemon, move: State.Move
): {p1: Exclude<StatName, 'hp'>; p2: Exclude<StatName, 'hp'>} | undefined {
  if (move.category === 'Status') return undefined;
  switch (move.name) {
  case 'Photon Geyser':
  case 'Light That Burns The Sky': {
    const {atk, spa} = computeStats(gen, p1);
    return atk > spa ? {p1: 'atk', p2: 'def'} : {p1: 'spa', p2: 'spd'};
  }
  case 'Shell Side Arm': {
    const {atk, spa} = computeStats(gen, p1);
    const {def, spd} = computeStats(gen, p2);
    return (atk / def) > (spa / spd) ? {p1: 'atk', p2: 'def'} : {p1: 'spa', p2: 'spd'};
  }
  case 'Body Press':
    return {p1: 'def', p2: 'def'};
  default:
    return {
      p1: move.category === 'Special' ? 'spa' : 'atk',
      p2: move.defensiveCategory
        ? move.defensiveCategory === 'Special' ? 'spd' : 'def'
        : move.category === 'Special' ? 'spd' : 'def',
    };
  }
}
