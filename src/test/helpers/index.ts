/* eslint-env jest */

import {Generation, GenerationNum, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {Scope, inGens} from '../../gens';
import {Result, Notation, KOType} from '../../result';

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
  recovery?: number | [number, number];
  recoil?: number | [number, number];
  crash?: number | [number, number];
  desc?: string;
  result?: string;
}

expect.extend({
  toMatch(
    received: Result,
    gen: Generation,
    notation?: Notation | ResultDiff,
    type?: KOType | ResultDiff,
    diff?: ResultDiff
  ) {
    if (typeof notation !== 'string' && typeof notation !== 'number') {
      diff = notation;
      notation = '%';
      type = 'both';
    } else if (typeof type !== 'string') {
      diff = type;
      type = 'both';
    }

    if (!diff) throw new Error('toMatch called with no diff!');

    const breakdowns = Object.entries(diff).sort();
    const expected = {
      range: undefined! as [number, number],
      recovery: undefined! as [number, number],
      recoil: undefined! as [number, number],
      crash: undefined! as [number, number],
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

    for (const key of ['range', 'recovery', 'recoil', 'crash'] as const) {
      if (expected[key]) {
        if (this.isNot) {
          expect(received[key]).not.toEqual(expected[key]);
        } else {
          expect(received[key]).toEqual(expected[key]);
        }
      }
    }

    const text = received.text(type, notation);
    const colon = text.lastIndexOf(':');
    const desc = text.slice(0, colon);
    const result = text.slice(colon + 2);

    if (expected.desc) {
      if (this.isNot) {
        expect(desc).not.toEqual(expected.desc);
      } else {
        expect(desc).toEqual(expected.desc);
      }
    }
    if (expected.result) {
      if (this.isNot) {
        expect(result).not.toEqual(expected.result);
      } else {
        expect(result).toEqual(expected.result);
      }
    }

    return {pass: !this.isNot, message: () => ''};
  },
});
