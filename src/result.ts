import {Generation, Specie, StatsTable, BoostsTable} from '@pkmn/data';

import { State } from './state';
import { Context } from './context';
import { DeepReadonly, extend } from './utils';
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
  gameType: boolean;
  readonly p1: Relevancy.Side;
  readonly p2: Relevancy.Side;
  readonly move: Relevancy.Move;
  readonly field: Relevancy.Field;

  constructor() {
    this.gameType = false;
    this.p1 = {pokemon: {volatiles: {}, stats: {}, boosts: {}}, sideConditions: {}};
    this.p2 = {pokemon: {volatiles: {}, stats: {}, boosts: {}}, sideConditions: {}};
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

    // hp is relevant for the defender, but is checked when calculating OHKO chance

    // certain moves/conditions change which stats are relevant
    stats: Partial<Omit<StatsTable<boolean>, 'hp'>>;
    boosts: Partial<BoostsTable<boolean>>;

    // position is never relevant, it merely exists as an implementation detail

    // relevant for the specific moves that make use of them
    gender?: boolean;
    switching?: boolean
    moveLastTurnResult?: boolean;
    hurtThisTurn?: boolean;
  }

  export interface Move {
    // TODO useZ/useMax?
    crit?: boolean;
    hits?: boolean;
    magnitude?: boolean;
    spreadHit?: boolean;
    numConsecutive?: boolean;
  }
}

export class Result {
  readonly state: DeepReadonly<State>;

  readonly context: Context;
  readonly relevant: Relevancy;

  damage: Damage;

  constructor(state: DeepReadonly<State>, handlers: Handlers) {
    this.damage = 0;
    this.state = state;
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
    return undefined as [number, number] | undefined; // TODO
  }

  get recovery() {
    return undefined as [number, number] | undefined; // TODO
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

  simplified(): State {
    return  {
      gameType: this.relevant.gameType ? this.state.gameType : 'singles',
      gen: this.state.gen as Generation,
      p1: simplifySide(this.state.p1, this.relevant.p1),
      p2: simplifySide(this.state.p2, this.relevant.p2),
      move: simplifyMove(this.state.move, this.relevant.move),
      field: simplifyField(this.state.field, this.relevant.field),
    };
  }

  toString() {
    // TODO print full desc + rolls, include recoil/recovery if applicable
  }
}

function simplifySide(state: DeepReadonly<State.Side>, relevant: Relevancy.Side) {
  const side: State.Side = {
    pokemon: simplifyPokemon(state.pokemon, relevant.pokemon),
    sideConditions: {},
    active: relevant.active ? state.active!.map(p => extend({}, p)) : undefined,
    party: relevant.party ? state.party!.map(p => extend({}, p)) : undefined,
  };
  for (const id in state.sideConditions) {
    if (relevant.sideConditions[id]) side.sideConditions[id] = extend({}, state.sideConditions[id]);
  }
  return side;
}

function simplifyPokemon(state: DeepReadonly<State.Pokemon>, relevant: Relevancy.Pokemon) {
  const pokemon: State.Pokemon = {
    species: state.species as Specie,
    level: state.level,
    weighthg: state.weighthg,
    item: relevant.item ? state.item : undefined,
    ability: relevant.ability ? state.ability : undefined,
    gender: relevant.gender ? state.gender : undefined,
    status: relevant.status ? state.status : undefined,
    volatiles: {},
    types: state.types as State.Pokemon['types'],
    maxhp: state.maxhp,
    hp: state.hp,
    nature: undefined,
    evs: {},
    ivs: {},
    boosts: {},
    switching: relevant.switching ? state.switching : undefined,
    moveLastTurnResult: relevant.moveLastTurnResult ? state.moveLastTurnResult : undefined,
    hurtThisTurn: relevant.hurtThisTurn ? state.hurtThisTurn : undefined,
  }
  // TODO nature / evs / ivs / boosts
  for (const id in state.volatiles) {
    if (relevant.volatiles[id]) pokemon.volatiles[id] = extend({}, state.volatiles[id]);
  }
  return pokemon;
}

function simplifyMove(state: DeepReadonly<State.Move>, relevant: Relevancy.Move) {
  const move = extend({}, state) as State.Move;
  if (!relevant.crit) move.crit = undefined;
  if (!relevant.hits) move.hits = undefined;
  if (!relevant.magnitude) move.magnitude = undefined;
  if (!relevant.spreadHit) move.spreadHit = undefined;
  if (!relevant.numConsecutive) move.numConsecutive = undefined;
  return move;
}

function simplifyField(state: DeepReadonly<State.Field>, relevant: Relevancy.Field) {
  const field: State.Field = {
    weather: relevant.weather ? state.weather : undefined,
    terrain: relevant.terrain ? state.terrain : undefined,
    pseudoWeather: {},
  };
  for (const id in state.pseudoWeather) {
    if (relevant.pseudoWeather[id]) field.pseudoWeather[id] = extend({}, state.pseudoWeather[id]);
  }
  return field;
}