<p align="center">
  <img alt="dmg" width="192" height="192" src="https://pkmn.cc/dmg.png" />
  <br />
  <br />
  <a href="https://github.com/pkmn/dmg/actions/workflows/test.yml">
    <img alt="Test Status" src="https://github.com/pkmn/dmg/workflows/Tests/badge.svg" />
  </a>
  <img alt="WIP" src="https://img.shields.io/badge/status-WIP-red.svg" />
  <a href="https://github.com/pkmn/dmg/tree/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
</p>
<hr />

The most accurate and complete multi-generational Pokémon damage calculator package.

`@pkmn/dmg` is the spiritual successor of the `@smogon/calc` library, designed from scratch to be
compatible with the [`@pkmn`](https://github.com/pkmn) ecosystem and based around a scalable
architecture familar to Pokémon Showdown developers. In addition to the improvements made to
architecture and correctness, `@pkmn/dmg` features:

- sophisticated [**text parsing**](PARSING.md) support and the **ability to canonicalize and encode
  calculations**
- generalized pre-computation [**state manipulation**](#appliers) through the **'application' of
  effects**
- **comprehensive multi-hit** support and [**KO chance**](#ko-chance) calculation, enabling
  ['**chained**'](#chaining) calculations
- improved [**programmatic support**](#library) for **recoil, recovery, and crash** results
- **non-intrusive support for [mods](#mods)** overriding data or effects
- extensive **tests** build on state-of-the-art [**multi-generational testing
  infrastructure**](TESTING.md)

## Installation

```sh
$ npm install @pkmn/dmg
```

Alternatively, as [detailed below](#browser), if you are using `@pkmn/dmg` in the browser and want a
convenient way to get started, simply depend on a transpiled and minified version via
[unpkg](https://unpkg.com/) (`@pkmn/dex` and `@pkmn/data` are required dependencies of `@pkmn/dmg`):

```html
<script src="https://unpkg.com/@pkmn/dex"></script>
<script src="https://unpkg.com/@pkmn/data"></script>
<script src="https://unpkg.com/@pkmn/dmg"></script>
```

## Usage

### Library

`@pkmn/dmg`'s main API is the `calculate` function which takes in [`State`](src/state.ts) and
returns a [`Result`](src/result.ts).

`@pkmn/dmg` is data-layer agnostic - thanks to its dependency on
[`@pkmn/data`](https://github.com/pkmn/ps/tree/master/data) it simply requires a Pokémon Showdown
compatible `Dex`-type implementation to be provided to `@pkmn/data`'s `Generations` constructor
([`@pkmn/dex`](https://github.com/pkmn/ps/tree/master/dex) is the recommended choice here, though
note that as it is fully featured it is ~4x the size of `@smogon/calc/data` and certain applications
may wish to preprocess the JSON files to trim unnecessary fields).

`State`'s helper functions, `State#createPokemon` and `State#createMove` are the recommended ways
to initialize the input data structures required for `calculate` - these functions provide a
convenient way to avoid having to specify all of the fields while also performing basic integrity
checking. Objects compatible with the `State` interface can be provided instead, though this is
mostly relevant for applications which already have their own battle state representation
(eg. [`@pkmn/client`](https://github.com/pkmn/ps/tree/master/client)).

```ts
import {Dex} from '@pkmn/dex'
import {Generations} from '@pkmn/data';
import * as dmg from '@pkmn/dmg';

const gens = new Generations(Dex);
const gen = gens.get(4);
const result = dmg.calculate(
  gen,
  dmg.State.createPokemon(gen, 'Gengar', {item: 'Choice Specs', nature: 'Modest', evs: {spa: 252}}),
  {
    pokemon: dmg.State.createPokemon(gen, 'Blissey', {evs: {hp: 252, spd: 252}}),
    sideConditions: {spikes: {level: 2}, stealthrock: {}},
  }
  dmg.State.createMove(gen, 'Focus Blast'),
  {weather: 'Sandstorm', pseudoWeather: {}}
);
```

This can be further simplified by using the scoped [`inGen`](src/gens.ts) helper:

```ts
const result = dmg.inGen(gens.get(4), ({calculate, Pokemon, Move}) =>
  calculate(
    Pokemon('Gengar', {item: 'Choice Specs', nature: 'Modest', evs: {spa: 252}}),
    {
      pokemon: Pokemon('Blissey', {evs: {hp: 252, spd: 252}}),
      sideConditions: {spikes: {level: 2}, stealthrock: {}},
    }
    Move('Focus Blast'),
    {weather: 'Sandstorm', pseudoWeather: {}}
  );
);
```

Above is a more advanced example demonstrating how `Side` or `Field` conditions would be
specified, the common case looks more similar to the following:

```ts
const result = dmg.inGen(gens.get(4) , ({calculate, Pokemon, Move}) =>
  calculate(
    Pokemon('Gengar', {item: 'Choice Specs', nature: 'Modest', evs: {spa: 252}}),
    Pokemon('Blissey', {evs: {hp: 252, spd: 252}})
    Move('Focus Blast')
  );
);
```

The `Result` returned by `calculate` contains information about damage rolls, recoil or
drain/recovery information, end of turn residual data, and detailed KO chance breakdowns, all
available in machine-friendly formats for programmatic usage (compared to `@smogon/calc`, where less
indepth human-friendly text is provided). The familiar human-friendly output can be obtained as
well by encoding the `Result` into the desired format.

### CLI

The [`dmg`](dmg) binary can be used to perform damage calculations via the command line.

```sh
// FIXME improve these to match actual output and encoding

dmg +1 252 SpA Gengar @ Choice Specs [Focus Blast] vs. 0 HP / 172+ SpD Blissey --gen=4
+1 252 SpA Choice Specs Gengar Focus Blast vs. 0 HP / 172+ SpD Blissey: 362-428 (55.6 - 65.7%) -- guaranteed 2HKO after Leftovers recovery

$ dmg gengar [focus blast] vs. blissey gen:6
252 SpA Life Orb Gengar Focus Blast vs. 252 HP / 4 SpD Blissey: 263-309 (36.8 - 43.2%) -- 98.7% chance to 3HKO after Leftovers recovery

$ dmg gen=3 mence @ CB [EQ] vs. cune @ lefties
252+ Atk Choice Band Salamence Earthquake vs. 252 HP / 252+ Def Suicune: 121-143 (29.9 - 35.3%) -- guaranteed 4HKO after Leftovers recovery
```

Like [calc.pokemonshowdown.com](https://calc.pokemonshowdown.com), the CLI relies on predefined sets
and heuristics to minimize the amount of information that needs to be specified in order to perform
a calculation. The [parsing documentation](PARSING.md) covers the syntax in more details. The
optional [`@pkmn/smogon`](https://www.npmjs.com/package/@pkmn/smogon) dependency must be installed
to run `dmg`.

While not required, the first positional argument to `dmg` can be the format ID (eg. `gen7ou` or
`gen8anythinggoes`) which will scope the sets from `@pkmn/smogon` to be drawn from that particular
format (which is especially useful for VGC or Little Cup calculations).

### Browser

The recommended way of using `@pkmn/dmg` in a web browser is to **configure your bundler**
([Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/),
[Parcel](https://parceljs.org/), etc) to minimize it and package it with the rest of your
application. If you do not use a bundler, a convenience `index.umd.js` is included in the
package. You simply need to depend on `./node_modules/@pkmn/dmg/build/index.umd.js` in a
`script` tag (which is what the unpkg shortcut above is doing), after which **`calc` will be
accessible as a global.** You must also have a `Generations` implementation provided, and it must be
loaded before **before** loading the calc:

```html
<script src="./node_modules/@pkmn/dex/build/production.min.js"></script>
<script src="./node_modules/@pkmn/data/build/production.min.js"></script>
<script src="./node_modules/@pkmn/dmg/build/index.umd.js"></script>
```

## Features

### Appliers

`@pkmn/dmg`'s handling of state and the concept of 'appliers' and their `apply` functions is
perhaps the largest innovation `@pkmn/dmg` provides over previous damage calculators. `@pkmn/dmg`'s
appliers are a comphrensive generalization for the ad hoc convenience functionality provided by
existing calculators which contain things like toggles to turn 'on' an ability or buttons to boost
stats for moves like 'Geomancy' or 'Extreme Evoboost'.

Abilities/conditions/items/moves which have an effect can have their effect `apply`-ed to modify the
`State` which is then used to perform a damage calculation. This is useful for a UI, as a set with
a move like 'Swords Dance' can be turned into a convenience button to provide a +2 Attack boost when
clicked, or Knock Off's effect can be `apply`-ed to remove a Pokémon's item for future calculations
etc. **There are limitations to `apply`** - `@pkmn/dmg` does not intend to embed a full simulator /
battle engine inside to be able to perfectly update its state. **`apply` is intended for convenience
purposes** - `@pkmn/dmg` aims to be accurate and comprehensive with respect to the `State` it is
provided with, but does not guarantee `apply` will always result in the exact `State` that happened
in battle.

### Chaining

`@pkmn/dmg` handles hits differently than previous calculators - each hit is run through the entire
damage formula (though certain optimizations may be detected) and in between hits, **the context of
the calculation updates based on effects which may be `apply`-ed after each hit**. This design
naturally handles Parental Bond or multihit moves (including interactions like Stamina raising
Defense in between hits or the second hit of Parental Bond benefitting from Power Up Punch's Attack
boost) but also **allows for abitrary moves to be chained together to compute the the result of a
series of attacks**.

Chaining handles the common case of wanting to see what the results of a repeated Overheat or Draco
Meteor might be, but also covers things like Scizor U-turn into Gengar Focus Blast - any results
with the same target can be linked together and the expected KO chance of the joint `Result` is
handled in exactly the same way 2 consecutive hits from eg. a Breloom's Bullet Seed are handled. At
the extreme, this design scales to handle scenarios like Gluttony Sitrus Berry kicking in after a
few hits or Defeatist activating after recoil drops the attacker into the requisite HP range.
Chained moves only deal with **guaranteed** scenarios - ie. effects are only `apply`-ed between
moves if they are guaranteed to occur, either because they have a 100% chance of activating or the
ranges involved guarantee that a certain event would occur.

### KO Chance

== TODO ==

- OHKO chance exact not approx
- pre and post EOT separated out
- rich breakdowns of all results - recoils, multi stages, etc

### Mods

`@pkmn` packages do not intend to ever provide first class support for mods (non-canonical data or
mechanics), however, `@pkmn/dmg` was carefully designed to make it much more extensible for mods
than `@smogon/calc`. Changes to `@pkmn/dmg`'s **data** can be accomplished via:

- the `override` method exposed, which allows for modifying or adding fields to existing data (this
  is effectively the same as the `overrides` parameters some of `@smogon/calc`'s constructors take)
- exposing additional non-canonical data from `@pkmn/data`'s `Generations` class by providing its
  constructor with a custom `exists` function implementation (useful for National Dex or CAP)
- wrapping `@pkmn/dex` and adding in additional data (cf.
  [`@pkmn/mods`](https://github.com/pkmn/ps/tree/master/mods))

Depending on the what your modifications entail you may not be able to make use of the convenience
factory methods `State` provides as they perform some verification of fundamental Pokémon mechanics.
Note, however, that you can always build up a `State` object without using these methods.

`@pkmn/dmg` will only use the `@pkmn/dex-types` fields it is aware of, so additional data fields
should not cause problems. However, if you wish to make use of any new fields or if you simply
wish to change the behavior of various mechanics, `calculate` takes an optional `handlers`
parameter that allows you to extend or override the existing handler **mechanics**. You most likely
will wish to leverage the existing exported `Handlers` object as a base.

If your use case requires more extensive modding capabilities (eg. being able to change around
the core damage flow), please open an issue to describe your use case. If there is sufficient
justification, core parts of the algorithm may be broken up and made moddable in the same way
`Handlers` have been.

## References

### Research

- [the ultimate POKéMON
  CENTER](https://web.archive.org/web/20170622160244/http:/upcarchive.playker.info/0/upokecenter/content/pokemon-ruby-version-sapphire-version-and-emerald-version-timing-notes.html) - Peter O
- [The Complete Damage Formula for Diamond &
  Pearl](https://www.smogon.com/dp/articles/damage_formula) - X-Act, Peterko, Kaphotics
- [The Complete Damage Formula for Black &
  White](https://www.smogon.com/bw/articles/bw_complete_damage_formula) - Xfr, Bond697, Kaphotics,
  V4Victini
- [A Complete Guide to the Damage
  Formula](https://www.trainertower.com/dawoblefets-damage-dissertation/) - DaWoblefet, based on
  work by [OZY](http://bbs10.aimix-z.com/mtpt.cgi?room=sonota&mode=view2&f=140&no=27-29)

### Implementations

- [pret](https://github.com/pret) - disassembly of Gens 1-4
- [Pokémon Showdown!](https://github.com/smogon/pokemon-showdown) - Guangcong Luo (Zarel) and
  contributors
- [Long Form Damage
  Calculator](https://docs.google.com/spreadsheets/d/14XBTYYRp1OK5epQzB3SF2ccdSkuA6Jv7UlRQi66pxkY/edit#gid=1621823916)
  \- SadisticMystic
- [`@pkmn/engine`](https://github.com/pkmn/engine) - pkmn contributors
- [sulcalc](https://github.com/sulcata/sulcalc/) - sulcata
- [relicalc](https://github.com/Corvimae/relicalc) - Corvimae
- [`@smogon/calc`](https://github.com/smogon/damage-calc) - Honko, Austin, and contributors

## License

This package is distributed under the terms of the [MIT License](LICENSE).
