import {Generation, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import * as parser from '../parse';

const gens = new Generations(Dex as any);

const parse = (g: Generation | Generations, s: string, error = '') => {
  if (error) expect(() => parser.parse(g, s, true)).toThrow(error);
  return parser.parse(g, s, false);
};

const SCENARIO = 'gengar [lick] vs. clefable';

describe('parse', () => {
  test('empty', () => {
    expect(() => parse(gens, '', 'must have a value')).toThrow('must have a value');
  });

  test('gen', () => {
    expect(parse(gens, `gen:5 ${SCENARIO}`).gen.num).toBe(5);
    expect(parse(gens.get(1), `gen:1 ${SCENARIO}`).gen.num).toBe(1);

    expect(parse(gens, `gen:foo ${SCENARIO}`, 'Invalid generation').gen.num).toBe(8);
    expect(() => parse(gens, `gen:10 ${SCENARIO}`, 'is not within [1,8]').gen.num)
      .toThrow('is not within [1,8]');

    expect(parse(gens, `gen:5 gen=4 ${SCENARIO}`, 'Conflicting values').gen.num).toBe(4);
    expect(() => parse(gens.get(1), '--gen=2', 'Conflicting values').gen.num)
      .toThrow('Conflicting values');
  });

  // TODO...
});
