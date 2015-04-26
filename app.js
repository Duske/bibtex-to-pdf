#!/usr/bin/env node

var path = require('path');
var pkg = require( path.join(__dirname, 'package.json') );

var fs = require('fs');
var bibparse = require('bibtex-parser');
var extractor = require('./extractor');
var converter = require('./converter');

// Parse command line options
var program = require('commander');
program
  .version('0.0.1')
  .option('-p, --path <path>', 'Path for bibtex file')
  .parse(process.argv);

if (program.path) {
  console.log('  - path ' + program.path);
}
//defaults
var bibFile = program.path || 'library.bib';

//Read bibtext from file and parse it
var bibtext = fs.readFileSync(bibFile, 'utf8');
bibtext = bibparse(bibtext);

//Extracted source item list
var urls = extractor.getExtractedSourceList(bibtext);

//Start conversion
converter.convertBibtexJsonToPdf(urls);
