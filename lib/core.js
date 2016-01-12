'use strict';

const ProjectRepo = require('./data/project-repo');

var projects = new ProjectRepo();

projects.add('Project A')
  .then((a) => projects.add('Project B'))
  .then((b) => projects.add('Project C'))
  .then((c) => projects.list())
  .then(all => console.dir(all))
  .catch(e=> console.dir(e));