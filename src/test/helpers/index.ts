/* eslint-env jest */

import {Generation, GenerationNum, Generations, Specie} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {Scope, inGens} from '../../gens';
import {State} from '../../state';
import {Result} from '../../result';

import * as assert from 'assert';

const gens = new Generations(Dex as any);

export function tests(name: string, fn: (scope: Scope) => void, type?: 'skip' | 'only'): void;
export function tests(
  name: string,
  from: GenerationNum,
  fn: (scope: Scope) => void,
  type?: 'skip' | 'only'
): void;
export function tests(
  name: string,
  from: GenerationNum,
  to: GenerationNum,
  fn: (scope: Scope) => void,
  type?: 'skip' | 'only'
): void;
export function tests(...args: any[]) {
  const name = args[0];
  let from: GenerationNum;
  let to: GenerationNum;
  let fn: (scope: Scope) => void;
  let type: 'skip' | 'only' | undefined;
  if (typeof args[1] !== 'number') {
    from = 1;
    to = 8;
    fn = args[1];
    type = args[2];
  } else if (typeof args[2] !== 'number') {
    from = args[1] as GenerationNum ?? 1;
    to = 8;
    fn = args[2];
    type = args[3];
  } else {
    from = args[1] as GenerationNum ?? 1;
    to = args[2] as GenerationNum ?? 8;
    fn = args[3];
    type = args[4];
  }
  inGens(gens, from, to, (scope: Scope) => {
    const n = `${name} (gen ${scope.gen.num})`;
    if (type === 'skip') {
      test.skip(n, () => fn(scope));
    } else if (type === 'only') {
      test.only(n, () => fn(scope));
    } else {
      test(n, () => fn(scope));
    }
  });
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatch(
        gen: Generation,
        notation?: '%' | '/48' | 'px' | number | ResultDiff,
        diff?: ResultDiff
      ): R;
    }
  }
}

export type ResultDiff = Partial<Record<GenerationNum, ResultBreakdown>>;
export interface ResultBreakdown {
  range?: [number, number];
  recoil?: number | [number, number];
  recovery?: number | [number, number];
  desc?: string;
  result?: string;
}

expect.extend({
  toMatch(
    received: Result,
    gen: Generation,
    notation?: '%' | '/48' | 'px' | number | ResultDiff,
    diff?: ResultDiff
  ) {
    if (typeof notation !== 'string' && typeof notation !== 'number') {
      diff = notation;
      notation = '%';
    }
    if (!diff) throw new Error('toMatch called with no diff!');

    const breakdowns = Object.entries(diff).sort() as [string, ResultBreakdown][];
    const expected = {
      range: undefined! as [number, number],
      recoil: undefined! as [number, number],
      recovery: undefined! as [number, number],
      desc: '',
      result: '',
    };
    for (const [g, {range, desc, result}] of breakdowns) {
      if (Number(g) > gen.num) break;
      if (range) expected.range = range;
      if (desc) expected.desc = desc;
      if (result) expected.result = result;
    }

    if (!(expected.range || expected.desc || expected.result)) {
      throw new Error(`toMatch called with empty diff: ${diff}`);
    }

    for (const key of ['range', 'recovery', 'recoil'] as Array<'range' | 'recovery' | 'recoil'>) {
      if (expected[key]) {
        if (this.isNot) {
          expect(received[key]).not.toEqual(expected[key]);
        } else {
          expect(received[key]).toEqual(expected[key]);
        }
      }
    }
    const desc = received.description(notation);
    if (expected.desc) {
      const r = desc.desc;
      if (this.isNot) {
        expect(r).not.toEqual(expected.desc);
      } else {
        expect(r).toEqual(expected.desc);
      }
    }
    if (expected.result) {
      const post = desc.result;
      const r = `(${post.split('(')[1]}`;
      if (this.isNot) {
        expect(r).not.toEqual(expected.result);
      } else {
        expect(r).toEqual(expected.result);
      }
    }

    return {pass: !this.isNot, message: () => ''};
  },
});


/**
 * Workaround for asserting equality between between two `State` objects.
 *
 * Jest's `toEqual` and assert's `deepStrictEqual` choke on the circular references in `State` and
 * fail to terminate. Instead, this helper compares the objects piecemeal, though it mutates its
 * input and if this method throws it makes no attempt to restore its input to the correct state.
 * `assert` is used here as opposed to `expect` to faciliate use in the integration runner which
 * does not run in the Jest enviroment.
 */
export function assertStateEqual(a: State, b: State) {
  assert.strictEqual(a.gen, b.gen);
  assert.strictEqual(a.gameType, b.gameType);
  assert.deepStrictEqual(a.field, b.field);
  const p1 = a.p1.pokemon.species;
  const p2 = a.p2.pokemon.species;
  assert.strictEqual(a.p1.pokemon.species, b.p1.pokemon.species);
  a.p1.pokemon.species = b.p1.pokemon.species = undefined! as Specie;
  assert.strictEqual(a.p2.pokemon.species, b.p2.pokemon.species);
  a.p2.pokemon.species = b.p2.pokemon.species = undefined! as Specie;
  assert.deepStrictEqual(a.p1, b.p1);
  a.p1.pokemon.species = b.p1.pokemon.species = p1;
  assert.deepStrictEqual(a.p2, b.p2);
  a.p2.pokemon.species = b.p2.pokemon.species = p2;
  assert.deepStrictEqual(a.move, b.move);
}
