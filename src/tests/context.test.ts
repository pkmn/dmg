import {Generations} from '@pkmn/data';
import {Dex} from '@pkmn/dex';

import {Context} from '../context';
import {State} from '../state';
import {Relevancy} from '../result';
import {DeepReadonly} from '../utils';

describe('Context', () => {
  const newContext = () => {
    const gens = new Generations(Dex);
    const gen = gens.get(7);
    const relevancy = new Relevancy();
    const residual = new Relevancy();
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
    const context = new Context(state, relevancy, residual, {
      Items: {
        choicespecs: {},
        leftovers: {},
      },
      Abilities: {
        cursedbody: {},
        naturalcure: {},
      },
      Conditions: {
        brn: {},
        electrify: {},
        tailwind: {},
        tox: {},
        lightscreen: {},
        leechseed: {},
        stealthrock: {},
        spikes: {},
        sand: {onModifyAtk() { return 1; }},
        misty: {onModifyDef() { return 2; }},
        gravity: {onModifySpA() { return 3; }},
      },
      Moves: {
        sacredsword: {},
      },
    });
    return {context, state, relevancy, residual};
  };


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

  // test('Side', () => {
  //   const {context, state, relevancy} = newContext();
  // });

  // test('Pokemon', () => {
  //   const {context, state, relevancy} = newContext();
  // });

  // test('Move', () => {
  //   const {context, state, relevancy} = newContext();
  // });
});

function serialize(state: DeepReadonly<State>) {
  return JSON.stringify({
    gameType: state.gameType,
    gen: state.gen.num,
    p1: state.p1,
    p2: state.p2,
    move: state.move,
    field: state.field,
  });
}
