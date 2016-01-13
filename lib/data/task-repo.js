'use strict';

const BaseRepo = require('../data/base-repo');
const assert = require('../utils/assert');

class TaskRepo extends BaseRepo {
  constructor(opts) {
    opts = opts || {};

    assert.stringArg(opts.project, 'opts.project', 'Invalid project name!');

    opts = Object.assign({}, {
      filename: './tasks.db',
      entityType: 'task'
    }, opts);

    super(opts);
    this._db.ensureIndexAsync({ fieldName: 'project' }).throw();
  }

  list(projectName) {
    assert.stringArg(projectName, 'projectName', 'Invalid project name!');

    return this._db.findAsync({
      project: projectName
    });
  }

  add(projectName, taskName) {
    assert.stringArg(projectName, 'projectName', 'Invalid project name!');
    assert.stringArg(taskName, 'taskName', 'Invalid task name!');

    super.add({
      project: projectName,
      name: taskName
    });
  }

  start(taskName) {
    assert.stringArg(this._opts.project, 'projectName', 'Invalid project name!');
    assert.stringArg(taskName, 'taskName', 'Invalid task name!');
  }

  stop(taskName) {
    assert.stringArg(this._opts.project, 'projectName', 'Invalid project name!');
    assert.stringArg(taskName, 'taskName', 'Invalid task name!');
  }
}

module.exports = TaskRepo;
