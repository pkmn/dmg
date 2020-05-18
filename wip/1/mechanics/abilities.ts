import {Generation} from '@pkmn/data';
import {Side, Field} from '../interface';

export const Abilities: {[id: string]: {
  onModifySpe?: (gen: Generation, p1: Side, p2: Side, field: Field) => number;
}} = {
  chlorophyll: {
    onModifySpe(gen, p1, p2, field) {
      return (field?.weather === 'sun' || field?.weather === 'harshsunshine') ? 0x2000 : 0x1000;
    }
  },
  sandrush: {
    onModifySpe(gen, p1, p2, field) {
      return field?.weather === 'sand' ? 0x2000 : 0x1000;
    }
  },
  slowstart: {
    onModifySpe(gen, p1) {
      return p1.pokemon.volatiles['slowstart'] ? 0x800 : 0x1000;
    }
  },
  slushrush: {
    onModifySpe(gen, p1, p2, field) {
      return field?.weather === 'hail' ? 0x2000 : 0x1000;
    }
  },
  surgesurfer: {
    onModifySpe(gen, p1, p2, field) {
      return field?.terrain === 'electric' ? 0x2000 : 0x1000;
    }
  },
  swiftswim: {
    onModifySpe(gen, p1, p2, field) {
      return (field?.weather === 'rain' || field?.weather === 'heavyrain') ? 0x2000 : 0x1000;
    }
  },
  quickfeet: {
    onModifySpe(gen, p1) {
      return p1.pokemon.status ? 0x1800 : 0x1000;
    }
  },
  unburden: {
    onModifySpe(gen, p1) {
      return p1.pokemon.volatiles['unburden'] ? 0x2000 : 0x1000;
    }
  },
};