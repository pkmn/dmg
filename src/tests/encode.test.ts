import {parse} from '../parse';
import {encodeURL, decodeURL, encode} from '../encode';
import {Generations} from '@pkmn/data';
import {Dex} from '@pkmn/sim';

const gens = new Generations(Dex as any);

const E = (s: string) => {
  const state = parse(gens, s);
  const encoded = encode(state);
  expect(parse(gens, encoded)).toEqual(state);
  return encoded;
};

describe.skip('encode', () => {
  test('encodeURL', () => {
    const raw = '{Gen 4} +1 252 SpA Gengar @ Choice Specs [Focus Blast] vs. 0 HP / 172+ SpD Blissey weather:Sand';
    const encoded = '(Gen_4)_+1_252_SpA_Gengar_*_Choice_Specs_(Focus_Blast)_vs_0_HP_$_172+_SpD_Blissey_weather=Sand';
    expect(encodeURL(raw)).toEqual(encoded);
    expect(decodeURL(encodeURL(raw))).toEqual(raw);
  });

  test('encode', () => {
    expect(E('gengar @ specs [tb] vs. 172+ spd blissey'))
      .toEqual('0 SpA Gengar @ Choice Specs [Thunderbolt] vs. 0 HP / 172+ SpD Blissey');
    // TODO Foul Play
    // TODO Body Press
    // TODO (needs final stats computation) Photon Geyser, Shell Side Arm
  });
});
