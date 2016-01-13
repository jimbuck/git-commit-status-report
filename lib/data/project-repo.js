'use strict';

const BaseRepo = require('../data/base-repo');

const assert = require('../utils/assert');

class ProjectRepo extends BaseRepo {
  constructor(opts) {
    opts = opts || {};

    opts = Object.assign({}, {
      filename: './projects.db',
      entityType: 'project',
      indexUnique: true
    }, opts);

    // Initializes the database...
    super(opts);
  }

  add(projectName) {
    assert.stringArg(projectName, 'projectName', 'Invalid project name!');

    return super.add({
      name: projectName
    });
  }
}

module.exports = ProjectRepo;
