import {PokemonSet} from '@pkmn/data';

import {ResultBreakdown} from './helper';

import {State} from '../index';
import {Dex, Battle, ID, PRNG, PRNGSeed} from '@pkmn/sim';

const N = 1000;
const SEED = [0x09917, 0x06924, 0x0e1c8, 0x06af0] as PRNGSeed;

const WEATHERS: {[id: string]: ID} = {
  sand: 'sandstorm' as ID,
  sun: 'sunnyday' as ID,
  rain: 'raindance' as ID,
  hail: 'hail' as ID,
  harshsunshine: 'desolateland' as ID,
  heavyrain: 'primordialsea' as ID,
  strongwinds: 'deltastream' as ID,
};

export function verify(state: State, breakdown: ResultBreakdown, num = N, seed = SEED) {
 const prng = new PRNG(seed);
 const gameType = state.gameType === 'singles' ? '' : state.gameType;
 const format = Dex.getFormat(`gen${state.gen.num}${gameType}customgame`);
  for (let i = 0; i < num; i++, prng.next()) {
    const battle = new Battle({format, formatid: format.id, seed: prng.seed});
    battle.trunc = Dex.trunc; // Custom Game formats don't use proper truncation...

    const p1 = setSide('p1', battle, state);
    const p2 = setSide('p2', battle, state);
    setField(battle, state.field)

    const hp = {p1: p1.pokemon.hp, p2: p2.pokemon.hp};
    battle.makeChoices(p1.choice, p2.choice);

    if (breakdown.recoil || breakdown.recovery) {
      const range = [
        p1.pokemon.hp + (breakdown.recoil?.[1] || 0) + (breakdown.recovery?.[0] || 0),
        p1.pokemon.hp + (breakdown.recoil?.[0] || 0) + (breakdown.recovery?.[1] || 0),
      ];
      if (p1.pokemon.hp < range[0] || p1.pokemon.hp > range[1]) {
        throw new Error(``);
      }
    }
    if (breakdown.range) {
      const damage = hp.p2 - p2.pokemon.hp;
      if (damage < breakdown.range[0] || damage > breakdown.range[1]) {
        throw new Error(``);
      }
    }
  }

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

  battle.setPlayer(player, {team: [set]});

  const side = battle.sides[player === 'p1' ? 0 : 1];
  for (const id in state[player].sideConditions) {
    const sc = state[player].sideConditions[id];
    side.addSideCondition(id, 'debug');
    if (sc.level && sc.level > 1) {
      (side.getSideCondition(id) as any).layers = sc.level;
    }
  }

  // TODO active
  // TODO team

   // TODO switching
  const pokemon = side.active[0];
  pokemon.weighthg = p.weighthg;
  // FIXME status, statusData
  for (const id in p.volatiles) {
    const v = p.volatiles[id];
    pokemon.addVolatile(id);
    if (v.level && v.level > 1) {
      (pokemon.getVolatile(id) as any).layers = v.level;
    }
  }
  pokemon.setType(p.types, true);
  if (p.addedType) pokemon.addType(p.addedType!);
  if (p.hp) pokemon.maxhp = p.hp;
  pokemon.hp = p.hp;
  pokemon.boostBy(p.boosts);
  if (p.moveLastTurnResult === false) pokemon.moveLastTurnResult = false;
  pokemon.hurtThisTurn = !!p.hurtThisTurn;

  // TODO crit etc
  return {choice: player === 'p2' ? 'move splash' : `move ${state.move.id}`, pokemon};
}

function setField(battle: Battle, field: State.Field) {
  if (field.weather) {
    battle.field.setWeather(WEATHERS[field.weather], 'debug');
  } else {
    battle.field.clearWeather();
  }

  if (field.terrain) {
    battle.field.setTerrain(`${field.terrain} Terrain`, 'debug');
  } else {
    battle.field.clearTerrain();
  }

  for (const id in field.pseudoWeather) {
    const pw = field.pseudoWeather[id];
    battle.field.addPseudoWeather(id, 'debug');
    if (pw.level && pw.level > 1) {
      (battle.field.getPseudoWeather(id) as any).layers = pw.level;
    }
  }
}