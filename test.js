#!/usr/bin/env node
const {Dex} = require('@pkmn/dex');
const {Generations} = require('@pkmn/data');
const {parse} = require('./build/parse');

const gens = new Generations(Dex);
console.log(parse(gens, `f:1 --b=true c="hello world" not a flag -spikes +foo -d='goodbye world'`));
