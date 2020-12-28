import {Generations, ID} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {Context} from '../context';
import {State} from '../state';
import {Relevancy} from '../result';
import {DeepReadonly} from '../utils';

describe('Context', () => {
  test('Field', () => {
    const {context, state, relevancy} = newContext();
    const before = serialize(state);

    expect(context.field.weather?.basePowerCallback?.(context)).toBeUndefined();
    expect(relevancy.field.weather).toBeUndefined();
    expect(context.field.weather?.onModifyAtk?.(context)).toBe(1);
    expect(relevancy.field.weather).toBe(true);

    expect(context.field.terrain?.onModifyAtk?.(context)).toBeUndefined();
    expect(relevancy.field.terrain).toBeUndefined();
    expect(context.field.terrain?.onModifyDef?.(context)).toBe(2);
    expect(relevancy.field.terrain).toBe(true);

    expect(context.field.pseudoWeather['gravity']?.onModifyAtk?.(context)).toBeUndefined();
    expect(relevancy.field.pseudoWeather['gravity']).toBeUndefined();

    expect(context.field.pseudoWeather['gravity']?.onModifySpA?.(context)).toBe(3);
    expect(relevancy.field.pseudoWeather['gravity']).toBe(true);

    context.field.weather = undefined;
    context.field.terrain = undefined;
    expect(serialize(state)).toEqual(before);
  });

  test('Side', () => {
    const {context, state, relevancy} = newContext();
    const before = serialize(state);

    expect(context.p2.sideConditions['stealthrock']?.onModifyAtk?.(context)).toBeUndefined();
    expect(relevancy.p2.sideConditions['stealthrock']).toBeUndefined();

    expect(context.p1.sideConditions['tailwind']?.onModifySpe?.(context)).toBe(0);
    expect(relevancy.p1.sideConditions['tailwind']).toBe(true);

    context.p1.active = [{ability: 'friendguard' as ID}];
    context.p2.team = [];
    expect(serialize(state)).toEqual(before);
  });

  test('Pokemon', () => {
    const {context, state, relevancy} = newContext();
    const before = serialize(state);

    const p1 = context.p1.pokemon;
    const p2 = context.p2.pokemon;

    expect(p1.status?.onModifyAtk?.(context)).toBe(4);
    expect(p2.status?.onModifyAtk?.(context)).toBeUndefined();

    expect(p1.ability?.onModifyBasePower?.(context)).toBe(6);
    expect(p2.ability?.onModifySpA?.(context)).toBeUndefined();

    expect(p1.item?.onModifyBasePower?.(context)).toBeUndefined();
    expect(p2.item?.onResidual?.(context)).toBe(5);

    expect(p1.volatiles['electrify']?.onModifyWeight?.(context)).toBeUndefined();
    expect(p2.volatiles['foo']?.onResidual?.(context)).toBeUndefined();
    expect(p2.volatiles['leechseed']?.onResidual?.(context)).toBe(7);

    expect(relevancy.p1.pokemon.status).toBe(true);
    expect(relevancy.p1.pokemon.ability).toBe(true);
    expect(relevancy.p1.pokemon.item).toBeUndefined();
    expect(relevancy.p1.pokemon.volatiles['electrify']).toBeUndefined();

    expect(relevancy.p2.pokemon.status).toBeUndefined();
    expect(relevancy.p2.pokemon.ability).toBeUndefined();
    expect(relevancy.p2.pokemon.item).toBe(true);
    expect(relevancy.p2.pokemon.volatiles['leechseed']).toBe(true);

    p2.gender = 'M';
    p1.addedType = 'Grass';
    expect(serialize(state)).toEqual(before);
  });

  test('Move', () => {
    const {context, state} = newContext();
    const before = serialize(state);

    expect(context.move.onModifyAtk?.(context)).toBeUndefined();
    expect(context.move.basePowerCallback?.(context)).toBe(4);

    context.move.crit = true;
    expect(serialize(state)).toEqual(before);
  });

  test('toJSON', () => {
    expect(() => JSON.stringify(newContext().context.toJSON())).not.toThrow();
  });
});

function newContext() {
  const gens = new Generations(Dex as any);
  const gen = gens.get(7);
  const relevancy = new Relevancy();

  const state = new State(
    gen,
    {
      pokemon: State.createPokemon(gen, 'Gengar', {
        item: 'Choice Specs',
        ability: 'Cursed Body',
        status: 'burned',
        volatiles: {electrify: {}},
        boosts: {spa: 2},
      }),
      sideConditions: {tailwind: {}},
    },
    {
      pokemon: State.createPokemon(gen, 'Blissey', {
        item: 'Leftovers',
        ability: 'Natural Cure',
        status: 'tox',
        statusData: {toxicTurns: 2},
        volatiles: {leechseed: {}},
      }),
      sideConditions: {stealthrock: {}, spikes: {level: 1}},
    },
    State.createMove(gen, 'Sacred Sword'),
    {weather: 'Sand', terrain: 'Misty', pseudoWeather: {gravity: {}}}
  ) as DeepReadonly<State>;

  const context = new Context(state, relevancy, {
    Items: {
      choicespecs: {},
      leftovers: {onResidual() { return 5; }},
    },
    Abilities: {
      cursedbody: {onModifyBasePower() { return 6; }},
      naturalcure: {},
    },
    Conditions: {
      brn: {onModifyAtk() { return 4; }},
      electrify: {},
      tailwind: {onModifySpe() { return 0; }},
      tox: {},
      lightscreen: {},
      leechseed: {onResidual() { return 7; }},
      stealthrock: {},
      spikes: {},
      sand: {onModifyAtk() { return 1; }},
      misty: {onModifyDef() { return 2; }},
      gravity: {onModifySpA() { return 3; }},
    },
    Moves: {
      sacredsword: {basePowerCallback() { return 4; }},
    },
  });

  return {context, state, relevancy};
}

function serialize(state: DeepReadonly<State>) {
  return JSON.stringify(State.toJSON(state as State));
}
