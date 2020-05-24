# Design

## Motivation

The [logic packaged into `@smogon/calc`](https://github.com/smogon/damage-calc/blob/master/calc)
looks substantially different than the [original code Honko
wrote](https://github.com/smogon/damage-calc/commit/5de3119428112d2a1682e914986ae11880493834), and
it has incrementally improved over time. However, there are still a number of shortcomings:

- lots of **logic is duplicated between the mechanics files** - too many low level concerns are
  mixed together with the high level calculation flow meaning its difficult to see differences in
  modification ordering between generations.
- **feature/completeness gap** - lots of niche side conditions/pseudo weathers/volatiles are not
  currently supported, many moves/abilities/items have partial implementation
- constrained to an **ES3 target** (eg. no support for getters)
- **relevancy tracking is error prone** (ie. remembering to update `RawDesc`)
- the **UI's data layer and its
  [quirks](https://github.com/smogon/damage-calc/blob/master/calc/src/test/gen.ts)** are bundled
  into the calculator
- the package was extracted from the UI code and **not designed for machine consumption** to begin
  with, so there are gaps in supporting certain features (eg. programmatic `recoil` and `recovery`
  tracking, making use of the `RawDesc` for relevancy tracking, etc) **- poor multihit handling**
  (in particular, interplay of multihit moves and abilities/items) and **OHKO chance** logic

## Goals

Like [all `@pkmn` projects](https://pkmn.cc/@pkmn), `@pkmn/dmg` prioritizes **accuracy**,
**consistency**, **compatibility** and **completeness**.

- build on the **correct primitives and architecture** - consider the design at a higher level and
  attempt to solve the existing shortcomings from a clean slate. Attempt to make relevancy tracking,
  multihit, OHKO chance etc easier to solve by restructuring
- **begin from the research/decompiled code**: when implementing, find the research first. Use
  Pokémon Showdown or the existing `@smogon/calc` for ideas on how to implement said
  research/verification (though look to simplify/improve/make more consistent), but if the research
  and existing implementation differ look for clarification (or go to the cartridge!). Favor
  trusting the research and not the existing implementations. If you notice bugs in the reference
  implementations, try to contribute fixes back upstream.
- **maximize compatibility with `@pkmn/sim` / `@pkmn/client`** data types so they can use
  `@pkmn/dmg` with zero/minimal cost
- **shape API so that it can be used by `@pkmn/gmd` to efficiently perform reverse damage
  calculations** (though without increasing complexity for the standard forward calculation use
  case)
- **maintain compatibility with `@smogon/calc`** - the `@smogon/calc` package should be able to wrap
  `@pkmn/dmg` and continue supporting its clients

### Non-Goals

- first class support for 'mods' ie. non-canonical data or mechanics. Developers should be able to
  build *on top* by wrapping the package or provide their own data layer with non-canonical
  information underneath, and allowances will be made to make it possible to override functionality
  as much as possible (eg. custom data, handler functions, mechanics). Support for these 'hooks' for
  mods is a secondary priority and will only be supported in places where it has zero impact on the
  common use case.
- 'completeness' with respect to cascading `apply`  (see below). This is a conscious decision to
  limit scope - to 'fully' implement a general purpose `apply` results in effectively recreating the
  entire game engine. `apply` exists as a convenience feature for UIs to more thoroughly replace
  `@smogon/calc`'s '`check`' architecture, not to simulate the entire game state perfectly.

## Features

- **handler-based architecture** (ie. similar to cartridge 'triggers' and Pokémon Showdown's
  misleadingly named `data/` directory) which is more scalable and general purpose than large `if`
  conditions. This comes at the cost of some function call overhead but provides a much easier way
  to scale the design and remove duplicated work. Unlike Pokémon Showdown, handlers should share
  code where possible and handle all generations logic lives the same place (eg. the handler
  function for `Intimidate` covers all generations of `Intimidate`, and generational differences can
  be handled by gating on `gen.num`. Having a common handler infrastructure means certain things can
  be handled automatically (eg. tracking relevancy of abilities or items if their handler returns a
  value).
- Convenience **`apply` helpers**. In addition to triggers, abilities/items/moves may also contain
  `apply` helpers which mutate the `State`. `@smogon/calc` currently is built around a '`check`'
  architecture and `abilityOn`, where certain additional state mutations are performed before a
  calculation for convenience. eg: selecting a Gyarados with Intimidate and then toggling the
  ability as on will cause the calculator to cause its opponent to have -1 attack. With the `apply`
  architecture, each ability/item/move that could modify the `State` before a calculation can be
  `apply`-ed to the `State`, causing the mutation to take place. In a UI, an ability/item/move that
  has an `apply` function could be rendered as a button or made clickable in some way, such that
  clicking the element causes the `apply` function to run and the `State` to be mutated. For
  example: instead of toggling Intimidate as 'on' and having it apply a one time de-buff under the
  hood, the UI will simply update to reflect the `State` after Intimidate has been applied: the
  opponent will have -1 Atk. This generalizes well to status moves that the calc doesn't currently
  support today - clicking Swords Dance would give the user +2 Atk.
- [**calculations parsed from  text**](https://github.com/pkmn/dmg/blob/PARSER.md) in addition to
  programmatic usage. Improved relevancy tracking means calculations can be *canonicalized*
  (stripped of non-essential details) and then turned into a terse, human readable string which
  approaches the existing human readable output. This has implications for use in browsers (to
  easily share calculations statelessly by [embedding the required information in the
  URL](https://github.com/pkmn/dmg/blob/PARSER.md#url-encoding) or allowing it
  to be easily pasted), chat clients/CLI interfaces and importing, [testing](#testing).

## Details

### Data

- The full `@pkmn/data` API (which supports a pluggable `@pkmn/dex` or `@pkmn/sim` data layer) will
  be used as the data API and will replace the `@smogon/calc/data/interface`. The full `@pkmn/dex`
  package (the recommended choice of `Dex`-API based data layer for `@pkmn/data`) is 4x the size of
  `@smogon/calc/data`, however, users are required to provide their own `Dex` implementation so are
  empowered to trim down `@pkmn/dex` or repurpose `@smogon/calc/data` if they desire.

### Classes

 Like with `@smogon/calc`, `Pokemon`, `Move` and `Side`/`Field` are the core classes/interfaces, and
 similarly to `@smogon/calc` there are more than one of each.

- The classes in **`State`** are meant to serve
  '[POJOs](https://en.wikipedia.org/wiki/Plain_old_Java_object)'/JSON-compatible **input**
  interfaces (note: `State` itself isn't an interface, though purposefully has no methods so that it
  cant be *treated* as an interface per standard TypeScript semantics). This is meant to map to a
  subset of the corresponding `@pkmn/client` types (so the client's `Pokemon` implements the calc's
  `State.Pokemon` etc) to allow for a zero-cost interoperability between `@pkmn` packages. This maps
  relatively closely the purpose of [`State` in
  `@smogon/calc`](https://github.com/smogon/damage-calc/blob/master/calc/src/state.ts).
- There exist *convenience factory methods and helpers* for creating/modifying `State` objects in a
  more user-friendly manner, eg. to compute `stats` based on base stats and spread, to compute to
  appropriate Hidden Power, Gen 1/2 HP DVs, etc.
- The **`Relevancy`** serves as a sort of 'trace' of the structure of `State`, only all of its
  fields which are not objects are `boolean`. This is use to track whether a certain field of the
  input `State` was relevant for the calculation (and thus should be included in the output
  description or be present in the canonical representation of the calculation state). This is
  analogous to [`RawDesc` in
  `@smogon/calc`](https://github.com/smogon/damage-calc/blob/master/calc/src/desc.ts), only it has
  the same 'shape' as the input `State`.
- After `State` has been finalized (for example, the user has mutated the `State` to her desire by
   manually modifying fields or `apply`-ing helpers), it is turned into a **`Context`** via
   `Context.fromState`. This change serves several purposes:
  - to copy all of the data from `State` to avoid mutating it during calculation (eg. to change
     *perspective* or to modify features temporarily as they make the resulting calculations
     simpler, eg. simplify setting an ability or item as undefined as opposed constantly needing to
     check another field to see if an ability or item is suppressed).
  - to attach handlers and set up automatic *relevancy tracking* (ie. mutate the `Result`'s
    `Relevancy` object) for abilities and items.

 ==**TODO**== the `State` / `Context` divide is in flux, ideally these concepts could be merged
 (make `Pokemon.item?: ID` -> `Pokemon.item?: {id: ID}` to then allow for it to be trivially copied
 and extended with handlers?

The `@smogon/calc` somewhat blurs the line between these the convenience helpers, `State` and
`Context`, as the constructors of its classes performances convenience functionality, classes are
required to have a `clone` method to deep copy fields, `swap` exists on `Field` only, etc.

### Handlers

 ==**TODO**==

#### Helpers

#### Triggers


----

##### `is`/`has`

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
onerous to jusity a small improvement in typesafety.

##### `math`

In addition to providing fundamental Pokémon math function like `pokeRound`,
[`math.ts`](src/math.ts) re-exports methods off of `Math`. This is mainly useful for conveniently
aliasing these methods to a short form while importing, but also ensures that if you do `import * as
math` you don't have to mix and match between `Math` and `math`. As such, prefer `math` function
over `Math` everywhere.
