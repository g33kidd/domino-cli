var domino = require('commander');
var fs = require('fs');
var path = require('path');
var colors = require('colors');
var utils = require('./utils');
var wp = require('./wordpress');
var watch = require('./watch');

domino.version('0.0.1');

domino.command('new [type] [name] [filename]')
  .description("Creates a new function.")
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

domino.command('setup')
  .description("Setup domino-cli by installing additional components.")
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

domino.command('watch')
  .description('Watches current working directory for file changes.')
  .action(function() {
    watch.startWatcher("**/*.less", function(evt, filepath) {
      var message = filepath + " was " + evt;
      if(evt === 'added') {
        console.log(message.green);
      }else if(evt === 'changed') {
        console.log(message.cyan);
      }else if(evt === 'deleted') {
        console.log(message.red);
      }else{
        console.log(message);
      }
    });
  });

domino.command('init')
  .description("Initializes a new domino project. Creates domino.json configuration file.")
  .action(function() {
    var configFile = fs.readFileSync(path.join(__dirname, 'templates/' + "config.json"), 'utf-8').toString();
    fs.writeFile(process.cwd() + "/domino.json", configFile, function(err) {
      if(err) {
        console.log(err.red);
      }else{
        console.log("This is now a domino project!".green);
      }
    });
  });

module.exports = domino;