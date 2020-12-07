import {Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {State} from '../state';

const gens = new Generations(Dex as any);

describe('State', () => {
  describe('createField', () => {
    test('weather', () => {
      expect(() => State.createField(gens.get(5), {weather: 'heat'})).toThrow('invalid');
      expect(State.createField(gens.get(5), {weather: 'sun'}).weather).toBe('Sun');
      expect(State.createField(gens.get(5)).weather).toEqual({});
    });

    test('terrain', () => {
      expect(() => State.createField(gens.get(1), {terrain: 'electric'})).toThrow('invalid');
      expect(State.createField(gens.get(7), {terrain: 'electric'})).toBe('Electric');
    });

    test('pseudoWeather', () => {
      expect(() => State.createField(gens.get(1), {pseudoWeather: ['foo']})).toThrow('invalid');
      expect(() => State.createField(gens.get(3), {pseudoWeather: {trickroom: {}}}))
        .toThrow('invalid');

      expect(State.createField(gens.get(7), {pseudoWeather: ['gravity']}).pseudoWeather)
        .toEqual({gravity: 1});
      expect(State.createField(gens.get(7), {pseudoWeather: {trickroom: {}}}).pseudoWeather)
        .toEqual({trickroom: {}});
    });
  });

  describe('createSide', () => {
    const pokemon = {} as State.Pokemon;

    test('sideConditions', () => {
      expect(() => State.createSide(gens.get(1), pokemon, {sideConditions: ['foo']}))
        .toThrow('invalid');
      expect(() => State.createSide(gens.get(3), pokemon, {sideConditions: {foo: {}}}))
        .toThrow('invalid');
      expect(() => State.createSide(gens.get(1), pokemon, {sideConditions: ['spikes']}))
        .toThrow('not a Side Condition');
      expect(() => State.createSide(gens.get(3), pokemon, {sideConditions: {trickroom: {}}}))
        .toThrow('not a Side Condition');

      let side = State.createSide(gens.get(7), pokemon);
      expect(side).toEqual({sideConditions: {}, pokemon});
      side = State.createSide(gens.get(7), pokemon, {sideConditions: ['tailwind', 'stealthrock']});
      expect(side.sideConditions).toEqual({tailwind: {}, stealthrock: {}});
      side = State.createSide(gens.get(7), pokemon, {sideConditions: {spikes: {level: 3}}});
      expect(side.sideConditions).toEqual({spikes: {level: 3}});
    });

    test('abilities', () => {
      const side = State.createSide(gens.get(7), pokemon, {abilities: ['Charge', 'Fairy Aura']});
      expect(side.active).toEqual([
        {ability: 'charge', position: 0},
        {ability: 'fairyaura', position: 1},
      ]);
    });

    test('atks', () => {
      expect(State.createSide(gens.get(7), pokemon, {atks: [50, 100, 80]}).active).toEqual([
        {species: {baseStats: {atk: 50}}, position: 0},
        {species: {baseStats: {atk: 100}}, position: 1},
        {species: {baseStats: {atk: 80}}, position: 2},
      ]);
    });
  });

  describe('createPokemon', () => {
    test('species', () => {
      expect((() => State.createPokemon(gens.get(1), 'Tyranitar'))).toThrow('invalid');
      expect((() => State.createPokemon(gens.get(2), 'Tyranitar', {
        species: gens.get(2).species.get('Pikachu')}))).toThrow('invalid');
      expect(State.createPokemon(gens.get(2), 'Tyranitar').species.name).toBe('Tyranitar');
    });

    test('level', () => {
      expect((() => State.createPokemon(gens.get(1), 'Gengar', {level: 0})))
        .toThrow('is not within [1,100]');
      expect((() => State.createPokemon(gens.get(1), 'Gengar', {level: 200})))
        .toThrow('is not within [1,100]');
      expect(State.createPokemon(gens.get(1), 'Gengar', {level: 78}).level).toBe(78);
      expect(State.createPokemon(gens.get(1), 'Gengar').level).toBe(100);
    });

    test('weight', () => {
      expect(() => State.createPokemon(gens.get(4), 'Jirachi', {weighthg: 0}))
        .toThrow('must be at least 1');
      expect(() => State.createPokemon(gens.get(4), 'Jirachi', {weightkg: 0}))
        .toThrow('must be at least 1');
      expect(State.createPokemon(gens.get(4), 'Jirachi', {weightkg: 9}).weighthg).toBe(90);
      expect(State.createPokemon(gens.get(4), 'Jirachi', {weighthg: 9})).toBe(9);
      expect(State.createPokemon(gens.get(4), 'Jirachi')).toBe(11);
    });

    test('item', () => {
      expect(() => State.createPokemon(gens.get(4), 'Jirachi', {item: 'Heavy Duty Boosts'}))
        .toThrow('invalid');
      expect(State.createPokemon(gens.get(4), 'Jirachi', {item: 'Leftovers'}).item)
        .toBe('leftovers');
    });

    test('ability', () => {
      expect(() => State.createPokemon(gens.get(4), 'Jirachi', {ability: 'Sereen Grace'}))
        .toThrow('invalid');
      expect(State.createPokemon(gens.get(4), 'Jirachi', {ability: 'Serence Grace'}).ability)
        .toBe('serenegrace');
      expect(State.createPokemon(gens.get(4), 'Jirachi').ability).toBe('serenegrace');
    });

    test('happiness', () => {
      expect((() => State.createPokemon(gens.get(3), 'Charmander', {happiness: -1})))
        .toThrow('is not within [0,255]');
      expect((() => State.createPokemon(gens.get(3), 'Charmander', {level: 300})))
        .toThrow('is not within [0,255]');
      expect(State.createPokemon(gens.get(3), 'Charmander').happiness).toBeUndefined();
      expect(State.createPokemon(gens.get(3), 'Charmander', {happiness: 200}).happiness).toBe(200);
    });

    test('status', () => {
      let pokemon = State.createPokemon(gens.get(1), 'Bulbasaur');
      expect(pokemon.status).toBeUndefined();
      expect(pokemon.statusData).toBeUndefined();
      expect(() => State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'foo'}))
        .toThrow('invalid');
      expect(() => State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'spikes'}))
        .toThrow('not a Status');
      pokemon = State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'Asleep'});
      expect(pokemon.status).toBe('slp');
      expect(pokemon.statusData).toBeUndefined();

      pokemon = State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'tox'});
      expect(pokemon.status).toBe('tox');
      expect(pokemon.statusData).toEqual({toxicTurns: 1});


      expect(() => State.createPokemon(gens.get(1), 'Bulbasaur', {statusData: {toxicTurns: -1}}))
        .toThrow('is not within [0,15]');
      expect(() => State.createPokemon(gens.get(1), 'Bulbasaur', {statusData: {toxicTurns: 20}}))
        .toThrow('is not within [0,15]');
      expect(() =>
        State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'slp', statusData: {toxicTurns: 4}})).toThrow('status is not \'tox\'');
      pokemon =
        State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'tox', statusData: {toxicTurns: 4}});
      expect(pokemon.statusData).toEqual({toxicTurns: 4});
      const statusData = {};
      pokemon = State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'tox', statusData});
      expect(pokemon.statusData).toBe(statusData);
    });

    test('volatiles', () => {
      expect(() => State.createPokemon(gens.get(4), 'Mew', {volatiles: ['foo']}))
        .toThrow('invalid');
      expect(() => State.createPokemon(gens.get(4), 'Mew', {volatiles: {foo: {}}}))
        .toThrow('invalid');
      expect(() =>
        State.createPokemon(gens.get(2), 'Mew', {volatiles: ['Aqua Ring']})).toThrow('not a Volatile Status');
      expect(() =>
        State.createPokemon(gens.get(1), 'Mew', {volatiles: {protect: {}}})).toThrow('not a Volatile Status');

      expect(
        State.createPokemon(gens.get(4), 'Mew', {volatiles: ['Aqua Ring', 'Protect']}).volatiles
      ).toEqual({aquaring: {}, protect: {}});
      expect(
        State.createPokemon(gens.get(4), 'Mew', {volatiles: {slowstart: {level: 4}}}).volatiles
      ).toEqual({slowstart: {level: 4}});
    });

    test('types', () => {
      let pokemon = State.createPokemon(gens.get(3), 'Charizard');
      expect(pokemon.types).toEqual(['Fire', 'Flying']);
      expect(pokemon.addedType).toBeUndefined();
      pokemon = State.createPokemon(gens.get(3), 'Charizard', {types: ['Ghost']});
      expect(pokemon.types).toEqual(['Ghost']);
      expect(pokemon.addedType).toBeUndefined();
      pokemon = State.createPokemon(gens.get(3), 'Charizard', {addedType: 'Grass'});
      expect(pokemon.types).toEqual(['Fire', 'Flying']);
      expect(pokemon.addedType).toBe('Grass');
    });

    test('nature', () => {
      expect(() => State.createPokemon(gens.get(6), 'Arbok', {nature: 'foo'})).toThrow('invalid');
      expect(() => State.createPokemon(gens.get(6), 'Arbok', {nature: 'hardy'}).nature)
        .toBe('Hardy');
    });

    test('evs', () => {
      // TODO
    });

    test('ivs', () => {
      // TODO
    });

    test('dvs', () => {
      // TODO
    });

    test('hidden power', () => {
      // TODO
    });

    test('boosts', () => {
      // TODO
    });

    test('gender', () => {
      // TODO
    });

    test('hp', () => {
      // TODO
    });

    test('misc', () => {
      const pokemon = State.createPokemon(gens.get(1), 'Pikachu', {
        position: 1, switching: 'in', moveLastTurnResult: false, hurtThisTurn: false,
      });
      expect(pokemon.position).toBe(1);
      expect(pokemon.switching).toBe('in');
      expect(pokemon.moveLastTurnResult).toBe(false);
      expect(pokemon.hurtThisTurn).toBe(false);
    });
  });

  describe('createMove', () => {
    test('name', () => {
      expect(() => State.createMove(gens.get(1), 'foo')).toThrow('invalid');
      expect(() => State.createMove(gens.get(1), 'Tackle', {name: 'Not Tackle'}))
        .toThrow('mismatch');

      let move = State.createMove(gens.get(1), 'Tackle');
      expect(move.name).toBe('Tackle');
      move = State.createMove(gens.get(1), 'Tackle', {name: 'Tackle'});
      expect(move.name).toBe('Tackle');
    });

    test('species', () => {
      expect(() => State.createMove(gens.get(1), 'Tackle', {}, 'Foo'))
        .toThrow('invalid species');
      expect(() => State.createMove(gens.get(1), 'Tackle', {}, {species: 'Foo'}))
        .toThrow('invalid species');

      let move = State.createMove(gens.get(1), 'Tackle', {}, 'Pikachu');
      expect(move.name).toBe('Tackle');

      move = State.createMove(gens.get(1), 'Tackle', {}, {species: 'Pikachu'});
      expect(move.name).toBe('Tackle');
    });

    test('Z + Max', () => {
      expect(() => State.createMove(gens.get(8), 'Tackle', {useMax: true, useZ: true}))
        .toThrow('Z-Move and a Max Move simulataneously');
    });

    test('hits', () => {
      expect(() => State.createMove(gens.get(8), 'Tackle', {useMax: true, hits: 4}))
        .toThrow('Max Moves cannot be multi-hit');
      expect(() =>
        State.createMove(gens.get(8), 'Tackle', {hits: 2}, {
          species: 'Pikachu',
          volatiles: {dynamax: {},
          }})).toThrow('Max Moves cannot be multi-hit');
      expect(() => State.createMove(gens.get(8), 'Tackle', {useZ: true, hits: 3}))
        .toThrow('Z-Moves cannot be multi-hit');

      expect(() => State.createMove(gens.get(8), 'Tackle', {hits: 3}))
        .toThrow('is not multi-hit');

      expect(State.createMove(gens.get(7), 'Tackle').hits).toBe(1);
      expect(State.createMove(gens.get(7), 'Icicle Crash').hits).toBe(2);
      expect(State.createMove(gens.get(7), 'Gear Grind', {}, {ability: 'Skill Link'}).hits)
        .toBe(2);
      expect(State.createMove(gens.get(7), 'Icicle Crash', {}, {ability: 'Skill Link'}).hits)
        .toBe(5);
      expect(State.createMove(gens.get(7), 'Bullet Seed', {}, {item: 'Grip Claw'}).hits)
        .toBe(5);
      expect(State.createMove(gens.get(7), 'Bullet Seed', {hits: 4}, {item: 'Grip Claw'}).hits)
        .toBe(4);
    });

    test('crit', () => {
      expect(State.createMove(gens.get(1), 'Tackle', {crit: true}).crit).toBe(true);
      expect(State.createMove(gens.get(1), 'Slash').crit).toBe(false); // 255 / 256 != 100%
      expect(State.createMove(gens.get(7), 'Frost Breath').crit).toBe(true);
    });

    test('magnitude', () => {
      expect(() => State.createMove(gens.get(7), 'Tackle', {magnitude: 5}))
        .toThrow('incorrectly set on move');
      expect(() => State.createMove(gens.get(7), 'Magnitude', {magnitude: 1}))
        .toThrow('not within [4, 10]');
      expect(() => State.createMove(gens.get(7), 'Magnitude', {magnitude: 1}))
        .toThrow('not within [4, 10]');
      expect(() => State.createMove(gens.get(7), 'Magnitude'))
        .toThrow('must have a magnitude specified');
      expect(State.createMove(gens.get(7), 'Magnitude', {magnitude: 5}).magnitude).toBe(5);
    });

    test('spreadHit', () => {
      expect(() => State.createMove(gens.get(1), 'Earthquake', {spreadHit: true}))
        .toThrow('Spread moves do not exist');
      expect(State.createMove(gens.get(7), 'Earthquake').spreadHit).toBeUndefined();
      expect(State.createMove(gens.get(7), 'Earthquake', {spreadHit: false}).spreadHit).toBe(false);
    });

    test('numConsecutive', () => {
      expect(() => State.createMove(gens.get(7), 'Tackle', {numConsecutive: 4}))
        .toThrow('numConsecutive has no meaning');
      const move =
        State.createMove(gens.get(7), 'Tackle', {numConsecutive: 4}, {item: 'Metronome'});
      expect(move.numConsecutive).toBe(4);
    });
  });

  describe('mergeSet', () => {
    test('foo', () => {
      expect(true).toBe(true); // FIXME
    });
  });
});
