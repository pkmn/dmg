import { Result } from './result';
import { State} from './state';
import { Generation, Generations, GameType } from '@pkmn/data';
import { Handlers } from './mechanics';
import { parse } from './parse';

export function calculate(
  gen: Generation,
  attacker: State.Side | State.Pokemon,
  defender: State.Side | State.Pokemon,
  move: State.Move,
  field?: State.Field,
  gameType?: GameType): Result;
export function calculate(gens: Generations, args: string): Result;
export function calculate(state: State, handlers?: typeof Handlers): Result;
export function calculate(...args: any[]) {
  let state: State;
  let handlers = Handlers;
  if (args.length > 3) {
    state = new State(args[0], args[1], args[2], args[3], args[4], args[5]);
  } else if (typeof args[1] === 'string') {
    state = parse(args[0] as Generations, args[1]);
  } else {
    handlers = args[1] || handlers;
  }

  return null! as Result;
}