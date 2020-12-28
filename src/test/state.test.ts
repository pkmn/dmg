import {Generations, PokemonSet, StatsTable} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {PokemonOptions, State} from '../state';
import {DeepPartial, extend} from '../utils';

const gens = new Generations(Dex as any);

describe('State', () => {
  test('toJSON', () => {
    const gen = gens.get(4);
    const state = new State(
      gen,
      State.createPokemon(gen, 'Gengar'),
      State.createPokemon(gen, 'Clefable'),
      State.createMove(gen, 'Thunderbolt')
    );
    expect(() => JSON.stringify(State.toJSON(state))).not.toThrow();
  });

  describe('createField', () => {
    test('weather', () => {
      expect(() => State.createField(gens.get(5), {weather: 'heat'})).toThrow('invalid');
      expect(State.createField(gens.get(5), {weather: 'sun'}).weather).toBe('Sun');
      expect(State.createField(gens.get(5)).weather).toBeUndefined();
    });

    test('terrain', () => {
      expect(() => State.createField(gens.get(1), {terrain: 'electric'})).toThrow('invalid');
      expect(State.createField(gens.get(7), {terrain: 'electric'}).terrain).toBe('Electric');
    });

    test('pseudoWeather', () => {
      expect(() => State.createField(gens.get(1), {pseudoWeather: ['foo']})).toThrow('invalid');
      expect(() => State.createField(gens.get(3), {pseudoWeather: {trickroom: {}}}))
        .toThrow('invalid');

      expect(State.createField(gens.get(7), {pseudoWeather: ['gravity']}).pseudoWeather)
        .toEqual({gravity: {}});
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
      expect(() => State.createSide(gens.get(1), pokemon, {sideConditions: ['reflect']}))
        .toThrow('not a Side Condition');
      expect(() => State.createSide(gens.get(3), pokemon, {sideConditions: {mudsport: {}}}))
        .toThrow('not a Side Condition');

      let side = State.createSide(gens.get(7), pokemon);
      expect(side).toEqual({sideConditions: {}, pokemon});
      side = State.createSide(gens.get(7), pokemon, {sideConditions: ['tailwind', 'stealthrock']});
      expect(side.sideConditions).toEqual({tailwind: {}, stealthrock: {}});
      side = State.createSide(gens.get(7), pokemon, {sideConditions: {spikes: {level: 3}}});
      expect(side.sideConditions).toEqual({spikes: {level: 3}});
    });

    test('abilities', () => {
      const side = State.createSide(gens.get(7), pokemon, {abilities: ['Battery', 'Fairy Aura']});
      expect(side.active).toEqual([
        {ability: 'battery', position: 0},
        {ability: 'fairyaura', position: 1},
      ]);
    });

    test('atks', () => {
      expect(State.createSide(gens.get(7), pokemon, {atks: [50, 100, 80]}).team).toEqual([
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
        species: gens.get(2).species.get('Pikachu')}))).toThrow('mismatch');
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
      expect(State.createPokemon(gens.get(4), 'Jirachi', {weighthg: 9}).weighthg).toBe(9);
      expect(State.createPokemon(gens.get(4), 'Jirachi').weighthg).toBe(11);
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
      expect(State.createPokemon(gens.get(4), 'Jirachi', {ability: 'Serene Grace'}).ability)
        .toBe('serenegrace');
      expect(State.createPokemon(gens.get(4), 'Jirachi').ability).toBe('serenegrace');
    });

    test('happiness', () => {
      expect((() => State.createPokemon(gens.get(3), 'Charmander', {happiness: -1})))
        .toThrow('is not within [0,255]');
      expect((() => State.createPokemon(gens.get(3), 'Charmander', {happiness: 300})))
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
      expect(() => State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'reflect'}))
        .toThrow('not a Status');
      pokemon = State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'Asleep'});
      expect(pokemon.status).toBe('slp');
      expect(pokemon.statusData).toBeUndefined();

      pokemon = State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'tox'});
      expect(pokemon.status).toBe('tox');
      expect(pokemon.statusData).toEqual({toxicTurns: 0});

      expect(() => State.createPokemon(gens.get(1), 'Bulbasaur', {statusData: {toxicTurns: -1}}))
        .toThrow('is not within [0,15]');
      expect(() => State.createPokemon(gens.get(1), 'Bulbasaur', {statusData: {toxicTurns: 20}}))
        .toThrow('is not within [0,15]');
      expect(() =>
        State.createPokemon(gens.get(1), 'Bulbasaur', {status: 'slp', statusData: {toxicTurns: 4}}))
        .toThrow('status is not \'tox\'');
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
      expect(() => State.createPokemon(gens.get(2), 'Mew', {volatiles: ['Spikes']}))
        .toThrow('not a Volatile Status');
      expect(() => State.createPokemon(gens.get(1), 'Mew', {volatiles: {sleep: {}}}))
        .toThrow('not a Volatile Status');

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
      expect(State.createPokemon(gens.get(6), 'Arbok', {nature: 'hardy'}).nature).toBe('Hardy');
    });

    test('evs', () => {
      expect(() => State.createPokemon(gens.get(4), 'Pikachu', {evs: {spa: 300}}))
        .toThrow('is not within [0,255]');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {evs: {spa: 40, spc: 48}}))
        .toThrow('Spc and SpA evs mismatch');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {evs: {spd: 32, spc: 36}}))
        .toThrow('Spc and SpD evs mismatch');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {evs: {spa: 24, spd: 20}}))
        .toThrow('SpA and SpD evs must match');
      expect(() => State.createPokemon(gens.get(2), 'Pikachu', {evs: {spa: 16, spc: 28}}))
        .toThrow('Spc does not exist');

      expect(State.createPokemon(gens.get(1), 'Pikachu', {evs: {spc: 0}}).evs)
        .toEqual({hp: 252, atk: 252, def: 252, spa: 0, spd: 0, spe: 252});
      expect(State.createPokemon(gens.get(7), 'Pikachu', {evs: {spa: 200, hp: 128}}).evs)
        .toEqual({hp: 128, atk: 0, def: 0, spa: 200, spd: 0, spe: 0});
    });

    test('ivs', () => {
      expect(() => State.createPokemon(gens.get(4), 'Pikachu', {ivs: {spa: 32}}))
        .toThrow('is not within [0,31]');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {ivs: {spa: 30, spc: 28}}))
        .toThrow('Spc and SpA ivs mismatch');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {ivs: {spd: 30, spc: 26}}))
        .toThrow('Spc and SpD ivs mismatch');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {ivs: {spa: 24, spd: 20}}))
        .toThrow('SpA and SpD ivs must match');
      expect(() => State.createPokemon(gens.get(2), 'Pikachu', {ivs: {spa: 16, spc: 28}}))
        .toThrow('Spc does not exist');

      expect(State.createPokemon(gens.get(1), 'Pikachu', {ivs: {spc: 0}}).ivs)
        .toEqual({hp: 29, atk: 31, def: 31, spa: 0, spd: 0, spe: 31});
      expect(State.createPokemon(gens.get(7), 'Pikachu', {ivs: {spa: 5, hp: 30}}).ivs)
        .toEqual({hp: 30, atk: 31, def: 31, spa: 5, spd: 31, spe: 31});
    });

    test('dvs', () => {
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {dvs: {spa: 16}}))
        .toThrow('is not within [0,15]');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {ivs: {spa: 31}, dvs: {spa: 10}}))
        .toThrow('does not match IV');
      expect(State.createPokemon(gens.get(1), 'Pikachu', {
        dvs: {atk: 14, spc: 10}, ivs: {atk: 28},
      }).ivs).toEqual({hp: 13, atk: 29, def: 31, spa: 21, spd: 21, spe: 31});
    });

    test('hidden power', () => {
      let ivs: Partial<StatsTable> = {};
      expect(State.createPokemon(gens.get(4), 'Pikachu', {ivs}, 'Hidden Power Bug').ivs)
        .toEqual({hp: 31, atk: 30, def: 30, spa: 31, spd: 30, spe: 31});
      ivs = {atk: 8, def: 17, spa: 30};
      expect(State.createPokemon(gens.get(4), 'Pikachu', {ivs}, 'Hidden Power').ivs)
        .toEqual({...ivs, hp: 31, spd: 31, spe: 31});
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {}, 'Hidden Power Grass'))
        .toThrow('Unsupported or invalid Hidden Power');
      expect(() => State.createPokemon(gens.get(8), 'Pikachu', {}, 'Hidden Power Grass'))
        .toThrow('Unsupported or invalid Hidden Power');
      expect(State.createPokemon(gens.get(6), 'Pikachu', {ivs}, 'Hidden Power Grass').ivs)
        .toEqual({...ivs, hp: 31, spd: 31, spe: 31});
      expect(() => State.createPokemon(gens.get(7), 'Pikachu', {}, 'Hidden Power Fairy'))
        .toThrow('Unsupported or invalid Hidden Power');
      expect(State.createPokemon(gens.get(7), 'Pikachu', {ivs}, 'Hidden Power Dark').ivs)
        .toEqual({...ivs, hp: 31, spd: 31, spe: 31});
      expect(() =>
        State.createPokemon(gens.get(7), 'Pikachu', {level: 99, ivs}, 'Hidden Power Dark'))
        .toThrow('Cannot set Hidden Power IVs over non-default IVs');
      ivs = {atk: 31, def: 30, spe: 30};
      expect(State.createPokemon(gens.get(7), 'Pikachu', {level: 99, ivs}, 'Hidden Power Rock').ivs)
        .toEqual({hp: 31, atk: 31, def: 30, spa: 31, spd: 30, spe: 30});
      ivs = {atk: 30, spe: 30};
      expect(State.createPokemon(gens.get(2), 'Pikachu', {level: 99, ivs}, 'Hidden Power Rock').ivs)
        .toEqual({hp: 23, atk: 27, def: 25, spa: 31, spd: 31, spe: 31});
    });

    test('boosts', () => {
      expect(() => State.createPokemon(gens.get(4), 'Pikachu', {boosts: {spa: 7}}))
        .toThrow('is not within [-6,6]');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {boosts: {spa: 4, spc: 5}}))
        .toThrow('Spc and SpA boosts mismatch');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {boosts: {spd: 2, spc: 1}}))
        .toThrow('Spc and SpD boosts mismatch');
      expect(() => State.createPokemon(gens.get(1), 'Pikachu', {boosts: {spa: -1, spd: -3}}))
        .toThrow('SpA and SpD boosts must match');
      expect(() => State.createPokemon(gens.get(2), 'Pikachu', {boosts: {spa: 0, spc: 1}}))
        .toThrow('Spc does not exist');

      expect(State.createPokemon(gens.get(1), 'Pikachu', {boosts: {spc: 2}}).boosts)
        .toEqual({spa: 2, spd: 2});
      expect(State.createPokemon(gens.get(7), 'Pikachu', {boosts: {evasion: 5}}).boosts)
        .toEqual({evasion: 5});
    });

    test('gender', () => {
      expect(() => State.createPokemon(gens.get(1), 'Chansey', {gender: 'F'}))
        .toThrow('Gender does not exist');
      expect(() => State.createPokemon(gens.get(2), 'Chansey', {gender: 'M'}))
        .toThrow('must be \'F\'');
      expect(() => State.createPokemon(gens.get(2), 'Charizard', {gender: 'F', dvs: {atk: 3}}))
        .toThrow('Atk DVs must be \'M\'');
      expect(State.createPokemon(gens.get(3), 'Charizard', {gender: 'F'}).gender).toBe('F');
    });

    test('hp', () => {
      expect(() => State.createPokemon(gens.get(1), 'Chansey', {dvs: {hp: 15, atk: 0}}))
        .toThrow('required to have an HP DV');
      expect(State.createPokemon(gens.get(1), 'Chansey', {dvs: {atk: 0}}).ivs!.hp).toEqual(15);
      expect(State.createPokemon(gens.get(3), 'Suicune', {evs: {hp: 252}}).maxhp).toEqual(404);
      expect(() => State.createPokemon(gens.get(3), 'Suicune', {maxhp: 300, evs: {hp: 252}}))
        .toThrow('less than calculated max HP');
      expect(State.createPokemon(gens.get(3), 'Suicune', {maxhp: 500, evs: {hp: 252}}).maxhp)
        .toEqual(500);
      expect(State.createPokemon(gens.get(3), 'Suicune', {evs: {hp: 252}}).hp).toEqual(404);
      expect(State.createPokemon(gens.get(3), 'Suicune', {hp: 300, evs: {hp: 252}}).hp)
        .toEqual(300);
      expect(() => State.createPokemon(gens.get(3), 'Suicune', {hp: -1, evs: {hp: 252}}))
        .toThrow('is not within [0,404]');
      expect(() =>
        State.createPokemon(gens.get(3), 'Suicune', {hpPercent: 50, hp: 201, evs: {hp: 252}})).toThrow('hp mismatch: \'202\' does not match \'201\'');
      expect(State.createPokemon(gens.get(3), 'Suicune', {hpPercent: 75, evs: {hp: 252}}).hp)
        .toEqual(303);
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
      expect(() => State.createMove(gens.get(1), 'Tackle 80', {name: 'Tackle 120'}))
        .toThrow('mismatch');

      let move = State.createMove(gens.get(1), 'Tackle');
      expect(move.name).toBe('Tackle');
      move = State.createMove(gens.get(7), 'Tackle', {name: 'Tackle'});
      expect(move.name).toBe('Tackle');
      expect(move.basePower).toBe(40);
      move = State.createMove(gens.get(7), 'Tackle 80', {name: 'Tackle'});
      expect(move.name).toBe('Tackle');
      expect(move.basePower).toBe(80);
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
      const dynamax = {volatiles: {dynamax: {}}};
      expect(() => State.createMove(gens.get(8), 'Tackle', {useZ: true}, dynamax))
        .toThrow('Z-Move and a Max Move simulataneously');
    });

    test('hits', () => {
      const dynamax = {volatiles: {dynamax: {}}};
      expect(() => State.createMove(gens.get(8), 'Tackle', {hits: 4}, dynamax))
        .toThrow('Max Moves cannot be multi-hit');
      expect(() =>
        State.createMove(gens.get(8), 'Tackle', {hits: 2}, {
          species: 'Pikachu',
          volatiles: {dynamax: {},
          }})).toThrow('Max Moves cannot be multi-hit');
      expect(() => State.createMove(gens.get(8), 'Tackle', {useZ: true, hits: 3}))
        .toThrow('Z-Moves cannot be multi-hit');

      expect(() => State.createMove(gens.get(8), 'Tackle', {hits: 3}))
        .toThrow('Tackle is not multi-hit');

      expect(State.createMove(gens.get(7), 'Tackle').hits).toBe(1);
      expect(State.createMove(gens.get(7), 'Icicle Spear').hits).toBe(3);
      expect(State.createMove(gens.get(7), 'Gear Grind', {}, {ability: 'Skill Link'}).hits)
        .toBe(2);
      expect(State.createMove(gens.get(7), 'Icicle Spear', {}, {ability: 'Skill Link'}).hits)
        .toBe(5);
      expect(State.createMove(gens.get(7), 'Bullet Seed', {}, {item: 'Grip Claw'}).hits)
        .toBe(5);
      expect(State.createMove(gens.get(7), 'Bullet Seed', {hits: 4}, {item: 'Grip Claw'}).hits)
        .toBe(4);
    });

    test('crit', () => {
      expect(State.createMove(gens.get(1), 'Tackle', {crit: true}).crit).toBe(true);
      expect(State.createMove(gens.get(1), 'Slash').crit).toBeUndefined(); // 255 / 256 != 100%
      expect(State.createMove(gens.get(7), 'Frost Breath').crit).toBe(true);
    });

    test('magnitude', () => {
      expect(() => State.createMove(gens.get(7), 'Tackle', {magnitude: 5}))
        .toThrow('incorrectly set on move');
      expect(() => State.createMove(gens.get(7), 'Magnitude', {magnitude: 1}))
        .toThrow('not within [4,10]');
      expect(() => State.createMove(gens.get(7), 'Magnitude', {magnitude: 1}))
        .toThrow('not within [4,10]');
      expect(() => State.createMove(gens.get(7), 'Magnitude'))
        .toThrow('must have a magnitude specified');
      expect(State.createMove(gens.get(7), 'Magnitude', {magnitude: 5}).magnitude).toBe(5);
      expect(State.createMove(gens.get(7), 'Magnitude 9').magnitude).toBe(9);
      expect(() => State.createMove(gens.get(7), 'Magnitude 9', {magnitude: 4}).magnitude)
        .toThrow('Magnitude mismatch');
    });

    test('spread', () => {
      expect(() => State.createMove(gens.get(1), 'Earthquake', {spread: true}))
        .toThrow('Spread moves do not exist');
      expect(State.createMove(gens.get(7), 'Earthquake').spread).toBeUndefined();
      expect(State.createMove(gens.get(7), 'Earthquake', {spread: false}).spread).toBe(false);
    });

    test('consecutive', () => {
      expect(() => State.createMove(gens.get(7), 'Tackle', {consecutive: 4}))
        .toThrow('consecutive has no meaning');
      const move =
        State.createMove(gens.get(7), 'Tackle', {consecutive: 4}, {item: 'Metronome'});
      expect(move.consecutive).toBe(4);
    });
  });

  describe('mergeSet', () => {
    const options: PokemonOptions = {
      level: 50,
      item: 'Life Orb',
      ability: 'Illuminate',
      nature: 'Quirky',
      ivs: {spa: 28},
      evs: {hp: 252, def: 40},
      gender: 'M' as const,
      hp: 135,
    };

    test('mismatch', () => {
      const gen = gens.get(4);
      const gengar = State.createPokemon(gen, 'Gengar', options);
      expect(() => State.mergeSet(gen, gengar, {species: 'Clefable'}))
        .toThrow('Received invalid Clefable set for Gengar');
      expect(() => State.mergeSet(gen, gengar, 'Lick')).toThrow('Received no sets for Gengar');
    });

    test('match', () => {
      let gengar = State.createPokemon(gens.get(4), 'Gengar', options);
      const yes: DeepPartial<PokemonSet> = {
        name: 'Not Match',
        species: 'Gengar',
        item: 'Life Orb',
        ability: 'Levitate',
        moves: ['Shadow Ball', 'Thunderbolt', 'Focus Blast', 'Hidden Power Fire'],
        nature: 'Timid',
        gender: 'F',
        evs: {def: 4, spa: 252, spe: 252},
        ivs: {atk: 31},
        shiny: true,
        happiness: 123,
      };
      const no: DeepPartial<PokemonSet> = extend({}, yes, {item: 'Focus Sash', nature: 'Modest'});

      let merged = State.mergeSet(gens.get(4), gengar, yes, no);

      expect(merged.level).toEqual(100);
      expect(merged.item).toEqual('lifeorb');
      expect(merged.ability).toEqual('levitate');
      expect(merged.nature).toEqual('Timid');
      expect(merged.evs).toEqual({hp: 0, atk: 0, def: 4, spa: 252, spd: 0, spe: 252});
      expect(merged.ivs).toEqual({hp: 31, atk: 30, def: 31, spa: 30, spd: 31, spe: 30});
      expect(merged.happiness).toEqual(123);
      expect(merged.hp).toEqual(210);
      expect(merged.maxhp).toEqual(261);
      expect(merged.gender).toEqual('F');

      yes.item = 'Leftovers';
      yes.ability = undefined;
      yes.evs!.spd = yes.evs!.spa;
      gengar = State.createPokemon(gens.get(2), 'Gengar');
      expect(() => State.mergeSet(gens.get(2), gengar, yes, no))
        .toThrow('is required to not be shiny');
      yes.shiny = false;
      expect(() => State.mergeSet(gens.get(2), gengar, yes, no))
        .toThrow('A Gengar with 14 Atk DVs must be \'M\' in gen 2');
      yes.ivs = undefined;
      merged = State.mergeSet(gens.get(2), gengar, yes, no);

      expect(merged.nature).toBeUndefined();
      expect(merged.gender).toEqual('M');
      expect(merged.ivs!.atk).toEqual(29);
    });

    test('marowak', () => {
      expect(State.mergeSet(gens.get(2), State.createPokemon(gens.get(2), 'Marowak'), {
        species: 'Marowak',
        item: 'Thick Club',
        moves: ['Earthquake', 'Rock Slide', 'Counter', 'Swords Dance'],
      }).evs!.atk).toEqual(240);
      expect(State.mergeSet(gens.get(2), State.createPokemon(gens.get(2), 'Marowak'), {
        species: 'Marowak',
        item: 'Thick Club',
        moves: ['Earthquake', 'Rock Slide', 'Counter', 'Bone Rush'],
      }).evs!.atk).toEqual(252);
      expect(State.mergeSet(gens.get(3), State.createPokemon(gens.get(2), 'Marowak'), {
        species: 'Marowak',
        item: 'Thick Club',
        moves: ['Earthquake', 'Rock Slide', 'Counter', 'Swords Dance'],
      }).evs!.atk).toEqual(252);
    });
  });
});
