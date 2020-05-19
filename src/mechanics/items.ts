/* eslint consistent-return: "off " */

import {Handler} from '.';

export const Items: {[id: string]: Partial<Handler>} = {
  // absorbbulb: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.type === 'Water') {
  //       target.useItem();
  //     }
  //   },
  // },
  // adamantorb: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && user.baseSpecies.name === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // adrenalineorb: {
  //   onAfterBoost(boost, target, source, effect) {
  //     if (effect.id === 'intimidate') {
  //       target.useItem();
  //     }
  //   },
  // },
  // aguavberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(pokemon.baseMaxhp * 0.33);
  //     if (pokemon.getNature().minus === 'spd') {
  //       pokemon.addVolatile('confusion');
  //     }
  //   },
  // },
  // airballoon: {
  //   onStart(target) {
  //     if (!target.ignoringItem() && !this.field.getPseudoWeather('gravity')) {
  //       this.add('-item', target, 'Air Balloon');
  //     }
  //   },
  //   onDamagingHit(damage, target, source, move) {
  //     this.add('-enditem', target, 'Air Balloon');
  //     target.item = '';
  //     target.itemData = {id: '', target};
  //     this.runEvent('AfterUseItem', target, null, null, this.dex.getItem('airballoon'));
  //   },
  //   onAfterSubDamage(damage, target, source, effect) {
  //     this.debug('effect: ' + effect.id);
  //     if (effect.effectType === 'Move') {
  //       this.add('-enditem', target, 'Air Balloon');
  //       target.item = '';
  //       target.itemData = {id: '', target};
  //       this.runEvent('AfterUseItem', target, null, null, this.dex.getItem('airballoon'));
  //     }
  //   },
  // },
  // apicotberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     this.boost({spd: 1});
  //   },
  // },
  // aspearberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'frz') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'frz') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // assaultvest: {
  //   onModifySpD(spd) {
  //     return this.chainModify(1.5);
  //   },
  //   onDisableMove(pokemon) {
  //     for (const moveSlot of pokemon.moveSlots) {
  //       if (this.dex.getMove(moveSlot.move).category === 'Status') {
  //         pokemon.disableMove(moveSlot.id);
  //       }
  //     }
  //   },
  // },
  // babiriberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // berryjuice: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 2) {
  //       if (this.runEvent('TryHeal', pokemon) && pokemon.useItem()) {
  //         this.heal(20);
  //       }
  //     }
  //   },
  // },
  // bigroot: {
  //   onTryHeal(damage, target, source, effect) {
  //     const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
  //     if (heals.includes(effect.id)) {
  //       return this.chainModify([0x14CC, 0x1000]);
  //     }
  //   },
  // },
  // blackbelt: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Fighting') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // blacksludge: {
  //   onResidual(pokemon) {
  //     if (this.field.isTerrain('grassyterrain')) { return; }
  //     if (pokemon.hasType('Poison')) {
  //       this.heal(pokemon.baseMaxhp / 16);
  //     } else {
  //       this.damage(pokemon.baseMaxhp / 8);
  //     }
  //   },
  //   onTerrain(pokemon) {
  //     if (!this.field.isTerrain('grassyterrain')) { return; }
  //     if (pokemon.hasType('Poison')) {
  //       this.heal(pokemon.baseMaxhp / 16);
  //     } else {
  //       this.damage(pokemon.baseMaxhp / 8);
  //     }
  //   },
  // },
  // blackglasses: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Dark') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // blueorb: {
  //   onSwitchIn(pokemon) {
  //     if (pokemon.isActive && pokemon.baseSpecies.name === 'Kyogre') {
  //       this.queue.insertChoice({choice: 'runPrimal', pokemon: pokemon});
  //     }
  //   },
  //   onPrimal(pokemon) {
  //     pokemon.formeChange('Kyogre-Primal', this.effect, true);
  //   },
  //   onTakeItem(item, source) {
  //     if (source.baseSpecies.baseSpecies === 'Kyogre') { return false; }
  //     return true;
  //   },
  // },
  // brightpowder: {
  //   onModifyAccuracy(accuracy) {
  //     if (typeof accuracy !== 'number') { return; }
  //     this.debug('brightpowder - decreasing accuracy');
  //     return accuracy * 0.9;
  //   },
  // },
  // buggem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Bug' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // bugmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // burndrive: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // cellbattery: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.type === 'Electric') {
  //       target.useItem();
  //     }
  //   },
  // },
  // charcoal: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Fire') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // chartiberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // cheriberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'par') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'par') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // chestoberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'slp') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'slp') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // chilanberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Normal' &&
  //               (!target.volatiles['substitute'] || move.flags['authentic'] || (move.infiltrates && this.gen >= 6))) {
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // chilldrive: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // choiceband: {
  //   onStart(pokemon) {
  //     if (pokemon.volatiles['choicelock']) {
  //       this.debug('removing choicelock: ' + pokemon.volatiles.choicelock);
  //     }
  //     pokemon.removeVolatile('choicelock');
  //   },
  //   onModifyMove(move, pokemon) {
  //     pokemon.addVolatile('choicelock');
  //   },
  //   onModifyAtk(atk, pokemon) {
  //     if (pokemon.volatiles['dynamax']) { return; }
  //     return this.chainModify(1.5);
  //   },
  // },
  // choicescarf: {
  //   onStart(pokemon) {
  //     if (pokemon.volatiles['choicelock']) {
  //       this.debug('removing choicelock: ' + pokemon.volatiles.choicelock);
  //     }
  //     pokemon.removeVolatile('choicelock');
  //   },
  //   onModifyMove(move, pokemon) {
  //     pokemon.addVolatile('choicelock');
  //   },
  //   onModifySpe(spe, pokemon) {
  //     if (pokemon.volatiles['dynamax']) { return; }
  //     return this.chainModify(1.5);
  //   },
  // },
  // choicespecs: {
  //   onStart(pokemon) {
  //     if (pokemon.volatiles['choicelock']) {
  //       this.debug('removing choicelock: ' + pokemon.volatiles.choicelock);
  //     }
  //     pokemon.removeVolatile('choicelock');
  //   },
  //   onModifyMove(move, pokemon) {
  //     pokemon.addVolatile('choicelock');
  //   },
  //   onModifySpA(spa, pokemon) {
  //     if (pokemon.volatiles['dynamax']) { return; }
  //     return this.chainModify(1.5);
  //   },
  // },
  // chopleberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // cobaberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // colburberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Dark' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // custapberry: {
  //   onFractionalPriority(priority, pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       if (pokemon.eatItem()) {
  //         this.add('-activate', pokemon, 'item: Custap Berry', '[consumed]');
  //         return Math.round(priority) + 0.1;
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // darkgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Dark' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // darkmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // deepseascale: {
  //   onModifySpD(spd, pokemon) {
  //     if (pokemon.baseSpecies.name === 'Clamperl') {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // deepseatooth: {
  //   onModifySpA(spa, pokemon) {
  //     if (pokemon.baseSpecies.name === 'Clamperl') {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // destinyknot: {
  //   onAttract(target, source) {
  //     this.debug('attract intercepted: ' + target + ' from ' + source);
  //     if (!source || source === target) { return; }
  //     if (!source.volatiles.attract) { source.addVolatile('attract', target); }
  //   },
  // },
  // dousedrive: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // dracoplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Dragon') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // dragonfang: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Dragon') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // dragongem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Dragon' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // dragonmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // dreadplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Dark') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // earthplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Ground') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // ejectbutton: {
  //   onAfterMoveSecondary(target, source, move) {
  //     if (source && source !== target && target.hp && move && move.category !== 'Status') {
  //       if (!this.canSwitch(target.side) || target.forceSwitchFlag) { return; }
  //       for (const pokemon of this.getAllActive()) {
  //         if (pokemon.switchFlag === true) { return; }
  //       }
  //       if (target.useItem()) {
  //         target.switchFlag = true;
  //         source.switchFlag = false;
  //       }
  //     }
  //   },
  // },
  // ejectpack: {
  //   onAfterBoost(boost, target, source, effect) {
  //     let eject = false;
  //     let i;
  //     for (i in boost) {
  //       if (boost[i] < 0) {
  //         eject = true;
  //       }
  //     }
  //     if (eject) {
  //       if (target.hp) {
  //         if (!this.canSwitch(target.side)) { return; }
  //         for (const pokemon of this.getAllActive()) {
  //           if (pokemon.switchFlag === true) { return; }
  //         }
  //         if (target.useItem()) { target.switchFlag = true; }
  //       }
  //     }
  //   },
  // },
  // electricgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     const pledges = ['firepledge', 'grasspledge', 'waterpledge'];
  //     if (target === source || move.category === 'Status' || pledges.includes(move.id)) { return; }
  //     if (move.type === 'Electric' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // electricmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // electricseed: {
  //   onStart(pokemon) {
  //     if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) {
  //       pokemon.useItem();
  //     }
  //   },
  //   onAnyTerrainStart() {
  //     const pokemon = this.effectData.target;
  //     if (this.field.isTerrain('electricterrain')) {
  //       pokemon.useItem();
  //     }
  //   },
  // },
  // enigmaberry: {
  //   onHit(target, source, move) {
  //     if (move && target.getMoveHitData(move).typeMod > 0) {
  //       if (target.eatItem()) {
  //         this.heal(target.baseMaxhp / 4);
  //       }
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat() { },
  // },
  // eviolite: {
  //   onModifyDef(def, pokemon) {
  //     // Temporary hardcode for Slowpoke-Galar since it's a special case
  //     if (pokemon.baseSpecies.nfe || pokemon.baseSpecies.name === 'Slowpoke-Galar') {
  //       return this.chainModify(1.5);
  //     }
  //   },
  //   onModifySpD(spd, pokemon) {
  //     // Temporary hardcode for Slowpoke-Galar since it's a special case
  //     if (pokemon.baseSpecies.nfe || pokemon.baseSpecies.name === 'Slowpoke-Galar') {
  //       return this.chainModify(1.5);
  //     }
  //   },
  // },
  // expertbelt: {
  //   onModifyDamage(damage, source, target, move) {
  //     if (move && target.getMoveHitData(move).typeMod > 0) {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // fairygem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Fairy' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // fairymemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // fightinggem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Fighting' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // fightingmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // figyberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(pokemon.baseMaxhp * 0.33);
  //     if (pokemon.getNature().minus === 'atk') {
  //       pokemon.addVolatile('confusion');
  //     }
  //   },
  // },
  // firegem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     const pledges = ['firepledge', 'grasspledge', 'waterpledge'];
  //     if (target === source || move.category === 'Status' || pledges.includes(move.id)) { return; }
  //     if (move.type === 'Fire' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // firememory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // fistplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Fighting') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // flameorb: {
  //   onResidual(pokemon) {
  //     pokemon.trySetStatus('brn', pokemon);
  //   },
  // },
  // flameplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Fire') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // floatstone: {
  //   onModifyWeight(weighthg) {
  //     return this.trunc(weighthg / 2);
  //   },
  // },
  // flyinggem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Flying' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // flyingmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // focusband: {
  //   onDamage(damage, target, source, effect) {
  //     if (this.randomChance(1, 10) && damage >= target.hp && effect && effect.effectType === 'Move') {
  //       this.add("-activate", target, "item: Focus Band");
  //       return target.hp - 1;
  //     }
  //   },
  // },
  // focussash: {
  //   onDamage(damage, target, source, effect) {
  //     if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
  //       if (target.useItem()) {
  //         return target.hp - 1;
  //       }
  //     }
  //   },
  // },
  // fullincense: {
  //   onFractionalPriority(priority, pokemon) {
  //     return Math.round(priority) - 0.1;
  //   },
  // },
  // ganlonberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     this.boost({def: 1});
  //   },
  // },
  // ghostgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Ghost' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // ghostmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // grassgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     const pledges = ['firepledge', 'grasspledge', 'waterpledge'];
  //     if (target === source || move.category === 'Status' || pledges.includes(move.id)) { return; }
  //     if (move.type === 'Grass' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // grassmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // grassyseed: {
  //   onStart(pokemon) {
  //     if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) {
  //       pokemon.useItem();
  //     }
  //   },
  //   onAnyTerrainStart() {
  //     const pokemon = this.effectData.target;
  //     if (this.field.isTerrain('grassyterrain')) {
  //       pokemon.useItem();
  //     }
  //   },
  // },
  // griseousorb: {
  //   onBasePower(basePower, user, target, move) {
  //     if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 487) || pokemon.baseSpecies.num === 487) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // groundgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Ground' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // groundmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // habanberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // hardstone: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Rock') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // iapapaberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(pokemon.baseMaxhp * 0.33);
  //     if (pokemon.getNature().minus === 'def') {
  //       pokemon.addVolatile('confusion');
  //     }
  //   },
  // },
  // icegem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Ice' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // icememory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // icicleplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Ice') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // insectplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Bug') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // ironball: {
  //   onEffectiveness(typeMod, target, type, move) {
  //     if (!target) { return; }
  //     if (target.volatiles['ingrain'] || target.volatiles['smackdown'] || this.field.getPseudoWeather('gravity')) { return; }
  //     if (move.type === 'Ground' && target.hasType('Flying')) { return 0; }
  //   },
  //   onModifySpe(spe) {
  //     return this.chainModify(0.5);
  //   },
  // },
  // ironplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Steel') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // jabocaberry: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.category === 'Physical') {
  //       if (target.eatItem()) {
  //         this.damage(source.baseMaxhp / 8, source, target);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // kasibberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // kebiaberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // keeberry: {
  //   onAfterMoveSecondary(target, source, move) {
  //     if (move.category === 'Physical') {
  //       if (move.id === 'present' && move.heal) { return; }
  //       target.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     this.boost({def: 1});
  //   },
  // },
  // kingsrock: {
  //   onModifyMove(move) {
  //     if (move.category !== "Status") {
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
  // laggingtail: {
  //   onFractionalPriority(priority, pokemon) {
  //     return Math.round(priority) - 0.1;
  //   },
  // },
  // lansatberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     pokemon.addVolatile('focusenergy');
  //   },
  // },
  // laxincense: {
  //   onModifyAccuracy(accuracy) {
  //     if (typeof accuracy !== 'number') { return; }
  //     this.debug('lax incense - decreasing accuracy');
  //     return accuracy * 0.9;
  //   },
  // },
  // leek: {
  //   onModifyCritRatio(critRatio, user) {
  //     if (["Farfetch'd", "Sirfetch'd"].includes(user.baseSpecies.baseSpecies)) {
  //       return critRatio + 2;
  //     }
  //   },
  // },
  // leftovers: {
  //   onResidual(pokemon) {
  //     if (this.field.isTerrain('grassyterrain')) { return; }
  //     this.heal(pokemon.baseMaxhp / 16);
  //   },
  //   onTerrain(pokemon) {
  //     if (!this.field.isTerrain('grassyterrain')) { return; }
  //     this.heal(pokemon.baseMaxhp / 16);
  //   },
  // },
  // leppaberry: {
  //   onUpdate(pokemon) {
  //     if (!pokemon.hp) { return; }
  //     if (pokemon.moveSlots.some(move => move.pp === 0)) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     const moveSlot = pokemon.moveSlots.find(move => move.pp === 0) ||
  //               pokemon.moveSlots.find(move => move.pp < move.maxpp);
  //     if (!moveSlot) { return; }
  //     moveSlot.pp += 10;
  //     if (moveSlot.pp > moveSlot.maxpp) { moveSlot.pp = moveSlot.maxpp; }
  //     this.add('-activate', pokemon, 'item: Leppa Berry', moveSlot.move, '[consumed]');
  //   },
  // },
  // liechiberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     this.boost({atk: 1});
  //   },
  // },
  // lifeorb: {
  //   onModifyDamage(damage, source, target, move) {
  //     return this.chainModify([0x14CC, 0x1000]);
  //   },
  //   onAfterMoveSecondarySelf(source, target, move) {
  //     if (source && source !== target && move && move.category !== 'Status') {
  //       this.damage(source.baseMaxhp / 10, source, source, this.dex.getItem('lifeorb'));
  //     }
  //   },
  // },
  // lightball: {
  //   onModifyAtk(atk, pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
  //       return this.chainModify(2);
  //     }
  //   },
  //   onModifySpA(spa, pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // luckypunch: {
  //   onModifyCritRatio(critRatio, user) {
  //     if (user.baseSpecies.name === 'Chansey') {
  //       return critRatio + 2;
  //     }
  //   },
  // },
  // lumberry: {
  //   onAfterSetStatus(status, pokemon) {
  //     pokemon.eatItem();
  //   },
  //   onUpdate(pokemon) {
  //     if (pokemon.status || pokemon.volatiles['confusion']) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     pokemon.cureStatus();
  //     pokemon.removeVolatile('confusion');
  //   },
  // },
  // luminousmoss: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.type === 'Water') {
  //       target.useItem();
  //     }
  //   },
  // },
  // lustrousorb: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && user.baseSpecies.name === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // machobrace: {
  //   onModifySpe(spe) {
  //     return this.chainModify(0.5);
  //   },
  // },
  // magnet: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Electric') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // magoberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(pokemon.baseMaxhp * 0.33);
  //     if (pokemon.getNature().minus === 'spe') {
  //       pokemon.addVolatile('confusion');
  //     }
  //   },
  // },
  // mail: {
  //   onTakeItem(item, source) {
  //     if (!this.activeMove) { return false; }
  //     if (this.activeMove.id !== 'knockoff' && this.activeMove.id !== 'thief' && this.activeMove.id !== 'covet') { return false; }
  //   },
  // },
  // marangaberry: {
  //   onAfterMoveSecondary(target, source, move) {
  //     if (move.category === 'Special') {
  //       target.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     this.boost({spd: 1});
  //   },
  // },
  // meadowplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Grass') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // mentalherb: {
  //   fling: {
  //     effect(pokemon) {
  //       const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
  //       for (const firstCondition of conditions) {
  //         if (pokemon.volatiles[firstCondition]) {
  //           for (const secondCondition of conditions) {
  //             pokemon.removeVolatile(secondCondition);
  //             if (firstCondition === 'attract' && secondCondition === 'attract') {
  //               this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
  //             }
  //           }
  //           return;
  //         }
  //       }
  //     },
  //   },
  //   onUpdate(pokemon) {
  //     const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
  //     for (const firstCondition of conditions) {
  //       if (pokemon.volatiles[firstCondition]) {
  //         if (!pokemon.useItem()) { return; }
  //         for (const secondCondition of conditions) {
  //           pokemon.removeVolatile(secondCondition);
  //           if (firstCondition === 'attract' && secondCondition === 'attract') {
  //             this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
  //           }
  //         }
  //         return;
  //       }
  //     }
  //   },
  // },
  // metalcoat: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Steel') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // metalpowder: {
  //   onModifyDef(def, pokemon) {
  //     if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // metronome: {
  //   onStart(pokemon) {
  //     pokemon.addVolatile('metronome');
  //   },
  //   effect: {
  //     onStart(pokemon) {
  //       this.effectData.numConsecutive = 0;
  //       this.effectData.lastMove = '';
  //     },
  //     onTryMove(pokemon, target, move) {
  //       if (!pokemon.hasItem('metronome')) {
  //         pokemon.removeVolatile('metronome');
  //         return;
  //       }
  //       if (this.effectData.lastMove === move.id && pokemon.moveLastTurnResult) {
  //         this.effectData.numConsecutive++;
  //       } else {
  //         this.effectData.numConsecutive = 0;
  //       }
  //       this.effectData.lastMove = move.id;
  //     },
  //     onModifyDamage(damage, source, target, move) {
  //       const dmgMod = [0x1000, 0x1333, 0x1666, 0x1999, 0x1CCC, 0x2000];
  //       const numConsecutive = this.effectData.numConsecutive > 5 ? 5 : this.effectData.numConsecutive;
  //       return this.chainModify([dmgMod[numConsecutive], 0x1000]);
  //     },
  //   },
  // },
  // micleberry: {
  //   onResidual(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     pokemon.addVolatile('micleberry');
  //   },
  //   effect: {
  //     onSourceModifyAccuracy(accuracy, target, source) {
  //       this.add('-enditem', source, 'Micle Berry');
  //       source.removeVolatile('micleberry');
  //       if (typeof accuracy === 'number') {
  //         return accuracy * 1.2;
  //       }
  //     },
  //   },
  // },
  // mindplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Psychic') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // miracleseed: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Grass') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // mistyseed: {
  //   onStart(pokemon) {
  //     if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) {
  //       pokemon.useItem();
  //     }
  //   },
  //   onAnyTerrainStart() {
  //     const pokemon = this.effectData.target;
  //     if (this.field.isTerrain('mistyterrain')) {
  //       pokemon.useItem();
  //     }
  //   },
  // },
  // muscleband: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.category === 'Physical') {
  //       return this.chainModify([0x1199, 0x1000]);
  //     }
  //   },
  // },
  // mysticwater: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Water') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // nevermeltice: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Ice') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // normalgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     const pledges = ['firepledge', 'grasspledge', 'waterpledge'];
  //     if (target === source || move.category === 'Status' || pledges.includes(move.id)) { return; }
  //     if (move.type === 'Normal' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // occaberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // oddincense: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Psychic') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // oranberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 2) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(10);
  //   },
  // },
  // passhoberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // payapaberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // pechaberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'psn' || pokemon.status === 'tox') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'psn' || pokemon.status === 'tox') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // persimberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.volatiles['confusion']) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     pokemon.removeVolatile('confusion');
  //   },
  // },
  // petayaberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     this.boost({spa: 1});
  //   },
  // },
  // pixieplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Fairy') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // poisonbarb: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Poison') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // poisongem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Poison' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // poisonmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // poweranklet: {
  //   onModifySpe(spe) {
  //     return this.chainModify(0.5);
  //   },
  // },
  // powerband: {
  //   onModifySpe(spe) {
  //     return this.chainModify(0.5);
  //   },
  // },
  // powerbelt: {
  //   onModifySpe(spe) {
  //     return this.chainModify(0.5);
  //   },
  // },
  // powerbracer: {
  //   onModifySpe(spe) {
  //     return this.chainModify(0.5);
  //   },
  // },
  // powerherb: {
  //   onChargeMove(pokemon, target, move) {
  //     if (pokemon.useItem()) {
  //       this.debug('power herb - remove charge turn for ' + move.id);
  //       this.attrLastMove('[still]');
  //       this.addMove('-anim', pokemon, move.name, target);
  //       return false; // skip charge turn
  //     }
  //   },
  // },
  // powerlens: {
  //   onModifySpe(spe) {
  //     return this.chainModify(0.5);
  //   },
  // },
  // powerweight: {
  //   onModifySpe(spe) {
  //     return this.chainModify(0.5);
  //   },
  // },
  // protectivepads: {
  //   onAttract(target, source) {
  //     if (target !== source && target === this.activePokemon &&
  //               this.activeMove && this.activeMove.flags['contact']) { return false; }
  //   },
  //   onBoost(boost, target, source, effect) {
  //     if (target !== source && target === this.activePokemon && this.activeMove && this.activeMove.flags['contact']) {
  //       if (effect && effect.effectType === 'Ability') {
  //         // Ability activation always happens for boosts
  //         this.add('-activate', target, 'item: Protective Pads');
  //       }
  //       return false;
  //     }
  //   },
  //   onDamage(damage, target, source, effect) {
  //     if (target !== source && target === this.activePokemon && this.activeMove && this.activeMove.flags['contact']) {
  //       if (effect && effect.effectType === 'Ability') {
  //         this.add('-activate', source, effect.fullname);
  //         this.add('-activate', target, 'item: Protective Pads');
  //       }
  //       return false;
  //     }
  //   },
  //   onSetAbility(ability, target, source, effect) {
  //     if (target !== source && target === this.activePokemon && this.activeMove && this.activeMove.flags['contact']) {
  //       if (effect && effect.effectType === 'Ability') {
  //         this.add('-activate', source, effect.fullname);
  //         this.add('-activate', target, 'item: Protective Pads');
  //       }
  //       return false;
  //     }
  //   },
  //   onSetStatus(status, target, source, effect) {
  //     if (target !== source && target === this.activePokemon &&
  //               this.activeMove && this.activeMove.flags['contact']) { return false; }
  //   },
  // },
  // psychicgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Psychic' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // psychicmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // psychicseed: {
  //   onStart(pokemon) {
  //     if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) {
  //       pokemon.useItem();
  //     }
  //   },
  //   onAnyTerrainStart() {
  //     const pokemon = this.effectData.target;
  //     if (this.field.isTerrain('psychicterrain')) {
  //       pokemon.useItem();
  //     }
  //   },
  // },
  // quickclaw: {
  //   onFractionalPriority(priority, pokemon) {
  //     if (this.randomChance(1, 5)) {
  //       this.add('-activate', pokemon, 'item: Quick Claw');
  //       return Math.round(priority) + 0.1;
  //     }
  //   },
  // },
  // quickpowder: {
  //   onModifySpe(spe, pokemon) {
  //     if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // rawstberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'brn') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'brn') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // razorclaw: {
  //   onModifyCritRatio(critRatio) {
  //     return critRatio + 1;
  //   },
  // },
  // razorfang: {
  //   onModifyMove(move) {
  //     if (move.category !== "Status") {
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
  // redcard: {
  //   onAfterMoveSecondary(target, source, move) {
  //     if (source && source !== target && source.hp && target.hp && move && move.category !== 'Status') {
  //       if (!source.isActive || !this.canSwitch(source.side) || source.forceSwitchFlag || target.forceSwitchFlag) {
  //         return;
  //       }
  //       // The item is used up even against a pokemon with Ingrain or that otherwise can't be forced out
  //       if (target.useItem(source)) {
  //         if (this.runEvent('DragOut', source, target, move)) {
  //           source.forceSwitchFlag = true;
  //         }
  //       }
  //     }
  //   },
  // },
  // redorb: {
  //   onSwitchIn(pokemon) {
  //     if (pokemon.isActive && pokemon.baseSpecies.name === 'Groudon') {
  //       this.queue.insertChoice({choice: 'runPrimal', pokemon: pokemon});
  //     }
  //   },
  //   onPrimal(pokemon) {
  //     pokemon.formeChange('Groudon-Primal', this.effect, true);
  //   },
  //   onTakeItem(item, source) {
  //     if (source.baseSpecies.baseSpecies === 'Groudon') { return false; }
  //     return true;
  //   },
  // },
  // rindoberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // rockgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Rock' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // rockincense: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Rock') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // rockmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // rockyhelmet: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.flags['contact']) {
  //       this.damage(source.baseMaxhp / 6, source, target);
  //     }
  //   },
  // },
  // roomservice: {
  //   onUpdate(pokemon) {
  //     if (this.field.getPseudoWeather('trickroom')) {
  //       pokemon.useItem();
  //     }
  //   },
  // },
  // roseincense: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Grass') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // roseliberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Fairy' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // rowapberry: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.category === 'Special') {
  //       if (target.eatItem()) {
  //         this.damage(source.baseMaxhp / 8, source, target);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // rustedshield: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 889) || pokemon.baseSpecies.num === 889) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // rustedsword: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 888) || pokemon.baseSpecies.num === 888) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // safetygoggles: {
  //   onImmunity(type, pokemon) {
  //     if (type === 'sandstorm' || type === 'hail' || type === 'powder') { return false; }
  //   },
  //   onTryHit(pokemon, source, move) {
  //     if (move.flags['powder'] && pokemon !== source && this.dex.getImmunity('powder', pokemon)) {
  //       this.add('-activate', pokemon, 'item: Safety Goggles', move.name);
  //       return null;
  //     }
  //   },
  // },
  // salacberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     this.boost({spe: 1});
  //   },
  // },
  // scopelens: {
  //   onModifyCritRatio(critRatio) {
  //     return critRatio + 1;
  //   },
  // },
  // seaincense: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Water') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // sharpbeak: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && move.type === 'Flying') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // shedshell: {
  //   onTrapPokemon(pokemon) {
  //     pokemon.trapped = pokemon.maybeTrapped = false;
  //   },
  // },
  // shellbell: {
  //   onAfterMoveSecondarySelf(pokemon, target, move) {
  //     if (move.category !== 'Status') {
  //       this.heal(pokemon.lastDamage / 8, pokemon);
  //     }
  //   },
  // },
  // shockdrive: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // shucaberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // silkscarf: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Normal') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // silverpowder: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Bug') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // sitrusberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 2) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(pokemon.baseMaxhp / 4);
  //   },
  // },
  // skyplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Flying') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // snowball: {
  //   onDamagingHit(damage, target, source, move) {
  //     if (move.type === 'Ice') {
  //       target.useItem();
  //     }
  //   },
  // },
  // softsand: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Ground') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // souldew: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move && (user.baseSpecies.num === 380 || user.baseSpecies.num === 381) &&
  //               (move.type === 'Psychic' || move.type === 'Dragon')) {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // spelltag: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Ghost') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // splashplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Water') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // spookyplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Ghost') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // starfberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     const stats = [];
  //     let stat;
  //     for (stat in pokemon.boosts) {
  //       if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
  //         stats.push(stat);
  //       }
  //     }
  //     if (stats.length) {
  //       const randomStat = this.sample(stats);
  //       const boost = {};
  //       boost[randomStat] = 2;
  //       this.boost(boost);
  //     }
  //   },
  // },
  // steelgem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     if (target === source || move.category === 'Status') { return; }
  //     if (move.type === 'Steel' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // steelmemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // stick: {
  //   onModifyCritRatio(critRatio, user) {
  //     if (user.baseSpecies.name === 'Farfetch\'d') {
  //       return critRatio + 2;
  //     }
  //   },
  // },
  // stickybarb: {
  //   onResidual(pokemon) {
  //     this.damage(pokemon.baseMaxhp / 8);
  //   },
  //   onHit(target, source, move) {
  //     if (source && source !== target && !source.item && move && move.flags['contact']) {
  //       const barb = target.takeItem();
  //       if (!barb) { return; } // Gen 4 Multitype
  //       source.setItem(barb);
  //       // no message for Sticky Barb changing hands
  //     }
  //   },
  // },
  // stoneplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Rock') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // tangaberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // thickclub: {
  //   onModifyAtk(atk, pokemon) {
  //     if (pokemon.baseSpecies.baseSpecies === 'Cubone' || pokemon.baseSpecies.baseSpecies === 'Marowak') {
  //       return this.chainModify(2);
  //     }
  //   },
  // },
  // throatspray: {
  //   onAfterMoveSecondarySelf(target, source, move) {
  //     if (move.flags['sound']) {
  //       target.useItem();
  //     }
  //   },
  // },
  // toxicorb: {
  //   onResidual(pokemon) {
  //     pokemon.trySetStatus('tox', pokemon);
  //   },
  // },
  // toxicplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Poison') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // twistedspoon: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Psychic') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // wacanberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // watergem: {
  //   onSourceTryPrimaryHit(target, source, move) {
  //     const pledges = ['firepledge', 'grasspledge', 'waterpledge'];
  //     if (target === source || move.category === 'Status' || pledges.includes(move.id)) { return; }
  //     if (move.type === 'Water' && source.useItem()) {
  //       source.addVolatile('gem');
  //     }
  //   },
  // },
  // watermemory: {
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // waveincense: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Water') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  // },
  // weaknesspolicy: {
  //   onHit(target, source, move) {
  //     if (target.hp && move.category !== 'Status' && !move.damage &&
  //               !move.damageCallback && target.getMoveHitData(move).typeMod > 0) {
  //       target.useItem();
  //     }
  //   },
  // },
  // whiteherb: {
  //   fling: {
  //     effect(pokemon) {
  //       let activate = false;
  //       const boosts = {};
  //       let i;
  //       for (i in pokemon.boosts) {
  //         if (pokemon.boosts[i] < 0) {
  //           activate = true;
  //           boosts[i] = 0;
  //         }
  //       }
  //       if (activate) {
  //         pokemon.setBoost(boosts);
  //         this.add('-clearnegativeboost', pokemon, '[silent]');
  //       }
  //     },
  //   },
  //   onUpdate(pokemon) {
  //     let activate = false;
  //     const boosts = {};
  //     let i;
  //     for (i in pokemon.boosts) {
  //       if (pokemon.boosts[i] < 0) {
  //         activate = true;
  //         boosts[i] = 0;
  //       }
  //     }
  //     if (activate && pokemon.useItem()) {
  //       pokemon.setBoost(boosts);
  //       this.add('-clearnegativeboost', pokemon, '[silent]');
  //     }
  //   },
  // },
  // widelens: {
  //   onSourceModifyAccuracy(accuracy) {
  //     if (typeof accuracy === 'number') {
  //       return accuracy * 1.1;
  //     }
  //   },
  // },
  // wikiberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(pokemon.baseMaxhp * 0.33);
  //     if (pokemon.getNature().minus === 'spa') {
  //       pokemon.addVolatile('confusion');
  //     }
  //   },
  // },
  // wiseglasses: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.category === 'Special') {
  //       return this.chainModify([0x1199, 0x1000]);
  //     }
  //   },
  // },
  // yacheberry: {
  //   onSourceModifyDamage(damage, source, target, move) {
  //     if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
  //       const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
  //       if (hitSub) { return; }
  //       if (target.eatItem()) {
  //         this.debug('-50% reduction');
  //         this.add('-enditem', target, this.effect, '[weaken]');
  //         return this.chainModify(0.5);
  //       }
  //     }
  //   },
  //   onEat() { },
  // },
  // zapplate: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Electric') {
  //       return this.chainModify([0x1333, 0x1000]);
  //     }
  //   },
  //   onTakeItem(item, pokemon, source) {
  //     if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
  //       return false;
  //     }
  //     return true;
  //   },
  // },
  // zoomlens: {
  //   onSourceModifyAccuracy(accuracy, target) {
  //     if (typeof accuracy === 'number' && !this.queue.willMove(target)) {
  //       this.debug('Zoom Lens boosting accuracy');
  //       return accuracy * 1.2;
  //     }
  //   },
  // },
  // berserkgene: {
  //   onUpdate(pokemon) {
  //     this.boost({atk: 2});
  //     pokemon.addVolatile('confusion');
  //     pokemon.setItem('');
  //   },
  // },
  // berry: {
  //   onResidual(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 2) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(10);
  //   },
  // },
  // bitterberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.volatiles['confusion']) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     pokemon.removeVolatile('confusion');
  //   },
  // },
  // burntberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'frz') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'frz') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // goldberry: {
  //   onResidual(pokemon) {
  //     if (pokemon.hp <= pokemon.maxhp / 2) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onTryEatItem(item, pokemon) {
  //     if (!this.runEvent('TryHeal', pokemon)) { return false; }
  //   },
  //   onEat(pokemon) {
  //     this.heal(30);
  //   },
  // },
  // iceberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'brn') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'brn') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // mintberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'slp') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'slp') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // miracleberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status || pokemon.volatiles['confusion']) {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     pokemon.cureStatus();
  //     pokemon.removeVolatile('confusion');
  //   },
  // },
  // mysteryberry: {
  //   onUpdate(pokemon) {
  //     if (!pokemon.hp) { return; }
  //     const moveSlot = pokemon.lastMove && pokemon.getMoveData(pokemon.lastMove.id);
  //     if (moveSlot && moveSlot.pp === 0) {
  //       pokemon.addVolatile('leppaberry');
  //       pokemon.volatiles['leppaberry'].moveSlot = moveSlot;
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     let moveSlot;
  //     if (pokemon.volatiles['leppaberry']) {
  //       moveSlot = pokemon.volatiles['leppaberry'].moveSlot;
  //       pokemon.removeVolatile('leppaberry');
  //     } else {
  //       let pp = 99;
  //       for (const possibleMoveSlot of pokemon.moveSlots) {
  //         if (possibleMoveSlot.pp < pp) {
  //           moveSlot = possibleMoveSlot;
  //           pp = moveSlot.pp;
  //         }
  //       }
  //     }
  //     moveSlot.pp += 5;
  //     if (moveSlot.pp > moveSlot.maxpp) { moveSlot.pp = moveSlot.maxpp; }
  //     this.add('-activate', pokemon, 'item: Mystery Berry', moveSlot.move);
  //   },
  // },
  // pinkbow: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Normal') {
  //       return basePower * 1.1;
  //     }
  //   },
  // },
  // polkadotbow: {
  //   onBasePower(basePower, user, target, move) {
  //     if (move.type === 'Normal') {
  //       return basePower * 1.1;
  //     }
  //   },
  // },
  // przcureberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'par') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'par') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
  // psncureberry: {
  //   onUpdate(pokemon) {
  //     if (pokemon.status === 'psn' || pokemon.status === 'tox') {
  //       pokemon.eatItem();
  //     }
  //   },
  //   onEat(pokemon) {
  //     if (pokemon.status === 'psn' || pokemon.status === 'tox') {
  //       pokemon.cureStatus();
  //     }
  //   },
  // },
};
