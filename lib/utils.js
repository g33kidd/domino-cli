var fs = require('fs');
var exec = require('child_process').exec;
var colors = require('colors');

module.exports = {
  newFunction: function(name, filename) {
    console.log("name: " + name);
    console.log("file: " + filename);
    
    var template = __dirname + "/templates/function_php.txt";
    var file = fs.readFileSync(template, 'utf-8').toString();
    var func = file.replace(/{{name}}/g, name);
    var funcFile = "functions/" + filename + ".php";
    fs.appendFile(funcFile, "\n\n");
    fs.appendFile(funcFile, func, function(err) {
      if(err) {
        console.log(err.red);
      }else{
        var message = "Successfully created " + name + "() in " + funcFile;
        console.log(message.green);
      }
    });
  },

  newFunctionFile: function(filename) {
    var template = fs.readFileSync(__dirname + "/templates/function_file_php.txt", 'utf-8');
    var newFile = "functions/" + filename + ".php";
    var self = this;

    fs.writeFile(newFile, template, function(err) {
      if(err) {
        console.log(err.red);
      }else{
        var message = "Created new functions file.";
        console.log(message.green);
        self.addToFunctions(newFile, function(err) {
          if(err) {
            console.log(err.red);
          }else{
            console.log("Added function to functions.php".green);
          }
        })
      }
    });
  },

  newTemplateFile: function(name, filename) {
    var template = __dirname + "/templates/template_php.txt";
    var templateDir = "templates/";
    var newTemplate = fs.readFileSync(template, 'utf-8').toString().replace(/{{name}}/g, name);
    var newFile = templateDir + filename + ".php";

    fs.writeFile(newFile, newTemplate, function(err) {
      if(err) {
        console.log(err.red);
      }else{
        var message = "Successfully created template with name: " + name + " at: " + newFile;
        console.log(message.green);
      }
    })
  },

  addToFunctions: function(filename, cb) {
    var requireFile = "\nrequire get_template_directory() . '/"+ filename +"';";
    fs.appendFile("functions.php", requireFile, function(err) {
      cb(err);
    });
  },

  isWpCliInstalled: function(cb) {
    exec('wp', function(error, stdout, stderr) {
      if(stdout === '') {
        cb(false);
        console.log("WP-CLI is not installed!".red);
      }else{
        cb(true);
        console.log("WP-CLI is installed!".green);
      }
    });
  }
};