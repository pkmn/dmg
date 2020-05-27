import {override, is, has, extend} from '../utils';

class Foo {
  x: number;
  constructor(x: number) {
    this.x = x;
  }
  bar() {
    return this.x + 1;
  }
}

describe('utils', () => {
  test('override', () => {
    const foo = new Foo(5);
    expect(foo.bar()).toBe(6);
    expect(override(foo, {x: 4}).bar()).toBe(5);
  });

  test('is', () => {
    expect(is('hello', 'hello')).toBe(true);
    expect(is('hello', 'goodbye')).toBe(false);
    expect(is('hello', 'hello', 'goodbye')).toBe(true);
    expect(is('hello', ['hello'])).toBe(true);
    expect(is('hello', ['goodbye'])).toBe(false);
    expect(is('hello', ['hello', 'goodbye'])).toBe(true);
  });

  test('has', () => {
    expect(has(['hello'], 'hello')).toBe(true);
    expect(has(['hello'], 'goodbye')).toBe(false);
    expect(has(['hello'], 'hello', 'goodbye')).toBe(true);
    expect(has(['hello'], ['hello'])).toBe(true);
    expect(has(['hello'], ['goodbye'])).toBe(false);
    expect(has(['hello'], ['hello', 'goodbye'])).toBe(true);
  });

  test('extend', () => {
    const obj1 = {a: 1, b: {c: 2}, d: {e: 3}, f: 4};
    const obj2 = {a: 2, b: {c: 3}, d: 4, e: {f: 5}};

    expect(extend(true, {}, obj1)).toEqual(obj1);
    expect(extend(true, {}, obj1, obj2)).toEqual({a: 2, b: {c: 3}, d: 4, e: {f: 5}, f: 4});
    expect(extend(true, {}, obj2, obj1)).toEqual({
      a: 1,
      b: {c: 2},
      d: {e: 3},
      e: {f: 5},
      f: 4,
    });
  });
});