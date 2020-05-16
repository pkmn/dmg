import {Generation} from '@pkmn/data';
import {Side, Field} from '../interface';
import {trunc, computeModifiedWeight, computeModifiedSpeed} from '../calc';


const Common: {[id: string]: {
  basePowerCallback?: (gen: Generation, p1: Side, p2: Side, field: Field) => number;
}} = {
  weightlookup: {
    basePowerCallback(gen, p1) {
      const w = computeModifiedWeight(p1.pokemon);
      return w >= 2000 ? 120 : w >= 1000 ? 100 : w >= 500 ? 80 : w >= 250 ? 60 : w >= 100 ? 40 : 20;
    }
  },
  weightrelative: {
    basePowerCallback(gen, p1, p2) {
      const wr = trunc(computeModifiedWeight(p1.pokemon) / computeModifiedWeight(p2.pokemon));
      return wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
    }
  },
};

export const Moves: {[id: string]: {
  basePowerCallback?: (gen: Generation, p1: Side, p2: Side, field: Field) => number;
}} = {
  electroball: {
    basePowerCallback() {


    }
  },
  grassknot: Common.weightlookup,
  gyroball: {
    basePowerCallback() {

    }
  },
  heavyslam: Common.weightrelative,
  heatcrash: Common.weightrelative,
  lowkick: Common.weightlookup,
};