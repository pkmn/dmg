import * as assert from 'assert';

import {Generations} from '@pkmn/data';
import {Dex, PRNG, PRNGSeed} from '@pkmn/sim';

import {ParseError, Result, State, encode, parse} from '../../index';
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

  for (let i = 0; i < N; i++) {
    seed = prng.seed;
    let encoded = '';
    let reencoded = '';
    const original: {state?: State; result?: Result} = {};
    const simplified: {state?: State; result?: Result} = {};
    try {
      original.state = generate(gens, prng);
      encoded = encode(original.state);
      const parsed = parse(gens, encoded, true);
      reencoded = encode(parsed);

      assertStateEqual(original.state, parsed);
      assert.strictEqual(encoded, reencoded);

      // TODO
      // original.result = calculate(original.state);
      // verify(original.state, original.result);

      // simplified.state = Relevancy.simplify(original.result.state, original.result.relevant);
      // simplified.result = calculate(simplified.state);
      // // FIXME expect(simplified.result).toEqual(original.result);
    } catch (err) {
      const sep = '------------------------------\n';
      let s = `Seed: ${seed} (${i + 1}/${N})\n`;
      if (encoded) s += sep + `Encoded (1): '${encoded}'\n`;
      if (reencoded && encoded !== reencoded) s += sep + `Encoded (2): '${reencoded}'\n`;
      if (original.state) {
        s += sep + `State (1): ${stringify(State.toJSON(original.state), null, 2)}\n`;
      }
      if (simplified.state) {
        s += sep + `State (2): ${stringify(State.toJSON(simplified.state), null, 2)}\n`;
      }
      if (original.result) s += sep + `Result (1): ${original.result.toString()}\n`;
      if (simplified.result) s += sep + `Result (2): ${simplified.result.toString()}\n`;
      if (err instanceof ParseError) {
        s += sep + `Context: ${stringify(err.context, null, 2)}\n`;
      }
      console.log(s);
      throw err;
    }
  }
}
