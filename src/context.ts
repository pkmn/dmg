import {
  BoostsTable,
  GameType,
  GenderName,
  Generation,
  GenerationNum,
  HitEffect,
  ID,
  Move as DMove,
  MoveCategory,
  MoveName,
  MoveTarget,
  Nonstandard,
  PureEffectData,
  SecondaryEffect,
  Specie,
  SpeciesName,
  StatsTable,
  StatusName,
  toID,
  TypeName,
} from '@pkmn/data';
import { WeatherName, TerrainName } from './conditions';
import { Handlers, Handler, HANDLER_FNS } from './mechanics';
import { Relevancy } from './result';
import { DeepReadonly, extend } from './utils';
import { State } from './state';

export class Context {
  gameType: GameType;
  gen: Generation;
  p1: Context.Side;
  p2: Context.Side;
  move: Context.Move;
  field: Context.Field;

  readonly relevant: Relevancy;

  constructor(state: DeepReadonly<State>, relevant: Relevancy, handlers: Handlers) {
    this.gameType = state.gameType;
    this.gen = state.gen as Generation;
    this.p1 = new Context.Side(this.gen, state.p1, relevant.p1, handlers),
    this.p2 = new Context.Side(this.gen, state.p2, relevant.p2, handlers);
    this.move = new Context.Move(state.move, relevant.move, handlers),
    this.field = new Context.Field(state.field, relevant.field, handlers);
    this.relevant = relevant;
  }
}

export namespace Context {
  export class Field {
    weather?: {name: WeatherName} & Partial<Handler>;
    terrain?: {name: TerrainName} & Partial<Handler>;
    pseudoWeather: {[id: string]: Partial<Handler>};

    readonly relevant: Relevancy.Field;

    constructor(state: DeepReadonly<State.Field>, relevant: Relevancy.Field, handlers: Handlers) {
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
      this.pseudoWeather = {};
      for (const pw in state.pseudoWeather) {
        this.pseudoWeather[pw] =
          reify({data: state.pseudoWeather[pw]}, pw as ID, handlers.Conditions, () => {
            this.relevant.pseudoWeather[pw] = true;
          });
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

    constructor(
      gen: Generation,
      state: DeepReadonly<State.Side>,
      relevant: Relevancy.Side,
      handlers: Handlers
    ) {
      this.relevant = relevant;

      this.pokemon = new Pokemon(gen, state.pokemon, relevant.pokemon, handlers);
      this.sideConditions = {};
      for (const sc in state.sideConditions) {
        this.sideConditions[sc] =
          reify(extend({}, state.sideConditions[sc]), sc as ID, handlers.Conditions, () => {
            this.relevant.sideConditions[sc] = true;
          });
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

    constructor(
      gen: Generation,
      state: DeepReadonly<State.Pokemon>,
      relevant: Relevancy.Pokemon,
      handlers: Handlers
    ) {
      this.relevant = relevant;

      this.species = state.species as Specie;
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
      this.volatiles = {};
      for (const v in state.volatiles) {
        this.volatiles[v] =
          reify(extend({}, state.volatiles[v]), v as ID, handlers.Conditions, () => {
            this.relevant.volatiles[v] = true;
          });
      }

      this.types = state.types.slice() as Pokemon['types'];
      this.addedType = state.addedType;

      this.maxhp = state.maxhp;
      this.hp = state.hp;

      this.stats = {} as StatsTable;
      for (const stat of gen.stats) {
        this.stats[stat] = gen.stats.calc(
          stat,
          this.species.baseStats[stat],
          state.ivs?.[stat] ?? 31,
          state.evs?.[stat] ?? (gen.num <= 2 ? 252 : 0),
          state.level,
          gen.natures.get(state.nature!)!
        );
      }
      this.boosts = extend({}, state.boosts);

      this.position = state.position;
      this.switching = state.switching;
      this.moveLastTurnResult = state.moveLastTurnResult;
      this.hurtThisTurn = state.hurtThisTurn;
    }
  }

  export class Move implements State.Move, Partial<Handler> {
    id!: ID;
    name!: MoveName;
    fullname!: string;
    exists!: boolean;
    num!: number;
    gen!: GenerationNum;
    shortDesc!: string;
    desc!: string;
    isNonstandard!: Nonstandard | null;
    duration?: number;

    effectType!: 'Move';
    kind!: 'Move';
    secondaries!: SecondaryEffect[] | null;
    flags!: DMove['flags'];
    zMoveEffect?: ID;
    isZ!: boolean | ID;
    zMove?: {
      basePower?: number;
      effect?: ID;
      boost?: Partial<BoostsTable>;
    };
    isMax!: boolean | SpeciesName;
    maxMove?: {
      basePower: number;
    };
    noMetronome?: MoveName[];
    volatileStatus?: ID;
    slotCondition?: ID;
    sideCondition?: ID;
    terrain?: ID;
    pseudoWeather?: ID;
    weather?: ID;

    basePower!: number;
    type!: TypeName;
    accuracy!: true | number;
    pp!: number;
    target!: MoveTarget;
    priority!: number;
    category!: MoveCategory;

    realMove?: string;
    effect?: Partial<PureEffectData>;
    damage?: number | 'level' | false | null;
    noPPBoosts?: boolean;

    ohko?: boolean | TypeName;
    thawsTarget?: boolean;
    heal?: number[] | null;
    forceSwitch?: boolean;
    selfSwitch?: boolean | 'copyvolatile';
    selfBoost?: { boosts?: Partial<BoostsTable> };
    selfdestruct?: boolean | 'ifHit' | 'always';
    breaksProtect?: boolean;
    recoil?: [number, number];
    drain?: [number, number];
    mindBlownRecoil?: boolean;
    stealsBoosts?: boolean;
    secondary?: SecondaryEffect | null;
    self?: HitEffect | null;
    struggleRecoil?: boolean;

    alwaysHit?: boolean;
    basePowerModifier?: number;
    critModifier?: number;
    critRatio?: number;
    defensiveCategory?: MoveCategory;
    forceSTAB?: boolean;
    ignoreAbility?: boolean;
    ignoreAccuracy?: boolean;
    ignoreDefensive?: boolean;
    ignoreEvasion?: boolean;
    ignoreImmunity?: boolean | { [k in keyof TypeName]?: boolean };
    ignoreNegativeOffensive?: boolean;
    ignoreOffensive?: boolean;
    ignorePositiveDefensive?: boolean;
    ignorePositiveEvasion?: boolean;
    infiltrates?: boolean;
    multiaccuracy?: boolean;
    multihit?: number | number[];
    noCopy?: boolean;
    noDamageVariance?: boolean;
    noFaint?: boolean;
    nonGhostTarget?: MoveTarget;
    pressureTarget?: MoveTarget;
    sleepUsable?: boolean;
    smartTarget?: boolean;
    spreadModifier?: number;
    tracksTarget?: boolean;
    useSourceDefensiveAsOffensive?: boolean;
    useTargetOffensive?: boolean;
    willCrit?: boolean;

    hasCrashDamage?: boolean;
    isConfusionSelfHit?: boolean;
    isFutureMove?: boolean;
    noSketch?: boolean;
    stallingMove?: boolean;

    crit?: boolean;
    hits?: number;
    magnitude?: number;
    spreadHit?: boolean;
    numConsecutive?: number; // Metronome

    damageCallback: undefined; // Silence TS2559

    readonly relevant: Relevancy.Move;

    constructor(state: DeepReadonly<State.Move>, relevant: Relevancy.Move, handlers: Handlers) {
      this.relevant = relevant;
      extend(this, state);
      reify(this, this.id, handlers.Moves);
    }
  }
}

function reify<T>(
  obj: T & Partial<Handler>,
  id: ID,
  handlers: Handlers[keyof Handlers],
  callback?: () => void
) {
  const handler = handlers[id];
  if (handler) {
    for (const n in handler) {
      const k = n as keyof Handler; // not really, but HANDLER_FNS is checked below
      const fn = handler[k];
      if (fn && HANDLER_FNS.has(k) && typeof fn === 'function') {
        obj[k] = (c: Context) => {
          const r = (fn as any)(c);
          if (r && callback) callback();
          return r;
        };
      }
    }
  }
  return obj;
}