var fs = require('fs');
var exec = require('child_process').exec;
var colors = require('colors');
var path = require('path');
var watch = require('watch');

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
  }

};