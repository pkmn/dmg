import * as assert from 'assert';

import {Generations} from '@pkmn/data';
import {Dex, PRNG, PRNGSeed} from '@pkmn/sim';

import * as dmg from '../../index';

import {generate} from './random';
import {verify} from './verifier';

export function run(seed: PRNGSeed = [1, 2, 3, 4], N = 10000) {
  const gens = new Generations(Dex as any);
  const prng = new PRNG(seed);

  for (let i = 0; i <= N; i++) {
    const state = generate(gens, prng);

    let encoded = '';
    let reencoded = '';
    try {
      encoded = dmg.encode(state);
      const parsed = dmg.parse(gens, encoded);
      reencoded = dmg.encode(parsed);

      assert.deepStrictEqual(state, parsed);
      assert.deepStrictEqual(encoded, reencoded);

      const result = dmg.calculate(state);
      verify(state, {
        range: result.range,
        recoil: result.recoil,
        recovery: result.recovery,
      });
    } catch (err) {
      let s = `Seed: ${seed} (${i + 1}/${N})\n`;
      if (encoded) s += `Encoded: ${encoded}\n`;
      if (reencoded && encoded !== reencoded) s += `Re-encoded: ${[reencoded]}\n`;
      s += `State: ${JSON.stringify(state, null, 2)}\n`;
      console.log(s);
      throw err;
    }
  }
}
