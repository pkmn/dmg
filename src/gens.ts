import { GenerationNum, Generations, Generation } from '@pkmn/data';

// const pokemon = (gen: Generation) => (
//   name: string
// ) => ;

export interface Scope {
  gen: Generation,
  // calculate: ReturnType<typeof calc>;
  // Pokemon: ReturnType<typeof pokemon>;
  // Move: ReturnType<typeof move>;
}

export function inGen(gen: Generation, fn: (scope: Scope) => void) {
  // fn({
  //   gen,
  //   calculate: calc(gen),
  //   Move: move(gen),
  //   Pokemon: pokemon(gen),
  // });
}

export function inGens(gens: Generations, fn: (scope: Scope) => void): void;
export function inGens(gens: Generations, from: GenerationNum, fn: (scope: Scope) => void): void;
export function inGens(
  gens: Generations, from: GenerationNum, to: GenerationNum, fn: (scope: Scope) => void): void;
export function inGens(
  gens: Generations,
  from: GenerationNum | ((scope: Scope) => void),
  to?: GenerationNum | ((scope: Scope) => void),
  fn?: (scope: Scope) => void
) {
  if (typeof from !== 'number') {
    fn = fn ?? from;
    from = 1;
    to = 8;
  }
  if (typeof to !== 'number') {
    fn = fn ?? to;
    to = 8;
  }
  for (let gen = from; gen <= to; gen++) {
    inGen(gens.get(gen), fn!);
  }
}
