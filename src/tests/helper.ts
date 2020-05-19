/* eslint-env jest */

import {GenerationNum, Generation, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/dex';

import {Scope, inGens} from '../gens';
import {Result} from '../result';

const gens = new Generations(Dex);

export function tests(name: string, fn: (scope: Scope) => void): void;
export function tests(name: string, from: GenerationNum, fn: (scope: Scope) => void): void;
export function tests(
  name: string, from: GenerationNum, to: GenerationNum, fn: (scope: Scope) => void): void;
export function tests(
  name: string,
  from: GenerationNum | ((scope: Scope) => void),
  to?: GenerationNum | ((scope: Scope) => void),
  fn?: (scope: Scope) => void
) {
  inGens(gens, from as GenerationNum, to as GenerationNum, (scope: Scope) => {
    test(`${name} (gen ${scope.gen.num})`, () => {
      fn!(scope);
    });
  });
}

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toMatch(gen: Generation, notation?: '%' | 'px' | ResultDiff, diff?: ResultDiff): R;
    }
  }
}

type ResultDiff = Partial<Record<GenerationNum, Partial<ResultBreakdown>>>;
interface ResultBreakdown {
  range: [number, number];
  recoil: [number, number];
  recovery: [number, number];
  desc: string;
  result: string;
}

expect.extend({
  toMatch(
    received: Result,
    gen: Generation,
    notation?: '%' | 'px' | ResultDiff,
    diff?: ResultDiff
  ) {
    if (typeof notation !== 'string') {
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
    if (expected.desc) {
      const r = received.fullDesc(notation).split(': ')[0];
      if (this.isNot) {
        expect(r).not.toEqual(expected.desc);
      } else {
        expect(r).toEqual(expected.desc);
      }
    }
    if (expected.result) {
      const post = received.fullDesc(notation).split(': ')[1];
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