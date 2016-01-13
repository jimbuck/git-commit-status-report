'use strict';

const errors = require('./errors');

function numberArg(arg, key, message) {
  assertArgByType('number', arg, key, message);
}

function numberArgs(arg, key, message) {
  assertArgsByType('number', arg, key, message);
}

function stringArg(arg, key, message) {
  assertArgByType('string', arg, key, message);
}

function stringArgs(args, key, message) {
  assertArgsByType('string', args, key, message);
}

function assertArgsByType(type, args, key, message) {
  args.forEach(arg => {
    assertArgByType(type, arg, key, message);
  });
}

function argProps(obj, props, key, message) {
  if (!obj) {
    throw new errors.InvalidArgumentError(message, { key });
  }

  props.forEach(prop => {
    if (typeof obj[prop] === 'undefined') {
      throw new errors.InvalidArgumentError(message, { key: `${key}.${prop}` });
    }
  });
}

function assertArgByType(type, arg, key, message) {
  if (typeof arg !== type) {
    throw new errors.InvalidArgumentError(message);
  }
}

function defined(obj, key, message) {
  if (typeof obj === 'undefined' || obj === null) {
    throw new errors.ObjectUndefinedError(message, { key });
  }
}

module.exports = {
  stringArg,
  stringArgs,
  numberArg,
  numberArgs,
  argProps,
  defined
};
