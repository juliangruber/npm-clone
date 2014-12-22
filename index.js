#!/usr/bin/env node

var repoUrl = require('repo-url');
var spawn = require('child_process').spawn;
var parse = require('url').parse;
var base = require('path').basename;
var commands = process.argv.slice(2);
var pkg = require('./package.json');

var name = commands.pop();
if (!name) error('module name required');

function cmd (str) {
  return commands.indexOf(str) > -1
    || commands.indexOf('--' + str) > -1;
}


function help() {
  console.log(pkg.description);
  console.log('');
  console.log('Usage');
  console.log('  $ npm-clone [FLAG] [TYPE] <module-name>');
  console.log('  Types: all, install, test');
  console.log('  Flags: --ssh, --https');
  console.log('');
  console.log('Example');
  console.log('  $ npm-clone --ssh all periodic');
}

if (process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1) {
  help();
  return;
}

if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
  console.log(pkg.version);
  return;
}

var get =
  cmd('ssh') ? repoUrl.ssh :
  cmd('https') ? repoUrl.https :
  repoUrl;

get(name, function (err, url) {
  if (err) error(err);

  run('git', ['clone', url, name], function (code) {
    if (code != 0) process.exit(code);
    process.chdir(process.cwd() + '/' + dirname(url));

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

function dirname (url) {
  return base(parse(url).pathname).replace(/\.git$/, '');
}
