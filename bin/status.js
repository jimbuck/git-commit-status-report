#!/usr/bin/env node --use_strict

const vorpal = require('vorpal')();
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({ pkg });

vorpal
  .command('foo', 'Outputs "bar"')
  .action(function (args, callback) {
    this.log('bar');
    callback();
  });

vorpal
  .delimiter('status~$')
  .show();
