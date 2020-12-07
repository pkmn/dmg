import {Generation, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import * as parser from '../parse';

const gens = new Generations(Dex as any);

const parse = (g: Generation | Generations, s: string, error = '') => {
  if (error) expect(() => parser.parse(g, s, true)).toThrow(error);
  return parser.parse(g, s, false);
};

describe('parse', () => {
  test('empty', () => {
    expect(parse(gens, '', '' /* FIXME */)).toBe(true); // TODO???
  });

  test('gen', () => {
    expect(parse(gens, 'gen:5').gen).toBe(5);
    expect(parse(gens.get(1), 'gen:1').gen).toBe(1);

    expect(parse(gens, 'gen:foo', 'Invalid generation').gen).toBe(8);
    expect(parse(gens, 'gen:10', 'Invalid generation').gen).toBe(8);

    expect(parse(gens, 'gen:5 gen=4', 'Conflicting values').gen).toBe(4);
    expect(() => parse(gens.get(1), '--gen=2', 'Conflicting values').gen)
      .toThrow('Conflicting values');
  });

  // TODO...
});
