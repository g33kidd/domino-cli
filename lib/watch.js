var Gaze = require('gaze').Gaze;
var colors = require('colors');
var path = require('path');
var styles = require('./styles');

module.exports = {

  startWatcher: function(path, cb) {
    var workingDir = process.cwd();
    var gaze = new Gaze(path);

    gaze.on('ready', function(watcher) {
      console.log("Watching for changes...".green);
    });

    gaze.on('all', function(evt, filepath) {
      cb(evt, filepath);
    });
  },

  sassWatcher: function() {
    this.startWatcher("**/*.{scss,sass}", function(evt, filepath) {
      console.log(filepath + " was " + evt);
      styles.compileSass(filepath);
    });
  }

};