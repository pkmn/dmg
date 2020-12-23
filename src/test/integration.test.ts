import * as integration from './helpers/integration';

// TODO
describe.skip('integration', () => {
  test('run', () => {
    expect(() => integration.run()).not.toThrow();
  });
});
