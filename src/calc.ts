import { Result } from './result';
import { State} from './state';
import { Generation, Generations, GameType } from '@pkmn/data';
import { Handlers, HANDLERS } from './mechanics';
import { parse } from './parse';

// Convenience overload for most programs
export function calculate(
  gen: Generation,
  attacker: State.Side | State.Pokemon,
  defender: State.Side | State.Pokemon,
  move: State.Move,
  field?: State.Field,
  gameType?: GameType): Result;
// Convenience overload for humans
export function calculate(gens: Generations, args: string): Result;
// Main API offered - state can be created and the mutated, handlers can be overriden
export function calculate(state: State, handlers?: Handlers): Result;
export function calculate(...args: any[]) {
  let state: State;
  let handlers = HANDLERS;
  if (args.length > 3) {
    state = new State(args[0], args[1], args[2], args[3], args[4], args[5]);
  } else if (typeof args[1] === 'string') {
    state = parse(args[0] as Generations, args[1]);
  } else {
    state = args[0];
    handlers = args[1] || handlers;
  }

  // Admittedly, somewhat odd to be creating a result and then letting it get mutated, but
  // this means we don't need to plumb state/handlers/context/relevancy in separately
  const result = new Result(state, handlers);
  // TODO mutate result

  return result;
}