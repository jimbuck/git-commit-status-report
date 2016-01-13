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
