import * as assert from 'assert';

import {Specie} from '@pkmn/data';

import {State} from '../../state';

/**
 * Workaround for asserting equality between between two `State` objects.
 *
 * Jest's `toEqual` and assert's `deepStrictEqual` choke on the circular references in `State` and
 * fail to terminate. Instead, this helper compares the objects piecemeal, strict comparing the
 * problematic fields and temporarily mutating the fields to work around the issues. `assert` is
 * used here as opposed to `expect` to faciliate use in the integration runner which does not run
 * in the Jest enviroment.
 */
export function assertStateEqual(a: State, b: State) {
  assert.strictEqual(a.gen, b.gen);
  assert.strictEqual(a.gameType, b.gameType);
  assert.deepStrictEqual(a.field, b.field);

  const A = {p1: a.p1.pokemon.species, p2: a.p2.pokemon.species};
  const B = {p1: b.p1.pokemon.species, p2: b.p2.pokemon.species};
  try {
    assert.strictEqual(a.p1.pokemon.species, b.p1.pokemon.species);
    a.p1.pokemon.species = b.p1.pokemon.species = undefined! as Specie;
    assert.strictEqual(a.p2.pokemon.species, b.p2.pokemon.species);
    a.p2.pokemon.species = b.p2.pokemon.species = undefined! as Specie;

    assert.deepStrictEqual(a.p1, b.p1);
    assert.deepStrictEqual(a.p2, b.p2);
    assert.deepStrictEqual(a.move, b.move);
  } finally {
    a.p1.pokemon.species = A.p1;
    a.p2.pokemon.species = A.p2;
    b.p1.pokemon.species = B.p1;
    b.p2.pokemon.species = B.p2;
  }
}
