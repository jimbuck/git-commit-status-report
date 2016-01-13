'use strict';

import test from 'ava';
import BaseRepo from '../../lib/data/base-repo.js';
import ProjectRepo from '../../lib/data/project-repo.js';

const projectA = { _id: 'a', name: 'Project A' };
const projectB = { _id: 'b', name: 'Project B' };
const projectC = { _id: 'c', name: 'Project C' };

test.before(() => {
  BaseRepo.prototype.list = function () {
    return Promise.resolve([projectA, projectB, projectC]);
  };

  BaseRepo.prototype.add = function (project) {
    return Promise.resolve(project);
  };
});

test('Constructor function.', t => {
  t.is(typeof ProjectRepo, 'function');
});

test('Constructor accepts options.', t => {
  const projects = new ProjectRepo({
    filename: null
  });

  t.ok(projects);
});

test('`List` resolves to array.', async t => {
  const projects = new ProjectRepo({
    filename: null
  });

  const result = await projects.list();

  t.ok(result);
  t.is(result.length, 3);
});

test('`Add` checks for name.', t => {
  const projects = new ProjectRepo({
    filename: null
  });

  t.throws(() => projects.add(null));
});

test('`Add` returns created project.', async t => {
  const projects = new ProjectRepo({
    filename: null
  });

  const expectedName = 'Project D';
  const newProject = await projects.add(expectedName);

  t.ok(newProject);
  t.is(newProject.name, expectedName);
});
