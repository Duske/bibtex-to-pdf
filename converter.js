var wkhtmltopdfRaw = require('wkhtmltopdf');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var request = require('request');
var filenameUtility = require('./filename-utility');
const filePath = 'pdf/';
const wkhtmltopdf = Promise.promisify(wkhtmltopdfRaw);

function convertWebpageToPdf(url, filename) {
  const output = path.resolve(filePath, filename);
  return wkhtmltopdf(url, {
    output: path.resolve(filePath, filename),
    javascriptDelay: 2000
  })
  .then(function() {
    return output;
  })
  .catch(function(error) {
    console.log(`An error occured while converting URL ${url}`);
    throw Error(error);
  });
}

function downloadFile(url, filename) {
  // return request(url, {
  //   encoding: null
  // }).then
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
        return convertWebpageToPdf(urlItems[index].url, tempFileName)
        .then(function(filename) {
          console.log(`Successfully downloaded ${filename}`);
        });
      }
    });

    Promise.all(operations)
      .then(function() {
        console.log('Successfully processed all items');
      })
      .catch(function(error) {
        console.log('There have been errors, please see error-log.txt');
        console.log(error);
      });
  }
};
