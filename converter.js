const wkhtmltopdfRaw = require('wkhtmltopdf');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const request = require('request-promise');
const filenameUtility = require('./filename-utility');
const chalk = require('chalk');
const filePath = 'pdf/';
const wkhtmltopdf = Promise.promisify(wkhtmltopdfRaw);

const errorMessage = chalk.bold.white.bgRed;
const infoMessage = chalk.blue.bgWhite;
const successMessage = chalk.black.bold.bgGreen;

/**
 * Downloads a webpage and converts it to a pdf file
 * @param  {String} url      URL of the target page
 * @param  {String} filename filename of the pdf file
 * @return {Promise}
 */
function convertWebpageToPdf(url, filename) {
  const output = path.resolve(filePath, filename);
  return wkhtmltopdf(url, {
    output: path.resolve(filePath, filename),
    javascriptDelay: 2000
  })
  .then(function() {
    console.log(`Successfully downloaded and converted file ${url}`);
    return output;
  })
  .catch(function(error) {
    console.log(errorMessage(`An error occured while converting URL ${url}`));
    throw Error(error);
  });
}

/**
 * Downloads a file from a webpage and writes it to disk
 * @param  {String} url      URL of the target page
 * @param  {String} filename filename of the file
 * @return {Promise}
 */
function downloadFile(url, filename) {
  const output = path.resolve(filePath, filename);
  return request(url, {
    encoding: null
  })
  .then(function(buffer) {
    return fs.writeFile(output, buffer);
  })
  .then(function() {
    console.log(`Successfully downloaded file ${url}`);
  })
  .catch(function (error) {
    console.log(errorMessage(`An error occured while downloading or writing URL ${url}, ${error}`));
    throw Error(error);
  });
}

/**
 * Convert a sourceItem to a simple download object by composing filename and urlItems
 * @param  {Object} sourceItem
 * @return {Object}
 */
function convertSourceItemToDownloadItem(sourceItem) {
  return {
    filename: filenameUtility.composeFileName([sourceItem.author, sourceItem.title], 'pdf'),
    url: sourceItem.url
  }
}

module.exports = {

  /**
   * Processes an array of urlitems and downloads and convert the containg URLs to pdf files
   * @param  {array} urlItems List of urlItems containg url, author and TITLE
   * @return {void}          [description]
   */
  convertBibtexJsonToPdf: function(urlItems) {
    var urlItemsCount = urlItems.length;
    console.log(infoMessage('Start converting, this may take some time ...'));
    var operations = urlItems
    .map(convertSourceItemToDownloadItem)
    .map(function(item, index) {
      console.log(infoMessage('Processing item %s out of %s'), index + 1, urlItemsCount);
      if(filenameUtility.isPdfFile(item.url)) {
        return downloadFile(item.url, item.filename);
      } else {
        return convertWebpageToPdf(item.url, item.filename);
      }
    });

    Promise.all(operations)
      .then(function() {
        console.log(successMessage('Successfully processed all items'));
      })
      .catch(function(error) {
        console.log(errorMessage(error));
      });
  }
};
