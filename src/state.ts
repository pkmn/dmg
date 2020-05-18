import {
  BoostsTable,
  GameType,
  GenderName,
  Generation,
  ID,
  Move as DMove,
  Specie,
  StatsTable,
  StatusName,
  TypeName,
} from '@pkmn/data';
import {Handler} from './mechanics/handler';


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
    weather?: ID;
    terrain?: ID;
    pseudoWeather?: {[id: string]: unknown};
  }

  export interface Side {
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
  }

  export interface Pokemon {
    species: Specie;
    level: number;
    weighthg: number;

    item?: {id: ID} & Partial<Handler>;
    ability?: {id: ID} & Partial<Handler>;
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
  }

  export interface Move extends DMove, Partial<Handler> {
    crit?: boolean;
    hits?: number;
    magnitude?: number;
    spreadHit?: boolean;
  }
}
