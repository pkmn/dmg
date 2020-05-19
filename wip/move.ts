import * as D from '@pkmn/data';
import * as I from './interface';

export interface MoveOptions {
  hits?: number;
  crit?: boolean,
  magnitude?: number;
  spreadHit?: boolean;
};

export class Move implements I.Move {
  readonly move: D.Move;

  readonly hits: number;
  readonly crit?: boolean;
  readonly magnitude?: number;
  readonly spreadHit?: boolean;

  constructor(
    move: D.Move,
    options: MoveOptions = {}) {
    this.move = move;
    this.hits = options.hits || 1;
    this.crit = options.crit ?? move.willCrit;
    this.magnitude = options.magnitude;
    this.spreadHit = options.spreadHit ?? true;
  }

  static getZMove(
    gen: D.Generation,
    pokemon: I.Pokemon,
    move: D.Move,
    options: MoveOptions = {}
  ) {
    if (gen.num < 7) throw new TypeError(`Z-Moves do not exist in gen ${gen.num}`);
    if (pokemon.item) {
      const item = gen.items.get(pokemon.item);
      const matching =
        item &&
        item.zMove &&
        item.itemUser?.includes(pokemon.species.name) &&
        item.zMoveFrom === move.name
      if (matching) return item!.zMove;
    }
    return Z_MOVES[move.type as Exclude<D.TypeName, '???'>];
  }

  static getMaxMove(
    gen: D.Generation,
    pokemon: I.Pokemon,
    move: D.Move,
    options: MoveOptions = {}
  ) {
    if (gen.num < 8) throw new TypeError(`Max Moves do not exist in gen ${gen.num}`);
    if (move.category === 'Status') return 'Max Guard';
    if (pokemon.species.isGigantamax) {
      const gmaxMove = gen.moves.get(pokemon.species.isGigantamax)!;
      if (move.type === gmaxMove.type) return pokemon.species.isGigantamax;
    }
    return MAX_MOVES[move.type as Exclude<D.TypeName, '???'>];
  }
}

const Z_MOVES: {
  [type in Exclude<D.TypeName, '???'>]: string;
} = {
  Bug: 'Savage Spin-Out',
  Dark: 'Black Hole Eclipse',
  Dragon: 'Devastating Drake',
  Electric: 'Gigavolt Havoc',
  Fairy: 'Twinkle Tackle',
  Fighting: 'All-Out Pummeling',
  Fire: 'Inferno Overdrive',
  Flying: 'Supersonic Skystrike',
  Ghost: 'Never-Ending Nightmare',
  Grass: 'Bloom Doom',
  Ground: 'Tectonic Rage',
  Ice: 'Subzero Slammer',
  Normal: 'Breakneck Blitz',
  Poison: 'Acid Downpour',
  Psychic: 'Shattered Psyche',
  Rock: 'Continental Crush',
  Steel: 'Corkscrew Crash',
  Water: 'Hydro Vortex',
};

const MAX_MOVES: {
  [type in Exclude<D.TypeName, '???'>]: string;
} = {
  Bug: 'Max Flutterby',
  Dark: 'Max Darkness',
  Dragon: 'Max Wyrmwind',
  Electric: 'Max Lightning',
  Fairy: 'Max Starfall',
  Fighting: 'Max Knuckle',
  Fire: 'Max Flare',
  Flying: 'Max Airstream',
  Ghost: 'Max Phantasm',
  Grass: 'Max Overgrowth',
  Ground: 'Max Quake',
  Ice: 'Max Hailstorm',
  Normal: 'Max Strike',
  Poison: 'Max Ooze',
  Psychic: 'Max Mindstorm',
  Rock: 'Max Rockfall',
  Steel: 'Max Steelspike',
  Water: 'Max Geyser',
};