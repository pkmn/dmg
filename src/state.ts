import {
  BoostsTable,
  GameType,
  GenderName,
  Generation,
  GenerationNum,
  HitEffect,
  ID,
  Move as DMove,
  MoveCategory,
  MoveName,
  MoveTarget,
  NatureName,
  Nonstandard,
  PokemonSet,
  PureEffectData,
  SecondaryEffect,
  Specie,
  SpeciesName,
  StatsTable,
  StatusName,
  toID,
  TypeName,
} from '@pkmn/data';
import {WeatherName, TerrainName, Conditions} from './conditions';
import {Handlers, Handler} from './mechanics';
import { Relevancy } from './result';
import { extend } from './tools';
import { DeepReadonly } from './types';
import { MoveFlags } from '@smogon/calc/dist/data/interface';

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
};

export function bounded(key: keyof typeof BOUNDS, val: number, die = true) {
  const ok = val >= BOUNDS[key][0] && val <= BOUNDS[key][1];
  if (!ok && die) throw new RangeError(`${key} ${val} is not within [${BOUNDS[key].join(',')}]`);
  return val;
}

type OverriddenFields = 'item' | 'ability' | 'status' | 'volatiles' | 'ivs' | 'evs' | 'boosts';
export interface PokemonOptions extends Partial<Omit<State.Pokemon, OverriddenFields>> {
  weightkg?: number;
  item?: string;
  ability?: string;
  status?: string;
  volatiles?: string[] | State.Pokemon['volatiles'];
  evs?: Partial<StatsTable & {spc: number}>
  ivs?: Partial<StatsTable & {spc: number}>
  dvs?: Partial<StatsTable & {spc: number}>
  boosts?: Partial<BoostsTable & {spc: number}>
};

export interface MoveOptions extends Partial<State.Move> {
  species?: Specie | string;
  item?: string;
  ability?: string;
};

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

  static createPokemon(
    gen: Generation,
    name: string,
    options: PokemonOptions = {}
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
      options.weighthg ? options.weighthg :
      options.weightkg ? options.weightkg / 10 : species.weighthg;
    if (pokemon.weighthg < 1) throw new Error(`weighthg of ${pokemon.weighthg} must be at least 1`);

    // Item
    pokemon.item = undefined;
    if (options.item) {
      const item = gen.items.get(options.item);
      if (!item) invalid(gen, 'item', options.item);
      pokemon.item = item.id;
    }

    // Ability
    pokemon.ability = undefined;
    if (options.ability) {
      const ability = gen.abilities.get(options.ability);
      if (!ability) invalid(gen, 'ability', options.ability);
      pokemon.ability = ability.id;
    }

    // Gender
    if (options.gender) {
      if (gen.num === 1) throw new Error(`Gender does not exist in generation 1`);
      if (pokemon.species.gender && options.gender !== pokemon.species.gender) {
        throw new Error(`${pokemon.species.name} must be ${pokemon.species.gender}`);
      }
      pokemon.gender = options.gender || pokemon.species.gender || 'M';
    } else {
      pokemon.gender = gen.num === 1 ? undefined : 'M';
    }

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
      if (pokemon.status === 'tox')  pokemon.statusData = {toxicTurns: 0};
    }

    // Status
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
    pokemon.volatiles = {};
    if (options.volatiles) {
      if (Array.isArray(options.volatiles)) {
        for (const volatile of options.volatiles) {
          const condition = Conditions.get(gen, volatile);
          if (!condition) invalid(gen, 'volatile status', volatile);
          const [name, kind] = condition;
          if (kind !== 'Volatile Status') {
            throw new Error(`'${name} is a ${kind} not a Volatile Status in generation ${gen.num}`);
          }
          pokemon.volatiles[toID(name)] = {};
        }
      } else {
        for (const volatile in options.volatiles) {
          const condition = Conditions.get(gen, volatile);
          if (!condition) invalid(gen, 'volatile status', volatile);
          const [name, kind] = condition;
          if (kind !== 'Volatile Status') {
            throw new Error(`'${name} is a ${kind} not a Volatile Status in generation ${gen.num}`);
          }
          // TODO: verify layers
          pokemon.volatiles[toID(name)] = options.volatiles[volatile];
        }
      }
    }

    // Types
    pokemon.types = options.types || pokemon.species.types;
    pokemon.addedType = options.addedType;

    // Nature
    pokemon.nature = undefined;
    if (options.nature) {
      const nature = gen.natures.get(options.nature);
      if (!nature) invalid(gen, 'nature', options.nature);
      pokemon.nature = nature.name;
    }

    // EVs
    setValues(gen, pokemon, 'evs', options.evs)

    // FIXME IVs / DVs

    // Boosts

    pokemon.boosts = {};
    if (options.boosts) {
      for (const b in options.boosts) {
        if (b === 'spc') continue;
        const boost = b as keyof BoostsTable
        const val = options.boosts[boost];
        if (typeof val === 'number') pokemon.boosts[boost] = bounded('boosts', val);
      }
    }
    setSpc(gen, pokemon.boosts, 'boosts', options.boosts);

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

    return pokemon as State.Pokemon;
  }

  static createMove(
    gen: Generation,
    name: string,
    options: MoveOptions = {}
  ) {
    const base = gen.moves.get(name);
    if (!base) invalid(gen, 'move', name);
    // whatever, the species / item / ability are fine, and no one has time to validate move fields
    const move = extend({}, base, options);
    move.crit = options.crit ?? base.willCrit;
    if (typeof options.magnitude === 'number') {
      if (move.id !== 'magnitude') {
        throw new Error(`magnitude ${options.magnitude} incorrectly set on move '${base.name}'`);
      }
      move.magnitude = bounded('magnitude', options.magnitude);
    }
    // TODO
    // hits?: number;
    // spreadHit?: boolean;
    // numConsecutive?: number;
    return move;
  }

  static mergeSet(pokemon: State.Pokemon, move: string | PokemonSet, ...sets: PokemonSet[]) {
    const set = bestMatch(pokemon, move, ...sets);

    pokemon.level = set.level || pokemon.level;
    pokemon.item = set.item ? toID(set.item) : pokemon.item;
    pokemon.ability = set.ability ? toID(set.ability) : pokemon.ability;
    pokemon.gender = set.gender as GenderName || pokemon.gender;
    pokemon.happiness = set.happiness || pokemon.happiness;
    pokemon.nature = set.nature as NatureName || pokemon.nature;

    // TODO: what about hidden power dynamics and HP dv, shiny etc
    // evs: StatsTable;
    // ivs: StatsTable;
    // shiny?: boolean;

    return pokemon;
  }
}

export namespace State {
  export interface Field {
    weather?: WeatherName;
    terrain?: TerrainName;
    pseudoWeather: {[id: string]: unknown};
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
    }>;
    // Similarly niche, Beat Up etc requires information about the entire team. Must be a subset
    // of State.Pokemon so that a State.Pokemon object could be used in this array
    party?: Array<{
      // Fields required for Beat Up mechanics
      species: {baseStat: {atk: number}};
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

export class Context {
  gameType: GameType;
  gen: Generation;
  p1: Context.Side;
  p2: Context.Side;
  move: Context.Move;
  field: Context.Field;

  readonly relevant: Relevancy;

  constructor(state: DeepReadonly<State>, relevant: Relevancy, handlers: Handlers) {
    this.gameType = state.gameType;
    this.gen = state.gen as Generation;
    this.p1 = new Context.Side(this.gen, state.p1, relevant.p1, handlers),
    this.p2 = new Context.Side(this.gen, state.p2, relevant.p2, handlers);
    this.move = new Context.Move(state.move, relevant.move, handlers),
    this.field = new Context.Field(state.field, relevant.field, handlers);
    this.relevant = relevant;
  }
}

export namespace Context {
  export class Field {
    weather?: {name: WeatherName} & Partial<Handler>;
    terrain?: {name: TerrainName} & Partial<Handler>;
    pseudoWeather: {[id: string]: Partial<Handler>};

    readonly relevant: Relevancy.Field;

    constructor(state: DeepReadonly<State.Field>, relevant: Relevancy.Field, handlers: Handlers) {
      this.relevant = relevant;

      if (state.weather) {
        const id = toID(state.weather)
        this.weather = reify({name: state.weather}, id, handlers.Conditions, () => {
          this.relevant.weather = true;
        });
      }
      if (state.terrain) {
        const id = toID(state.terrain);
        this.terrain = reify({name: state.terrain}, id, handlers.Conditions, () => {
          this.relevant.terrain = true;
        });
      }
      this.pseudoWeather = {};
      for (const pw in state.pseudoWeather) {
        this.pseudoWeather[pw] =
          reify({data: state.pseudoWeather[pw]}, pw as ID, handlers.Conditions, () => {
            this.relevant.pseudoWeather[pw] = true;
          });
      }
    }
  }

  export class Side {
    pokemon: Pokemon;
    sideConditions: {[id: string]: {level?: number} & Partial<Handler>};
    active?: Array<{
      ability?: ID;
      position?: number;
      fainted?: boolean;
    }>;
    party?: Array<{
      species: {baseStat: {atk: number}};
      status?: StatusName;
      fainted?: boolean;
      position?: number;
    }>;

    readonly relevant: Relevancy.Side;

    constructor(
      gen: Generation,
      state: DeepReadonly<State.Side>,
      relevant: Relevancy.Side,
      handlers: Handlers
    ) {
      this.relevant = relevant;

      this.pokemon = new Pokemon(gen, state.pokemon, relevant.pokemon, handlers);
      this.sideConditions = {};
      for (const sc in state.sideConditions) {
        this.sideConditions[sc] =
          reify(state.sideConditions[sc], sc as ID, handlers.Conditions, () => {
            this.relevant.sideConditions[sc] = true;
          });
      }
      this.active = this.active?.map(p => extend({}, p));
      this.party = this.party?.map(p => extend({}, p));
    }
  }

  export class Pokemon {
    species: Specie;
    level: number;
    weighthg: number;

    item?: {id: ID} & Partial<Handler>;
    ability?: {id: ID} & Partial<Handler>;
    gender?: GenderName;
    happiness?: number;

    status?: {name: StatusName} & Partial<Handler>;
    statusData?: {toxicTurns: number};
    volatiles: {[id: string]: {level?: number} & Partial<Handler>};

    types: [TypeName] | [TypeName, TypeName];
    addedType?: TypeName;

    maxhp: number;
    hp: number;

    // The stored stats based simply on spread and base stats.
    stats: StatsTable;
    boosts: BoostsTable;

    position?: number;
    fainted?: boolean;

    switching?: 'in' | 'out';
    moveLastTurnResult?: false | unknown;
    hurtThisTurn?: boolean;

    readonly relevant: Relevancy.Pokemon;

    constructor(
      gen: Generation,
      state: DeepReadonly<State.Pokemon>,
      relevant: Relevancy.Pokemon,
      handlers: Handlers
    ) {
      this.relevant = relevant;

      this.species = state.species as Specie;
      this.level = state.level;
      this.weighthg = state.weighthg;

      if (state.item) {
        this.item = reify({id: state.item}, state.item, handlers.Items, () => {
          this.relevant.item = true;
        });
      }
      if (state.ability) {
        this.ability = reify({id: state.ability}, state.ability, handlers.Abilities, () => {
          this.relevant.ability = true;
        });
      }
      this.gender = state.gender;
      this.happiness = state.happiness;

      if (state.status) {
        this.status = reify({name: state.status}, state.status as ID, handlers.Conditions, () => {
          this.relevant.status = true;
        });
      }
      this.statusData = this.statusData && extend({}, state.statusData);
      this.volatiles = {};
      for (const v in state.volatiles) {
        this.volatiles[v] = reify(state.volatiles[v], v as ID, handlers.Conditions, () => {
          this.relevant.volatiles[v] = true;
        });
      }

      this.types = state.types.slice() as Pokemon['types'];
      this.addedType = state.addedType;

      this.maxhp = state.maxhp;
      this.hp = state.hp;

      this.stats = {} as StatsTable;
      for (const stat of gen.stats) {
        this.stats[stat] = gen.stats.calc(
          stat,
          this.species.baseStats[stat],
          state.ivs?.[stat] ?? 31,
          state.evs?.[stat] ?? (gen.num <= 2 ? 252 : 0),
          state.level,
          gen.natures.get(state.nature!)!
        );
      }
      this.boosts = extend({}, state.boosts);

      this.position = state.position;
      this.switching = state.switching;
      this.moveLastTurnResult = state.moveLastTurnResult;
      this.hurtThisTurn = state.hurtThisTurn;
    }
  }

  export class Move implements State.Move, Partial<Handler> {
    id!: ID;
    name!: MoveName;
    fullname!: string;
    exists!: boolean;
    num!: number;
    gen!: GenerationNum;
    shortDesc!: string;
    desc!: string;
    isNonstandard!: Nonstandard | null;
    duration?: number;

    effectType!: 'Move';
    kind!: 'Move';
    secondaries!: SecondaryEffect[] | null;
    flags!: MoveFlags;
    zMoveEffect?: ID;
    isZ!: boolean | ID;
    zMove?: {
      basePower?: number;
      effect?: ID;
      boost?: Partial<BoostsTable>;
    };
    isMax!: boolean | SpeciesName;
    maxMove?: {
      basePower: number;
    };
    noMetronome?: MoveName[];
    volatileStatus?: ID;
    slotCondition?: ID;
    sideCondition?: ID;
    terrain?: ID;
    pseudoWeather?: ID;
    weather?: ID;

    basePower!: number;
    type!: TypeName;
    accuracy!: true | number;
    pp!: number;
    target!: MoveTarget;
    priority!: number;
    category!: MoveCategory;

    realMove?: string;
    effect?: Partial<PureEffectData>;
    damage?: number | 'level' | false | null;
    noPPBoosts?: boolean;

    ohko?: boolean | TypeName;
    thawsTarget?: boolean;
    heal?: number[] | null;
    forceSwitch?: boolean;
    selfSwitch?: boolean | 'copyvolatile';
    selfBoost?: { boosts?: Partial<BoostsTable> };
    selfdestruct?: boolean | 'ifHit' | 'always';
    breaksProtect?: boolean;
    recoil?: [number, number];
    drain?: [number, number];
    mindBlownRecoil?: boolean;
    stealsBoosts?: boolean;
    secondary?: SecondaryEffect | null;
    self?: HitEffect | null;
    struggleRecoil?: boolean;

    alwaysHit?: boolean;
    basePowerModifier?: number;
    critModifier?: number;
    critRatio?: number;
    defensiveCategory?: MoveCategory;
    forceSTAB?: boolean;
    ignoreAbility?: boolean;
    ignoreAccuracy?: boolean;
    ignoreDefensive?: boolean;
    ignoreEvasion?: boolean;
    ignoreImmunity?: boolean | { [k in keyof TypeName]?: boolean };
    ignoreNegativeOffensive?: boolean;
    ignoreOffensive?: boolean;
    ignorePositiveDefensive?: boolean;
    ignorePositiveEvasion?: boolean;
    infiltrates?: boolean;
    multiaccuracy?: boolean;
    multihit?: number | number[];
    noCopy?: boolean;
    noDamageVariance?: boolean;
    noFaint?: boolean;
    nonGhostTarget?: MoveTarget;
    pressureTarget?: MoveTarget;
    sleepUsable?: boolean;
    smartTarget?: boolean;
    spreadModifier?: number;
    tracksTarget?: boolean;
    useSourceDefensiveAsOffensive?: boolean;
    useTargetOffensive?: boolean;
    willCrit?: boolean;

    hasCrashDamage?: boolean;
    isConfusionSelfHit?: boolean;
    isFutureMove?: boolean;
    noSketch?: boolean;
    stallingMove?: boolean;

    crit?: boolean;
    hits?: number;
    magnitude?: number;
    spreadHit?: boolean;
    numConsecutive?: number;

    apply?(state: State): void; // Silence TS2559

    readonly relevant: Relevancy.Move;

    constructor(state: DeepReadonly<State.Move>, relevant: Relevancy.Move, handlers: Handlers) {
      this.relevant = relevant;
      extend(this, state);
      reify(this, this.id, handlers.Moves);
    }
  }
}

function reify<T>(
  obj: T & Partial<Handler>,
  id: ID,
  handlers: Handlers[keyof Handlers],
  callback?: () => void
) {
  const handler = handlers[id];
  if (handler) {
    for (const n in handler) {
      const fn = handler[n as keyof Handler] as Omit<Handler, 'apply'> | undefined;
      if (fn && n !== 'apply') {
        obj[n as Exclude<keyof Handler, 'apply'>] = (c: Context) => {
          const r = (fn as any)(c);
          if (r && callback) callback();
          return r;
        };
      }
    }
  }
  return obj;
}

// Naive algorithm for determing the 'best' matching set to the `pokemon` (with optional `move`) -
// iterate through each set and assign it a score based on how many fields match vs. how many
// conflict (with the score being unaffected if the field is not set) and then return the highest
// scoring set, breaking ties by using the ordering of the sets provided. This works well enough
// in a pinch, but could be improved by valuing certain fields more than others or eg. relying on
// a set clustering similarity metric.
function bestMatch(pokemon: State.Pokemon, move: string | PokemonSet, ...sets: PokemonSet[]) {
  if (typeof move !== 'string') {
    sets.unshift(move);
    move = '';
  }

  const match = (a: string, b: string) => toID(a) === toID(b);
  const scored: Array<[number, PokemonSet]> = [];
  for (const set of sets) {
    let score = 0;
    if (!match(set.species, pokemon.species.name)) {
      throw new Error(`Received invalid ${set.species} set for ${pokemon.species.name}`);
    }
    if (set.level !== pokemon.level) score--;
    if (!match(set.item, pokemon.item!)) {
      score--;
    } else if (pokemon.item) {
      score++
    }
    if (!match(set.ability, pokemon.ability!)) {
      score--;
    } else if (pokemon.ability) {
      score++
    }
    if (!match(set.nature, pokemon.nature!)) {
      score--;
    } else if (pokemon.nature) {
      score++
    }
    if (move && !set.moves.some(m => match(m, move as string))) {
      score--;
    } else if (move) {
      score++
    }
    scored.push([score, set]);
  }
  if (!scored.length) throw new Error(`Received no sets for ${pokemon.species.name}`);

  let best: [number, PokemonSet] = scored[0];
  for (let i = 1; i < scored.length; i++) {
    if (scored[i][0] > best[0]) best = scored[i];
  }

  return best[1];
}

function setValues(
  gen: Generation,
  pokemon: Partial<State.Pokemon>,
  type: 'evs' | 'ivs',
  vals?: Partial<StatsTable & {spc: number}>
) {
  pokemon[type] = {};
  for (const stat of gen.stats) {
    pokemon[type]![stat] = type == 'evs' ? (gen.num <= 2 ? 252 : 0) : 31;
    const val = vals?.[stat];
    if (typeof val === 'number') pokemon[type]![stat] = bounded(type, val);
  }
  setSpc(gen, pokemon[type]!, type, vals);
}

function setSpc(
  gen: Generation,
  existing: Partial<{spc: number, spa: number, spd: number}>,
  type: 'evs' | 'ivs' | 'boosts',
  vals?: Partial<{spc: number, spa: number, spd: number}>
) {
  let spc = vals?.spc;
  if (typeof spc === 'number') {
    if (gen.num >= 2) throw new Error('Spc does not exist after generation 1');
    if (typeof vals!.spa === 'number' && vals!.spa != spc) {
      throw new Error(`Spc and SpA ${type} mismatch: ${spc} vs. ${vals!.spa}`);
    }
    if (typeof vals!.spd === 'number' && vals!.spd != spc) {
      throw new Error(`Spc and SpD ${type} mismatch: ${spc} vs. ${vals!.spd}`);
    }
    existing.spa = existing.spd = bounded(type, spc);
  }
  if (gen.num <= 2 && existing.spa !== existing.spd) {
    throw new Error(`SpA and SpD ${type} must match before generation 3`);
  }
}