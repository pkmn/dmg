import type {
  BoostID,
  BoostsTable,
  Generation,
  Specie,
  StatID,
  StatsTable,
} from '@pkmn/data';

import {Context} from './context';
import {encode} from './encode';
import {Appliers, Handlers, HANDLERS} from './mechanics';
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

  static simplify(state: DeepReadonly<State>, relevant: Relevancy): State {
    const gen = state.gen as Generation;
    return {
      gen,
      gameType: relevant.gameType ? state.gameType : 'singles',
      p1: simplifySide(gen, state.p1, relevant.p1),
      p2: simplifySide(gen, state.p2, relevant.p2),
      move: simplifyMove(state.move, relevant.move),
      field: simplifyField(state.field, relevant.field),
    };
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

    // TODO: hp/maxhp is only relevant for attacker under certain circumstances!
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
    consecutive?: boolean;
    spread?: boolean;
    useZ?: boolean;
  }
}

export type Notation = '%' | '/48' | 'px' | number;
export type KOType = 'none' | 'hazards' | 'residual' | 'both';

/**
 * The result of a damage calculation. Multi-hit moves or moves affected by Parental Bond etc may
 * consist of multiple `HitResult` objects. A `Result` always reflects the result of a single move
 * for a single turn, though multiple `Result` objects may be chained together.
 */
export class Result {
  readonly hits: [HitResult, ...HitResult[]];
  readonly appliers: Appliers;

  private cache: {
    relevant?: Relevancy;
    range?: [number, number];
    recovery?: number | [number, number];
    recoil?: number | [number, number];
    crash?: number | [number, number];
  };

  constructor(hit: HitResult) {
    this.hits = [hit];
    this.appliers = new Appliers(this.handlers);
    this.cache = {};
  }

  chain() {
    const prev = this.hits[this.hits.length - 1];
    const state = prev.context.toState();

    // Assume at least the minimum damage from the previous hit has occured. This is important
    // as it might place the defender in range to cause an effect to activate.
    const min = prev.range[0];
    state.p2.pokemon.hp -= min;
    if (min > 0) state.p2.pokemon.hurtThisTurn = true;

    apply(this.appliers, state);

    const hit = new HitResult(state as DeepReadonly<State>, prev.handlers);
    this.hits.push(hit);
    this.cache = {};
    return hit;
  }

  get state(): DeepReadonly<State> {
    // Since state is immutable the state from any hit can be returned
    return this.hits[0].state;
  }

  get handlers(): Handlers {
    // All hits from a damage calculation use the same handlers
    return this.hits[0].handlers;
  }

  get relevant() {
    if (this.cache.relevant) return this.cache.relevant;
    const relevant = extend({}, this.hits[0].relevant) as Relevancy;
    for (let i = 1; i < this.hits.length; i++) {
      combine(relevant, this.hits[i].relevant);
    }
    return (this.cache.relevant = relevant);
  }

  get context(): Context {
    // Each hit has its own context, but the last hit's context reflects the final state
    return this.hits[this.hits.length - 1].context;
  }

  get range() {
    if (this.cache.range) return this.cache.range;
    let min = 0;
    let max = 0;
    for (const hit of this.hits) {
      const range = hit.range;
      min += range[0];
      max += range[1];
    }
    return (this.cache.range = [min, max]);
  }

  recoil(relevant?: Relevancy) {
    if (this.cache.recoil && !relevant) return this.cache.recoil;
    const {gen, p1, p2, move} = this.context;

    let recoil: number | [number, number] | undefined;

    if (move.recoil) {
      if (is(p1.pokemon.ability?.id, 'rockhead', 'magicguard')) {
        if (relevant) relevant.p1.pokemon.ability = true;
      } else {
        const damage = move.recoil[0] / move.recoil[1];
        const max = p2.pokemon.hp;
        for (const hit of this.hits) {
          if (Array.isArray(hit.damage)) {
            if (!recoil) recoil = [0, 0];
            const range = hit.range;
            const r = recoil as [number, number];
            r[0] = math.min(max, r[0] + math.round(range[0] * damage));
            r[1] = math.min(max, r[1] + math.round(range[1] * damage));
          } else {
            recoil = math.min(max, (recoil || 0) as number + math.round(hit.damage * damage));
          }
        }
      }
    } else if (move.struggleRecoil) {
      const round = gen.num === 4 ? math.roundDown : math.round;
      for (let i = 0; i < this.hits.length; i++) {
        recoil = math.min(p1.pokemon.maxhp,
          (recoil as number || 0) + round(p1.pokemon.maxhp / 4));
      }
    } else if (move.mindBlownRecoil) {
      if (is(p1.pokemon.ability?.id, 'magicguard')) {
        if (relevant) relevant.p1.pokemon.ability = true;
      } else {
        for (let i = 0; i < this.hits.length; i++) {
          recoil = math.min(p1.pokemon.maxhp,
            (recoil as number || 0) + math.round(p1.pokemon.maxhp / 2));
        }
      }
    }

    return (this.cache.recoil = recoil);
  }

  crash(relevant?: Relevancy) {
    if (this.cache.crash && !relevant) return this.cache.crash;
    const {gen, p1, p2, move} = this.context;

    let crash: number | [number, number] | undefined;

    if (move.hasCrashDamage) {
      if (is(p1.pokemon.ability?.id, 'magicguard')) {
        if (relevant) relevant.p1.pokemon.ability = true;
      } else {
        if (gen.num === 1) {
          crash = 1;
        } else if (gen.num <= 4) {
          // Gen 2 and 3 inflict no crash damage if the move failed due to type immunity
          if (gen.num === 4 || !gen.types.canDamage(move, p2.pokemon.types)) {
            const denominator = gen.num === 2 ? 8 : 2;
            const max = math.roundDown(p2.pokemon.hp / denominator);
            // NOTE: No Parental Bond before Gen 6 means we are guaranteed to have only one hit.
            // Similarly, we know damage must be a range because only Jump Kick and HJK can crash.
            const hit = this.hits[0];
            const range = hit.range;
            const c = crash as [number, number];
            c[0] = math.min(max, c[0] + math.max(math.roundDown(range[0] / denominator), 1));
            c[1] = math.min(max, c[1] + math.max(math.roundDown(range[1] / denominator), 1));
          }
        } else {
          for (let i = 0; i < this.hits.length; i++) {
            crash = math.min(p1.pokemon.maxhp,
              (crash as number || 0) + math.round(p1.pokemon.maxhp / 2));
          }
        }
      }
    }

    return (this.cache.crash = crash);
  }

  recovery(relevant?: Relevancy) {
    if (this.cache.recovery && !relevant) return this.cache.recovery;
    const {gen, p1, p2, move} = this.context;

    let recovery: number | [number, number] | undefined;

    const ignored = gen.num === 3 && is(move.id, 'doomdesire', 'futuresight');
    if (is(p1.pokemon.item?.id, 'shellbell') && !ignored) {
      if (relevant) relevant.p1.pokemon.item = true;

      const max = math.roundDown(p2.pokemon.hp / 8);
      for (const hit of this.hits) {
        if (Array.isArray(hit.damage)) {
          if (!recovery) recovery = [0, 0];
          const range = hit.range;
          const r = recovery as [number, number];
          r[0] = math.min(max, r[0] + math.max(math.roundDown(range[0] / 8), 1));
          r[1] = math.min(max, r[1] + math.max(math.roundDown(range[1] / 8), 1));
        } else {
          recovery = math.min(max,
            (recovery || 0) as number + math.max(math.roundDown(hit.damage / 8), 1));
        }
      }
    }

    if (is(move.id, 'gmaxfinale')) {
      const healed = math.round(p1.pokemon.maxhp / 6);
      if (Array.isArray(recovery)) {
        recovery[0] += healed;
        recovery[1] += healed;
      } else {
        recovery = (recovery || 0) + healed;
      }
    } else if (move.drain) {
      let mod: number | undefined;
      if (is(p1.pokemon.item?.id, 'bigroot')) {
        if (relevant) relevant.p1.pokemon.item = true;
        mod = 0x14CC;
      }
      const healed = math.apply(move.drain[0] / move.drain[1], mod);
      const max = math.round(p2.pokemon.maxhp * healed);
      for (const hit of this.hits) {
        if (Array.isArray(hit.damage)) {
          if (!recovery) recovery = [0, 0];
          const range = hit.range;
          const r = recovery as [number, number];
          r[0] = math.min(max, r[0] + math.round(range[0] * healed));
          r[1] = math.min(max, r[1] + math.round(range[1] * healed));
        } else {
          recovery = math.min(max, (recovery || 0) as number + math.round(hit.damage * healed));
        }
      }
    }

    return (this.cache.recovery = recovery);
  }

  // chain (if same turn, wont be taking hazards), if second term just nothing / residual
  knockout(type: KOType = 'both', relevant = extend({}, this.relevant)) {
    // FIXME

    // TODO: how does onresidual work, depends on state of mon.. (when does berry proc?)
    return {n: 0, chance: 0, exact: true};
  }

  recoveryText(notation: Notation = '%', relevant?: Relevancy) {
    return this.describe(notation, this.recovery(relevant), 'recovered');
  }

  recoilText(notation: Notation = '%', relevant?: Relevancy) {
    return this.describe(notation, this.recoil(relevant),
      `${this.state.move.struggleRecoil ? 'struggle' : 'recoil'} damage`);
  }

  crashText(notation: Notation = '%', relevant?: Relevancy) {
    return this.describe(notation, this.recovery(relevant), 'crash damage');
  }

  moveText(notation: Notation = '%', relevant?: Relevancy) {
    const min = this.display(notation, this.range[0], this.state.p2.pokemon.maxhp);
    const max = this.display(notation, this.range[1], this.state.p2.pokemon.maxhp);

    const recovery = this.recoveryText(notation, relevant);
    const recoil = this.recoilText(notation, relevant);
    const crash = this.crashText(notation, relevant);

    return `${min} - ${max}${notation}` +
      `${recovery && ` (${recovery})`}${recoil && ` (${recoil})`}${crash && ` (${crash})`}`;
  }

  text(type: KOType = 'both', notation: Notation = '%', relevant?: Relevancy) {
    const range = this.range;
    const min = this.display(notation, range[0], this.state.p2.pokemon.maxhp);
    const max = this.display(notation, range[1], this.state.p2.pokemon.maxhp);
    const damage = `${range[0]}-${range[1]} (${min} - ${max}${notation})`;

    relevant = extend({}, relevant ?? this.relevant);
    const ko = this.knockout(type, relevant);
    const state = encode(Relevancy.simplify(this.state, relevant!));
    if (!ko.chance) return `${state}: ${damage}`;

    const prefix = ko.exact ? (ko.chance === 1 ? 'guaranteed ' : '') : 'approx. ';
    const percent = ko.chance < 1 ? `${this.display('%', ko.chance, 1)}% chance to ` : '';
    const result = `${ko.n === 1 ? 'O' : ko.n}HKO`;

    return `${state}: ${damage} -- ${prefix}${percent}${result}`;
  }

  toString() {
    const relevant = extend({}, this.relevant) as Relevancy;
    const recovery = this.recoveryText('%', relevant);
    const recoil = this.recoilText('%', relevant);
    const crash = this.crashText('%', relevant);
    const end =
      `${recovery && ` (${recovery})`}${recoil && ` (${recoil})`}${crash && ` (${crash})`}`;
    const rolls = this.hits.map(h =>
      `[${typeof h.damage === 'number' ? h.damage : h.damage.join(', ')}]`).join(', ');
    return `${this.text('both', '%', relevant)}${end}\n${rolls}`;
  }

  private describe(notation: Notation, n: number | [number, number] | undefined, s: string) {
    if (n !== undefined) {
      if (Array.isArray(n)) {
        const min = this.display(notation, n[0], this.state.p1.pokemon.maxhp);
        const max = this.display(notation, n[1], this.state.p1.pokemon.maxhp);
        return `${min} - ${max}${notation} ${s}`;
      } else {
        const amount = this.display(notation, n, this.state.p1.pokemon.maxhp);
        return `${amount}${notation} ${s}`;
      }
    }
    return '';
  }

  private display(notation: Notation, a: number, b: number, f = 1) {
    if (notation === '%') return Math.floor((a * (1000 / f)) / b) / 10;
    const g = this.state.gen.num;
    const px =
      notation === '/48' ? 48
      : notation === 'px' ? (g < 7 ? 48 : g < 8 ? 86 : 400)
      : notation;
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

  readonly context: Context;

  damage: number | number[];

  private cached: [number, number] | undefined;

  constructor(
    state: DeepReadonly<State>,
    handlers: Handlers = HANDLERS,
    relevant = new Relevancy(),
  ) {
    this.damage = 0;
    this.state = state;
    this.handlers = handlers;
    this.context = new Context(state, handlers, relevant);
  }

  // PRECONDITION: this.damage has been finalized
  get range() {
    if (this.cached) return this.cached;
    if (!Array.isArray(this.damage)) return (this.cached = [this.damage, this.damage]);
    let min = this.damage[0];
    let max = min;
    for (let i = 1; i < this.damage.length; i++) {
      if (this.damage[i] < min) {
        min = this.damage[i];
      } else if (this.damage[i] > max) {
        max = this.damage[i];
      }
    }
    return (this.cached = [min, max]);
  }

  get relevant() {
    return this.context.relevant;
  }

  toString() {
    const state = encode(Relevancy.simplify(this.state, this.relevant));
    const rolls = typeof this.damage === 'number' ? this.damage : this.damage.join(', ');
    return `${state}: [${rolls}]`;
  }
}

/**
 * `Results` chains together the `Result` of multiple damage calculations, potentially spanning
 * multiple turns.
 *
 * FIXME how to handle relevant for residual/recovery/etc?
 * TODO: relevant just does a combine of all the results
 */
export class Results {
  readonly turns: [Result, ...Result[]][];
  readonly appliers: Appliers;

  constructor(result: Result) {
    this.turns = [[result]];
    this.appliers = result.appliers;
  }

  add(result: Result, turn = true) {
    if (turn) {
      this.turns.push([result]);
    } else {
      this.turns[this.turns.length - 1].push(result);
    }
  }

  // FIXME need to know if move made contact etc....
  next(turn = true): DeepReadonly<State> {
    const t = this.turns[this.turns.length - 1];
    const prev = t[t.length - 1];
    const state = prev.context.toState();

    if (turn) {
      const min = prev.range[0];
      state.p2.pokemon.hp -= min;
      // TODO update p1 for recoil/guaranteed crash (if ghost)/recovery
      // TODO update both p1 and p2 for residual damage and recovery

      // Since next() returns the state for a new turn
      state.p1.pokemon.hurtThisTurn = false;
      state.p2.pokemon.hurtThisTurn = false;
    } else {
      // Just like with Result.chain() we update the min range
      const min = prev.range[0];
      state.p2.pokemon.hp -= min;
      if (min > 0) state.p2.pokemon.hurtThisTurn = true;
    }

    apply(this.appliers, state);

    return state as DeepReadonly<State>;
  }
}

function apply(appliers: Appliers, state: State) {
  // Apply any *guaranteed* effects of the move/abilities/items, potentially triggering things
  // like Stamina or Foul Play into Defeatist.
  appliers.apply('Moves', 'p1', state.move.id, state, true);
  for (const side of ['p1', 'p2'] as const) {
    // TODO: this should only proc flashfire if not guaranteed (only if state.move.type === Fire)
    appliers.apply('Abilities', side, state[side].pokemon.ability, state, true);
    appliers.apply('Items', side, state[side].pokemon.item, state, true);
  }
}

interface Trace {[key: string]: boolean | Trace | undefined }

function combine(a: Relevancy, b: Relevancy) {
  a.gameType = a.gameType || b.gameType;
  // NOTE: This is safe, Typescript just complains about missing index signatures
  merge(a.p1 as unknown as Trace, b.p1 as unknown as Trace);
  merge(a.p2 as unknown as Trace, b.p2 as unknown as Trace);
  merge(a.field as unknown as Trace, b.field as unknown as Trace);
  merge(a.move as unknown as Trace, b.move as unknown as Trace);
}

function merge(a: Trace, b?: Trace) {
  const c: Trace = {};
  for (const k in a) {
    const v = a[k];
    const u = b?.[k];
    if (typeof v === 'object') {
      c[k] = u ? v : merge(v, u as Trace | undefined);
    } else if (typeof u === 'object') {
      c[k] = u;
    } else {
      c[k] = v || u;
    }
  }
  return c;
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

function simplifySide(gen: Generation, state: DeepReadonly<State.Side>, relevant: Relevancy.Side) {
  const side: State.Side = {
    pokemon: simplifyPokemon(gen, state.pokemon, relevant.pokemon),
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

function simplifyPokemon(
  gen: Generation,
  state: DeepReadonly<State.Pokemon>,
  relevant: Relevancy.Pokemon,
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
  // TODO: Hidden Power needs to mark all IVs as relevant, encode takes care of eliding.
  for (const s in relevant.stats) {
    const stat = s as StatID;
    pokemon.evs![stat] = state.evs?.[stat] ?? (gen.num <= 2 ? 252 : 0);
    pokemon.ivs![stat] = state.ivs?.[stat] ?? 31;
  }
  for (const b in relevant.boosts) {
    const boost = b as BoostID;
    pokemon.boosts[boost] = state.boosts[boost];
  }
  return pokemon;
}

function simplifyMove(state: DeepReadonly<State.Move>, relevant: Relevancy.Move) {
  const move = extend({}, state) as State.Move;
  if (!relevant.crit) move.crit = undefined;
  if (!relevant.hits) move.hits = undefined;
  if (!relevant.magnitude) move.magnitude = undefined;
  if (!relevant.spread) move.spread = undefined;
  if (!relevant.consecutive) move.consecutive = undefined;
  if (!relevant.useZ) move.useZ = undefined;
  return move;
}

function squash(gen: Generation, d: number[], hits: number) {
  if (d.length === 1) {
    return [d[0] * hits];
  } else if (gen.num === 1) {
    const r = [];
    for (let i = 0; i < d.length; i++) {
      r[i] = d[i] * hits;
    }
    return r;
  } else if (d.length === 39) { // gen.num === 2
    switch (hits) {
    case 2:
      return [
        2 * d[0], 2 * d[7], 2 * d[10], 2 * d[12], 2 * d[14], d[15] + d[16],
        2 * d[17], d[18] + d[19], d[19] + d[20], 2 * d[21], d[22] + d[23],
        2 * d[24], 2 * d[26], 2 * d[28], 2 * d[31], 2 * d[38],
      ];
    case 3:
      return [
        3 * d[0], 3 * d[9], 3 * d[12], 3 * d[13], 3 * d[15], 3 * d[16],
        3 * d[17], 3 * d[18], 3 * d[20], 3 * d[21], 3 * d[22], 3 * d[23],
        3 * d[25], 3 * d[26], 3 * d[29], 3 * d[38],
      ];
    case 4:
      return [
        4 * d[0], 2 * d[10] + 2 * d[11], 4 * d[13], 4 * d[14], 2 * d[15] + 2 * d[16],
        2 * d[16] + 2 * d[17], 2 * d[17] + 2 * d[18], 2 * d[18] + 2 * d[19],
        2 * d[19] + 2 * d[20], 2 * d[20] + 2 * d[21], 2 * d[21] + 2 * d[22],
        2 * d[22] + 2 * d[23], 4 * d[24], 4 * d[25], 2 * d[27] + 2 * d[28], 4 * d[38],
      ];
    case 5:
      return [
        5 * d[0], 5 * d[11], 5 * d[13], 5 * d[15], 5 * d[16], 5 * d[17],
        5 * d[18], 5 * d[19], 5 * d[19], 5 * d[20], 5 * d[21], 5 * d[22],
        5 * d[23], 5 * d[25], 5 * d[27], 5 * d[38],
      ];
    default:
      throw new Error(`Unexpected number of hits: ${hits}`);
    }
  } else if (d.length === 16) {
    switch (hits) {
    case 2:
      return [
        2 * d[0], d[2] + d[3], d[4] + d[4], d[4] + d[5], d[5] + d[6], d[6] + d[6],
        d[6] + d[7], d[7] + d[7], d[8] + d[8], d[8] + d[9], d[9] + d[9], d[9] + d[10],
        d[10] + d[11], d[11] + d[11], d[12] + d[13], 2 * d[15],
      ];
    case 3:
      return [
        3 * d[0], d[3] + d[3] + d[4], d[4] + d[4] + d[5], d[5] + d[5] + d[6],
        d[5] + d[6] + d[6], d[6] + d[6] + d[7], d[6] + d[7] + d[7], d[7] + d[7] + d[8],
        d[7] + d[8] + d[8], d[8] + d[8] + d[9], d[8] + d[9] + d[9], d[9] + d[9] + d[10],
        d[9] + d[10] + d[10], d[10] + d[11] + d[11], d[11] + d[12] + d[12], 3 * d[15],
      ];
    case 4:
      return [
        4 * d[0], 4 * d[4], d[4] + d[5] + d[5] + d[5], d[5] + d[5] + d[6] + d[6],
        4 * d[6], d[6] + d[6] + d[7] + d[7], 4 * d[7], d[7] + d[7] + d[7] + d[8],
        d[7] + d[8] + d[8] + d[8], 4 * d[8], d[8] + d[8] + d[9] + d[9], 4 * d[9],
        d[9] + d[9] + d[10] + d[10], d[10] + d[10] + d[10] + d[11], 4 * d[11], 4 * d[15],
      ];
    case 5:
      return [
        5 * d[0], d[4] + d[4] + d[4] + d[5] + d[5], d[5] + d[5] + d[5] + d[5] + d[6],
        d[5] + d[6] + d[6] + d[6] + d[6], d[6] + d[6] + d[6] + d[6] + d[7],
        d[6] + d[6] + d[7] + d[7] + d[7], 5 * d[7], d[7] + d[7] + d[7] + d[8] + d[8],
        d[7] + d[7] + d[8] + d[8] + d[8], 5 * d[8], d[8] + d[8] + d[8] + d[9] + d[9],
        d[8] + d[9] + d[9] + d[9] + d[9], d[9] + d[9] + d[9] + d[9] + d[10],
        d[9] + d[10] + d[10] + d[10] + d[10], d[10] + d[10] + d[11] + d[11] + d[11], 5 * d[15],
      ];
    default:
      throw new Error(`Unexpected number of hits: ${hits}`);
    }
  } else {
    throw new Error(`Unexpected number of possible damage values: ${d.length}`);
  }
}
