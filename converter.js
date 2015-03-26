var fs = require('fs');
var wkhtmltopdf = require('wkhtmltopdf');
var Q = require('q');

function writePdf(url, filename) {
  var deferred = Q.defer();
  wkhtmltopdf(url,
    {
      output: 'pdf/'+filename,
      javascriptDelay: 800
    },
    function (code, signal) {
      //Ignore code QFont::setPixelSize: Pixel size <= 0 (0)
      if(signal != 0 && code && code.message !== 'QFont::setPixelSize: Pixel size <= 0 (0)') {
        deferred.reject(code, filename);
      } else {
        deferred.resolve(filename);
      }
    });
    return deferred.promise;
}

function isDownloadableContent(url) {
  return !(url.split('.pdf').length > 1);
}

function cleanSlashes(text) {
  return text.replace(/\//g, "-");
}


module.exports = {

  convertBibtexJsonToPdf: function(urls) {
    var workCount = 0;
    var max = urls.length;
    for (var i = 0; i < max; i++) {
      if(!isDownloadableContent(urls[i].url)) {
        workCount++;
        console.log(urls[i].url+ ' cannot be converted because of an incompatible filetype.')
        fs.appendFile('error-log.txt', "This resource could not be converted. Incompatible filetype:"+urls[i].url+"\n", function (err) {

        });
      }
      else {
        writePdf(urls[i].url, cleanSlashes(urls[i].author)+'-'+cleanSlashes(urls[i].title)+'.pdf')
        .then(function(filename) {
          console.log("Successfully downloaded "+filename);
        })
        .catch(function(error, filename) {
          console.log(error.message);
          fs.appendFile('error-log.txt', "An error occured with resource "+filename+"\n", function (err) {

          });
        })
        .finally(function() {
          workCount++;
          console.log(workCount+"/"+max+" done.");
        });
      }
    };
  }
};
