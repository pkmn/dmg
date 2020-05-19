/* eslint consistent-return: "off " */

import {Handler} from '.';

export const Moves: {[id: string]: Partial<Handler>} = {
  acrobatics: {
    basePowerCallback({p1, move}) {
      return p1.pokemon.item ? move.basePower : move.basePower * 2;
    },
  },
  // acupressure: {
  //   onHit(target) {
  //     const stats = [];
  //     let stat;
  //     for (stat in target.boosts) {
  //       if (target.boosts[stat] < 6) {
  //         stats.push(stat);
  //       }
  //     }
  //     if (stats.length) {
  //       const randomStat = this.sample(stats);
  //       const boost = {};
  //       boost[randomStat] = 2;
  //       this.boost(boost);
  //     } else {
  //       return false;
  //     }
  //   },
  // },
  // afteryou: {
  //   onHit(target, source, move) {
  //     if (target.side.active.length < 2) { return false; } // fails in singles
  //     const action = this.queue.willMove(target);
  //     if (action) {
  //       this.queue.prioritizeAction(action, move);
  //       this.add('-activate', target, 'move: After You');
  //     } else {
  //       return false;
  //     }
  //   },
  // },
  // allyswitch: {
  //   onTryHit(source) {
  //     if (source.side.active.length === 1) { return false; }
  //     if (source.side.active.length === 3 && source.position === 1) { return false; }
  //   },
  //   onHit(pokemon) {
  //     const newPosition = (pokemon.position === 0 ? pokemon.side.active.length - 1 : 0);
  //     if (!pokemon.side.active[newPosition]) { return false; }
  //     if (pokemon.side.active[newPosition].fainted) { return false; }
  //     this.swapPosition(pokemon, newPosition, '[from] move: Ally Switch');
  //   },
  // },
  // anchorshot: {
  //   secondary: {
  //     onHit(target, source, move) {
  //       if (source.isActive) { target.addVolatile('trapped', source, move, 'trapper'); }
  //     },
  //   },
  // },
  // aquaring: {
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'Aqua Ring');
  //     },
  //     onResidual(pokemon) {
  //       this.heal(pokemon.baseMaxhp / 16);
  //     },
  //   },
  // },
  // aromatherapy: {
  //   onHit(pokemon, source, move) {
  //     this.add('-activate', source, 'move: Aromatherapy');
  //     let success = false;
  //     for (const ally of pokemon.side.pokemon) {
  //       if (ally !== source && ((ally.hasAbility('sapsipper')) ||
  //                   (ally.volatiles['substitute'] && !move.infiltrates))) {
  //         continue;
  //       }
  //       if (ally.cureStatus()) { success = true; }
  //     }
  //     return success;
  //   },
  // },
  // assist: {
  //   onHit(target) {
  //     const noAssist = [
  //       'assist', 'banefulbunker', 'beakblast', 'belch', 'bestow', 'bounce', 'celebrate', 'chatter', 'circlethrow', 'copycat', 'counter', 'covet', 'destinybond', 'detect', 'dig', 'dive', 'dragontail', 'endure', 'feint', 'fly', 'focuspunch', 'followme', 'helpinghand', 'holdhands', 'kingsshield', 'matblock', 'mefirst', 'metronome', 'mimic', 'mirrorcoat', 'mirrormove', 'naturepower', 'phantomforce', 'protect', 'ragepowder', 'roar', 'shadowforce', 'shelltrap', 'sketch', 'skydrop', 'sleeptalk', 'snatch', 'spikyshield', 'spotlight', 'struggle', 'switcheroo', 'thief', 'transform', 'trick', 'whirlwind',
  //     ];
  //     const moves = [];
  //     for (const pokemon of target.side.pokemon) {
  //       if (pokemon === target) { continue; }
  //       for (const moveSlot of pokemon.moveSlots) {
  //         const moveid = moveSlot.id;
  //         if (noAssist.includes(moveid)) { continue; }
  //         const move = this.dex.getMove(moveid);
  //         if (move.isZ || move.isMax) {
  //           continue;
  //         }
  //         moves.push(moveid);
  //       }
  //     }
  //     let randomMove = '';
  //     if (moves.length) { randomMove = this.sample(moves); }
  //     if (!randomMove) {
  //       return false;
  //     }
  //     this.useMove(randomMove, target);
  //   },
  // },
  // assurance: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (target.hurtThisTurn) {
  //       this.debug('Boosted for being damaged this turn');
  //       return move.basePower * 2;
  //     }
  //     return move.basePower;
  //   },
  // },
  // attract: {
  //   effect: {
  //     onStart(pokemon, source, effect) {
  //       if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
  //         this.debug('incompatible gender');
  //         return false;
  //       }
  //       if (!this.runEvent('Attract', pokemon, source)) {
  //         this.debug('Attract event failed');
  //         return false;
  //       }
  //       if (effect.id === 'cutecharm') {
  //         this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
  //       } else if (effect.id === 'destinyknot') {
  //         this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
  //       } else {
  //         this.add('-start', pokemon, 'Attract');
  //       }
  //     },
  //     onUpdate(pokemon) {
  //       if (this.effectData.source && !this.effectData.source.isActive && pokemon.volatiles['attract']) {
  //         this.debug('Removing Attract volatile on ' + pokemon);
  //         pokemon.removeVolatile('attract');
  //       }
  //     },
  //     onBeforeMove(pokemon, target, move) {
  //       this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectData.source);
  //       if (this.randomChance(1, 2)) {
  //         this.add('cant', pokemon, 'Attract');
  //         return false;
  //       }
  //     },
  //     onEnd(pokemon) {
  //       this.add('-end', pokemon, 'Attract', '[silent]');
  //     },
  //   },
  // },
  // aurawheel: {
  //   onTryMove(pokemon, target, move) {
  //     if (pokemon.species.baseSpecies === 'Morpeko') {
  //       return;
  //     }
  //     this.add('-fail', pokemon, 'move: Aura Wheel');
  //     this.hint("Only a Pokemon whose form is Morpeko or Morpeko-Hangry can use this move.");
  //     return null;
  //   },
  //   onModifyType(move, pokemon) {
  //     if (pokemon.species.name === 'Morpeko-Hangry') {
  //       move.type = 'Dark';
  //     } else {
  //       move.type = 'Electric';
  //     }
  //   },
  // },
  // auroraveil: {
  //   onTryHitSide() {
  //     if (!this.field.isWeather('hail')) { return false; }
  //   },
  //   effect: {
  //     durationCallback(target, source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasItem('lightclay')) {
  //         return 8;
  //       }
  //       return 5;
  //     },
  //     onAnyModifyDamage(damage, source, target, move) {
  //       if (target !== source && target.side === this.effectData.target) {
  //         if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
  //                       (target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
  //           return;
  //         }
  //         if (!target.getMoveHitData(move).crit && !move.infiltrates) {
  //           this.debug('Aurora Veil weaken');
  //           if (target.side.active.length > 1) { return this.chainModify([0xAAC, 0x1000]); }
  //           return this.chainModify(0.5);
  //         }
  //       }
  //     },
  //     onStart(side) {
  //       this.add('-sidestart', side, 'move: Aurora Veil');
  //     },
  //     onEnd(side) {
  //       this.add('-sideend', side, 'move: Aurora Veil');
  //     },
  //   },
  // },
  // autotomize: {
  //   onTryHit(pokemon) {
  //     const hasContrary = pokemon.hasAbility('contrary');
  //     if ((!hasContrary && pokemon.boosts.spe === 6) || (hasContrary && pokemon.boosts.spe === -6)) {
  //       return false;
  //     }
  //   },
  //   onHit(pokemon) {
  //     if (pokemon.weighthg > 1) {
  //       pokemon.weighthg = Math.max(1, pokemon.weighthg - 1000);
  //       this.add('-start', pokemon, 'Autotomize');
  //     }
  //   },
  // },
  // avalanche: {
  //   basePowerCallback(pokemon, target, move) {
  //     const damagedByTarget = pokemon.attackedBy.some(p => p.source === target && p.damage > 0 && p.thisTurn);
  //     if (damagedByTarget) {
  //       this.debug('Boosted for getting hit by ' + target);
  //       return move.basePower * 2;
  //     }
  //     return move.basePower;
  //   },
  // },
  // banefulbunker: {
  //   onTryHit(target, source, move) {
  //     return !!this.queue.willAct() && this.runEvent('StallMove', target);
  //   },
  //   onHit(pokemon) {
  //     pokemon.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'move: Protect');
  //     },
  //     onTryHit(target, source, move) {
  //       if (!move.flags['protect']) {
  //         if (move.isZ || move.isMax) { target.getMoveHitData(move).zBrokeProtect = true; }
  //         return;
  //       }
  //       if (move.smartTarget) {
  //         move.smartTarget = false;
  //       } else {
  //         this.add('-activate', target, 'move: Protect');
  //       }
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       if (move.flags['contact']) {
  //         source.trySetStatus('psn', target);
  //       }
  //       return this.NOT_FAIL;
  //     },
  //     onHit(target, source, move) {
  //       if (move.isZOrMaxPowered && move.flags['contact']) {
  //         source.trySetStatus('psn', target);
  //       }
  //     },
  //   },
  // },
  // beakblast: {
  //   beforeTurnCallback(pokemon) {
  //     pokemon.addVolatile('beakblast');
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singleturn', pokemon, 'move: Beak Blast');
  //     },
  //     onHit(pokemon, source, move) {
  //       if (move.flags['contact']) {
  //         source.trySetStatus('brn', pokemon);
  //       }
  //     },
  //   },
  //   onAfterMove(pokemon) {
  //     pokemon.removeVolatile('beakblast');
  //   },
  // },
  // beatup: {
  //   basePowerCallback(pokemon, target, move) {
  //     return 5 + Math.floor(move.allies.shift().species.baseStats.atk / 10);
  //   },
  //   onModifyMove(move, pokemon) {
  //     move.allies = pokemon.side.pokemon.filter(ally => ally === pokemon || !ally.fainted && !ally.status);
  //     move.multihit = move.allies.length;
  //   },
  // },
  // bellydrum: {
  //   onHit(target) {
  //     if (target.hp <= target.maxhp / 2 || target.boosts.atk >= 6 || target.maxhp === 1) { // Shedinja clause
  //       return false;
  //     }
  //     this.directDamage(target.maxhp / 2);
  //     this.boost({atk: 12}, target);
  //   },
  // },
  // bestow: {
  //   onHit(target, source, move) {
  //     if (target.item) {
  //       return false;
  //     }
  //     const myItem = source.takeItem();
  //     if (!myItem) { return false; }
  //     if (!this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem) || !target.setItem(myItem)) {
  //       source.item = myItem.id;
  //       return false;
  //     }
  //     this.add('-item', target, myItem.name, '[from] move: Bestow', '[of] ' + source);
  //   },
  // },
  // bide: {
  //   beforeMoveCallback(pokemon) {
  //     if (pokemon.volatiles['bide']) { return true; }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.effectData.totalDamage = 0;
  //       this.add('-start', pokemon, 'move: Bide');
  //     },
  //     onDamage(damage, target, source, move) {
  //       if (!move || move.effectType !== 'Move' || !source) { return; }
  //       this.effectData.totalDamage += damage;
  //       this.effectData.lastDamageSource = source;
  //     },
  //     onBeforeMove(pokemon, target, move) {
  //       if (this.effectData.duration === 1) {
  //         this.add('-end', pokemon, 'move: Bide');
  //         target = this.effectData.lastDamageSource;
  //         if (!target || !this.effectData.totalDamage) {
  //           this.attrLastMove('[still]');
  //           this.add('-fail', pokemon);
  //           return false;
  //         }
  //         if (!target.isActive) {
  //           const possibleTarget = this.getRandomTarget(pokemon, this.dex.getMove('pound'));
  //           if (!possibleTarget) {
  //             this.add('-miss', pokemon);
  //             return false;
  //           }
  //           target = possibleTarget;
  //         }
  //         const moveData = {
  //           id: 'bide',
  //           name: "Bide",
  //           accuracy: true,
  //           damage: this.effectData.totalDamage * 2,
  //           category: "Physical",
  //           priority: 1,
  //           flags: {contact: 1, protect: 1},
  //           effectType: 'Move',
  //           type: 'Normal',
  //         };
  //         this.tryMoveHit(target, pokemon, moveData);
  //         return false;
  //       }
  //       this.add('-activate', pokemon, 'move: Bide');
  //     },
  //     onMoveAborted(pokemon) {
  //       pokemon.removeVolatile('bide');
  //     },
  //     onEnd(pokemon) {
  //       this.add('-end', pokemon, 'move: Bide', '[silent]');
  //     },
  //   },
  // },
  // blizzard: {
  //   onModifyMove(move) {
  //     if (this.field.isWeather('hail')) { move.accuracy = true; }
  //   },
  // },
  // block: {
  //   onHit(target, source, move) {
  //     return target.addVolatile('trapped', source, move, 'trapper');
  //   },
  // },
  // boltbeak: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (target.newlySwitched || this.queue.willMove(target)) {
  //       this.debug('Bolt Beak damage boost');
  //       return move.basePower * 2;
  //     }
  //     this.debug('Bolt Beak NOT boosted');
  //     return move.basePower;
  //   },
  // },
  // bounce: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  //   effect: {
  //     onInvulnerability(target, source, move) {
  //       if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
  //         return;
  //       }
  //       return false;
  //     },
  //     onSourceBasePower(basePower, target, source, move) {
  //       if (move.id === 'gust' || move.id === 'twister') {
  //         return this.chainModify(2);
  //       }
  //     },
  //   },
  // },
  // brickbreak: {
  //   onTryHit(pokemon) {
  //     // will shatter screens through sub, before you hit
  //     if (pokemon.runImmunity('Fighting')) {
  //       pokemon.side.removeSideCondition('reflect');
  //       pokemon.side.removeSideCondition('lightscreen');
  //       pokemon.side.removeSideCondition('auroraveil');
  //     }
  //   },
  // },
  // brine: {
  //   onBasePower(basePower, pokemon, target) {
  //     if (target.hp * 2 <= target.maxhp) {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // bugbite: {
  //   onHit(target, source) {
  //     const item = target.getItem();
  //     if (source.hp && item.isBerry && target.takeItem(source)) {
  //       this.add('-enditem', target, item.name, '[from] stealeat', '[move] Bug Bite', '[of] ' + source);
  //       if (this.singleEvent('Eat', item, null, source, null, null)) {
  //         this.runEvent('EatItem', source, null, null, item);
  //         if (item.id === 'leppaberry') { target.staleness = 'external'; }
  //       }
  //       if (item.onEat) { source.ateBerry = true; }
  //     }
  //   },
  // },
  // burnup: {
  //   onTryMove(pokemon, target, move) {
  //     if (pokemon.hasType('Fire')) { return; }
  //     this.add('-fail', pokemon, 'move: Burn Up');
  //     this.attrLastMove('[still]');
  //     return null;
  //   },
  //   self: {
  //     onHit(pokemon) {
  //       pokemon.setType(pokemon.getTypes(true).map(type => type === "Fire" ? "???" : type));
  //       this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[from] move: Burn Up');
  //     },
  //   },
  // },
  // camouflage: {
  //   onHit(target) {
  //     let newType = 'Normal';
  //     if (this.field.isTerrain('electricterrain')) {
  //       newType = 'Electric';
  //     } else if (this.field.isTerrain('grassyterrain')) {
  //       newType = 'Grass';
  //     } else if (this.field.isTerrain('mistyterrain')) {
  //       newType = 'Fairy';
  //     } else if (this.field.isTerrain('psychicterrain')) {
  //       newType = 'Psychic';
  //     }
  //     if (target.getTypes().join() === newType || !target.setType(newType)) { return false; }
  //     this.add('-start', target, 'typechange', newType);
  //   },
  // },
  // captivate: {
  //   onTryImmunity(pokemon, source) {
  //     return (pokemon.gender === 'M' && source.gender === 'F') || (pokemon.gender === 'F' && source.gender === 'M');
  //   },
  // },
  // celebrate: {
  //   onTryHit(target, source) {
  //     this.add('-activate', target, 'move: Celebrate');
  //   },
  // },
  // charge: {
  //   onHit(pokemon) {
  //     this.add('-activate', pokemon, 'move: Charge');
  //   },
  //   effect: {
  //     onRestart(pokemon) {
  //       this.effectData.duration = 2;
  //     },
  //     onBasePower(basePower, attacker, defender, move) {
  //       if (move.type === 'Electric') {
  //         this.debug('charge boost');
  //         return this.chainModify(2);
  //       }
  //     },
  //   },
  // },
  // clangoroussoul: {
  //   onTryHit(pokemon, target, move) {
  //     if (pokemon.hp <= (pokemon.maxhp * 33 / 100) || pokemon.maxhp === 1) {
  //       return false;
  //     }
  //     if (!this.boost(move.boosts)) { return null; }
  //     delete move.boosts;
  //   },
  //   onHit(pokemon) {
  //     this.directDamage(pokemon.maxhp * 33 / 100);
  //   },
  // },
  // clearsmog: {
  //   onHit(target) {
  //     target.clearBoosts();
  //     this.add('-clearboost', target);
  //   },
  // },
  // conversion: {
  //   onHit(target) {
  //     const type = this.dex.getMove(target.moveSlots[0].id).type;
  //     if (target.hasType(type) || !target.setType(type)) { return false; }
  //     this.add('-start', target, 'typechange', type);
  //   },
  // },
  // conversion2: {
  //   onHit(target, source) {
  //     if (!target.lastMove) {
  //       return false;
  //     }
  //     const possibleTypes = [];
  //     const attackType = target.lastMove.type;
  //     for (const type in this.dex.data.TypeChart) {
  //       if (source.hasType(type)) { continue; }
  //       const typeCheck = this.dex.data.TypeChart[type].damageTaken[attackType];
  //       if (typeCheck === 2 || typeCheck === 3) {
  //         possibleTypes.push(type);
  //       }
  //     }
  //     if (!possibleTypes.length) {
  //       return false;
  //     }
  //     const randomType = this.sample(possibleTypes);
  //     if (!source.setType(randomType)) { return false; }
  //     this.add('-start', source, 'typechange', randomType);
  //   },
  // },
  // copycat: {
  //   onHit(pokemon) {
  //     const noCopycat = [
  //       'assist', 'banefulbunker', 'beakblast', 'belch', 'bestow', 'celebrate', 'chatter', 'circlethrow', 'copycat', 'counter', 'covet', 'craftyshield', 'destinybond', 'detect', 'dragontail', 'dynamaxcannon', 'endure', 'feint', 'focuspunch', 'followme', 'helpinghand', 'holdhands', 'kingsshield', 'matblock', 'mefirst', 'metronome', 'mimic', 'mirrorcoat', 'mirrormove', 'naturepower', 'obstruct', 'protect', 'ragepowder', 'roar', 'shelltrap', 'sketch', 'sleeptalk', 'snatch', 'spikyshield', 'spotlight', 'struggle', 'switcheroo', 'thief', 'transform', 'trick', 'whirlwind',
  //     ];
  //     let move = this.lastMove;
  //     if (!move) { return; }
  //     if (move.isZOrMaxPowered) { move = this.dex.getMove(move.baseMove); }
  //     if (noCopycat.includes(move.id) || move.isZ || move.isMax) {
  //       return false;
  //     }
  //     this.useMove(move.id, pokemon);
  //   },
  // },
  // coreenforcer: {
  //   onHit(target) {
  //     const noAbilityChange = [
  //       'battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'zenmode',
  //     ];
  //     if (noAbilityChange.includes(target.ability)) { return; }
  //     if (target.newlySwitched || this.queue.willMove(target)) { return; }
  //     target.addVolatile('gastroacid');
  //   },
  //   onAfterSubDamage(damage, target) {
  //     const noAbilityChange = [
  //       'battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'zenmode',
  //     ];
  //     if (noAbilityChange.includes(target.ability)) { return; }
  //     if (target.newlySwitched || this.queue.willMove(target)) { return; }
  //     target.addVolatile('gastroacid');
  //   },
  // },
  // counter: {
  //   damageCallback(pokemon) {
  //     if (!pokemon.volatiles['counter']) { return 0; }
  //     return pokemon.volatiles['counter'].damage || 1;
  //   },
  //   beforeTurnCallback(pokemon) {
  //     pokemon.addVolatile('counter');
  //   },
  //   onTryHit(target, source, move) {
  //     if (!source.volatiles['counter']) { return false; }
  //     if (source.volatiles['counter'].position === null) { return false; }
  //   },
  //   effect: {
  //     onStart(target, source, move) {
  //       this.effectData.position = null;
  //       this.effectData.damage = 0;
  //     },
  //     onRedirectTarget(target, source, source2) {
  //       if (source !== this.effectData.target) { return; }
  //       return source.side.foe.active[this.effectData.position];
  //     },
  //     onDamagingHit(damage, target, source, move) {
  //       if (source.side !== target.side && this.getCategory(move) === 'Physical') {
  //         this.effectData.position = source.position;
  //         this.effectData.damage = 2 * damage;
  //       }
  //     },
  //   },
  // },
  // courtchange: {
  //   onHitField(target, source) {
  //     const sourceSide = source.side;
  //     const targetSide = source.side.foe;
  //     const sideConditions = [
  //       'mist', 'lightscreen', 'reflect', 'spikes', 'safeguard', 'tailwind', 'toxicspikes', 'stealthrock', 'waterpledge', 'firepledge', 'grasspledge', 'stickyweb', 'auroraveil', 'gmaxsteelsurge', 'gmaxwildfire',
  //     ];
  //     let success = false;
  //     for (const id of sideConditions) {
  //       const effectName = this.dex.getEffect(id).name;
  //       if (sourceSide.sideConditions[id] && targetSide.sideConditions[id]) {
  //         [sourceSide.sideConditions[id], targetSide.sideConditions[id]] = [
  //           targetSide.sideConditions[id], sourceSide.sideConditions[id],
  //         ];
  //         this.add('-sideend', sourceSide, effectName, '[silent]');
  //         this.add('-sideend', targetSide, effectName, '[silent]');
  //       } else if (sourceSide.sideConditions[id] && !targetSide.sideConditions[id]) {
  //         targetSide.sideConditions[id] = sourceSide.sideConditions[id];
  //         delete sourceSide.sideConditions[id];
  //         this.add('-sideend', sourceSide, effectName, '[silent]');
  //       } else if (targetSide.sideConditions[id] && !sourceSide.sideConditions[id]) {
  //         sourceSide.sideConditions[id] = targetSide.sideConditions[id];
  //         delete targetSide.sideConditions[id];
  //         this.add('-sideend', targetSide, effectName, '[silent]');
  //       } else {
  //         continue;
  //       }
  //       let sourceLayers = sourceSide.sideConditions[id] ? (sourceSide.sideConditions[id].layers || 1) : 0;
  //       let targetLayers = targetSide.sideConditions[id] ? (targetSide.sideConditions[id].layers || 1) : 0;
  //       for (; sourceLayers > 0; sourceLayers--) {
  //         this.add('-sidestart', sourceSide, effectName, '[silent]');
  //       }
  //       for (; targetLayers > 0; targetLayers--) {
  //         this.add('-sidestart', targetSide, effectName, '[silent]');
  //       }
  //       success = true;
  //     }
  //     if (!success) { return false; }
  //     this.add('-activate', source, 'move: Court Change');
  //   },
  // },
  // covet: {
  //   onAfterHit(target, source, move) {
  //     if (source.item || source.volatiles['gem']) {
  //       return;
  //     }
  //     const yourItem = target.takeItem(source);
  //     if (!yourItem) {
  //       return;
  //     }
  //     if (!this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem) ||
  //               !source.setItem(yourItem)) {
  //       target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
  //       return;
  //     }
  //     this.add('-item', source, yourItem, '[from] move: Covet', '[of] ' + target);
  //   },
  // },
  // craftyshield: {
  //   onTryHitSide(side, source) {
  //     return !!this.queue.willAct();
  //   },
  //   effect: {
  //     onStart(target, source) {
  //       this.add('-singleturn', source, 'Crafty Shield');
  //     },
  //     onTryHit(target, source, move) {
  //       if (['self', 'all'].includes(move.target) || move.category !== 'Status') { return; }
  //       this.add('-activate', target, 'move: Crafty Shield');
  //       return this.NOT_FAIL;
  //     },
  //   },
  // },
  // crushgrip: {
  //   basePowerCallback(pokemon, target) {
  //     return Math.floor(Math.floor((120 * (100 * Math.floor(target.hp * 4096 / target.maxhp)) + 2048 - 1) / 4096) / 100) || 1;
  //   },
  // },
  // curse: {
  //   onModifyMove(move, source, target) {
  //     if (!source.hasType('Ghost')) {
  //       move.target = move.nonGhostTarget;
  //     }
  //   },
  //   onTryHit(target, source, move) {
  //     if (!source.hasType('Ghost')) {
  //       delete move.volatileStatus;
  //       delete move.onHit;
  //       move.self = {boosts: {spe: -1, atk: 1, def: 1}};
  //     } else if (move.volatileStatus && target.volatiles.curse) {
  //       return false;
  //     }
  //   },
  //   onHit(target, source) {
  //     this.directDamage(source.maxhp / 2, source, source);
  //   },
  //   effect: {
  //     onStart(pokemon, source) {
  //       this.add('-start', pokemon, 'Curse', '[of] ' + source);
  //     },
  //     onResidual(pokemon) {
  //       this.damage(pokemon.baseMaxhp / 4);
  //     },
  //   },
  // },
  // darkvoid: {
  //   onTryMove(pokemon, target, move) {
  //     if (pokemon.species.name === 'Darkrai' || move.hasBounced) {
  //       return;
  //     }
  //     this.add('-fail', pokemon, 'move: Dark Void');
  //     this.hint("Only a Pokemon whose form is Darkrai can use this move.");
  //     return null;
  //   },
  // },
  // defog: {
  //   onHit(target, source, move) {
  //     let success = false;
  //     if (!target.volatiles['substitute'] || move.infiltrates) { success = !!this.boost({evasion: -1}); }
  //     const removeTarget = [
  //       'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
  //     ];
  //     const removeAll = [
  //       'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
  //     ];
  //     for (const targetCondition of removeTarget) {
  //       if (target.side.removeSideCondition(targetCondition)) {
  //         if (!removeAll.includes(targetCondition)) { continue; }
  //         this.add('-sideend', target.side, this.dex.getEffect(targetCondition).name, '[from] move: Defog', '[of] ' + source);
  //         success = true;
  //       }
  //     }
  //     for (const sideCondition of removeAll) {
  //       if (source.side.removeSideCondition(sideCondition)) {
  //         this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
  //         success = true;
  //       }
  //     }
  //     this.field.clearTerrain();
  //     return success;
  //   },
  // },
  // destinybond: {
  //   onPrepareHit(pokemon) {
  //     return !pokemon.removeVolatile('destinybond');
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singlemove', pokemon, 'Destiny Bond');
  //     },
  //     onFaint(target, source, effect) {
  //       if (!source || !effect || target.side === source.side) { return; }
  //       if (effect.effectType === 'Move' && !effect.isFutureMove) {
  //         if (source.volatiles['dynamax']) {
  //           this.add('-hint', "Dynamaxed Pokémon are immune to Destiny Bond.");
  //           return;
  //         }
  //         this.add('-activate', target, 'move: Destiny Bond');
  //         source.faint();
  //       }
  //     },
  //     onBeforeMove(pokemon, target, move) {
  //       if (move.id === 'destinybond') { return; }
  //       this.debug('removing Destiny Bond before attack');
  //       pokemon.removeVolatile('destinybond');
  //     },
  //     onMoveAborted(pokemon, target, move) {
  //       pokemon.removeVolatile('destinybond');
  //     },
  //   },
  // },
  // detect: {
  //   onPrepareHit(pokemon) {
  //     return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
  //   },
  //   onHit(pokemon) {
  //     pokemon.addVolatile('stall');
  //   },
  // },
  // dig: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  //   effect: {
  //     onImmunity(type, pokemon) {
  //       if (type === 'sandstorm' || type === 'hail') { return false; }
  //     },
  //     onInvulnerability(target, source, move) {
  //       if (['earthquake', 'magnitude'].includes(move.id)) {
  //         return;
  //       }
  //       return false;
  //     },
  //     onSourceModifyDamage(damage, source, target, move) {
  //       if (move.id === 'earthquake' || move.id === 'magnitude') {
  //         return this.chainModify(2);
  //       }
  //     },
  //   },
  // },
  // disable: {
  //   onTryHit(target) {
  //     if (!target.lastMove || target.lastMove.isZ || target.lastMove.isMax) {
  //       return false;
  //     }
  //   },
  //   effect: {
  //     onStart(pokemon, source, effect) {
  //       // The target hasn't taken its turn, or Cursed Body activated and the move was not used through Dancer or Instruct
  //       if (this.queue.willMove(pokemon) ||
  //                   (pokemon === this.activePokemon && this.activeMove && !this.activeMove.isExternal)) {
  //         this.effectData.duration--;
  //       }
  //       if (!pokemon.lastMove) {
  //         this.debug('pokemon hasn\'t moved yet');
  //         return false;
  //       }
  //       for (const moveSlot of pokemon.moveSlots) {
  //         if (moveSlot.id === pokemon.lastMove.id) {
  //           if (!moveSlot.pp) {
  //             this.debug('Move out of PP');
  //             return false;
  //           } else {
  //             if (effect.id === 'cursedbody') {
  //               this.add('-start', pokemon, 'Disable', moveSlot.move, '[from] ability: Cursed Body', '[of] ' + source);
  //             } else {
  //               this.add('-start', pokemon, 'Disable', moveSlot.move);
  //             }
  //             this.effectData.move = pokemon.lastMove.id;
  //             return;
  //           }
  //         }
  //       }
  //       // this can happen if Disable works on a Z-move
  //       return false;
  //     },
  //     onEnd(pokemon) {
  //       this.add('-end', pokemon, 'Disable');
  //     },
  //     onBeforeMove(attacker, defender, move) {
  //       if (!move.isZ && move.id === this.effectData.move) {
  //         this.add('cant', attacker, 'Disable', move);
  //         return false;
  //       }
  //     },
  //     onDisableMove(pokemon) {
  //       for (const moveSlot of pokemon.moveSlots) {
  //         if (moveSlot.id === this.effectData.move) {
  //           pokemon.disableMove(moveSlot.id);
  //         }
  //       }
  //     },
  //   },
  // },
  // dive: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     if (attacker.hasAbility('gulpmissile') && attacker.species.name === 'Cramorant' && !attacker.transformed) {
  //       const forme = attacker.hp <= attacker.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
  //       attacker.formeChange(forme, move);
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  //   effect: {
  //     onImmunity(type, pokemon) {
  //       if (type === 'sandstorm' || type === 'hail') { return false; }
  //     },
  //     onInvulnerability(target, source, move) {
  //       if (['surf', 'whirlpool'].includes(move.id)) {
  //         return;
  //       }
  //       return false;
  //     },
  //     onSourceModifyDamage(damage, source, target, move) {
  //       if (move.id === 'surf' || move.id === 'whirlpool') {
  //         return this.chainModify(2);
  //       }
  //     },
  //   },
  // },
  // doomdesire: {
  //   onTry(source, target) {
  //     if (!target.side.addSlotCondition(target, 'futuremove')) { return false; }
  //     Object.assign(target.side.slotConditions[target.position]['futuremove'], {
  //       move: 'doomdesire',
  //       source: source,
  //       moveData: {
  //         id: 'doomdesire',
  //         name: "Doom Desire",
  //         accuracy: 100,
  //         basePower: 140,
  //         category: "Special",
  //         priority: 0,
  //         flags: {},
  //         effectType: 'Move',
  //         isFutureMove: true,
  //         type: 'Steel',
  //       },
  //     });
  //     this.add('-start', source, 'Doom Desire');
  //     return null;
  //   },
  // },
  // dreameater: {
  //   onTryImmunity(target) {
  //     return target.status === 'slp' || target.hasAbility('comatose');
  //   },
  // },
  // echoedvoice: {
  //   basePowerCallback() {
  //     if (this.field.pseudoWeather.echoedvoice) {
  //       return 40 * this.field.pseudoWeather.echoedvoice.multiplier;
  //     }
  //     return 40;
  //   },
  //   onTry() {
  //     this.field.addPseudoWeather('echoedvoice');
  //   },
  //   effect: {
  //     onStart() {
  //       this.effectData.multiplier = 1;
  //     },
  //     onRestart() {
  //       if (this.effectData.duration !== 2) {
  //         this.effectData.duration = 2;
  //         if (this.effectData.multiplier < 5) {
  //           this.effectData.multiplier++;
  //         }
  //       }
  //     },
  //   },
  // },
  // electricterrain: {
  //   effect: {
  //     durationCallback(source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasItem('terrainextender')) {
  //         return 8;
  //       }
  //       return 5;
  //     },
  //     onSetStatus(status, target, source, effect) {
  //       if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
  //         if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
  //           this.add('-activate', target, 'move: Electric Terrain');
  //         }
  //         return false;
  //       }
  //     },
  //     onTryAddVolatile(status, target) {
  //       if (!target.isGrounded() || target.isSemiInvulnerable()) { return; }
  //       if (status.id === 'yawn') {
  //         this.add('-activate', target, 'move: Electric Terrain');
  //         return null;
  //       }
  //     },
  //     onBasePower(basePower, attacker, defender, move) {
  //       if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
  //         this.debug('electric terrain boost');
  //         return this.chainModify([0x14CD, 0x1000]);
  //       }
  //     },
  //     onStart(battle, source, effect) {
  //       if ((effect === null || effect === void 0 ? void 0 : effect.effectType) === 'Ability') {
  //         this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect, '[of] ' + source);
  //       } else {
  //         this.add('-fieldstart', 'move: Electric Terrain');
  //       }
  //     },
  //     onEnd() {
  //       this.add('-fieldend', 'move: Electric Terrain');
  //     },
  //   },
  // },
  // electrify: {
  //   onTryHit(target) {
  //     if (!this.queue.willMove(target) && target.activeTurns) { return false; }
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'move: Electrify');
  //     },
  //     onModifyType(move) {
  //       if (move.id !== 'struggle') {
  //         this.debug('Electrify making move type electric');
  //         move.type = 'Electric';
  //       }
  //     },
  //   },
  // },
  // electroball: {
  //   basePowerCallback(pokemon, target) {
  //     let ratio = Math.floor(pokemon.getStat('spe') / target.getStat('spe'));
  //     if (!isFinite(ratio)) { ratio = 0; }
  //     const bp = [40, 60, 80, 120, 150][Math.min(ratio, 4)];
  //     this.debug(`${bp} bp`);
  //     return bp;
  //   },
  // },
  // embargo: {
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'Embargo');
  //     },
  //     onEnd(pokemon) {
  //       this.add('-end', pokemon, 'Embargo');
  //     },
  //   },
  // },
  // encore: {
  //   effect: {
  //     onStart(target) {
  //       const noEncore = [
  //         'assist', 'copycat', 'encore', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'sketch', 'sleeptalk', 'struggle', 'transform',
  //       ];
  //       let move = target.lastMove;
  //       if (!move || target.volatiles['dynamax']) { return false; }
  //       if (move.isZOrMaxPowered) { move = this.dex.getMove(move.baseMove); }
  //       const moveIndex = target.moves.indexOf(move.id);
  //       if (move.isZ || noEncore.includes(move.id) || !target.moveSlots[moveIndex] || target.moveSlots[moveIndex].pp <= 0) {
  //         // it failed
  //         return false;
  //       }
  //       this.effectData.move = move.id;
  //       this.add('-start', target, 'Encore');
  //       if (!this.queue.willMove(target)) {
  //         this.effectData.duration++;
  //       }
  //     },
  //     onOverrideAction(pokemon, target, move) {
  //       if (move.id !== this.effectData.move) { return this.effectData.move; }
  //     },
  //     onResidual(target) {
  //       if (target.moves.includes(this.effectData.move) &&
  //                   target.moveSlots[target.moves.indexOf(this.effectData.move)].pp <= 0) {
  //         // early termination if you run out of PP
  //         target.removeVolatile('encore');
  //       }
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'Encore');
  //     },
  //     onDisableMove(pokemon) {
  //       if (!this.effectData.move || !pokemon.hasMove(this.effectData.move)) {
  //         return;
  //       }
  //       for (const moveSlot of pokemon.moveSlots) {
  //         if (moveSlot.id !== this.effectData.move) {
  //           pokemon.disableMove(moveSlot.id);
  //         }
  //       }
  //     },
  //   },
  // },
  // endeavor: {
  //   damageCallback(pokemon, target) {
  //     return target.getUndynamaxedHP() - pokemon.hp;
  //   },
  //   onTryImmunity(target, pokemon) {
  //     return pokemon.hp < target.hp;
  //   },
  // },
  // endure: {
  //   onTryHit(pokemon) {
  //     return this.queue.willAct() && this.runEvent('StallMove', pokemon);
  //   },
  //   onHit(pokemon) {
  //     pokemon.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'move: Endure');
  //     },
  //     onDamage(damage, target, source, effect) {
  //       if ((effect === null || effect === void 0 ? void 0 : effect.effectType) === 'Move' && damage >= target.hp) {
  //         this.add('-activate', target, 'move: Endure');
  //         return target.hp - 1;
  //       }
  //     },
  //   },
  // },
  // entrainment: {
  //   onTryHit(target, source) {
  //     if (target === source || target.volatiles['dynamax']) { return false; }
  //     const bannedTargetAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'truant',
  //     ];
  //     const bannedSourceAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'neutralizinggas', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'zenmode',
  //     ];
  //     if (bannedTargetAbilities.includes(target.ability) || bannedSourceAbilities.includes(source.ability) ||
  //               target.ability === source.ability) {
  //       return false;
  //     }
  //   },
  //   onHit(target, source) {
  //     const oldAbility = target.setAbility(source.ability);
  //     if (oldAbility) {
  //       this.add('-ability', target, target.getAbility().name, '[from] move: Entrainment');
  //       return;
  //     }
  //     return false;
  //   },
  // },
  // eruption: {
  //   basePowerCallback(pokemon, target, move) {
  //     return move.basePower * pokemon.hp / pokemon.maxhp;
  //   },
  // },
  // facade: {
  //   onBasePower(basePower, pokemon) {
  //     if (pokemon.status && pokemon.status !== 'slp') {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // fairylock: {
  //   effect: {
  //     onStart(target) {
  //       this.add('-fieldactivate', 'move: Fairy Lock');
  //     },
  //     onTrapPokemon(pokemon) {
  //       pokemon.tryTrap();
  //     },
  //   },
  // },
  // fakeout: {
  //   onTry(pokemon, target) {
  //     if (pokemon.activeMoveActions > 1) {
  //       this.attrLastMove('[still]');
  //       this.add('-fail', pokemon);
  //       this.hint("Fake Out only works on your first turn out.");
  //       return null;
  //     }
  //   },
  // },
  // fellstinger: {
  //   onAfterMoveSecondarySelf(pokemon, target, move) {
  //     if (!target || target.fainted || target.hp <= 0) { this.boost({atk: 3}, pokemon, pokemon, move); }
  //   },
  // },
  // finalgambit: {
  //   damageCallback(pokemon) {
  //     const damage = pokemon.hp;
  //     pokemon.faint();
  //     return damage;
  //   },
  // },
  // firepledge: {
  //   basePowerCallback(target, source, move) {
  //     if (['grasspledge', 'waterpledge'].includes(move.sourceEffect)) {
  //       this.add('-combine');
  //       return 150;
  //     }
  //     return 80;
  //   },
  //   onPrepareHit(target, source, move) {
  //     for (const action of this.queue) {
  //       if (
  //       // @ts-ignore
  //         !action.move || !action.pokemon || !action.pokemon.isActive ||
  //                   // @ts-ignore
  //                   action.pokemon.fainted || action.maxMove || action.zmove) {
  //         continue;
  //       }
  //       // @ts-ignore
  //       if (action.pokemon.side === source.side && ['grasspledge', 'waterpledge'].includes(action.move.id)) {
  //         // @ts-ignore
  //         this.queue.prioritizeAction(action, move);
  //         this.add('-waiting', source, action.pokemon);
  //         return null;
  //       }
  //     }
  //   },
  //   onModifyMove(move) {
  //     if (move.sourceEffect === 'waterpledge') {
  //       move.type = 'Water';
  //       move.forceSTAB = true;
  //       move.self = {sideCondition: 'waterpledge'};
  //     }
  //     if (move.sourceEffect === 'grasspledge') {
  //       move.type = 'Fire';
  //       move.forceSTAB = true;
  //       move.sideCondition = 'firepledge';
  //     }
  //   },
  //   effect: {
  //     onStart(targetSide) {
  //       this.add('-sidestart', targetSide, 'Fire Pledge');
  //     },
  //     onEnd(targetSide) {
  //       for (const pokemon of targetSide.active) {
  //         if (pokemon && !pokemon.hasType('Fire')) {
  //           this.damage(pokemon.baseMaxhp / 8, pokemon);
  //         }
  //       }
  //       this.add('-sideend', targetSide, 'Fire Pledge');
  //     },
  //     onResidual(side) {
  //       for (const pokemon of side.active) {
  //         if (pokemon && !pokemon.hasType('Fire')) {
  //           this.damage(pokemon.baseMaxhp / 8, pokemon);
  //         }
  //       }
  //     },
  //   },
  // },
  // firstimpression: {
  //   onTry(pokemon, target) {
  //     if (pokemon.activeMoveActions > 1) {
  //       this.add('-fail', pokemon);
  //       this.attrLastMove('[still]');
  //       this.hint("First Impression only works on your first turn out.");
  //       return null;
  //     }
  //   },
  // },
  // fishiousrend: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (target.newlySwitched || this.queue.willMove(target)) {
  //       this.debug('Fishious Rend damage boost');
  //       return move.basePower * 2;
  //     }
  //     this.debug('Fishious Rend NOT boosted');
  //     return move.basePower;
  //   },
  // },
  // flail: {
  //   basePowerCallback(pokemon, target) {
  //     const ratio = pokemon.hp * 48 / pokemon.maxhp;
  //     if (ratio < 2) {
  //       return 200;
  //     }
  //     if (ratio < 5) {
  //       return 150;
  //     }
  //     if (ratio < 10) {
  //       return 100;
  //     }
  //     if (ratio < 17) {
  //       return 80;
  //     }
  //     if (ratio < 33) {
  //       return 40;
  //     }
  //     return 20;
  //   },
  // },
  // flameburst: {
  //   onHit(target, source, move) {
  //     if (target.side.active.length === 1) {
  //       return;
  //     }
  //     for (const ally of target.side.active) {
  //       if (ally && this.isAdjacent(target, ally)) {
  //         this.damage(ally.baseMaxhp / 16, ally, source, this.dex.getEffect('Flame Burst'));
  //       }
  //     }
  //   },
  //   onAfterSubDamage(damage, target, source, move) {
  //     if (target.side.active.length === 1) {
  //       return;
  //     }
  //     for (const ally of target.side.active) {
  //       if (ally && this.isAdjacent(target, ally)) {
  //         this.damage(ally.baseMaxhp / 16, ally, source, this.dex.getEffect('Flame Burst'));
  //       }
  //     }
  //   },
  // },
  // fling: {
  //   onPrepareHit(target, source, move) {
  //     if (source.ignoringItem()) { return false; }
  //     const item = source.getItem();
  //     if (!this.singleEvent('TakeItem', item, source.itemData, source, source, move, item)) { return false; }
  //     if (!item.fling) { return false; }
  //     move.basePower = item.fling.basePower;
  //     if (item.isBerry) {
  //       move.onHit = function (foe) {
  //         if (this.singleEvent('Eat', item, null, foe, null, null)) {
  //           this.runEvent('EatItem', foe, null, null, item);
  //           if (item.id === 'leppaberry') { foe.staleness = 'external'; }
  //         }
  //         if (item.onEat) { foe.ateBerry = true; }
  //       };
  //     } else if (item.fling.effect) {
  //       move.onHit = item.fling.effect;
  //     } else {
  //       if (!move.secondaries) { move.secondaries = []; }
  //       if (item.fling.status) {
  //         move.secondaries.push({status: item.fling.status});
  //       } else if (item.fling.volatileStatus) {
  //         move.secondaries.push({volatileStatus: item.fling.volatileStatus});
  //       }
  //     }
  //     source.setItem('');
  //     source.lastItem = item.id;
  //     source.usedItemThisTurn = true;
  //     this.add("-enditem", source, item.name, '[from] move: Fling');
  //     this.runEvent('AfterUseItem', source, null, null, item);
  //   },
  // },
  // floralhealing: {
  //   onHit(target, source) {
  //     let success = false;
  //     if (this.field.isTerrain('grassyterrain')) {
  //       success = !!this.heal(this.modify(target.baseMaxhp, 0.667)); // TODO: find out the real value
  //     } else {
  //       success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
  //     }
  //     if (success && target.side.id !== source.side.id) {
  //       target.staleness = 'external';
  //     }
  //     return success;
  //   },
  // },
  // flowershield: {
  //   onHitField(t, source, move) {
  //     const targets = [];
  //     for (const pokemon of this.getAllActive()) {
  //       if (pokemon.hasType('Grass')) {
  //         // This move affects every Grass-type Pokemon in play.
  //         targets.push(pokemon);
  //       }
  //     }
  //     let success = false;
  //     for (const target of targets) {
  //       success = this.boost({def: 1}, target, source, move) || success;
  //     }
  //     return success;
  //   },
  // },
  // fly: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  //   effect: {
  //     onInvulnerability(target, source, move) {
  //       if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
  //         return;
  //       }
  //       return false;
  //     },
  //     onSourceModifyDamage(damage, source, target, move) {
  //       if (move.id === 'gust' || move.id === 'twister') {
  //         return this.chainModify(2);
  //       }
  //     },
  //   },
  // },
  // flyingpress: {
  //   onEffectiveness(typeMod, target, type, move) {
  //     return typeMod + this.dex.getEffectiveness('Flying', type);
  //   },
  // },
  // focusenergy: {
  //   effect: {
  //     onStart(target, source, effect) {
  //       if ((effect === null || effect === void 0 ? void 0 : effect.id) === 'zpower') {
  //         this.add('-start', target, 'move: Focus Energy', '[zeffect]');
  //       } else if (effect && (['imposter', 'psychup', 'transform'].includes(effect.id))) {
  //         this.add('-start', target, 'move: Focus Energy', '[silent]');
  //       } else {
  //         this.add('-start', target, 'move: Focus Energy');
  //       }
  //     },
  //     onModifyCritRatio(critRatio) {
  //       return critRatio + 2;
  //     },
  //   },
  // },
  // focuspunch: {
  //   beforeTurnCallback(pokemon) {
  //     pokemon.addVolatile('focuspunch');
  //   },
  //   beforeMoveCallback(pokemon) {
  //     if (pokemon.volatiles['focuspunch'] && pokemon.volatiles['focuspunch'].lostFocus) {
  //       this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
  //       return true;
  //     }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singleturn', pokemon, 'move: Focus Punch');
  //     },
  //     onHit(pokemon, source, move) {
  //       if (move.category !== 'Status') {
  //         pokemon.volatiles['focuspunch'].lostFocus = true;
  //       }
  //     },
  //   },
  // },
  // followme: {
  //   onTryHit(target) {
  //     if (target.side.active.length < 2) { return false; }
  //   },
  //   effect: {
  //     onStart(target, source, effect) {
  //       if ((effect === null || effect === void 0 ? void 0 : effect.id) === 'zpower') {
  //         this.add('-singleturn', target, 'move: Follow Me', '[zeffect]');
  //       } else {
  //         this.add('-singleturn', target, 'move: Follow Me');
  //       }
  //     },
  //     onFoeRedirectTarget(target, source, source2, move) {
  //       if (!this.effectData.target.isSkyDropped() && this.validTarget(this.effectData.target, source, move.target)) {
  //         if (move.smartTarget) { move.smartTarget = false; }
  //         this.debug("Follow Me redirected target of move");
  //         return this.effectData.target;
  //       }
  //     },
  //   },
  // },
  // foresight: {
  //   onTryHit(target) {
  //     if (target.volatiles['miracleeye']) { return false; }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'Foresight');
  //     },
  //     onNegateImmunity(pokemon, type) {
  //       if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) { return false; }
  //     },
  //     onModifyBoost(boosts) {
  //       if (boosts.evasion && boosts.evasion > 0) {
  //         boosts.evasion = 0;
  //       }
  //     },
  //   },
  // },
  // forestscurse: {
  //   onHit(target) {
  //     if (target.hasType('Grass')) { return false; }
  //     if (!target.addType('Grass')) { return false; }
  //     this.add('-start', target, 'typeadd', 'Grass', '[from] move: Forest\'s Curse');
  //   },
  // },
  // freezedry: {
  //   onEffectiveness(typeMod, target, type) {
  //     if (type === 'Water') { return 1; }
  //   },
  // },
  // freezeshock: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  // },
  // freezyfrost: {
  //   onHit() {
  //     this.add('-clearallboost');
  //     for (const pokemon of this.getAllActive()) {
  //       pokemon.clearBoosts();
  //     }
  //   },
  // },
  // frustration: {
  //   basePowerCallback(pokemon) {
  //     return Math.floor(((255 - pokemon.happiness) * 10) / 25) || 1;
  //   },
  // },
  // furycutter: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (!pokemon.volatiles.furycutter || move.hit === 1) {
  //       pokemon.addVolatile('furycutter');
  //     }
  //     return this.dex.clampIntRange(move.basePower * pokemon.volatiles.furycutter.multiplier, 1, 160);
  //   },
  //   effect: {
  //     onStart() {
  //       this.effectData.multiplier = 1;
  //     },
  //     onRestart() {
  //       if (this.effectData.multiplier < 4) {
  //         this.effectData.multiplier <<= 1;
  //       }
  //       this.effectData.duration = 2;
  //     },
  //   },
  // },
  // fusionbolt: {
  //   onBasePower(basePower, pokemon) {
  //     if (this.lastMoveThisTurn && this.lastMoveThisTurn.id === 'fusionflare') {
  //       this.debug('double power');
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // fusionflare: {
  //   onBasePower(basePower, pokemon) {
  //     if (this.lastMoveThisTurn && this.lastMoveThisTurn.id === 'fusionbolt') {
  //       this.debug('double power');
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // futuresight: {
  //   onTry(source, target) {
  //     if (!target.side.addSlotCondition(target, 'futuremove')) { return false; }
  //     Object.assign(target.side.slotConditions[target.position]['futuremove'], {
  //       duration: 3,
  //       move: 'futuresight',
  //       source: source,
  //       moveData: {
  //         id: 'futuresight',
  //         name: "Future Sight",
  //         accuracy: 100,
  //         basePower: 120,
  //         category: "Special",
  //         priority: 0,
  //         flags: {},
  //         ignoreImmunity: false,
  //         effectType: 'Move',
  //         isFutureMove: true,
  //         type: 'Psychic',
  //       },
  //     });
  //     this.add('-start', source, 'move: Future Sight');
  //     return null;
  //   },
  // },
  // gastroacid: {
  //   onTryHit(pokemon) {
  //     const bannedAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'zenmode',
  //     ];
  //     if (bannedAbilities.includes(pokemon.ability)) {
  //       return false;
  //     }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-endability', pokemon);
  //       this.singleEvent('End', pokemon.getAbility(), pokemon.abilityData, pokemon, pokemon, 'gastroacid');
  //     },
  //   },
  // },
  // gearup: {
  //   onHitSide(side, source, move) {
  //     const targets = [];
  //     for (const pokemon of side.active) {
  //       if (pokemon.hasAbility(['plus', 'minus'])) {
  //         targets.push(pokemon);
  //       }
  //     }
  //     if (!targets.length) { return false; }
  //     let didSomething = false;
  //     for (const target of targets) {
  //       didSomething = this.boost({atk: 1, spa: 1}, target, source, move, false, true) || didSomething;
  //     }
  //     return didSomething;
  //   },
  // },
  // genesissupernova: {
  //   secondary: {
  //     self: {
  //       onHit() {
  //         this.field.setTerrain('psychicterrain');
  //       },
  //     },
  //   },
  // },
  // geomancy: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  // },
  // gmaxbefuddle: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         const result = this.random(3);
  //         if (result === 0) {
  //           pokemon.trySetStatus('slp', source);
  //         } else if (result === 1) {
  //           pokemon.trySetStatus('par', source);
  //         } else {
  //           pokemon.trySetStatus('psn', source);
  //         }
  //       }
  //     },
  //   },
  // },
  // gmaxcentiferno: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         pokemon.addVolatile('partiallytrapped', source, this.dex.getActiveMove('G-Max Centiferno'), 'trapper');
  //       }
  //     },
  //   },
  // },
  // gmaxchistrike: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.active) {
  //         pokemon.addVolatile('gmaxchistrike');
  //       }
  //     },
  //   },
  //   effect: {
  //     onStart(target, source, effect) {
  //       this.effectData.layers = 1;
  //       if (!['imposter', 'psychup', 'transform'].includes(effect === null || effect === void 0 ? void 0 : effect.id)) {
  //         this.add('-start', target, 'move: G-Max Chi Strike');
  //       }
  //     },
  //     onRestart(target, source, effect) {
  //       if (this.effectData.layers >= 3) { return false; }
  //       this.effectData.layers++;
  //       if (!['imposter', 'psychup', 'transform'].includes(effect === null || effect === void 0 ? void 0 : effect.id)) {
  //         this.add('-start', target, 'move: G-Max Chi Strike');
  //       }
  //     },
  //     onModifyCritRatio(critRatio) {
  //       return critRatio + this.effectData.layers;
  //     },
  //   },
  // },
  // gmaxcuddle: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         pokemon.addVolatile('attract');
  //       }
  //     },
  //   },
  // },
  // gmaxdepletion: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         const move = pokemon.lastMove;
  //         if (move && !move.isZ && !move.isMax) {
  //           const ppDeducted = pokemon.deductPP(move.id, 4);
  //           if (ppDeducted) {
  //             this.add("-activate", pokemon, 'move: Max Depletion', move.name, ppDeducted);
  //             return;
  //           }
  //         }
  //         return false;
  //       }
  //     },
  //   },
  // },
  // gmaxfinale: {
  //   self: {
  //     onHit(target, source, move) {
  //       for (const pokemon of source.side.active) {
  //         this.heal(pokemon.maxhp / 6, pokemon, source, move);
  //       }
  //     },
  //   },
  // },
  // gmaxfoamburst: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         this.boost({spe: -2}, pokemon);
  //       }
  //     },
  //   },
  // },
  // gmaxgoldrush: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         pokemon.addVolatile('confusion');
  //       }
  //     },
  //   },
  // },
  // gmaxmalodor: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         pokemon.trySetStatus('psn', source);
  //       }
  //     },
  //   },
  // },
  // gmaxmeltdown: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         if (!pokemon.volatiles['dynamax']) { pokemon.addVolatile('torment'); }
  //       }
  //     },
  //   },
  // },
  // gmaxreplenish: {
  //   self: {
  //     onHit(source) {
  //       if (this.random(2) === 0) { return; }
  //       for (const pokemon of source.side.active) {
  //         if (!pokemon.item && pokemon.lastItem && this.dex.getItem(pokemon.lastItem).isBerry) {
  //           const item = pokemon.lastItem;
  //           pokemon.lastItem = '';
  //           this.add('-item', pokemon, this.dex.getItem(item), '[from] move: G-Max Replenish');
  //           pokemon.setItem(item);
  //         }
  //       }
  //     },
  //   },
  // },
  // gmaxsandblast: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         pokemon.addVolatile('partiallytrapped', source, this.dex.getActiveMove('G-Max Sandblast'), 'trapper');
  //       }
  //     },
  //   },
  // },
  // gmaxsmite: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         pokemon.addVolatile('confusion', source);
  //       }
  //     },
  //   },
  // },
  // gmaxsnooze: {
  //   onHit(target) {
  //     if (target.status || !target.runStatusImmunity('slp')) { return; }
  //     if (this.random(2) === 0) { return; }
  //     target.addVolatile('yawn');
  //   },
  //   onAfterSubDamage(damage, target) {
  //     if (target.status || !target.runStatusImmunity('slp')) { return; }
  //     if (this.random(2) === 0) { return; }
  //     target.addVolatile('yawn');
  //   },
  // },
  // gmaxsteelsurge: {
  //   self: {
  //     onHit(source) {
  //       source.side.foe.addSideCondition('gmaxsteelsurge');
  //     },
  //   },
  //   effect: {
  //     onStart(side) {
  //       this.add('-sidestart', side, 'move: G-Max Steelsurge');
  //     },
  //     onSwitchIn(pokemon) {
  //       if (pokemon.hasItem('heavydutyboots')) { return; }
  //       // Ice Face and Disguise correctly get typed damage from Stealth Rock
  //       // because Stealth Rock bypasses Substitute.
  //       // They don't get typed damage from Steelsurge because Steelsurge doesn't,
  //       // so we're going to test the damage of a Steel-type Stealth Rock instead.
  //       const steelHazard = this.dex.getActiveMove('Stealth Rock');
  //       steelHazard.type = 'Steel';
  //       const typeMod = this.dex.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
  //       this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
  //     },
  //   },
  // },
  // gmaxstonesurge: {
  //   self: {
  //     onHit(source) {
  //       source.side.foe.addSideCondition('stealthrock');
  //     },
  //   },
  // },
  // gmaxstunshock: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         const result = this.random(2);
  //         if (result === 0) {
  //           pokemon.trySetStatus('par', source);
  //         } else {
  //           pokemon.trySetStatus('psn', source);
  //         }
  //       }
  //     },
  //   },
  // },
  // gmaxsweetness: {
  //   self: {
  //     onHit(source) {
  //       for (const ally of source.side.pokemon) {
  //         ally.cureStatus();
  //       }
  //     },
  //   },
  // },
  // gmaxtartness: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         this.boost({evasion: -1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // gmaxterror: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         pokemon.addVolatile('trapped', source, null, 'trapper');
  //       }
  //     },
  //   },
  // },
  // gmaxvolcalith: {
  //   self: {
  //     onHit(source) {
  //       source.side.foe.addSideCondition('gmaxvolcalith');
  //     },
  //   },
  //   effect: {
  //     onStart(targetSide) {
  //       this.add('-sidestart', targetSide, 'G-Max Volcalith');
  //     },
  //     onResidual(targetSide) {
  //       for (const pokemon of targetSide.active) {
  //         if (!pokemon.hasType('Rock')) { this.damage(pokemon.baseMaxhp / 6, pokemon); }
  //       }
  //     },
  //     onEnd(targetSide) {
  //       for (const pokemon of targetSide.active) {
  //         if (!pokemon.hasType('Rock')) { this.damage(pokemon.baseMaxhp / 6, pokemon); }
  //       }
  //       this.add('-sideend', targetSide, 'G-Max Volcalith');
  //     },
  //   },
  // },
  // gmaxvoltcrash: {
  //   self: {
  //     onHit(source) {
  //       for (const pokemon of source.side.foe.active) {
  //         pokemon.trySetStatus('par', source);
  //       }
  //     },
  //   },
  // },
  // gmaxwildfire: {
  //   self: {
  //     onHit(source) {
  //       source.side.foe.addSideCondition('gmaxwildfire');
  //     },
  //   },
  //   effect: {
  //     onStart(targetSide) {
  //       this.add('-sidestart', targetSide, 'G-Max Wildfire');
  //     },
  //     onResidual(targetSide) {
  //       for (const pokemon of targetSide.active) {
  //         if (!pokemon.hasType('Fire')) { this.damage(pokemon.baseMaxhp / 6, pokemon); }
  //       }
  //     },
  //     onEnd(targetSide) {
  //       for (const pokemon of targetSide.active) {
  //         if (!pokemon.hasType('Fire')) { this.damage(pokemon.baseMaxhp / 6, pokemon); }
  //       }
  //       this.add('-sideend', targetSide, 'G-Max Wildfire');
  //     },
  //   },
  // },
  // gmaxwindrage: {
  //   self: {
  //     onHit(source) {
  //       let success = false;
  //       const removeTarget = [
  //         'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb',
  //       ];
  //       const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
  //       for (const targetCondition of removeTarget) {
  //         if (source.side.foe.removeSideCondition(targetCondition)) {
  //           if (!removeAll.includes(targetCondition)) { continue; }
  //           this.add('-sideend', source.side.foe, this.dex.getEffect(targetCondition).name, '[from] move: G-Max Wind Rage', '[of] ' + source);
  //           success = true;
  //         }
  //       }
  //       for (const sideCondition of removeAll) {
  //         if (source.side.removeSideCondition(sideCondition)) {
  //           this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: G-Max Wind Rage', '[of] ' + source);
  //           success = true;
  //         }
  //       }
  //       this.field.clearTerrain();
  //       return success;
  //     },
  //   },
  // },
  // grassknot: {
  //   basePowerCallback(pokemon, target) {
  //     const targetWeight = target.getWeight();
  //     if (targetWeight >= 2000) {
  //       this.debug('120 bp');
  //       return 120;
  //     }
  //     if (targetWeight >= 1000) {
  //       this.debug('100 bp');
  //       return 100;
  //     }
  //     if (targetWeight >= 500) {
  //       this.debug('80 bp');
  //       return 80;
  //     }
  //     if (targetWeight >= 250) {
  //       this.debug('60 bp');
  //       return 60;
  //     }
  //     if (targetWeight >= 100) {
  //       this.debug('40 bp');
  //       return 40;
  //     }
  //     this.debug('20 bp');
  //     return 20;
  //   },
  //   onTryHit(target, source, move) {
  //     if (target.volatiles['dynamax']) {
  //       this.add('-fail', source, 'move: Grass Knot', '[from] Dynamax');
  //       this.attrLastMove('[still]');
  //       return null;
  //     }
  //   },
  // },
  // grasspledge: {
  //   basePowerCallback(target, source, move) {
  //     if (['waterpledge', 'firepledge'].includes(move.sourceEffect)) {
  //       this.add('-combine');
  //       return 150;
  //     }
  //     return 80;
  //   },
  //   onPrepareHit(target, source, move) {
  //     for (const action of this.queue) {
  //       if (
  //       // @ts-ignore
  //         !action.move || !action.pokemon || !action.pokemon.isActive ||
  //                   // @ts-ignore
  //                   action.pokemon.fainted || action.maxMove || action.zmove) {
  //         continue;
  //       }
  //       // @ts-ignore
  //       if (action.pokemon.side === source.side && ['waterpledge', 'firepledge'].includes(action.move.id)) {
  //         // @ts-ignore
  //         this.queue.prioritizeAction(action, move);
  //         this.add('-waiting', source, action.pokemon);
  //         return null;
  //       }
  //     }
  //   },
  //   onModifyMove(move) {
  //     if (move.sourceEffect === 'waterpledge') {
  //       move.type = 'Grass';
  //       move.forceSTAB = true;
  //       move.sideCondition = 'grasspledge';
  //     }
  //     if (move.sourceEffect === 'firepledge') {
  //       move.type = 'Fire';
  //       move.forceSTAB = true;
  //       move.sideCondition = 'firepledge';
  //     }
  //   },
  //   effect: {
  //     onStart(targetSide) {
  //       this.add('-sidestart', targetSide, 'Grass Pledge');
  //     },
  //     onEnd(targetSide) {
  //       this.add('-sideend', targetSide, 'Grass Pledge');
  //     },
  //     onModifySpe(spe, pokemon) {
  //       return this.chainModify(0.25);
  //     },
  //   },
  // },
  // grassyterrain: {
  //   effect: {
  //     durationCallback(source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasItem('terrainextender')) {
  //         return 8;
  //       }
  //       return 5;
  //     },
  //     onBasePower(basePower, attacker, defender, move) {
  //       const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
  //       if (weakenedMoves.includes(move.id)) {
  //         this.debug('move weakened by grassy terrain');
  //         return this.chainModify(0.5);
  //       }
  //       if (move.type === 'Grass' && attacker.isGrounded()) {
  //         this.debug('grassy terrain boost');
  //         return this.chainModify([0x14CD, 0x1000]);
  //       }
  //     },
  //     onStart(battle, source, effect) {
  //       if ((effect === null || effect === void 0 ? void 0 : effect.effectType) === 'Ability') {
  //         this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect, '[of] ' + source);
  //       } else {
  //         this.add('-fieldstart', 'move: Grassy Terrain');
  //       }
  //     },
  //     onResidual() {
  //       this.eachEvent('Terrain');
  //     },
  //     onTerrain(pokemon) {
  //       if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
  //         this.debug('Pokemon is grounded, healing through Grassy Terrain.');
  //         this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon);
  //       }
  //     },
  //     onEnd() {
  //       if (!this.effectData.duration) { this.eachEvent('Terrain'); }
  //       this.add('-fieldend', 'move: Grassy Terrain');
  //     },
  //   },
  // },
  // gravapple: {
  //   onBasePower(basePower) {
  //     if (this.field.getPseudoWeather('gravity')) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // gravity: {
  //   effect: {
  //     durationCallback(source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasAbility('persistent')) {
  //         this.add('-activate', source, 'ability: Persistent', effect);
  //         return 7;
  //       }
  //       return 5;
  //     },
  //     onStart() {
  //       this.add('-fieldstart', 'move: Gravity');
  //       for (const pokemon of this.getAllActive()) {
  //         let applies = false;
  //         if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
  //           applies = true;
  //           this.queue.cancelMove(pokemon);
  //           pokemon.removeVolatile('twoturnmove');
  //         }
  //         if (pokemon.volatiles['skydrop']) {
  //           applies = true;
  //           this.queue.cancelMove(pokemon);
  //           if (pokemon.volatiles['skydrop'].source) {
  //             this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
  //           }
  //           pokemon.removeVolatile('skydrop');
  //           pokemon.removeVolatile('twoturnmove');
  //         }
  //         if (pokemon.volatiles['magnetrise']) {
  //           applies = true;
  //           delete pokemon.volatiles['magnetrise'];
  //         }
  //         if (pokemon.volatiles['telekinesis']) {
  //           applies = true;
  //           delete pokemon.volatiles['telekinesis'];
  //         }
  //         if (applies) { this.add('-activate', pokemon, 'move: Gravity'); }
  //       }
  //     },
  //     onModifyAccuracy(accuracy) {
  //       if (typeof accuracy !== 'number') { return; }
  //       return accuracy * 5 / 3;
  //     },
  //     onDisableMove(pokemon) {
  //       for (const moveSlot of pokemon.moveSlots) {
  //         if (this.dex.getMove(moveSlot.id).flags['gravity']) {
  //           pokemon.disableMove(moveSlot.id);
  //         }
  //       }
  //     },
  //     onBeforeMove(pokemon, target, move) {
  //       if (move.flags['gravity']) {
  //         this.add('cant', pokemon, 'move: Gravity', move);
  //         return false;
  //       }
  //     },
  //     onEnd() {
  //       this.add('-fieldend', 'move: Gravity');
  //     },
  //   },
  // },
  // growth: {
  //   onModifyMove(move, pokemon) {
  //     if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) { move.boosts = {atk: 2, spa: 2}; }
  //   },
  // },
  // grudge: {
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singlemove', pokemon, 'Grudge');
  //     },
  //     onFaint(target, source, effect) {
  //       if (!source || source.fainted || !effect) { return; }
  //       if (effect.effectType === 'Move' && !effect.isFutureMove && source.lastMove) {
  //         for (const moveSlot of source.moveSlots) {
  //           if (moveSlot.id === source.lastMove.id) {
  //             moveSlot.pp = 0;
  //             this.add('-activate', source, 'move: Grudge', this.dex.getMove(source.lastMove.id).name);
  //           }
  //         }
  //       }
  //     },
  //     onBeforeMove(pokemon) {
  //       this.debug('removing Grudge before attack');
  //       pokemon.removeVolatile('grudge');
  //     },
  //   },
  // },
  // guardianofalola: {
  //   damageCallback(pokemon, target) {
  //     const hp75 = Math.floor(target.getUndynamaxedHP() * 3 / 4);
  //     if (target.volatiles['protect'] || target.volatiles['banefulbunker'] || target.volatiles['kingsshield'] ||
  //               target.volatiles['spikyshield'] || target.side.getSideCondition('matblock')) {
  //       this.add('-zbroken', target);
  //       return this.dex.clampIntRange(Math.ceil(hp75 / 4 - 0.5), 1);
  //     }
  //     return this.dex.clampIntRange(hp75, 1);
  //   },
  // },
  // guardsplit: {
  //   onHit(target, source) {
  //     const newdef = Math.floor((target.storedStats.def + source.storedStats.def) / 2);
  //     target.storedStats.def = newdef;
  //     source.storedStats.def = newdef;
  //     const newspd = Math.floor((target.storedStats.spd + source.storedStats.spd) / 2);
  //     target.storedStats.spd = newspd;
  //     source.storedStats.spd = newspd;
  //     this.add('-activate', source, 'move: Guard Split', '[of] ' + target);
  //   },
  // },
  // guardswap: {
  //   onHit(target, source) {
  //     const targetBoosts = {};
  //     const sourceBoosts = {};
  //     const defSpd = ['def', 'spd'];
  //     for (const stat of defSpd) {
  //       targetBoosts[stat] = target.boosts[stat];
  //       sourceBoosts[stat] = source.boosts[stat];
  //     }
  //     source.setBoost(targetBoosts);
  //     target.setBoost(sourceBoosts);
  //     this.add('-swapboost', source, target, 'def, spd', '[from] move: Guard Swap');
  //   },
  // },
  // gyroball: {
  //   basePowerCallback(pokemon, target) {
  //     let power = Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) + 1;
  //     if (!isFinite(power)) { power = 1; }
  //     if (power > 150) { power = 150; }
  //     this.debug(`${power} bp`);
  //     return power;
  //   },
  // },
  // happyhour: {
  //   onTryHit(target, source) {
  //     this.add('-activate', target, 'move: Happy Hour');
  //   },
  // },
  // haze: {
  //   onHitField() {
  //     this.add('-clearallboost');
  //     for (const pokemon of this.getAllActive()) {
  //       pokemon.clearBoosts();
  //     }
  //   },
  // },
  // healbell: {
  //   onHit(pokemon, source) {
  //     this.add('-activate', source, 'move: Heal Bell');
  //     const side = pokemon.side;
  //     let success = false;
  //     for (const ally of side.pokemon) {
  //       if (ally.hasAbility('soundproof')) { continue; }
  //       if (ally.cureStatus()) { success = true; }
  //     }
  //     return success;
  //   },
  // },
  // healblock: {
  //   effect: {
  //     durationCallback(target, source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasAbility('persistent')) {
  //         this.add('-activate', source, 'ability: Persistent', effect);
  //         return 7;
  //       }
  //       return 5;
  //     },
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'move: Heal Block');
  //     },
  //     onDisableMove(pokemon) {
  //       for (const moveSlot of pokemon.moveSlots) {
  //         if (this.dex.getMove(moveSlot.id).flags['heal']) {
  //           pokemon.disableMove(moveSlot.id);
  //         }
  //       }
  //     },
  //     onBeforeMove(pokemon, target, move) {
  //       if (move.flags['heal'] && !move.isZ && !move.isMax) {
  //         this.add('cant', pokemon, 'move: Heal Block', move);
  //         return false;
  //       }
  //     },
  //     onEnd(pokemon) {
  //       this.add('-end', pokemon, 'move: Heal Block');
  //     },
  //     onTryHeal(damage, target, source, effect) {
  //       if (((effect === null || effect === void 0 ? void 0 : effect.id) === 'zpower') || this.effectData.isZ) { return damage; }
  //       return false;
  //     },
  //   },
  // },
  // healingwish: {
  //   onTryHit(pokemon, target, move) {
  //     if (!this.canSwitch(pokemon.side)) {
  //       delete move.selfdestruct;
  //       return false;
  //     }
  //   },
  //   effect: {
  //     onSwap(target) {
  //       if (!target.fainted && (target.hp < target.maxhp || target.status)) {
  //         target.heal(target.maxhp);
  //         target.setStatus('');
  //         this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
  //         target.side.removeSlotCondition(target, 'healingwish');
  //       }
  //     },
  //   },
  // },
  // healpulse: {
  //   onHit(target, source) {
  //     let success = false;
  //     if (source.hasAbility('megalauncher')) {
  //       success = !!this.heal(this.modify(target.baseMaxhp, 0.75));
  //     } else {
  //       success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
  //     }
  //     if (success && target.side.id !== source.side.id) {
  //       target.staleness = 'external';
  //     }
  //     return success;
  //   },
  // },
  // heartswap: {
  //   onHit(target, source) {
  //     const targetBoosts = {};
  //     const sourceBoosts = {};
  //     let i;
  //     for (i in target.boosts) {
  //       targetBoosts[i] = target.boosts[i];
  //       sourceBoosts[i] = source.boosts[i];
  //     }
  //     target.setBoost(sourceBoosts);
  //     source.setBoost(targetBoosts);
  //     this.add('-swapboost', source, target, '[from] move: Heart Swap');
  //   },
  // },
  // heatcrash: {
  //   basePowerCallback(pokemon, target) {
  //     const targetWeight = target.getWeight();
  //     const pokemonWeight = pokemon.getWeight();
  //     if (pokemonWeight > targetWeight * 5) {
  //       return 120;
  //     }
  //     if (pokemonWeight > targetWeight * 4) {
  //       return 100;
  //     }
  //     if (pokemonWeight > targetWeight * 3) {
  //       return 80;
  //     }
  //     if (pokemonWeight > targetWeight * 2) {
  //       return 60;
  //     }
  //     return 40;
  //   },
  //   onTryHit(target, pokemon, move) {
  //     if (target.volatiles['dynamax']) {
  //       this.add('-fail', pokemon, 'Dynamax');
  //       this.attrLastMove('[still]');
  //       return null;
  //     }
  //   },
  // },
  // heavyslam: {
  //   basePowerCallback(pokemon, target) {
  //     const targetWeight = target.getWeight();
  //     const pokemonWeight = pokemon.getWeight();
  //     if (pokemonWeight > targetWeight * 5) {
  //       return 120;
  //     }
  //     if (pokemonWeight > targetWeight * 4) {
  //       return 100;
  //     }
  //     if (pokemonWeight > targetWeight * 3) {
  //       return 80;
  //     }
  //     if (pokemonWeight > targetWeight * 2) {
  //       return 60;
  //     }
  //     return 40;
  //   },
  //   onTryHit(target, pokemon, move) {
  //     if (target.volatiles['dynamax']) {
  //       this.add('-fail', pokemon, 'Dynamax');
  //       this.attrLastMove('[still]');
  //       return null;
  //     }
  //   },
  // },
  // helpinghand: {
  //   onTryHit(target) {
  //     if (!target.newlySwitched && !this.queue.willMove(target)) { return false; }
  //   },
  //   effect: {
  //     onStart(target, source) {
  //       this.effectData.multiplier = 1.5;
  //       this.add('-singleturn', target, 'Helping Hand', '[of] ' + source);
  //     },
  //     onRestart(target, source) {
  //       this.effectData.multiplier *= 1.5;
  //       this.add('-singleturn', target, 'Helping Hand', '[of] ' + source);
  //     },
  //     onBasePower(basePower) {
  //       this.debug('Boosting from Helping Hand: ' + this.effectData.multiplier);
  //       return this.chainModify(this.effectData.multiplier);
  //     },
  //   },
  // },
  // hex: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (target.status || target.hasAbility('comatose')) { return move.basePower * 2; }
  //     return move.basePower;
  //   },
  // },
  // hiddenpower: {
  //   onModifyType(move, pokemon) {
  //     move.type = pokemon.hpType || 'Dark';
  //   },
  // },
  // highjumpkick: {
  //   onMoveFail(target, source, move) {
  //     this.damage(source.baseMaxhp / 2, source, source, this.dex.getEffect('High Jump Kick'));
  //   },
  // },
  // hurricane: {
  //   onModifyMove(move, pokemon, target) {
  //     switch (target.effectiveWeather()) {
  //     case 'raindance':
  //     case 'primordialsea':
  //       move.accuracy = true;
  //       break;
  //     case 'sunnyday':
  //     case 'desolateland':
  //       move.accuracy = 50;
  //       break;
  //     }
  //   },
  // },
  // hyperspacefury: {
  //   onTry(pokemon) {
  //     if (pokemon.species.name === 'Hoopa-Unbound') {
  //       return;
  //     }
  //     this.hint("Only a Pokemon whose form is Hoopa Unbound can use this move.");
  //     if (pokemon.species.name === 'Hoopa') {
  //       this.add('-fail', pokemon, 'move: Hyperspace Fury', '[forme]');
  //       return null;
  //     }
  //     this.add('-fail', pokemon, 'move: Hyperspace Fury');
  //     return null;
  //   },
  // },
  // iceball: {
  //   basePowerCallback(pokemon, target, move) {
  //     let bp = move.basePower;
  //     if (pokemon.volatiles.iceball && pokemon.volatiles.iceball.hitCount) {
  //       bp *= Math.pow(2, pokemon.volatiles.iceball.hitCount);
  //     }
  //     if (pokemon.status !== 'slp') { pokemon.addVolatile('iceball'); }
  //     if (pokemon.volatiles.defensecurl) {
  //       bp *= 2;
  //     }
  //     this.debug("Ice Ball bp: " + bp);
  //     return bp;
  //   },
  //   effect: {
  //     onStart() {
  //       this.effectData.hitCount = 1;
  //     },
  //     onRestart() {
  //       this.effectData.hitCount++;
  //       if (this.effectData.hitCount < 5) {
  //         this.effectData.duration = 2;
  //       }
  //     },
  //     onResidual(target) {
  //       if (target.lastMove && target.lastMove.id === 'struggle') {
  //         // don't lock
  //         delete target.volatiles['iceball'];
  //       }
  //     },
  //   },
  // },
  // iceburn: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  // },
  // imprison: {
  //   effect: {
  //     onStart(target) {
  //       this.add('-start', target, 'move: Imprison');
  //     },
  //     onFoeDisableMove(pokemon) {
  //       for (const moveSlot of this.effectData.source.moveSlots) {
  //         if (moveSlot.id === 'struggle') { continue; }
  //         pokemon.disableMove(moveSlot.id, 'hidden');
  //       }
  //       pokemon.maybeDisabled = true;
  //     },
  //     onFoeBeforeMove(attacker, defender, move) {
  //       if (move.id !== 'struggle' && this.effectData.source.hasMove(move.id) && !move.isZ && !move.isMax) {
  //         this.add('cant', attacker, 'move: Imprison', move);
  //         return false;
  //       }
  //     },
  //   },
  // },
  // incinerate: {
  //   onHit(pokemon, source) {
  //     const item = pokemon.getItem();
  //     if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) {
  //       this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
  //     }
  //   },
  // },
  // ingrain: {
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'move: Ingrain');
  //     },
  //     onResidual(pokemon) {
  //       this.heal(pokemon.baseMaxhp / 16);
  //     },
  //     onTrapPokemon(pokemon) {
  //       pokemon.tryTrap();
  //     },
  //     onDragOut(pokemon) {
  //       this.add('-activate', pokemon, 'move: Ingrain');
  //       return null;
  //     },
  //   },
  // },
  // instruct: {
  //   onHit(target, source) {
  //     if (!target.lastMove || target.volatiles['dynamax']) { return false; }
  //     const lastMove = target.lastMove;
  //     const moveIndex = target.moves.indexOf(lastMove.id);
  //     const noInstruct = [
  //       'assist', 'beakblast', 'bide', 'celebrate', 'copycat', 'dynamaxcannon', 'focuspunch', 'iceball', 'instruct', 'kingsshield', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'outrage', 'petaldance', 'rollout', 'shelltrap', 'sketch', 'sleeptalk', 'thrash', 'transform',
  //     ];
  //     if (noInstruct.includes(lastMove.id) || lastMove.isZ || lastMove.isMax ||
  //               lastMove.flags['charge'] || lastMove.flags['recharge'] ||
  //               target.volatiles['beakblast'] || target.volatiles['focuspunch'] || target.volatiles['shelltrap'] ||
  //               (target.moveSlots[moveIndex] && target.moveSlots[moveIndex].pp <= 0)) {
  //       return false;
  //     }
  //     this.add('-singleturn', target, 'move: Instruct', '[of] ' + source);
  //     this.runMove(target.lastMove.id, target, target.lastMoveTargetLoc);
  //   },
  // },
  // iondeluge: {
  //   effect: {
  //     onStart(target) {
  //       this.add('-fieldactivate', 'move: Ion Deluge');
  //     },
  //     onModifyType(move) {
  //       if (move.type === 'Normal') {
  //         move.type = 'Electric';
  //         this.debug(move.name + "'s type changed to Electric");
  //       }
  //     },
  //   },
  // },
  // jawlock: {
  //   onHit(target, source, move) {
  //     source.addVolatile('trapped', target, move, 'trapper');
  //     target.addVolatile('trapped', source, move, 'trapper');
  //   },
  // },
  // judgment: {
  //   onModifyType(move, pokemon) {
  //     if (pokemon.ignoringItem()) { return; }
  //     const item = pokemon.getItem();
  //     if (item.id && item.onPlate && !item.zMove) {
  //       move.type = item.onPlate;
  //     }
  //   },
  // },
  // jumpkick: {
  //   onMoveFail(target, source, move) {
  //     this.damage(source.baseMaxhp / 2, source, source, this.dex.getEffect('Jump Kick'));
  //   },
  // },
  // kingsshield: {
  //   onTryHit(pokemon) {
  //     return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
  //   },
  //   onHit(pokemon) {
  //     pokemon.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'Protect');
  //     },
  //     onTryHit(target, source, move) {
  //       if (!move.flags['protect'] || move.category === 'Status') {
  //         if (move.isZ || move.isMax) { target.getMoveHitData(move).zBrokeProtect = true; }
  //         return;
  //       }
  //       if (move.smartTarget) {
  //         move.smartTarget = false;
  //       } else {
  //         this.add('-activate', target, 'move: Protect');
  //       }
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       if (move.flags['contact']) {
  //         this.boost({atk: -1}, source, target, this.dex.getActiveMove("King's Shield"));
  //       }
  //       return this.NOT_FAIL;
  //     },
  //     onHit(target, source, move) {
  //       if (move.isZOrMaxPowered && move.flags['contact']) {
  //         this.boost({atk: -1}, source, target, this.dex.getActiveMove("King's Shield"));
  //       }
  //     },
  //   },
  // },
  // knockoff: {
  //   onBasePower(basePower, source, target, move) {
  //     const item = target.getItem();
  //     if (!this.singleEvent('TakeItem', item, target.itemData, target, target, move, item)) { return; }
  //     if (item.id) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onAfterHit(target, source) {
  //     if (source.hp) {
  //       const item = target.takeItem();
  //       if (item) {
  //         this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
  //       }
  //     }
  //   },
  // },
  // laserfocus: {
  //   effect: {
  //     onStart(pokemon, source, effect) {
  //       if (effect && (['imposter', 'psychup', 'transform'].includes(effect.id))) {
  //         this.add('-start', pokemon, 'move: Laser Focus', '[silent]');
  //       } else {
  //         this.add('-start', pokemon, 'move: Laser Focus');
  //       }
  //     },
  //     onRestart(pokemon) {
  //       this.effectData.duration = 2;
  //       this.add('-start', pokemon, 'move: Laser Focus');
  //     },
  //     onModifyCritRatio(critRatio) {
  //       return 5;
  //     },
  //     onEnd(pokemon) {
  //       this.add('-end', pokemon, 'move: Laser Focus', '[silent]');
  //     },
  //   },
  // },
  // lastresort: {
  //   onTry(pokemon, target) {
  //     if (pokemon.moveSlots.length < 2) { return false; } // Last Resort fails unless the user knows at least 2 moves
  //     let hasLastResort = false; // User must actually have Last Resort for it to succeed
  //     for (const moveSlot of pokemon.moveSlots) {
  //       if (moveSlot.id === 'lastresort') {
  //         hasLastResort = true;
  //         continue;
  //       }
  //       if (!moveSlot.used) { return false; }
  //     }
  //     return hasLastResort;
  //   },
  // },
  // leechseed: {
  //   effect: {
  //     onStart(target) {
  //       this.add('-start', target, 'move: Leech Seed');
  //     },
  //     onResidual(pokemon) {
  //       const target = this.effectData.source.side.active[pokemon.volatiles['leechseed'].sourcePosition];
  //       if (!target || target.fainted || target.hp <= 0) {
  //         this.debug('Nothing to leech into');
  //         return;
  //       }
  //       const damage = this.damage(pokemon.baseMaxhp / 8, pokemon, target);
  //       if (damage) {
  //         this.heal(damage, target, pokemon);
  //       }
  //     },
  //   },
  //   onTryImmunity(target) {
  //     return !target.hasType('Grass');
  //   },
  // },
  // lightscreen: {
  //   effect: {
  //     durationCallback(target, source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasItem('lightclay')) {
  //         return 8;
  //       }
  //       return 5;
  //     },
  //     onAnyModifyDamage(damage, source, target, move) {
  //       if (target !== source && target.side === this.effectData.target && this.getCategory(move) === 'Special') {
  //         if (!target.getMoveHitData(move).crit && !move.infiltrates) {
  //           this.debug('Light Screen weaken');
  //           if (target.side.active.length > 1) { return this.chainModify([0xAAC, 0x1000]); }
  //           return this.chainModify(0.5);
  //         }
  //       }
  //     },
  //     onStart(side) {
  //       this.add('-sidestart', side, 'move: Light Screen');
  //     },
  //     onEnd(side) {
  //       this.add('-sideend', side, 'move: Light Screen');
  //     },
  //   },
  // },
  // lightthatburnsthesky: {
  //   onModifyMove(move, pokemon) {
  //     if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) { move.category = 'Physical'; }
  //   },
  // },
  // lockon: {
  //   onTryHit(target, source) {
  //     if (source.volatiles['lockon']) { return false; }
  //   },
  //   onHit(target, source) {
  //     source.addVolatile('lockon', target);
  //     this.add('-activate', source, 'move: Lock-On', '[of] ' + target);
  //   },
  //   effect: {
  //     onSourceInvulnerability(target, source, move) {
  //       if (move && source === this.effectData.target && target === this.effectData.source) { return 0; }
  //     },
  //     onSourceAccuracy(accuracy, target, source, move) {
  //       if (move && source === this.effectData.target && target === this.effectData.source) { return true; }
  //     },
  //   },
  // },
  // lowkick: {
  //   basePowerCallback(pokemon, target) {
  //     const targetWeight = target.getWeight();
  //     if (targetWeight >= 2000) {
  //       return 120;
  //     }
  //     if (targetWeight >= 1000) {
  //       return 100;
  //     }
  //     if (targetWeight >= 500) {
  //       return 80;
  //     }
  //     if (targetWeight >= 250) {
  //       return 60;
  //     }
  //     if (targetWeight >= 100) {
  //       return 40;
  //     }
  //     return 20;
  //   },
  //   onTryHit(target, pokemon, move) {
  //     if (target.volatiles['dynamax']) {
  //       this.add('-fail', pokemon, 'Dynamax');
  //       this.attrLastMove('[still]');
  //       return null;
  //     }
  //   },
  // },
  // luckychant: {
  //   effect: {
  //     onStart(side) {
  //       this.add('-sidestart', side, 'move: Lucky Chant'); // "The Lucky Chant shielded [side.name]'s team from critical hits!"
  //     },
  //     onEnd(side) {
  //       this.add('-sideend', side, 'move: Lucky Chant'); // "[side.name]'s team's Lucky Chant wore off!"
  //     },
  //   },
  // },
  // lunardance: {
  //   onTryHit(pokemon, target, move) {
  //     if (!this.canSwitch(pokemon.side)) {
  //       delete move.selfdestruct;
  //       return false;
  //     }
  //   },
  //   effect: {
  //     onStart(side, source) {
  //       this.debug('Lunar Dance started on ' + side.name);
  //       this.effectData.positions = [];
  //       for (const i of side.active.keys()) {
  //         this.effectData.positions[i] = false;
  //       }
  //       this.effectData.positions[source.position] = true;
  //     },
  //     onRestart(side, source) {
  //       this.effectData.positions[source.position] = true;
  //     },
  //     onSwitchIn(target) {
  //       const positions = this.effectData.positions;
  //       if (target.position !== this.effectData.sourcePosition) {
  //         return;
  //       }
  //       if (!target.fainted) {
  //         target.heal(target.maxhp);
  //         target.setStatus('');
  //         for (const moveSlot of target.moveSlots) {
  //           moveSlot.pp = moveSlot.maxpp;
  //         }
  //         this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
  //         positions[target.position] = false;
  //       }
  //       if (!positions.some(affected => affected === true)) {
  //         target.side.removeSideCondition('lunardance');
  //       }
  //     },
  //   },
  // },
  // magiccoat: {
  //   effect: {
  //     onStart(target, source, effect) {
  //       this.add('-singleturn', target, 'move: Magic Coat');
  //       if ((effect === null || effect === void 0 ? void 0 : effect.effectType) === 'Move') {
  //         this.effectData.pranksterBoosted = effect.pranksterBoosted;
  //       }
  //     },
  //     onTryHit(target, source, move) {
  //       if (target === source || move.hasBounced || !move.flags['reflectable']) {
  //         return;
  //       }
  //       const newMove = this.dex.getActiveMove(move.id);
  //       newMove.hasBounced = true;
  //       newMove.pranksterBoosted = this.effectData.pranksterBoosted;
  //       this.useMove(newMove, target, source);
  //       return null;
  //     },
  //     onAllyTryHitSide(target, source, move) {
  //       if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
  //         return;
  //       }
  //       const newMove = this.dex.getActiveMove(move.id);
  //       newMove.hasBounced = true;
  //       newMove.pranksterBoosted = false;
  //       this.useMove(newMove, this.effectData.target, source);
  //       return null;
  //     },
  //   },
  // },
  // magicpowder: {
  //   onHit(target) {
  //     if (target.getTypes().join() === 'Psychic' || !target.setType('Psychic')) { return false; }
  //     this.add('-start', target, 'typechange', 'Psychic');
  //   },
  // },
  // magicroom: {
  //   effect: {
  //     durationCallback(source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasAbility('persistent')) {
  //         this.add('-activate', source, 'ability: Persistent', effect);
  //         return 7;
  //       }
  //       return 5;
  //     },
  //     onStart(target, source) {
  //       this.add('-fieldstart', 'move: Magic Room', '[of] ' + source);
  //     },
  //     onRestart(target, source) {
  //       this.field.removePseudoWeather('magicroom');
  //     },
  //     onEnd() {
  //       this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectData.source);
  //     },
  //   },
  // },
  // magikarpsrevenge: {
  //   onTry(pokemon) {
  //     if (pokemon.species.name !== 'Magikarp') {
  //       this.add('-fail', pokemon, 'move: Magikarp\'s Revenge');
  //       return null;
  //     }
  //   },
  //   self: {
  //     onHit(source) {
  //       this.field.setWeather('raindance');
  //       source.addVolatile('magiccoat');
  //       source.addVolatile('aquaring');
  //     },
  //   },
  // },
  // magneticflux: {
  //   onHitSide(side, source, move) {
  //     const targets = [];
  //     for (const pokemon of side.active) {
  //       if (pokemon.hasAbility(['plus', 'minus'])) {
  //         targets.push(pokemon);
  //       }
  //     }
  //     if (!targets.length) { return false; }
  //     let didSomething = false;
  //     for (const target of targets) {
  //       didSomething = this.boost({def: 1, spd: 1}, target, source, move, false, true) || didSomething;
  //     }
  //     return didSomething;
  //   },
  // },
  // magnetrise: {
  //   effect: {
  //     onStart(target) {
  //       if (target.volatiles['smackdown'] || target.volatiles['ingrain']) { return false; }
  //       this.add('-start', target, 'Magnet Rise');
  //     },
  //     onImmunity(type) {
  //       if (type === 'Ground') { return false; }
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'Magnet Rise');
  //     },
  //   },
  // },
  // magnitude: {
  //   onModifyMove(move, pokemon) {
  //     const i = this.random(100);
  //     if (i < 5) {
  //       move.magnitude = 4;
  //       move.basePower = 10;
  //     } else if (i < 15) {
  //       move.magnitude = 5;
  //       move.basePower = 30;
  //     } else if (i < 35) {
  //       move.magnitude = 6;
  //       move.basePower = 50;
  //     } else if (i < 65) {
  //       move.magnitude = 7;
  //       move.basePower = 70;
  //     } else if (i < 85) {
  //       move.magnitude = 8;
  //       move.basePower = 90;
  //     } else if (i < 95) {
  //       move.magnitude = 9;
  //       move.basePower = 110;
  //     } else {
  //       move.magnitude = 10;
  //       move.basePower = 150;
  //     }
  //   },
  //   onUseMoveMessage(pokemon, target, move) {
  //     this.add('-activate', pokemon, 'move: Magnitude', move.magnitude);
  //   },
  // },
  // matblock: {
  //   onTryHitSide(side, source) {
  //     if (source.activeMoveActions > 1) {
  //       this.hint("Mat Block only works on your first turn out.");
  //       return false;
  //     }
  //   },
  //   effect: {
  //     onStart(target, source) {
  //       this.add('-singleturn', source, 'Mat Block');
  //     },
  //     onTryHit(target, source, move) {
  //       if (!move.flags['protect']) {
  //         if (move.isZ || move.isMax) { target.getMoveHitData(move).zBrokeProtect = true; }
  //         return;
  //       }
  //       if (move && (move.target === 'self' || move.category === 'Status')) { return; }
  //       this.add('-activate', target, 'move: Mat Block', move.name);
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       return this.NOT_FAIL;
  //     },
  //   },
  // },
  // maxairstream: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.active) {
  //         this.boost({spe: 1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxdarkness: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.foe.active) {
  //         this.boost({spd: -1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxflare: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       this.field.setWeather('sunnyday');
  //     },
  //   },
  // },
  // maxflutterby: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.foe.active) {
  //         this.boost({spa: -1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxgeyser: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       this.field.setWeather('raindance');
  //     },
  //   },
  // },
  // maxguard: {
  //   onPrepareHit(pokemon) {
  //     return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
  //   },
  //   onHit(pokemon) {
  //     pokemon.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'Max Guard');
  //     },
  //     onTryHit(target, source, move) {
  //       /** moves blocked by Max Guard but not Protect */
  //       const overrideBypassProtect = [
  //         'block', 'flowershield', 'gearup', 'magneticflux', 'phantomforce', 'psychup', 'teatime', 'transform',
  //       ];
  //       const blockedByMaxGuard = move.flags['protect'] || move.isZ || move.isMax || overrideBypassProtect.includes(move.id);
  //       if (!blockedByMaxGuard) {
  //         return;
  //       }
  //       if (move.smartTarget) {
  //         move.smartTarget = false;
  //       } else {
  //         this.add('-activate', target, 'move: Max Guard');
  //       }
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       return this.NOT_FAIL;
  //     },
  //   },
  // },
  // maxhailstorm: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       this.field.setWeather('hail');
  //     },
  //   },
  // },
  // maxknuckle: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.active) {
  //         this.boost({atk: 1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxlightning: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       this.field.setTerrain('electricterrain');
  //     },
  //   },
  // },
  // maxmindstorm: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       this.field.setTerrain('psychicterrain');
  //     },
  //   },
  // },
  // maxooze: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.active) {
  //         this.boost({spa: 1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxovergrowth: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       this.field.setTerrain('grassyterrain');
  //     },
  //   },
  // },
  // maxphantasm: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.foe.active) {
  //         this.boost({def: -1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxquake: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.active) {
  //         this.boost({spd: 1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxrockfall: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       this.field.setWeather('sandstorm');
  //     },
  //   },
  // },
  // maxstarfall: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       this.field.setTerrain('mistyterrain');
  //     },
  //   },
  // },
  // maxsteelspike: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.active) {
  //         this.boost({def: 1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxstrike: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.foe.active) {
  //         this.boost({spe: -1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // maxwyrmwind: {
  //   self: {
  //     onHit(source) {
  //       if (!source.volatiles['dynamax']) { return; }
  //       for (const pokemon of source.side.foe.active) {
  //         this.boost({atk: -1}, pokemon);
  //       }
  //     },
  //   },
  // },
  // meanlook: {
  //   onHit(target, source, move) {
  //     return target.addVolatile('trapped', source, move, 'trapper');
  //   },
  // },
  // mefirst: {
  //   onTryHit(target, pokemon) {
  //     const action = this.queue.willMove(target);
  //     if (!action) { return false; }
  //     const noMeFirst = [
  //       'beakblast', 'chatter', 'counter', 'covet', 'focuspunch', 'mefirst', 'metalburst', 'mirrorcoat', 'shelltrap', 'struggle', 'thief',
  //     ];
  //     const move = this.dex.getActiveMove(action.move.id);
  //     if (action.zmove || move.isZ || move.isMax) { return false; }
  //     if (move.category === 'Status' || noMeFirst.includes(move.id)) { return false; }
  //     pokemon.addVolatile('mefirst');
  //     this.useMove(move, pokemon, target);
  //     return null;
  //   },
  //   effect: {
  //     onBasePower(basePower) {
  //       return this.chainModify(1.5);
  //     },
  //   },
  // },
  // metalburst: {
  //   damageCallback(pokemon) {
  //     if (!pokemon.volatiles['metalburst']) { return 0; }
  //     return pokemon.volatiles['metalburst'].damage || 1;
  //   },
  //   beforeTurnCallback(pokemon) {
  //     pokemon.addVolatile('metalburst');
  //   },
  //   onTryHit(target, source, move) {
  //     if (!source.volatiles['metalburst']) { return false; }
  //     if (source.volatiles['metalburst'].position === null) { return false; }
  //   },
  //   effect: {
  //     onStart(target, source, move) {
  //       this.effectData.position = null;
  //       this.effectData.damage = 0;
  //     },
  //     onRedirectTarget(target, source, source2) {
  //       if (source !== this.effectData.target) { return; }
  //       return source.side.foe.active[this.effectData.position];
  //     },
  //     onDamagingHit(damage, target, source, effect) {
  //       if (source.side !== target.side) {
  //         this.effectData.position = source.position;
  //         this.effectData.damage = 1.5 * damage;
  //       }
  //     },
  //   },
  // },
  // metronome: {
  //   onHit(target, source, effect) {
  //     const moves = [];
  //     for (const id in exports.BattleMovedex) {
  //       const move = exports.BattleMovedex[id];
  //       if (move.realMove) { continue; }
  //       if (move.isZ || move.isMax || move.isNonstandard) { continue; }
  //       if (effect.noMetronome.includes(move.name)) { continue; }
  //       if (this.dex.getMove(id).gen > this.gen) { continue; }
  //       moves.push(move);
  //     }
  //     let randomMove = '';
  //     if (moves.length) {
  //       moves.sort((a, b) => a.num - b.num);
  //       randomMove = this.sample(moves).name;
  //     }
  //     if (!randomMove) {
  //       return false;
  //     }
  //     this.useMove(randomMove, target);
  //   },
  // },
  // mimic: {
  //   onHit(target, source) {
  //     const disallowedMoves = ['chatter', 'mimic', 'sketch', 'struggle', 'transform'];
  //     const move = target.lastMove;
  //     if (source.transformed || !move || disallowedMoves.includes(move.id) || source.moves.includes(move.id)) {
  //       return false;
  //     }
  //     if (move.isZ || move.isMax) { return false; }
  //     const mimicIndex = source.moves.indexOf('mimic');
  //     if (mimicIndex < 0) { return false; }
  //     source.moveSlots[mimicIndex] = {
  //       move: move.name,
  //       id: move.id,
  //       pp: move.pp,
  //       maxpp: move.pp,
  //       target: move.target,
  //       disabled: false,
  //       used: false,
  //       virtual: true,
  //     };
  //     this.add('-start', source, 'Mimic', move.name);
  //   },
  // },
  // mindblown: {
  //   onAfterMove(pokemon, target, move) {
  //     if (move.mindBlownRecoil && !move.multihit) {
  //       this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.getEffect('Mind Blown'), true);
  //     }
  //   },
  // },
  // mindreader: {
  //   onTryHit(target, source) {
  //     if (source.volatiles['lockon']) { return false; }
  //   },
  //   onHit(target, source) {
  //     source.addVolatile('lockon', target);
  //     this.add('-activate', source, 'move: Mind Reader', '[of] ' + target);
  //   },
  // },
  // minimize: {
  //   effect: {
  //     onSourceModifyDamage(damage, source, target, move) {
  //       const boostedMoves = [
  //         'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault',
  //       ];
  //       if (boostedMoves.includes(move.id)) {
  //         return this.chainModify(2);
  //       }
  //     },
  //     onAccuracy(accuracy, target, source, move) {
  //       const boostedMoves = [
  //         'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault',
  //       ];
  //       if (boostedMoves.includes(move.id)) {
  //         return true;
  //       }
  //       return accuracy;
  //     },
  //   },
  // },
  // miracleeye: {
  //   onTryHit(target) {
  //     if (target.volatiles['foresight']) { return false; }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'Miracle Eye');
  //     },
  //     onNegateImmunity(pokemon, type) {
  //       if (pokemon.hasType('Dark') && type === 'Psychic') { return false; }
  //     },
  //     onModifyBoost(boosts) {
  //       if (boosts.evasion && boosts.evasion > 0) {
  //         boosts.evasion = 0;
  //       }
  //     },
  //   },
  // },
  // mirrorcoat: {
  //   damageCallback(pokemon) {
  //     if (!pokemon.volatiles['mirrorcoat']) { return 0; }
  //     return pokemon.volatiles['mirrorcoat'].damage || 1;
  //   },
  //   beforeTurnCallback(pokemon) {
  //     pokemon.addVolatile('mirrorcoat');
  //   },
  //   onTryHit(target, source, move) {
  //     if (!source.volatiles['mirrorcoat']) { return false; }
  //     if (source.volatiles['mirrorcoat'].position === null) { return false; }
  //   },
  //   effect: {
  //     onStart(target, source, move) {
  //       this.effectData.position = null;
  //       this.effectData.damage = 0;
  //     },
  //     onRedirectTarget(target, source, source2) {
  //       if (source !== this.effectData.target) { return; }
  //       return source.side.foe.active[this.effectData.position];
  //     },
  //     onDamagingHit(damage, target, source, move) {
  //       if (source.side !== target.side && this.getCategory(move) === 'Special') {
  //         this.effectData.position = source.position;
  //         this.effectData.damage = 2 * damage;
  //       }
  //     },
  //   },
  // },
  // mirrormove: {
  //   onTryHit(target, pokemon) {
  //     const move = target.lastMove;
  //     if (!move || !move.flags['mirror'] || move.isZ || move.isMax) {
  //       return false;
  //     }
  //     this.useMove(move.id, pokemon, target);
  //     return null;
  //   },
  // },
  // mist: {
  //   effect: {
  //     onBoost(boost, target, source, effect) {
  //       if (effect.effectType === 'Move' && effect.infiltrates && target.side !== source.side) { return; }
  //       if (source && target !== source) {
  //         let showMsg = false;
  //         let i;
  //         for (i in boost) {
  //           if (boost[i] < 0) {
  //             delete boost[i];
  //             showMsg = true;
  //           }
  //         }
  //         if (showMsg && !effect.secondaries) {
  //           this.add('-activate', target, 'move: Mist');
  //         }
  //       }
  //     },
  //     onStart(side) {
  //       this.add('-sidestart', side, 'Mist');
  //     },
  //     onEnd(side) {
  //       this.add('-sideend', side, 'Mist');
  //     },
  //   },
  // },
  // mistyterrain: {
  //   effect: {
  //     durationCallback(source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasItem('terrainextender')) {
  //         return 8;
  //       }
  //       return 5;
  //     },
  //     onSetStatus(status, target, source, effect) {
  //       if (!target.isGrounded() || target.isSemiInvulnerable()) { return; }
  //       if (effect && (effect.status || effect.id === 'yawn')) {
  //         this.add('-activate', target, 'move: Misty Terrain');
  //       }
  //       return false;
  //     },
  //     onTryAddVolatile(status, target, source, effect) {
  //       if (!target.isGrounded() || target.isSemiInvulnerable()) { return; }
  //       if (status.id === 'confusion') {
  //         if (effect.effectType === 'Move' && !effect.secondaries) { this.add('-activate', target, 'move: Misty Terrain'); }
  //         return null;
  //       }
  //     },
  //     onBasePower(basePower, attacker, defender, move) {
  //       if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
  //         this.debug('misty terrain weaken');
  //         return this.chainModify(0.5);
  //       }
  //     },
  //     onStart(battle, source, effect) {
  //       if ((effect === null || effect === void 0 ? void 0 : effect.effectType) === 'Ability') {
  //         this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect, '[of] ' + source);
  //       } else {
  //         this.add('-fieldstart', 'move: Misty Terrain');
  //       }
  //     },
  //     onEnd(side) {
  //       this.add('-fieldend', 'Misty Terrain');
  //     },
  //   },
  // },
  // moonlight: {
  //   onHit(pokemon) {
  //     let factor = 0.5;
  //     switch (pokemon.effectiveWeather()) {
  //     case 'sunnyday':
  //     case 'desolateland':
  //       factor = 0.667;
  //       break;
  //     case 'raindance':
  //     case 'primordialsea':
  //     case 'sandstorm':
  //     case 'hail':
  //       factor = 0.25;
  //       break;
  //     }
  //     return !!this.heal(this.modify(pokemon.maxhp, factor));
  //   },
  // },
  // morningsun: {
  //   onHit(pokemon) {
  //     let factor = 0.5;
  //     switch (pokemon.effectiveWeather()) {
  //     case 'sunnyday':
  //     case 'desolateland':
  //       factor = 0.667;
  //       break;
  //     case 'raindance':
  //     case 'primordialsea':
  //     case 'sandstorm':
  //     case 'hail':
  //       factor = 0.25;
  //       break;
  //     }
  //     return !!this.heal(this.modify(pokemon.maxhp, factor));
  //   },
  // },
  // mudsport: {
  //   effect: {
  //     onStart(side, source) {
  //       this.add('-fieldstart', 'move: Mud Sport', '[of] ' + source);
  //     },
  //     onBasePower(basePower, attacker, defender, move) {
  //       if (move.type === 'Electric') {
  //         this.debug('mud sport weaken');
  //         return this.chainModify([0x548, 0x1000]);
  //       }
  //     },
  //     onEnd() {
  //       this.add('-fieldend', 'move: Mud Sport');
  //     },
  //   },
  // },
  // multiattack: {
  //   onModifyType(move, pokemon) {
  //     if (pokemon.ignoringItem()) { return; }
  //     move.type = this.runEvent('Memory', pokemon, null, move, 'Normal');
  //   },
  // },
  // naturalgift: {
  //   onModifyType(move, pokemon) {
  //     if (pokemon.ignoringItem()) { return; }
  //     const item = pokemon.getItem();
  //     if (!item.naturalGift) { return; }
  //     move.type = item.naturalGift.type;
  //   },
  //   onPrepareHit(target, pokemon, move) {
  //     if (pokemon.ignoringItem()) { return false; }
  //     const item = pokemon.getItem();
  //     if (!item.naturalGift) { return false; }
  //     move.basePower = item.naturalGift.basePower;
  //     pokemon.setItem('');
  //     pokemon.lastItem = item.id;
  //     pokemon.usedItemThisTurn = true;
  //     this.runEvent('AfterUseItem', pokemon, null, null, item);
  //   },
  // },
  // naturepower: {
  //   onTryHit(target, pokemon) {
  //     let move = 'triattack';
  //     if (this.field.isTerrain('electricterrain')) {
  //       move = 'thunderbolt';
  //     } else if (this.field.isTerrain('grassyterrain')) {
  //       move = 'energyball';
  //     } else if (this.field.isTerrain('mistyterrain')) {
  //       move = 'moonblast';
  //     } else if (this.field.isTerrain('psychicterrain')) {
  //       move = 'psychic';
  //     }
  //     this.useMove(move, pokemon, target);
  //     return null;
  //   },
  // },
  // naturesmadness: {
  //   damageCallback(pokemon, target) {
  //     return this.dex.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1);
  //   },
  // },
  // nightmare: {
  //   effect: {
  //     onStart(pokemon) {
  //       if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) {
  //         return false;
  //       }
  //       this.add('-start', pokemon, 'Nightmare');
  //     },
  //     onResidual(pokemon) {
  //       this.damage(pokemon.baseMaxhp / 4);
  //     },
  //   },
  // },
  // noretreat: {
  //   onTryHit(target, source, move) {
  //     if (target.volatiles['noretreat']) { return false; }
  //     if (target.volatiles['trapped']) {
  //       delete move.volatileStatus;
  //     }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'move: No Retreat');
  //     },
  //     onTrapPokemon(pokemon) {
  //       pokemon.tryTrap();
  //     },
  //   },
  // },
  // obstruct: {
  //   onTryHit(pokemon) {
  //     return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
  //   },
  //   onHit(pokemon) {
  //     pokemon.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'Protect');
  //     },
  //     onTryHit(target, source, move) {
  //       if (!move.flags['protect'] || move.category === 'Status') {
  //         if (move.isZ || move.isMax) { target.getMoveHitData(move).zBrokeProtect = true; }
  //         return;
  //       }
  //       if (move.smartTarget) {
  //         move.smartTarget = false;
  //       } else {
  //         this.add('-activate', target, 'move: Protect');
  //       }
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       if (move.flags['contact']) {
  //         this.boost({def: -2}, source, target, this.dex.getActiveMove("Obstruct"));
  //       }
  //       return this.NOT_FAIL;
  //     },
  //     onHit(target, source, move) {
  //       if (move.isZOrMaxPowered && move.flags['contact']) {
  //         this.boost({def: -2}, source, target, this.dex.getActiveMove("Obstruct"));
  //       }
  //     },
  //   },
  // },
  // octolock: {
  //   onTryImmunity(target) {
  //     return this.dex.getImmunity('trapped', target);
  //   },
  //   effect: {
  //     onStart(pokemon, source) {
  //       this.add('-start', pokemon, 'move: Octolock', '[of] ' + source);
  //     },
  //     onResidual(pokemon) {
  //       const source = this.effectData.source;
  //       if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
  //         delete pokemon.volatiles['octolock'];
  //         this.add('-end', pokemon, 'Octolock', '[partiallytrapped]', '[silent]');
  //         return;
  //       }
  //       this.boost({def: -1, spd: -1}, pokemon, source, this.dex.getActiveMove('octolock'));
  //     },
  //     onTrapPokemon(pokemon) {
  //       if (this.effectData.source && this.effectData.source.isActive) { pokemon.tryTrap(); }
  //     },
  //   },
  // },
  // odorsleuth: {
  //   onTryHit(target) {
  //     if (target.volatiles['miracleeye']) { return false; }
  //   },
  // },
  // outrage: {
  //   onAfterMove(pokemon) {
  //     if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
  //       pokemon.removeVolatile('lockedmove');
  //     }
  //   },
  // },
  // painsplit: {
  //   onHit(target, pokemon) {
  //     const targetHP = target.getUndynamaxedHP();
  //     const averagehp = Math.floor((targetHP + pokemon.hp) / 2) || 1;
  //     const targetChange = targetHP - averagehp;
  //     target.sethp(target.hp - targetChange);
  //     this.add('-sethp', target, target.getHealth, '[from] move: Pain Split', '[silent]');
  //     pokemon.sethp(averagehp);
  //     this.add('-sethp', pokemon, pokemon.getHealth, '[from] move: Pain Split');
  //   },
  // },
  // partingshot: {
  //   onHit(target, source, move) {
  //     const success = this.boost({atk: -1, spa: -1}, target, source);
  //     if (!success && !target.hasAbility('mirrorarmor')) {
  //       delete move.selfSwitch;
  //     }
  //   },
  // },
  // payback: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (target.newlySwitched || this.queue.willMove(target)) {
  //       this.debug('Payback NOT boosted');
  //       return move.basePower;
  //     }
  //     this.debug('Payback damage boost');
  //     return move.basePower * 2;
  //   },
  // },
  // payday: {
  //   onHit() {
  //     this.add('-fieldactivate', 'move: Pay Day');
  //   },
  // },
  // perishsong: {
  //   onHitField(target, source, move) {
  //     let result = false;
  //     let message = false;
  //     for (const pokemon of this.getAllActive()) {
  //       if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
  //         this.add('-miss', source, pokemon);
  //         result = true;
  //       } else if (this.runEvent('TryHit', pokemon, source, move) === null) {
  //         result = true;
  //       } else if (!pokemon.volatiles['perishsong']) {
  //         pokemon.addVolatile('perishsong');
  //         this.add('-start', pokemon, 'perish3', '[silent]');
  //         result = true;
  //         message = true;
  //       }
  //     }
  //     if (!result) { return false; }
  //     if (message) { this.add('-fieldactivate', 'move: Perish Song'); }
  //   },
  //   effect: {
  //     onEnd(target) {
  //       this.add('-start', target, 'perish0');
  //       target.faint();
  //     },
  //     onResidual(pokemon) {
  //       const duration = pokemon.volatiles['perishsong'].duration;
  //       this.add('-start', pokemon, 'perish' + duration);
  //     },
  //   },
  // },
  // petaldance: {
  //   onAfterMove(pokemon) {
  //     if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
  //       pokemon.removeVolatile('lockedmove');
  //     }
  //   },
  // },
  // phantomforce: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  // },
  // photongeyser: {
  //   onModifyMove(move, pokemon) {
  //     if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) { move.category = 'Physical'; }
  //   },
  // },
  // pikapapow: {
  //   basePowerCallback(pokemon) {
  //     return Math.floor((pokemon.happiness * 10) / 25) || 1;
  //   },
  // },
  // pluck: {
  //   onHit(target, source) {
  //     const item = target.getItem();
  //     if (source.hp && item.isBerry && target.takeItem(source)) {
  //       this.add('-enditem', target, item.name, '[from] stealeat', '[move] Pluck', '[of] ' + source);
  //       if (this.singleEvent('Eat', item, null, source, null, null)) {
  //         this.runEvent('EatItem', source, null, null, item);
  //         if (item.id === 'leppaberry') { target.staleness = 'external'; }
  //       }
  //       if (item.onEat) { source.ateBerry = true; }
  //     }
  //   },
  // },
  // pollenpuff: {
  //   onTryHit(target, source, move) {
  //     if (source.side === target.side) {
  //       move.basePower = 0;
  //     }
  //   },
  //   onHit(target, source) {
  //     if (source.side === target.side) {
  //       this.heal(Math.floor(target.baseMaxhp * 0.5));
  //     }
  //   },
  // },
  // powder: {
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'Powder');
  //     },
  //     onTryMove(pokemon, target, move) {
  //       if (move.type === 'Fire') {
  //         this.add('-activate', pokemon, 'move: Powder');
  //         this.damage(this.dex.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
  //         return false;
  //       }
  //     },
  //   },
  // },
  // powersplit: {
  //   onHit(target, source) {
  //     const newatk = Math.floor((target.storedStats.atk + source.storedStats.atk) / 2);
  //     target.storedStats.atk = newatk;
  //     source.storedStats.atk = newatk;
  //     const newspa = Math.floor((target.storedStats.spa + source.storedStats.spa) / 2);
  //     target.storedStats.spa = newspa;
  //     source.storedStats.spa = newspa;
  //     this.add('-activate', source, 'move: Power Split', '[of] ' + target);
  //   },
  // },
  // powerswap: {
  //   onHit(target, source) {
  //     const targetBoosts = {};
  //     const sourceBoosts = {};
  //     const atkSpa = ['atk', 'spa'];
  //     for (const stat of atkSpa) {
  //       targetBoosts[stat] = target.boosts[stat];
  //       sourceBoosts[stat] = source.boosts[stat];
  //     }
  //     source.setBoost(targetBoosts);
  //     target.setBoost(sourceBoosts);
  //     this.add('-swapboost', source, target, 'atk, spa', '[from] move: Power Swap');
  //   },
  // },
  // powertrick: {
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'Power Trick');
  //       const newatk = pokemon.storedStats.def;
  //       const newdef = pokemon.storedStats.atk;
  //       pokemon.storedStats.atk = newatk;
  //       pokemon.storedStats.def = newdef;
  //     },
  //     onCopy(pokemon) {
  //       const newatk = pokemon.storedStats.def;
  //       const newdef = pokemon.storedStats.atk;
  //       pokemon.storedStats.atk = newatk;
  //       pokemon.storedStats.def = newdef;
  //     },
  //     onEnd(pokemon) {
  //       this.add('-end', pokemon, 'Power Trick');
  //       const newatk = pokemon.storedStats.def;
  //       const newdef = pokemon.storedStats.atk;
  //       pokemon.storedStats.atk = newatk;
  //       pokemon.storedStats.def = newdef;
  //     },
  //     onRestart(pokemon) {
  //       pokemon.removeVolatile('Power Trick');
  //     },
  //   },
  // },
  // powertrip: {
  //   basePowerCallback(pokemon, target, move) {
  //     return move.basePower + 20 * pokemon.positiveBoosts();
  //   },
  // },
  // present: {
  //   onModifyMove(move, pokemon, target) {
  //     const rand = this.random(10);
  //     if (rand < 2) {
  //       move.heal = [1, 4];
  //     } else if (rand < 6) {
  //       move.basePower = 40;
  //     } else if (rand < 9) {
  //       move.basePower = 80;
  //     } else {
  //       move.basePower = 120;
  //     }
  //   },
  // },
  // protect: {
  //   onPrepareHit(pokemon) {
  //     return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
  //   },
  //   onHit(pokemon) {
  //     pokemon.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'Protect');
  //     },
  //     onTryHit(target, source, move) {
  //       if (!move.flags['protect']) {
  //         if (move.isZ || move.isMax) { target.getMoveHitData(move).zBrokeProtect = true; }
  //         return;
  //       }
  //       if (move.smartTarget) {
  //         move.smartTarget = false;
  //       } else {
  //         this.add('-activate', target, 'move: Protect');
  //       }
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       return this.NOT_FAIL;
  //     },
  //   },
  // },
  // psychup: {
  //   onHit(target, source) {
  //     let i;
  //     for (i in target.boosts) {
  //       source.boosts[i] = target.boosts[i];
  //     }
  //     const volatilesToCopy = ['focusenergy', 'gmaxchistrike', 'laserfocus'];
  //     for (const volatile of volatilesToCopy) {
  //       if (target.volatiles[volatile]) {
  //         source.addVolatile(volatile);
  //         if (volatile === 'gmaxchistrike') { source.volatiles[volatile].layers = target.volatiles[volatile].layers; }
  //       } else {
  //         source.removeVolatile(volatile);
  //       }
  //     }
  //     this.add('-copyboost', source, target, '[from] move: Psych Up');
  //   },
  // },
  // psychicfangs: {
  //   onTryHit(pokemon) {
  //     // will shatter screens through sub, before you hit
  //     if (pokemon.runImmunity('Psychic')) {
  //       pokemon.side.removeSideCondition('reflect');
  //       pokemon.side.removeSideCondition('lightscreen');
  //       pokemon.side.removeSideCondition('auroraveil');
  //     }
  //   },
  // },
  // psychicterrain: {
  //   effect: {
  //     durationCallback(source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasItem('terrainextender')) {
  //         return 8;
  //       }
  //       return 5;
  //     },
  //     onTryHit(target, source, effect) {
  //       if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
  //         return;
  //       }
  //       if (target.isSemiInvulnerable() || target.side === source.side) { return; }
  //       if (!target.isGrounded()) {
  //         const baseMove = this.dex.getMove(effect.id);
  //         if (baseMove.priority > 0) {
  //           this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
  //         }
  //         return;
  //       }
  //       this.add('-activate', target, 'move: Psychic Terrain');
  //       return null;
  //     },
  //     onBasePower(basePower, attacker, defender, move) {
  //       if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
  //         this.debug('psychic terrain boost');
  //         return this.chainModify([0x14CD, 0x1000]);
  //       }
  //     },
  //     onStart(battle, source, effect) {
  //       if ((effect === null || effect === void 0 ? void 0 : effect.effectType) === 'Ability') {
  //         this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect, '[of] ' + source);
  //       } else {
  //         this.add('-fieldstart', 'move: Psychic Terrain');
  //       }
  //     },
  //     onEnd() {
  //       this.add('-fieldend', 'move: Psychic Terrain');
  //     },
  //   },
  // },
  // psychoshift: {
  //   onPrepareHit(target, source, move) {
  //     if (!source.status) { return false; }
  //     move.status = source.status;
  //   },
  //   self: {
  //     onHit(pokemon) {
  //       pokemon.cureStatus();
  //     },
  //   },
  // },
  // psywave: {
  //   damageCallback(pokemon) {
  //     return (this.random(50, 151) * pokemon.level) / 100;
  //   },
  // },
  // punishment: {
  //   basePowerCallback(pokemon, target) {
  //     let power = 60 + 20 * target.positiveBoosts();
  //     if (power > 200) { power = 200; }
  //     return power;
  //   },
  // },
  // purify: {
  //   onHit(target, source) {
  //     if (!target.cureStatus()) { return false; }
  //     this.heal(Math.ceil(source.maxhp * 0.5), source);
  //   },
  // },
  // pursuit: {
  //   basePowerCallback(pokemon, target, move) {
  //     // You can't get here unless the pursuit succeeds
  //     if (target.beingCalledBack) {
  //       this.debug('Pursuit damage boost');
  //       return move.basePower * 2;
  //     }
  //     return move.basePower;
  //   },
  //   beforeTurnCallback(pokemon) {
  //     for (const side of this.sides) {
  //       if (side === pokemon.side) { continue; }
  //       side.addSideCondition('pursuit', pokemon);
  //       const data = side.getSideConditionData('pursuit');
  //       if (!data.sources) {
  //         data.sources = [];
  //       }
  //       data.sources.push(pokemon);
  //     }
  //   },
  //   onModifyMove(move, source, target) {
  //     if (target === null || target === void 0 ? void 0 : target.beingCalledBack) { move.accuracy = true; }
  //   },
  //   onTryHit(target, pokemon) {
  //     target.side.removeSideCondition('pursuit');
  //   },
  //   effect: {
  //     onBeforeSwitchOut(pokemon) {
  //       this.debug('Pursuit start');
  //       let alreadyAdded = false;
  //       pokemon.removeVolatile('destinybond');
  //       for (const source of this.effectData.sources) {
  //         if (!this.queue.cancelMove(source) || !source.hp) { continue; }
  //         if (!alreadyAdded) {
  //           this.add('-activate', pokemon, 'move: Pursuit');
  //           alreadyAdded = true;
  //         }
  //         // Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
  //         // If it is, then Mega Evolve before moving.
  //         if (source.canMegaEvo || source.canUltraBurst) {
  //           for (const [actionIndex, action] of this.queue.entries()) {
  //             if (action.pokemon === source && action.choice === 'megaEvo') {
  //               this.runMegaEvo(source);
  //               this.queue.splice(actionIndex, 1);
  //               break;
  //             }
  //           }
  //         }
  //         this.runMove('pursuit', source, this.getTargetLoc(pokemon, source));
  //       }
  //     },
  //   },
  // },
  // quash: {
  //   onHit(target) {
  //     if (target.side.active.length < 2) { return false; } // fails in singles
  //     const action = this.queue.willMove(target);
  //     if (!action) { return false; }
  //     action.order = 201;
  //     this.add('-activate', target, 'move: Quash');
  //   },
  // },
  // quickguard: {
  //   onTryHitSide(side, source) {
  //     return !!this.queue.willAct();
  //   },
  //   onHitSide(side, source) {
  //     source.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target, source) {
  //       this.add('-singleturn', source, 'Quick Guard');
  //     },
  //     onTryHit(target, source, move) {
  //       // Quick Guard blocks moves with positive priority, even those given increased priority by Prankster or Gale Wings.
  //       // (e.g. it blocks 0 priority moves boosted by Prankster or Gale Wings; Quick Claw/Custap Berry do not count)
  //       if (move.priority <= 0.1) { return; }
  //       if (!move.flags['protect']) {
  //         if (move.isZ || move.isMax) { target.getMoveHitData(move).zBrokeProtect = true; }
  //         return;
  //       }
  //       this.add('-activate', target, 'move: Quick Guard');
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       return this.NOT_FAIL;
  //     },
  //   },
  // },
  // rage: {
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singlemove', pokemon, 'Rage');
  //     },
  //     onHit(target, source, move) {
  //       if (target !== source && move.category !== 'Status') {
  //         this.boost({atk: 1});
  //       }
  //     },
  //     onBeforeMove(pokemon) {
  //       this.debug('removing Rage before attack');
  //       pokemon.removeVolatile('rage');
  //     },
  //   },
  // },
  // ragepowder: {
  //   onTryHit(target) {
  //     if (target.side.active.length < 2) { return false; }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singleturn', pokemon, 'move: Rage Powder');
  //     },
  //     onFoeRedirectTarget(target, source, source2, move) {
  //       const ragePowderUser = this.effectData.target;
  //       if (ragePowderUser.isSkyDropped()) { return; }
  //       if (source.runStatusImmunity('powder') && this.validTarget(ragePowderUser, source, move.target)) {
  //         if (move.smartTarget) { move.smartTarget = false; }
  //         this.debug("Rage Powder redirected target of move");
  //         return ragePowderUser;
  //       }
  //     },
  //   },
  // },
  // rapidspin: {
  //   onAfterHit(target, pokemon) {
  //     if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
  //       this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
  //     }
  //     const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
  //     for (const condition of sideConditions) {
  //       if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
  //         this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
  //       }
  //     }
  //     if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
  //       pokemon.removeVolatile('partiallytrapped');
  //     }
  //   },
  //   onAfterSubDamage(damage, target, pokemon) {
  //     if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
  //       this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
  //     }
  //     const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
  //     for (const condition of sideConditions) {
  //       if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
  //         this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
  //       }
  //     }
  //     if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
  //       pokemon.removeVolatile('partiallytrapped');
  //     }
  //   },
  // },
  // razorwind: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  // },
  // recycle: {
  //   onHit(pokemon) {
  //     if (pokemon.item || !pokemon.lastItem) { return false; }
  //     const item = pokemon.lastItem;
  //     pokemon.lastItem = '';
  //     this.add('-item', pokemon, this.dex.getItem(item), '[from] move: Recycle');
  //     pokemon.setItem(item);
  //   },
  // },
  // reflect: {
  //   effect: {
  //     durationCallback(target, source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasItem('lightclay')) {
  //         return 8;
  //       }
  //       return 5;
  //     },
  //     onAnyModifyDamage(damage, source, target, move) {
  //       if (target !== source && target.side === this.effectData.target && this.getCategory(move) === 'Physical') {
  //         if (!target.getMoveHitData(move).crit && !move.infiltrates) {
  //           this.debug('Reflect weaken');
  //           if (target.side.active.length > 1) { return this.chainModify([0xAAC, 0x1000]); }
  //           return this.chainModify(0.5);
  //         }
  //       }
  //     },
  //     onStart(side) {
  //       this.add('-sidestart', side, 'Reflect');
  //     },
  //     onEnd(side) {
  //       this.add('-sideend', side, 'Reflect');
  //     },
  //   },
  // },
  // reflecttype: {
  //   onHit(target, source) {
  //     if (source.species && (source.species.num === 493 || source.species.num === 773)) { return false; }
  //     let newBaseTypes = target.getTypes(true).filter(type => type !== '???');
  //     if (!newBaseTypes.length) {
  //       if (target.addedType) {
  //         newBaseTypes = ['Normal'];
  //       } else {
  //         return false;
  //       }
  //     }
  //     this.add('-start', source, 'typechange', '[from] move: Reflect Type', '[of] ' + target);
  //     source.setType(newBaseTypes);
  //     source.addedType = target.addedType;
  //     source.knownType = target.side === source.side && target.knownType;
  //   },
  // },
  // refresh: {
  //   onHit(pokemon) {
  //     if (['', 'slp', 'frz'].includes(pokemon.status)) { return false; }
  //     pokemon.cureStatus();
  //   },
  // },
  // relicsong: {
  //   onHit(target, pokemon, move) {
  //     if (pokemon.baseSpecies.baseSpecies === 'Meloetta' && !pokemon.transformed) {
  //       move.willChangeForme = true;
  //     }
  //   },
  //   onAfterMoveSecondarySelf(pokemon, target, move) {
  //     if (move.willChangeForme) {
  //       const meloettaForme = pokemon.species.id === 'meloettapirouette' ? '' : '-Pirouette';
  //       pokemon.formeChange('Meloetta' + meloettaForme, this.effect, false, '[msg]');
  //     }
  //   },
  // },
  // rest: {
  //   onTryMove(pokemon) {
  //     if (pokemon.hp === pokemon.maxhp) {
  //       this.add('-fail', pokemon, 'heal');
  //       return null;
  //     }
  //     if (pokemon.status === 'slp' || pokemon.hasAbility('comatose')) {
  //       this.add('-fail', pokemon);
  //       return null;
  //     }
  //   },
  //   onHit(target, source, move) {
  //     if (!target.setStatus('slp', source, move)) { return false; }
  //     target.statusData.time = 3;
  //     target.statusData.startTime = 3;
  //     this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
  //   },
  // },
  // retaliate: {
  //   onBasePower(basePower, pokemon) {
  //     if (pokemon.side.faintedLastTurn) {
  //       this.debug('Boosted for a faint last turn');
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // return: {
  //   basePowerCallback(pokemon) {
  //     return Math.floor((pokemon.happiness * 10) / 25) || 1;
  //   },
  // },
  // revelationdance: {
  //   onModifyType(move, pokemon) {
  //     let type = pokemon.types[0];
  //     if (type === "Bird") { type = "???"; }
  //     move.type = type;
  //   },
  // },
  // revenge: {
  //   basePowerCallback(pokemon, target, move) {
  //     const damagedByTarget = pokemon.attackedBy.some(p => p.source === target && p.damage > 0 && p.thisTurn);
  //     if (damagedByTarget) {
  //       this.debug('Boosted for getting hit by ' + target);
  //       return move.basePower * 2;
  //     }
  //     return move.basePower;
  //   },
  // },
  // reversal: {
  //   basePowerCallback(pokemon, target) {
  //     const ratio = pokemon.hp * 48 / pokemon.maxhp;
  //     if (ratio < 2) {
  //       return 200;
  //     }
  //     if (ratio < 5) {
  //       return 150;
  //     }
  //     if (ratio < 10) {
  //       return 100;
  //     }
  //     if (ratio < 17) {
  //       return 80;
  //     }
  //     if (ratio < 33) {
  //       return 40;
  //     }
  //     return 20;
  //   },
  // },
  // roleplay: {
  //   onTryHit(target, source) {
  //     if (target.ability === source.ability) { return false; }
  //     const bannedTargetAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'neutralizinggas', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'wonderguard', 'zenmode',
  //     ];
  //     const bannedSourceAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange',
  //     ];
  //     if (bannedTargetAbilities.includes(target.ability) || bannedSourceAbilities.includes(source.ability)) {
  //       return false;
  //     }
  //   },
  //   onHit(target, source) {
  //     const oldAbility = source.setAbility(target.ability);
  //     if (oldAbility) {
  //       this.add('-ability', source, source.getAbility().name, '[from] move: Role Play', '[of] ' + target);
  //       return;
  //     }
  //     return false;
  //   },
  // },
  // rollout: {
  //   basePowerCallback(pokemon, target, move) {
  //     let bp = move.basePower;
  //     if (pokemon.volatiles.rollout && pokemon.volatiles.rollout.hitCount) {
  //       bp *= Math.pow(2, pokemon.volatiles.rollout.hitCount);
  //     }
  //     if (pokemon.status !== 'slp') { pokemon.addVolatile('rollout'); }
  //     if (pokemon.volatiles.defensecurl) {
  //       bp *= 2;
  //     }
  //     this.debug("Rollout bp: " + bp);
  //     return bp;
  //   },
  //   effect: {
  //     onStart() {
  //       this.effectData.hitCount = 1;
  //     },
  //     onRestart() {
  //       this.effectData.hitCount++;
  //       if (this.effectData.hitCount < 5) {
  //         this.effectData.duration = 2;
  //       }
  //     },
  //     onResidual(target) {
  //       if (target.lastMove && target.lastMove.id === 'struggle') {
  //         // don't lock
  //         delete target.volatiles['rollout'];
  //       }
  //     },
  //   },
  // },
  // roost: {
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'move: Roost');
  //     },
  //     onType(types, pokemon) {
  //       this.effectData.typeWas = types;
  //       return types.filter(type => type !== 'Flying');
  //     },
  //   },
  // },
  // rototiller: {
  //   onHitField(target, source) {
  //     const targets = [];
  //     let anyAirborne = false;
  //     for (const pokemon of this.getAllActive()) {
  //       if (!pokemon.runImmunity('Ground')) {
  //         this.add('-immune', pokemon);
  //         anyAirborne = true;
  //         continue;
  //       }
  //       if (pokemon.hasType('Grass')) {
  //         // This move affects every grounded Grass-type Pokemon in play.
  //         targets.push(pokemon);
  //       }
  //     }
  //     if (!targets.length && !anyAirborne) { return false; } // Fails when there are no grounded Grass types or airborne Pokemon
  //     for (const pokemon of targets) {
  //       this.boost({atk: 1, spa: 1}, pokemon, source);
  //     }
  //   },
  // },
  // round: {
  //   basePowerCallback(target, source, move) {
  //     if (move.sourceEffect === 'round') {
  //       return move.basePower * 2;
  //     }
  //     return move.basePower;
  //   },
  //   onTry(target, source, move) {
  //     let _a;
  //     for (const action of this.queue) {
  //       // @ts-ignore
  //       if (!action.pokemon || !action.move || action.maxMove || action.zmove) { continue; }
  //       // @ts-ignore
  //       if (((_a = action.move) === null || _a === void 0 ? void 0 : _a.id) === 'round') {
  //         // @ts-ignore
  //         this.queue.prioritizeAction(action, move);
  //         return;
  //       }
  //     }
  //   },
  // },
  // safeguard: {
  //   effect: {
  //     durationCallback(target, source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasAbility('persistent')) {
  //         this.add('-activate', source, 'ability: Persistent', effect);
  //         return 7;
  //       }
  //       return 5;
  //     },
  //     onSetStatus(status, target, source, effect) {
  //       if (!effect || !source) { return; }
  //       if (effect.id === 'yawn') { return; }
  //       if (effect.effectType === 'Move' && effect.infiltrates && target.side !== source.side) { return; }
  //       if (target !== source) {
  //         this.debug('interrupting setStatus');
  //         if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
  //           this.add('-activate', target, 'move: Safeguard');
  //         }
  //         return null;
  //       }
  //     },
  //     onTryAddVolatile(status, target, source, effect) {
  //       if (!effect || !source) { return; }
  //       if (effect.effectType === 'Move' && effect.infiltrates && target.side !== source.side) { return; }
  //       if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
  //         if (effect.effectType === 'Move' && !effect.secondaries) { this.add('-activate', target, 'move: Safeguard'); }
  //         return null;
  //       }
  //     },
  //     onStart(side) {
  //       this.add('-sidestart', side, 'Safeguard');
  //     },
  //     onEnd(side) {
  //       this.add('-sideend', side, 'Safeguard');
  //     },
  //   },
  // },
  // sappyseed: {
  //   onHit(target, source) {
  //     if (target.hasType('Grass')) { return null; }
  //     target.addVolatile('leechseed', source);
  //   },
  // },
  // secretpower: {
  //   onModifyMove(move, pokemon) {
  //     if (this.field.isTerrain('')) { return; }
  //     move.secondaries = [];
  //     if (this.field.isTerrain('electricterrain')) {
  //       move.secondaries.push({
  //         chance: 30,
  //         status: 'par',
  //       });
  //     } else if (this.field.isTerrain('grassyterrain')) {
  //       move.secondaries.push({
  //         chance: 30,
  //         status: 'slp',
  //       });
  //     } else if (this.field.isTerrain('mistyterrain')) {
  //       move.secondaries.push({
  //         chance: 30,
  //         boosts: {
  //           spa: -1,
  //         },
  //       });
  //     } else if (this.field.isTerrain('psychicterrain')) {
  //       move.secondaries.push({
  //         chance: 30,
  //         boosts: {
  //           spe: -1,
  //         },
  //       });
  //     }
  //   },
  // },
  // shadowforce: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  // },
  // shelltrap: {
  //   beforeTurnCallback(pokemon) {
  //     pokemon.addVolatile('shelltrap');
  //   },
  //   onTryMove(pokemon) {
  //     if (!pokemon.volatiles['shelltrap'] || !pokemon.volatiles['shelltrap'].gotHit) {
  //       this.attrLastMove('[still]');
  //       this.add('cant', pokemon, 'Shell Trap', 'Shell Trap');
  //       return null;
  //     }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singleturn', pokemon, 'move: Shell Trap');
  //     },
  //     onHit(pokemon, source, move) {
  //       if (pokemon.side !== source.side && move.category === 'Physical') {
  //         pokemon.volatiles['shelltrap'].gotHit = true;
  //         const action = this.queue.willMove(pokemon);
  //         if (action) {
  //           this.queue.prioritizeAction(action);
  //         }
  //       }
  //     },
  //   },
  // },
  // shoreup: {
  //   onHit(pokemon) {
  //     let factor = 0.5;
  //     if (this.field.isWeather('sandstorm')) {
  //       factor = 0.667;
  //     }
  //     return !!this.heal(this.modify(pokemon.maxhp, factor));
  //   },
  // },
  // simplebeam: {
  //   onTryHit(pokemon) {
  //     const bannedAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'simple', 'stancechange', 'truant', 'zenmode',
  //     ];
  //     if (bannedAbilities.includes(pokemon.ability)) {
  //       return false;
  //     }
  //   },
  //   onHit(pokemon) {
  //     const oldAbility = pokemon.setAbility('simple');
  //     if (oldAbility) {
  //       this.add('-ability', pokemon, 'Simple', '[from] move: Simple Beam');
  //       return;
  //     }
  //     return false;
  //   },
  // },
  // sketch: {
  //   onHit(target, source) {
  //     const disallowedMoves = ['chatter', 'sketch', 'struggle'];
  //     const move = target.lastMove;
  //     if (source.transformed || !move || source.moves.includes(move.id)) { return false; }
  //     if (disallowedMoves.includes(move.id) || move.isZ || move.isMax) { return false; }
  //     const sketchIndex = source.moves.indexOf('sketch');
  //     if (sketchIndex < 0) { return false; }
  //     const sketchedMove = {
  //       move: move.name,
  //       id: move.id,
  //       pp: move.pp,
  //       maxpp: move.pp,
  //       target: move.target,
  //       disabled: false,
  //       used: false,
  //     };
  //     source.moveSlots[sketchIndex] = sketchedMove;
  //     source.baseMoveSlots[sketchIndex] = sketchedMove;
  //     this.add('-activate', source, 'move: Sketch', move.name);
  //   },
  // },
  // skillswap: {
  //   onTryHit(target, source) {
  //     const bannedAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'gulpmissile', 'hungerswitch', 'iceface', 'illusion', 'multitype', 'neutralizinggas', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'wonderguard', 'zenmode',
  //     ];
  //     if (target.volatiles['dynamax'] || bannedAbilities.includes(target.ability) || bannedAbilities.includes(source.ability)) {
  //       return false;
  //     }
  //   },
  //   onHit(target, source, move) {
  //     const targetAbility = target.getAbility();
  //     const sourceAbility = source.getAbility();
  //     if (target.side === source.side) {
  //       this.add('-activate', source, 'move: Skill Swap', '', '', '[of] ' + target);
  //     } else {
  //       this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, '[of] ' + target);
  //     }
  //     this.singleEvent('End', sourceAbility, source.abilityData, source);
  //     this.singleEvent('End', targetAbility, target.abilityData, target);
  //     if (targetAbility.id !== sourceAbility.id) {
  //       source.ability = targetAbility.id;
  //       target.ability = sourceAbility.id;
  //       source.abilityData = {id: toID(source.ability), target: source};
  //       target.abilityData = {id: toID(target.ability), target: target};
  //     }
  //     this.singleEvent('Start', targetAbility, source.abilityData, source);
  //     this.singleEvent('Start', sourceAbility, target.abilityData, target);
  //   },
  // },
  // skullbash: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     this.boost({def: 1}, attacker, attacker, move);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  // },
  // skyattack: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  // },
  // skydrop: {
  //   onModifyMove(move, source) {
  //     if (!source.volatiles['skydrop']) {
  //       move.accuracy = true;
  //       move.flags.contact = 0;
  //     }
  //   },
  //   onMoveFail(target, source) {
  //     if (source.volatiles['twoturnmove'] && source.volatiles['twoturnmove'].duration === 1) {
  //       source.removeVolatile('skydrop');
  //       source.removeVolatile('twoturnmove');
  //       this.add('-end', target, 'Sky Drop', '[interrupt]');
  //     }
  //   },
  //   onTryHit(target, source, move) {
  //     if (target.fainted) { return false; }
  //     if (source.removeVolatile(move.id)) {
  //       if (target !== source.volatiles['twoturnmove'].source) { return false; }
  //       if (target.hasType('Flying')) {
  //         this.add('-immune', target);
  //         return null;
  //       }
  //     } else {
  //       if (target.volatiles['substitute'] || target.side === source.side) {
  //         return false;
  //       }
  //       if (target.getWeight() >= 2000) {
  //         this.add('-fail', target, 'move: Sky Drop', '[heavy]');
  //         return null;
  //       }
  //       this.add('-prepare', source, move.name, target);
  //       source.addVolatile('twoturnmove', target);
  //       return null;
  //     }
  //   },
  //   onHit(target, source) {
  //     if (target.hp) { this.add('-end', target, 'Sky Drop'); }
  //   },
  //   effect: {
  //     onAnyDragOut(pokemon) {
  //       if (pokemon === this.effectData.target || pokemon === this.effectData.source) { return false; }
  //     },
  //     onFoeTrapPokemon(defender) {
  //       if (defender !== this.effectData.source) { return; }
  //       defender.trapped = true;
  //     },
  //     onFoeBeforeMove(attacker, defender, move) {
  //       if (attacker === this.effectData.source) {
  //         attacker.activeMoveActions--;
  //         this.debug('Sky drop nullifying.');
  //         return null;
  //       }
  //     },
  //     onRedirectTarget(target, source, source2) {
  //       if (source !== this.effectData.target) { return; }
  //       if (this.effectData.source.fainted) { return; }
  //       return this.effectData.source;
  //     },
  //     onAnyInvulnerability(target, source, move) {
  //       if (target !== this.effectData.target && target !== this.effectData.source) {
  //         return;
  //       }
  //       if (source === this.effectData.target && target === this.effectData.source) {
  //         return;
  //       }
  //       if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
  //         return;
  //       }
  //       return false;
  //     },
  //     onAnyBasePower(basePower, target, source, move) {
  //       if (target !== this.effectData.target && target !== this.effectData.source) {
  //         return;
  //       }
  //       if (source === this.effectData.target && target === this.effectData.source) {
  //         return;
  //       }
  //       if (move.id === 'gust' || move.id === 'twister') {
  //         return this.chainModify(2);
  //       }
  //     },
  //     onFaint(target) {
  //       if (target.volatiles['skydrop'] && target.volatiles['twoturnmove'].source) {
  //         this.add('-end', target.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
  //       }
  //     },
  //   },
  // },
  // sleeptalk: {
  //   onTryHit(pokemon) {
  //     if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) { return false; }
  //   },
  //   onHit(pokemon) {
  //     const noSleepTalk = [
  //       'assist', 'beakblast', 'belch', 'bide', 'celebrate', 'chatter', 'copycat', 'dynamaxcannon', 'focuspunch', 'mefirst', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'shelltrap', 'sketch', 'sleeptalk', 'uproar',
  //     ];
  //     const moves = [];
  //     for (const moveSlot of pokemon.moveSlots) {
  //       const moveid = moveSlot.id;
  //       if (!moveid) { continue; }
  //       const move = this.dex.getMove(moveid);
  //       if (noSleepTalk.includes(moveid) || move.flags['charge'] || (move.isZ && move.basePower !== 1)) {
  //         continue;
  //       }
  //       moves.push(moveid);
  //     }
  //     let randomMove = '';
  //     if (moves.length) { randomMove = this.sample(moves); }
  //     if (!randomMove) {
  //       return false;
  //     }
  //     this.useMove(randomMove, pokemon);
  //   },
  // },
  // smackdown: {
  //   effect: {
  //     onStart(pokemon) {
  //       let applies = false;
  //       if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate')) { applies = true; }
  //       if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] ||
  //                   this.field.getPseudoWeather('gravity')) { applies = false; }
  //       if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
  //         applies = true;
  //         this.queue.cancelMove(pokemon);
  //         pokemon.removeVolatile('twoturnmove');
  //       }
  //       if (pokemon.volatiles['magnetrise']) {
  //         applies = true;
  //         delete pokemon.volatiles['magnetrise'];
  //       }
  //       if (pokemon.volatiles['telekinesis']) {
  //         applies = true;
  //         delete pokemon.volatiles['telekinesis'];
  //       }
  //       if (!applies) { return false; }
  //       this.add('-start', pokemon, 'Smack Down');
  //     },
  //     onRestart(pokemon) {
  //       if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
  //         this.queue.cancelMove(pokemon);
  //         this.add('-start', pokemon, 'Smack Down');
  //       }
  //     },
  //   },
  // },
  // smellingsalts: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (target.status === 'par') { return move.basePower * 2; }
  //     return move.basePower;
  //   },
  //   onHit(target) {
  //     if (target.status === 'par') { target.cureStatus(); }
  //   },
  // },
  // snatch: {
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singleturn', pokemon, 'Snatch');
  //     },
  //     onAnyTryMove(source, target, move) {
  //       const snatchUser = this.effectData.source;
  //       if (snatchUser.isSkyDropped()) { return; }
  //       if (!move || move.isZ || move.isMax || !move.flags['snatch'] || move.sourceEffect === 'snatch') {
  //         return;
  //       }
  //       snatchUser.removeVolatile('snatch');
  //       this.add('-activate', snatchUser, 'move: Snatch', '[of] ' + source);
  //       this.useMove(move.id, snatchUser);
  //       return null;
  //     },
  //   },
  // },
  // snore: {
  //   onTryHit(target, source) {
  //     if (source.status !== 'slp' && !source.hasAbility('comatose')) { return false; }
  //   },
  // },
  // soak: {
  //   onHit(target) {
  //     if (target.getTypes().join() === 'Water' || !target.setType('Water')) {
  //       // Soak should animate even when it fails.
  //       // Returning false would suppress the animation.
  //       this.add('-fail', target);
  //       return null;
  //     }
  //     this.add('-start', target, 'typechange', 'Water');
  //   },
  // },
  // solarbeam: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
  //       this.attrLastMove('[still]');
  //       this.addMove('-anim', attacker, move.name, defender);
  //       return;
  //     }
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  //   onBasePower(basePower, pokemon, target) {
  //     if (['raindance', 'primordialsea', 'sandstorm', 'hail'].includes(pokemon.effectiveWeather())) {
  //       this.debug('weakened by weather');
  //       return this.chainModify(0.5);
  //     }
  //   },
  // },
  // solarblade: {
  //   onTryMove(attacker, defender, move) {
  //     if (attacker.removeVolatile(move.id)) {
  //       return;
  //     }
  //     this.add('-prepare', attacker, move.name, defender);
  //     if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
  //       this.attrLastMove('[still]');
  //       this.addMove('-anim', attacker, move.name, defender);
  //       return;
  //     }
  //     if (!this.runEvent('ChargeMove', attacker, defender, move)) {
  //       return;
  //     }
  //     attacker.addVolatile('twoturnmove', defender);
  //     return null;
  //   },
  //   onBasePower(basePower, pokemon, target) {
  //     if (['raindance', 'primordialsea', 'sandstorm', 'hail'].includes(pokemon.effectiveWeather())) {
  //       this.debug('weakened by weather');
  //       return this.chainModify(0.5);
  //     }
  //   },
  // },
  // sparklingaria: {
  //   secondary: {
  //     onHit(target) {
  //       if (target.status === 'brn') { target.cureStatus(); }
  //     },
  //   },
  // },
  // sparklyswirl: {
  //   self: {
  //     onHit(pokemon, source, move) {
  //       this.add('-activate', source, 'move: Aromatherapy');
  //       for (const ally of source.side.pokemon) {
  //         if (ally !== source && (ally.volatiles['substitute'] && !move.infiltrates)) {
  //           continue;
  //         }
  //         ally.cureStatus();
  //       }
  //     },
  //   },
  // },
  // speedswap: {
  //   onHit(target, source) {
  //     const targetSpe = target.storedStats.spe;
  //     target.storedStats.spe = source.storedStats.spe;
  //     source.storedStats.spe = targetSpe;
  //     this.add('-activate', source, 'move: Speed Swap', '[of] ' + target);
  //   },
  // },
  // spiderweb: {
  //   onHit(target, source, move) {
  //     return target.addVolatile('trapped', source, move, 'trapper');
  //   },
  // },
  // spikes: {
  //   effect: {
  //     onStart(side) {
  //       this.add('-sidestart', side, 'Spikes');
  //       this.effectData.layers = 1;
  //     },
  //     onRestart(side) {
  //       if (this.effectData.layers >= 3) { return false; }
  //       this.add('-sidestart', side, 'Spikes');
  //       this.effectData.layers++;
  //     },
  //     onSwitchIn(pokemon) {
  //       if (!pokemon.isGrounded()) { return; }
  //       if (pokemon.hasItem('heavydutyboots')) { return; }
  //       const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
  //       this.damage(damageAmounts[this.effectData.layers] * pokemon.maxhp / 24);
  //     },
  //   },
  // },
  // spikyshield: {
  //   onTryHit(target, source, move) {
  //     return !!this.queue.willAct() && this.runEvent('StallMove', target);
  //   },
  //   onHit(pokemon) {
  //     pokemon.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-singleturn', target, 'move: Protect');
  //     },
  //     onTryHit(target, source, move) {
  //       if (!move.flags['protect']) {
  //         if (move.isZ || move.isMax) { target.getMoveHitData(move).zBrokeProtect = true; }
  //         return;
  //       }
  //       if (move.smartTarget) {
  //         move.smartTarget = false;
  //       } else {
  //         this.add('-activate', target, 'move: Protect');
  //       }
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       if (move.flags['contact']) {
  //         this.damage(source.baseMaxhp / 8, source, target);
  //       }
  //       return this.NOT_FAIL;
  //     },
  //     onHit(target, source, move) {
  //       if (move.isZOrMaxPowered && move.flags['contact']) {
  //         this.damage(source.baseMaxhp / 8, source, target);
  //       }
  //     },
  //   },
  // },
  // spiritshackle: {
  //   secondary: {
  //     onHit(target, source, move) {
  //       if (source.isActive) { target.addVolatile('trapped', source, move, 'trapper'); }
  //     },
  //   },
  // },
  // spitup: {
  //   basePowerCallback(pokemon) {
  //     if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) { return false; }
  //     return pokemon.volatiles['stockpile'].layers * 100;
  //   },
  //   onTry(pokemon) {
  //     if (!pokemon.volatiles['stockpile']) {
  //       return false;
  //     }
  //   },
  //   onAfterMove(pokemon) {
  //     pokemon.removeVolatile('stockpile');
  //   },
  // },
  // spite: {
  //   onHit(target) {
  //     const move = target.lastMove;
  //     if (!move || move.isZ || move.isMax) { return false; }
  //     const ppDeducted = target.deductPP(move.id, 4);
  //     if (!ppDeducted) { return false; }
  //     this.add("-activate", target, 'move: Spite', move.name, ppDeducted);
  //   },
  // },
  // splash: {
  //   onTryHit(target, source) {
  //     this.add('-nothing');
  //   },
  // },
  // splinteredstormshards: {
  //   onHit() {
  //     this.field.clearTerrain();
  //   },
  // },
  // spotlight: {
  //   onTryHit(target) {
  //     if (target.side.active.length < 2) { return false; }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-singleturn', pokemon, 'move: Spotlight');
  //     },
  //     onFoeRedirectTarget(target, source, source2, move) {
  //       if (this.validTarget(this.effectData.target, source, move.target)) {
  //         this.debug("Spotlight redirected target of move");
  //         return this.effectData.target;
  //       }
  //     },
  //   },
  // },
  // stealthrock: {
  //   effect: {
  //     onStart(side) {
  //       this.add('-sidestart', side, 'move: Stealth Rock');
  //     },
  //     onSwitchIn(pokemon) {
  //       if (pokemon.hasItem('heavydutyboots')) { return; }
  //       const typeMod = this.dex.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
  //       this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
  //     },
  //   },
  // },
  // steelbeam: {
  //   onAfterMove(pokemon, target, move) {
  //     if (move.mindBlownRecoil && !move.multihit) {
  //       this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.getEffect('Steel Beam'), true);
  //     }
  //   },
  // },
  // stickyweb: {
  //   effect: {
  //     onStart(side) {
  //       this.add('-sidestart', side, 'move: Sticky Web');
  //     },
  //     onSwitchIn(pokemon) {
  //       if (!pokemon.isGrounded()) { return; }
  //       if (pokemon.hasItem('heavydutyboots')) { return; }
  //       this.add('-activate', pokemon, 'move: Sticky Web');
  //       this.boost({spe: -1}, pokemon, this.effectData.source, this.dex.getActiveMove('stickyweb'));
  //     },
  //   },
  // },
  // stockpile: {
  //   onTryHit(pokemon) {
  //     if (pokemon.volatiles['stockpile'] && pokemon.volatiles['stockpile'].layers >= 3) { return false; }
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.effectData.layers = 1;
  //       this.effectData.def = 0;
  //       this.effectData.spd = 0;
  //       this.add('-start', target, 'stockpile' + this.effectData.layers);
  //       const [curDef, curSpD] = [target.boosts.def, target.boosts.spd];
  //       this.boost({def: 1, spd: 1}, target, target);
  //       if (curDef !== target.boosts.def) { this.effectData.def--; }
  //       if (curSpD !== target.boosts.spd) { this.effectData.spd--; }
  //     },
  //     onRestart(target) {
  //       if (this.effectData.layers >= 3) { return false; }
  //       this.effectData.layers++;
  //       this.add('-start', target, 'stockpile' + this.effectData.layers);
  //       const curDef = target.boosts.def;
  //       const curSpD = target.boosts.spd;
  //       this.boost({def: 1, spd: 1}, target, target);
  //       if (curDef !== target.boosts.def) { this.effectData.def--; }
  //       if (curSpD !== target.boosts.spd) { this.effectData.spd--; }
  //     },
  //     onEnd(target) {
  //       if (this.effectData.def || this.effectData.spd) {
  //         const boosts = {};
  //         if (this.effectData.def) { boosts.def = this.effectData.def; }
  //         if (this.effectData.spd) { boosts.spd = this.effectData.spd; }
  //         this.boost(boosts, target, target);
  //       }
  //       this.add('-end', target, 'Stockpile');
  //       if (this.effectData.def !== this.effectData.layers * -1 || this.effectData.spd !== this.effectData.layers * -1) {
  //         this.hint("In Gen 7, Stockpile keeps track of how many times it successfully altered each stat individually.");
  //       }
  //     },
  //   },
  // },
  // stompingtantrum: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (pokemon.moveLastTurnResult === false) { return move.basePower * 2; }
  //     return move.basePower;
  //   },
  // },
  // storedpower: {
  //   basePowerCallback(pokemon, target, move) {
  //     return move.basePower + 20 * pokemon.positiveBoosts();
  //   },
  // },
  // strengthsap: {
  //   onHit(target, source) {
  //     if (target.boosts.atk === -6) { return false; }
  //     const atk = target.getStat('atk', false, true);
  //     const success = this.boost({atk: -1}, target, source, null, false, true);
  //     return !!(this.heal(atk, source, target) || success);
  //   },
  // },
  // struggle: {
  //   onModifyMove(move, pokemon, target) {
  //     move.type = '???';
  //     this.add('-activate', pokemon, 'move: Struggle');
  //   },
  // },
  // stuffcheeks: {
  //   onTryHit(target, source, move) {
  //     const item = source.getItem();
  //     if (item.isBerry && source.eatItem(true)) {
  //       this.boost({def: 2}, source, null, null, false, true);
  //     } else {
  //       return false;
  //     }
  //   },
  // },
  // substitute: {
  //   onTryHit(target) {
  //     if (target.volatiles['substitute']) {
  //       this.add('-fail', target, 'move: Substitute');
  //       return null;
  //     }
  //     if (target.hp <= target.maxhp / 4 || target.maxhp === 1) { // Shedinja clause
  //       this.add('-fail', target, 'move: Substitute', '[weak]');
  //       return null;
  //     }
  //   },
  //   onHit(target) {
  //     this.directDamage(target.maxhp / 4);
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-start', target, 'Substitute');
  //       this.effectData.hp = Math.floor(target.maxhp / 4);
  //       if (target.volatiles['partiallytrapped']) {
  //         this.add('-end', target, target.volatiles['partiallytrapped'].sourceEffect, '[partiallytrapped]', '[silent]');
  //         delete target.volatiles['partiallytrapped'];
  //       }
  //     },
  //     onTryPrimaryHit(target, source, move) {
  //       if (target === source || move.flags['authentic'] || move.infiltrates) {
  //         return;
  //       }
  //       let damage = this.getDamage(source, target, move);
  //       if (!damage && damage !== 0) {
  //         this.add('-fail', source);
  //         this.attrLastMove('[still]');
  //         return null;
  //       }
  //       damage = this.runEvent('SubDamage', target, source, move, damage);
  //       if (!damage) {
  //         return damage;
  //       }
  //       if (damage > target.volatiles['substitute'].hp) {
  //         damage = target.volatiles['substitute'].hp;
  //       }
  //       target.volatiles['substitute'].hp -= damage;
  //       source.lastDamage = damage;
  //       if (target.volatiles['substitute'].hp <= 0) {
  //         target.removeVolatile('substitute');
  //       } else {
  //         this.add('-activate', target, 'move: Substitute', '[damage]');
  //       }
  //       if (move.recoil) {
  //         this.damage(this.calcRecoilDamage(damage, move), source, target, 'recoil');
  //       }
  //       if (move.drain) {
  //         this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
  //       }
  //       this.singleEvent('AfterSubDamage', move, null, target, source, move, damage);
  //       this.runEvent('AfterSubDamage', target, source, move, damage);
  //       return this.HIT_SUBSTITUTE;
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'Substitute');
  //     },
  //   },
  // },
  // suckerpunch: {
  //   onTry(source, target) {
  //     const action = this.queue.willMove(target);
  //     const move = (action === null || action === void 0 ? void 0 : action.choice) === 'move' ? action.move : null;
  //     if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles.mustrecharge) {
  //       this.add('-fail', source);
  //       this.attrLastMove('[still]');
  //       return null;
  //     }
  //   },
  // },
  // superfang: {
  //   damageCallback(pokemon, target) {
  //     return this.dex.clampIntRange(target.getUndynamaxedHP() / 2, 1);
  //   },
  // },
  // swallow: {
  //   onTryHit(pokemon) {
  //     if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) { return false; }
  //   },
  //   onHit(pokemon) {
  //     const healAmount = [0.25, 0.5, 1];
  //     const healedBy = this.heal(this.modify(pokemon.maxhp, healAmount[(pokemon.volatiles['stockpile'].layers - 1)]));
  //     pokemon.removeVolatile('stockpile');
  //     return !!healedBy;
  //   },
  // },
  // switcheroo: {
  //   onTryImmunity(target) {
  //     return !target.hasAbility('stickyhold');
  //   },
  //   onHit(target, source, move) {
  //     const yourItem = target.takeItem(source);
  //     const myItem = source.takeItem();
  //     if (target.item || source.item || (!yourItem && !myItem)) {
  //       if (yourItem) { target.item = yourItem.id; }
  //       if (myItem) { source.item = myItem.id; }
  //       return false;
  //     }
  //     if ((myItem && !this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem)) ||
  //               (yourItem && !this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem))) {
  //       if (yourItem) { target.item = yourItem.id; }
  //       if (myItem) { source.item = myItem.id; }
  //       return false;
  //     }
  //     this.add('-activate', source, 'move: Trick', '[of] ' + target);
  //     if (myItem) {
  //       target.setItem(myItem);
  //       this.add('-item', target, myItem, '[from] move: Switcheroo');
  //     } else {
  //       this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
  //     }
  //     if (yourItem) {
  //       source.setItem(yourItem);
  //       this.add('-item', source, yourItem, '[from] move: Switcheroo');
  //     } else {
  //       this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
  //     }
  //   },
  // },
  // synchronoise: {
  //   onTryImmunity(target, source) {
  //     return target.hasType(source.getTypes());
  //   },
  // },
  // synthesis: {
  //   onHit(pokemon) {
  //     let factor = 0.5;
  //     switch (pokemon.effectiveWeather()) {
  //     case 'sunnyday':
  //     case 'desolateland':
  //       factor = 0.667;
  //       break;
  //     case 'raindance':
  //     case 'primordialsea':
  //     case 'sandstorm':
  //     case 'hail':
  //       factor = 0.25;
  //       break;
  //     }
  //     return !!this.heal(this.modify(pokemon.maxhp, factor));
  //   },
  // },
  // tailwind: {
  //   effect: {
  //     durationCallback(target, source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasAbility('persistent')) {
  //         this.add('-activate', source, 'ability: Persistent', effect);
  //         return 6;
  //       }
  //       return 4;
  //     },
  //     onStart(side) {
  //       this.add('-sidestart', side, 'move: Tailwind');
  //     },
  //     onModifySpe(spe, pokemon) {
  //       return this.chainModify(2);
  //     },
  //     onEnd(side) {
  //       this.add('-sideend', side, 'move: Tailwind');
  //     },
  //   },
  // },
  // tarshot: {
  //   effect: {
  //     onStart(pokemon) {
  //       this.add('-start', pokemon, 'Tar Shot');
  //     },
  //     onEffectiveness(typeMod, target, type, move) {
  //       if (!target) { return; }
  //       if (move.type === 'Fire') {
  //         return this.dex.getEffectiveness('Fire', target) + 1;
  //       }
  //     },
  //   },
  // },
  // taunt: {
  //   effect: {
  //     onStart(target) {
  //       if (target.activeTurns && !this.queue.willMove(target)) {
  //         this.effectData.duration++;
  //       }
  //       this.add('-start', target, 'move: Taunt');
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'move: Taunt');
  //     },
  //     onDisableMove(pokemon) {
  //       for (const moveSlot of pokemon.moveSlots) {
  //         if (this.dex.getMove(moveSlot.id).category === 'Status') {
  //           pokemon.disableMove(moveSlot.id);
  //         }
  //       }
  //     },
  //     onBeforeMove(attacker, defender, move) {
  //       if (!move.isZ && !move.isMax && move.category === 'Status') {
  //         this.add('cant', attacker, 'move: Taunt', move);
  //         return false;
  //       }
  //     },
  //   },
  // },
  // teatime: {
  //   onHitField(target, source, move) {
  //     let result = false;
  //     for (const active of this.getAllActive()) {
  //       if (this.runEvent('Invulnerability', active, source, move) === false) {
  //         this.add('-miss', source, active);
  //         result = true;
  //       } else {
  //         const item = active.getItem();
  //         if (active.hp && item.isBerry) {
  //           // bypasses Unnerve
  //           active.eatItem(true);
  //           result = true;
  //         }
  //       }
  //     }
  //     return result;
  //   },
  // },
  // technoblast: {
  //   onModifyType(move, pokemon) {
  //     if (pokemon.ignoringItem()) { return; }
  //     move.type = this.runEvent('Drive', pokemon, null, move, 'Normal');
  //   },
  // },
  // telekinesis: {
  //   effect: {
  //     onStart(target) {
  //       if (['Diglett', 'Dugtrio', 'Palossand', 'Sandygast'].includes(target.baseSpecies.baseSpecies) ||
  //                   target.baseSpecies.name === 'Gengar-Mega') {
  //         this.add('-immune', target);
  //         return null;
  //       }
  //       if (target.volatiles['smackdown'] || target.volatiles['ingrain']) { return false; }
  //       this.add('-start', target, 'Telekinesis');
  //     },
  //     onAccuracy(accuracy, target, source, move) {
  //       if (move && !move.ohko) { return true; }
  //     },
  //     onImmunity(type) {
  //       if (type === 'Ground') { return false; }
  //     },
  //     onUpdate(pokemon) {
  //       if (pokemon.baseSpecies.name === 'Gengar-Mega') {
  //         delete pokemon.volatiles['telekinesis'];
  //         this.add('-end', pokemon, 'Telekinesis', '[silent]');
  //       }
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'Telekinesis');
  //     },
  //   },
  // },
  // thief: {
  //   onAfterHit(target, source, move) {
  //     if (source.item || source.volatiles['gem']) {
  //       return;
  //     }
  //     const yourItem = target.takeItem(source);
  //     if (!yourItem) {
  //       return;
  //     }
  //     if (!this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem) ||
  //               !source.setItem(yourItem)) {
  //       target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
  //       return;
  //     }
  //     this.add('-enditem', target, yourItem, '[silent]', '[from] move: Thief', '[of] ' + source);
  //     this.add('-item', source, yourItem, '[from] move: Thief', '[of] ' + target);
  //   },
  // },
  // thousandarrows: {
  //   onEffectiveness(typeMod, target, type, move) {
  //     if (move.type !== 'Ground') { return; }
  //     if (!target) { return; } // avoid crashing when called from a chat plugin
  //     // ignore effectiveness if the target is Flying type and immune to Ground
  //     if (!target.runImmunity('Ground')) {
  //       if (target.hasType('Flying')) { return 0; }
  //     }
  //   },
  // },
  // thousandwaves: {
  //   onHit(target, source, move) {
  //     if (source.isActive) { target.addVolatile('trapped', source, move, 'trapper'); }
  //   },
  // },
  // thrash: {
  //   onAfterMove(pokemon) {
  //     if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
  //       pokemon.removeVolatile('lockedmove');
  //     }
  //   },
  // },
  // throatchop: {
  //   effect: {
  //     onStart(target) {
  //       this.add('-start', target, 'Throat Chop', '[silent]');
  //     },
  //     onDisableMove(pokemon) {
  //       for (const moveSlot of pokemon.moveSlots) {
  //         if (this.dex.getMove(moveSlot.id).flags['sound']) {
  //           pokemon.disableMove(moveSlot.id);
  //         }
  //       }
  //     },
  //     onBeforeMove(pokemon, target, move) {
  //       if (!move.isZ && !move.isMax && move.flags['sound']) {
  //         this.add('cant', pokemon, 'move: Throat Chop');
  //         return false;
  //       }
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'Throat Chop', '[silent]');
  //     },
  //   },
  //   secondary: {
  //     onHit(target) {
  //       target.addVolatile('throatchop');
  //     },
  //   },
  // },
  // thunder: {
  //   onModifyMove(move, pokemon, target) {
  //     switch (target.effectiveWeather()) {
  //     case 'raindance':
  //     case 'primordialsea':
  //       move.accuracy = true;
  //       break;
  //     case 'sunnyday':
  //     case 'desolateland':
  //       move.accuracy = 50;
  //       break;
  //     }
  //   },
  // },
  // topsyturvy: {
  //   onHit(target) {
  //     let success = false;
  //     let i;
  //     for (i in target.boosts) {
  //       if (target.boosts[i] === 0) { continue; }
  //       target.boosts[i] = -target.boosts[i];
  //       success = true;
  //     }
  //     if (!success) { return false; }
  //     this.add('-invertboost', target, '[from] move: Topsy-Turvy');
  //   },
  // },
  // torment: {
  //   effect: {
  //     onStart(pokemon) {
  //       if (pokemon.volatiles['dynamax']) {
  //         delete pokemon.volatiles['torment'];
  //         return false;
  //       }
  //       this.add('-start', pokemon, 'Torment');
  //     },
  //     onEnd(pokemon) {
  //       this.add('-end', pokemon, 'Torment');
  //     },
  //     onDisableMove(pokemon) {
  //       if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle') { pokemon.disableMove(pokemon.lastMove.id); }
  //     },
  //   },
  // },
  // toxicspikes: {
  //   effect: {
  //     onStart(side) {
  //       this.add('-sidestart', side, 'move: Toxic Spikes');
  //       this.effectData.layers = 1;
  //     },
  //     onRestart(side) {
  //       if (this.effectData.layers >= 2) { return false; }
  //       this.add('-sidestart', side, 'move: Toxic Spikes');
  //       this.effectData.layers++;
  //     },
  //     onSwitchIn(pokemon) {
  //       if (!pokemon.isGrounded()) { return; }
  //       if (pokemon.hasType('Poison')) {
  //         this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
  //         pokemon.side.removeSideCondition('toxicspikes');
  //       } else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
  //         return;
  //       } else if (this.effectData.layers >= 2) {
  //         pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
  //       } else {
  //         pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
  //       }
  //     },
  //   },
  // },
  // transform: {
  //   onHit(target, pokemon) {
  //     if (!pokemon.transformInto(target)) {
  //       return false;
  //     }
  //   },
  // },
  // triattack: {
  //   secondary: {
  //     onHit(target, source) {
  //       const result = this.random(3);
  //       if (result === 0) {
  //         target.trySetStatus('brn', source);
  //       } else if (result === 1) {
  //         target.trySetStatus('par', source);
  //       } else {
  //         target.trySetStatus('frz', source);
  //       }
  //     },
  //   },
  // },
  // trick: {
  //   onTryImmunity(target) {
  //     return !target.hasAbility('stickyhold');
  //   },
  //   onHit(target, source, move) {
  //     const yourItem = target.takeItem(source);
  //     const myItem = source.takeItem();
  //     if (target.item || source.item || (!yourItem && !myItem)) {
  //       if (yourItem) { target.item = yourItem.id; }
  //       if (myItem) { source.item = myItem.id; }
  //       return false;
  //     }
  //     if ((myItem && !this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem)) ||
  //               (yourItem && !this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem))) {
  //       if (yourItem) { target.item = yourItem.id; }
  //       if (myItem) { source.item = myItem.id; }
  //       return false;
  //     }
  //     this.add('-activate', source, 'move: Trick', '[of] ' + target);
  //     if (myItem) {
  //       target.setItem(myItem);
  //       this.add('-item', target, myItem, '[from] move: Trick');
  //     } else {
  //       this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick');
  //     }
  //     if (yourItem) {
  //       source.setItem(yourItem);
  //       this.add('-item', source, yourItem, '[from] move: Trick');
  //     } else {
  //       this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick');
  //     }
  //   },
  // },
  // trickortreat: {
  //   onHit(target) {
  //     if (target.hasType('Ghost')) { return false; }
  //     if (!target.addType('Ghost')) { return false; }
  //     this.add('-start', target, 'typeadd', 'Ghost', '[from] move: Trick-or-Treat');
  //     if (target.side.active.length === 2 && target.position === 1) {
  //       // Curse Glitch
  //       const action = this.queue.willMove(target);
  //       if (action && action.move.id === 'curse') {
  //         action.targetLoc = -1;
  //       }
  //     }
  //   },
  // },
  // trickroom: {
  //   effect: {
  //     durationCallback(source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasAbility('persistent')) {
  //         this.add('-activate', source, 'ability: Persistent', effect);
  //         return 7;
  //       }
  //       return 5;
  //     },
  //     onStart(target, source) {
  //       this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
  //     },
  //     onRestart(target, source) {
  //       this.field.removePseudoWeather('trickroom');
  //     },
  //     onEnd() {
  //       this.add('-fieldend', 'move: Trick Room');
  //     },
  //   },
  // },
  // triplekick: {
  //   basePowerCallback(pokemon, target, move) {
  //     return 10 * move.hit;
  //   },
  // },
  // trumpcard: {
  //   basePowerCallback(source, target, move) {
  //     const callerMoveId = move.sourceEffect || move.id;
  //     const moveSlot = callerMoveId === 'instruct' ? source.getMoveData(move.id) : source.getMoveData(callerMoveId);
  //     if (!moveSlot) { return 40; }
  //     switch (moveSlot.pp) {
  //     case 0:
  //       return 200;
  //     case 1:
  //       return 80;
  //     case 2:
  //       return 60;
  //     case 3:
  //       return 50;
  //     default:
  //       return 40;
  //     }
  //   },
  // },
  // uproar: {
  //   onTryHit(target) {
  //     for (const [i, allyActive] of target.side.active.entries()) {
  //       if (allyActive && allyActive.status === 'slp') { allyActive.cureStatus(); }
  //       const foeActive = target.side.foe.active[i];
  //       if (foeActive && foeActive.status === 'slp') { foeActive.cureStatus(); }
  //     }
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-start', target, 'Uproar');
  //     },
  //     onResidual(target) {
  //       if (target.lastMove && target.lastMove.id === 'struggle') {
  //         // don't lock
  //         delete target.volatiles['uproar'];
  //       }
  //       this.add('-start', target, 'Uproar', '[upkeep]');
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'Uproar');
  //     },
  //     onAnySetStatus(status, pokemon) {
  //       if (status.id === 'slp') {
  //         if (pokemon === this.effectData.target) {
  //           this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
  //         } else {
  //           this.add('-fail', pokemon, 'slp', '[from] Uproar');
  //         }
  //         return null;
  //       }
  //     },
  //   },
  // },
  // veeveevolley: {
  //   basePowerCallback(pokemon) {
  //     return Math.floor((pokemon.happiness * 10) / 25) || 1;
  //   },
  // },
  // venomdrench: {
  //   onHit(target, source, move) {
  //     if (target.status === 'psn' || target.status === 'tox') {
  //       return !!this.boost({atk: -1, spa: -1, spe: -1}, target, source, move);
  //     }
  //     return false;
  //   },
  // },
  // venoshock: {
  //   onBasePower(basePower, pokemon, target) {
  //     if (target.status === 'psn' || target.status === 'tox') {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // wakeupslap: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (target.status === 'slp' || target.hasAbility('comatose')) { return move.basePower * 2; }
  //     return move.basePower;
  //   },
  //   onHit(target) {
  //     if (target.status === 'slp') { target.cureStatus(); }
  //   },
  // },
  // waterpledge: {
  //   basePowerCallback(target, source, move) {
  //     if (['firepledge', 'grasspledge'].includes(move.sourceEffect)) {
  //       this.add('-combine');
  //       return 150;
  //     }
  //     return 80;
  //   },
  //   onPrepareHit(target, source, move) {
  //     for (const action of this.queue) {
  //       if (action.choice !== 'move') { continue; }
  //       const otherMove = action.move;
  //       const otherMoveUser = action.pokemon;
  //       if (!otherMove || !action.pokemon || !otherMoveUser.isActive ||
  //                   otherMoveUser.fainted || action.maxMove || action.zmove) {
  //         continue;
  //       }
  //       if (otherMoveUser.side === source.side && ['firepledge', 'grasspledge'].includes(otherMove.id)) {
  //         this.queue.prioritizeAction(action, move);
  //         this.add('-waiting', source, otherMoveUser);
  //         return null;
  //       }
  //     }
  //   },
  //   onModifyMove(move) {
  //     if (move.sourceEffect === 'grasspledge') {
  //       move.type = 'Grass';
  //       move.forceSTAB = true;
  //       move.sideCondition = 'grasspledge';
  //     }
  //     if (move.sourceEffect === 'firepledge') {
  //       move.type = 'Water';
  //       move.forceSTAB = true;
  //       move.self = {sideCondition: 'waterpledge'};
  //     }
  //   },
  //   effect: {
  //     onStart(targetSide) {
  //       this.add('-sidestart', targetSide, 'Water Pledge');
  //     },
  //     onEnd(targetSide) {
  //       this.add('-sideend', targetSide, 'Water Pledge');
  //     },
  //     onModifyMove(move) {
  //       if (move.secondaries && move.id !== 'secretpower') {
  //         this.debug('doubling secondary chance');
  //         for (const secondary of move.secondaries) {
  //           if (secondary.chance) { secondary.chance *= 2; }
  //         }
  //       }
  //     },
  //   },
  // },
  // watershuriken: {
  //   basePowerCallback(pokemon, target, move) {
  //     if (pokemon.species.name === 'Greninja-Ash' && pokemon.hasAbility('battlebond')) {
  //       return move.basePower + 5;
  //     }
  //     return move.basePower;
  //   },
  // },
  // watersport: {
  //   effect: {
  //     onStart(side, source) {
  //       this.add('-fieldstart', 'move: Water Sport', '[of] ' + source);
  //     },
  //     onBasePower(basePower, attacker, defender, move) {
  //       if (move.type === 'Fire') {
  //         this.debug('water sport weaken');
  //         return this.chainModify([0x548, 0x1000]);
  //       }
  //     },
  //     onEnd() {
  //       this.add('-fieldend', 'move: Water Sport');
  //     },
  //   },
  // },
  // waterspout: {
  //   basePowerCallback(pokemon, target, move) {
  //     return move.basePower * pokemon.hp / pokemon.maxhp;
  //   },
  // },
  // weatherball: {
  //   onModifyType(move, pokemon) {
  //     switch (pokemon.effectiveWeather()) {
  //     case 'sunnyday':
  //     case 'desolateland':
  //       move.type = 'Fire';
  //       break;
  //     case 'raindance':
  //     case 'primordialsea':
  //       move.type = 'Water';
  //       break;
  //     case 'sandstorm':
  //       move.type = 'Rock';
  //       break;
  //     case 'hail':
  //       move.type = 'Ice';
  //       break;
  //     }
  //   },
  //   onModifyMove(move, pokemon) {
  //     switch (pokemon.effectiveWeather()) {
  //     case 'sunnyday':
  //     case 'desolateland':
  //       move.basePower *= 2;
  //       break;
  //     case 'raindance':
  //     case 'primordialsea':
  //       move.basePower *= 2;
  //       break;
  //     case 'sandstorm':
  //       move.basePower *= 2;
  //       break;
  //     case 'hail':
  //       move.basePower *= 2;
  //       break;
  //     }
  //   },
  // },
  // wideguard: {
  //   onTryHitSide(side, source) {
  //     return !!this.queue.willAct();
  //   },
  //   onHitSide(side, source) {
  //     source.addVolatile('stall');
  //   },
  //   effect: {
  //     onStart(target, source) {
  //       this.add('-singleturn', source, 'Wide Guard');
  //     },
  //     onTryHit(target, source, move) {
  //       // Wide Guard blocks all spread moves
  //       if ((move === null || move === void 0 ? void 0 : move.target) !== 'allAdjacent' && move.target !== 'allAdjacentFoes') {
  //         return;
  //       }
  //       if (move.isZ || move.isMax) {
  //         target.getMoveHitData(move).zBrokeProtect = true;
  //         return;
  //       }
  //       this.add('-activate', target, 'move: Wide Guard');
  //       const lockedmove = source.getVolatile('lockedmove');
  //       if (lockedmove) {
  //         // Outrage counter is reset
  //         if (source.volatiles['lockedmove'].duration === 2) {
  //           delete source.volatiles['lockedmove'];
  //         }
  //       }
  //       return this.NOT_FAIL;
  //     },
  //   },
  // },
  // wish: {
  //   effect: {
  //     onStart(pokemon, source) {
  //       this.effectData.hp = source.maxhp / 2;
  //     },
  //     onEnd(target) {
  //       if (target && !target.fainted) {
  //         const damage = this.heal(this.effectData.hp, target, target);
  //         if (damage) { this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + this.effectData.source.name); }
  //       }
  //     },
  //   },
  // },
  // wonderroom: {
  //   effect: {
  //     durationCallback(source, effect) {
  //       if (source === null || source === void 0 ? void 0 : source.hasAbility('persistent')) {
  //         this.add('-activate', source, 'ability: Persistent', effect);
  //         return 7;
  //       }
  //       return 5;
  //     },
  //     onStart(side, source) {
  //       this.add('-fieldstart', 'move: Wonder Room', '[of] ' + source);
  //     },
  //     onRestart(target, source) {
  //       this.field.removePseudoWeather('wonderroom');
  //     },
  //     onEnd() {
  //       this.add('-fieldend', 'move: Wonder Room');
  //     },
  //   },
  // },
  // worryseed: {
  //   onTryHit(pokemon) {
  //     const bannedAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'insomnia', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'truant', 'zenmode',
  //     ];
  //     if (bannedAbilities.includes(pokemon.ability)) {
  //       return false;
  //     }
  //   },
  //   onHit(pokemon) {
  //     const oldAbility = pokemon.setAbility('insomnia');
  //     if (oldAbility) {
  //       this.add('-ability', pokemon, 'Insomnia', '[from] move: Worry Seed');
  //       if (pokemon.status === 'slp') {
  //         pokemon.cureStatus();
  //       }
  //       return;
  //     }
  //     return false;
  //   },
  // },
  // wringout: {
  //   basePowerCallback(pokemon, target) {
  //     return Math.floor(Math.floor((120 * (100 * Math.floor(target.hp * 4096 / target.maxhp)) + 2048 - 1) / 4096) / 100) || 1;
  //   },
  // },
  // yawn: {
  //   onTryHit(target) {
  //     if (target.status || !target.runStatusImmunity('slp')) {
  //       return false;
  //     }
  //   },
  //   effect: {
  //     onStart(target, source) {
  //       this.add('-start', target, 'move: Yawn', '[of] ' + source);
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'move: Yawn', '[silent]');
  //       target.trySetStatus('slp', this.effectData.source);
  //     },
  //   },
  // },
};
