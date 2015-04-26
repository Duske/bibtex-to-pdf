'use strict';
var wkhtmltopdf = require('wkhtmltopdf');
var Q = require('q');
var http = require('http');
var fs = require('fs');

var filePath = 'pdf/';
function writePdf(url, filename) {
  var deferred = Q.defer();
  wkhtmltopdf(url,
    {
      output: filePath + filename,
      javascriptDelay: 2000
    },
    function (code, signal) {
      //Ignore code QFont::setPixelSize: Pixel size <= 0 (0)
      if(signal !== 0 && code && code.message !== 'QFont::setPixelSize: Pixel size <= 0 (0)') {
        deferred.reject(code, filename);
      } else {
        deferred.resolve(filename);
      }
    });
    return deferred.promise;
}

function isPdfFile(url) {
  return (url.split('.pdf').length > 1);
}

function cleanSlashes(text) {
  return text.replace(/\//g, '-');
}


module.exports = {

  composeFileName: function(nameParts, filetype) {
    return (cleanSlashes(nameParts.reduce(function(prev, current) {
      return prev + '-' + current;
    }) + '.' + filetype));
  },
  
  convertBibtexJsonToPdf: function(urls) {
    var workCount = 0;
    var max = urls.length;
    var file;
    var tempFileName;
    for (var i = 0; i < max; i++) {
      if(isPdfFile(urls[i].url)) {
        workCount++;
        tempFileName = composeFileName([urls[i].author, urls[i].title], 'pdf');
        file = fs.createWriteStream(filePath+tempFileName);
        var request = http.get(urls[i].url, function(response) {
          response.pipe(file);
          file.on('finish', function() {
            file.close(function() {
              console.log('Successfully downloaded ' + tempFileName);
            });
          });
        }).on('error', function(err) {
          fs.unlink(tempFileName);
          console.log('An error occured with ' + tempFileName + '\n' + err);
        });
      }
      else {
        writePdf(urls[i].url, composeFileName([urls[i].author, urls[i].title], 'pdf'))
        .then(function(filename) {
          console.log('Successfully downloaded ' + filename);
        })
        .catch(function(error, filename) {
          console.log(error.message);
          fs.appendFile('error-log.txt', 'An error occured with resource ' + filename + '\n', function (err) {

          });
        })
        .finally(function() {
          workCount++;
          console.log(workCount + '/' + max + ' done.');
        });
      }
    }
  }
};
