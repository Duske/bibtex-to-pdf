var validUrl = require('valid-url');

module.exports = {

  getExtractedSourceList: function (bibtextObject) {
    if(!bibtextObject) {
      return false;
    }
    var urls = [];
    for (var key in bibtextObject) {
       if (bibtextObject.hasOwnProperty(key)) {
          var sourceitem = bibtextObject[key];
          for (var prop in sourceitem) {
             if (sourceitem.hasOwnProperty(prop)) {
                if (prop === "URL") {
                  if (!validUrl.is_web_uri(encodeURI(sourceitem[prop]))) {
                    console.log("Invalid URL at item "+sourceitem[prop]);
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
    }
    return urls;
  }
};
