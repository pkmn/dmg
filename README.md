# `@pkmn/dmg`

[![npm version](https://img.shields.io/npm/v/@pkmn/dmg.svg)](https://www.npmjs.com/package/@pkmn/dmg)
![Test Status](https://github.com/pkmn/dmg/workflows/Tests/badge.svg)

The most accurate and complete multi-generational Pokémon damage calculator package.

`@pkmn/dmg` is the spiritual successor of the `@smogon/calc` library, designed from scratch to be
compatible with the [`@pkmn`](https://github.com/pkmn) ecosystem and based around a scalable
architecture familar with Pokémon Showdown developers. In addition to the improvements made to
architecture and correctness, `@pkmn/dmg` features.

- sophisticated [**text parsing**][4] support and the **ability to canonicalize and encode
  calculations**
- generalized pre-computation **state** manipulation through **'application' of effects**
- **comprehensive multi-hit** support and **OHKO chance**
- improved programmatic support for **recoil and recovery** results
- **non-intrusive support for mods** overriding data or effects
- extensive **tests** build on state of the art **multi-generational testing infrastructure**


## Installation

```sh
$ npm install @pkmn/dmg
```

Alternatively, as [detailed below](#browser), if you are using `@pkmn/dmg` in the browser and want
a convenient way to get started, simply depend on a transpiled and minified version via [unpkg][5]:

```html
<script src="https://unpkg.com/@pkmn/dex"></script>
<script src="https://unpkg.com/@pkmn/data"></script>
<script src="https://unpkg.com/@pkmn/dmg"></script>
```

## Usage

### Library

TODO

### CLI

TODO

### Browser

The recommended way of using `@smogon/calc` in a web browser is to **configure your bundler**
([Webpack][6], [Rollup][7], [Parcel][8], etc) to minimize it and package it with the rest of your
application. If you do not use a bundler, a convenience `production.min.js` is included in the
package. You simply need to depend on `./node_modules/@pkmn/dmg/build/production.min.js` in a
`script` tag (which is what the unpkg shortcut above is doing), after which **`calc` will be
accessible as a global.** You must also have a `Generations` implementation provided, and it must be
loaded your data layer **before** loading the calc:

```html
<script src="./node_modules/@pkmn/dex/build/production.min.js"></script>
<script src="./node_modules/@pkmn/data/build/production.min.js"></script>
<script src="./node_modules/@pkmn/dmg/build/production.min.js"></script>
```

## References

### Research

- [the ultimate POKéMON CENTER](https://web.archive.org/web/20170622160244/http:/upcarchive.playker.info/0/upokecenter/content/pokemon-ruby-version-sapphire-version-and-emerald-version-timing-notes.html) - Peter O
- [The Complete Damage Formula for Diamond & Pearl](https://www.smogon.com/dp/articles/damage_formula) - X-Act, Peterko, Kaphotics
- [The Complete Damage Formula for Black & White](https://www.smogon.com/bw/articles/bw_complete_damage_formula) - Xfr, Bond697, Kaphotics, V4Victini
- [A Complete Guide to the Damage Formula](https://www.trainertower.com/dawoblefets-damage-dissertation/) - DaWoblefet, based on work by [OZY](http://bbs10.aimix-z.com/mtpt.cgi?room=sonota&mode=view2&f=140&no=27-29)

### Implementations

- [pret](https://github.com/pret) - disassembly of Gens 1-3
- [Pokémon Showdown!](https://github.com/smogon/pokemon-showdown) - Guangcong Luo (Zarel) and contributors
- [Long Form Damage Calculator](https://docs.google.com/spreadsheets/d/14XBTYYRp1OK5epQzB3SF2ccdSkuA6Jv7UlRQi66pxkY/edit#gid=1621823916) by SadisticMystic
- [`@smogon/calc`](https://github.com/smogon/damage-calc) - Honko, Austin and contributors

## License

This package is distributed under the terms of the [MIT License][3].

  [3]: https://github.com/pkmn/dmg/blob/master/LICENSE
  [4]: https://github.com/pkmn/dmg/blob/master/PARSER.md
  [5]: https://unpkg.com/
  [6]: https://webpack.js.org/
  [7]: https://rollupjs.org/
  [8]: https://parceljs.org/