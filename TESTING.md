# Testing

- Unit tests for logic in `foo.ts` should be named `foo.test.ts` and be placed in the `tests`
  directory with a hierarchy matching `src/`
- the majority of tests will be in `tests/mechanics/{abilities,items,moves}.ts`, as the majority of
  code lives in the these handlers
  - if logic is shared between multiple handlers it only needs to be tested once
  - tests typically involve multiple variables (species, abilities, EVs, items, moves, etc) - try to
    avoid testing more than one thing at once where possible (this also helps make it more clear
    which file a test belongs in)
  - tests should be named based on the the primary trigger/mechanic they are testing
- Tests should use `tests` (as opposed to `it` or `test`) by default, which will run through all
  gens from `min` to `max` (optional and default to `1` and `8` respectively and suffix `' (gen N)'`
  onto each test case. Using `inGens` and `test` manually is discouraged.
  - because the tests are run through all gens specified, the data must exist in each gen (sometimes
    tricky with Dexit!)
- [Table driven testing](https://github.com/golang/go/wiki/TableDrivenTests) is preferred, and the
  custom `toMatch` helper should be used to simplify tests
- Using a calculation description is preferable to manually creating objects as its terser and more
  readable (and exercises the parser!)
- All PRs should come with tests, and the `master` branch is [protected, may not be pushed to
  directly and requires status checks to pass before
  merging](https://github.blog/2015-09-03-protected-branches-and-required-status-checks/).
- `@smogon/calc`'s old testing syntax is still possible (though discouraged) in `@pkmn/dmg`

## Old

```ts
inGens(1, 8, ({gen, calculate, Pokemon, Move}) => {
  test(`Mulihit (gen ${gen})`, () => {
    const result = calculate(Pokemon('Snorlax'), Pokemon('Vulpix'), Move('Comet Punch'));
    if (gen < 3) {
      expect(result.range()).toEqual([36, 43]);
      expect(result.desc()).toBe(
        'Snorlax Comet Punch (3 hits) vs. Vulpix: 108-129 (38.7 - 46.2%) -- approx. 3HKO'
      );
    } else if (gen === 3) {
      expect(result.range()).toEqual([44, 52]);
      expect(result.desc()).toBe(
        '0 Atk Snorlax Comet Punch (3 hits) vs. 0 HP / 0 Def Vulpix: 132-156 (60.8 - 71.8%) -- approx. 2HKO'
      );
    } else {
      expect(result.range()).toEqual([43, 52]);
      expect(result.desc()).toBe(
        '0 Atk Snorlax Comet Punch (3 hits) vs. 0 HP / 0 Def Vulpix: 129-156 (59.4 - 71.8%) -- approx. 2HKO'
      );
    }
  });
});
```

## New

```ts
tests('Comet Punch', ({gen, calculate}) => {
  // TODO: support just a range [number, number] to just a single resultdiff without gen (all gens in range)
  expect(calculate('Snorlax [Comet Punch] vs. Vulpix')).toMatch(gen, {
    1: {range: [36, 43], desc: 'Snorlax Comet Punch (3 hits) vs. Vulpix', result: '(38.7 - 46.2%) -- approx. 3HKO'},
    3: {range: [44, 52], desc: '0 Atk Snorlax Comet Punch (3 hits) vs. 0 HP / 0 Def Vulpix', result: '(60.8 - 71.8%) -- approx. 2HKO'},
    4: {range: [43, 52], result: '(59.4 - 71.8%) -- approx. 2HKO'},
  });
});
```

## Newest

```
$ generate-test lax [comet punch] vs vulpix
```