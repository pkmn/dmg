import {StatsTable} from '@pkmn/data';

import { State } from './state';
import { DeepReadonly } from './types';

export class Relevancy {
  readonly p1: Relevancy.Side;
  readonly p2: Relevancy.Side;
  readonly move: Relevancy.Move;
  readonly field: Relevancy.Field;

  constructor() {
    this.p1 = {pokemon: {volatiles: {}, stats: {}}, sideConditions: {}};
    this.p2 = {pokemon: {volatiles: {}, stats: {}}, sideConditions: {}};
    this.field = {};
    this.move = {};
  }
}

export namespace Relevancy {
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

export class Result {
  readonly state: DeepReadonly<State>;
  readonly relevant: Relevancy;

  constructor(state: DeepReadonly<State>) {
    this.state = state;
    this.relevant = new Relevancy();
  }
}