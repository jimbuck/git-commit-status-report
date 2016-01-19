'use strict';

const Promise = require('bluebird');
const STATUS = require('../models/status');

const BaseRepo = require('../data/base-repo');
const assert = require('../utils/assert');

class TaskRepo extends BaseRepo {
  constructor(opts) {
    opts = opts || {};

    opts = Object.assign({}, {
      filename: './tasks.db',
      entityType: 'task'
    }, opts);

    super(opts);
    
    if(opts.project) this.setProject(opts.project);
    
    this._db.ensureIndexAsync({ fieldName: 'project' }).catch(e => {
      throw e;
    });
  }

  setProject(projectName) {
    assert.stringArg(projectName, 'projectName', 'Invalid project name!');

    this.project = projectName;
    return Promise.resolve(this.project);
  }

  list() {
    assert.stringArg(this.project, 'projectName', 'Invalid project name!');

    return new Promise(function (resolve, reject) {
      this._db.find({
        project: this.project
      }).sort({ dateCreated: 1 }).exec((err, tasks) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(tasks);
      });
    }.bind(this));
  }

  add(taskName, taskDescription) {
    assert.stringArg(this.project, 'projectName', 'Invalid project name!');
    assert.stringArg(taskName, 'taskName', 'Invalid task name!');
    const now = Date.now();

    return super.add({
      project: this.project,
      name: taskName,
      description: taskDescription || '',
      dateCreated: now,
      changes: [{
        timestamp: now,
        state: STATUS.TODO
      }]
    });
  }

  start(taskName, taskDescription) {
    assert.stringArg(this.project, 'projectName', 'Invalid project name!');
    assert.stringArg(taskName, 'taskName', 'Invalid task name!');

    return this.get(taskName).then(task => task || this.add(taskName, taskDescription)).then(task => {
      task.changes.unshift({
        timestamp: Date.now(),
        state: STATUS.IN_PROGRESS
      });
      return this.edit(taskName, task);
    });
  }

  stop(taskName) {
    assert.stringArg(this.project, 'projectName', 'Invalid project name!');
    assert.stringArg(taskName, 'taskName', 'Invalid task name!');

    return this.get(taskName).then(task => {
      if (!task) {
        throw new Error(`Task '${taskName}' not found!`);
      }

      task.changes.unshift({
        timestamp: Date.now(),
        state: STATUS.ON_HOLD
      });
      return this.edit(taskName, task);
    });
  }

  complete(taskName) {
    assert.stringArg(this.project, 'projectName', 'Invalid project name!');
    assert.stringArg(taskName, 'taskName', 'Invalid task name!');

    return this.get(taskName).then(task => {
      if (!task) {
        throw new Error(`Task '${taskName}' not found!`);
      }

      task.changes.unshift({
        timestamp: Date.now(),
        state: STATUS.COMPLETED
      });
      return this.edit(taskName, task);
    });
  }
}

module.exports = TaskRepo;
