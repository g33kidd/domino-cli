var fs = require('fs');
var exec = require('child_process').exec;
var colors = require('colors');
var path = require('path');
var watch = require('watch');

module.exports = {

  startWatcher: function() {
    console.log("Started watching for changes...".green);
    var options = { ignoreDotFiles: true };

    watch.createMonitor(process.cwd(), options, function(monitor) {
      monitor.on('created', function(f, stat) {
        console.log("created file");
        console.log(f);
      })
      monitor.on('changed', function(f, stat) {
        console.log("changed file");
        console.log(f);
        console.log(path.parse(f));
      })
      monitor.on('removed', function(f, stat) {
        console.log("removed file");
        console.log(f);
      })
    })
  },

  getTemplateDir: function() {
    return path.join(__dirname, 'templates/');
  }

  getFileTemplate: function(templateName, ext) {
    var template = getTemplateDir() + templateName + "." + ext;
    return template;
  },

  getTemplate: function(templateName, ext) {
    var template = this.getFileTemplate(templateName, ext);
    return fs.readFileSync(template, 'utf-8');
  }

};