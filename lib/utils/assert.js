'use strict';

const errors = {
  invalidArg: 'invalidArgument',
  nullRef: 'nullReference',
  outOfBounds: 'outOfBounds'
};

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
    throw {
      errorType: errors.invalidArg,
      key,
      message
    };
  }
  
  props.forEach(prop => {
    if (typeof obj[prop] === 'undefined') {
      throw {
        errorType: errors.invalidArg,
        key: key + '.' + prop,
        message
      };
    }
  });
}

function assertArgByType(type, arg, key, message) {
  if (typeof arg !== type) {
    throw {
      errorType: errors.invalidArg,
      key,
      message: message || 'Invalid argument!'
    };
  }
}

function defined(obj, key, message) {
  if (typeof obj === 'undefined' || obj === null) {
    throw {
      errorType: errors.invalidArg,
      key,
      message: message || 'Object not defined!'
    }
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