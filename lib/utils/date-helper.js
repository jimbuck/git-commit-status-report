
const moment = require('moment');

function convertToEnd(end) {
  return moment(end).endOf('day');
}

function getWeekStart(end, weekLength) {
  weekLength = weekLength || 7;

  end = moment(end).endOf('day');

  return moment(end).subtract(weekLength - 1, 'days').startOf('day');
}

function isWithinWeek(end, date) {
  date = moment(date);
  end = convertToEnd(end);
  const start = getWeekStart(end);

  return date.isBetween(start, end);
}

function getPriorStart(end, weeks) {
  weeks = weeks || 1;

  return getWeekStart(end, (7 * weeks));
}

module.exports = {
  getWeekStart,
  isWithinWeek,
  getPriorStart
};
