#!/usr/bin/env node
var fs = require('fs');
var colors = require('colors');
var cli = require('./lib/cli');
var util = require('./lib/utils');
var wordpress = require('./lib/wordpress');

if(fs.existsSync("domino.json")) {
  var config = JSON.parse(fs.readFileSync("domino.json"));
  var dominoHeader = "Working on: " + 
      config.theme.name +  "\nPowered by: domino-cli\nWorking Directory: " +
      process.cwd() + "\n=======================\n";
  console.log(dominoHeader.cyan);
}else{
  console.log("Use 'domino init' to initialize a new domino project.".magenta);
}

cli.parse(process.argv);