#!/usr/bin/env node

var path = require('path');
var pkg = require( path.join(__dirname, 'package.json') );
var fs = require('fs');
var wkhtmltopdf = require('wkhtmltopdf');
var bibparse = require("bibtex-parser")
// Parse command line options

var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --path <path>', 'Path for bibtex file')
  .parse(process.argv);

console.log('your arguments:');
if (program.path) console.log('  - path' + program.path);

var bibtext = fs.readFileSync('library.bib', 'utf8');
bibtext = bibparse(bibtext);
// console.log(JSON.stringify(bibtext));
// fs.writeFile("parsedtest.txt", JSON.stringify(bibtext), function(err) {
//     if(err) {
//         return console.log(err);
//     }
//
//     console.log("The file was saved!");
// });
//console.log(bibparse(bibtext));
//console.log(bibparse(bibtext));
fs.appendFile('error-log.txt', 'These URLs caused errors \n', function (err) {

});
function returnUrlsAndAuthor(bibtextObject) {
  if(!bibtextObject) {
    return false;
  }
  var urls = [];
  for (var key in bibtextObject) {
     if (bibtextObject.hasOwnProperty(key)) {
        var obj = bibtextObject[key];
        for (var prop in obj) {
           if (obj.hasOwnProperty(prop)) {
              if(prop === "URL") {
                urls.push({
                  url: obj[prop],
                  title: obj['TITLE']
                })
              }
           }
        }
     }
  }
  return urls;

}

function writePdf(bibObject) {
  wkhtmltopdf(bibObject.url,
    {
      output: 'pdf/'+encodeURIComponent(bibObject.title)+'-'+encodeURIComponent(bibObject.url)+'.pdf',
      javascriptDelay: 800
    },
    function (code, signal) {
      if(signal != 0 && code) {
        console.log("Fehler aufgetreten bei "+bibObject.title+".pdf", code);
        fs.appendFile('error-log.txt', "Fehler aufgetreten bei "+bibObject.title+".pdf, "+bibObject.url+"\n", function (err) {

        });
      } else {
        console.log("Erfolgreich heruntergeladen "+bibObject.title+".pdf");
      }
    });
}

var urls = returnUrlsAndAuthor(bibtext);
for (var i = 0; i < 20; i++) {
  if((urls[i].url.split('.pdf')).length > 1) {
    fs.appendFile('error-log.txt', "Fehler aufgetreten bei "+urls[i].title+".pdf, "+urls[i].url+"\n", function (err) {

    });
  }
  else {
    writePdf(urls[i]);
  }
};
