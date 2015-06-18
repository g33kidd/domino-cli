var Gaze    = require('gaze').Gaze;
var colors  = require('colors/safe');
var path    = require('path');
var styles  = require('./styles');
var utils   = require('./utils');

module.exports = {

  startWatcher: function(path, cb) {
    var workingDir = process.cwd();
    var gaze = new Gaze(path);

    gaze.on('ready', function(watcher) {
      utils.log("INFO", "Watching for changes...".green);
    });

    gaze.on('all', function(evt, filepath) {
      cb(evt, filepath);
    });
  },

  sassWatcher: function() {
    this.startWatcher("**/*.{scss,sass}", function(evt, filepath) {
      utils.log("INFO", path.basename(filepath) + " was " + evt);
      styles.renderStyle(filepath);
    });
  },

  lessWatcher: function() {
    this.startWatcher("**/*.less", function(evt, filepath) {
      utils.log("INFO", path.basename(filepath) + " was " + evt);
      styles.compileLess(filepath);
    });
  }

};
