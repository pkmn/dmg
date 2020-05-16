#!/usr/bin/env node
const Dex = require('@pkmn/dex').Dex;
const Generations = require('@pkmn/data').Generations;

const gens = new Generations(Dex);

// jQuery JavaScript Library v2.0.3
// Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
const class2Type = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Object]': 'object',
  '[object Error]': 'error',
};

const coreToString = class2Type.toString;
const coreHasOwn = class2Type.hasOwnProperty;

function isFunction(obj) {
  return getType(obj) === 'function';
}

function isWindow(obj) {
  return obj != null && obj === obj.window;
}

function getType(obj) {
  if (obj == null) {
    return String(obj);
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2Type[coreToString.call(obj)] || 'object'
    : typeof obj;
}

function isPlainObject(obj) {
  if (getType(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
    return false;
  }

  try {
    if (obj.constructor && !coreHasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
}

function extend(...args) {
  let options, name, src, copy, copyIsArray, clone;
  let target = args[0] || {};
  let i = 1;
  let deep = false;
  const length = args.length;

  if (typeof target === 'boolean') {
    deep = target;
    target = args[1] || {};
    i = 2;
  }

  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  if (length === i) {
    target = this;
    --i;
  }

  for (; i < length; i++) {
    if ((options = args[i]) != null) {
      // tslint:disable-next-line: forin
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue;
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}

function override(obj, overrides) {
  const copy = Object.create(obj.constructor.prototype);
  return extend(copy, obj, overrides);
}

const pikachu = gens.get(5).species.get('Pikachu');

console.log(pikachu.hasAbility('Static'));
console.log(pikachu.weighthg);
console.log(pikachu.baseStats);

const pika2 = override(pikachu, {baseStats: {...pikachu.baseStats, hp: 5}, weighthg: 42});


console.log(pika2.hasAbility('Static'));
console.log(pika2.weighthg);
console.log(pika2.baseStats);

console.log(pika2);