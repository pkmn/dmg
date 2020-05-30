import {Generations} from '@pkmn/data';
import {Dex} from '@pkmn/dex';

import {Conditions} from '../conditions';

const gens = new Generations(Dex);

describe('Conditions', () => {
  test('get', () => {
    expect(Conditions.get(gens.get(3), 'stealthrock')).toBeUndefined();
    expect(Conditions.get(gens.get(4), 'sr')).toEqual(['Stealth Rock', 'Side Condition', 'p2']);

    expect(Conditions.get(gens.get(7), 'Psychic Terrain')).toEqual(['Psychic', 'Terrain', 'field']);
    expect(Conditions.get(gens.get(7), 'rain')).toEqual(['Rain', 'Weather', 'field']);

    expect(Conditions.get(gens.get(1), 'reflect')).toEqual(['Reflect', 'Volatile Status', 'p2']);
    expect(Conditions.get(gens.get(2), 'reflect')).toEqual(['Reflect', 'Side Condition', 'p2']);

    expect(Conditions.get(gens.get(3), 'mudsport')).toEqual(['Mud Sport', 'Volatile Status', 'p2']);
    expect(Conditions.get(gens.get(6), 'mudsport')).toEqual(['Mud Sport', 'Pseudo Weather', 'p2']);

    expect(Conditions.get(gens.get(6), 'burned')).toEqual(['brn', 'Status']);
    expect(Conditions.get(gens.get(6), 'Foresight'))
      .toEqual(['Foresight', 'Volatile Status', 'p1']);
  });
});
