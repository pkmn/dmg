import type {Generation, Specie, StatsTable, BoostsTable, StatName, BoostName} from '@pkmn/data';

import {Context} from './context';
import {encode} from './encode';
import {Handlers, HANDLERS} from './mechanics';
import {State} from './state';
import {DeepReadonly, extend, is} from './utils';
import * as math from './math';

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
    hits?: number;
    magnitude?: number;
    consecutive?: number;
    spread?: boolean;
    useZ?: boolean;
  }
}

// TODO: Single move, potentially multiple hits (which could change the context and the relevance
// each hit). Include relevancy from residual, but need to be
// TODO
// a) context gets chained along (as state)
// able to display OHKO chances WITH and WITHOUT residual

/**
 * The result of a damage calculation. Multi-hit moves or moves affected by Parental Bond etc may
 * consist of multiple `HitResult` objects. A `Result` always reflects the result of a single move
 * for a single turn, though multiple `Result` objects may be chained together.
 */
export class Result {
  readonly hits: [HitResult, ...HitResult[]];

  constructor(hit: HitResult) {
    this.hits = [hit];
  }

  get state(): DeepReadonly<State> {
    return this.hits[0].state;
  }

  get handlers(): Handlers {
    return this.hits[0].handlers;
  }

  get relevant(): Relevancy {
    return this.hits[this.hits.length - 1].relevant;
  }

  get context(): Context {
    return this.hits[this.hits.length - 1].context;
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

  get text() {
    return this.description();
  }

  get recoil() {
    return undefined as number | [number, number] | undefined; // TODO
  }

  get recovery() {
    const {gen, p1, p2, move} = this.context;

    let recovery: number | [number, number] | undefined;

    const ignored = gen.num === 3 && is(move.name, 'Doom Desire', 'Future Sight');
    if (p1.pokemon.item?.id === 'shellbell' && !ignored) {
      const max = math.round(p2.pokemon.maxhp / 8);
      for (const hit of this.hits) {
        if (Array.isArray(hit.damage)) {
          if (!recovery) recovery = [0, 0];
          const range = hit.range;
          (recovery as [number, number])[0] += math.min(math.round(range[0] / 8), max);
          (recovery as [number, number])[1] += math.min(math.round(range[1] / 8), max);
        } else {
          recovery = (recovery || 0) as number + math.min(math.round(hit.damage / 8), max);
        }
      }
    }

    if (is(move.name, 'G-Max Finale')) {
      const healed =  math.round(p1.pokemon.maxhp / 6);;
      if (Array.isArray(recovery)) {
        recovery[0] += healed;
        recovery[1] += healed;
      } else {
        recovery = (recovery || 0) as number + healed;
      }
    } else if (move.drain) {
      const healed = move.drain[0] / move.drain[1];
      const max = math.round(p2.pokemon.maxhp * healed);
      for (const hit of this.hits) {
        if (Array.isArray(hit.damage)) {
          if (!recovery) recovery = [0, 0];
          const range = hit.range;
          (recovery as [number, number])[0] += math.min(math.round(range[0] * healed), max);
          (recovery as [number, number])[1] += math.min(math.round(range[1] * healed), max);
        } else {
          recovery = (recovery || 0) as number + math.min(math.round(hit.damage * healed), max);
        }
      }
    }

    return recovery;
  }

  // TODO do we care about which things proc-ed onResidual?

  // chain (if same turn, wont be taking hazards), if second term just nothing / residual
  get knockout() {
    // FIXME ko chance : with and without residual
    return undefined! as {none: number, hazards: number, residual: number, both: number}; // TODO
  }

  description(notation: '%' | '/48' | 'px' | number = '%') {
    const text = {desc: '', result: '', move: '', recovery: '', recoil: ''};

    const state = encode(this.hits[this.hits.length - 1].simplified());

    const recovery = this.recovery;
    if (recovery !== undefined) {
      if (Array.isArray(recovery)) {
        const min = this.display(notation, recovery[0], this.state.p1.pokemon.maxhp);
        const max = this.display(notation, recovery[1], this.state.p1.pokemon.maxhp);
        text.recovery = `${min} - ${max}${notation} recovered`;
      } else {
        const amount = this.display(notation, recovery, this.state.p1.pokemon.maxhp);
        text.recovery = `${amount}${notation} recovered`;
      }
    }

    return text;
  }

  chain() {
    const prev = this.hits[this.hits.length - 1];
    const state = prev.context.toState();
    // TODO call `apply` based on KO probabilities of previous hit(s!) to set state for next hit
    const hit = new HitResult(state as DeepReadonly<State>, prev.handlers, prev.relevant);
    this.hits.push(hit);
    return hit;
  }

  toString() {
    const text = this.text;
    let end = text.recovery;
    if (text.recoil) end = end ? `${end}, ${text.recoil}` : text.recoil;
    if (end) end = ` (${end})`;
    const rolls = this.hits.map(h =>
      `[${typeof h.damage === 'number' ? h.damage : h.damage.join(', ')}]`
    ).join(', ');
    return `${text.desc}${end}\n${rolls}`
  }

  private display(notation: '%' | '/48' | 'px' | number, a: number, b: number, f = 1) {
    if (notation === '%') return Math.floor((a * (1000 / f)) / b) / 10;
    const g = this.state.gen.num;
    const px =
      notation === '/48' ? 48 :
      notation === 'px' ? (g < 7 ? 48 : g < 8 ? 86 : 400) :
      notation;
    return Math.floor((a * (px / f)) / b);
  }
}

/**
 * A `HitResult` represents the damage inflicted by a single hit. This may be a single number
 * or an entire sequence of rolls. Note that due to overflow the first and last elements of the
 * damage array may not reflect the damage range, use `HitResult#range`.
 */
export class HitResult {
  readonly state: DeepReadonly<State>;
  readonly handlers: Handlers;

  readonly relevant: Relevancy;
  readonly context: Context;

  damage: number | number[];

  constructor(
    state: DeepReadonly<State>,
    handlers: Handlers = HANDLERS,
    relevant = new Relevancy(),
  ) {
    this.damage = 0;
    this.state = state;
    this.handlers = handlers;
    this.relevant = relevant;
    this.context = new Context(state, relevant, handlers);
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

  simplified(): State {
    const state = this.state;
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
    const state = encode(this.simplified());
    const rolls = typeof this.damage === 'number' ? this.damage : this.damage.join(', ');
    return `${state}: [${rolls}]`;
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
    if (!relevant.spread) move.spread = undefined;
    if (!relevant.consecutive) move.consecutive = undefined;
    if (!relevant.useZ) move.useZ = undefined;
    return move;
  }
}
