# Parsing

Battle state can be encoded purely textually and passed to the damage calculator for it to parse and
perform computation on. The rules for encoding a damage calculation scenario were chosen to be as
similar as possible to the human readable output of a damage calculation, though certain rules have
to be added to making parsing easier (technically, because there is a set number of possible
Pokémon/items/moves/abilities/conditions and relatively little overlap between data types one could
use an algorithm relying on bruteforcing via [prefix tries](https://en.wikipedia.org/wiki/Trie) and
a small number of disambiguation rules but this is considered out of scope for `@pkmn/dmg`). The
result is a syntax which is relatively intutive and familar, though incredibly flexible (perhaps
overly so).

## Format

State can be encoded soley with [**flags**](#flags), though [**phrases**](#phrases), while less
comprehensive, are more often going to be used to describe the bulk of damage calculations.

### Flags

Every configuration option that is possible to set programmatically can be specified as a **flag**.
Flags are very flexible in how they can be specified: any thing in the form `key:value` or
`key=value` (where the key can optionally be prefixed with `+`, `-` or `--`, i.e. `-key=value` or
`--key:value`, etc) gets interpreted as a flag. Some flag values (`Choice Band`) contain spaces -
you must either completely remove spaces (`attackerItem:ChoiceBand` or `attackerItem=choiceband`),
replace the spaces with underscores (`attackerItem=Choice_Band`), or quote the space using if the
parser in an environment where spaces are allowed in the input (eg. `--attackerItem='Choice Band'`
on the command line, though this wouldn't be allowed in a browser URL).

#### Implicits

Flags used to set properties of the attacker Pokémon or side must prefix all of their keys with
`attacker` (like `attackerItem` above) or `p1`, those for the defender must begin with `defender` or
`p2`. However, because the calculator only handles a single move being used by an attacker vs. a
defender, there are certain cases where the side a property is for is implicit and can be inferred
based on the context. In these circumstances (or for properties not associated with sides at all,
like field conditions or move flags etc), the disambiguating prefix can be elided (e.g.
`--isSR=true` and `sr:1` both set Stealth Rock on the defender's side). In the cases where a
property's scope is not implicit, the `attacker` / `p1` or `defender` / `p2` *flags* can also be
used to explicitly scope a property as belonging to a certain side. Multiple ambiguous flags may be
passed to these dismabiguators, and in these scenarios, boolean flags can drop their prefix enitrely
eg. `p2:spikes:3,auroraveil` or `--attacker=flashfire+foresight+helpinghand`.

#### Booleans

For boolean options, `true`, `1`, `yes`, and `y` are all recognized as affirmative, where `false`,
`0`, `no`, and `n` can be used for negatives (though all booleans default to negative to begin
with). Boolean flags can also have an `is` or `has` prefix added for readability. Furthermore, if
the boolean flag is specified with a leading prefix (`+`, `-` or `--`) the value part to the flag
is optional and assumed to be `true` by default (`+sr` and `--isStealthRock` are the same as
`stealthrock:true`).

#### Flag Reference

Flag names are **not** case sensitive, though are written as such below for improved readability.

##### General

| **key** | **description** |
| ------- | ----------------|
| `gen` | sets the generation of the calculation |
| `gameType` | sets the type of game (`+doubles` or `+singles` can be used instead) |
| `attacker` / `defender` | used to *scope* a condition / status, also `p1` / `p2`  |

##### Field

Field attributes never require an `attacker` or `defender` prefix as they apply equally to both
sides, though because of this using the `+` shortcut syntax to toggle them is preferred.

| **key** | **description** |
| ------- | ----------------|
| `weather` | sets the weather present on the field |
| `terrain` | sets the terrain present on the field |
| `pseudoWeather` | sets the pseudo weather present on the field |

Side conditions may be set using the general `attacker` / `defender` flags to indicate the side, or
implicitly if disambiguous.

##### Pokémon

| **key** | **description** |
| ------- | ----------------|
| `attackerSpecies` / `defenderSpecies`) | the name of the attacker / defender species |
| `attackerLevel` / `defenderLevel`| the level of the attacker / defender |
| `attackerAbility` / `defenderAbility`| the ability of the attacker / defender, if the value is prefixed with a `+` the ability is activated (`apply`-ed) first |
| `attackerItem` / `defenderItem` | the item held by the attacker / defender |
| `attackerGender` / `defenderGender` | the gender of the attacker / defender |
| `attackerNature` / `defenderNature` | the nature of the attacker / defender |
| `attacker<STAT>IV(s)` / `defender<STAT>IV(s)` | the IV of the attacker / defender stat (eg. `attackerSpAIV`) |
| `attacker<STAT>DV(s)` / `defender<STAT>DV(s)` | the IV of the attacker / defender stat (eg. `attackerSpcDV`) |
| `attacker<STAT>EV(s)` / `defender<STAT>EV(s)` | the EV of the attacker / defender stat (eg. `defenderHPEV`) |
| `attacker<BOOST>Boost(s)` / `defender<BOOST>Boost(s)` | the number boosts of the attacker / defender has in the specific stat |
| `attackerHappiness` / `defenderHappiness` | the current happiness of the attacker / defender (defaults correctly based on the move) |
| `attackerHP` / `defenderHP` | the current HP of the attacker / defender |
| `attackerToxicCounter` / `defenderToxicCounter` | the current toxic counter of the attacker / defender |

Pokémon conditions (volatiles and statuses) may be set using the general `attacker` / `defender`
flags to indicate the side, or implicitly if they are not ambiguous. `attackerVolatile` or
`defenderSideCondition` etc may also be used, though don't offer any benefits over
`attacker` / `p1` or `defender` / `p2` or implicits and only exist for consistency.

##### Move

All move fields only apply to the attacker, so the `attacker` prefix is unnecessary.

| **key** | **description** |
| ------- | ----------------|
| `move` | the name of the move being used by the attacker |
| `useZ` | whether to use the Z-Move version of the move (or `+z`) |
| `useMax` | whether to use the Max version of the move (or `+max`) |
| `crit` | whether the move was a critical hit (`+crit` may be used as a special shortcut) |
| `hits` | the number of times a multi hit move hit |

### Phrases

In addition to flags, the parser supports **phrases**. The specification for the phrases it
understands is similar to the output description, with the main difference being that the move name
requires a slight modification (ie. to be surrounded by `[`+`]`) in order to [make parsing
easier](https://en.wikipedia.org/wiki/Regular_language):

```txt
<ATTACKER_BOOST>? <ATTACKER_LEVEL>? <ATTACKER_EVS>? <ATTACKER_POKEMON> (@ <ATTACKER_ITEM>)?
   [<ATTACKER_MOVE>] vs.
<DEFENDER_BOOST>? <DEFENDER_LEVEL>? <DEFENDER_EVS>? <DEFENDER_POKEMON> (@ <DEFENDER_ITEM>)?
```

where:

- `ATTACKER_BOOST`: optional, can range from -6 to +6 and boosts the stat used for attacking.
- `ATTACKER_LEVEL`: optional, can range from 1 to 100, defaults to 100.
- `ATTACKER_EVS`: optional, can range from 0-252 and can only be 'Atk' or 'SpA' EVs (not
   case-sensitive). A '+' or '-' may be included after the number of EVs to indicate nature.
- `ATTACKER_POKEMON`: required, the name of the attacking Pokémon species/forme.
- `ATTACKER_ITEM`: optional, must come after a '@', the held item of the attacker.
- `ATTACKER_MOVE`: optional, must be enclosed in square brackets, the attacking move.
- `DEFENDER_BOOST`: optional, can range from -6 to +6 and boosts the stat used to defend against the
   attack.
- `DEFENDER_LEVEL`: optional, can range from 1 to 100, defaults to 100.
- `DEFENDER_EVS`: optional, can range from 0-252 and can of the form `<N> HP / <N> Def` or `<N> HP /
   <N> SpD` (not case-sensitive). A '+' or '-' may be included after the number of Def or SpD EVs to
   indicate nature.
- `DEFENDER_POKEMON`: required, the name of the defending Pokémon species/forme.

The `.` in the `vs.` is optional. Flags may appear anywhere within the phrase (as well as before and
/ or after, though after is most common).

#### Generation

The generation used for the calculation can be specified as a flag as [detailed above](#Flags),
though it can also be specified as part of the phrase in the form of `[Gen N]` or simply `[N]`.
Matching braces and or parentheses are allowed as an alternative to brackets, so `(Gen 1)` or `{5}`
appearing anywhere in the phrase will serve to change the generation of the calculation as well.

### URL encoding

[RFC1738](https://www.ietf.org/rfc/rfc1738.txt) and [RFC3986](https://www.ietf.org/rfc/rfc3986.txt)
outlining the URL syntax restrict the set of characters which are allowed to exist in URLs. As such,
certain characters may be substituted for their equivalent, URL-safe counterparts:

| **character** | **substitution** |
| ------------- | -----------------|
|      `/`      |        `$`       |
|     `{ }`     |       `( )`      |
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

## Usage

[`parse.ts`](src/parse.ts) contains the logic for parsing the [format](#format) detailed above:

```ts
import {parse} from `@pkmn/dmg`;

const state = parse(`(Gen 4) 252 SpA Gengar @ Choice Specs [Focus Blast] vs. 0 HP / 172+ SpD Blissey`);
```

[`encode.ts`](src/encode.ts) can be used to encode [`State`](src/state.ts) into a format parseable
by `parse`. It may be used to generate either parseable encodings (`'parse'`, the default), 'human
friendly descriptions' (`'desc'`), or a [URL-safe](#URL-encoding) encoded parseable string
(`'url'`).

```ts
import {encode} from `@pkmn/dmg`;

const encoded = encode(state);
const urlSafe = encode(state, 'url');
```
