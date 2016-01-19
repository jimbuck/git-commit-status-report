#!/usr/bin/env node --use_strict

const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const status = require('../index');
const Vorpal = require('vorpal');
const STATUS = require('../lib/models/status');

const args = process.argv.slice(2);
const vorpal = new Vorpal();

updateNotifier({ pkg });

let currentProject;
const projects = new status.ProjectRepo();

if (args.length > 1) {
  errorOut('Not yet implemented!');
} else {
  currentProject = args[0] || '';
  updateProject(currentProject);

  const tasks = new status.TaskRepo({ project: currentProject });
  
  vorpal
    .command('set project <projectName>')
    .description('Sets the current command context to the specified project.')
    .alias('set p', 'change project', 'change p', 'switch project', 'switch p')
    .autocompletion(function (text, iteration, cb) {
      projects.list().then(function (projects) {
        let projectNames = projects.map(t => t.name);
        var match = this.match(text, projectNames);
        if (match) {
          cb(null, 'set project '+match);
        } else {
          cb(null, projectNames);
        }
      }.bind(this));
    })
    .action(function (args, cb) {
      const log = this.log.bind(this);
      return projects.exists(args.projectName).then(exists => {
        if (exists) {
          return tasks.setProject(args.projectName).then(updateProject);
        }
        
        log(`Project '${args.projectName}' was not found! (hit 'tab' to auto-complete the project name)`);
        cb();
      });
    });

  vorpal
    .command('list <type>')
    .description('Displays a list of projects or tasks.')
    .alias('show', 'display')
    .action(function (args, cb) {
      if (isTask(args)) {
        ensureProjectSet(cb);
        
        return printEntities.call(this, tasks);
      } else {
        return printEntities.call(this, projects);
      }
    });

  vorpal
    .command('add <type> <name> [description...]')
    .description('Creates a projecttask with a to do state.')
    .alias('create', 'make')
    .action(args => {
      if (isTask(args)) {
        return tasks.add(args.name, args.description && args.description.join(' '));
      } else {
        return projects.add(args.name, args.description && args.description.join(' '));
      }
    });
 
  vorpal
    .command('start <task> [description...]')
    .description('Creates or updates a task to an in progress state.')
    .alias('begin', 'do', 'resume')
    .autocompletion(function (text, iteration, cb) {
      tasks.list().then(function (tasks) {
        let taskNames = tasks.map(t => t.name);
        var match = this.match(text, taskNames);
        if (match) {
          cb(null, 'start ' + match);
        } else {
          cb(null, taskNames);
        }
      }.bind(this));
      
    })
    .action(args => tasks.start(args.task, args.description && args.description.join(' ')));

  vorpal
    .command('stop <task>')
    .description('Sets the task to an on hold state.')
    .alias('hold', 'pause')
    .autocompletion(function (text, iteration, cb) {
      tasks.list().then(function (tasks) {
        let taskNames = tasks.map(t => t.name);
        var match = this.match(text, taskNames);
        if (match) {
          cb(null, 'stop ' + match);
        } else {
          cb(null, taskNames);
        }
      }.bind(this));
    })
    .action(args => tasks.stop(args.task));

  vorpal
    .command('complete <task>')
    .description('Sets the task to a completed state.')
    .alias('finish', 'done', 'archive')
    .autocompletion(function (text, iteration, cb) {
      tasks.list().then(function (tasks) {
        let taskNames = tasks.map(t => t.name);
        var match = this.match(text, taskNames);
        if (match) {
          cb(null, 'complete ' + match);
        } else {
          cb(null, taskNames);
        }
      }.bind(this));
    })
    .action(args => tasks.complete(args.task));

  vorpal
    .command('delete <type> <name>')
    .description('Deletes the defined project or task.')
    .alias('remove')
    .action(function (args, cb) {
      let type, repo;
      
      if (isTask(args)) {
        type = 'task';
        repo = tasks;
      } else {
        type = 'project';
        repo = projects;
      }
      
      this.prompt({
        type: 'confirm',
        name: 'delete',
        default: false,
        message: `Are you sure you wish to delete this ${type}?`
      }, function (result) {
        if (result.delete) {
          repo.delete(args.name).then(() => {
            cb();
          });
        } else {
          cb();
        }
      });
    });
    
  vorpal
    .command('report')
    .description('Generates a status report from the entered tasks.')
    .option('-i, --interactive', 'Copies the report for each day to the clipboard, one day at a time.')
    .alias('generate')
    .action(function (args, cb) {
      this.log(chalk.yellow(`Rendering report for ${currentProject || 'all projects'} not yet implemented...`));
      cb();
    });
  
  const exit = vorpal.find('exit');
  if (exit) {
    exit
      .description('Exits instance of StatusReporter.')
      .action(function (args) {
        args.options = args.options || {};
        args.options.sessionId = this.session.id;
        args.options.force = true; // Prevent prompt from opening...
        this.parent.exit(args.options);
      });
  }

  vorpal.show();
    
  if (currentProject) {
    printEntities.call(vorpal, tasks);
  }
}

function updateProject(projectName) {
  currentProject = projectName;
  vorpal.delimiter(`status: ${currentProject || ''}~$`);
}

function ensureProjectSet(cb) {
  if (!currentProject) {
    this.log(`'set project <name>' before listing tasks.`);
    cb();
  }
}

function isTask(args) {
  if (args.type && args.type.length && args.type[0].toLowerCase() === 't') {
    return true;
  } else if (args.type && args.type.length && args.type[0].toLowerCase() === 'p') {
    return false;
  } else {
    errorOut(`'${args.type}' is an unknown type! Choose either (t)ask or (p)roject.`);
  }
}

function printEntities(repo) {
  const log = this.log.bind(this);
  const name = repo instanceof status.ProjectRepo ? 'Project' : 'Task';
  
  return repo.list().then(entities => {
    
    if (entities.length === 0) {
      log(`No active ${name.toLowerCase()}s!`);
      return;
    }
    
    log(name + ':');
    entities.forEach(entity => {
      let msg = '  ' + statusToColor(entity.changes && entity.changes[0] && entity.changes[0].state, entity.name, true);
      if (entity.description) {
        msg += ' - ' + chalk.gray(entity.description);
      }
      log(msg);
    });
  });
}

function statusToColor(status, text, bold) {
  let color;
  
  switch (status) {
    case STATUS.TODO:
      color = 'cyan';
      break;
    case STATUS.IN_PROGRESS:
      color = 'yellow';
      break;
    case STATUS.ON_HOLD:
      color = 'red';
      break;
    case STATUS.COMPLETED:
      color = 'green';
      break;
  }
  
  if (!color) {
    return text;
  }
  
  return bold ? chalk.bold[color](text) : chalk[color](text);
}

function errorOut(err) {
  vorpal.log(chalk.white.bgRed(err));
  process.exit(1);
}