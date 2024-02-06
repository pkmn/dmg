import type {GameType, Generation, Generations, ID, MoveName, StatsTable, TypeName} from '@pkmn/data';

import {State} from '../state';
import {Context} from '../context';
import {HitResult, Result} from '../result';
import {DeepReadonly, has} from '../utils';
import {parse} from '../parse';

import {Abilities} from './abilities';
import {Conditions} from './conditions';
import {Items} from './items';
import {Moves} from './moves';

import {abs, apply, chain, clamp, floor, max, min, trunc} from '../math';

export interface Applier {
  apply(side: 'p1' | 'p2', state: State, guaranteed?: boolean): void;
}

export interface Handler {
  basePowerCallback(context: Context): number;
  damageCallback(context: Context): number;

  onModifyBasePower(context: Context): number | undefined;

  onModifyAtk(context: Context): number | undefined;
  onModifySpA(context: Context): number | undefined;
  onModifyDef(context: Context): number | undefined;
  onModifySpD(context: Context): number | undefined;

  onModifySpe(context: Context): number | undefined;
  onModifyWeight(context: Context): number | undefined;

  onResidual(context: Context): number | undefined;
}

export type HandlerKind = 'Abilities' | 'Items' | 'Moves' | 'Conditions';
export type Handlers = typeof HANDLERS;
export const HANDLERS = {Abilities, Conditions, Items, Moves};

export class Appliers {
  private handlers: Handlers;

  constructor(handlers: Handlers) {
    this.handlers = handlers;
  }

  apply(
    kind: Exclude<HandlerKind, 'Conditions'>,
    side: 'p1' | 'p2', id: ID | undefined,
    state: State,
    guaranteed?: boolean
  ) {
    if (!id) return;

    switch (kind) {
      case 'Abilities':
      case 'Items':
        return this.handlers[kind][id]?.apply?.(side, state, guaranteed);
      case 'Moves': {
      // If a Move handler is defined, use it, otherwise try to see if an 'apply' function can
      // can be inferred based purely on information from the data files
        const handler = this.handlers.Moves[id];
        if (handler?.apply) return handler.apply(side, state, guaranteed);

        const move = state.gen.moves.get(id);
        if (!move) return;

        const secondaries = move.secondaries
          ? move.secondaries
          : move.secondary ? [move.secondary] : undefined;
        if (!secondaries) return;

        for (const secondary of secondaries) {
          if (guaranteed && secondary.chance && secondary.chance < 100) continue;
        // TODO apply secondary! need to take into account Simple etc for boosts, other affects
        // for slot conditions etc
        }
        return;
      }
      default:
        throw new Error(`Invalid handler kind: '${kind}'`);
    }
  }
}

export const APPLIERS = new Appliers(HANDLERS);

export const HANDLER_FNS: Set<keyof Handler> = new Set([
  'basePowerCallback', 'damageCallback', 'onModifyBasePower', 'onModifyAtk', 'onModifySpA',
  'onModifyDef', 'onModifySpD', 'onModifySpe', 'onModifyWeight', 'onResidual',
]);

// Convenience overload for most programs
export function calculate(
  gen: Generation,
  attacker: State.Side | State.Pokemon,
  defender: State.Side | State.Pokemon,
  move: State.Move,
  field?: State.Field,
  gameType?: GameType): Result;
// Convenience overload for humans
export function calculate(gens: Generation | Generations, args: string): Result;
// Main API offered - state can be created and the mutated, handlers can be overriden
export function calculate(state: State, handlers?: Handlers): Result;
export function calculate(...args: any[]) {
  let state: State;
  let handlers = HANDLERS;
  if (args.length > 3) {
    state = new State(args[0], args[1], args[2], args[3], args[4], args[5]);
  } else if (typeof args[1] === 'string') {
    state = parse(args[0], args[1]);
  } else {
    state = args[0];
    handlers = args[1] || handlers;
  }

  // Admittedly, somewhat odd to be creating a result and then letting it get mutated, but
  // this means we don't need to plumb state/handlers/context/relevancy in separately
  const hit = new HitResult(state as DeepReadonly<State>, handlers);

  // TODO mutate result and actually do calculations - should this part be in mechanics/index?

  return new Result(hit); // TODO handle multihit / parental bond etc
}

// FIXME: other modifiers beyond just boosts
export function computeStats(gen: Generation, pokemon: State.Pokemon) {
  const stats = {} as StatsTable;
  if (pokemon.stats) {
    for (const stat of gen.stats) {
      stats[stat] = stat === 'hp'
        ? pokemon.stats[stat]
        : computeBoostedStat(pokemon.stats[stat], pokemon.boosts?.[stat] || 0, gen);
    }
    return stats;
  } else {
    for (const stat of gen.stats) {
      stats[stat] = gen.stats.calc(
        stat,
        pokemon.species.baseStats[stat],
        pokemon.ivs?.[stat] ?? 31,
        pokemon.evs?.[stat] ?? (gen.num <= 2 ? 252 : 0),
        pokemon.level,
        gen.natures.get(pokemon.nature!)
      );
      if (stat !== 'hp') {
        stats[stat] = computeBoostedStat(stats[stat], pokemon.boosts?.[stat] || 0, gen);
      }
    }
  }
  return stats;
}

const LEGACY_BOOSTS = [25, 28, 33, 40, 50, 66, 100, 150, 200, 250, 300, 350, 400];

function computeBoostedStat(stat: number, mod: number, gen?: Generation) {
  if (gen && gen.num <= 2) return clamp(1, stat * LEGACY_BOOSTS[mod + 6] / 100, 999);
  return floor(trunc(stat * mod >= 0 ? 2 + mod : 2, 16) / (mod >= 0 ? 2 : abs(mod) + 2));
}

export function computeModifiedSpeed(context: Context | State) {
  context = 'relevant' in context ? context : Context.fromState(context);
  const {gen, p1} = context;
  let spe = computeBoostedStat(p1.pokemon.stats?.spe || 0, p1.pokemon.boosts.spe || 0, gen);
  let mod = 0x1000;

  const ability = p1.pokemon.ability && Abilities[p1.pokemon.ability.id];
  if (ability?.onModifySpe) spe = chain(mod, ability.onModifySpe(context));

  const item = p1.pokemon.item && Items[p1.pokemon.item.id];
  if (item?.onModifySpe) spe = chain(mod, item.onModifySpe(context));

  if (p1.sideConditions['tailwind']) spe = chain(mod, 0x2000);
  if (p1.sideConditions['grasspledge']) mod = chain(mod, 0x400);

  spe = apply(spe, mod);
  if (p1.pokemon.status?.name === 'par' && p1.pokemon.ability?.id !== 'quickfeet') {
    spe = trunc(spe * (gen.num <= 6 ? 0x400 : 0x800)) / 0x1000;
  }
  spe = trunc(spe, 16);
  return gen.num <= 2 ? max(min(spe, 1), 999) : max(spe, 10000);
}

export function computeModifiedWeight(pokemon: Context.Pokemon | State.Pokemon) {
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

const Z_MOVES: { [type in Exclude<TypeName, '???' | 'Stellar'>]: string } = {
  Bug: 'Savage Spin-Out',
  Dark: 'Black Hole Eclipse',
  Dragon: 'Devastating Drake',
  Electric: 'Gigavolt Havoc',
  Fairy: 'Twinkle Tackle',
  Fighting: 'All-Out Pummeling',
  Fire: 'Inferno Overdrive',
  Flying: 'Supersonic Skystrike',
  Ghost: 'Never-Ending Nightmare',
  Grass: 'Bloom Doom',
  Ground: 'Tectonic Rage',
  Ice: 'Subzero Slammer',
  Normal: 'Breakneck Blitz',
  Poison: 'Acid Downpour',
  Psychic: 'Shattered Psyche',
  Rock: 'Continental Crush',
  Steel: 'Corkscrew Crash',
  Water: 'Hydro Vortex',
};

export function getZMoveName(
  gen: Generation,
  move: State.Move,
  pokemon: {
    species?: {name: string};
    item?: string;
  } = {}
) {
  if (gen.num < 7) throw new TypeError(`Z-Moves do not exist in gen ${gen.num}`);
  if (pokemon.item) {
    const item = gen.items.get(pokemon.item);
    const matching =
      item?.zMove &&
      has(item.itemUser, pokemon.species?.name) &&
      item.zMoveFrom === move.name;
    if (matching) return item.zMove;
  }
  return Z_MOVES[move.type as Exclude<TypeName, '???'| 'Stellar'>];
}

const MAX_MOVES: { [type in Exclude<TypeName, '???' | 'Stellar'>]: string } = {
  Bug: 'Max Flutterby',
  Dark: 'Max Darkness',
  Dragon: 'Max Wyrmwind',
  Electric: 'Max Lightning',
  Fairy: 'Max Starfall',
  Fighting: 'Max Knuckle',
  Fire: 'Max Flare',
  Flying: 'Max Airstream',
  Ghost: 'Max Phantasm',
  Grass: 'Max Overgrowth',
  Ground: 'Max Quake',
  Ice: 'Max Hailstorm',
  Normal: 'Max Strike',
  Poison: 'Max Ooze',
  Psychic: 'Max Mindstorm',
  Rock: 'Max Rockfall',
  Steel: 'Max Steelspike',
  Water: 'Max Geyser',
};

export function getMaxMovename(
  gen: Generation,
  move: State.Move,
  pokemon: {
    species?: {isGigantamax: MoveName};
    item?: string;
  } = {}
) {
  if (gen.num < 8) throw new TypeError(`Max Moves do not exist in gen ${gen.num}`);
  if (move.category === 'Status') return 'Max Guard';
  if (pokemon.species?.isGigantamax) {
    const gmaxMove = gen.moves.get(pokemon.species.isGigantamax)!;
    if (move.type === gmaxMove.type) return pokemon.species.isGigantamax;
  }
  return MAX_MOVES[move.type as Exclude<TypeName, '???' | 'Stellar'>];
}

// function takeItem(pokemon: State.Pokemon | Context.Pokemon, boost: BoostID, amount: number) {
//   if (pokemon.ability === 'sticky') {

//   }
//   // mega item

// }

/*

setAbility(ability: string | Ability, source?: Pokemon | null, isFromFormeChange?: boolean) {
    if (!this.hp) return false;
    if (typeof ability === 'string') ability = this.battle.dex.getAbility(ability);
    const oldAbility = this.ability;
    if (!isFromFormeChange) {
      const abilities = [
        'battlebond', 'comatose', 'disguise', 'gulpmissile', 'hungerswitch', 'iceface',
        'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange',
      ];
      if (ability.id === 'illusion' ||
          abilities.includes(ability.id) ||
          abilities.includes(oldAbility)) {
        return false;
      }
      if (this.battle.gen >= 7 && (ability.id === 'zenmode' || oldAbility === 'zenmode')) {
        return false;
      }
    }

  ignoringItem() {
    return !!((this.battle.gen >= 5 && !this.isActive) ||
      (this.hasAbility('klutz') && !this.getItem().ignoreKlutz) ||
      this.volatiles['embargo'] || this.battle.field.pseudoWeather['magicroom']);
  }

  isGrounded(negateImmunity = false) {
    if ('gravity' in this.battle.field.pseudoWeather) return true;
    if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
    if ('smackdown' in this.volatiles) return true;
    const item = (this.ignoringItem() ? '' : this.item);
    if (item === 'ironball') return true;
    // If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type,
    // but it's still grounded.
    if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
    if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
    if ('magnetrise' in this.volatiles) return false;
    if ('telekinesis' in this.volatiles) return false;
    return item !== 'airballoon';
  }

  effectiveWeather() {
    const weather = this.battle.field.effectiveWeather();
    switch (weather) {
    case 'sunnyday':
    case 'raindance':
    case 'desolateland':
    case 'primordialsea':
      if (this.hasItem('utilityumbrella')) return '';
    }
    return weather;
  }

  ignoringAbility() {
    const abilities = [
      'battlebond', 'comatose', 'disguise', 'gulpmissile', 'multitype', 'powerconstruct',
      'rkssystem', 'schooling', 'shieldsdown', 'stancechange',
    ];
    // Check if any active pokemon have the ability Neutralizing Gas
    let neutralizinggas = false;
    for (const pokemon of this.battle.getAllActive()) {
      // can't use hasAbility because it would lead to infinite recursion
      if (pokemon.ability === ('neutralizinggas' as ID) && !pokemon.volatiles['gastroacid'] &&
        !pokemon.abilityData.ending) {
        neutralizinggas = true;
        break;
      }
    }

    return !!(
      (this.battle.gen >= 5 && !this.isActive) ||
      ((this.volatiles['gastroacid'] ||
        (neutralizinggas && this.ability !== ('neutralizinggas' as ID))) &&
      !abilities.includes(this.ability))
    );
  }
  */

// TODO white verb, mist, WONDER ROOM
// function applyBoost(pokemon: State.Pokemon | Context.Pokemon, boost: BoostID, amount: number) {
//   const ability = 'relevant' in pokemon ? pokemon.ability?.id : pokemon.ability;
//   let mod = 1;
//   if (is(ability, 'simple')) {
//     mod = 2;
//   } else if (is(ability, 'contrary')) {
//     mod *= -1;
//   } else if (is(ability, 'defiant') && amount < 0) {
//     pokemon.boosts.atk = clamp(-6, pokemon.boosts.atk + 2, 6);
//   } else if (is(ability, 'competitive') && amount < 0) {
//     pokemon.boosts.spa = clamp(-6, pokemon.boosts.spa + 2, 6);
//   }
//   pokemon.boosts[boost] = clamp(-6, pokemon.boosts[boost] + mod * amount, 6);

// }

// function is(x: string | string[] | undefined, ...xs: string[]) {
//   return !!(x && (Array.isArray(x) ? x.some(y => xs.includes(y)) : xs.includes(x)));
// }

