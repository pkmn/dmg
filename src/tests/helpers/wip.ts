import {Generations} from '@pkmn/data';
import {PRNG} from '@pkmn/sim';

import {calculate} from '../../mechanics';
import {generate} from './random';
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
    console.log(seed);
    throw err; // TODO
  }
}
