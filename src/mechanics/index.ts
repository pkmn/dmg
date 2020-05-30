import {Generation, GameType, Generations, TypeName, MoveName} from '@pkmn/data';

import {State} from '../state';
import {Context} from '../context';
import {HitResult, Result} from '../result';
import {DeepReadonly, has} from '../utils';
import {parse} from '../parse';

import {Abilities} from './abilities';
import {Conditions} from './conditions';
import {Items} from './items';
import {Moves} from './moves';

export interface Applier {
  apply(state: State): void;
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

export type Handlers = typeof HANDLERS;
export const HANDLERS = {Abilities, Conditions, Items, Moves};

export const HANDLER_FNS: Set<keyof Handler> = new Set([
  'basePowerCallback', 'damageCallback', 'onModifyBasePower', 'onModifyAtk',
  'onModifySpA', 'onModifyDef', 'onModifySpD', 'onModifySpe', 'onModifyWeight',
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

const Z_MOVES: { [type in Exclude<TypeName, '???'>]: string } = {
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

function getZMoveName(
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
    if (matching) return item!.zMove;
  }
  return Z_MOVES[move.type as Exclude<TypeName, '???'>];
}

const MAX_MOVES: { [type in Exclude<TypeName, '???'>]: string } = {
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

function getMaxMovename(
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
  return MAX_MOVES[move.type as Exclude<TypeName, '???'>];
}

// function takeItem(pokemon: State.Pokemon | Context.Pokemon, boost: BoostName, amount: number) {
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
// function applyBoost(pokemon: State.Pokemon | Context.Pokemon, boost: BoostName, amount: number) {
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

