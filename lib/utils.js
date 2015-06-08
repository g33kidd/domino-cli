var fs = require('fs');
var exec = require('child_process').exec;
var colors = require('colors');
var watch = require('watch');

module.exports = {

  startWatcher: function() {
    watch.createMonitor(process.cwd(), {ignoreDotFiles: true}, function(monitor) {
      monitor.on('created', function(f, stat) {
        console.log("created file");
        console.log(f);
      })
      monitor.on('changed', function(f, stat) {
        console.log("changed file");
        console.log(f);
      })
      monitor.on('removed', function(f, stat) {
        console.log("removed file");
        console.log(f);
      })
    })
  }

};