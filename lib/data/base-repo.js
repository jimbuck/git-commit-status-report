'use strict';

const Promise = require('bluebird');
const Datastore = require('nedb');
Promise.promisifyAll(Datastore.prototype);

const assert = require('../utils/assert');

class BaseRepo{
  constructor(opts) {
    opts = opts || {};    
    
    this._opts = Object.assign({}, {
      autoload: true,
      entityType: 'object',
      indexUnique: false
    }, opts);
    
    // Initializes this._db to a pre-loaded datastore.
    this._db = new Datastore(this._opts);
    
    // Make project name a unique index.
    this._db.ensureIndexAsync({
      fieldName: 'name',
      unique: this._opts.indexUnique
    }).catch(e => { throw e; });
  }
  
  /**
   * Gets a list of entities.
   */
  list() {
    return this._db.findAsync({});
  }
  
  /**
   * Inserts an entity with a unique name.
   */
  add(entity) {
    assert.stringArg(entity.name, 'name', `Invalid ${this._opts.entityType} name!`);
    entity.dateCreated = entity.dateCreated || Date.now();

    return this._db.insertAsync(entity);
  }
  
  edit(entity) {
    assert.argProps(entity, ['_id', 'name'], 'entity', `Invalid ${this._opts.entityType}!`);

    return this._db.updateAsync(entity);
  }
  
  delete(name) {
    assert.stringArg(name, 'name', `Invalid ${this._opts.entityType} name!`);

    return this._db.removeAsync({ name });
  }
}

module.exports = BaseRepo;