var domino = require('commander');
var fs = require('fs');
var ejs = require('ejs');
var colors = require('colors');
var utils = require('./utils');

domino.version('0.0.1')
domino
  .command('new [type] [name] [file]')
  .description('creates a new function')
  .action(function(type, name, file) {
    if(type === 'func') {
      utils.newFunction(name, file);
    }else if(type === 'funcFile') {
      var filename = name;
      utils.newFunctionFile(filename);
    }else if(type === 'template') {
      utils.newTemplateFile(name, file);
    }else{
      console.log("Incorrect type! Use only func|funcFile|template".red)
    }
  });

module.exports = domino;