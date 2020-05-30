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
  NatureName,
} from '@pkmn/data';
import { WeatherName, TerrainName } from './conditions';
import { Handlers, Handler, HANDLER_FNS, HANDLERS } from './mechanics';
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
  readonly residual: Relevancy;

  constructor(
    state: DeepReadonly<State>,
    relevant: Relevancy,
    residual: Relevancy,
    handlers: Handlers = HANDLERS
  ) {
    this.gameType = state.gameType;
    this.gen = state.gen as Generation;
    this.p1 = new Context.Side(this.gen, state.p1, relevant.p1, residual.p1, handlers),
    this.p2 = new Context.Side(this.gen, state.p2, relevant.p2, residual.p2, handlers);
    this.move = new Context.Move(state.move, relevant.move, residual.move, handlers),
    this.field = new Context.Field(state.field, relevant.field, residual.field, handlers);
    this.relevant = relevant;
    this.residual = residual;
  }

  toState() {
    return new State(
      this.gen,
      this.p1.toState(),
      this.p2.toState(),
      this.move.toState(),
      this.field.toState(),
      this.gameType
    );
  }
}

export namespace Context {
  export class Field {
    weather?: {name: WeatherName} & Partial<Handler>;
    terrain?: {name: TerrainName} & Partial<Handler>;
    pseudoWeather: {[id: string]: {data: object} & Partial<Handler>};

    readonly relevant: Relevancy.Field;
    readonly residual: Relevancy.Field;

    constructor(
      state: DeepReadonly<State.Field>,
      relevant: Relevancy.Field,
      residual: Relevancy.Field,
      handlers: Handlers
    ) {
      this.relevant = relevant;
      this.residual = residual;

      if (state.weather) {
        const id = toID(state.weather)
        this.weather = reify({name: state.weather}, id, handlers.Conditions, handler => {
          this[handler === 'onResidual' ? 'residual' : 'relevant'].weather = true;
        });
      }
      if (state.terrain) {
        const id = toID(state.terrain);
        this.terrain = reify({name: state.terrain}, id, handlers.Conditions, handler => {
          this[handler === 'onResidual' ? 'residual' : 'relevant'].terrain = true;
        });
      }
      this.pseudoWeather = {};
      for (const pw in state.pseudoWeather) {
        this.pseudoWeather[pw] =
          reify({data: state.pseudoWeather[pw]}, pw as ID, handlers.Conditions, handler => {
            this[handler === 'onResidual' ? 'residual' : 'relevant'].pseudoWeather[pw] = true;
          });
      }
    }

    toState(): State.Field {
      const pseudoWeather: {[id: string]: object} = {};
      for (const pw in this.pseudoWeather) {
        pseudoWeather[pw] = extend(this.pseudoWeather[pw].data);
      }
      return {
        weather: this.weather?.name,
        terrain: this.terrain?.name,
        pseudoWeather,
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
    readonly residual: Relevancy.Side;

    constructor(
      gen: Generation,
      state: DeepReadonly<State.Side>,
      relevant: Relevancy.Side,
      residual: Relevancy.Side,
      handlers: Handlers
    ) {
      this.relevant = relevant;
      this.residual = residual;

      this.pokemon = new Pokemon(gen, state.pokemon, relevant.pokemon, residual.pokemon, handlers);
      this.sideConditions = {};
      for (const sc in state.sideConditions) {
        this.sideConditions[sc] =
          reify(extend({}, state.sideConditions[sc]), sc as ID, handlers.Conditions, handler => {
            this[handler === 'onResidual' ? 'residual' : 'relevant'].sideConditions[sc] = true;
          });
      }
      this.active = this.active?.map(p => extend({}, p));
      this.party = this.party?.map(p => extend({}, p));
    }

    toState(): State.Side {
      const sideConditions: {[id: string]: {level?: number}} = {};
      for (const sc in this.sideConditions) {
        sideConditions[sc] = extend(this.sideConditions[sc]);
      }
      return {
        pokemon: this.pokemon.toState(),
        sideConditions,
        active: this.active?.map(p => extend({}, p)),
        party: this.party?.map(p => extend({}, p)),
      }
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

    switching?: 'in' | 'out';
    moveLastTurnResult?: false | unknown;
    hurtThisTurn?: boolean;

    readonly relevant: Relevancy.Pokemon;
    readonly residual: Relevancy.Pokemon;

    private nature?: NatureName;
    private evs?: Partial<StatsTable>;
    private ivs?: Partial<StatsTable>;

    constructor(
      gen: Generation,
      state: DeepReadonly<State.Pokemon>,
      relevant: Relevancy.Pokemon,
      residual: Relevancy.Pokemon,
      handlers: Handlers
    ) {
      this.relevant = relevant;
      this.residual = residual;

      this.species = state.species as Specie;
      this.level = state.level;
      this.weighthg = state.weighthg;

      if (state.item) {
        this.item = reify({id: state.item}, state.item, handlers.Items, handler => {
          this[handler === 'onResidual' ? 'residual' : 'relevant'].item = true;
        });
      }
      if (state.ability) {
        this.ability = reify({id: state.ability}, state.ability, handlers.Abilities, handler => {
          this[handler === 'onResidual' ? 'residual' : 'relevant'].ability = true;
        });
      }
      this.gender = state.gender;
      this.happiness = state.happiness;

      if (state.status) {
        this.status =
          reify({name: state.status}, state.status as ID, handlers.Conditions, handler => {
            this[handler === 'onResidual' ? 'residual' : 'relevant'].status = true;
          });
      }
      this.statusData = this.statusData && extend({}, state.statusData);
      this.volatiles = {};
      for (const v in state.volatiles) {
        this.volatiles[v] =
          reify(extend({}, state.volatiles[v]), v as ID, handlers.Conditions, handler => {
            this[handler === 'onResidual' ? 'residual' : 'relevant'].volatiles[v] = true;
          });
      }

      this.types = state.types.slice() as Pokemon['types'];
      this.addedType = state.addedType;

      this.maxhp = state.maxhp;
      this.hp = state.hp;

      this.nature = state.nature;
      this.evs = state.evs;
      this.ivs = state.ivs;

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

    toState(): State.Pokemon {
      const volatiles: {[id: string]: {level?: number}} = {};
      for (const v in this.volatiles) {
        volatiles[v] = extend(this.volatiles[v]);
      }
      return {
        species: this.species,
        level: this.level,
        weighthg: this.weighthg,
        item: this.item?.id,
        ability: this.ability?.id,
        gender: this.gender,
        happiness: this.hp,
        status: this.status?.name,
        statusData: this.statusData && extend({}, this.statusData),
        volatiles,
        types: this.types.slice() as Pokemon['types'],
        addedType: this.addedType,
        maxhp: this.maxhp,
        hp: this.hp,
        nature: this.nature,
        evs: this.evs && extend({}, this.evs),
        ivs: this.ivs && extend({}, this.ivs),
        boosts: extend({}, this.boosts),
        position: this.position,
        switching: this.switching,
        moveLastTurnResult: this.moveLastTurnResult,
        hurtThisTurn: this.hurtThisTurn,
      };
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
    readonly residual: Relevancy.Move;

    constructor(
      state: DeepReadonly<State.Move>,
      relevant: Relevancy.Move,
      residual: Relevancy.Move,
      handlers: Handlers
    ) {
      extend(this, state);
      this.relevant = relevant;
      this.residual = residual;
      reify(this, this.id, handlers.Moves);
    }

    toState(): State.Move {
      return extend({}, this);
    }
  }
}

function reify<T>(
  obj: T & Partial<Handler>,
  id: ID,
  handlers: Handlers[keyof Handlers],
  callback?: (k: keyof Handler) => void
) {
  const handler = handlers[id];
  if (handler) {
    for (const n in handler) {
      const k = n as keyof Handler; // not really, but HANDLER_FNS is checked below
      const fn = handler[k];
      if (fn && HANDLER_FNS.has(k) && typeof fn === 'function') {
        obj[k] = (c: Context) => {
          const r = (fn as any)(c);
          if (r && callback) callback(k);
          return r;
        };
      }
    }
  }
  return obj;
}