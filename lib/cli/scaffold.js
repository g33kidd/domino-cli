var domino = require('commander');
var fs = require('fs');
var ejs = require('ejs');

domino.version('0.0.1')
domino.command('new [type]')
  .description('creates a new function')
  .action(function(file, name) {
    
    // console.log(fileContents);
});

module.exports = domino;