var domino    = require('commander');
var colors    = require('colors');
var wp        = require('./wordpress');
var watch     = require('./watch');
var sync      = require('./sync');
var styles    = require('./styles');
var utils     = require('./utils');

domino.version("0.0.2");

domino.command('init')
  .description("Creates domino.json file for access to additional commands.")
  .action(function() {
    utils.init();
  });

domino.command('setup')
  .description("Installs additional components.")
  .action(function() {
    wp.isCliInstalled(function(installed) {
      if(!installed) {
        wp.installCli(function(err) {
          if(err) {
            console.log(err.red);
          }else{
            console.log("Installed WP_CLI!".green);
          }
        });
      }
    });
  });

domino.command('deploy')
  .description("Deploy site to remote server.")
  .action(function() {
    sync.deploy();
  });

domino.command('watch')
  .description("Watches for file changes in styles directory.")
  .action(function() {
    watch.sassWatcher();
  });

domino.command('new')
  .description("Creates a new ")
  .action(function(type, name, filename) {
    if(type === 'func') {
      wp.newFunction(name, filename);
    }else if(type === 'funcFile' || type === 'functionFile') {
      wp.newFunctionFile(name);
    }else if(type === 'template' || type === 't') {
      wp.newTemplateFile(name, filename);
    }else{
      console.log("Incorrect type! Use --help to find out more.".red);
    }
  });

module.exports = domino;
