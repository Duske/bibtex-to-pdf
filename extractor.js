function isValidUrl(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

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
                  if (!isValidUrl(encodeURI(sourceitem[prop]))) {
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
