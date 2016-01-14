'use strict';

const ProjectRepo = require('./data/project-repo');

const projects = new ProjectRepo();

const dateHelper = require('./utils/date-helper');

const end = '2016-01-08';
const day = '2016-01-02';

const withinWeek = dateHelper.isWithinWeek(end, day);