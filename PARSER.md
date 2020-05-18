# Parsing

## Usage

### Programmatic

`simplify.ts` can be used to determine the minimum information that needs to be specified in order
to reproduce a damage calculation [`Result`][6]. This depends on the [`Relevancy`][7] containing all
relevant information for the result:

```ts
import {calculate, simplify} from `@pkmnc/dmg`;

const simplified = simplify(calculate(...));
```

`parse.ts` contains the logic for parsing the [format](#Format) detailed below:

```ts
import {parse} from `@pkmn/dmg`;

const state = parse(`252 SpA Gengar @ Choice Specs [Focus Blast] vs. 0 HP / 172+ SpD Blissey --gen=4`);
```

`encode.ts` can be used to encode a [`Result`][6] into a format parseable by `parse`. It relies on
`simplify` to ensure the encoded version is as terse as possible.

```ts
import {calculate, encode} from `@pkmn/dmg`;

const encoded = encode(state, calculate(...));
const urlSafe = encode(state, calculate(...), /* url safe? */ true);
```

`encode` also supports a second parameter to produce a [URL-safe](#URL-encoding) encoded result.

### CLI

The [`dmg` binary][4] can be used to perform damage calculations via the command line.

```sh
dmg +1 252 SpA Gengar @ Choice Specs [Focus Blast] vs. 0 HP / 172+ SpD Blissey --gen=4
+1 252 SpA Choice Specs Gengar Focus Blast vs. 0 HP / 172+ SpD Blissey: 362-428 (55.6 - 65.7%) -- guaranteed 2HKO after Leftovers recovery

$ dmg gengar [focus blast] vs. blissey gen:6
252 SpA Life Orb Gengar Focus Blast vs. 252 HP / 4 SpD Blissey: 263-309 (36.8 - 43.2%) -- 98.7% chance to 3HKO after Leftovers recovery

$ dmg gen=3 mence @ CB [EQ] vs. cune @ lefties
252+ Atk Choice Band Salamence Earthquake vs. 252 HP / 252+ Def Suicune: 121-143 (29.9 - 35.3%) -- guaranteed 4HKO after Leftovers recovery
```

~~Like the https://calc.pokemonshowdown.com, the CLI relies on predefined sets and heuristics to
minimize the amount of information that needs to be specified in order to perform a calculation. See
the [CLI's documentation][4] for more details.~~

## Format

### Flags

Every configuration option is possible to set programmatically can be specified as a **flag**. Flags
are verfy flexible in how they can be specified: any thing in the form `key:value` or `key=value`
(where the key can optionally be prefixed with `-` or `--`, i.e. `-key=value` or `--key:value`, etc)
gets interpreted as a flag. Some flag values (`Choice Band`) may contain spaces - you may either
completely remove spaces (`attackerItem:ChoiceBand` or `attackerItem=choiceband`), replace spaces
with underscores (`attackerItem=Choice_Band`) or quote the space using if the parser in an
environment where spaces are allowed in the input (eg. `--attackerItem='Choice Band'` on the
command line, though this wouldn't be allowed in a browser URL).

Flags used to set properties of the attacker Pokémon or side must prefix all of their keys with
`attacker` (like `attackerItem` above) or `p1`, those for the defender must begin with `defender` or
`p2`.

#### Booleans

For boolean options, `true`, `1`, `yes`, and `y` are all recognized as affirmative, where `false`,
`0`, `no`, and `n` can be used for negatives (though all booleans default to negative to begin
with). In some cases `+` and `-` prefixes may be used as a shortcut for boolean conditions/statuses,
see below.

#### Implicits

Because the parsing only handles a single move being used by an attacker vs. a
defender, prefixes can be sometimes elided in the cases where they only make sense for one side or the
other. For example (i.e. `--isSR=true` and `sr:1` both set Stealth Rock on the defender's side).

In the cases where the side is implicit, as a shortcut, for fields may be implictitly enabled by
using just `+` or `-`, eg. `+sr` or `-stealthrock` both *set* Stealth Rock.

- field attributes are always implicit (an side-insensitive) so may always use the shortcut syntax
  (`+sandstorm`)
- certain conditions and statuses may be implicit for the attacker or the defender, see
  `conditions.ts`

#### Flag Reference

Flag names are **not** case sensitive, though are written as such below for improved readability.

##### General

| **key** | **description** |
| ------- | ----------------|
| `gen` | sets the generation of the calculation |
| `gameType` | sets the type of game |
| `attacker` / `defender` | used to *scope* a condition / status  |

##### Field

Field attributes never require an `attacker` or `defender` prefix as they apply equally to both
sides, though because of this using the `+` shortcut syntax to toggle them is preferred.

| **key** | **description** |
| ------- | ----------------|
| `weather` | sets the weather present on the field |
| `terrain` | sets the terrain present on the field |
| `pseudoWeather` | sets the pseudo weather present on the field |

Side conditions may be set using the general `attacker` / `defender` flags to indicate the side,
or implicitly if disambiguous.

##### Pokémon

| **key** | **description** |
| ------- | ----------------|
| `attackerSpecies` / `defenderSpecies`) | the name of the attacker / defender species |
| `attackerLevel` / `defenderLevel`| the level of the attacker / defender |
| `attackerAbility` / `defenderAbility`| the ability of the attacker / defender, if the value is prefixed with a `+` the ability is activated (`apply`-ed) first |
| `attackerItem` / `defenderItem` | the item held by the attacker / defender |
| `attackerGender` / `defenderGender` | the gender of the attacker / defender |
| `attackerNature` / `defenderNature` | the nature of the attacker / defender |
| `attacker<STAT>` / `defender<STAT>` | the attacker / defender stat (eg. `attackerSpA`) |
| `attacker<STAT>IV(s)` / `defender<STAT>IV(s)` | the IV of the attacker / defender stat (eg. `attackerSpAIV`) |
| `attacker<STAT>DV(s)` / `defender<STAT>DV(s)` | the IV of the attacker / defender stat (eg. `attackerSpcDV`) |
| `attacker<STAT>EV(s)` / `defender<STAT>EV(s)` | the EV of the attacker / defender stat (eg. `defenderHPEV`) |
| `attacker<BOOST>Boosts` / `defender<BOOST>Boosts` | the number boosts of the attacker / defender has in the specific stat |
| `attackerHappiness` / `defenderHappiness` | the current happiness of the attacker / defender (defaults correctly based on the move) |
| `attackerHP` / `defenderHP` | the current HP of the attacker / defender |
| `attackerToxicCounter` / `defenderToxicCounter` | the current toxic counter of the attacker / defender |

Pokémon conditions (volatiles and statuses) may be set using the general `attacker` / `defender`
flags to indicate the side, or implicitly if disambiguous.

##### Move

All move fields only apply to the attacker, so the `attacker` prefix is unnecessary.

| **key** | **description** |
| ------- | ----------------|
| `move` | the name of the move being used by the attacker |
| `useZ` | whether to use the Z-Move version of the move |
| `useMax` | whether to use the Max version of the move |
| `crit` (`isCrit`) | whether the move was a critical hit (`+crit` may be used as a special shortcut) |
| `hits` | the number of times a multi hit move hit |

### Phrases

In addition to flags, the parser supports **phrases**. The specification for the phrases it
understands is similar to the output description, with items and moves requiring a slight
modification in their place in order to make parsing easier:

```txt
<ATTACKER_BOOST>? <ATTACKER_EVS>? <ATTACKER_POKEMON> (@ <ATTACKER_ITEM>)? ([<ATTACKER_MOVE>])?
vs. <DEFENDER_BOOST>? <DEFENDER_EVS>? <DEFENDER_POKEMON> (@ <DEFENDER_ITEM>)?
```

where:

- `ATTACKER_BOOST`: optional, can range from -6 to +6 and boosts the stat used for attacking.
- `ATTACKER_EVS`: optional, can range from 0-252 and can only be 'Atk' or 'SpA' EVs (not
   case-sensitive). A '+' or '-' may be included after the number of EVs to indicate nature.
- `ATTACKER_POKEMON`: required, the name of the attacking Pokémon species/forme.
- `ATTACKER_ITEM`: optional, must come after a '@', the held item of the attacker.
- `ATTACKER_MOVE`: optional, must be enclosed in square brackets, the attacking move.
- `DEFENDER_BOOST`: optional, can range from -6 to +6 and boosts the stat used to defend against
   the attack.
- `DEFENDER_EVS`: optional, can range from 0-252 and can of the form `<N> HP / <N> Def` or
   `<N> HP / <N> SpD` (not case-sensitive). A '+' or '-' may be included after the number of Def or
   SpD EVs to indicate nature.
- `DEFENDER_POKEMON`: required, the name of the defending Pokémon species/forme.

The `.` in the `vs.` is optional. Flags may appear anywhere within the phrase (as well as before
and / or after).

### URL encoding

[RFC1738][2] and [RFC3986][3] outlining the URL syntax restrict the set of characters which are
allowed to exist in URLs. As such, certain characters may be substituted for their equivalent,
URL-safe counterparts:

| **character** | **substitution** |
| ------------- | -----------------|
|      `/`      |        `$`       |
|     `[ ]`     |       `( )`      |
|      `@`      |        `*`       |
|      `:`      |        `=`       |
|     `' '`     |        `_`       |

For example:

```txt
+1_252_SpA_Gengar_*_Choice_Specs_(Focus_Blast)_vs_0_HP_$_172+_SpD_Blissey_gen=4
```

This alternative encoding can be accomplished fairly trivially in JavaScript as follows:

```js
const REPLACE = {'/': '$', '[': '(', ']': ')', '@': '*', ':': '=', ' ': '_'};
const REGEX = new RegExp(Object.keys(REPLACE).join('|'), 'g');
const encode = str => str.replace(REGEX, match => REPLACE[match]);
```



   [2]: https://www.ietf.org/rfc/rfc1738.txt
   [3]: https://www.ietf.org/rfc/rfc3986.txt
   [4]: https://github.com/smogon/damage-calc/blob/master/dmg
   [6]: https://github.com/smogon/damage-calc/blob/master/src/result.ts
   [7]: https://github.com/smogon/damage-calc/blob/master/src/desc.ts