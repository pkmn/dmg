import {Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {parse} from '../parse';
import {decodeURL, encode, encodeURL, getNature} from '../encode';
import {assertStateEqual} from './helpers/assert';

const gens = new Generations(Dex as any);

describe('encode', () => {
  test('encodeURL', () => {
    const raw = '{Gen 4} +1 252 SpA Gengar @ Choice Specs [Focus Blast] vs. ' +
      '0 HP / 172+ SpD 74% Blissey weather:Sand';
    const encoded = '(Gen_4)_+1_252_SpA_Gengar_*_Choice_Specs_(Focus_Blast)_vs._' +
      '0_HP_$_172+_SpD_74~_Blissey_weather=Sand';
    expect(encodeURL(raw)).toEqual(encoded);
    expect(decodeURL(encodeURL(raw))).toEqual('[Gen 4]' + raw.slice(7));
  });

  test('encode', () => {
    const enc = (s: string) => {
      const state = parse(gens, s);
      const encoded = encode(state);
      assertStateEqual(parse(gens, encoded), state);
      return encoded;
    };

    expect(enc('gengar @ specs [tbolt] vs. 172+ spd blissey')).toBe(
      '0 SpA Gengar @ Choice Specs [Thunderbolt] vs. 0 HP / 172+ SpD Natural Cure Blissey'
    );
    expect(enc('252 SpA Mewtwo [Psystrike] vs. 252+ Def Blissey defBoost:4')).toBe(
      '252 SpA Pressure Mewtwo [Psystrike] vs. +4 0 HP / 252+ Def Natural Cure Blissey'
    );
    expect(enc('(Gen 5) 0 Atk Umbreon atkBoosts:3 [Foul Play] vs. 252 Def Snorlax')).toBe(
      '(Gen 5) +3 Synchronize Umbreon [Foul Play] vs. 0 HP / 0 Atk / 252 Def Immunity Snorlax'
    );
    expect(enc('252+ Atk Steelix [Body Press] vs. 252 HP / 252+ Def Shuckle')).toBe(
      '252+ Atk / 0 Def Rock Head Steelix [Body Press] vs. 252 HP / 252+ Def Sturdy Shuckle'
    );
    expect(enc('Slowbro-Galar [Shell Side Arm] vs. 0 HP / 4 Def Rillaboom')).toBe(
      '0 SpA Quick Draw Slowbro-Galar [Shell Side Arm] vs. 0 HP / 4 Def / 0 SpD Overgrow Rillaboom'
    );
    expect(enc('(Gen 7) 252+ SpA Necrozma @ Firium Z [Photon Geyser] vs. Aegislash')).toBe(
      '(Gen 7) 252+ SpA Necrozma @ Firium Z [Photon Geyser] vs. 0 HP / 0 SpD Aegislash'
    );
    expect(enc(
      '(Gen 7 Doubles) Ultra Necrozma @ Ultranecrozium Z [Light That Burns The Sky] vs. Kyogre'
    )).toEqual(
      '(Gen 7 Doubles) 0 SpA Necrozma-Ultra @ Ultranecrozium Z [Light That Burns the Sky] vs. ' +
      '0 HP / 0 SpD Kyogre'
    );

    expect(enc('{7} gengar +Z [tbolt] vs. blissey +sandstorm +electricterrain')).toEqual(
      '(Gen 7) 0 SpA Gengar +Z [Thunderbolt] vs. ' +
      '0 HP / 0 SpD Natural Cure Blissey +Sand +ElectricTerrain'
    );
    expect(enc('{7} vaporeon accuracyBoost:3 [z-icebeam] +gravity vs. blissey +crit')).toEqual(
      '(Gen 7) AccuracyBoosts:3 0 SpA Water Absorb Vaporeon [Z-Ice Beam] +Crit vs. ' +
      '0 HP / 0 SpD Natural Cure Blissey +Gravity'
    );
    expect(enc(
      '(Gen 4 Doubles) Lvl 95 Dugtrio @ Metronome:7 [Magnitude 5] Happiness:200 Weight:20 vs. ' +
      ' 50% +Burned Snorlax @ Leftovers Gender:M +spread +LeechSeed +Reflect nature:Gentle'
    )).toEqual(
      '(Gen 4 Doubles) Lvl 95 0 Atk Sand Veil Dugtrio @ Metronome:7 Weight:20 Happiness:200 ' +
      '[Magnitude 5] +Spread vs. 0 HP / 0 Def Nature:Gentle 50.1% +Burn Immunity Snorlax ' +
      '@ Leftovers +Reflect +LeechSeed'
    );
    expect(enc('(gen 1) pidgey [tail whip] vs. squirtle')).toBe(
      '(Gen 1) Pidgey [Tail Whip] vs. Squirtle'
    );
    expect(
      enc('+Dynamax Venusaur maxHP:500 [Razor Leaf 90] echoedvoice:2 vs. Charizard spikes:3')
    ).toEqual(
      '0 Atk +Dynamax Overgrow Venusaur MaxHP:500 [Razor Leaf 90] vs. ' +
      '0 HP / 0 Def Blaze Charizard Spikes:3 EchoedVoice:2'
    );

    expect(enc('{7} Weavile [Pursuit] vs. Celebi switching:out')).toBe(
      '(Gen 7) 0 Atk Pressure Weavile [Pursuit] vs. 0 HP / 0 Def Celebi Switching:Out'
    );
    expect(enc(
      'Rivalry Haxorus @ Metronome Toxic:6 stockpile:2 [Stomping Tantrum] consecutive:4 vs. ' +
      'Celebi +NoMoveLastTurn +NoHurtThisTurn'
    )).toEqual(
      '0 Atk Toxic:6 Rivalry Haxorus @ Metronome:4 Gender:M Stockpile:2 [Stomping Tantrum] vs. ' +
      '0 HP / 0 Def Celebi +NoMoveLastTurn +NoHurtThisTurn'
    );
    expect(enc('{6} Kingler AddedType:Ghost [Hidden Power Ghost] vs. Haunter atkIV:0')).toEqual(
      '(Gen 6) 0 SpA Hyper Cutter Kingler AddedType:Ghost [Hidden Power Ghost] vs. ' +
      '0 HP / 0 SpD Haunter IVs:31/0/31/31/31/31'
    );
    expect(enc(
      '(Gen 5 Doubles) Umbreon allies=100,80,90,120,pressure [Beat Up] vs. Blissey +friendguard'
    )).toEqual(
      '(Gen 5 Doubles) 0 Atk Synchronize Umbreon Allies:Pressure,100,80,90,120 [Beat Up] vs. ' +
      '0 HP / 0 Def Natural Cure Blissey +FriendGuard'
    );
    expect(enc('(4) Breloom [Bullet Seed] hits:4 vs. Tyranitar IVs=30/31/30/31/30/31')).toEqual(
      '(Gen 4) 0 Atk Effect Spore Breloom [Bullet Seed] Hits:4 vs. ' +
      '0 HP / 0 Def Tyranitar IVs:30/31/30/31/30/31'
    );
    expect(enc('{2} Marowak [Hidden Power Bug] vs. Machamp atkDV:7 defDV:8')).toBe(
      '(Gen 2) Marowak [Hidden Power Bug] vs. Machamp DVs:11/7/8/15/15/15'
    );
  });

  test('getNature', () => {
    expect(() => getNature({plus: 'hp', minus: 'atk'}, undefined))
      .toThrow('Natures cannot modify HP');
    expect(getNature({plus: 'atk', minus: 'spa'}, undefined)).toBe('Adamant');
    expect(getNature({}, {})).toBeUndefined();
    expect(getNature({plus: 'atk'}, {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}))
      .toBeUndefined();
    expect(getNature({plus: 'spe'}, {hp: 0, atk: 0, def: 0, spd: 0, spe: 0})).toBe('Jolly');
    expect(getNature({minus: 'spe'}, undefined)).toBe('Sassy');
  });
});
