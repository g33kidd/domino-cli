var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var colors = require('colors');
var watch = require('watch');
var path = require('path');
var utils = require('./utils');
var templateDirectory = path.join(__dirname, '/templates/');

module.exports = {

  /**
   * Creates a new function in the specified
   * functions file in the domino functions/ directory.
   * @param  {string} name Name of the function
   * @param  {string} file Name of the functions file
   */
  newFunction: function(name, file) {
    var template = path.join(templateDirectory + "function_php.txt");
    var file = fs.readFileSync(template, 'utf-8').toString();
    var newFunction = file.replace(/{{name}}/g, name);
    var functionFile = "functions/" + filename + ".php";
    fs.appendFile(functionFile, "\n\n");
    fs.appendFile(functionFile, newFunction, function(err) {
      var message = "Successfully created " + name + "() in " + functionFile;
      if(err)
        console.log(err.red);
      console.log(message.green);
    })
  },

  /**
   * Creates a new function file in the functions/ directory.
   * @param  {string} filename Name of the new file.
   */
  newFunctionFile: function(filename) {
    var template = path.join(templateDirectory + "function_file_php.txt");
    var file = fs.readFileSync(template, 'utf-8').toString();
    var newFile = "functions/" + filename + ".php";
    var self = this;

    fs.writeFile(newFile, template, function(err) {
      if(err) {
        console.log(err.red);
      }else{
        console.log("Created new functions file".green);
        self.addFileToFunctions(newFile, function(err) {
          if(err) {
            console.log(err.red);
          }else{
            console.log("Added function to functions.php".green);
          }
        })
      }
    })
  },

  /**
   * Creates a new template file with the default template
   * in templates
   * @param  {string} name     Template name
   * @param  {string} filename Name of the template file
   */
  newTemplateFile: function(name, filename) {
    var template = path.join(templateDirectory + "template_php.txt");
    var file = fs.readFileSync(template, 'utf-8').toString();
    var newTemplate = file.replace(/{{name}}/g, name);
    var newFile = "templates/" + filename + ".php";
    fs.writeFile(newFile, newTemplate, function(err) {
      if(err) {
        console.log(err.red);
      }else{
        var message = "Successfully created template with name: " + name + " at: " + newFile;
        console.log(message.green);
      }
    })
  },

  /**
   * Adds a functions file to functions.php
   * @param {string} filename Name of the file to be added.
   */
  addFileToFunctions: function(filename) {
    var requireFile = "\nrequire get_template_directory() . '/"+ filename +"';";
    fs.appendFile("functions.php", requireFile, function(err) {
      cb(err);
    })
  },

  /**
   * Helper to determine if WP_CLI is installed.
   * @param  {Function} cb Callback with only single bool argument.
   * @return {Boolean}     Is wp-cli installed?
   */
  isCliInstalled: function(cb) {
    exec('wp', function(error, stdout, stderr) {
      if(stdout === '') {
        cb(false);
        console.log("WP_CLI is not installed!".red);
      }else{
        cb(true);
        console.log("WP_CLI is installed!".green);
      }
    });
  },

  /**
   * Installs wp-cli if not already installed.
   * @param  {Function} cb [description]
   * @return {[type]}      [description]
   */
  installCli: function(cb) {
    var homeDir = process.env.HOME || process.env.USERPROFILE;
    var downloadLocation = homeDir + "/Downloads/wpcli.phar";
    var wpCliUrl = "";
    var cliInstall = spawn('curl', ['-o', downloadLocation, wpCliUrl]);
    cliInstall.on('close', function() {
      fs.exists(downloadLocation, function(exists) {
        if(exists) {
          var permissions = "Settings permissions: chmod +x " + downloadLocation;
          var bind = "Binding to wp: sudo mv " + downloadLocation + " /usr/local/bin/wp";
          console.log(permissions.cyan);
          exec('chmod +x ' + downloadLocation);
          console.log(bind.cyan);
          exec('sudo mv ' + downloadLocation + " /usr/local/bin/wp");

          console.log("WP_CLI is now installed!".green);
        }else{
          console.log("Error: File wpcli.phar not found! Maybe install CLI separately.".red);
        }
      })
    });
  },

  /**
   * Get the domino templates/ directory
   * @return {string} Path of templates/ directory.
   */
  wpTemplatesDir: function() {
    return path.join(process.cwd(), 'templates/');
  },

  /**
   * Gets the domino theme root directory
   * @return {string} Path of domino root directory.
   */
  wpThemeDir: function() {
    return path.join(process.cwd());
  }

};