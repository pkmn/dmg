import {decodeURL} from '../encode';

describe('encode', () => {
  test('decodeURL', () => {
    expect(decodeURL('{5}')).toBe('[5]');
  });
});
