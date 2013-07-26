#!/usr/bin/env node

var repoUrl = require('repo-url');
var spawn = require('child_process').spawn;
var commands = process.argv.slice(2);

var name = commands.pop();
if (!name) error('module name required');

function cmd (str) {
  return commands.indexOf(str) > -1
    || commands.indexOf('--' + str) > -1;
}

var get =
  cmd('ssh') ? repoUrl.ssh :
  cmd('https') ? repoUrl.https :
  repoUrl;

get(name, function (err, url) {
  if (err) error(err);

  run('git', ['clone', url], function (code) {
    if (code != 0) process.exit(code);
    process.chdir(process.cwd() + '/' + name);

    if (cmd('install') || cmd('test') || cmd('all')) {
      run('npm', ['install'], function (code) {
        if (code != 0) process.exit(code);

        if (cmd('test') || cmd('all')) {
          run('npm', ['test'], function (code) {
            process.exit(code);
          });
        }
      });
    }
  });
});

function run (cmd, args, opts, fn) {
  if (typeof opts == 'function') {
    fn = opts;
    opts = {};
  }
  var ps = spawn(cmd, args, opts);
  ps.stdout.pipe(process.stdout);
  ps.stderr.pipe(process.stderr);
  ps.on('exit', fn);
}

function error (err) {
  console.error(err);
  process.exit(1);
}

