import {
  BoostsTable,
  GameType,
  GenderName,
  Generation,
  ID,
  Move as DMove,
  NatureName,
  Specie,
  StatsTable,
  StatusName,
  TypeName,
  toID,
} from '@pkmn/data';
import {WeatherName, TerrainName} from './conditions';
import {Handlers, Handler} from './mechanics';
import { Relevancy } from './result';
import { extend } from './tools';

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
    field: State.Field = {},
    gameType: GameType = 'singles'
  ) {
    this.gameType = gameType;
    this.gen = gen;
    this.p1 = 'pokemon' in attacker ? attacker : {pokemon: attacker, sideConditions: {}};
    this.p2 = 'pokemon' in defender ? defender : {pokemon: defender, sideConditions: {}};
    this.move = move;
    this.field = field;
  }
}

export namespace State {
  export interface Field {
    weather?: WeatherName;
    terrain?: TerrainName;
    pseudoWeather?: {[id: string]: unknown};
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
    statusData?: {toxicTurns: number};
    // Level is used to track layers/stockpiles/etc
    volatiles: {[id: string]: {level?: number}};

    types: [TypeName] | [TypeName, TypeName];
    // Type added by Trick-or-Treat/Forest's Curse etc
    addedType?: TypeName;

    // Base max HP is stats.hp, but max HP may change due to Dynamaxing or Power Contruct etc
    maxhp: number;
    hp: number;

    nature: NatureName;
    evs?: Partial<StatsTable>;
    ivs?: Partial<StatsTable>;

    boosts: BoostsTable;

    // Use to disambiguate this Pokemon from its allies if included in the Side's active or party
    position?: number;

    // Required for certain moves which effect switches, the most obvious being Pursuit
    switching?: 'in' | 'out';
    // Required for Stomping Tantrum
    moveLastTurnResult?: false | unknown;
    // Required for Assurance
    hurtThisTurn?: boolean;
  }

  export interface Move extends DMove, Partial<Handler> {
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

  constructor(state: State, relevant: Relevancy, handlers: Handlers) {
    this.gameType = state.gameType;
    this.gen = state.gen;
    this.p1 = new Context.Side(state.p1, relevant.p1, handlers),
    this.p2 = new Context.Side(state.p2, relevant.p2, handlers);
    this.move = new Context.Move(state.move, relevant.move, handlers),
    this.field = new Context.Field(state.field, relevant.field, handlers);
    this.relevant = relevant;
  }
}

export namespace Context {
  export class Field {
    weather?: {name: WeatherName} & Partial<Handler>;
    terrain?: {name: TerrainName} & Partial<Handler>;
    pseudoWeather?: {[id: string]: Partial<Handler>};

    readonly relevant: Relevancy.Field;

    constructor(state: State.Field, relevant: Relevancy.Field, handlers: Handlers) {
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
      if (state.pseudoWeather) {
        // FIXME
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

    constructor(state: State.Side, relevant: Relevancy.Side, handlers: Handlers) {
      this.relevant = relevant;

      this.pokemon = new Pokemon(state.pokemon, relevant.pokemon, handlers)
      if (state.sideConditions) {
        // FIXME
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

    constructor(state: State.Pokemon, relevant: Relevancy.Pokemon, handlers: Handlers) {
      this.relevant = relevant;

      this.species = state.species;
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

      this.types = state.types.slice() as Pokemon['types'];
      this.addedType = state.addedType;

      this.maxhp = state.maxhp;
      this.hp = state.hp;

      // TODO stats
      this.boosts = extend({}, state.boosts);

      this.position = state.position;
      this.switching = state.switching;
      this.moveLastTurnResult = state.moveLastTurnResult;
      this.hurtThisTurn = state.hurtThisTurn;
      this.fainted = state.fainted;
    }
  }

  export class Move implements DMove, Partial<Handler> {
    crit?: boolean;
    hits?: number;
    magnitude?: number;
    spreadHit?: boolean;
    numConsecutive?: number;

    readonly relevant: Relevancy.Move;

    constructor(state: State.Move, relevant: Relevancy.Move, handlers: Handlers) {
      this.relevant = relevant;

      // TODO
    }
  }
}

function reify<T>(
  obj: T & Partial<Handler>,
  id: ID,
  handlers: Handlers[keyof Handlers],
  callback: () => void
) {
  const handler = handlers[id];
  if (handler) {
    for (const n in handler) {
      const fn = handler[n as keyof Handler] as Omit<Handler, 'apply'> | undefined;
      if (fn && n !== 'apply') {
        obj[n as Exclude<keyof Handler, 'apply'>] = (c: Context) => {
          const r = (fn as any)(c);
          if (r) callback();
          return r;
        };
      }
    }
  }
  return obj;
}