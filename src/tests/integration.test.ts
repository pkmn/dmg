import * as integration from './helpers/integration';

describe.skip('integration', () => {
  test('run', () => {
    expect(() => integration.run()).not.toThrow();
  });
});
