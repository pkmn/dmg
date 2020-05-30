import * as math from '../math';

describe('Math', () => {
  test('abs', () => { expect(math.abs).toBe(Math.abs); });
  test('min', () => { expect(math.min).toBe(Math.min); });
  test('max', () => { expect(math.max).toBe(Math.max); });
  test('ceil', () => { expect(math.ceil).toBe(Math.ceil); });
  test('floor', () => { expect(math.floor).toBe(Math.floor); });

  test('round', () => {
    expect(math.round(2.4)).toBe(2);
    expect(math.round(2.5)).toBe(3);
    expect(math.round(2.5)).toBe(3);
  });

  test('pokeRound', () => {
    expect(math.pokeRound(2.4)).toBe(2);
    expect(math.pokeRound(2.5)).toBe(2);
    expect(math.pokeRound(2.5)).toBe(3);
  });

  test('clamp', () => {
    expect(math.clamp(-6, -8, 6)).toBe(-6);
    expect(math.clamp(-6, 0, 6)).toBe(0);
    expect(math.clamp(0, 1023, 999)).toBe(999);
  });

  test('trunc', () => {
    expect(math.trunc(65.124)).toBe(65);
    expect(math.trunc(0xFFFF + 1)).toBe(0xFFFF + 1);
    expect(math.trunc(0xFFFF + 1, 16)).toBe(0);
    expect(math.trunc(0xFFFFFFFF)).toBe(0xFFFFFFFF);
    expect(math.trunc(0xFFFFFFFF + 1)).toBe(0);
  });

  // test('chainMod', () => {
  //   // TODO expect(math.chainMod(...)).toBe(...);
  // });

  // test('applyMod', () => {
  //   // TODO expect(math.chainMod(...)).toBe(...);
  // });
});
