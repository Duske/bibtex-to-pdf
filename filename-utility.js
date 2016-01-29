function isPdfFile(url) {
  return (url.split('.pdf').length > 1);
}

function cleanSlashes(text) {
  return text.replace(/\//g, '-');
}

function composeFileName(nameParts, filetype) {
  return (cleanSlashes(nameParts.reduce(function(prev, current) {
    return prev + '-' + current;
  }) + '.' + filetype));
}

module.exports = {
  isPdfFile: isPdfFile,
  composeFileName: composeFileName
};
