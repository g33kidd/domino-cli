var fs = require('fs');
var exec = require('child_process').exec;
var colors = require('colors');
var path = require('path');
var watch = require('watch');
var _ = require('underscore');

module.exports = {

  getTemplateDir: function() {
    return path.join(__dirname, 'templates/');
  },

  getFileTemplate: function(templateName, ext) {
    var template = this.getTemplateDir() + templateName + "." + ext;
    return template;
  },

  getTemplate: function(templateName, ext) {
    var template = this.getFileTemplate(templateName, ext);
    return fs.readFileSync(template, 'utf-8');
  },

  showHeader: function() {
    var message = "Theme: " + config.theme.name;
    var message = "Working on: " +
      config.theme.name +  "\nPowered by: domino-cli\nWorking Directory: " +
      process.cwd() + "\n=======================\n";
    console.log(message.cyan);
  },

  template: function(contents, data) {
    if(typeof data === 'object') {
      _.each(data, function(val, key) {
        var expr = new RegExp("{{" + key + "}}", 'g');
        contents = contents.replace(expr, val);
      });
      return contents;
    }
  }

};
