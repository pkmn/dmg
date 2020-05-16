import {Generation} from '@pkmn/data';
import {Side, Field} from '../interface';
import {Context} from '../../src/context';

const Common: {[id: string]: {
  onModifySpe?: (context: Context) => number;
}} = {
  evitem: {
    onModifySpe() {
      return 0x800;
    }
  },
};

export const Items: {[id: string]: {
  onModifySpe?: (gen: Generation, p1: Side, p2: Side, field: Field) => number;
}} = {
  choicescarf: {
    onModifySpe() {
       return 0x1800;
    }
  },
  ironball: {
    onModifySpe() {
      return 0x800;
    }
  },
  machobrace: Common.evitem,
  poweranklet: Common.evitem,
  powerband: Common.evitem,
  powerbelt: Common.evitem,
  powerbracer: Common.evitem,
  powerlens: Common.evitem,
  powerweight: Common.evitem,
  quickpowder: {
    onModifySpe(gen, p1) {
      return p1.pokemon.species.id === 'ditto' ? 0x2000 : 0x1000;
    }
  },
};