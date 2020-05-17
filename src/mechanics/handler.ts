import {State} from '../state';
import {Context} from '../context';
import {clamp, pokeRound} from '../math';
import { BoostName, ID } from '@pkmn/data';


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

function takeItem(pokemon: State.Pokemon | Context.Pokemon, boost: BoostName, amount: number) {
  if (pokemon.ability === 'sticky') {

  }
  // mega item

}


/*

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

// TODO white verb, mist
function applyBoost(pokemon: State.Pokemon | Context.Pokemon, boost: BoostName, amount: number) {
  const ability = 'relevant' in pokemon ? pokemon.ability?.id : pokemon.ability;
  let mod = 1;
  if (is(ability, 'simple')) {
    mod = 2;
  } else if (is(ability, 'contrary')) {
    mod *= -1;
  } else if (is(ability, 'defiant') && amount < 0) {
    pokemon.boosts.atk = clamp(-6, pokemon.boosts.atk + 2, 6);
  } else if (is(ability, 'competitive') && amount < 0) {
    pokemon.boosts.spa = clamp(-6, pokemon.boosts.spa + 2, 6);
  }
  pokemon.boosts[boost] = clamp(-6, pokemon.boosts[boost] + mod * amount, 6);

}

function is(x: string | string[] | undefined, ...xs: string[]) {
  return !!(x && (Array.isArray(x) ? x.some(y => xs.includes(y)) : xs.includes(x)));
}

