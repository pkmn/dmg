import {Generation, Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import * as parser from '../parse';

const gens = new Generations(Dex as any);

const PHRASE = 'gengar [lick] vs. clefable';
const FLAGS = 'attackerSpecies=gengar --move=lick p2species:clefable';

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
    expect(parse(gens, `gen:5 ${PHRASE}`).gen.num).toBe(5);
    expect(parse(gens.get(1), `gen:1 ${PHRASE}`).gen.num).toBe(1);

    expect(parse(gens, `gen:foo ${FLAGS}`, 'Invalid generation').gen.num).toBe(8);
    expect(() => parse(gens, `gen:10 ${PHRASE}`, 'is not within [1,8]').gen.num)
      .toThrow('is not within [1,8]');

    expect(parse(gens, `gen:5 gen=4 ${FLAGS}`, 'Conflicting values').gen.num).toBe(4);
    expect(() => parse(gens.get(1), '--gen=2', 'Conflicting values').gen.num)
      .toThrow('Conflicting values');

    expect(parse(gens, `{4} ${PHRASE}`).gen.num).toBe(4);
    expect(parse(gens.get(1), `${FLAGS} [Gen 1]`).gen.num).toBe(1);

    expect(() => parse(gens, `[gen foo] ${PHRASE}`, 'Unable to parse phrase'))
      .toThrow('must have a value');
    expect(() => parse(gens, `(Gen 10) ${FLAGS}`, 'is not within [1,8]').gen.num)
      .toThrow('is not within [1,8]');

    expect(parse(gens, `{5} gen=4 ${FLAGS}`, 'Conflicting values').gen.num).toBe(4);

    const state = parse(gens, `(Gen 3 Doubles) ${PHRASE}`);
    expect(state.gen.num).toBe(3);
    expect(state.gameType).toBe('doubles');
  });

  test('flags', () => {
    const state = parser.parse(gens,
      `${FLAGS} +doubles +sun pseudoWeather="Magic Room" attackerAbility=levitate p2AtkEV=12`,
      true);
    expect(state.gameType).toEqual('doubles');
    expect(state.field.weather).toEqual('Sun');
    expect(state.field.pseudoWeather.magicroom).toEqual({});
    expect(state.p1.pokemon.ability).toEqual('levitate');
    expect(state.p2.pokemon.evs!.atk).toEqual(12);

    expect(parse(gens, '(gen 6) absol-mega [sucker punch] vs. clefable').p1.pokemon.species.name)
      .toEqual('Absol-Mega');

    parse(gens, `${FLAGS} attackerFoo:0`, 'Unknown flag \'attackerfoo\'');
    expect(() => parse(gens, `${FLAGS} spikes:y`))
      .toThrow('Expected number for p2 Side Condition spikes');
    expect(() => parse(gens, `${FLAGS} weather=,`)).toThrow('as a flag for a condition');
    parse(gens, `${FLAGS} status=foo`, 'Unrecognized or invalid condition');
    expect(() => parse(gens, `${FLAGS} terrain=Sandstorm`))
      .toThrow('Mismatched kind for condition');
    expect(() => parse(gens, `${FLAGS} +Dynamax`)).toThrow('Ambiguous implicit condition');
    expect(() => parse(gens, `${FLAGS} p2=Sandstorm`)).toThrow('Mismatched scope for condition');
    expect(() => parse(gens, `${FLAGS} weather=Dynamax`)).toThrow('Mismatched kind for condition');
    expect(parse(gens, `${FLAGS} weather:Sun +Rain`, 'Conflicting values for flag').field.weather)
      .toEqual('Rain');
    expect(parse(
      gens, `${FLAGS} spikes:3 spikes:2`, 'Conflicting values for condition'
    ).p2.sideConditions.spikes).toEqual({level: 2});
    parse(gens, `${FLAGS} foo:5`, 'Unrecognized or invalid condition \'foo\'');

    expect(parse(
      gens, `${FLAGS} -isCrit +hasCrit isCrit:true --crit:yes --noCrit=false --hasCrit=1 -crit:y`
    ).move.crit).toBe(true);
    expect(parse(
      gens, `${FLAGS} isReflect:false --reflect:false --noReflect=true --hasReflect=0 -reflect:n`
    ).field.weather).toBeUndefined();
    expect(parse(gens, `${FLAGS} reflect=true isReflect:false`, 'Conflicting values').field.weather)
      .toBeUndefined();
  });

  test('phrase', () => {
    const state = parse(gens, '+2 Lvl 20 120- Atk / 60 Spe Type:Null @ Leftovers [Self-Destruct] ' +
      'vs -1 Lvl 30 48 HP / 0- Def / 20 SpD 95% Unnerve Mewtwo @ Choice Specs');
    expect(state.p1.pokemon.species.id).toBe('typenull');
    expect(state.p1.pokemon.level).toEqual(20);
    expect(state.p1.pokemon.boosts).toEqual({atk: 2});
    expect(state.p1.pokemon.evs).toEqual(gens.get(8).stats.fill({atk: 120, spe: 60}, 0));
    expect(state.p1.pokemon.nature).toEqual('Modest');
    expect(state.p1.pokemon.item).toEqual('leftovers');
    expect(state.move.id).toEqual('selfdestruct');
    expect(state.p2.pokemon.species.id).toBe('mewtwo');
    expect(state.p2.pokemon.ability).toBe('unnerve');
    expect(state.p2.pokemon.level).toEqual(30);
    expect(state.p2.pokemon.hp).toEqual(110);
    expect(state.p2.pokemon.boosts).toEqual({def: -1});
    expect(state.p2.pokemon.evs).toEqual(gens.get(8).stats.fill({hp: 48, spd: 20}, 0));
    expect(state.p2.pokemon.nature).toEqual('Mild');
    expect(state.p2.pokemon.item).toEqual('choicespecs');
  });

  describe('build', () => {
    test('misc', () => {
      expect(() => parse(gens, `gen:5 gametype:foo ${FLAGS}`)).toThrow('Invalid game type');
      expect(() => parse(gens, `gen:2 gametype:doubles ${PHRASE}`)).toThrow('Invalid game type');
    });

    test('conditions/allies', () => {
      const state = parse(gens, `${FLAGS} p2=leechseed,powerspot,reflect,lightscreen,spikes=2 ` +
        'p1Allies=aurabreak,battery,50,100,fairyaura,80 +friendguard p1=reflect p1Status=burned');
      expect(state.p1.sideConditions.reflect).toEqual({});
      expect(state.p2.sideConditions.reflect).toEqual({});
      expect(state.p2.sideConditions.lightscreen).toEqual({});
      expect(state.p2.sideConditions.spikes).toEqual({level: 2});
      expect(state.p1.pokemon.status).toEqual('brn');
      expect(state.p2.pokemon.volatiles.leechseed).toEqual({});
      expect(state.p2.active!.map(p => p!.ability)).toEqual(['friendguard', 'powerspot']);
      expect(state.p1.active!.map(p => p!.ability)).toEqual(['aurabreak', 'battery', 'fairyaura']);
      expect(state.p1.team!.map(p => p.species.baseStats.atk)).toEqual([50, 100, 80]);

      expect(() => parse(gens, `${PHRASE} p1allies=foo`)).toThrow('Unsupported or invalid ability');
      expect(() => parse(gens, `${PHRASE} p1allies=-1`)).toThrow('stat -1 is not within [0,255]');
      parse(gens, `${PHRASE} p1=fairyaura:yes,fairyaura:no`, 'Conflicting values');

      expect(parse(
        gens, `${PHRASE} p2allies=fairyaura isFairyaura:0`, 'Conflicting values'
      ).p2.active).toBeUndefined();
    });

    test('stats', () => {
      expect(parse(
        gens,
        `252+ SpA ${PHRASE} p1Nature=Timid`,
        'Conflicting values for p1 nature: Timid is not (+SpA)'
      ).p1.pokemon.nature).toEqual('Timid');

      expect(() => parse(gens, `${FLAGS} p1AccuracyBoosts=y`))
        .toThrow('Expected number for p1 accuracy boosts');
      expect(() => parse(gens, `${FLAGS} p2EvasionBoosts=n`))
        .toThrow('Expected number for p2 evasion boosts');
      expect(() => parse(gens, `${FLAGS} p2AtkBoosts=huh`))
        .toThrow('Expected number for p2 Atk boosts');

      expect(parse(
        gens, `${FLAGS} p1AccuracyBoosts=1 p1EvasionBoosts=2 p1SpABoosts=3`
      ).p1.pokemon.boosts).toEqual({accuracy: 1, evasion: 2, spa: 3});

      expect(() => parse(gens, `${FLAGS} p1AtkEv=y`))
        .toThrow('Expected number for p1 Atk EVs');
      expect(() => parse(gens, `gen:1 ${PHRASE} p2SpcDV=n`))
        .toThrow('Expected number for p2 Spc DVs');
      expect(() => parse(gens, `${FLAGS} p2SpeIvs=foo`))
        .toThrow('Expected number for p2 Spe IVs');

      const state = parse(gens, `gen:1 ${PHRASE} p1AtkEVs=4 p2SpcDV=3 p2SpeIVs=31`);
      expect(state.p1.pokemon.evs!.atk).toEqual(4);
      expect(state.p2.pokemon.ivs!.spa).toEqual(7);
      expect(state.p2.pokemon.ivs!.spd).toEqual(7);
      expect(state.p2.pokemon.ivs!.spe).toEqual(31);
    });

    test('move', () => {
      expect(parse(gens, `${FLAGS} move:tackle`, 'Conflicting values').move.id).toEqual('tackle');
      expect(() => parse(gens, `hits:foo ${FLAGS}`)).toThrow('Expected number for move hits');
      expect(() => parse(gens, `hits:3 ${PHRASE}`)).toThrow('Lick is not multi-hit');
      expect(parse(gens, `hits:1 ${PHRASE}`).move.name).toEqual('Lick');

      expect(() => parse(gens, 'machamp @ metronome [mach punch] vs. vaporeon consecutive:foo'))
        .toThrow('Expected number for move consecutive');
      expect(parse(
        gens, 'machamp @ metronome [mach punch] vs. vaporeon consecutive:3'
      ).move.consecutive).toEqual(3);

      expect(parse(gens, '+1 gengar [shadow ball] vs. clefable').p1.pokemon.boosts).toEqual({spa: 1});
      expect(() => parse(gens, '+1 gengar [none] vs. clefable', 'Ambiguous boosts'))
        .toThrow('invalid move');
      expect(parse(gens, 'keldeo [secret sword] vs. +1 blissey').p2.pokemon.boosts).toEqual({def: 1});

      expect(parse(
        gens, `(Gen 7) ${PHRASE} useZ:true z:false`, 'Conflicting values for move useZ'
      ).move.useZ).toBe(true);
      expect(parse(gens, `{7} ${PHRASE} isZ:true`).move.useZ).toBe(true);
    });

    test('move sugar', () => {
      let state = parse(gens, '(gen 7) vaporeon [zicebeam] vs. clefable');
      expect(state.move.name).toEqual('Ice Beam');
      expect(state.move.useZ).toBe(true);

      state = parse(gens, 'Gengar @ Metronome:5 [Lick] vs Clefable');
      expect(state.p1.pokemon.item).toEqual('metronome');
      expect(state.move.consecutive).toEqual(5);

      state = parse(gens,
        'Gengar @ Metronome:5 [Lick] vs Clefable consecutive:4',
        'Conflicting values for move consecutive');
      expect(state.p1.pokemon.item).toEqual('metronome');
      expect(state.move.consecutive).toEqual(5);
      expect(() => parse(gens, 'Gengar @ Metronome:foo [Lick] vs Clefable'))
        .toThrow('Unsupported or invalid item');
    });

    test('pokemon', () => {
      expect(parse(gens, `p1Species:Mew ${PHRASE}`, 'Conflicting values').p1.pokemon.species.id)
        .toEqual('gengar');
      expect(() => parse(gens, `attackerLevel:foo ${FLAGS}`)).toThrow('Expected number for p1 level');
      expect(parse(gens, `${PHRASE} p2Level=90 p2Level:80`, 'Conflicting values').p2.pokemon.level)
        .toEqual(80);
      expect(() => parse(gens, `p1Happiness:foo  ${PHRASE}`)).toThrow('Expected number');
      expect(parse(
        gens, `p1Happiness:100 ${FLAGS} attackerHappiness=250`, 'Conflicting values'
      ).p1.pokemon.happiness).toEqual(250);
      expect(parse(gens, `+gravity ${PHRASE}`).field.pseudoWeather.gravity).toEqual({});
      parse(gens, `p1gender:X ${PHRASE}`, 'Invalid gender');
      expect(parse(gens, `${PHRASE} p1HPPercent:80 p1HP:70%`, 'Conflicting values').p1.pokemon.hp)
        .toEqual(209);

      parse(gens, `p1AddedType:Foo ${PHRASE}`, '\'Foo\' is not a valid addedType');
      expect(parse(gens, `p1AddedType:fire ${PHRASE}`).p1.pokemon.addedType).toEqual('Fire');

      expect(() => parse(gens, `${FLAGS} p2WeightKg:foo`))
        .toThrow('Expected number for p2 weight');
      expect(parse(gens, `${FLAGS} p2Weight:10`).p2.pokemon.weighthg).toEqual(100);
      expect(() => parse(gens, `attackerHP:foo ${PHRASE}`)).toThrow('Expected number');
      expect(parse(gens, `attackerHP:100 attackerHP:10 ${FLAGS}`, 'Conflicting values').p1.pokemon.hp)
        .toEqual(10);
      expect(() => parse(gens, `attackerToxicCounter:foo ${PHRASE}`)).toThrow('Expected number');
      expect(parse(
        gens, `p2ToxicCounter:3 p2Status=tox:5 ${FLAGS}`, 'Conflicting values'
      ).p2.pokemon.statusData?.toxicTurns).toEqual(5);

      expect(parse(gens, `${PHRASE} --noAttackerMoveLastTurn`).p1.pokemon.moveLastTurnResult)
        .toBe(false);
      expect(parse(gens, `${PHRASE} p2HurtThisTurn:false`).p2.pokemon.hurtThisTurn).toBe(false);
      expect(parse(gens, `${PHRASE} p1Switching:in`).p1.pokemon.switching).toBe('in');
      expect(parse(gens, `${PHRASE} switching:in`).p2.pokemon.switching).toBe('in');
      expect(() => parse(gens, `${PHRASE} p1Switching:foo`)).toThrow('Invalid boolean flag value');
      expect(parse(gens, `${PHRASE} +switching`).p2.pokemon.switching).toBe('out');
    });

    test('spread', () => {
      parse(gens, `${PHRASE} ivs=0/1/2/3`, 'Invalid number of IVs: 4');
      parse(gens, `${PHRASE} evs=0/1/2/3/4/5/6`, 'Invalid number of EVs: 7');
      expect(() => parse(gens, `${PHRASE} dvs=1/2/3/f/4`)).toThrow('Expected number');
    });
  });
});
