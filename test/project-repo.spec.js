'use strict';

import test from 'ava';
import BaseRepo from '../lib/data/base-repo.js';
import ProjectRepo from '../lib/data/project-repo.js';

let oldBaseRepoList;
let oldBaseRepoAdd;

let projectA = { _id: 'a', name: 'Project A' };
let projectB = { _id: 'b', name: 'Project B' };
let projectC = { _id: 'c', name: 'Project C' };

test.before(t => {
  oldBaseRepoList = BaseRepo.prototype.list;
  oldBaseRepoAdd = BaseRepo.prototype.add;
  
  BaseRepo.prototype.list = function () {
    return Promise.resolve([projectA, projectB, projectC]);
  };
  
  BaseRepo.prototype.add = function (project) {
    return Promise.resolve(project);
  };
});

test.after(t => {
  BaseRepo.prototype.list = oldBaseRepoList;
});

test('ProjectRepo - Constructor function.', t => {
  t.is(typeof ProjectRepo, 'function');
});

test('ProjectRepo - Constructor accepts options.', t => {
  const projects = new ProjectRepo({
    filename: null
  });
  
  t.ok(projects);
});

test('ProjectRepo - `List` resolves to array.', async t => {
  const projects = new ProjectRepo({
    filename: null
  });
  
  let result = await projects.list();
  
  t.ok(result);
  t.is(result.length, 3);
});

test('ProjectRepo - `Add` checks for name.', t => {
  const projects = new ProjectRepo({
    filename: null
  });
  
  t.throws(() => projects.add(null));
});

test('ProjectRepo - `Add` returns created project.', async t => {
  const projects = new ProjectRepo({
    filename: null
  });
  
  let expectedName = 'Project D';
  let newProject = await projects.add(expectedName);
  
  t.ok(newProject);
  t.is(newProject.name, expectedName);
});