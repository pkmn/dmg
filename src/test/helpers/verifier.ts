import {Generation, PokemonSet, Specie, ID} from '@pkmn/data';
import {Dex, Battle, PRNG, PRNGSeed} from '@pkmn/sim';

import {Conditions} from '../../conditions';
import {State} from '../../state';
import {Result} from '../../result';

const N = 1000;
const SEED = [0x09917, 0x06924, 0x0e1c8, 0x06af0] as PRNGSeed;

export function verify(state: State, result: Result, num = N, seed = SEED) {
  if (!isSupported(state)) return false;

  try {
    const prng = new PRNG(seed);
    const gameType = state.gameType === 'singles' ? '' : state.gameType;
    const format = Dex.formats.get(`gen${state.gen.num}${gameType}customgame`);
    for (let i = 0; i < num; i++, prng.next()) {
      const battle = new Battle({format, formatid: format.id, seed: prng.seed});
      battle.trunc = Dex.trunc.bind(Dex); // Custom Game formats don't use proper truncation...

      const players = {
        p1: setSide('p1', battle, state),
        p2: setSide('p2', battle, state),
      };
      setField(battle, state.field);
      battle.makeChoices(players.p1.choice, players.p2.choice);

      // TODO: need to figure out EoT final HP for p1 and p2 (including recovery/recoil/residual)
      const ranges = undefined! as {p1: [number, number]; p2: [number, number]};
      for (const p in ranges) {
        const player = p as 'p1' | 'p2';
        if (players[player].pokemon.hp < ranges[player][0] ||
            players[player].pokemon.hp > ranges[player][1]) {
          throw new Error(
            `Expected ${player}'s ${players[player].pokemon.species.name} HP to be within` +
            `[${ranges[player][0]},${ranges[player][1]}] but it was ${players[player].pokemon.hp}`
          );
        }
      }
    }

    return true;
  } catch (err: any) {
    throw new VerificationError(err);
  }
}

export class VerificationError extends Error {
  readonly cause: Error;

  constructor(cause: Error) {
    super(cause.message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function isSupported(state: State) {
  // Finding the correct PRNG seed to manipulate the RNG here is too complicated
  if (state.move.crit || state.move.magnitude) return false;
  // Setting up the field to ensure a move is a spread hit is too much work
  if (state.move.spread) return false;
  // Guaranteeing a certain number of hits for multihit moves is not tractable
  if (state.move.multihit || state.move.hits && state.move.hits > 1) return false;
  // Setting up the scenario where a certain mon is switching in or out is too difficult
  if (state.p1.pokemon.switching || state.p2.pokemon.switching) return false;
  // Non-trivial active/team scenarios are a headache to attempt to set up
  if (state.p1.active?.find(p => p === null || p.fainted)) return false;
  if (state.p2.active?.find(p => p === null || p.fainted)) return false;
  if (state.p1.team?.find(p => p.status || p.fainted)) return false;
  if (state.p2.team?.find(p => p.status || p.fainted)) return false;
  return true;
}

function setSide(player: 'p1' | 'p2', battle: Battle, state: State) {
  const p = state[player].pokemon;
  const set: PokemonSet = {
    name: p.species.name,
    species: p.species.name,
    level: p.level,
    item: p.item || '',
    ability: p.ability || '',
    gender: p.gender || '',
    happiness: p.happiness,
    nature: p.nature || '',
    evs: state.gen.stats.fill(p.evs || {}, 0),
    ivs: state.gen.stats.fill(p.ivs || {}, 31),
    moves: [state.move.id, 'splash'],
  };
  const team = [set];

  const t = state[player].team || [];
  if (state[player].active) {
    for (const active of state[player].active!) {
      if (!active) continue;
      if ('position' in active) {
        if (active.position === p.position) continue;
        const index = t.findIndex(pokemon => pokemon.position === active.position);
        if (index > -1) {
          const member = t[index];
          t.splice(index, 1);
          team.push(find(state.gen, member.species.baseStats.atk, active.ability));
        } else {
          team.push(find(state.gen, undefined, active.ability));
        }
      }
    }
  }
  if (t.length) {
    for (const member of t) {
      if ('position' in member && member.position === p.position) continue;
      team.push(find(state.gen, member.species.baseStats.atk));
    }
  }

  battle.setPlayer(player, {team});

  const side = battle.sides[player === 'p1' ? 0 : 1];
  for (let id in state[player].sideConditions) {
    id = Conditions.toPS(id);
    const sc = state[player].sideConditions[id];
    side.addSideCondition(id, 'debug');
    if (sc.level && sc.level > 1) {
      (side.getSideCondition(id) as any).layers = sc.level;
    }
  }

  const pokemon = side.active[0];
  pokemon.weighthg = p.weighthg;
  if (p.status) {
    pokemon.setStatus(pokemon.status);
    if (p.statusState?.toxicTurns) pokemon.statusState.stage = p.statusState.toxicTurns;
  }
  for (let id in p.volatiles) {
    id = Conditions.toPS(id);
    const v = p.volatiles[id];
    pokemon.addVolatile(id);
    if (v.level && v.level > 1) {
      (pokemon.getVolatile(id) as any).layers = v.level;
    }
  }
  pokemon.setType(p.types, true);
  if (p.addedType) pokemon.addType(p.addedType);
  pokemon.maxhp = p.maxhp;
  pokemon.hp = p.hp;
  pokemon.boostBy(p.boosts);
  if (p.moveLastTurnResult === false) pokemon.moveLastTurnResult = false;
  pokemon.hurtThisTurn = p.hurtThisTurn ? 1 : null;

  const choice = player === 'p1'
    ? `move ${state.move.id}${state.move.useZ ? ' zmove' : ''}`
    : 'move splash';

  return {pokemon, choice};
}

function setField(battle: Battle, field: State.Field) {
  if (field.weather) {
    battle.field.setWeather(Conditions.toPS(field.weather), 'debug');
  } else {
    battle.field.clearWeather();
  }

  if (field.terrain) {
    battle.field.setTerrain(Conditions.toPS(field.terrain), 'debug');
  } else {
    battle.field.clearTerrain();
  }

  for (let id in field.pseudoWeather) {
    id = Conditions.toPS(id);
    const pw = field.pseudoWeather[id];
    battle.field.addPseudoWeather(id, 'debug');
    if (pw.level && pw.level > 1) {
      (battle.field.getPseudoWeather(id) as any).layers = pw.level;
    }
  }
}

function find(gen: Generation, atk?: number, ability?: ID) {
  let species: Specie;
  for (species of gen.species) {
    if (!atk || species.baseStats.atk === atk) break;
  }
  return {species: species!.name, ability, moves: ['splash']} as unknown as PokemonSet;
}
