'use strict';

import test from 'ava';
import moment from 'moment';
import dateHelper from '../../lib/utils/date-helper.js';

test('Week ending on friday returns start of previous saturday', t => {
  const endDate = '2016-01-01';
  const expectedStartDate = moment('2015-12-26').startOf('day');

  const actualStartDate = dateHelper.getWeekStart(endDate);

  t.ok(expectedStartDate.isSame(actualStartDate));
});

test('3-day week ending on friday returns start of previous wednesday', t => {
  const endDate = '2016-01-01';
  const expectedStartDate = moment('2015-12-30').startOf('day');

  const actualStartDate = dateHelper.getWeekStart(endDate, 3);

  t.ok(expectedStartDate.isSame(actualStartDate));
});

test('Midweek is contained within week.', t => {
  const end = '2016-01-08';
  const day = '2016-01-05';

  const withinWeek = dateHelper.isWithinWeek(end, day);

  t.ok(withinWeek);
});

test('Before is not contained within week.', t => {
  const end = '2016-01-08';
  const day = '2015-12-25';

  const withinWeek = dateHelper.isWithinWeek(end, day);

  t.notOk(withinWeek);
});

test('After is not contained within week.', t => {
  const end = '2016-01-08';
  const day = '2016-01-10';

  const withinWeek = dateHelper.isWithinWeek(end, day);

  t.notOk(withinWeek);
});

test('Week end is contained within week.', t => {
  const end = '2016-01-08';

  const withinWeek = dateHelper.isWithinWeek(end, end);

  t.ok(withinWeek);
});

test('Week start is contained within week.', t => {
  const end = '2016-01-08';
  const day = '2016-01-02';

  const withinWeek = dateHelper.isWithinWeek(end, day);

  t.ok(withinWeek);
});