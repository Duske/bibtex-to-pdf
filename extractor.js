'use strict';
var validUrl = require('valid-url');

module.exports = {

  getExtractedSourceList: function (bibtextObject) {
    var urls = [],
        sourceitem;
    if(!bibtextObject) {
      return urls;
    }
    for (var key in bibtextObject) {
       if (bibtextObject.hasOwnProperty(key)) {
          sourceitem = bibtextObject[key];
          for (var prop in sourceitem) {
             if (sourceitem.hasOwnProperty(prop) && prop === 'URL') {
                if (!validUrl.is_web_uri(encodeURI(sourceitem[prop]))) {
                  console.log('Invalid URL at item ' + sourceitem[prop]);
                  break;
                }
                urls.push({
                  url: sourceitem[prop],
                  title: sourceitem['TITLE'],
                  author: sourceitem['AUTHOR']
                });
             }
          }
       }
    }
    return urls;
  }
};
