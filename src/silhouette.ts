import {StatsTable} from '@pkmn/data';

export class Silhouette {
  readonly p1: Silhouette.Side;
  readonly p2: Silhouette.Side;
  readonly move: Silhouette.Move;
  readonly field: Silhouette.Field;

  constructor() {
    this.p1 = {pokemon: {volatiles: {}, stats: {}}, sideConditions: {}};
    this.p2 = {pokemon: {volatiles: {}, stats: {}}, sideConditions: {}};
    this.field = {};
    this.move = {};
  }
}

export namespace Silhouette {
  export interface Field {
    weather?: boolean;
    terrain?: boolean;
    pseudoWeather?: {[id: string]: boolean};
  }

  export interface Side {
    pokemon: Pokemon;
    sideConditions: {[id: string]: boolean};
    active?: boolean;
    party?: boolean;
  }

  export interface Pokemon {
    weighthg?: boolean;

    item?: boolean
    ability?: boolean;
    gender?: boolean;

    status?: boolean;
    volatiles: {[id: string]: boolean};

    stats: Partial<Omit<StatsTable<boolean>, 'hp'>>;

    switching?: boolean
    moveLastTurnResult?: boolean;
    hurtThisTurn?: boolean;
  }

  export interface Move {
    // TODO
    crit?: boolean;
    hits?: boolean;
    magnitude?: boolean;
    spreadHit?: boolean;
  }
}