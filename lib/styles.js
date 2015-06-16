var less = require('less');
var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var sass = require('node-sass');
var importOnce = require('node-sass-import-once');

module.exports = {

  compileSass: function(file) {
    sass.render({
      file: file,
      importer: importOnce,
      importOnce: {
        index: false,
        css: false,
        bower: true
      },
      outputStyle: 'compressed'
    }, function(error, result) {
      if(error) {
        console.log(error.status);
        console.log(error.column);
        console.log(error.message);
        console.log(error.line);
      }else{
        console.log(result.css.toString());
        console.log(result.stats);
      }
    });
  },

  /**
   * Creates the WordPress style.css header comment.
   * TODO: Make this not repeat if comment exists.
   * Remove the comment if it already exists and replace it!
   */
  appendStyleHeader: function() {
    var message = "/*\n" +
      "Theme Name: " + config.theme.name + "\n" +
      "Theme URI: " + config.theme.uri + "\n" +
      "Author: " + config.theme.author + "\n" +
      "Author URI: " + config.theme.authorUri + "\n" +
      "Description: " + config.theme.description + "\n" +
      "Version: " + config.theme.version + "\n" +
      "License: " + config.theme.license + "\n" +
      "License URI: " + config.theme.licenseUri + "\n" +
      "Text Domain: " + config.theme.textDomain + "\n" +
      "Tags: " + config.theme.tags + "\n" + "*/" + "\n";

    var stylePath = path.join(process.cwd(), "/style.css");
    var data = fs.readFileSync(stylePath);
    var file = fs.openSync(stylePath, "w+");
    var buffer = new Buffer(message);
    fs.writeSync(file, buffer, 0, buffer.length);
    fs.writeSync(file, data, 0, data.length);
    fs.close(file);
  },

  /**
   * Compiles all of the LESS files within the stylesheets
   * directory in the domino project.
   * @param  {string} filepath Filepath returned by file watcher.
   */
  compileLess: function(filepath) {
    var self = this;
    if(path.extname(filepath) === '.less') {
      fs.readFile(filepath, function(err, data) {
        var dataString = data.toString();
        var filename = path.basename(filepath);
        var stylesPath = path.join(process.cwd(), 'stylesheets/');
        var cssPath = path.join(process.cwd(), 'assets/css/');

        var options = {
          paths: [stylesPath],
          outputDir: cssPath,
          optimization: 1,
          compress: true,
          yuicompress: true
        };

        if(filename === 'style.less') {
          options.filename = "style.less";
          options.outputDir = process.cwd();
          options.outputFile = "style.css";
        }

        less.render(dataString, options, function(err, output) {
          if(err) {
            console.log(err);
          }else{
            console.log(output.css);
            console.log(path.join(options.outputDir, options.outputFile));
            fs.writeFile(options.outputDir + options.outputFile, output.css.toString(), function(err) {
              if(err) {
                console.log(err.red);
              }else {
                console.log("Worked!".green);
              }
            });
            console.log("Success: Compiled style.less to style.css!".green);
          }
        });
      });
    }

  },

  ensureDirectory: function(filepath) {
    var dir = path.dirname(filepath);
    var existsSync = fs.existsSync || path.existsSync;
    if(!existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

};
