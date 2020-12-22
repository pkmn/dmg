# Testing

Most logic, in particular damange calculation results, should be [incredibly easy to
test](#generate-test) and thus **tests are expected to accompany all pull requests**. The `master`
branch of `@pkmn/dmg` is [protected, may not be pushed to directly, and requires status checks to
pass before merging](https://github.blog/2015-09-03-protected-branches-and-required-status-checks/).

- Unit tests for logic in `foo.ts` should exist in a file  named `foo.test.ts` in the `src/tests/`
  directory with a **hierarchy mirroring the location of `foo.ts` in `src/`**. The majority of tests
  should be in one of the files in `src/tests/mechanics/`, as the majority of code lives there.
- Tests should ideally be **as focused as possible and only test one 'variable'** (species,
  abilities, EVs, items, moves, etc), however, this is often impossible given how interlinked
  Pokémon's mechanics are.
- Tests should be **named after the primary trigger/mechanic/interaction** they are meant to be
  testing.
- **Prefer realistic test setups** - chose Pokémon / move / ability / item combinations that are
  valid and occur during regular battles. This is not strictly required, but makes for much more
  intuitive test cases.
- **Favor [table driven testing](https://github.com/golang/go/wiki/TableDrivenTests)** - Jest has
  support for table driven tests with `.each(...)`, but `inGens`/`tests`/`toMatch` should be
  preferred in `@pkmn/dmg`

## `inGens`

**Mechanics tests in `@pkmn/dmg` should be multi-generational by default.** This means most tests
are going to involve looping over the various generations the testing scenario is valid for and
verifying the behavior in each generation. This quickly becomes cumbersome, so
[`inGens`](src/gens.ts) exists to make this easy:

```ts
inGens(1, 8, ({gen, calculate, Pokemon, Move}) => {
  test(`Comet Punch (gen ${gen})`, () => {
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

`inGens` calls `inGen` under the hood which calls a function with a `Scope` that includes helper
functions for `calculate` / `Pokemon` / `Move` / etc which already have `gen: Generation` bound,
allowing the developer not to have to pass in a `gen` all over the place. Note: in general you
should prefer `calculate` parsing instead of manually using `Pokemon` / `Move` calls, and in
scenarios where that is not sufficient you should prefer `state = parse('...')` and then modify
`state` directly.

One 'gotcha' with multi-generational tests in general is that **the data types being referenced in
the test must exist for the entirety of the generation range**. Among other implications, this
means:

- tests with held items cannot include Generation 1
- tests with abilities cannot include Generation 1 or 2
- tests with Pokémon/items/abilities/moves which were removed in Generation 8 will need to stop at
  Generation 7.

Tests with IVs/EVs still work in Generations 1 and 2, though they are a little artificial because it
is fairly rare that these fields would not be maximized in those generations. Because of these
restrictions, most test cases are going to involve a lot of repeated characters, eg:
`Venusaur`, `Charizard`, `Blastoise`, `Pikachu`, `Clefable`, `Gengar`, `Gyarados`, `Mew`, `Snorlax`,
`Cloyster` appear as the combatants in a lot of tests.

## `tests`

`inGen`/`inGens` can be useful even outside of testing, but unfortunately result in fairly verbose
tests. [`tests`](src/tests/helper.ts) is an even more powerful test-only helper function which can
be used to streamline the tests above even further:

```ts
tests('Comet Punch', ({gen, calculate}) => {
  expect(calculate('Snorlax [Comet Punch] vs. Vulpix')).toMatch(gen, {
    1: {range: [36, 43], desc: 'Snorlax Comet Punch (3 hits) vs. Vulpix', result: '(38.7 - 46.2%) -- approx. 3HKO'},
    3: {range: [44, 52], desc: '0 Atk Snorlax Comet Punch (3 hits) vs. 0 HP / 0 Def Vulpix', result: '(60.8 - 71.8%) -- approx. 2HKO'},
    4: {range: [43, 52], result: '(59.4 - 71.8%) -- approx. 2HKO'},
  });
});
```

`tests` will run through all gens from `min` to `max` (which, like with `inGens`, are optional and
default to `1` and `8` respectively) and suffix `' (gen N)'` onto each test case. `tests` is
preferred everywhere in `@pkmn/dmg`, **using `inGens` and `test` manually is discouraged**. In this
sort of test, only the diffs in gens where results change need to be specified, making for very
terse and readable tests. `recoil` and `recovery` can also be specified in the same format as
`range`. While test cases covered by `tests` are incredibly prevalent in `src/tests/mechanics`, very
few if any will have been written by hand - instead, these will have most likely been generated by
`generate-test`.

## `generate-test`

The `generate-test` program can be used to automatically write `tests`-style regression tests. The
`tests` example above can be further reduced to:

```sh
$ generate-test lax [comet punch] vs vulpix
```

Under the hood, `generate-test` parses the scenario provided, figures out which generations it is
valid for and what the results should be based on what is produced by either the `@pkmn/dmg` or the
`@smogon/calc` backend (see below) and outputs a `tests`-block to verify the output.

To use `generate-test`:

1. Decide whether to run the test against the `@pkmn/dmg` backend (ie. use `dmg` as the first
   argument to `generate-test` or don't pass in a backend) or `@smogon/calc` (by using `calc` as
   the first positional argument to `generate-test`).
2. Describe the testing scenario as minimally as possible and pass it to `generate-test`.
3. Copy the output of `generate-test` into the appropriate file in `src/test/mechanics/` and rename
   the test from `'TODO'` to something more informative.
4. **VERIFY THAT THE OUTPUT OF `generate-test` IS CORRECT** - `generate-test` is **not** perfect,
   and neither are the backends. Blindly copying `generate-test` output and expecting it to work
   100% of the time is going to cause problems - **the generator merely exists to generate
   boilerplate**, not to allow you to mindlessly churn out test cases.

### Caveats

`generate-test` can only generate a very specific type of regression test - if the test backend it
relies on returns incorrect results, the generated test will be testing incorrect behavior! This is
especially obvious if the `@pkmn/dmg` backend is being used, as it effectively means `generate-test`
will generate a test that just validates the current behavior of `@pkmn/dmg` (behavior which may be
incorrect). `@smogon/calc` as a backend is slightly better as then there is at least *some*
independent verification of the results produced, but `@smogon/calc` has its own host of bugs and
limitations. **You should place very little trust in the results of `generate-test`** - the tests
passing or failing do not necessarily imply the code being tested is actually correct - verify the
results against the research and the decompiled source, or failing that Pokémon Showdown and the
Long Form Damage Calculator (the latter two which *also* could be incorrect).

`generate-test` also has several other limitations:

- `recoil` breakdown diffs are not generated when using the `@smogon/calc` background (due to
  `@smogon/calc`'s poor handling of recoil), these will need to be manually added to the produced
  diff.
- the encoded test scenario is *not* simplified automatically (`@smogon/calc` doesn't generate a
  `Result` that can be `.simplified()`, and some extraneous details for one generation may be
  relevant in another), so it is up to the author to avoid including redundancies in the test
  string.
- `generate-test` <s>may have</s> almost certainly has bugs - pay close attention to the generation
  ranges selected and that the breakdowns are minimal and logical. You may find it necessary to fix
  `generate-test` itself in the process of testing something else.

## Integration

TODO - also cover above how `generate-test` performs integration testing on the spot?

## Coverage

Test coverage is a metric that always needs to be taken with a grain of salt, but `npm test --
--coverage` can be used to generate a coverage report. 100% statement/branch coverage does *not*
imply '100% tested', and in many cases attempting to acheive 100% statement or branch coverage is
going to result in a lot of low value tests. Use coverage reports as a guide to see which areas may
benefit from more testing, not as a target.
