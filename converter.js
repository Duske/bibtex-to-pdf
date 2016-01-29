var wkhtmltopdf = require('wkhtmltopdf');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var request = require('request');
var filenameUtility = require('./filename-utility');
const filePath = 'pdf/';

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

  convertBibtexJsonToPdf: function(urlItems) {
    var tempFileName;
    var that = this;
    console.log('Start converting, this may take some time ...');

    var operations = urlItems.map(function(url, index) {
      tempFileName = filenameUtility.composeFileName([urlItems[index].author, urlItems[index].title], 'pdf');
      console.log('Processing item %s out of %s', (index + 1), urlItems.length);
      if(filenameUtility.isPdfFile(urlItems[index].url)) {
        console.log('Start downloading ' + urlItems[index].title);
        return downloadFile(urlItems[index].url, tempFileName);
      } else {
        console.log('Start converting ' + urlItems[index].title)
        return writePdf(urlItems[index].url, tempFileName);
      }
    });

    Promise.all(operations)
      .then(function() {
        console.log('Successfully processed all items');
      })
      .catch(function() {
        console.log('There have been errors, please see error-log.txt');
      });
  }
};
