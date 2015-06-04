#!/usr/bin/env node
var fs = require('fs');
var colors = require('colors');
var cli = require('./lib/cli');
var util = require('./lib/utils');
var config = JSON.parse(fs.readFileSync("domino.json"));

var dominoHeader = "Working on: " + config.theme.name + "\nPowered by: domino-cli\n=======================";
console.log(dominoHeader.cyan);
cli.parse(process.argv);