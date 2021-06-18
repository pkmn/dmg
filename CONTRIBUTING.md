# Contributing

Please read through the [README](README.md) and [pkmn.cc/@pkmn](https://pkmn.cc/@pkmn/) for general
information about `@pkmn/dmg` and about development on `@pkmn` projects respectively. When opening
issues or pull requests, please use one of the existing templates and fill them out to the best of
your ability. Pull requests will not be merged without tests - please read the [testing
documentation](TESTING.md) about how to get started with testing.

## Design

At a high level, `calculate` is provided with a `State` object (possibly [parsed from
text](PARSING.md)) which it decorates with 'handlers' in the process of copying it into a `Context`
object housed in the `Result` which then gets mutated over the course of performing the damage
calculation. At each step of the damage calculation logic, various handlers may be called to perform
mutations or compute modifiers. After the damage has been computed, the `Result` object may be
queried for descriptions of the results or used to compute OHKO chances.

### `Pokemon` (`State`, `Context`, `Relevancy`, `Scope`)

Not satisfied with just one `Pokemon` class, `@pkmn/dmg` has *several* concepts all named
`Pokemon` (and `Side`, and `Move`, and `Field`).

- **`State`** is the main definition of each of the 'big 4' interfaces
  (`Pokemon`/`Side`/`Move`/`Field`), and defines the **external API** - these interfaces are the
  **input** to the calculator. `State`'s interfaces are meant to be
  '[POJOs](https://en.wikipedia.org/wiki/Plain_old_Java_object)'/JSON-compatible (note: `State`
  itself isn't an interface, though purposefully has no methods so that it cant be *treated* as an
  interface per standard TypeScript semantics). `State` is meant to map to a subset of the
  corresponding `@pkmn/client` types (so the client's `Pokemon` implements the calc's
  `State.Pokemon` etc) to allow for a zero-cost interoperability between `@pkmn` packages. This maps
  relatively closely the purpose of [`State` in
  `@smogon/calc`](https://github.com/smogon/damage-calc/blob/master/calc/src/state.ts).
  - `State` also houses a number of convenience helper methods which can be used to **create** an
    object adhering to the `Pokemon` or `Move` interface. These methods assume sensible defaults and
    perform verification of the objects they build to assure that they are legal. This is the
    simplest and most common way to programmatically build `State` objects.
- **`Context`** is a glorified wrapper of `State` which serves two purposes: to **copy** all of the
  data from `State` to avoid mutating it during calculation (eg. to change *perspective* or to
  modify fields temporarily to make the resulting calculations simpler, eg. simplify setting an
  ability or item as `undefined` as opposed constantly needing to check another field to see if an
  ability or item is suppressed) and to **'reify'** the `State` by attaching handlers and setting up
  automatic *relevancy tracking*. `Context` is the **internal API** for calculation logic (though
  `State` is often manipulated internally outside of the calculation flow as well).
- **`Relevancy`** serves as a sort of '**trace**' of the structure of `State`, only all of its
  fields which are not objects are `boolean`. This is used to track whether a certain field of the
  input `State` was relevant for the calculation (and thus should be included in the output
  description or be present in the canonical representation of the calculation state). This is
  analogous to [`RawDesc` in
  `@smogon/calc`](https://github.com/smogon/damage-calc/blob/master/calc/src/desc.ts), only unlike
  `RawDesc` it has the same 'shape' as the input `State`. Note that `Context`/`Result` actually
  contains **two** `Relevancy` fields - `relevant` tracking properties relevant to the damage rolls
  and `residual` which tracks properties related to tracking end of turn damage/recovery (which
  factors into KO chance calculation).
- **`Scope`** is yet another place where `Pokemon` and `Move` appears to crop up, though these are
  simply fancy wrappers around the `State.createPokemon` and `State.createMove` helper methods
  discussed above which already have a `Generation` bound. These are methods, not interfaces, and
  are purely syntactic sugar. There is no `Field` helper method because `Field` is trivial to
  create, almost always optional, and does not require a `Generation` parameter.

### Handlers

`@pkmn/dmg`'s mechanics handlers looks similar to Pokémon Showdown's event handlers (and are even
named similarly), but several differences exist:

- handlers only implement a small number of methods instead of the hundreds of the full fledged
  simulator
- a handler's parameters and return values differ from Pokémon Showdown
- a single handler function is responsible for **all generations** of behavior - ie. `@pkmn/dmg`
  uses `if (gen.num === N)` statements ito keep all the functionality localized instead of split
  across multiple files
- common code should be shared between game objects as much as possible - abstract out common
  functionality into helper functions and share the logic between objects

### `p1` and `p2`

`@pkmn/dmg`'s convention for side naming is to use `'p1'` and `'p2'`. These are the `SideID`s from
Pokémon Showdown for two-player battles, and have the benefit of being succinct. `@smogon/calc` uses
`'attacker'` and `'defender'`, which is a logical choice, but these names are not used in
`@pkmn/dmg` due to potential confusion between the `Side` and the `Pokemon` (in `@smogon/calc` the
`Side` is a member of the `Field`, not its own construct housing a `Pokemon` like `@pkmn/dmg` or
Pokémon Showdown). Furthermore, while `'attacker'` and `'defender'` are the obvious names for the
unidirectional damage calculation's protagonists they become confusing in some methods when `'p1'`
and `'p2'` switch directions. `'p1'` and `'p2'` describe *perspectives* whereas in the damage
calculation there is always only one Pokémon attacking and another defending - any scenario where we
are calling the attacker `'defender'` is troubling.

Pokémon Showdown often uses `'source'` and `'target'`, which are less loaded than `'attacker'` and
`'defender'` (though also longer to type than `'p1'` and `'p2'`), but these still have slightly
troubling extra semantics that `'p1'` and `'p2'` are less likely to have - in the damage calculator
the *side* is not the 'source' or 'target' of something, a specific aspect of the side (its Pokémon,
item, ability, etc) is what the actual 'source' or 'target' of an operation is.

### `is`/`has`

`is` and `has` in [`utils.ts`](src/utils.ts) are widely used convenience helpers function used to
make `===` and `includes` checks more succint and readable. While there is some overhead associated
with the function call and spread args, they should almost always be used in favor of `includes` and
can also be used to replace `===` depending on the author's preference (rule of thumb - if theres a
good possibility someone might want to add more equality checks later use `is` instead of `===`).

Both `is` and `has` take the same type of second argument, but `is` takes a scalar first argument
vs. `has` which takes an array as its first argument. While its possible to implement a single
function that covers both arrays and scalars (or a function which supports non-`string` arrays)
fairly trivially, `is` and `has` are primarly used for increased readability and the restricted
domain of the functions encourages them to be used in a way which results in the most readable code.

**`is` and `has` are not typesafe**, but the extra security from branded types (`ID`, `MoveName`,
etc) is seen to be less valuable - something like `foo.id === 'Not Id'` already doesn't result in
a compilation error, and the the ceremony of `is(id, 'foo' as ID, 'bar' as ID)` is seen as too
onerous to justify the small improvement in typesafety.

### `math`

In addition to providing fundamental Pokémon math function like `roundDown`,
[`math.ts`](src/math.ts) re-exports methods from `Math`. This is mainly useful for conveniently
aliasing these methods to a short form while importing, but also ensures that if you do `import * as
math` you don't have to mix and match between `Math` and `math`. As such, prefer `math` functions
over `Math` everywhere.

### `apply`

TODO limitations, 100% chance of happening only

### Validation

Validation is performed in various places within the codebase (notably:
`State.createPokemon`/`State.createMove` helpers and `strict` text parsing). In all cases,
**validation is not intended to be exhaustive**. Input validation in `@pkmn/dmg` is 'best effort',
simply intending to make it easier to provide correct input. Validation in these methods can be
improved to be more exhaustive, but there is no obligation to do anything too fancy here.
Furthermore, `@pkmn/dmg` should **never validate the type** of its input - client's are responsible
for not passing in malformed objects that don't match the type signatures (using TypeScript is
strongly recommended to help enforce this) and `@pkmn/dmg` should not attempt to handle malformed
input.

### Performance

`@pkmn/dmg` is sensitive with respect to performance for determining the damage rolls of a hit - the
cost of creating `State`, `Context` and computing the rolls is relevant for interoperability with
`@pkmn/client`, `@pkmn/gmd` and the rest of `@pkmn` projects. Anything outside of this core flow
can decide to make a tradeoff between performance vs. expressibility/convenience/features etc.

### `@pkmn/data`

`@pkmn/dmg` depends on `@pkmn/data`, but this is a type-only (compile time) dependency, **not a
runtime dependency**. `dmg` / `generate-test` and `tests` ultimately need to depend on the
implementation to actually do useful work, but `@pkmn/dmg` should not depend on `@pkmn/data` for
anything other than its interfaces (enforceable through `import type` instead of `import`). This
is only particularly relevant in the case of `toID` - depend on the (duplicated) implementation in
[`src/utils.ts`](src/utils.ts) instead of from `@pkmn/data`. Avoiding any runtime dependencies means
that the bundled code is self contained and much easier for an end user to include in their
projects.
