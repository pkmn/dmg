import { State, Context } from '../state';
// import { Context } from '../context';
import { clamp, pokeRound } from '../math';
import { BoostName, ID } from '@pkmn/data';

import {Abilities} from './abilities';
import {Conditions}  from './conditions';
import {Items}  from './items';
import {Moves}  from './moves';

export interface Handler {
  apply(state: State): void;

  basePowerCallback(context: Context): number;
  damageCallback(context: Context): number;

  onModifyBasePower(context: Context): number | undefined;
  onModifyAtk(context: Context): number | undefined;
  onModifySpA(context: Context): number | undefined;
  onModifyDef(context: Context): number | undefined;
  onModifySpD(context: Context): number | undefined;
  onModifySpe(context: Context): number | undefined;
  onModifyWeight(context: Context): number | undefined;
}

export type Handlers = typeof HANDLERS;
export const HANDLERS = {Abilities, Conditions, Items, Moves};

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
				'battlebond', 'comatose', 'disguise', 'gulpmissile', 'hungerswitch', 'iceface', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange',
			];
			if (ability.id === 'illusion' || abilities.includes(ability.id) || abilities.includes(oldAbility)) return false;
			if (this.battle.gen >= 7 && (ability.id === 'zenmode' || oldAbility === 'zenmode')) return false;
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
		// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
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
			'battlebond', 'comatose', 'disguise', 'gulpmissile', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange',
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
			((this.volatiles['gastroacid'] || (neutralizinggas && this.ability !== ('neutralizinggas' as ID))) &&
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

