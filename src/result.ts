import type {Generation, Specie, StatsTable, BoostsTable, StatName, BoostName} from '@pkmn/data';

import {State} from './state';
import {Context} from './context';
import {DeepReadonly, extend} from './utils';
import {Handlers, HANDLERS} from './mechanics';

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
    team?: boolean;
  }

  export interface Pokemon {
    // species is always relevant
    // level is always relevant (though sometimes elided from the output)
    // weighthg is relevant for weight based moves, but that's covered by move base power

    item?: boolean;
    ability?: boolean;

    status?: boolean;
    // statusData is covered by status: 'tox' already
    volatiles: {[id: string]: boolean};

    // types are always relevant (though usually elided in output)
    // addedType is always relevant

    // hp is relevant for the defender, but is checked when calculating OHKO chance

    // certain moves/conditions change which stats are relevant
    stats: Partial<Omit<StatsTable<boolean>, 'hp'>>;
    // usually only the boosts in the relevant stats matter, but Stored Power etc depends on more
    boosts: Partial<BoostsTable<boolean>>;

    // position is never relevant, it merely exists as an implementation detail

    // relevant for the specific moves that make use of them
    gender?: boolean;
    switching?: boolean;
    moveLastTurnResult?: boolean;
    hurtThisTurn?: boolean;
  }

  export interface Move {
    crit?: boolean;
    hits?: boolean;
    magnitude?: boolean;
    spreadHit?: boolean;
    numConsecutive?: boolean;
    // TODO
    // useZ?: boolean;
    // useMax?: boolean;
  }
}

export class Result {
  readonly hits: [HitResult, ...HitResult[]];

  constructor(hit: HitResult) {
    this.hits = [hit];
  }

  get range() {
    let min = 0;
    let max = 0;
    for (const hit of this.hits) {
      const range = hit.range;
      min += range[0];
      max += range[1];
    }
    return [min, max] as [number, number];
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

  chain() {
    const prev = this.hits[this.hits.length - 1];
    const state = prev.context.toState();
    // TODO call `apply` based on KO probabilities of previous hit(s!) to set state for next hit
    const next = new HitResult(state as DeepReadonly<State>, prev.handlers);
    this.add(next);
    return next;
  }

  add(result: Result | HitResult) {
    this.hits.push(...('hits' in result ? result.hits : [result]));
  }

  toString() {
    // TODO print full desc + rolls, include recoil/recovery if applicable
  }
}

// FIXME ko chance : with and without residual

export class HitResult {
  readonly state: DeepReadonly<State>;
  readonly handlers: Handlers;

  readonly context: Context;
  readonly relevant: Relevancy;
  readonly residual: Relevancy;

  damage: number | number[];

  constructor(state: DeepReadonly<State>, handlers: Handlers = HANDLERS) {
    this.damage = 0;
    this.state = state;
    this.handlers = handlers;
    this.relevant = new Relevancy();
    this.residual = new Relevancy();
    this.context = new Context(state, this.relevant, this.residual, handlers);
  }

  get range() {
    if (!Array.isArray(this.damage)) return [this.damage, this.damage];
    let min = this.damage[0];
    let max = min;
    for (let i = 1; i < this.damage.length; i++) {
      if (this.damage[i] < min) {
        min = this.damage[i];
      } else if (this.damage[i] > max) {
        max = this.damage[i];
      }
    }
    return [min, max] as [number, number];
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
    const state = this.state; // FIXME this.context.toState();
    const gen = state.gen as Generation;
    return {
      gen,
      gameType: this.relevant.gameType ? state.gameType : 'singles',
      p1: this.simplifySide(gen, state.p1, this.relevant.p1),
      p2: this.simplifySide(gen, state.p2, this.relevant.p2),
      move: this.simplifyMove(state.move, this.relevant.move),
      field: this.simplifyField(state.field, this.relevant.field),
    };
  }

  toString() {
    // TODO print full desc + rolls, include recoil/recovery if applicable
  }

  private simplifyField(state: DeepReadonly<State.Field>, relevant: Relevancy.Field) {
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

  private simplifySide(gen: Generation, state: DeepReadonly<State.Side>, relevant: Relevancy.Side) {
    const side: State.Side = {
      pokemon: this.simplifyPokemon(gen, state.pokemon, relevant.pokemon),
      sideConditions: {},
      active: relevant.active ? state.active!.map(p => extend({}, p)) : undefined,
      team: relevant.team ? state.team!.map(p => extend({}, p)) : undefined,
    };
    for (const id in state.sideConditions) {
      if (relevant.sideConditions[id]) {
        side.sideConditions[id] = extend({}, state.sideConditions[id]);
      }
    }
    return side;
  }

  private simplifyPokemon(
    gen: Generation,
    state: DeepReadonly<State.Pokemon>,
    relevant: Relevancy.Pokemon
  ) {
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
      nature: state.nature,
      evs: {},
      ivs: {},
      boosts: {},
      switching: relevant.switching ? state.switching : undefined,
      moveLastTurnResult: relevant.moveLastTurnResult ? state.moveLastTurnResult : undefined,
      hurtThisTurn: relevant.hurtThisTurn ? state.hurtThisTurn : undefined,
    };
    for (const id in state.volatiles) {
      if (relevant.volatiles[id]) pokemon.volatiles[id] = extend({}, state.volatiles[id]);
    }
    for (const s in relevant.stats) {
      const stat = s as StatName;
      pokemon.evs![stat] = state.evs?.[stat] ?? (gen.num <= 2 ? 252 : 0);
      pokemon.ivs![stat] = state.ivs?.[stat] ?? 31;
    }
    for (const b in relevant.boosts) {
      const boost = b as BoostName;
      pokemon.boosts[boost] = state.boosts[boost];
    }
    return pokemon;
  }

  private simplifyMove(state: DeepReadonly<State.Move>, relevant: Relevancy.Move) {
    const move = extend({}, state) as State.Move;
    if (!relevant.crit) move.crit = undefined;
    if (!relevant.hits) move.hits = undefined;
    if (!relevant.magnitude) move.magnitude = undefined;
    if (!relevant.spreadHit) move.spreadHit = undefined;
    if (!relevant.numConsecutive) move.numConsecutive = undefined;
    return move;
  }
}
