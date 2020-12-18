import {Generation, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import * as parser from '../parse';

const gens = new Generations(Dex as any);

const SCENARIO = 'gengar [lick] vs. clefable';

const parse = (g: Generation | Generations, s: string, error = '') => {
  if (error) expect(() => parser.parse(g, s, true)).toThrow(error);
  return parser.parse(g, s, false);
};

describe('parse', () => {
  test('misc', () => {
    expect(() => parse(gens, '', 'must have a value')).toThrow('must have a value');
    parse(
      gens,
      'foo attackerSpecies:gengar defenderSpecies:clefable move:lick sr:1',
      'Unable to parse phrase: \'foo\''
    );
  });

  test('gen', () => {
    expect(parse(gens, `gen:5 ${SCENARIO}`).gen.num).toBe(5);
    expect(parse(gens.get(1), `gen:1 ${SCENARIO}`).gen.num).toBe(1);

    expect(parse(gens, `gen:foo ${SCENARIO}`, 'Invalid generation').gen.num).toBe(8);
    expect(() => parse(gens, `gen:10 ${SCENARIO}`, 'is not within [1,8]').gen.num)
      .toThrow('is not within [1,8]');

    expect(parse(gens, `gen:5 gen=4 ${SCENARIO}`, 'Conflicting values').gen.num).toBe(4);
    expect(() => parse(gens.get(1), '--gen=2', 'Conflicting values').gen.num)
      .toThrow('Conflicting values');

    expect(parse(gens, `{4} ${SCENARIO}`).gen.num).toBe(4);
    expect(parse(gens.get(1), `${SCENARIO} [Gen 1]`).gen.num).toBe(1);

    expect(() => parse(gens, `[gen foo] ${SCENARIO}`, 'Unable to parse phrase'))
      .toThrow('must have a value');
    expect(() => parse(gens, `(Gen 10) ${SCENARIO}`, 'is not within [1,8]').gen.num)
      .toThrow('is not within [1,8]');

    expect(parse(gens, `{5} gen=4 ${SCENARIO}`, 'Conflicting values').gen.num).toBe(4);

    const state =  parse(gens, `(Gen 3 Doubles) ${SCENARIO}`);
    expect(state.gen.num).toBe(3);
    expect(state.gameType).toBe('doubles');
  });


  test('flags', () => {
    let state = parse(gens, `${SCENARIO} +doubles +sun pseudoWeather="Magic Room" attackerAbility=levitate p2AtkEV=12`);
    expect(state.gameType).toEqual('doubles');
    expect(state.field.weather).toEqual('Sun');
    expect(state.field.pseudoWeather.magicroom).toEqual(1); // TODO
    expect(state.p1.pokemon.ability).toEqual('levitate');
    expect(state.p2.pokemon.evs!.atk).toEqual(12);

    expect(() => parse(gens, `${SCENARIO} spikes:y`)).toThrow('TODO');

    expect(() => parse(gens, `${SCENARIO} TODO`)).toThrow('to contain at least one TODOcondition');
    expect(() => parse(gens, `${SCENARIO} TODO`)).toThrow('as a flag for a condition');
    expect(() => parse(gens, `${SCENARIO} TODO`)).toThrow('Unrecognized or invalid condition');
    expect(() => parse(gens, `${SCENARIO} TODO`)).toThrow('Mismatched kind for condition');
    expect(() => parse(gens, `${SCENARIO} TODO`)).toThrow('Ambiguous implicit condition');
    expect(() => parse(gens, `${SCENARIO} TODO`)).toThrow('Mismatched scope for condition');
    expect(() => parse(gens, `${SCENARIO} TODO`)).toThrow('Conflicting values for flag');
    expect(() => parse(gens, `${SCENARIO} TODO`)).toThrow('Conflicting values for condition');

    parse(gens, `${SCENARIO} foo:5`, 'Unknown flag \'foo\'');

    expect(parse(gens, `${SCENARIO} isCrit:true --crit:yes --noCrit=false +crit --hasCrit=1 +crit:y`).move.crit)
      .toBe(true);
    expect(parse(gens, `${SCENARIO} isSun:false --sun:false --noSun=false +sun --hasSun=0 +sun:n`).field.weather)
      .toBeUndefined();
    expect(parse(gens, `${SCENARIO} sun=true isSun:false`, 'Conflicting values').field.weather)
      .toBeUndefined();
  });

  test('phrase', () => {
    const state = parse(gens, '+2 Lvl 20 120 Atk- Type: Null @ Leftovers [Self-Destruct] vs -1 Lvl 30 48 HP / 0 Def- Mew @ Choice Specs');
    expect(state.p1.pokemon.species.id).toBe('typenull');
    expect(state.p1.pokemon.level).toEqual(20);
    expect(state.p1.pokemon.boosts).toEqual({atk: 2});
    expect(state.p1.pokemon.evs).toEqual({atk:120});
    expect(state.p1.pokemon.nature).toEqual('Modest');
    expect(state.p1.pokemon.item).toEqual('leftovers');
    expect(state.move.id).toEqual('selfdestruct');
    expect(state.p2.pokemon.species.id).toBe('mew');
    expect(state.p2.pokemon.level).toEqual(30);
    expect(state.p2.pokemon.boosts).toEqual({def: -1});
    expect(state.p2.pokemon.evs).toEqual({hp: 48, def: 0});
    expect(state.p2.pokemon.nature).toEqual('Gentle');
    expect(state.p2.pokemon.item).toEqual('choicespecs');
  });

  test('build', () => {
    expect(() => parse(gens, `gen:5 gametype:foo ${SCENARIO}`))
      .toThrow('Invalid game type');
    expect(() => parse(gens, `gen:2 gametype:doubles ${SCENARIO}`))
      .toThrow('Invalid game type');
    expect(() => parse(gens, `hits:foo  ${SCENARIO}`))
      .toThrow('Expected number for \'move hits\'');
    expect(() => parse(gens, `hits:3  ${SCENARIO}`))
      .toThrow('Lick is not multi-hit');
    expect(parse(gens, `${SCENARIO} move:tackle`, 'Conflicting values for \'move\': \'Lick\' vs. \'Tackle\'').move.id)
      .toEqual('tackle');
    expect(() => parse(gens, `gender:X  ${SCENARIO}`)).toThrow('Invalid gender');

    // TODO fillConditions sideConditions, volatiles

    // TODO spread + boosts
    // TODO ambiguous boosts

    expect(() => parse(gens, `p1Species:Mew  ${SCENARIO}`, 'Conflicting values').p1.pokemon.species.id)
      .toEqual('gengar');
    expect(() => parse(gens, `attackerLevel:foo  ${SCENARIO}`))
      .toThrow('Expected number for \'p1 level\'');
    expect(parse(gens, `${SCENARIO} p2Level=90 p2Level:80`, 'Conflicting values').p2.pokemon.level)
      .toEqual(80);
    expect(() => parse(gens, `p1Happiness:foo  ${SCENARIO}`)).toThrow('Expected number');
    expect(parse(gens, `p1Happiness:100 ${SCENARIO} attackerHappiness=250`, 'Conflicting values').p1.pokemon.happiness)
      .toEqual(250);
    expect(() => parse(gens, `attackerHP:foo  ${SCENARIO}`)).toThrow('Expected number');
    expect(parse(gens, `attackerHP:100 attackerHP:10 ${SCENARIO}`, 'Conflicting values').p1.pokemon.hp)
      .toEqual(10);
    expect(() => parse(gens, `attackerToxicCounter:foo  ${SCENARIO}`)).toThrow('Expected number');
    expect(parse(gens, `p2ToxicCounter:3 p2Status=tox:5 ${SCENARIO}`, 'Conflicting values').p2.pokemon.statusData?.toxicTurns)
      .toEqual(5);
  });
});