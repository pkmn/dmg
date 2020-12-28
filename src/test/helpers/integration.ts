import * as assert from 'assert';

import {Generations} from '@pkmn/data';
import {Dex, PRNG, PRNGSeed} from '@pkmn/sim';

import {encode, parse, State, ParseError} from '../../index';
import {assertStateEqual} from './assert';
import {generate} from './random';
// import {verify} from './verifier';

let stringify = JSON.stringify;
try {
  stringify = require('json-stringify-pretty-compact');
} catch {}

export function run(seed: PRNGSeed = [1, 2, 3, 4], N = 10000) {
  const gens = new Generations(Dex as any);
  const prng = new PRNG(seed);

  for (let i = 0; i <= N; i++) {
    seed = prng.seed;
    let state: State | undefined = undefined;
    let encoded = '';
    let reencoded = '';
    try {
      state = generate(gens, prng);
      encoded = encode(state);
      const parsed = parse(gens, encoded, true);
      reencoded = encode(parsed);

      assertStateEqual(state, parsed);
      assert.strictEqual(encoded, reencoded);

      // TODO
      // const result = calculate(state);
      // verify(state, {
      //   range: result.range,
      //   recoil: result.recoil,
      //   recovery: result.recovery,
      // });

      // const reduced = calculate(result.simplified());
      // expect(reduced).toEqual(result);
    } catch (err) {
      const sep = '------------------------------\n';
      let s = `Seed: ${seed} (${i + 1}/${N})\n`;
      if (encoded) s += sep + `Encoded: '${encoded}'\n`;
      if (reencoded && encoded !== reencoded) s += sep + `Re-encoded: '${reencoded}'\n`;
      if (state) s += sep + `State: ${stringify(State.toJSON(state), null, 2)}\n`;
      if (err instanceof ParseError) {
        s += sep + `Context: ${stringify(err.context, null, 2)}\n`;
      }
      console.log(s);
      throw err;
    }
  }
}
