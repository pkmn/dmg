import {Generations, GenerationNum} from '@pkmn/data';
import {Dex} from '@pkmn/dex';

import * as smogon from '@smogon/calc';
import * as pkmn from '../index';

import {ResultBreakdown} from './helper';

const gens = new Generations(Dex);

export function generate(s: string, pkg: 'dmg' | 'calc' = 'dmg') {
  const results: Array<[GenerationNum, string, ResultBreakdown]> = [];
  for (let g = 1; g <= 8; g++) {
    const gen = gens.get(g as GenerationNum);
    try {
      const state = pkmn.parse(gen, s, true);
      const [result, breakdown] = pkg === 'dmg' ? dmg(state) : calc(state);
      const encoded = pkmn.encode(result); // TODO canonicalize, but what about EVs?
      results.push([gen.num, encoded, breakdown]);
    } catch (err) { } // ignore, assume it mean this generaiton should be skipped
  }

  if (!results.length) throw new Error(`No successful calculations in any generation for '${s}'`);

  const from = results[0][0];
  const to = results[results.length - 1][0];

  let encoded = '';
  const last = from - 1;

  for (const [g, e, breakdown] of results) {
    if (g !== last + 1) {
      throw new Error(`Gap in generations with successful calculations: ${last} -> ${g}`);
    }
    // BUG: simply taking the longest isn't actually robust - two different gens may have different
    // fields which are relevant and this will miss out on that. However, its easier for the
    // programmer using the generator to just manually edit the missed test than to try to account
    // for that here, this heuristic works most of the time and we mainly are running through the
    // encoding to get prettified and ordered output.
    if (e.length > encoded.length) encoded = e;
  }

  const diff = '';


  // TODO find min and max gen for tests based on game objects (just catch exceptions?)
  // TODO canonicalize phrase and flags
  // TODO lint generated code so it can be dropped in

  let range = '';
  if (from !== 1) {
    range = `, ${from}, `;
    if (to !== 8) range += `${to}, `;
  } else if (to !== 8) {
    range = `, ${from}, ${to}, `;
  }

  return (
    `tests('TODO', ${range}({gen, calculate}) => {
  expect(calculate(${encoded})).toMatch(gen, ${diff});
}`
  );
}

function dmg(state: pkmn.State): [pkmn.Result, ResultBreakdown] {
  const result = pkmn.calculate(state);

  const breakdown: ResultBreakdown = {
    range: result.range,
    recoil: result.recoil,
    recovery: result.recovery,
  };

  const [pre, post] = result.desc.split(': ');
  breakdown.desc = pre;
  breakdown.result = `(${post.split('(')[1]}`;

  return [result, breakdown];
}

function calc(state: pkmn.State): [pkmn.Result, ResultBreakdown] {
  const result = null! as smogon.Result;

  const breakdown: ResultBreakdown = {range: result.range()};
  // BUG: ignoring recoil from @smogon/calc because it's a mess...
  const recovery = result.recovery();
  if (recovery.text) breakdown.recovery = recovery.recovery;

  const [pre, post] = result.desc().split(': ');
  breakdown.desc = pre;
  breakdown.result = `(${post.split('(')[1]}`;

  // TODO can't compute relevant, just
  return [result as unknown as pkmn.Result, breakdown]; // FIXME wtf
}
