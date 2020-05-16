import {extend} from './tools';
import {State} from "./state";
import {Generation, GameType, ID, StatusName, GenderName, Specie, TypeName, StatsTable, BoostsTable} from '@pkmn/data';
import {SideID, Handler, Items, Abilities } from './mechanics';
import {Silhouette} from './silhouette';

// import {Handler} from './handler';

// export const Moves: {[id: string]: Partial<Handler>} = {

// };

export class Context {
  readonly gameType: GameType;
  readonly gen: Generation;
  readonly p1: Context.Side;
  readonly p2: Context.Side;
  readonly move: Context.Move;
  readonly field: Context.Field;

  readonly relevant: Silhouette;

  static fromState(state: State) {
    return new Context(state.gameType, state.gen, state.p1, state.p2, state.move, state.field);
  }

  constructor(
    gameType: GameType,
    gen: Generation,
    p1: State.Side,
    p2: State.Side,
    move: State.Move,
    field: State.Field
  ) {
    this.relevant = new Silhouette();

    this.gameType = gameType;
    this.gen = gen;
    this.p1 = new Context.Side(p1, this.relevant);
    this.p2 = new Context.Side(p2, this.relevant);
    this.move = move, // FIXME
    this.field = new Context.Field(field, this.relevant);
  }
}

export namespace Context {
  export class Field {
    weather?: ID;
    terrain?: ID;
    pseudoWeather?: {[id: string]: unknown};

    readonly relevant: Silhouette;

    constructor(field: State.Field, relevant: Silhouette) {
      extend(this, field);
      this.relevant = relevant;
    }

    hasWeather(...weathers: ID[]) {
      return !!(this.weather && weathers.includes(this.weather));
    }

    hasTerrain(...terrains: ID[]) {
      return !!(this.terrain && terrains.includes(this.terrain));
    }
  }

  export class Side {
    pokemon: Pokemon;
    sideConditions: {[id: string]: {level?: number}};
    active?: Array<{
      position?: number;
      ability?: ID,
      fainted?: boolean
    }>;
    party?: Array<{
      position?: number;
      species: {baseStat: {atk: number}},
      status?: StatusName,
      fainted?: boolean
    }>;

    readonly relevant: Silhouette;

    constructor(side: State.Side, relevant: Silhouette) {
      this.relevant = relevant;
      this.pokemon = new Pokemon(side.pokemon, this.relevant);
      this.sideConditions = extend({}, side.sideConditions);
      this.active = this.active?.map(p => extend({}, p));
      this.party = this.party?.map(p => extend({}, p));
    }
  }

  class Pokemon {
    species: Specie;
    level: number;
    weighthg: number;

    item?: Partial<Handler> & {id: ID}
    ability?: Partial<Handler> & {id: ID};
    gender?: GenderName;
    happiness?: number;

    status?: StatusName;
    statusData?: {toxicTurns: number};
    volatiles: {[id: string]: {level?: number, numConsecutive?: number}};

    types: [TypeName] | [TypeName, TypeName];
    addedType?: TypeName;

    maxhp: number;
    baseMaxHP: number;
    hp: number;

    stats: Omit<StatsTable, 'hp'>;
    boosts: BoostsTable;

    position?: number;
    switching?: 'in' | 'out';
    moveLastTurnResult?: false | unknown;
    hurtThisTurn?: boolean;
    fainted?: boolean;

    readonly relevant: Silhouette;

    constructor(pokemon: State.Pokemon, relevant: Silhouette) {
      this.relevant = relevant;

      this.species = pokemon.species;
      this.level = pokemon.level;
      this.weighthg = pokemon.weighthg;
      this.happiness = pokemon.happiness;
      this.status = pokemon.status;
      this.statusData = this.statusData && extend({}, pokemon.statusData);
      this.volatiles = extend({}, pokemon.volatiles);
      this.types = pokemon.types.slice() as Pokemon['types'];
      this.addedType = pokemon.addedType;
      this.maxhp = pokemon.maxhp;
      this.baseMaxHP = pokemon.baseMaxHP;
      this.hp = pokemon.hp;
      this.stats = extend({}, pokemon.stats);
      this.boosts = extend({}, pokemon.boosts);
      this.position = pokemon.position;
      this.switching = pokemon.switching;
      this.moveLastTurnResult = pokemon.moveLastTurnResult;
      this.hurtThisTurn = pokemon.hurtThisTurn;
      this.fainted = pokemon.fainted;

      if (pokemon.item) {
        this.item = {id: pokemon.item};
        const handler = Items[pokemon.item];

        for (const n in handler) {
          const fn = handler[n as keyof Handler] as Omit<Handler, 'apply'> | undefined;
          if (fn && n !== 'apply') {
            this.item[n as Exclude<keyof Handler, 'apply'>] = (s: SideID, c: Context) => {
              const r = (fn as any)(s, c);
              if (r) this.relevant[s].pokemon.item = true;
              return r;
            };
          }
        }
      }

      if (pokemon.ability) {
        this.ability = {id: pokemon.ability};
        const handler = Abilities[pokemon.ability];

        for (const n in handler) {
          const fn = handler[n as keyof Handler] as Omit<Handler, 'apply'> | undefined;
          if (fn && n !== 'apply') {
            this.ability[n as Exclude<keyof Handler, 'apply'>] = (s: SideID, c: Context) => {
              const r = (fn as any)(s, c);
              if (r) this.relevant[s].pokemon.ability = true;
              return r;
            };
          }
        }
      }
    }

    hasAbility(...abilities: ID[]) {
      return !!(this.ability && abilities.includes(this.ability.id));
    }

    hasItem(...items: ID[]) {
      return !!(this.item && items.includes(this.item.id));
    }

    hasStatus(...statuses: StatusName[]) {
      return !!(this.status && statuses.includes(this.status));
    }

    hasType(...types: TypeName[]) {
      for (const type of types) {
        if (this.types.includes(type)) return true;
      }
      return false;
    }
  }
}