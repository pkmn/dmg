/* eslint-disable no-shadow */
import type {
  BoostsTable,
  GameType,
  GenderName,
  Generation,
  ID,
  Move as DMove,
  NatureName,
  PokemonSet,
  Specie,
  StatsTable,
  StatusName,
  TypeName,
  StatName,
  Type,
} from '@pkmn/data';

import {WeatherName, TerrainName, Conditions, ConditionKind} from './conditions';
import {floor} from './math';
import {is, has, extend, DeepPartial, toID} from './utils';

type OverriddenFields =
  'name' | 'item' | 'ability' | 'nature' | 'status' | 'volatiles' | 'ivs' | 'evs' | 'boosts';
export interface PokemonOptions extends Partial<Omit<State.Pokemon, OverriddenFields>> {
  name?: string;
  weightkg?: number;
  item?: string;
  ability?: string;
  nature?: string;
  status?: string;
  volatiles?: string[] | State.Pokemon['volatiles'];
  evs?: Partial<StatsTable & {spc: number}>;
  ivs?: Partial<StatsTable & {spc: number}>;
  dvs?: Partial<StatsTable & {spc: number}>;
  boosts?: Partial<BoostsTable & {spc: number}>;
}

export interface MoveOptions {
  name?: string;
  crit?: boolean;
  hits?: number;
  magnitude?: number;
  numConsecutive?: number;
  spreadHit?: boolean;
  useMax?: boolean;
  useZ?: boolean;
}

export interface FieldOptions {
  weather?: string;
  terrain?: string;
  pseudoWeather?: string[] | State.Field['pseudoWeather'];
}

export interface SideOptions {
  sideConditions?: string[] | State.Side['sideConditions'];
  abilities?: string[];
  atks?: number[];
}

export namespace State {
  export interface Field {
    weather?: WeatherName;
    terrain?: TerrainName;
    pseudoWeather: {[id: string]: {level?: number}};
  }

  export interface Side {
    pokemon: Pokemon;
    sideConditions: {[id: string]: {level?: number}};
    // Rarely useful, but required for ally-affecting abilities like Plus/Minus or Fairy Aura etc.
    // Must be a subset of State.Pokemon so that a State.Pokemon object could be used in this array
    active?: Array<{
      ability?: ID;
      // Used to differentiate the attacker/defender from their allies if they are also
      // included in the active array
      position?: number;
      // Used to exclude allies which are fainted (alternatively they can just be left
      // out of the active array)
      fainted?: boolean;
    } | null>;
    // Similarly niche, Beat Up etc requires information about the entire team. Must be a subset
    // of State.Pokemon so that a State.Pokemon object could be used in this array
    team?: Array<{
      // Fields required for Beat Up mechanics
      species: {baseStats: {atk: number}};
      // Fields used to exclude certain team members per the mechanics
      status?: StatusName;
      fainted?: boolean;
      // Fields used to exclude the attacker/defender if they are included in the array
      position?: number;
    }>;
  }

  export interface Pokemon {
    species: Specie;
    level: number;
    // Hectograms is stored instead of the more user-friendly and intuitive kilograms because the
    // game considers weights down to hectogram precision when modified
    weighthg: number;

    item?: ID;
    ability?: ID;
    gender?: GenderName;
    // Only relevant for submaximal happiness based move calculations - if excluded the move will be
    // treated as max power (eg. 0 happiness for Frustration, 255 for Return etc)
    happiness?: number;

    status?: StatusName;
    statusData?: {toxicTurns?: number};
    // Level is used to track layers/stockpiles/etc
    volatiles: {[id: string]: {level?: number}};

    types: [TypeName] | [TypeName, TypeName];
    // Type added by Trick-or-Treat/Forest's Curse etc
    addedType?: TypeName;

    // Base max HP is stats.hp, but max HP may change due to Dynamaxing or Power Contruct etc
    maxhp: number;
    hp: number;

    nature?: NatureName;
    evs?: Partial<StatsTable>;
    ivs?: Partial<StatsTable>;

    // Computed stats can be provided directly, but without spread information the result
    // description will be limited. This option exists primarly as an optimization for @pkmn/gmd
    // and other programmatic use cases.
    stats?: StatsTable;

    boosts: Partial<BoostsTable>;

    // Use to disambiguate this Pokemon from its allies if included in the Side's active or party
    position?: number;

    // Required for certain moves which effect switches, the most obvious being Pursuit
    switching?: 'in' | 'out';
    // Required for Stomping Tantrum
    moveLastTurnResult?: false | unknown;
    // Required for Assurance
    hurtThisTurn?: boolean;
  }

  export interface Move extends DMove {
    crit?: boolean;
    hits?: number;
    magnitude?: number;
    spreadHit?: boolean;
    numConsecutive?: number;
  }
}

export class State {
  readonly gameType: GameType;
  readonly gen: Generation;
  readonly p1: State.Side;
  readonly p2: State.Side;
  readonly move: State.Move;
  readonly field: State.Field;

  constructor(
    gen: Generation,
    attacker: State.Side | State.Pokemon,
    defender: State.Side | State.Pokemon,
    move: State.Move,
    field: State.Field = {pseudoWeather: {}},
    gameType: GameType = 'singles'
  ) {
    this.gameType = gameType;
    this.gen = gen;
    this.p1 = 'pokemon' in attacker ? attacker : {pokemon: attacker, sideConditions: {}};
    this.p2 = 'pokemon' in defender ? defender : {pokemon: defender, sideConditions: {}};
    this.move = move;
    this.field = field;
  }

  static createField(gen: Generation, options: FieldOptions = {}) {
    const field: Partial<State.Field> = {};

    if (options.weather) {
      const c = Conditions.get(gen, options.weather);
      if (!c) invalid(gen, 'weather', options.weather);
      field.weather = c[1] as WeatherName;
    }

    if (options.terrain) {
      const c = Conditions.get(gen, options.terrain);
      if (!c) invalid(gen, 'terrain', options.terrain);
      field.terrain = c[1] as TerrainName;
    }

    field.pseudoWeather = setConditions(gen, 'Pseudo Weather', options.pseudoWeather);

    return field as State.Field;
  }

  static createSide(gen: Generation, pokemon: State.Pokemon, options: SideOptions = {}) {
    return {
      sideConditions: setConditions(gen, 'Side Condition', options.sideConditions),
      pokemon,
      active: options.abilities?.map((a, i) => ({ability: toID(a), position: i})),
      team: options.atks?.map((atk, i) => ({species: {baseStats: {atk}}, position: i})),
    } as State.Side;
  }

  static createPokemon(
    gen: Generation,
    name: string,
    options: PokemonOptions = {},
    move: string | {name?: string} = '',
  ) {
    const pokemon: Partial<State.Pokemon> = {};

    // Species
    const species = gen.species.get(name);
    if (!species) invalid(gen, 'species', name);
    if (options.species && options.species !== species) {
      throw new Error(`Species mismatch: ${options.species} does not match ${species}`);
    }
    pokemon.species = species;

    // Level
    pokemon.level = 100;
    if (typeof options.level === 'number') {
      pokemon.level = bounded('level', options.level);
    }

    // Weight
    pokemon.weighthg =
      options.weighthg ? options.weighthg
      : options.weightkg ? options.weightkg * 10 : species.weighthg;
    if (pokemon.weighthg < 1) throw new Error(`weighthg of ${pokemon.weighthg} must be at least 1`);

    // Item
    pokemon.item = undefined;
    setItem(gen, pokemon, options.item);

    // Ability
    pokemon.ability = undefined;
    setAbility(gen, pokemon as {species: Specie; ability?: ID}, options.ability);

    // Happiness
    pokemon.happiness = bounded('happiness', options.happiness || 0) || undefined;

    // Status
    pokemon.status = undefined;
    pokemon.statusData = undefined;
    if (options.status) {
      const condition = Conditions.get(gen, options.status);
      if (!condition) invalid(gen, 'status', options.status);
      const [name, kind] = condition;
      if (kind !== 'Status') {
        throw new Error(`'${name} is a ${kind} not a Status in generation ${gen.num}`);
      }
      pokemon.status = name as StatusName;
      if (pokemon.status === 'tox') pokemon.statusData = {toxicTurns: 0};
    }

    // Status Data
    if (options.statusData) {
      if (options.statusData.toxicTurns) {
        const turns = options.statusData.toxicTurns;
        bounded('toxicCounter', turns);
        if (pokemon.status !== 'tox') {
          throw new Error(`toxicTurns set to ${turns} but the Pokemon's status is not 'tox'`);
        }
      }
      pokemon.statusData = options.statusData;
    }

    // Volatiles
    pokemon.volatiles = setConditions(gen, 'Volatile Status', options.volatiles);

    // Types
    pokemon.types = options.types || pokemon.species.types;
    pokemon.addedType = options.addedType;

    // Nature
    pokemon.nature = undefined;
    setNature(gen, pokemon, options.nature);

    // EVs
    setValues(gen, pokemon, 'evs', options.evs);

    // IVs / DVs
    setValues(gen, pokemon, 'ivs', options.ivs);
    for (const stat of gen.stats) {
      const val = options.dvs?.[stat];
      if (typeof val === 'number') {
        const dv = bounded('dvs', val);
        if (typeof options.ivs?.[stat] === 'number' && gen.stats.toDV(options.ivs[stat]!) !== dv) {
          throw new Error(`${stat} DV of '${dv}' does not match IV of '${options.ivs[stat]}'`);
        }
        pokemon.ivs![stat] = gen.stats.toDV(dv);
      }
    }
    setSpc(gen, pokemon.ivs!, 'ivs', options.dvs);

    if (move) {
      move = typeof move === 'string' ? move : (move.name || '');
      setHiddenPowerIVs(gen, pokemon as {level: number; ivs: StatsTable}, [move]);
    }

    // Boosts
    pokemon.boosts = {};
    if (options.boosts) {
      for (const b in options.boosts) {
        if (b === 'spc') continue;
        const boost = b as keyof BoostsTable;
        const val = options.boosts[boost];
        if (typeof val === 'number') pokemon.boosts[boost] = bounded('boosts', val);
      }
    }
    setSpc(gen, pokemon.boosts, 'boosts', options.boosts);

    // Gender (depends on DVs)
    const setAtkDV = typeof (options.dvs?.atk ?? options.ivs?.atk) === 'number';
    setGender(
      gen,
      pokemon as {species: Specie; ivs: StatsTable; gender?: GenderName},
      options.gender,
      setAtkDV
    );

    // HP (depends on stats)
    const setHPDV = typeof (options.dvs?.hp ?? options.ivs?.hp) === 'number';
    correctHPDV(gen, pokemon as {species: Specie; ivs: StatsTable}, setHPDV);
    pokemon.maxhp =
      gen.stats.calc('hp', species.baseStats.hp, pokemon.ivs!.hp, pokemon.evs!.hp, pokemon.level);
    if (options.maxhp) {
      if (options.maxhp < pokemon.maxhp) {
        throw new RangeError(`maxhp ${options.maxhp} less than calculated max HP ${pokemon.maxhp}`);
      }
      pokemon.maxhp = options.maxhp;
    }
    pokemon.hp = typeof options.hp === 'number' ? options.hp : pokemon.maxhp;
    if (!(pokemon.hp >= 0 && pokemon.hp <= pokemon.maxhp)) {
      throw new RangeError(`hp ${pokemon.hp} is not within [0,${pokemon.maxhp}]`);
    }

    // Miscellaneous
    pokemon.position = options.position;
    pokemon.switching = options.switching;
    pokemon.moveLastTurnResult = options.moveLastTurnResult;
    pokemon.hurtThisTurn = options.hurtThisTurn;

    return validateStats(gen, pokemon as State.Pokemon);
  }

  static createMove(
    gen: Generation,
    name: string,
    options: MoveOptions = {},
    pokemon: string | {
      species?: string | Specie;
      item?: string;
      ability?: string;
      volatiles?: {[id: string]: object};
    } = {}
  ) {
    const base = gen.moves.get(name);
    if (!base) invalid(gen, 'move', name);
    if (options.name && options.name !== base.name) {
      throw new Error(`Move mismatch: '${options.name}' does not match '${base.name}'`);
    }
    const move: Partial<State.Move> = {hits: 1};

    if (typeof pokemon === 'string') {
      const species = gen.species.get(pokemon);
      if (!species) invalid(gen, 'species', pokemon);
      pokemon = {species};
    } else if (typeof pokemon.species === 'string') {
      const species = gen.species.get(pokemon.species);
      if (!species) invalid(gen, 'species', pokemon.species);
      pokemon.species = species;
    }

    const useMax = options.useMax || pokemon.volatiles?.dynamax;
    if (useMax && options.useZ) {
      throw new Error(`Cannot use ${base.name} as both a Z-Move and a Max Move simulataneously`);
    }
    if (useMax) {
      if (options.hits && options.hits > 1) {
        throw new Error(`'${options.hits}' hits requested but Max Moves cannot be multi-hit`);
      }
      // TODO should it be on whether the move was isMax, not whether useMax?
    } else if (options.useZ) {
      if (options.hits && options.hits > 1) {
        throw new Error(`'${options.hits}' hits requested but Z-Moves cannot be multi-hit`);
      }
      // TODO should it be on whether the move was isZ, not whether useZ?
    } else {
      if (base.multihit) {
        if (typeof base.multihit === 'number') {
          move.hits = base.multihit;
        } else if (options.hits) {
          move.hits = options.hits;
        } else {
          move.hits = (pokemon?.ability === 'Skill Link' || pokemon?.item === 'Grip Claw')
            ? base.multihit[1]
            : base.multihit[0] + 1;
        }
      } else if (options.hits) {
        throw new Error(`'${options.hits}' hits requested but ${move.name} in not multi-hit`);
      }
    }

    extend(move, base, options); // whatever, there are too many move fields
    move.crit = options.crit ?? base.willCrit;
    if (typeof options.magnitude === 'number') {
      if (move.id !== 'magnitude') {
        throw new Error(`magnitude ${options.magnitude} incorrectly set on move '${base.name}'`);
      }
      move.magnitude = bounded('magnitude', options.magnitude);
    }
    if (move.id === 'magnitude' && !move.magnitude) {
      throw new Error('The move Magnitude must have a magnitude specified');
    }
    if (gen.num <= 3 && options.spreadHit) {
      throw new Error(`Spread moves do not exist in generation ${gen.num}`);
    } else {
      move.spreadHit = options.spreadHit;
    }
    if (options.numConsecutive && toID(pokemon.item) !== 'metronome') {
      throw new Error(`numConsecutive has no meaning unless the Pokemon is holding a Metronome'`);
    }
    move.numConsecutive = options.numConsecutive;

    return move as State.Move;
  }

  static mergeSet(
    gen: Generation,
    pokemon: State.Pokemon,
    move: string | DeepPartial<PokemonSet>,
    ...sets: DeepPartial<PokemonSet>[]
  ) {
    const set = bestMatch(pokemon, move, ...sets);

    pokemon.level = bounded('level', set.level || 100);
    setItem(gen, pokemon, set.item);
    setAbility(gen, pokemon, set.ability);
    pokemon.happiness = bounded('happiness', set.happiness || 0) || pokemon.happiness;
    // Nature is required on PokemonSet, so we just ignore it for generations 1 and 2
    setNature(gen, pokemon, set.nature, gen.num >= 3);

    setValues(gen, pokemon, 'evs', set.evs);
    setValues(gen, pokemon, 'ivs', set.ivs);
    setHiddenPowerIVs(
      gen,
      pokemon as {level: number; ivs: StatsTable},
      [typeof move === 'string' ? move : '', ...(set.moves ?? [])],
      true
    );

    if ( // Marowak hack, cribbed from Pokémon Showdown's sim/team-validator.ts
      gen.num === 2 &&
      pokemon.species.id === 'marowak' && is(pokemon.item, 'thickclub') &&
      has(set.moves?.map(toID), 'swordsdance') && set.level === 100
    ) {
      const ivs = pokemon.ivs!.atk = gen.stats.toDV(pokemon.ivs!.atk!) * 2;
      while (pokemon.evs!.atk! > 0 && 2 * 80 + ivs + floor(pokemon.evs!.atk! / 4) + 5 > 255) {
        pokemon.evs!.atk! -= 4;
      }
    }

    // Shiny
    const dv = (stat: StatName) => gen.stats.toDV(pokemon.ivs![stat]!);
    const shiny =
      !!(dv('def') === 10 && dv('spe') === 10 && dv('spa') === 10 && dv('atk') % 4 >= 2);
    if (gen.num === 2 && (shiny !== !!set.shiny)) {
      throw new Error(
        `${pokemon.species.name} is required to ${shiny ? '' : 'not '}be ` +
        `shiny in generation 2 given its DVs.`
      );
    }
    setGender(
      gen,
      pokemon as {species: Specie; ivs: StatsTable; gender?: GenderName},
      set.gender as GenderName,
      typeof set.ivs?.atk === 'number'
    );

    correctHPDV(
      gen,
      pokemon as {species: Specie; ivs: StatsTable},
      typeof set.ivs?.hp === 'number'
    );

    // We can't validate HP here, but we can attempt to preserve the same percentage
    // of health while adjusting the HP values to be legal.
    const maxhp = gen.stats.calc(
      'hp', pokemon.species.baseStats.hp, pokemon.ivs!.hp, pokemon.evs!.hp, pokemon.level
    );
    pokemon.hp = pokemon.hp * floor(maxhp / pokemon.maxhp);
    pokemon.maxhp = maxhp;

    return validateStats(gen, pokemon);;
  }
}

const BOUNDS: {[key: string]: [number, number]} = {
  level: [1, 100],
  evs: [0, 252],
  ivs: [0, 31],
  dvs: [0, 15],
  gen: [1, 8],
  boosts: [-6, 6],
  toxicCounter: [0, 15],
  happiness: [0, 255],
  magnitude: [4, 10],
};

function invalid(gen: Generation, k: string, v: any): never {
  throw new Error(`Unsupported or invalid ${k} '${v}' for generation ${gen.num}`);
}

export function bounded(key: keyof typeof BOUNDS, val: number, die = true) {
  const ok = val >= BOUNDS[key][0] && val <= BOUNDS[key][1];
  if (!ok && die) throw new RangeError(`${key} ${val} is not within [${BOUNDS[key].join(',')}]`);
  return val;
}

// Naive algorithm for determing the 'best' matching set to the `pokemon` (with optional `move`) -
// iterate through each set and assign it a score based on how many fields match vs. how many
// conflict (with the score being unaffected if the field is not set) and then return the highest
// scoring set, breaking ties by using the ordering of the sets provided. This works well enough
// in a pinch, but could be improved by valuing certain fields more than others or eg. relying on
// a set clustering similarity metric.
function bestMatch(
  pokemon: State.Pokemon,
  move: string | DeepPartial<PokemonSet>,
  ...sets: DeepPartial<PokemonSet>[]
) {
  if (typeof move !== 'string') {
    sets.unshift(move);
    move = '';
  }

  const match = (a?: string, b?: string) => toID(a) === toID(b);
  const scored: Array<[number, DeepPartial<PokemonSet>]> = [];
  for (const set of sets) {
    let score = 0;
    if (!match(set.species, pokemon.species.name)) {
      throw new Error(`Received invalid ${set.species} set for ${pokemon.species.name}`);
    }
    if (set.level !== pokemon.level) score--;
    if (!match(set.item, pokemon.item)) {
      score--;
    } else if (pokemon.item) {
      score++;
    }
    if (!match(set.ability, pokemon.ability)) {
      score--;
    } else if (pokemon.ability) {
      score++;
    }
    if (!match(set.nature, pokemon.nature)) {
      score--;
    } else if (pokemon.nature) {
      score++;
    }
    if (move && !set.moves?.some(m => match(m, move as string))) {
      score--;
    } else if (move) {
      score++;
    }
    scored.push([score, set]);
  }
  if (!scored.length) throw new Error(`Received no sets for ${pokemon.species.name}`);

  let best: [number, DeepPartial<PokemonSet>] = scored[0];
  for (let i = 1; i < scored.length; i++) {
    if (scored[i][0] > best[0]) best = scored[i];
  }

  return best[1];
}

function setItem(gen: Generation, pokemon: Partial<State.Pokemon>, name?: string) {
  if (name) {
    const item = gen.items.get(name);
    if (!item) invalid(gen, 'item', name);
    pokemon.item = item.id;
  }
}

function setAbility(gen: Generation, pokemon: {species: Specie; ability?: ID}, name?: string) {
  if (name) {
    const ability = gen.abilities.get(name);
    if (!ability) invalid(gen, 'ability', ability);
    pokemon.ability = ability.id;
  } else if (gen.num >= 3) {
    pokemon.ability = toID(pokemon.species.abilities[0]);
  }
}

function setNature(gen: Generation, pokemon: Partial<State.Pokemon>, name?: string, die = true) {
  if (name) {
    const nature = gen.natures.get(name);
    if (!nature) {
      if (die) invalid(gen, 'nature', name);
    } else {
      pokemon.nature = nature.name;
    }
  }
}

function setValues(
  gen: Generation,
  pokemon: Partial<State.Pokemon>,
  type: 'evs' | 'ivs',
  vals?: Partial<StatsTable & {spc: number}>
) {
  pokemon[type] = pokemon[type] || {};
  for (const stat of gen.stats) {
    pokemon[type]![stat] = pokemon[type]![stat] ?? (type === 'evs' ? (gen.num <= 2 ? 252 : 0) : 31);
    const val = vals?.[stat];
    if (typeof val === 'number') pokemon[type]![stat] = bounded(type, val);
  }
  setSpc(gen, pokemon[type]!, type, vals);
}

function setSpc(
  gen: Generation,
  existing: Partial<{spc: number; spa: number; spd: number}>,
  type: 'evs' | 'ivs' | 'boosts',
  vals?: Partial<{spc: number; spa: number; spd: number}>
) {
  const spc = vals?.spc;
  if (typeof spc === 'number') {
    if (gen.num >= 2) throw new Error('Spc does not exist after generation 1');
    if (typeof vals!.spa === 'number' && vals!.spa !== spc) {
      throw new Error(`Spc and SpA ${type} mismatch: ${spc} vs. ${vals!.spa}`);
    }
    if (typeof vals!.spd === 'number' && vals!.spd !== spc) {
      throw new Error(`Spc and SpD ${type} mismatch: ${spc} vs. ${vals!.spd}`);
    }
    existing.spa = existing.spd = bounded(type, spc);
  }
  if (gen.num <= 2 && existing.spa !== existing.spd) {
    throw new Error(`SpA and SpD ${type} must match before generation 3`);
  }
}

function setGender(
  gen: Generation,
  pokemon: {species: Specie; ivs: StatsTable; gender?: GenderName},
  name?: GenderName,
  setAtkDV = false
) {
  const ivs = pokemon.ivs;
  const species = pokemon.species;
  const atkDV = gen.stats.toDV(ivs.atk!);
  // AtkDV determing gender is only at thing in generation 2, but we can use it as the default
  const gender = gen.num === 1 ? undefined : species.genderRatio.F * 16 >= atkDV ? 'M' : 'F';
  if (name) {
    if (gen.num === 1) throw new Error(`Gender does not exist in generation 1`);
    if (species.gender && name !== species.gender) {
      throw new Error(`${species.name} must be ${species.gender} in generation ${gen.num}`);
    }
    if (gen.num === 2 && setAtkDV && name !== gender) {
      throw new Error(`A ${species.name} with ${atkDV} Atk DVs must be '${gender}' in gen 2`);
    }
    pokemon.gender = name || species.gender || gender;
  } else {
    pokemon.gender = gender;
  }
}

function correctHPDV(
  gen: Generation,
  pokemon: {species: Specie; ivs: StatsTable},
  setHPDV = false
) {
  const expectedHPDV = gen.stats.getHPDV(pokemon.ivs);
  const actualHPDV = gen.stats.toDV(pokemon.ivs.hp!);
  if (gen.num <= 2 && expectedHPDV !== actualHPDV) {
    if (setHPDV) {
      throw new Error(
        `${pokemon.species.name} is required to have an HP DV of ` +
        `${expectedHPDV} in generations 1 and 2 but it is ${actualHPDV}`
      );
    }
    pokemon.ivs.hp = gen.stats.toIV(expectedHPDV);
  }
}

function setHiddenPowerIVs(
  gen: Generation,
  pokemon: {level: number; ivs: StatsTable},
  moves: string[],
  override = false
) {
  let hpType: Type | 'infer' | undefined = undefined;
  for (const move of moves) {
    const id = toID(move);
    if (id.startsWith('hiddenpower')) {
      if (hpType) throw new Error('Cannot have more than one Hidden Power on a set');
      const type = gen.types.get(id.slice(11));
      if (gen.num === 1 || gen.num === 8 || !type || is(type.name, '???', 'Normal', 'Fairy')) {
        if (id === 'hiddenpower') {
          hpType = 'infer';
        } else {
          invalid(gen, 'Hidden Power', type);
        }
      } else {
        hpType = type;
      }
    }
  }
  if (!hpType || hpType === 'infer') return;
  if (gen.num >= 7 && pokemon.level === 100) return;
  if (gen.types.getHiddenPower(pokemon.ivs).type === hpType.name) return;

  let ivs = hpType.HPivs;
  if (gen.num <= 2) {
    ivs = {};
    for (const stat in hpType.HPdvs) {
      ivs[stat as StatName] = gen.stats.toIV(hpType.HPdvs[stat as StatName]!);
    }
  }

  if (override) {
    for (const stat of gen.stats) {
      pokemon.ivs[stat] = ivs[stat] || 31;
    }
  } else {
    const max = gen.num <= 2 ? 30 : 31;
    let maxed = true;
    for (const stat of gen.stats) {
      if (!(pokemon.ivs[stat] >= max)) {
        maxed = false;
        break;
      }
    }
    if (maxed) {
      for (const stat of gen.stats) {
        pokemon.ivs[stat] = ivs[stat] || 31;
      }
    } else {
      throw new Error('Cannot set Hidden Power IVs over non-default IVs');
    }
  }
}

function setConditions(
  gen: Generation,
  kind: ConditionKind,
  data: string[] | {[id: string]: unknown } | undefined
) {
  const obj: {[id: string]: {level?: number}} = {};
  if (data) {
    if (Array.isArray(data)) {
      for (const d of data) {
        const condition = Conditions.get(gen, d);
        if (!condition) invalid(gen, kind, d);
        const [name, k] = condition;
        if (k !== kind) {
          throw new Error(`'${name} is a ${k} not a ${kind} in generation ${gen.num}`);
        }
        obj[toID(name)] = {};
      }
    } else {
      for (const d in data) {
        const condition = Conditions.get(gen, d);
        if (!condition) invalid(gen, kind, d);
        const [name, k] = condition;
        if (k !== kind) {
          throw new Error(`'${name} is a ${k} not a ${kind} in generation ${gen.num}`);
        }
        obj[toID(name)] = data[d] as {level?: number}; // TODO: verify layers?
      }
    }
  }
  return obj;
}

function validateStats(
  gen: Generation,
  pokemon: State.Pokemon,
) {
  if (!pokemon.stats) return pokemon;
  for (const stat of gen.stats) {
    const actual = gen.stats.calc(
      stat,
      pokemon.species.baseStats[stat],
      pokemon.ivs?.[stat] ?? 31,
      pokemon.evs?.[stat] ?? (gen.num <= 2 ? 252 : 0),
      pokemon.level,
      gen.natures.get(pokemon.nature!)!
    );
    if (actual !== pokemon.stats[stat]) {
      const s = gen.stats.display(stat);
      throw new Error(`Expected a ${s} stat of ${pokemon.stats[stat]}, received: ${actual}`);
    }
  }
  return pokemon;
}
