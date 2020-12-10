import {Generation, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import * as parser from '../parse';

import {decodeURL} from '../encode';

const gens = new Generations(Dex as any);

const SCENARIO = 'gengar [lick] vs. clefable';

const parse = (g: Generation | Generations, s: string, error = '') => {
  if (error) expect(() => parser.parse(g, s, true)).toThrow(error);
  return parser.parse(g, s, false);
};

// FIXME Type: Null

describe('parse', () => {
  test.only('misc', () => {
    expect(() => parse(gens, '', 'must have a value')).toThrow('must have a value');
    parse(
      gens,
      'foo attackerSpecies:gengar defenderSpecies:clefable move:lick sr:1',
      'Unable to parse phrase: \'foo\''
    );
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

    expect(parse(gens, `{4} ${SCENARIO}`).gen.num).toBe(4);
    expect(parse(gens.get(1), `${SCENARIO} [Gen 1]`).gen.num).toBe(1);

    expect(() => parse(gens, `[gen foo] ${SCENARIO}`, 'Unable to parse phrase'))
      .toThrow('must have a value');
    expect(() => parse(gens, `(Gen 10) ${SCENARIO}`, 'is not within [1,8]').gen.num)
      .toThrow('is not within [1,8]');

    expect(parse(gens, `{5} gen=4 ${SCENARIO}`, 'Conflicting values').gen.num).toBe(4);
  });

  // TODO...

  // --key=true -key:1 +key=yes key:y +val
  // --isKey=true +hasKey
  // no TODO

  // --key=false -key:0 +key=no key:n
  // -hasKey=n hasKey:false
  // no TODO
});
