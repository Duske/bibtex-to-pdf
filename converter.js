'use strict';
var wkhtmltopdf = require('wkhtmltopdf');
var Q = require('q');
var fs = require('fs');
var request = require('request');
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

function downloadFile(url, filename) {
  var deferred = Q.defer();
  var file = fs.createWriteStream(filePath + filename);
  request
    .get(url)
    .on('response', function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(function() {
          deferred.resolve(filename);
        });
      });
    })
    .on('error', function(err) {
      fs.unlink(filename);
      deferred.reject(err, filename);
    });
  return deferred.promise;
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
    var tempFileName;
    for (var i = 0; i < max; i++) {
      tempFileName = this.composeFileName([urls[i].author, urls[i].title], 'pdf');
      if(isPdfFile(urls[i].url)) {
        downloadFile(urls[i].url, tempFileName)
        .then(function(filename) {
          console.log('Successfully downloaded ' + filename);
        })
        .catch(function(error, filename) {
          console.log(error.message);
          fs.appendFile('error-log.txt', 'An error occured while downloading resource ' + filename + '\n', function () {
          });
        })
        .finally(function() {
          workCount++;
          console.log(workCount + '/' + max + ' done.');
        });
      }
      else {
        writePdf(urls[i].url, tempFileName)
        .then(function(filename) {
          console.log('Successfully downloaded and converted' + filename);
        })
        .catch(function(error, filename) {
          console.log(error.message);
          fs.appendFile('error-log.txt', 'An error occured with converting resource ' + filename + '\n');
        })
        .finally(function() {
          workCount++;
          console.log(workCount + '/' + max + ' done.');
        });
      }
    }
  }
};
