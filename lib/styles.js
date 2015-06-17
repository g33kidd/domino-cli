var less = require('less');
var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var colors = require('colors');
var sass = require('node-sass');
var importOnce = require('node-sass-import-once');

module.exports = {

  /**
   * Creates the WordPress style.css header comment.
   */
  appendStyleHeader: function() {
    var header = utils.getTemplate('header', 'txt').toString();
    var headerTemplate = utils.template(header, {
      themeName: config.theme.name,
      themeUri: config.theme.uri,
      author: config.theme.author,
      authorUri: config.theme.authorUri,
      description: config.theme.description,
      themeVersion: config.theme.version,
      license: config.theme.license,
      licenseUri: config.theme.licenseUri,
      textDomain: config.theme.textDomain,
      tags: config.theme.tags
    });

    var stylePath = path.join(process.cwd(), "/style.css");
    var data = fs.readFileSync(stylePath);
    var file = fs.openSync(stylePath, "w+");
    var buffer = new Buffer(headerTemplate);

    fs.writeSync(file, buffer, 0, buffer.length);
    fs.writeSync(file, data, 0, data.length);
    fs.close(file);
  },

  writeStyle: function(cssString) {
    var self = this;
    if(cssString) {
      var stylePath = path.join(process.cwd(), '/style.css');
      fs.writeFile(stylePath, cssString, function(error) {
        if(error)
          console.log(error.red);
        utils.log("INFO", "style.css updated".green);
        self.appendStyleHeader();
      });
    }
  },

  compileSass: function(file) {
    var filename = path.basename(file, '.scss');
    var self = this;
    sass.render({
      file: file,
      importer: importOnce,
      importOnce: {
        index: false,
        css: true,
        bower: true
      },
      outputStyle: 'compressed'
    }, function(error, result) {
      if(error) {
        var errorMessage = error.line + ":" + error.column + " - " + error.message.red;
        utils.log("ERROR", errorMessage);
      }else{
        self.writeStyle(result.css.toString());
        // var newFilePath = path.join(process.cwd(), config.assetsPath, 'css', filename + '.css');
        // console.log(newFilePath);
        // console.log(result.css.toString());
      }
    });
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


// var fs          = require('fs');
// var less        = require('less');
// var path        = require('path');
// var colors      = require('colors');
// var sass        = require('node-sass');
// var importOnce  = require('node-sass-import-once');
// var utils       = require('./utils');
//
// module.exports = {
//
//   compileSass: function(file) {
//     var filename = path.basename(file, '.scss');
//     var outputStyle = "nested";
//     var self = this;
//
//     if(typeof config.sass.outputStyle != 'undefined') {
//       outputStyle = config.sass.outputStyle;
//     }
//
//     sass.render({
//       file: file,
//       outputStyle: outputStyle,
//       importer: importOnce,
//       importOnce: {
//         index: false,
//         css: true,
//         bower: true
//       }
//     }, function(error, result) {
//       if(error) {
//         var errorMessage = error.line + ":" + error.column + " - " + error.message.red;
//         utils.log("ERROR", errorMessage);
//       }else{
//         self.outputFile(filename, result.css.toString());
//       }
//     });
//   },
//
//   compileLess: function(file) {},
//
//   outputFile: function(filename, css) {
//     var filePath = path.join(process.cwd(), config.assetsPath, filename + ".css");
//     if(filename === 'style') {
//       this.outputStyle(css);
//     }else if(filename.substring(0, filename.length) === '_') {
//       // Do nothing... but we should probably just compile all
//       // the files anyways. Just because a file might be importing
//       // this file... For now, do nothing.
//       return;
//     }else{
//       fs.writeFile(filePath, css, function(error) {
//         if(error) {
//           utils.log("ERROR", error.red);
//         }
//       });
//     }
//
//   },
//
//   outputStyle: function(css) {
//     var self = this;
//     if(css) {
//       var stylePath = path.join(process.cwd(), "/style.css");
//       fs.writeFile(stylePath, css, function(error) {
//         if(error) {
//           utils.log("ERROR", error.red);
//         }else{
//           utils.log("INFO", "style.css updated".green);
//           self.appendHeader();
//         }
//       })
//     }
//   },
//
//   appendHeader: function() {
//     var style = path.join(process.cwd(), '/style.css');
//     var data = fs.readFileSync(style);
//     var file = fs.openSync(style, "w+");
//     var template = utils.template(utils.getTemplate('header', 'txt').toString(), {
//       themeName: config.theme.name,
//       themeUri: config.theme.uri,
//       author: config.theme.author,
//       authorUri: config.theme.authorUri,
//       description: config.theme.description,
//       themeVersion: config.theme.version,
//       license: config.theme.license,
//       licenseUri: config.theme.licenseUri,
//       textDomain: config.theme.textDomain,
//       tags: config.theme.tags
//     });
//     var buffer = new Buffer(template);
//     fs.writeSync(file, buffer, 0, buffer.length);
//     fs.writeSync(file, data, 0, buffer.length);
//     fs.close(file);
//   }
//
// };
