import {Applier, Handler} from '.';

export const Abilities: {[id: string]: Partial<Applier & Handler>} = {
  // adaptability: {
  //   onModifyMove(move) {
  //     move.stab = 2;
  //   },
  // },
  // aerilate: {
  //   onModifyType(move, pokemon) {
  //     const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'];
  //     if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
  //       move.type = 'Flying';
  //       move.aerilateBoosted = true;
  //     }
  //   },
  //   onBasePower(basePower, pokemon, target, move) {
  //     if (move.aerilateBoosted) { return this.chainModify([0x1333, 0x1000]); }
  //   },
  // },
  // aftermath: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact'] && !target.hp) {
  //       this.damage(source.baseMaxhp / 4, source, target);
  //     }
  //   },
  // },
  // airlock: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Air Lock');
  //   },
  // },
  // analytic: {
  //   onBasePower(basePower, pokemon) {
  //     let boosted = true;
  //     for (const target of this.getAllActive()) {
  //       if (target === pokemon) { continue; }
  //       if (this.queue.willMove(target)) {
  //         boosted = false;
  //         break;
  //       }
  //     }
  //     if (boosted) {
  //       this.debug('Analytic boost');
  //       return this.chainModify([0x14CD, 0x1000]);
  //     }
  //   },
  // },
  // angerpoint: {
  //   onHit(target, source, move) {
  //     if (!target.hp) { return; }
  //     if ((move === null || move === void 0 ? void 0 : move.effectType) === 'Move' && target.getMoveHitData(move).crit) {
  //       target.setBoost({atk: 6});
  //       this.add('-setboost', target, 'atk', 12, '[from] ability: Anger Point');
  //     }
  //   },
  // },
  // anticipation: {
  //   onStart(pokemon) {
  //     for (const target of pokemon.side.foe.active) {
  //       if (!target || target.fainted) { continue; }
  //       for (const moveSlot of target.moveSlots) {
  //         const move = this.dex.getMove(moveSlot.move);
  //         if (move.category === 'Status') { continue; }
  //         const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
  //         if (this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, pokemon) > 0 ||
  //                       move.ohko) {
  //           this.add('-ability', pokemon, 'Anticipation');
  //           return;
  //         }
  //       }
  //     }
  //   },
  // },
  // arenatrap: {
  //   onFoeTrapPokemon(pokemon) {
  //     if (!this.isAdjacent(pokemon, this.effectData.target)) { return; }
  //     if (pokemon.isGrounded()) {
  //       pokemon.tryTrap(true);
  //     }
  //   },
  //   onFoeMaybeTrapPokemon(pokemon, source) {
  //     if (!source) { source = this.effectData.target; }
  //     if (!source || !this.isAdjacent(pokemon, source)) { return; }
  //     if (pokemon.isGrounded(!pokemon.knownType)) { // Negate immunity if the type is unknown
  //       pokemon.maybeTrapped = true;
  //     }
  //   },
  // },
  // aromaveil: {
  //   onAllyTryAddVolatile(status, target, source, effect) {
  //     if (['attract', 'disable', 'encore', 'healblock', 'taunt', 'torment'].includes(status.id)) {
  //       if (effect.effectType === 'Move') {
  //         const effectHolder = this.effectData.target;
  //         this.add('-block', target, 'ability: Aroma Veil', '[of] ' + effectHolder);
  //       }
  //       return null;
  //     }
  //   },
  // },
  // aurabreak: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Aura Break');
  //   },
  //   onAnyTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     move.hasAuraBreak = true;
  //   },
  // },
  // baddreams: {
  //   onResidual(pokemon) {
  //     if (!pokemon.hp) { return; }
  //     for (const target of pokemon.side.foe.active) {
  //       if (!target || !target.hp) { continue; }
  //       if (target.status === 'slp' || target.hasAbility('comatose')) {
  //         this.damage(target.baseMaxhp / 8, target, pokemon);
  //       }
  //     }
  //   },
  // },
  // battery: {
  //   onAllyBasePower(basePower, attacker, defender, move) {
  //     if (attacker !== this.effectData.target && move.category === 'Special') {
  //       this.debug('Battery boost');
  //       return this.chainModify([0x14CD, 0x1000]);
  //     }
  //   },
  // },
  // battlebond: {
  //   onSourceAfterFaint(length, target, source, effect) {
  //     if ((effect === null || effect === void 0 ? void 0 : effect.effectType) !== 'Move') {
  //       return;
  //     }
  //     if (source.species.id === 'greninja' && source.hp && !source.transformed && source.side.foe.pokemonLeft) {
  //       this.add('-activate', source, 'ability: Battle Bond');
  //       source.formeChange('Greninja-Ash', this.effect, true);
  //     }
  //   },
  //   onModifyMove(move, attacker) {
  //     if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Ash') {
  //       move.multihit = 3;
  //     }
  //   },
  // },
  // beastboost: {
  //   onSourceAfterFaint(length, target, source, effect) {
  //     if (effect && effect.effectType === 'Move') {
  //       let statName = 'atk';
  //       let bestStat = 0;
  //       let s;
  //       for (s in source.storedStats) {
  //         if (source.storedStats[s] > bestStat) {
  //           statName = s;
  //           bestStat = source.storedStats[s];
  //         }
  //       }
  //       this.boost({[statName]: length}, source);
  //     }
  //   },
  // },
  // berserk: {
  //   onAfterMoveSecondary(target, source, move) {
  //     if (!source || source === target || !target.hp || !move.totalDamage) { return; }
  //     const lastAttackedBy = target.getLastAttackedBy();
  //     if (!lastAttackedBy) { return; }
  //     const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
  //     if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
  //       this.boost({spa: 1});
  //     }
  //   },
  // },
  // bigpecks: {
  //   onBoost(boost, target, source, effect) {
  //     if (source && target === source) { return; }
  //     if (boost.def && boost.def < 0) {
  //       delete boost.def;
  //       if (!effect.secondaries && effect.id !== 'octolock') {
  //         this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
  //       }
  //     }
  //   },
  // },
  // blaze: {
  //   onModifyAtk(atk, attacker, defender, move) {
  //     if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
  //       this.debug('Blaze boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onModifySpA(atk, attacker, defender, move) {
  //     if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
  //       this.debug('Blaze boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // bulletproof: {
  //   onTryHit(pokemon, target, move) {
  //     if (move.flags['bullet']) {
  //       this.add('-immune', pokemon, '[from] ability: Bulletproof');
  //       return null;
  //     }
  //   },
  // },
  // cheekpouch: {
  //   onEatItem(item, pokemon) {
  //     this.heal(pokemon.baseMaxhp / 3);
  //   },
  // },
  // chlorophyll: {
  //   onModifySpe(spe, pokemon) {
  //     if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // clearbody: {
  //   onBoost(boost, target, source, effect) {
  //     if (source && target === source) { return; }
  //     let showMsg = false;
  //     let i;
  //     for (i in boost) {
  //       if (boost[i] < 0) {
  //         delete boost[i];
  //         showMsg = true;
  //       }
  //     }
  //     if (showMsg && !effect.secondaries && effect.id !== 'octolock') {
  //       this.add("-fail", target, "unboost", "[from] ability: Clear Body", "[of] " + target);
  //     }
  //   },
  // },
  // cloudnine: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Cloud Nine');
  //   },
  // },
  // colorchange: {
  //   onAfterMoveSecondary(target, source, move) {
  //     if (!target.hp) { return; }
  //     const type = move.type;
  //     if (target.isActive && move.effectType === 'Move' && move.category !== 'Status' &&
  //               type !== '???' && !target.hasType(type)) {
  //       if (!target.setType(type)) { return false; }
  //       this.add('-start', target, 'typechange', type, '[from] ability: Color Change');
  //       if (target.side.active.length === 2 && target.position === 1) {
  //         // Curse Glitch
  //         const action = this.queue.willMove(target);
  //         if (action && action.move.id === 'curse') {
  //           action.targetLoc = -1;
  //         }
  //       }
  //     }
  //   },
  // },
  // comatose: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Comatose');
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Comatose');
  //     }
  //     return false;
  //   },
  // },
  // competitive: {
  //   onAfterEachBoost(boost, target, source, effect) {
  //     if (!source || target.side === source.side) {
  //       if (effect.id === 'stickyweb') {
  //         this.hint("Court Change Sticky Web counts as lowering your own Speed, and Competitive only affects stats lowered by foes.", true, source.side);
  //       }
  //       return;
  //     }
  //     let statsLowered = false;
  //     let i;
  //     for (i in boost) {
  //       if (boost[i] < 0) {
  //         statsLowered = true;
  //       }
  //     }
  //     if (statsLowered) {
  //       this.add('-ability', target, 'Competitive');
  //       this.boost({spa: 2}, target, target, null, true);
  //     }
  //   },
  // },
  // compoundeyes: {
  //   onSourceModifyAccuracy(accuracy) {
  //     if (typeof accuracy !== 'number') { return; }
  //     this.debug('compoundeyes - enhancing accuracy');
  //     return accuracy * 1.3;
  //   },
  // },
  // contrary: {
  //   onBoost(boost, target, source, effect) {
  //     if (effect && effect.id === 'zpower') { return; }
  //     let i;
  //     for (i in boost) {
  //       boost[i] *= -1;
  //     }
  //   },
  // },
  // cottondown: {
  //   onDamagingHit(damage, target, source, move) {
  //     let activated = false;
  //     for (const pokemon of this.getAllActive()) {
  //       if (pokemon === target || pokemon.fainted) { continue; }
  //       if (!activated) {
  //         this.add('-ability', target, 'Cotton Down');
  //         activated = true;
  //       }
  //       this.boost({spe: -1}, pokemon, target, null, true);
  //     }
  //   },
  // },
  // cursedbody: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (source.volatiles['disable']) { return; }
  //     if (!move.isFutureMove) {
  //       if (this.randomChance(3, 10)) {
  //         source.addVolatile('disable', this.effectData.target);
  //       }
  //     }
  //   },
  // },
  // cutecharm: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       if (this.randomChance(3, 10)) {
  //         source.addVolatile('attract', this.effectData.target);
  //       }
  //     }
  //   },
  // },
  // damp: {
  //   onAnyTryMove(target, source, effect) {
  //     if (['explosion', 'mindblown', 'selfdestruct'].includes(effect.id)) {
  //       this.attrLastMove('[still]');
  //       this.add('cant', this.effectData.target, 'ability: Damp', effect, '[of] ' + target);
  //       return false;
  //     }
  //   },
  //   onAnyDamage(damage, target, source, effect) {
  //     if (effect && effect.id === 'aftermath') {
  //       return false;
  //     }
  //   },
  // },
  // darkaura: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Dark Aura');
  //   },
  //   onAnyBasePower(basePower, source, target, move) {
  //     if (target === source || move.category === 'Status' || move.type !== 'Dark') { return; }
  //     if (!move.auraBooster) { move.auraBooster = this.effectData.target; }
  //     if (move.auraBooster !== this.effectData.target) { return; }
  //     return this.chainModify([move.hasAuraBreak ? 0x0C00 : 0x1547, 0x1000]);
  //   },
  // },
  // dauntlessshield: {
  //   onStart(pokemon) {
  //     this.boost({def: 1}, pokemon);
  //   },
  // },
  // dazzling: {
  //   onFoeTryMove(target, source, move) {
  //     const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
  //     if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
  //       return;
  //     }
  //     const dazzlingHolder = this.effectData.target;
  //     if ((source.side === dazzlingHolder.side || move.target === 'all') && move.priority > 0.1) {
  //       this.attrLastMove('[still]');
  //       this.add('cant', dazzlingHolder, 'ability: Dazzling', move, '[of] ' + target);
  //       return false;
  //     }
  //   },
  // },
  // defeatist: {
  //   onModifyAtk(atk, pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 2) {
  //       return this.chainModify(0.5);
  //     }
  //   },
  //   onModifySpA(atk, pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 2) {
  //       return this.chainModify(0.5);
  //     }
  //   },
  // },
  // defiant: {
  //   onAfterEachBoost(boost, target, source, effect) {
  //     if (!source || target.side === source.side) {
  //       if (effect.id === 'stickyweb') {
  //         this.hint("Court Change Sticky Web counts as lowering your own Speed, and Defiant only affects stats lowered by foes.", true, source.side);
  //       }
  //       return;
  //     }
  //     let statsLowered = false;
  //     let i;
  //     for (i in boost) {
  //       if (boost[i] < 0) {
  //         statsLowered = true;
  //       }
  //     }
  //     if (statsLowered) {
  //       this.add('-ability', target, 'Defiant');
  //       this.boost({atk: 2}, target, target, null, true);
  //     }
  //   },
  // },
  // deltastream: {
  //   onStart(source) {
  //     this.field.setWeather('deltastream');
  //   },
  //   onAnySetWeather(target, source, weather) {
  //     const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
  //     if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) { return false; }
  //   },
  //   onEnd(pokemon) {
  //     if (this.field.weatherData.source !== pokemon) { return; }
  //     for (const target of this.getAllActive()) {
  //       if (target === pokemon) { continue; }
  //       if (target.hasAbility('deltastream')) {
  //         this.field.weatherData.source = target;
  //         return;
  //       }
  //     }
  //     this.field.clearWeather();
  //   },
  // },
  // desolateland: {
  //   onStart(source) {
  //     this.field.setWeather('desolateland');
  //   },
  //   onAnySetWeather(target, source, weather) {
  //     const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
  //     if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id)) { return false; }
  //   },
  //   onEnd(pokemon) {
  //     if (this.field.weatherData.source !== pokemon) { return; }
  //     for (const target of this.getAllActive()) {
  //       if (target === pokemon) { continue; }
  //       if (target.hasAbility('desolateland')) {
  //         this.field.weatherData.source = target;
  //         return;
  //       }
  //     }
  //     this.field.clearWeather();
  //   },
  // },
  // disguise: {
  //   onDamage(damage, target, source, effect) {
  //     if (effect && effect.effectType === 'Move' &&
  //               ['mimikyu', 'mimikyutotem'].includes(target.species.id) && !target.transformed) {
  //       this.add('-activate', target, 'ability: Disguise');
  //       this.effectData.busted = true;
  //       return 0;
  //     }
  //   },
  //   onEffectiveness(typeMod, target, type, move) {
  //     if (!target) { return; }
  //     if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
  //       return;
  //     }
  //     const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //     if (hitSub) { return; }
  //     if (!target.runImmunity(move.type)) { return; }
  //     return 0;
  //   },
  //   onUpdate(pokemon) {
  //     if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectData.busted) {
  //       const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
  //       pokemon.formeChange(speciesid, this.effect, true);
  //       this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.getSpecies(speciesid));
  //     }
  //   },
  // },
  // download: {
  //   onStart(pokemon) {
  //     let totaldef = 0;
  //     let totalspd = 0;
  //     for (const target of pokemon.side.foe.active) {
  //       if (!target || target.fainted) { continue; }
  //       totaldef += target.getStat('def', false, true);
  //       totalspd += target.getStat('spd', false, true);
  //     }
  //     if (totaldef && totaldef >= totalspd) {
  //       this.boost({spa: 1});
  //     } else if (totalspd) {
  //       this.boost({atk: 1});
  //     }
  //   },
  // },
  // drizzle: {
  //   onStart(source) {
  //     for (const action of this.queue) {
  //       if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'kyogre') { return; }
  //       if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') { break; }
  //     }
  //     this.field.setWeather('raindance');
  //   },
  // },
  // drought: {
  //   onStart(source) {
  //     for (const action of this.queue) {
  //       if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'groudon') { return; }
  //       if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') { break; }
  //     }
  //     this.field.setWeather('sunnyday');
  //   },
  // },
  // dryskin: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && move.type === 'Water') {
  //       if (!this.heal(target.baseMaxhp / 4)) {
  //         this.add('-immune', target, '[from] ability: Dry Skin');
  //       }
  //       return null;
  //     }
  //   },
  //   onFoeBasePower(basePower, attacker, defender, move) {
  //     if (this.effectData.target !== defender) { return; }
  //     if (move.type === 'Fire') {
  //       return this.chainModify(1.25);
  //     }
  //   },
  //   onWeather(target, source, effect) {
  //     if (target.hasItem('utilityumbrella')) { return; }
  //     if (effect.id === 'raindance' || effect.id === 'primordialsea') {
  //       this.heal(target.baseMaxhp / 8);
  //     } else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
  //       this.damage(target.baseMaxhp / 8, target, target);
  //     }
  //   },
  // },
  // effectspore: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact'] && !source.status && source.runStatusImmunity('powder')) {
  //       const r = this.random(100);
  //       if (r < 11) {
  //         source.setStatus('slp', target);
  //       } else if (r < 21) {
  //         source.setStatus('par', target);
  //       } else if (r < 30) {
  //         source.setStatus('psn', target);
  //       }
  //     }
  //   },
  // },
  // electricsurge: {
  //   onStart(source) {
  //     this.field.setTerrain('electricterrain');
  //   },
  // },
  // emergencyexit: {
  //   onEmergencyExit(target) {
  //     if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) { return; }
  //     for (const side of this.sides) {
  //       for (const active of side.active) {
  //         active.switchFlag = false;
  //       }
  //     }
  //     target.switchFlag = true;
  //     this.add('-activate', target, 'ability: Emergency Exit');
  //   },
  // },
  // fairyaura: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Fairy Aura');
  //   },
  //   onAnyBasePower(basePower, source, target, move) {
  //     if (target === source || move.category === 'Status' || move.type !== 'Fairy') { return; }
  //     if (!move.auraBooster) { move.auraBooster = this.effectData.target; }
  //     if (move.auraBooster !== this.effectData.target) { return; }
  //     return this.chainModify([move.hasAuraBreak ? 0x0C00 : 0x1547, 0x1000]);
  //   },
  // },
  // filter: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (target.getMoveHitData(move).typeMod > 0) {
  //       this.debug('Filter neutralize');
  //       return this.chainModify(0.75);
  //     }
  //   },
  // },
  // flamebody: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       if (this.randomChance(3, 10)) {
  //         source.trySetStatus('brn', target);
  //       }
  //     }
  //   },
  // },
  // flareboost: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (attacker.status === 'brn' && move.category === 'Special') {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // flashfire: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && move.type === 'Fire') {
  //       move.accuracy = true;
  //       if (!target.addVolatile('flashfire')) {
  //         this.add('-immune', target, '[from] ability: Flash Fire');
  //       }
  //       return null;
  //     }
  //   },
  //   onEnd(pokemon) {
  //     pokemon.removeVolatile('flashfire');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-start', target, 'ability: Flash Fire');
  //     },
  //     onModifyAtk(atk, attacker, defender, move) {
  //       if (move.type === 'Fire') {
  //         this.debug('Flash Fire boost');
  //         return this.chainModify(1.5);
  //       }
  //     },
  //     onModifySpA(atk, attacker, defender, move) {
  //       if (move.type === 'Fire') {
  //         this.debug('Flash Fire boost');
  //         return this.chainModify(1.5);
  //       }
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'ability: Flash Fire', '[silent]');
  //     },
  //   },
  // },
  // flowergift: {
  //   onStart(pokemon) {
  //     delete this.effectData.forme;
  //   },
  //   onUpdate(pokemon) {
  //     if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Cherrim' || pokemon.transformed) { return; }
  //     if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
  //       if (pokemon.species.id !== 'cherrimsunshine') {
  //         pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '[msg]');
  //       }
  //     } else {
  //       if (pokemon.species.id === 'cherrimsunshine') {
  //         pokemon.formeChange('Cherrim', this.effect, false, '[msg]');
  //       }
  //     }
  //   },
  //   onAllyModifyAtk(atk, pokemon) {
  //     if (this.effectData.target.baseSpecies.baseSpecies !== 'Cherrim') { return; }
  //     if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onAllyModifySpD(spd, pokemon) {
  //     if (this.effectData.target.baseSpecies.baseSpecies !== 'Cherrim') { return; }
  //     if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // flowerveil: {
  //   onAllyBoost(boost, target, source, effect) {
  //     if ((source && target === source) || !target.hasType('Grass')) { return; }
  //     let showMsg = false;
  //     let i;
  //     for (i in boost) {
  //       if (boost[i] < 0) {
  //         delete boost[i];
  //         showMsg = true;
  //       }
  //     }
  //     if (showMsg && !effect.secondaries) {
  //       const effectHolder = this.effectData.target;
  //       this.add('-block', target, 'ability: Flower Veil', '[of] ' + effectHolder);
  //     }
  //   },
  //   onAllySetStatus(status, target, source, effect) {
  //     if (target.hasType('Grass') && source && target !== source && effect && effect.id !== 'yawn') {
  //       this.debug('interrupting setStatus with Flower Veil');
  //       if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
  //         const effectHolder = this.effectData.target;
  //         this.add('-block', target, 'ability: Flower Veil', '[of] ' + effectHolder);
  //       }
  //       return null;
  //     }
  //   },
  //   onAllyTryAddVolatile(status, target) {
  //     if (target.hasType('Grass') && status.id === 'yawn') {
  //       this.debug('Flower Veil blocking yawn');
  //       const effectHolder = this.effectData.target;
  //       this.add('-block', target, 'ability: Flower Veil', '[of] ' + effectHolder);
  //       return null;
  //     }
  //   },
  // },
  // fluffy: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     let mod = 1;
  //     if (move.type === 'Fire') { mod *= 2; }
  //     if (move.flags['contact']) { mod /= 2; }
  //     return this.chainModify(mod);
  //   },
  // },
  // forecast: {
  //   onUpdate(pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) { return; }
  //     let forme = null;
  //     switch (pokemon.effectiveWeather()) {
  //     case 'sunnyday':
  //     case 'desolateland':
  //       if (pokemon.species.id !== 'castformsunny') { forme = 'Castform-Sunny'; }
  //       break;
  //     case 'raindance':
  //     case 'primordialsea':
  //       if (pokemon.species.id !== 'castformrainy') { forme = 'Castform-Rainy'; }
  //       break;
  //     case 'hail':
  //       if (pokemon.species.id !== 'castformsnowy') { forme = 'Castform-Snowy'; }
  //       break;
  //     default:
  //       if (pokemon.species.id !== 'castform') { forme = 'Castform'; }
  //       break;
  //     }
  //     if (pokemon.isActive && forme) {
  //       pokemon.formeChange(forme, this.effect, false, '[msg]');
  //     }
  //   },
  // },
  // forewarn: {
  //   onStart(pokemon) {
  //     let warnMoves = [];
  //     let warnBp = 1;
  //     for (const target of pokemon.side.foe.active) {
  //       if (target.fainted) { continue; }
  //       for (const moveSlot of target.moveSlots) {
  //         const move = this.dex.getMove(moveSlot.move);
  //         let bp = move.basePower;
  //         if (move.ohko) { bp = 150; }
  //         if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') { bp = 120; }
  //         if (bp === 1) { bp = 80; }
  //         if (!bp && move.category !== 'Status') { bp = 80; }
  //         if (bp > warnBp) {
  //           warnMoves = [[move, target]];
  //           warnBp = bp;
  //         } else if (bp === warnBp) {
  //           warnMoves.push([move, target]);
  //         }
  //       }
  //     }
  //     if (!warnMoves.length) { return; }
  //     const [warnMoveName, warnTarget] = this.sample(warnMoves);
  //     this.add('-activate', pokemon, 'ability: Forewarn', warnMoveName, '[of] ' + warnTarget);
  //   },
  // },
  // friendguard: {
  //   onAnyModifyDamage(damage, source, target, move) {
  //     if (target !== this.effectData.target && target.side === this.effectData.target.side) {
  //       this.debug('Friend Guard weaken');
  //       return this.chainModify(0.75);
  //     }
  //   },
  // },
  // frisk: {
  //   onStart(pokemon) {
  //     for (const target of pokemon.side.foe.active) {
  //       if (!target || target.fainted) { continue; }
  //       if (target.item) {
  //         this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] ' + pokemon, '[identify]');
  //       }
  //     }
  //   },
  // },
  // fullmetalbody: {
  //   onBoost(boost, target, source, effect) {
  //     if (source && target === source) { return; }
  //     let showMsg = false;
  //     let i;
  //     for (i in boost) {
  //       if (boost[i] < 0) {
  //         delete boost[i];
  //         showMsg = true;
  //       }
  //     }
  //     if (showMsg && !effect.secondaries && effect.id !== 'octolock') {
  //       this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", "[of] " + target);
  //     }
  //   },
  // },
  // furcoat: {
  //   onModifyDef(def) {
  //     return this.chainModify(2);
  //   },
  // },
  // galewings: {
  //   onModifyPriority(priority, pokemon, target, move) {
  //     if ((move === null || move === void 0 ? void 0 : move.type) === 'Flying' && pokemon.hp === pokemon.maxhp) { return priority + 1; }
  //   },
  // },
  // galvanize: {
  //   onModifyType(move, pokemon) {
  //     const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'];
  //     if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
  //       move.type = 'Electric';
  //       move.galvanizeBoosted = true;
  //     }
  //   },
  //   onBasePower(basePower, pokemon, target, move) {
  //     if (move.galvanizeBoosted) { return this.chainModify([0x1333, 0x1000]); }
  //   },
  // },
  // gooey: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       this.add('-ability', target, 'Gooey');
  //       this.boost({spe: -1}, source, target, null, true);
  //     }
  //   },
  // },
  // gorillatactics: {
  //   onStart(pokemon) {
  //     pokemon.abilityData.choiceLock = "";
  //   },
  //   onBeforeMove(pokemon, target, move) {
  //     if (move.isZOrMaxPowered || move.id === 'struggle') { return; }
  //     if (pokemon.abilityData.choiceLock && pokemon.abilityData.choiceLock !== move.id) {
  //       // Fails unless ability is being ignored (these events will not run), no PP lost.
  //       this.addMove('move', pokemon, move.name);
  //       this.attrLastMove('[still]');
  //       this.debug("Disabled by Gorilla Tactics");
  //       this.add('-fail', pokemon);
  //       return false;
  //     }
  //   },
  //   onModifyMove(move, pokemon) {
  //     if (pokemon.abilityData.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') { return; }
  //     pokemon.abilityData.choiceLock = move.id;
  //   },
  //   onModifyAtk(atk, pokemon) {
  //     if (pokemon.volatiles['dynamax']) { return; }
  //     // PLACEHOLDER
  //     this.debug('Gorilla Tactics Atk Boost');
  //     return this.chainModify(1.5);
  //   },
  //   onDisableMove(pokemon) {
  //     if (!pokemon.abilityData.choiceLock) { return; }
  //     if (pokemon.volatiles['dynamax']) { return; }
  //     for (const moveSlot of pokemon.moveSlots) {
  //       if (moveSlot.id !== pokemon.abilityData.choiceLock) {
  //         pokemon.disableMove(moveSlot.id, false, this.effectData.sourceEffect);
  //       }
  //     }
  //   },
  //   onEnd(pokemon) {
  //     pokemon.abilityData.choiceLock = "";
  //   },
  // },
  // grasspelt: {
  //   onModifyDef(pokemon) {
  //     if (this.field.isTerrain('grassyterrain')) { return this.chainModify(1.5); }
  //   },
  // },
  // grassysurge: {
  //   onStart(source) {
  //     this.field.setTerrain('grassyterrain');
  //   },
  // },
  // gulpmissile: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (target.transformed || target.isSemiInvulnerable()) { return; }
  //     if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
  //       this.damage(source.baseMaxhp / 4, source, target);
  //       if (target.species.id === 'cramorantgulping') {
  //         this.boost({def: -1}, source, target, null, true);
  //       } else {
  //         source.trySetStatus('par', target, move);
  //       }
  //       target.formeChange('cramorant', move);
  //     }
  //   },
  //   onAnyDamage(damage, target, source, effect) {
  //     if (effect && effect.id === 'surf' && source.hasAbility('gulpmissile') &&
  //               source.species.name === 'Cramorant' && !source.transformed) {
  //       const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
  //       source.formeChange(forme, effect);
  //     }
  //   },
  //   onAnyAfterSubDamage(damage, target, source, effect) {
  //     if (effect && effect.id === 'surf' && source.hasAbility('gulpmissile') &&
  //               source.species.name === 'Cramorant' && !source.transformed) {
  //       const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
  //       source.formeChange(forme, effect);
  //     }
  //   },
  // },
  // guts: {
  //   onModifyAtk(atk, pokemon) {
  //     if (pokemon.status) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // harvest: {
  //   onResidual(pokemon) {
  //     if (this.field.isWeather(['sunnyday', 'desolateland']) || this.randomChance(1, 2)) {
  //       if (pokemon.hp && !pokemon.item && this.dex.getItem(pokemon.lastItem).isBerry) {
  //         pokemon.setItem(pokemon.lastItem);
  //         pokemon.lastItem = '';
  //         this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
  //       }
  //     }
  //   },
  // },
  // healer: {
  //   onResidual(pokemon) {
  //     if (pokemon.side.active.length === 1) {
  //       return;
  //     }
  //     for (const allyActive of pokemon.side.active) {
  //       if (allyActive &&
  //                   (allyActive.hp && this.isAdjacent(pokemon, allyActive) && allyActive.status) && this.randomChance(3, 10)) {
  //         this.add('-activate', pokemon, 'ability: Healer');
  //         allyActive.cureStatus();
  //       }
  //     }
  //   },
  // },
  // heatproof: {
  //   onSourceBasePower(basePower, attacker, defender, move) {
  //     if (move.type === 'Fire') {
  //       return this.chainModify(0.5);
  //     }
  //   },
  //   onDamage(damage, target, source, effect) {
  //     if (effect && effect.id === 'brn') {
  //       return damage / 2;
  //     }
  //   },
  // },
  // heavymetal: {
  //   onModifyWeight(weighthg) {
  //     return weighthg * 2;
  //   },
  // },
  // hugepower: {
  //   onModifyAtk(atk) {
  //     return this.chainModify(2);
  //   },
  // },
  // hungerswitch: {
  //   onResidual(pokemon) {
  //     if (pokemon.species.baseSpecies !== 'Morpeko' || pokemon.transformed) { return; }
  //     const targetForme = pokemon.species.name === 'Morpeko' ? 'Morpeko-Hangry' : 'Morpeko';
  //     pokemon.formeChange(targetForme);
  //   },
  // },
  // hustle: {
  //   onModifyAtk(atk) {
  //     return this.modify(atk, 1.5);
  //   },
  //   onModifyMove(move) {
  //     if (move.category === 'Physical' && typeof move.accuracy === 'number') {
  //       move.accuracy *= 0.8;
  //     }
  //   },
  // },
  // hydration: {
  //   onResidual(pokemon) {
  //     if (pokemon.status && ['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
  //       this.debug('hydration');
  //       this.add('-activate', pokemon, 'ability: Hydration');
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // hypercutter: {
  //   onBoost(boost, target, source, effect) {
  //     if (source && target === source) { return; }
  //     if (boost.atk && boost.atk < 0) {
  //       delete boost.atk;
  //       if (!effect.secondaries) {
  //         this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", "[of] " + target);
  //       }
  //     }
  //   },
  // },
  // icebody: {
  //   onWeather(target, source, effect) {
  //     if (effect.id === 'hail') {
  //       this.heal(target.baseMaxhp / 16);
  //     }
  //   },
  //   onImmunity(type, pokemon) {
  //     if (type === 'hail') { return false; }
  //   },
  // },
  // iceface: {
  //   onStart(pokemon) {
  //     if (this.field.isWeather('hail') && pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
  //       this.add('-activate', pokemon, 'ability: Ice Face');
  //       this.effectData.busted = false;
  //       pokemon.formeChange('Eiscue', this.effect, true);
  //     }
  //   },
  //   onDamage(damage, target, source, effect) {
  //     if (effect && effect.effectType === 'Move' && effect.category === 'Physical' &&
  //               target.species.id === 'eiscue' && !target.transformed) {
  //       this.add('-activate', target, 'ability: Ice Face');
  //       this.effectData.busted = true;
  //       return 0;
  //     }
  //   },
  //   onEffectiveness(typeMod, target, type, move) {
  //     if (!target) { return; }
  //     if (move.category !== 'Physical' || target.species.id !== 'eiscue' || target.transformed) { return; }
  //     if (target.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates)) { return; }
  //     if (!target.runImmunity(move.type)) { return; }
  //     return 0;
  //   },
  //   onUpdate(pokemon) {
  //     if (pokemon.species.id === 'eiscue' && this.effectData.busted) {
  //       pokemon.formeChange('Eiscue-Noice', this.effect, true);
  //     }
  //   },
  //   onAnyWeatherStart() {
  //     const pokemon = this.effectData.target;
  //     if (this.field.isWeather('hail') && pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
  //       this.add('-activate', pokemon, 'ability: Ice Face');
  //       this.effectData.busted = false;
  //       pokemon.formeChange('Eiscue', this.effect, true);
  //     }
  //   },
  // },
  // icescales: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.category === 'Special') {
  //       return this.chainModify(0.5);
  //     }
  //   },
  // },
  // illusion: {
  //   onBeforeSwitchIn(pokemon) {
  //     pokemon.illusion = null;
  //     let i;
  //     for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
  //       if (!pokemon.side.pokemon[i]) { continue; }
  //       if (!pokemon.side.pokemon[i].fainted) { break; }
  //     }
  //     if (!pokemon.side.pokemon[i]) { return; }
  //     if (pokemon === pokemon.side.pokemon[i]) { return; }
  //     pokemon.illusion = pokemon.side.pokemon[i];
  //   },
  //   onDamagingHit(damage, target, source, move) {
  //     if (target.illusion) {
  //       this.singleEvent('End', this.dex.getAbility('Illusion'), target.abilityData, target, source, move);
  //     }
  //   },
  //   onEnd(pokemon) {
  //     if (pokemon.illusion) {
  //       this.debug('illusion cleared');
  //       pokemon.illusion = null;
  //       const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
  //                   (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
  //       this.add('replace', pokemon, details);
  //       this.add('-end', pokemon, 'Illusion');
  //     }
  //   },
  //   onFaint(pokemon) {
  //     pokemon.illusion = null;
  //   },
  // },
  // immunity: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'psn' || pokemon.status === 'tox') {
  //       this.add('-activate', pokemon, 'ability: Immunity');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (status.id !== 'psn' && status.id !== 'tox') { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Immunity');
  //     }
  //     return false;
  //   },
  // },
  // imposter: {
  //   onSwitchIn(pokemon) {
  //     this.effectData.switchingIn = true;
  //   },
  //   onStart(pokemon) {
  //     // Imposter does not activate when Skill Swapped or when Neutralizing Gas leaves the field
  //     if (!this.effectData.switchingIn) { return; }
  //     const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
  //     if (target) {
  //       pokemon.transformInto(target, this.dex.getAbility('imposter'));
  //     }
  //     this.effectData.switchingIn = false;
  //   },
  // },
  // infiltrator: {
  //   onModifyMove(move) {
  //     move.infiltrates = true;
  //   },
  // },
  // innardsout: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (!target.hp) {
  //       this.damage(target.getUndynamaxedHP(damage), source, target);
  //     }
  //   },
  // },
  // innerfocus: {
  //   onTryAddVolatile(status, pokemon) {
  //     if (status.id === 'flinch') { return null; }
  //   },
  // },
  // insomnia: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'slp') {
  //       this.add('-activate', pokemon, 'ability: Insomnia');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (status.id !== 'slp') { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Insomnia');
  //     }
  //     return false;
  //   },
  // },
  /*
  intimidate: {
    apply({gen,  p2}) {
      const ability = p2.pokemon.ability;
      const blocked =
        p2.pokemon.volatiles['substitute'] ||
        ['clearbody', 'whitesmoke', 'hypercutter', 'fullmetalbody'].includes(ability!) ||
        (gen.num === 8 && ['innerfocus', 'owntempo', 'oblivious', 'scrappy'].includes(ability!));
      if (blocked) return;

      applyBoost(p2.pokemon, 'atk', -1);

      const simple = ability === 'simple';

      if (p2.pokemon.item === 'adrenalineorb') {
        p2.pokemon.item = undefined;
        p2.pokemon
      }

      }
    },
  },
  */
  // intrepidsword: {
  //   onStart(pokemon) {
  //     this.boost({atk: 1}, pokemon);
  //   },
  // },
  // ironbarbs: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       this.damage(source.baseMaxhp / 8, source, target);
  //     }
  //   },
  // },
  // ironfist: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (move.flags['punch']) {
  //       this.debug('Iron Fist boost');
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // justified: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.type === 'Dark') {
  //       this.boost({atk: 1});
  //     }
  //   },
  // },
  // keeneye: {
  //   onBoost(boost, target, source, effect) {
  //     if (source && target === source) { return; }
  //     if (boost.accuracy && boost.accuracy < 0) {
  //       delete boost.accuracy;
  //       if (!effect.secondaries) {
  //         this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", "[of] " + target);
  //       }
  //     }
  //   },
  //   onModifyMove(move) {
  //     move.ignoreEvasion = true;
  //   },
  // },
  // leafguard: {
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
  //       if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //         this.add('-immune', target, '[from] ability: Leaf Guard');
  //       }
  //       return false;
  //     }
  //   },
  //   onTryAddVolatile(status, target) {
  //     if (status.id === 'yawn' && ['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
  //       this.add('-immune', target, '[from] ability: Leaf Guard');
  //       return null;
  //     }
  //   },
  // },
  // libero: {
  //   onPrepareHit(source, target, move) {
  //     if (move.hasBounced) { return; }
  //     const type = move.type;
  //     if (type && type !== '???' && source.getTypes().join() !== type) {
  //       if (!source.setType(type)) { return; }
  //       this.add('-start', source, 'typechange', type, '[from] ability: Libero');
  //     }
  //   },
  // },
  // lightmetal: {
  //   onModifyWeight(weighthg) {
  //     return this.trunc(weighthg / 2);
  //   },
  // },
  // lightningrod: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && move.type === 'Electric') {
  //       if (!this.boost({spa: 1})) {
  //         this.add('-immune', target, '[from] ability: Lightning Rod');
  //       }
  //       return null;
  //     }
  //   },
  //   onAnyRedirectTarget(target, source, source2, move) {
  //     if (move.type !== 'Electric' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) { return; }
  //     const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
  //     if (this.validTarget(this.effectData.target, source, redirectTarget)) {
  //       if (move.smartTarget) { move.smartTarget = false; }
  //       if (this.effectData.target !== target) {
  //         this.add('-activate', this.effectData.target, 'ability: Lightning Rod');
  //       }
  //       return this.effectData.target;
  //     }
  //   },
  // },
  // limber: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'par') {
  //       this.add('-activate', pokemon, 'ability: Limber');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (status.id !== 'par') { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Limber');
  //     }
  //     return false;
  //   },
  // },
  // liquidooze: {
  //   onSourceTryHeal(damage, target, source, effect) {
  //     this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
  //     const canOoze = ['drain', 'leechseed', 'strengthsap'];
  //     if (canOoze.includes(effect.id)) {
  //       this.damage(damage);
  //       return 0;
  //     }
  //   },
  // },
  // liquidvoice: {
  //   onModifyType(move, pokemon) {
  //     if (move.flags['sound'] && !pokemon.volatiles.dynamax) { // hardcode
  //       move.type = 'Water';
  //     }
  //   },
  // },
  // longreach: {
  //   onModifyMove(move) {
  //     delete move.flags['contact'];
  //   },
  // },
  // magicbounce: {
  //   onTryHit(target, source, move) {
  //     if (target === source || move.hasBounced || !move.flags['reflectable']) {
  //       return;
  //     }
  //     const newMove = this.dex.getActiveMove(move.id);
  //     newMove.hasBounced = true;
  //     newMove.pranksterBoosted = false;
  //     this.useMove(newMove, target, source);
  //     return null;
  //   },
  //   onAllyTryHitSide(target, source, move) {
  //     if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
  //       return;
  //     }
  //     const newMove = this.dex.getActiveMove(move.id);
  //     newMove.hasBounced = true;
  //     newMove.pranksterBoosted = false;
  //     this.useMove(newMove, this.effectData.target, source);
  //     return null;
  //   },
  // },
  // magicguard: {
  //   onDamage(damage, target, source, effect) {
  //     if (effect.effectType !== 'Move') {
  //       if (effect.effectType === 'Ability') { this.add('-activate', source, 'ability: ' + effect.name); }
  //       return false;
  //     }
  //   },
  // },
  // magician: {
  //   onSourceHit(target, source, move) {
  //     if (!move || !target) { return; }
  //     if (target !== source && move.category !== 'Status') {
  //       if (source.item || source.volatiles['gem'] || move.id === 'fling') { return; }
  //       const yourItem = target.takeItem(source);
  //       if (!yourItem) { return; }
  //       if (!source.setItem(yourItem)) {
  //         target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
  //         return;
  //       }
  //       this.add('-item', source, yourItem, '[from] ability: Magician', '[of] ' + target);
  //     }
  //   },
  // },
  // magmaarmor: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'frz') {
  //       this.add('-activate', pokemon, 'ability: Magma Armor');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onImmunity(type, pokemon) {
  //     if (type === 'frz') { return false; }
  //   },
  // },
  // magnetpull: {
  //   onFoeTrapPokemon(pokemon) {
  //     if (pokemon.hasType('Steel') && this.isAdjacent(pokemon, this.effectData.target)) {
  //       pokemon.tryTrap(true);
  //     }
  //   },
  //   onFoeMaybeTrapPokemon(pokemon, source) {
  //     if (!source) { source = this.effectData.target; }
  //     if (!source || !this.isAdjacent(pokemon, source)) { return; }
  //     if (!pokemon.knownType || pokemon.hasType('Steel')) {
  //       pokemon.maybeTrapped = true;
  //     }
  //   },
  // },
  // marvelscale: {
  //   onModifyDef(def, pokemon) {
  //     if (pokemon.status) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // megalauncher: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (move.flags['pulse']) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // merciless: {
  //   onModifyCritRatio(critRatio, source, target) {
  //     if (target && ['psn', 'tox'].includes(target.status)) { return 5; }
  //   },
  // },
  // mimicry: {
  //   onStart(pokemon) {
  //     if (this.field.terrain) {
  //       pokemon.addVolatile('mimicry');
  //     } else {
  //       const types = pokemon.baseSpecies.types;
  //       if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) { return; }
  //       this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
  //       this.hint("Transform Mimicry changes you to your original un-transformed types.");
  //     }
  //   },
  //   onAnyTerrainStart() {
  //     const pokemon = this.effectData.target;
  //     delete pokemon.volatiles['mimicry'];
  //     pokemon.addVolatile('mimicry');
  //   },
  //   onEnd(pokemon) {
  //     delete pokemon.volatiles['mimicry'];
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       let newType;
  //       switch (this.field.terrain) {
  //       case 'electricterrain':
  //         newType = 'Electric';
  //         break;
  //       case 'grassyterrain':
  //         newType = 'Grass';
  //         break;
  //       case 'mistyterrain':
  //         newType = 'Fairy';
  //         break;
  //       case 'psychicterrain':
  //         newType = 'Psychic';
  //         break;
  //       }
  //       if (!newType || pokemon.getTypes().join() === newType || !pokemon.setType(newType)) { return; }
  //       this.add('-start', pokemon, 'typechange', newType, '[from] ability: Mimicry');
  //     },
  //     onUpdate(pokemon) {
  //       if (!this.field.terrain) {
  //         const types = pokemon.species.types;
  //         if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) { return; }
  //         this.add('-activate', pokemon, 'ability: Mimicry');
  //         this.add('-end', pokemon, 'typechange', '[silent]');
  //         pokemon.removeVolatile('mimicry');
  //       }
  //     },
  //   },
  // },
  // minus: {
  //   onModifySpA(spa, pokemon) {
  //     if (pokemon.side.active.length === 1) {
  //       return;
  //     }
  //     for (const allyActive of pokemon.side.active) {
  //       if (allyActive && allyActive.position !== pokemon.position &&
  //                   !allyActive.fainted && allyActive.hasAbility(['minus', 'plus'])) {
  //         return this.chainModify(1.5);
  //       }
  //     }
  //   },
  // },
  // mirrorarmor: {
  //   onBoost(boost, target, source, effect) {
  //     // Don't bounce self stat changes, or boosts that have already bounced
  //     if (target === source || !boost || effect.id === 'mirrorarmor') { return; }
  //     let b;
  //     for (b in boost) {
  //       if (boost[b] < 0) {
  //         const negativeBoost = {};
  //         negativeBoost[b] = boost[b];
  //         delete boost[b];
  //         this.add('-ability', target, 'Mirror Armor');
  //         this.boost(negativeBoost, source, target, null, true);
  //       }
  //     }
  //   },
  // },
  // mistysurge: {
  //   onStart(source) {
  //     this.field.setTerrain('mistyterrain');
  //   },
  // },
  // moldbreaker: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Mold Breaker');
  //   },
  //   onModifyMove(move) {
  //     move.ignoreAbility = true;
  //   },
  // },
  // moody: {
  //   onResidual(pokemon) {
  //     let stats = [];
  //     const boost = {};
  //     let statPlus;
  //     for (statPlus in pokemon.boosts) {
  //       if (statPlus === 'accuracy' || statPlus === 'evasion') { continue; }
  //       if (pokemon.boosts[statPlus] < 6) {
  //         stats.push(statPlus);
  //       }
  //     }
  //     let randomStat = stats.length ? this.sample(stats) : undefined;
  //     if (randomStat) { boost[randomStat] = 2; }
  //     stats = [];
  //     let statMinus;
  //     for (statMinus in pokemon.boosts) {
  //       if (statMinus === 'accuracy' || statMinus === 'evasion') { continue; }
  //       if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
  //         stats.push(statMinus);
  //       }
  //     }
  //     randomStat = stats.length ? this.sample(stats) : undefined;
  //     if (randomStat) { boost[randomStat] = -1; }
  //     this.boost(boost);
  //   },
  // },
  // motordrive: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && move.type === 'Electric') {
  //       if (!this.boost({spe: 1})) {
  //         this.add('-immune', target, '[from] ability: Motor Drive');
  //       }
  //       return null;
  //     }
  //   },
  // },
  // moxie: {
  //   onSourceAfterFaint(length, target, source, effect) {
  //     if (effect && effect.effectType === 'Move') {
  //       this.boost({atk: length}, source);
  //     }
  //   },
  // },
  // multiscale: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (target.hp >= target.maxhp) {
  //       this.debug('Multiscale weaken');
  //       return this.chainModify(0.5);
  //     }
  //   },
  // },
  // mummy: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact'] && source.ability !== 'mummy') {
  //       const oldAbility = source.setAbility('mummy', target);
  //       if (oldAbility) {
  //         this.add('-activate', target, 'ability: Mummy', this.dex.getAbility(oldAbility).name, '[of] ' + source);
  //       }
  //     }
  //   },
  //   onBasePower(basePower, pokemon, target, move) {
  //     if (move.multihitType === 'parentalbond' && move.hit > 1) { return this.chainModify(0.25); }
  //   },
  // },
  // naturalcure: {
  //   onCheckShow(pokemon) {
  //     // This is complicated
  //     // For the most part, in-game, it's obvious whether or not Natural Cure activated,
  //     // since you can see how many of your opponent's pokemon are statused.
  //     // The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
  //     // that could have Natural Cure switch out, but only some of them get cured.
  //     if (pokemon.side.active.length === 1) { return; }
  //     if (pokemon.showCure === true || pokemon.showCure === false) { return; }
  //     const cureList = [];
  //     let noCureCount = 0;
  //     for (const curPoke of pokemon.side.active) {
  //       // pokemon not statused
  //       if (!curPoke || !curPoke.status) {
  //         // this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
  //         continue;
  //       }
  //       if (curPoke.showCure) {
  //         // this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
  //         continue;
  //       }
  //       const species = curPoke.species;
  //       // pokemon can't get Natural Cure
  //       if (!Object.values(species.abilities).includes('Natural Cure')) {
  //         // this.add('-message', "" + curPoke + " skipped: no Natural Cure");
  //         continue;
  //       }
  //       // pokemon's ability is known to be Natural Cure
  //       if (!species.abilities['1'] && !species.abilities['H']) {
  //         // this.add('-message', "" + curPoke + " skipped: only one ability");
  //         continue;
  //       }
  //       // pokemon isn't switching this turn
  //       if (curPoke !== pokemon && !this.queue.willSwitch(curPoke)) {
  //         // this.add('-message', "" + curPoke + " skipped: not switching");
  //         continue;
  //       }
  //       if (curPoke.hasAbility('naturalcure')) {
  //         // this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
  //         cureList.push(curPoke);
  //       } else {
  //         // this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
  //         noCureCount++;
  //       }
  //     }
  //     if (!cureList.length || !noCureCount) {
  //       // It's possible to know what pokemon were cured
  //       for (const pkmn of cureList) {
  //         pkmn.showCure = true;
  //       }
  //     } else {
  //       // It's not possible to know what pokemon were cured
  //       // Unlike a -hint, this is real information that battlers need, so we use a -message
  //       this.add('-message', "(" + cureList.length + " of " + pokemon.side.name + "'s pokemon " + (cureList.length === 1 ? "was" : "were") + " cured by Natural Cure.)");
  //       for (const pkmn of cureList) {
  //         pkmn.showCure = false;
  //       }
  //     }
  //   },
  //   onSwitchOut(pokemon) {
  //     if (!pokemon.status) { return; }
  //     // if pokemon.showCure is undefined, it was skipped because its ability
  //     // is known
  //     if (pokemon.showCure === undefined) { pokemon.showCure = true; }
  //     if (pokemon.showCure) { this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure'); }
  //     pokemon.setStatus('');
  //     // only reset .showCure if it's false
  //     // (once you know a Pokemon has Natural Cure, its cures are always known)
  //     if (!pokemon.showCure) { pokemon.showCure = undefined; }
  //   },
  // },
  // neuroforce: {
  //   onModifyDamage(damage, source, target, move) {
  //     if (move && target.getMoveHitData(move).typeMod > 0) {
  //       return this.chainModify([0x1400, 0x1000]);
  //     }
  //   },
  // },
  // neutralizinggas: {
  //   onPreStart(pokemon) {
  //     this.add('-ability', pokemon, 'Neutralizing Gas');
  //     pokemon.abilityData.ending = false;
  //   },
  //   onEnd(source) {
  //     // FIXME this happens before the pokemon switches out, should be the opposite order.
  //     // Not an easy fix since we cant use a supported event. Would need some kind of special event that
  //     // gathers events to run after the switch and then runs them when the ability is no longer accessible.
  //     // (If your tackling this, do note extreme weathers have the same issue)
  //     // Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
  //     source.abilityData.ending = true;
  //     for (const pokemon of this.getAllActive()) {
  //       if (pokemon !== source) {
  //         // Will be suppressed by Pokemon#ignoringAbility if needed
  //         this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityData, pokemon);
  //       }
  //     }
  //   },
  // },
  // noguard: {
  //   onAnyInvulnerability(target, source, move) {
  //     if (move && (source === this.effectData.target || target === this.effectData.target)) { return 0; }
  //   },
  //   onAnyAccuracy(accuracy, target, source, move) {
  //     if (move && (source === this.effectData.target || target === this.effectData.target)) {
  //       return true;
  //     }
  //     return accuracy;
  //   },
  // },
  // normalize: {
  //   onModifyType(move, pokemon) {
  //     const noModifyType = [
  //       'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'weatherball',
  //     ];
  //     if (!(move.isZ && move.category !== 'Status') && !noModifyType.includes(move.id)) {
  //       move.type = 'Normal';
  //       move.normalizeBoosted = true;
  //     }
  //   },
  //   onBasePower(basePower, pokemon, target, move) {
  //     if (move.normalizeBoosted) { return this.chainModify([0x1333, 0x1000]); }
  //   },
  // },
  // oblivious: {
  //   onUpdate(pokemon) {
  //     if (pokemon.volatiles['attract']) {
  //       this.add('-activate', pokemon, 'ability: Oblivious');
  //       pokemon.removeVolatile('attract');
  //       this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
  //     }
  //     if (pokemon.volatiles['taunt']) {
  //       this.add('-activate', pokemon, 'ability: Oblivious');
  //       pokemon.removeVolatile('taunt');
  //       // Taunt's volatile already sends the -end message when removed
  //     }
  //   },
  //   onImmunity(type, pokemon) {
  //     if (type === 'attract') { return false; }
  //   },
  //   onTryHit(pokemon, target, move) {
  //     if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
  //       this.add('-immune', pokemon, '[from] ability: Oblivious');
  //       return null;
  //     }
  //   },
  // },
  // overcoat: {
  //   onImmunity(type, pokemon) {
  //     if (type === 'sandstorm' || type === 'hail' || type === 'powder') { return false; }
  //   },
  //   onTryHit(target, source, move) {
  //     if (move.flags['powder'] && target !== source && this.dex.getImmunity('powder', target)) {
  //       this.add('-immune', target, '[from] ability: Overcoat');
  //       return null;
  //     }
  //   },
  // },
  // overgrow: {
  //   onModifyAtk(atk, attacker, defender, move) {
  //     if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
  //       this.debug('Overgrow boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onModifySpA(atk, attacker, defender, move) {
  //     if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
  //       this.debug('Overgrow boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // owntempo: {
  //   onUpdate(pokemon) {
  //     if (pokemon.volatiles['confusion']) {
  //       this.add('-activate', pokemon, 'ability: Own Tempo');
  //       pokemon.removeVolatile('confusion');
  //     }
  //   },
  //   onTryAddVolatile(status, pokemon) {
  //     if (status.id === 'confusion') { return null; }
  //   },
  //   onHit(target, source, move) {
  //     if ((move === null || move === void 0 ? void 0 : move.volatileStatus) === 'confusion') {
  //       this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
  //     }
  //   },
  // },
  // parentalbond: {
  //   onPrepareHit(source, target, move) {
  //     if (move.category === 'Status' || move.selfdestruct || move.multihit) { return; }
  //     if (['iceball', 'rollout'].includes(move.id)) { return; }
  //     if (!move.flags['charge'] && !move.spreadHit && !move.isZ && !move.isMax) {
  //       move.multihit = 2;
  //       move.multihitType = 'parentalbond';
  //     }
  //   },
  //   onBasePower(basePower, pokemon, target, move) {
  //     if (move.multihitType === 'parentalbond' && move.hit > 1) { return this.chainModify(0.25); }
  //   },
  //   onSourceModifySecondaries(secondaries, target, source, move) {
  //     if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
  //       // hack to prevent accidentally suppressing King's Rock/Razor Fang
  //       return secondaries.filter(effect => effect.volatileStatus === 'flinch');
  //     }
  //   },
  // },
  // pastelveil: {
  //   onStart(pokemon) {
  //     for (const ally of pokemon.allies()) {
  //       if (['psn', 'tox'].includes(ally.status)) {
  //         this.add('-activate', pokemon, 'ability: Pastel Veil');
  //         ally.cureStatus();
  //       }
  //     }
  //   },
  //   onUpdate(pokemon) {
  //     if (['psn', 'tox'].includes(pokemon.status)) {
  //       this.add('-activate', pokemon, 'ability: Pastel Veil');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onAllySwitchIn(pokemon) {
  //     if (['psn', 'tox'].includes(pokemon.status)) {
  //       this.add('-activate', this.effectData.target, 'ability: Pastel Veil');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (!['psn', 'tox'].includes(status.id)) { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Pastel Veil');
  //     }
  //     return false;
  //   },
  //   onAllySetStatus(status, target, source, effect) {
  //     let _a;
  //     if (!['psn', 'tox'].includes(status.id)) { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       const effectHolder = this.effectData.target;
  //       this.add('-block', target, 'ability: Pastel Veil', '[of] ' + effectHolder);
  //     }
  //     return false;
  //   },
  // },
  // perishbody: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (!move.flags['contact']) { return; }
  //     let announced = false;
  //     for (const pokemon of [target, source]) {
  //       if (pokemon.volatiles['perishsong']) { continue; }
  //       if (!announced) {
  //         this.add('-ability', target, 'Perish Body');
  //         announced = true;
  //       }
  //       pokemon.addVolatile('perishsong');
  //     }
  //   },
  // },
  // pickpocket: {
  //   onAfterMoveSecondary(target, source, move) {
  //     if (source && source !== target && (move === null || move === void 0 ? void 0 : move.flags['contact'])) {
  //       if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) {
  //         return;
  //       }
  //       const yourItem = source.takeItem(target);
  //       if (!yourItem) {
  //         return;
  //       }
  //       if (!target.setItem(yourItem)) {
  //         source.item = yourItem.id;
  //         return;
  //       }
  //       this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Pickpocket', '[of] ' + source);
  //       this.add('-item', target, yourItem, '[from] ability: Pickpocket', '[of] ' + source);
  //     }
  //   },
  // },
  // pickup: {
  //   onResidual(pokemon) {
  //     if (pokemon.item) { return; }
  //     const pickupTargets = [];
  //     for (const target of this.getAllActive()) {
  //       if (target.lastItem && target.usedItemThisTurn && this.isAdjacent(pokemon, target)) {
  //         pickupTargets.push(target);
  //       }
  //     }
  //     if (!pickupTargets.length) { return; }
  //     const randomTarget = this.sample(pickupTargets);
  //     const item = randomTarget.lastItem;
  //     randomTarget.lastItem = '';
  //     this.add('-item', pokemon, this.dex.getItem(item), '[from] ability: Pickup');
  //     pokemon.setItem(item);
  //   },
  // },
  // pixilate: {
  //   onModifyType(move, pokemon) {
  //     const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'];
  //     if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
  //       move.type = 'Fairy';
  //       move.pixilateBoosted = true;
  //     }
  //   },
  //   onBasePower(basePower, pokemon, target, move) {
  //     if (move.pixilateBoosted) { return this.chainModify([0x1333, 0x1000]); }
  //   },
  // },
  // plus: {
  //   onModifySpA(spa, pokemon) {
  //     if (pokemon.side.active.length === 1) {
  //       return;
  //     }
  //     for (const allyActive of pokemon.side.active) {
  //       if (allyActive && allyActive.position !== pokemon.position &&
  //                   !allyActive.fainted && allyActive.hasAbility(['minus', 'plus'])) {
  //         return this.chainModify(1.5);
  //       }
  //     }
  //   },
  // },
  // poisonheal: {
  //   onDamage(damage, target, source, effect) {
  //     if (effect.id === 'psn' || effect.id === 'tox') {
  //       this.heal(target.baseMaxhp / 8);
  //       return false;
  //     }
  //   },
  // },
  // poisonpoint: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       if (this.randomChance(3, 10)) {
  //         source.trySetStatus('psn', target);
  //       }
  //     }
  //   },
  // },
  // poisontouch: {
  //   onModifyMove(move) {
  //     if (!move || !move.flags['contact'] || move.target === 'self') { return; }
  //     if (!move.secondaries) {
  //       move.secondaries = [];
  //     }
  //     move.secondaries.push({
  //       chance: 30,
  //       status: 'psn',
  //       ability: this.dex.getAbility('poisontouch'),
  //     });
  //   },
  // },
  // powerconstruct: {
  //   onResidual(pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies !== 'Zygarde' || pokemon.transformed || !pokemon.hp) { return; }
  //     if (pokemon.species.id === 'zygardecomplete' || pokemon.hp > pokemon.maxhp / 2) { return; }
  //     this.add('-activate', pokemon, 'ability: Power Construct');
  //     pokemon.formeChange('Zygarde-Complete', this.effect, true);
  //     pokemon.baseMaxhp = Math.floor(Math.floor(2 * pokemon.species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
  //     const newMaxHP = pokemon.volatiles['dynamax'] ? (2 * pokemon.baseMaxhp) : pokemon.baseMaxhp;
  //     pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
  //     pokemon.maxhp = newMaxHP;
  //     this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
  //   },
  // },
  // powerofalchemy: {
  //   onAllyFaint(target) {
  //     if (!this.effectData.target.hp) { return; }
  //     const ability = target.getAbility();
  //     const bannedAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'gulpmissile', 'hungerswitch', 'iceface', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'wonderguard', 'zenmode',
  //     ];
  //     if (bannedAbilities.includes(target.ability)) { return; }
  //     this.add('-ability', this.effectData.target, ability, '[from] ability: Power of Alchemy', '[of] ' + target);
  //     this.effectData.target.setAbility(ability);
  //   },
  // },
  // powerspot: {
  //   onAllyBasePower(basePower, attacker, defender, move) {
  //     if (attacker !== this.effectData.target) {
  //       this.debug('Power Spot boost');
  //       return this.chainModify([0x14CD, 0x1000]);
  //     }
  //   },
  // },
  // prankster: {
  //   onModifyPriority(priority, pokemon, target, move) {
  //     if ((move === null || move === void 0 ? void 0 : move.category) === 'Status') {
  //       move.pranksterBoosted = true;
  //       return priority + 1;
  //     }
  //   },
  // },
  // pressure: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Pressure');
  //   },
  //   onDeductPP(target, source) {
  //     if (target.side === source.side) { return; }
  //     return 1;
  //   },
  // },
  // primordialsea: {
  //   onStart(source) {
  //     this.field.setWeather('primordialsea');
  //   },
  //   onAnySetWeather(target, source, weather) {
  //     const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
  //     if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) { return false; }
  //   },
  //   onEnd(pokemon) {
  //     if (this.field.weatherData.source !== pokemon) { return; }
  //     for (const target of this.getAllActive()) {
  //       if (target === pokemon) { continue; }
  //       if (target.hasAbility('primordialsea')) {
  //         this.field.weatherData.source = target;
  //         return;
  //       }
  //     }
  //     this.field.clearWeather();
  //   },
  // },
  // prismarmor: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (target.getMoveHitData(move).typeMod > 0) {
  //       this.debug('Prism Armor neutralize');
  //       return this.chainModify(0.75);
  //     }
  //   },
  // },
  // propellertail: {
  //   onModifyMove(move) {
  //     // this doesn't actually do anything because ModifyMove happens after the tracksTarget check
  //     // the actual implementation is in Battle#getTarget
  //     move.tracksTarget = true;
  //   },
  // },
  // protean: {
  //   onPrepareHit(source, target, move) {
  //     if (move.hasBounced) { return; }
  //     const type = move.type;
  //     if (type && type !== '???' && source.getTypes().join() !== type) {
  //       if (!source.setType(type)) { return; }
  //       this.add('-start', source, 'typechange', type, '[from] ability: Protean');
  //     }
  //   },
  // },
  // psychicsurge: {
  //   onStart(source) {
  //     this.field.setTerrain('psychicterrain');
  //   },
  // },
  // punkrock: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (move.flags['sound']) {
  //       this.debug('Punk Rock boost');
  //       return this.chainModify([0x14CD, 0x1000]);
  //     }
  //   },
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.flags['sound']) {
  //       this.debug('Punk Rock weaken');
  //       return this.chainModify(0.5);
  //     }
  //   },
  // },
  // purepower: {
  //   onModifyAtk(atk) {
  //     return this.chainModify(2);
  //   },
  // },
  // queenlymajesty: {
  //   onFoeTryMove(target, source, move) {
  //     const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
  //     if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
  //       return;
  //     }
  //     const dazzlingHolder = this.effectData.target;
  //     if ((source.side === dazzlingHolder.side || move.target === 'all') && move.priority > 0.1) {
  //       this.attrLastMove('[still]');
  //       this.add('cant', dazzlingHolder, 'ability: Queenly Majesty', move, '[of] ' + target);
  //       return false;
  //     }
  //   },
  // },
  // quickfeet: {
  //   onModifySpe(spe, pokemon) {
  //     if (pokemon.status) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // raindish: {
  //   onWeather(target, source, effect) {
  //     if (target.hasItem('utilityumbrella')) { return; }
  //     if (effect.id === 'raindance' || effect.id === 'primordialsea') {
  //       this.heal(target.baseMaxhp / 16);
  //     }
  //   },
  // },
  // rattled: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (['Dark', 'Bug', 'Ghost'].includes(move.type)) {
  //       this.boost({spe: 1});
  //     }
  //   },
  //   onAfterBoost(boost, target, source, effect) {
  //     if (effect && effect.id === 'intimidate') {
  //       this.boost({spe: 1});
  //     }
  //   },
  // },
  // receiver: {
  //   onAllyFaint(target) {
  //     if (!this.effectData.target.hp) { return; }
  //     const ability = target.getAbility();
  //     const bannedAbilities = [
  //       'battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'gulpmissile', 'hungerswitch', 'iceface', 'illusion', 'imposter', 'multitype', 'neutralizinggas', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'wonderguard', 'zenmode',
  //     ];
  //     if (bannedAbilities.includes(target.ability)) { return; }
  //     this.add('-ability', this.effectData.target, ability, '[from] ability: Receiver', '[of] ' + target);
  //     this.effectData.target.setAbility(ability);
  //   },
  // },
  // reckless: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (move.recoil || move.hasCrashDamage) {
  //       this.debug('Reckless boost');
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // refrigerate: {
  //   onModifyType(move, pokemon) {
  //     const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'];
  //     if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
  //       move.type = 'Ice';
  //       move.refrigerateBoosted = true;
  //     }
  //   },
  //   onBasePower(basePower, pokemon, target, move) {
  //     if (move.refrigerateBoosted) { return this.chainModify([0x1333, 0x1000]); }
  //   },
  // },
  // regenerator: {
  //   onSwitchOut(pokemon) {
  //     pokemon.heal(pokemon.baseMaxhp / 3);
  //   },
  // },
  // ripen: {
  //   onTryHeal(damage, target, source, effect) {
  //     if (effect?.isBerry) {
  //       this.debug(`Ripen doubled healing`);
  //       return this.chainModify(2);
  //     }
  //   },
  //   onBoost(boost, target, source, effect) {
  //     if (effect?.isBerry) {
  //       this.debug(`Ripen doubled boost`);
  //       let b;
  //       for (b in boost) {
  //         boost[b] *= 2;
  //       }
  //     }
  //   },
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (target.abilityData.berryWeaken) {
  //       // Pokemon ate a berry that weakened damage from this attack, ripen adds another 1/4 that.
  //       this.debug(`Ripen increases damage reduction to 3/4`);
  //       target.abilityData.berryWeaken = "";
  //       // Not sure if this is the correct multiplier to get 3/4 total, assuming its taking 1/2 of 1/2 (3/4)
  //       return this.chainModify(0.5);
  //     }
  //   },
  //   onEatItem(item, pokemon) {
  //     const weakenBerries = [
  //       'Babiri Berry', 'Charti Berry', 'Chilan Berry', 'Chople Berry', 'Coba Berry', 'Colbur Berry', 'Haban Berry', 'Kasib Berry', 'Kebia Berry', 'Occa Berry', 'Passho Berry', 'Payapa Berry', 'Rindo Berry', 'Roseli Berry', 'Shuca Berry', 'Tanga Berry', 'Wacan Berry', 'Yache Berry',
  //     ];
  //     if (weakenBerries.includes(item.name)) {
  //       // Record that the pokemon ate a berry to resist an attack
  //       pokemon.abilityData.berryWeaken = "true";
  //     }
  //   },
  // },
  // rivalry: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (attacker.gender && defender.gender) {
  //       if (attacker.gender === defender.gender) {
  //         this.debug('Rivalry boost');
  //         return this.chainModify(1.25);
  //       } else {
  //         this.debug('Rivalry weaken');
  //         return this.chainModify(0.75);
  //       }
  //     }
  //   },
  // },
  // rockhead: {
  //   onDamage(damage, target, source, effect) {
  //     if (effect.id === 'recoil') {
  //       if (!this.activeMove) { throw new Error("Battle.activeMove is null"); }
  //       if (this.activeMove.id !== 'struggle') { return null; }
  //     }
  //   },
  // },
  // roughskin: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       this.damage(source.baseMaxhp / 8, source, target);
  //     }
  //   },
  // },
  // sandforce: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (this.field.isWeather('sandstorm')) {
  //       if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
  //         this.debug('Sand Force boost');
  //         return this.chainModify([0x14CD, 0x1000]);
  //       }
  //     }
  //   },
  //   onImmunity(type, pokemon) {
  //     if (type === 'sandstorm') { return false; }
  //   },
  // },
  // sandrush: {
  //   onModifySpe(spe, pokemon) {
  //     if (this.field.isWeather('sandstorm')) {
  //       return this.chainModify(2);
  //     }
  //   },
  //   onImmunity(type, pokemon) {
  //     if (type === 'sandstorm') { return false; }
  //   },
  // },
  // sandspit: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (this.field.getWeather().id !== 'sandstorm') {
  //       this.field.setWeather('sandstorm');
  //     }
  //   },
  // },
  // sandstream: {
  //   onStart(source) {
  //     this.field.setWeather('sandstorm');
  //   },
  // },
  // sandveil: {
  //   onImmunity(type, pokemon) {
  //     if (type === 'sandstorm') { return false; }
  //   },
  //   onModifyAccuracy(accuracy) {
  //     if (typeof accuracy !== 'number') { return; }
  //     if (this.field.isWeather('sandstorm')) {
  //       this.debug('Sand Veil - decreasing accuracy');
  //       return accuracy * 0.8;
  //     }
  //   },
  // },
  // sapsipper: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && move.type === 'Grass') {
  //       if (!this.boost({atk: 1})) {
  //         this.add('-immune', target, '[from] ability: Sap Sipper');
  //       }
  //       return null;
  //     }
  //   },
  //   onAllyTryHitSide(target, source, move) {
  //     if (target === this.effectData.target || target.side !== source.side) { return; }
  //     if (move.type === 'Grass') {
  //       this.boost({atk: 1}, this.effectData.target);
  //     }
  //   },
  // },
  // schooling: {
  //   onStart(pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) { return; }
  //     if (pokemon.hp > pokemon.maxhp / 4) {
  //       if (pokemon.species.id === 'wishiwashi') {
  //         pokemon.formeChange('Wishiwashi-School');
  //       }
  //     } else {
  //       if (pokemon.species.id === 'wishiwashischool') {
  //         pokemon.formeChange('Wishiwashi');
  //       }
  //     }
  //   },
  //   onResidual(pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 ||
  //               pokemon.transformed || !pokemon.hp) { return; }
  //     if (pokemon.hp > pokemon.maxhp / 4) {
  //       if (pokemon.species.id === 'wishiwashi') {
  //         pokemon.formeChange('Wishiwashi-School');
  //       }
  //     } else {
  //       if (pokemon.species.id === 'wishiwashischool') {
  //         pokemon.formeChange('Wishiwashi');
  //       }
  //     }
  //   },
  // },
  // scrappy: {
  //   onModifyMove(move) {
  //     if (!move.ignoreImmunity) { move.ignoreImmunity = {}; }
  //     if (move.ignoreImmunity !== true) {
  //       move.ignoreImmunity['Fighting'] = true;
  //       move.ignoreImmunity['Normal'] = true;
  //     }
  //   },
  // },
  // screencleaner: {
  //   onStart(pokemon) {
  //     let activated = false;
  //     for (const sideCondition of ['reflect', 'lightscreen', 'auroraveil']) {
  //       if (pokemon.side.getSideCondition(sideCondition)) {
  //         if (!activated) {
  //           this.add('-activate', pokemon, 'ability: Screen Cleaner');
  //           activated = true;
  //         }
  //         pokemon.side.removeSideCondition(sideCondition);
  //       }
  //       if (pokemon.side.foe.getSideCondition(sideCondition)) {
  //         if (!activated) {
  //           this.add('-activate', pokemon, 'ability: Screen Cleaner');
  //           activated = true;
  //         }
  //         pokemon.side.foe.removeSideCondition(sideCondition);
  //       }
  //     }
  //   },
  // },
  // serenegrace: {
  //   onModifyMove(move) {
  //     if (move.secondaries) {
  //       this.debug('doubling secondary chance');
  //       for (const secondary of move.secondaries) {
  //         if (secondary.chance) { secondary.chance *= 2; }
  //       }
  //     }
  //   },
  // },
  // shadowshield: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (target.hp >= target.maxhp) {
  //       this.debug('Shadow Shield weaken');
  //       return this.chainModify(0.5);
  //     }
  //   },
  // },
  // shadowtag: {
  //   onFoeTrapPokemon(pokemon) {
  //     if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, this.effectData.target)) {
  //       pokemon.tryTrap(true);
  //     }
  //   },
  //   onFoeMaybeTrapPokemon(pokemon, source) {
  //     if (!source) { source = this.effectData.target; }
  //     if (!source || !this.isAdjacent(pokemon, source)) { return; }
  //     if (!pokemon.hasAbility('shadowtag')) {
  //       pokemon.maybeTrapped = true;
  //     }
  //   },
  // },
  // shedskin: {
  //   onResidual(pokemon) {
  //     if (pokemon.hp && pokemon.status && this.randomChance(1, 3)) {
  //       this.debug('shed skin');
  //       this.add('-activate', pokemon, 'ability: Shed Skin');
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // sheerforce: {
  //   onModifyMove(move, pokemon) {
  //     if (move.secondaries) {
  //       delete move.secondaries;
  //       // Technically not a secondary effect, but it is negated
  //       if (move.id === 'clangoroussoulblaze') { delete move.selfBoost; }
  //       // Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
  //       move.hasSheerForce = true;
  //     }
  //   },
  //   onBasePower(basePower, pokemon, target, move) {
  //     if (move.hasSheerForce) { return this.chainModify([0x14CD, 0x1000]); }
  //   },
  // },
  // shielddust: {
  //   onModifySecondaries(secondaries) {
  //     this.debug('Shield Dust prevent secondary');
  //     return secondaries.filter(effect => !!(effect.self || effect.dustproof));
  //   },
  // },
  // shieldsdown: {
  //   onStart(pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed) { return; }
  //     if (pokemon.hp > pokemon.maxhp / 2) {
  //       if (pokemon.species.forme !== 'Meteor') {
  //         pokemon.formeChange('Minior-Meteor');
  //       }
  //     } else {
  //       if (pokemon.species.forme === 'Meteor') {
  //         pokemon.formeChange(pokemon.set.species);
  //       }
  //     }
  //   },
  //   onResidual(pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed || !pokemon.hp) { return; }
  //     if (pokemon.hp > pokemon.maxhp / 2) {
  //       if (pokemon.species.forme !== 'Meteor') {
  //         pokemon.formeChange('Minior-Meteor');
  //       }
  //     } else {
  //       if (pokemon.species.forme === 'Meteor') {
  //         pokemon.formeChange(pokemon.set.species);
  //       }
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (target.species.id !== 'miniormeteor' || target.transformed) { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Shields Down');
  //     }
  //     return false;
  //   },
  //   onTryAddVolatile(status, target) {
  //     if (target.species.id !== 'miniormeteor' || target.transformed) { return; }
  //     if (status.id !== 'yawn') { return; }
  //     this.add('-immune', target, '[from] ability: Shields Down');
  //     return null;
  //   },
  // },
  // simple: {
  //   onBoost(boost, target, source, effect) {
  //     if (effect && effect.id === 'zpower') { return; }
  //     let i;
  //     for (i in boost) {
  //       boost[i] *= 2;
  //     }
  //   },
  // },
  // skilllink: {
  //   onModifyMove(move) {
  //     if (move.multihit && Array.isArray(move.multihit) && move.multihit.length) {
  //       move.multihit = move.multihit[1];
  //     }
  //     if (move.multiaccuracy) {
  //       delete move.multiaccuracy;
  //     }
  //   },
  // },
  // slowstart: {
  //   onStart(pokemon) {
  //     pokemon.addVolatile('slowstart');
  //   },
  //   onEnd(pokemon) {
  //     delete pokemon.volatiles['slowstart'];
  //     this.add('-end', pokemon, 'Slow Start', '[silent]');
  //   },
  //   effect: {
  //     onStart(target) {
  //       this.add('-start', target, 'ability: Slow Start');
  //     },
  //     onModifyAtk(atk, pokemon) {
  //       return this.chainModify(0.5);
  //     },
  //     onModifySpe(spe, pokemon) {
  //       return this.chainModify(0.5);
  //     },
  //     onEnd(target) {
  //       this.add('-end', target, 'Slow Start');
  //     },
  //   },
  // },
  // slushrush: {
  //   onModifySpe(spe, pokemon) {
  //     if (this.field.isWeather('hail')) {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // sniper: {
  //   onModifyDamage(damage, source, target, move) {
  //     if (target.getMoveHitData(move).crit) {
  //       this.debug('Sniper boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // snowcloak: {
  //   onImmunity(type, pokemon) {
  //     if (type === 'hail') { return false; }
  //   },
  //   onModifyAccuracy(accuracy) {
  //     if (typeof accuracy !== 'number') { return; }
  //     if (this.field.isWeather('hail')) {
  //       this.debug('Snow Cloak - decreasing accuracy');
  //       return accuracy * 0.8;
  //     }
  //   },
  // },
  // snowwarning: {
  //   onStart(source) {
  //     this.field.setWeather('hail');
  //   },
  // },
  // solarpower: {
  //   onModifySpA(spa, pokemon) {
  //     if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onWeather(target, source, effect) {
  //     if (target.hasItem('utilityumbrella')) { return; }
  //     if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
  //       this.damage(target.baseMaxhp / 8, target, target);
  //     }
  //   },
  // },
  // solidrock: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (target.getMoveHitData(move).typeMod > 0) {
  //       this.debug('Solid Rock neutralize');
  //       return this.chainModify(0.75);
  //     }
  //   },
  // },
  // soulheart: {
  //   onAnyFaint() {
  //     this.boost({spa: 1}, this.effectData.target);
  //   },
  // },
  // soundproof: {
  //   onTryHit(target, source, move) {
  //     if (move.target !== 'self' && move.flags['sound']) {
  //       this.add('-immune', target, '[from] ability: Soundproof');
  //       return null;
  //     }
  //   },
  //   onAllyTryHitSide(target, source, move) {
  //     if (move.flags['sound']) {
  //       this.add('-immune', this.effectData.target, '[from] ability: Soundproof');
  //     }
  //   },
  // },
  // speedboost: {
  //   onResidual(pokemon) {
  //     if (pokemon.activeTurns) {
  //       this.boost({spe: 1});
  //     }
  //   },
  // },
  // stakeout: {
  //   onModifyAtk(atk, attacker, defender) {
  //     if (!defender.activeTurns) {
  //       this.debug('Stakeout boost');
  //       return this.chainModify(2);
  //     }
  //   },
  //   onModifySpA(atk, attacker, defender) {
  //     if (!defender.activeTurns) {
  //       this.debug('Stakeout boost');
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // stall: {
  //   onFractionalPriority(priority) {
  //     return Math.round(priority) - 0.1;
  //   },
  // },
  // stalwart: {
  //   onModifyMove(move) {
  //     // this doesn't actually do anything because ModifyMove happens after the tracksTarget check
  //     // the actual implementation is in Battle#getTarget
  //     move.tracksTarget = true;
  //   },
  // },
  // stamina: {
  //   onDamagingHit(damage, target, source, effect) {
  //     this.boost({def: 1});
  //   },
  // },
  // stancechange: {
  //   onBeforeMove(attacker, defender, move) {
  //     if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed) { return; }
  //     if (move.category === 'Status' && move.id !== 'kingsshield') { return; }
  //     const targetForme = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
  //     if (attacker.species.name !== targetForme) { attacker.formeChange(targetForme); }
  //   },
  // },
  // static: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       if (this.randomChance(3, 10)) {
  //         source.trySetStatus('par', target);
  //       }
  //     }
  //   },
  // },
  // steadfast: {
  //   onFlinch(pokemon) {
  //     this.boost({spe: 1});
  //   },
  // },
  // steamengine: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (['Water', 'Fire'].includes(move.type)) {
  //       this.boost({spe: 6});
  //     }
  //   },
  // },
  // steelworker: {
  //   onModifyAtk(atk, attacker, defender, move) {
  //     if (move.type === 'Steel') {
  //       this.debug('Steelworker boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onModifySpA(atk, attacker, defender, move) {
  //     if (move.type === 'Steel') {
  //       this.debug('Steelworker boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // steelyspirit: {
  //   onAllyBasePower(basePower, attacker, defender, move) {
  //     if (move.type === 'Steel') {
  //       this.debug('Steely Spirit boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // stench: {
  //   onModifyMove(move) {
  //     if (move.category !== "Status") {
  //       this.debug('Adding Stench flinch');
  //       if (!move.secondaries) { move.secondaries = []; }
  //       for (const secondary of move.secondaries) {
  //         if (secondary.volatileStatus === 'flinch') { return; }
  //       }
  //       move.secondaries.push({
  //         chance: 10,
  //         volatileStatus: 'flinch',
  //       });
  //     }
  //   },
  // },
  // stickyhold: {
  //   onTakeItem(item, pokemon, source) {
  //     if (this.suppressingAttackEvents(pokemon) || !pokemon.hp || pokemon.item === 'stickybarb') { return; }
  //     if (!this.activeMove) { throw new Error("Battle.activeMove is null"); }
  //     if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
  //       this.add('-activate', pokemon, 'ability: Sticky Hold');
  //       return false;
  //     }
  //   },
  // },
  // stormdrain: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && move.type === 'Water') {
  //       if (!this.boost({spa: 1})) {
  //         this.add('-immune', target, '[from] ability: Storm Drain');
  //       }
  //       return null;
  //     }
  //   },
  //   onAnyRedirectTarget(target, source, source2, move) {
  //     if (move.type !== 'Water' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) { return; }
  //     const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
  //     if (this.validTarget(this.effectData.target, source, redirectTarget)) {
  //       if (move.smartTarget) { move.smartTarget = false; }
  //       if (this.effectData.target !== target) {
  //         this.add('-activate', this.effectData.target, 'ability: Storm Drain');
  //       }
  //       return this.effectData.target;
  //     }
  //   },
  // },
  // strongjaw: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (move.flags['bite']) {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // sturdy: {
  //   onTryHit(pokemon, target, move) {
  //     if (move.ohko) {
  //       this.add('-immune', pokemon, '[from] ability: Sturdy');
  //       return null;
  //     }
  //   },
  //   onDamage(damage, target, source, effect) {
  //     if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
  //       this.add('-ability', target, 'Sturdy');
  //       return target.hp - 1;
  //     }
  //   },
  // },
  // suctioncups: {
  //   onDragOut(pokemon) {
  //     this.add('-activate', pokemon, 'ability: Suction Cups');
  //     return null;
  //   },
  // },
  // superluck: {
  //   onModifyCritRatio(critRatio) {
  //     return critRatio + 1;
  //   },
  // },
  // surgesurfer: {
  //   onModifySpe(spe) {
  //     if (this.field.isTerrain('electricterrain')) {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // swarm: {
  //   onModifyAtk(atk, attacker, defender, move) {
  //     if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
  //       this.debug('Swarm boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onModifySpA(atk, attacker, defender, move) {
  //     if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
  //       this.debug('Swarm boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // sweetveil: {
  //   onAllySetStatus(status, target, source, effect) {
  //     if (status.id === 'slp') {
  //       this.debug('Sweet Veil interrupts sleep');
  //       const effectHolder = this.effectData.target;
  //       this.add('-block', target, 'ability: Sweet Veil', '[of] ' + effectHolder);
  //       return null;
  //     }
  //   },
  //   onAllyTryAddVolatile(status, target) {
  //     if (status.id === 'yawn') {
  //       this.debug('Sweet Veil blocking yawn');
  //       const effectHolder = this.effectData.target;
  //       this.add('-block', target, 'ability: Sweet Veil', '[of] ' + effectHolder);
  //       return null;
  //     }
  //   },
  // },
  // swiftswim: {
  //   onModifySpe(spe, pokemon) {
  //     if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // symbiosis: {
  //   onAllyAfterUseItem(item, pokemon) {
  //     const source = this.effectData.target;
  //     const myItem = source.takeItem();
  //     if (!myItem) { return; }
  //     if (!this.singleEvent('TakeItem', myItem, source.itemData, pokemon, source, this.effect, myItem) ||
  //               !pokemon.setItem(myItem)) {
  //       source.item = myItem.id;
  //       return;
  //     }
  //     this.add('-activate', source, 'ability: Symbiosis', myItem, '[of] ' + pokemon);
  //   },
  // },
  // synchronize: {
  //   onAfterSetStatus(status, target, source, effect) {
  //     if (!source || source === target) { return; }
  //     if (effect && effect.id === 'toxicspikes') { return; }
  //     if (status.id === 'slp' || status.id === 'frz') { return; }
  //     this.add('-activate', target, 'ability: Synchronize');
  //     // Hack to make status-prevention abilities think Synchronize is a status move
  //     // and show messages when activating against it.
  //     // @ts-ignore
  //     source.trySetStatus(status, target, {status: status.id, id: 'synchronize'});
  //   },
  // },
  // tangledfeet: {
  //   onModifyAccuracy(accuracy, target) {
  //     if (typeof accuracy !== 'number') { return; }
  //     if (target === null || target === void 0 ? void 0 : target.volatiles['confusion']) {
  //       this.debug('Tangled Feet - decreasing accuracy');
  //       return accuracy * 0.5;
  //     }
  //   },
  // },
  // tanglinghair: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       this.add('-ability', target, 'Tangling Hair');
  //       this.boost({spe: -1}, source, target, null, true);
  //     }
  //   },
  // },
  // technician: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
  //     this.debug('Base Power: ' + basePowerAfterMultiplier);
  //     if (basePowerAfterMultiplier <= 60) {
  //       this.debug('Technician boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // telepathy: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && target.side === source.side && move.category !== 'Status') {
  //       this.add('-activate', target, 'ability: Telepathy');
  //       return null;
  //     }
  //   },
  // },
  // teravolt: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Teravolt');
  //   },
  //   onModifyMove(move) {
  //     move.ignoreAbility = true;
  //   },
  // },
  // thickfat: {
  //   onSourceModifyAtk(atk, attacker, defender, move) {
  //     if (move.type === 'Ice' || move.type === 'Fire') {
  //       this.debug('Thick Fat weaken');
  //       return this.chainModify(0.5);
  //     }
  //   },
  //   onSourceModifySpA(atk, attacker, defender, move) {
  //     if (move.type === 'Ice' || move.type === 'Fire') {
  //       this.debug('Thick Fat weaken');
  //       return this.chainModify(0.5);
  //     }
  //   },
  // },
  // tintedlens: {
  //   onModifyDamage(damage, source, target, move) {
  //     if (target.getMoveHitData(move).typeMod < 0) {
  //       this.debug('Tinted Lens boost');
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // torrent: {
  //   onModifyAtk(atk, attacker, defender, move) {
  //     if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
  //       this.debug('Torrent boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onModifySpA(atk, attacker, defender, move) {
  //     if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
  //       this.debug('Torrent boost');
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // toughclaws: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if (move.flags['contact']) {
  //       return this.chainModify([0x14CD, 0x1000]);
  //     }
  //   },
  // },
  // toxicboost: {
  //   onBasePower(basePower, attacker, defender, move) {
  //     if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // trace: {
  //   onStart(pokemon) {
  //     if (pokemon.side.foe.active.some(foeActive => foeActive && this.isAdjacent(pokemon, foeActive) && foeActive.ability === 'noability')) {
  //       this.effectData.gaveUp = true;
  //     }
  //   },
  //   onUpdate(pokemon) {
  //     if (!pokemon.isStarted || this.effectData.gaveUp) { return; }
  //     const possibleTargets = pokemon.side.foe.active.filter(foeActive => foeActive && this.isAdjacent(pokemon, foeActive));
  //     while (possibleTargets.length) {
  //       let rand = 0;
  //       if (possibleTargets.length > 1) { rand = this.random(possibleTargets.length); }
  //       const target = possibleTargets[rand];
  //       const ability = target.getAbility();
  //       const bannedAbilities = [
  //         'noability', 'battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'gulpmissile', 'hungerswitch', 'iceface', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'zenmode',
  //       ];
  //       if (bannedAbilities.includes(target.ability)) {
  //         possibleTargets.splice(rand, 1);
  //         continue;
  //       }
  //       this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
  //       pokemon.setAbility(ability);
  //       return;
  //     }
  //   },
  // },
  // triage: {
  //   onModifyPriority(priority, pokemon, target, move) {
  //     if (move === null || move === void 0 ? void 0 : move.flags['heal']) { return priority + 3; }
  //   },
  // },
  // truant: {
  //   onStart(pokemon) {
  //     pokemon.removeVolatile('truant');
  //     if (pokemon.activeTurns && (pokemon.moveThisTurnResult !== undefined || !this.queue.willMove(pokemon))) {
  //       pokemon.addVolatile('truant');
  //     }
  //   },
  //   onBeforeMove(pokemon) {
  //     if (pokemon.removeVolatile('truant')) {
  //       this.add('cant', pokemon, 'ability: Truant');
  //       return false;
  //     }
  //     pokemon.addVolatile('truant');
  //   },
  // },
  // turboblaze: {
  //   onStart(pokemon) {
  //     this.add('-ability', pokemon, 'Turboblaze');
  //   },
  //   onModifyMove(move) {
  //     move.ignoreAbility = true;
  //   },
  // },
  // unaware: {
  //   onAnyModifyBoost(boosts, pokemon) {
  //     const unawareUser = this.effectData.target;
  //     if (unawareUser === pokemon) { return; }
  //     if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
  //       boosts['def'] = 0;
  //       boosts['spd'] = 0;
  //       boosts['evasion'] = 0;
  //     }
  //     if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
  //       boosts['atk'] = 0;
  //       boosts['def'] = 0;
  //       boosts['spa'] = 0;
  //       boosts['accuracy'] = 0;
  //     }
  //   },
  // },
  // unburden: {
  //   onAfterUseItem(item, pokemon) {
  //     if (pokemon !== this.effectData.target) { return; }
  //     pokemon.addVolatile('unburden');
  //   },
  //   onTakeItem(item, pokemon) {
  //     pokemon.addVolatile('unburden');
  //   },
  //   onEnd(pokemon) {
  //     pokemon.removeVolatile('unburden');
  //   },
  //   effect: {
  //     onModifySpe(spe, pokemon) {
  //       if (!pokemon.item) {
  //         return this.chainModify(2);
  //       }
  //     },
  //   },
  // },
  // unnerve: {
  //   onPreStart(pokemon) {
  //     this.add('-ability', pokemon, 'Unnerve', pokemon.side.foe);
  //   },
  // },
  // victorystar: {
  //   onAllyModifyMove(move) {
  //     if (typeof move.accuracy === 'number') {
  //       move.accuracy *= 1.1;
  //     }
  //   },
  // },
  // vitalspirit: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'slp') {
  //       this.add('-activate', pokemon, 'ability: Vital Spirit');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (status.id !== 'slp') { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Vital Spirit');
  //     }
  //     return false;
  //   },
  // },
  // voltabsorb: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && move.type === 'Electric') {
  //       if (!this.heal(target.baseMaxhp / 4)) {
  //         this.add('-immune', target, '[from] ability: Volt Absorb');
  //       }
  //       return null;
  //     }
  //   },
  // },
  // wanderingspirit: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (target.volatiles['dynamax']) { return; }
  //     if (['illusion', 'neutralizinggas', 'wanderingspirit', 'wonderguard'].includes(source.ability)) { return; }
  //     if (move.flags['contact']) {
  //       const sourceAbility = source.setAbility('wanderingspirit', target);
  //       if (!sourceAbility) { return; }
  //       if (target.side === source.side) {
  //         this.add('-activate', target, 'Skill Swap', '', '', '[of] ' + source);
  //       } else {
  //         this.add('-activate', target, 'ability: Wandering Spirit', this.dex.getAbility(sourceAbility).name, 'Wandering Spirit', '[of] ' + source);
  //       }
  //       target.setAbility(sourceAbility);
  //     }
  //   },
  // },
  // waterabsorb: {
  //   onTryHit(target, source, move) {
  //     if (target !== source && move.type === 'Water') {
  //       if (!this.heal(target.baseMaxhp / 4)) {
  //         this.add('-immune', target, '[from] ability: Water Absorb');
  //       }
  //       return null;
  //     }
  //   },
  // },
  // waterbubble: {
  //   onSourceModifyAtk(atk, attacker, defender, move) {
  //     if (move.type === 'Fire') {
  //       return this.chainModify(0.5);
  //     }
  //   },
  //   onSourceModifySpA(atk, attacker, defender, move) {
  //     if (move.type === 'Fire') {
  //       return this.chainModify(0.5);
  //     }
  //   },
  //   onModifyAtk(atk, attacker, defender, move) {
  //     if (move.type === 'Water') {
  //       return this.chainModify(2);
  //     }
  //   },
  //   onModifySpA(atk, attacker, defender, move) {
  //     if (move.type === 'Water') {
  //       return this.chainModify(2);
  //     }
  //   },
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'brn') {
  //       this.add('-activate', pokemon, 'ability: Water Bubble');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (status.id !== 'brn') { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Water Bubble');
  //     }
  //     return false;
  //   },
  // },
  // watercompaction: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.type === 'Water') {
  //       this.boost({def: 2});
  //     }
  //   },
  // },
  // waterveil: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'brn') {
  //       this.add('-activate', pokemon, 'ability: Water Veil');
  //       pokemon.cureStatus();
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     let _a;
  //     if (status.id !== 'brn') { return; }
  //     if ((_a = effect) === null || _a === void 0 ? void 0 : _a.status) {
  //       this.add('-immune', target, '[from] ability: Water Veil');
  //     }
  //     return false;
  //   },
  // },
  // weakarmor: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.category === 'Physical') {
  //       this.boost({def: -1, spe: 2}, target, target);
  //     }
  //   },
  // },
  // whitesmoke: {
  //   onBoost(boost, target, source, effect) {
  //     if (source && target === source) { return; }
  //     let showMsg = false;
  //     let i;
  //     for (i in boost) {
  //       if (boost[i] < 0) {
  //         delete boost[i];
  //         showMsg = true;
  //       }
  //     }
  //     if (showMsg && !effect.secondaries && effect.id !== 'octolock') {
  //       this.add("-fail", target, "unboost", "[from] ability: White Smoke", "[of] " + target);
  //     }
  //   },
  // },
  // wimpout: {
  //   onEmergencyExit(target) {
  //     if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) { return; }
  //     for (const side of this.sides) {
  //       for (const active of side.active) {
  //         active.switchFlag = false;
  //       }
  //     }
  //     target.switchFlag = true;
  //     this.add('-activate', target, 'ability: Wimp Out');
  //   },
  // },
  // wonderguard: {
  //   onTryHit(target, source, move) {
  //     if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') { return; }
  //     if (move.id === 'skydrop' && !source.volatiles['skydrop']) { return; }
  //     this.debug('Wonder Guard immunity: ' + move.id);
  //     if (target.runEffectiveness(move) <= 0) {
  //       if (move.smartTarget) {
  //         move.smartTarget = false;
  //       } else {
  //         this.add('-immune', target, '[from] ability: Wonder Guard');
  //       }
  //       return null;
  //     }
  //   },
  // },
  // wonderskin: {
  //   onModifyAccuracy(accuracy, target, source, move) {
  //     if (move.category === 'Status' && typeof move.accuracy === 'number') {
  //       this.debug('Wonder Skin - setting accuracy to 50');
  //       return 50;
  //     }
  //   },
  // },
  // zenmode: {
  //   onResidual(pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
  //       return;
  //     }
  //     if (pokemon.hp <= pokemon.maxhp / 2 && !['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
  //       pokemon.addVolatile('zenmode');
  //     } else if (pokemon.hp > pokemon.maxhp / 2 && ['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
  //       pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
  //       pokemon.removeVolatile('zenmode');
  //     }
  //   },
  //   onEnd(pokemon) {
  //     if (!pokemon.volatiles['zenmode'] || !pokemon.hp) { return; }
  //     pokemon.transformed = false;
  //     delete pokemon.volatiles['zenmode'];
  //     if (pokemon.species.baseSpecies === 'Darmanitan' && pokemon.species.battleOnly) {
  //       pokemon.formeChange(pokemon.species.battleOnly, this.effect, false, '[silent]');
  //     }
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       if (!pokemon.species.name.includes('Galar')) {
  //         if (pokemon.species.id !== 'darmanitanzen') { pokemon.formeChange('Darmanitan-Zen'); }
  //       } else {
  //         if (pokemon.species.id !== 'darmanitangalarzen') { pokemon.formeChange('Darmanitan-Galar-Zen'); }
  //       }
  //     },
  //     onEnd(pokemon) {
  //       if (['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
  //         pokemon.formeChange(pokemon.species.battleOnly);
  //       }
  //     },
  //   },
  // },
  // mountaineer: {
  //   onDamage(damage, target, source, effect) {
  //     if (effect && effect.id === 'stealthrock') {
  //       return false;
  //     }
  //   },
  //   onTryHit(target, source, move) {
  //     if (move.type === 'Rock' && !target.activeTurns) {
  //       this.add('-immune', target, '[from] ability: Mountaineer');
  //       return null;
  //     }
  //   },
  // },
  // rebound: {
  //   onTryHit(target, source, move) {
  //     if (this.effectData.target.activeTurns) { return; }
  //     if (target === source || move.hasBounced || !move.flags['reflectable']) {
  //       return;
  //     }
  //     const newMove = this.dex.getActiveMove(move.id);
  //     newMove.hasBounced = true;
  //     this.useMove(newMove, target, source);
  //     return null;
  //   },
  //   onAllyTryHitSide(target, source, move) {
  //     if (this.effectData.target.activeTurns) { return; }
  //     if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
  //       return;
  //     }
  //     const newMove = this.dex.getActiveMove(move.id);
  //     newMove.hasBounced = true;
  //     this.useMove(newMove, this.effectData.target, source);
  //     return null;
  //   },
  // },
};
