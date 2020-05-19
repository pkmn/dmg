import {StatsTable} from '@pkmn/data';

import { State, Context } from './state';
import { DeepReadonly } from './types';
import { Handlers } from './mechanics';

export type Damage =
  | number // fixed damage, single hit
  | number[] // standard damage rolls
  | [number, number] // fixed damage, two hits (only Parental Bond)
  | [number[], number[]] // standard damage rolls, two hits
  | [number[], number[], number[]]
  | [number[], number[], number[], number[]]
  | [number[], number[], number[], number[], number[]]


export class Relevancy {
  readonly p1: Relevancy.Side;
  readonly p2: Relevancy.Side;
  readonly move: Relevancy.Move;
  readonly field: Relevancy.Field;

  constructor() {
    this.p1 = {pokemon: {volatiles: {}, stats: {}}, sideConditions: {}};
    this.p2 = {pokemon: {volatiles: {}, stats: {}}, sideConditions: {}};
    this.field = {pseudoWeather: {}};
    this.move = {};
  }
}

export namespace Relevancy {
  export interface Field {
    weather?: boolean;
    terrain?: boolean;
    pseudoWeather: {[id: string]: boolean};
  }

  export interface Side {
    pokemon: Pokemon;
    sideConditions: {[id: string]: boolean};
    active?: boolean;
    party?: boolean;
  }

  export interface Pokemon {
    // species is always relevant
    // level is always relevant (though sometimes elided from the output)
    // weighthg is relevant for weight based moves, but that's covered by move base power

    item?: boolean
    ability?: boolean;

    status?: boolean;
    // statusData is covered by status: 'tox' already
    volatiles: {[id: string]: boolean};

    // types are always relevant (though usually elided in output)
    // addedType is always relevant

    // hp is relevant for the defender, but is checked when calculated OHKO chance

    // certain moves/condtions change which stats are relevant
    stats: Partial<Omit<StatsTable<boolean>, 'hp'>>;

    // position is never relevant, it merely exists as an implementation detail

    // relevant for the specific moves that make use of them
    gender?: boolean;
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

  readonly context: Context;
  readonly relevant: Relevancy;

  damage: Damage;

  constructor(state: State, handlers: Handlers) {
    this.damage = 0;
    this.state = state as DeepReadonly<State>;
    this.relevant = new Relevancy();
    this.context = new Context(state, this.relevant, handlers);
  }


  get range() {
    return null! as [number, number]; // TODO
  }

  get desc() {
    return this.fullDesc();
  }

  get recoil() {
    return null! as [number, number];
  }

  get recovery() {
    return null! as [number, number];
  }

  fullDesc(notation = '%') {
    return ''; // TODO
  }

  moveDesc(notation = '%') {
    return ''; // TODO
  }

  recoilDesc(notation = '%') {
    return ''; // TODO
  }

  recoveryDesc(notation = '%') {
    return ''; // TODO
  }
}