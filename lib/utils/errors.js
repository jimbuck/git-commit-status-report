'use strict';

function InvalidArgumentError(message, data) {
  this.name = 'InvalidArgumentError';
  this.message = message || 'Invalid argument!';
  this.stack = (new Error()).stack;

  Object.assign(this, data || {});
}

function ObjectUndefinedError(message, data) {
  this.name = 'ObjectUndefinedError';
  this.message = message || 'Object not defined!';
  this.stack = (new Error()).stack;

  Object.assign(this, data || {});
}

function setupInheritance(ctor, base) {
  base = base || Error;

  ctor.prototype = Object.create(base.prototype);
  ctor.prototype.constructor = ctor;
}

setupInheritance(InvalidArgumentError);
setupInheritance(ObjectUndefinedError);

module.exports = {
  InvalidArgumentError,
  ObjectUndefinedError
};
