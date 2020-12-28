import {Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

import {parse} from '../parse';
import {encodeURL, decodeURL, encode} from '../encode';
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

    expect(enc('gengar @ specs [tbolt] vs. 172+ spd blissey'))
      .toEqual('0 SpA Gengar @ Choice Specs [Thunderbolt] vs. 0 HP / 172+ SpD Blissey');
    // TODO Foul Play
    // TODO Body Press
    // TODO (needs final stats computation) Photon Geyser, Shell Side Arm
  });
});
