import { State } from './state';
import { Result } from './result';

export function simplify(result: Result) {
  // TODO copy (extend without, but recursive hmmm)
  // TODO simplify based on Relevancy
  return result.state as State;
}