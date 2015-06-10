#!/usr/bin/env node
var fs = require('fs');
var colors = require('colors');
var cli = require('./lib/cli');
var util = require('./lib/utils');
var wordpress = require('./lib/wordpress');

if(fs.existsSync("domino.json")) {
  config = JSON.parse(fs.readFileSync("domino.json"));
  util.showHeader();
}

cli.parse(process.argv);