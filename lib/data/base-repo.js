'use strict';

const Promise = require('bluebird');
const Datastore = require('nedb');
Promise.promisifyAll(Datastore.prototype);

const assert = require('../utils/assert');

class BaseRepo {
  constructor(opts) {
    opts = opts || {};

    this._opts = Object.assign({}, {
      autoload: true,
      entityType: 'object',
      indexUnique: true
    }, opts);

    // Initializes this._db to a pre-loaded datastore.
    this._db = new Datastore(this._opts);

    // Make project name a unique index.
    this._db.ensureIndexAsync({
      fieldName: 'name',
      unique: this._opts.indexUnique
    }).catch(e => {
      throw e;
    });
  }

  /**
   * Gets a list of entities.
   */
  list() {
    return new Promise(function(resolve, reject) {
      this._db.find({}).sort({ dateCreated: 1 }).exec((err, tasks) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(tasks);
      });
    }.bind(this));
  }

  exists(name) {
    return this._db.findOneAsync({ name }).then(entity => entity !== null).catch(() => false);
  }

  /**
   * Gets an entity by name.
   */
  get(name) {
    assert.stringArg(name, 'name', `Invalid ${this._opts.entityType} name!`);

    return this._db.findOneAsync({ name });
  }

  /**
   * Inserts an entity with a unique name.
   */
  add(entity) {
    assert.stringArg(entity.name, 'name', `Invalid ${this._opts.entityType} name!`);
    entity.dateCreated = entity.dateCreated || Date.now();

    return this._db.insertAsync(entity);
  }

  /**
   * Updates an entity in the datastore.
   */
  edit(name, entity) {
    assert.argProps(entity, ['_id', 'name'], 'entity', `Invalid ${this._opts.entityType}!`);

    return this._db.updateAsync({ name }, entity, {}).then(() => {
      return entity;
    });
  }

  /**
   * Removes an entity from the datastore.
   */
  delete(name) {
    assert.stringArg(name, 'name', `Invalid ${this._opts.entityType} name!`);
    
    return this._db.removeAsync({ name }, {});
  }
}

module.exports = BaseRepo;
