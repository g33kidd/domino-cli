var domino = require('commander');
var fs = require('fs');
var ejs = require('ejs');
var colors = require('colors/safe');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var utils = require('./utils');

domino.version('0.0.1')

// New command: creates a new file or function
domino.command('new [type] [name] [file]')
  .description('creates a new function')
  .action(function(type, name, file) {
    if(type === 'func') {
      utils.newFunction(name, file);
    }else if(type === 'funcFile') {
      var filename = name;
      utils.newFunctionFile(filename);
    }else if(type === 'template') {
      utils.newTemplateFile(name, file);
    }else{
      console.log("Incorrect type! Use only func|funcFile|template".red)
    }
  });

domino.command('setup')
  .description('setup domino-cli')
  .action(function() {
    // Downloads wp-cli if not already installed.
    utils.isWpCliInstalled(function(result) {
      if(!result) {
        var userHomeDir = process.env.HOME || process.env.USERPROFILE;
        var downloadLocation = userHomeDir + "/Downloads/wpcli.phar";
        var wp_cli_install = spawn('curl', ['-o', downloadLocation, 'https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar']);
        wp_cli_install.stdout.on('data', function(chunk) {
          console.log(chunk.toString());
        });
        wp_cli_install.on('close', function() {
          fs.exists(downloadLocation, function(exists) {
            if(exists) {
              console.log("chmod +x " + downloadLocation.cyan);
              exec('chmod +x ' + downloadLocation);
              console.log("sudo mv " + downloadLocation + " /usr/local/bin/wp".cyan);
              exec("sudo mv " + downloadLocation + " /usr/local/bin/wp");
            }else{
              console.log("Error: File wpcli.phar not found!".red);
            }
          })
        });
        // exec('curl -o ~/Downloads/wpcli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar', function(err, stdout, stderr) {
        //   if(err)
        //     console.log(err.red);
        //   console.log(stderr.blue);
        // });
      }
    });
  });

module.exports = domino;