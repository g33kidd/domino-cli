var fs          = require('fs');
var less        = require('less');
var path        = require('path');
var colors      = require('colors');
var sass        = require('node-sass');
var importOnce  = require('node-sass-import-once');
var utils       = require('./utils');

module.exports = {

  compileSass: function(file) {
    var filename = path.basename(file, '.scss');
    var outputStyle = "nested";
    var self = this;

    if(typeof config.sass.outputStyle != 'undefined') {
      outputStyle = config.sass.outputStyle;
    }

    sass.render({
      file: file,
      outputStyle: outputStyle,
      importer: importOnce,
      importOnce: {
        index: false,
        css: true,
        bower: true
      }
    }, function(error, result) {
      if(error) {
        var errorMessage = error.line + ":" + error.column + " - " + error.message.red;
        utils.log("ERROR", errorMessage);
      }else{
        self.outputFile(filename, result.css.toString());
      }
    });
  },

  outputFile: function(filename, css) {
    if(filename === 'style') {
      this.outputStyle(css);
    }
  },

  renderStyle: function() {
    var stylePath = path.join(process.cwd(), 'stylesheets', '/style.scss');
    this.compileSass(stylePath);
  },

  outputStyle: function(css) {
    var self = this;
    if(css) {
      var stylePath = path.join(process.cwd(), "/style.css");
      var css = self.themeHeader() + css;
      fs.writeFile(stylePath, css, function(error) {
        if(error) {
          utils.log("ERROR", error.red);
        }else{
          utils.log("INFO", "style.css updated".green);
        }
      })
    }
  },

  themeHeader: function() {
    var style = path.join(process.cwd(), '/style.css');
    var template = utils.template(utils.getTemplate('header', 'txt').toString(), {
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
    return template;
  }

};
