import {State} from '../state';
import {Context} from '../context';

export type SideID = 'p1' | 'p2';

export interface Handler {
  apply(side: SideID, state: State): void;

  basePowerCallback(side: 'p1', context: Context): number;
  damageCallback(side: 'p1', context: Context): number;

  onModifyBasePower(side: 'p1', context: Context): number | undefined;
  onModifyAtk(side: 'p1', context: Context): number | undefined;
  onModifySpA(side: 'p1', context: Context): number | undefined;
  onModifyDef(side: 'p2', context: Context): number | undefined;
  onModifySpD(side: 'p2', context: Context): number | undefined;
  onModifySpe(side: SideID, context: Context): number | undefined;
  onModifyWeight(side: SideID, context: Context): number | undefined;
}