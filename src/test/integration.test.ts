import * as integration from './helpers/integration';

describe('integration', () => {
  test('run', () => {
    expect(() => integration.run()).not.toThrow();
  });
});
