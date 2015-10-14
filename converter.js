'use strict';
var wkhtmltopdf = require('wkhtmltopdf');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var request = require('request');
var filePath = 'pdf/';

function writePdf(url, filename) {
  return new Promise(function(resolve, reject) {
    wkhtmltopdf(url,
      {
        output: filePath + filename,
        javascriptDelay: 2000
      },
      function (code, signal) {
        //Ignore code QFont::setPixelSize: Pixel size <= 0 (0)
        if(signal !== 0 && code && code.message !== 'QFont::setPixelSize: Pixel size <= 0 (0)') {
          reject(code);
        } else {
          resolve(filename);
        }
      });
  });
}

function isPdfFile(url) {
  return (url.split('.pdf').length > 1);
}

function cleanSlashes(text) {
  return text.replace(/\//g, '-');
}

function downloadFile(url, filename) {
  return new Promise(function(resolve) {
    request(url)
      .pipe(fs.createWriteStream(filePath + filename))
      .on('finish', function() {
        resolve(filename);
      });
  });
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
          console.log('Successfully downloaded pdf ' + filename);
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
