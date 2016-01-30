var validUrl = require('valid-url');

/**
 * Checks if an object has a URL property
 * @param  {Object}  item
 * @return {Boolean}
 */
function hasURLProperty(item) {
  return item.hasOwnProperty('URL');
}

/**
 * Checks if an object has a valid URL property
 * @param  {Object}  item [description]
 * @return {Boolean}      [description]
 */
function hasValidURL(item) {
  const url = item['URL'];
  if (validUrl.is_web_uri(encodeURI(url))) {
    return true;
  } else {
    throw new Error(`${url} is not a valid URL`);
  }
}

/**
 * Creates an sourceitem object by selecting specific properties
 * @param  {Object} item A child object from a parsed bib file
 * @return {Object}
 */
function createSourceItem(item) {
  return {
    url: item['URL'],
    title: item['TITLE'],
    author: item['AUTHOR']
  };
}

module.exports = {
  /**
   * Converts a bibtex-Object to an array of sourceitems (an object containing url, title and author)
   * @param  {Object} bibtextObject The parsed .bib file as an Object
   * @return {Array<Object>} List of sourceitem elements
   */
  getExtractedSourceList: function (bibtextObject) {
    if(!bibtextObject) {
      return [];
    }
    return Object.keys(bibtextObject)
      .map(function(item) {
        return bibtextObject[item];
      })
      .filter(hasURLProperty)
      .filter(hasValidURL)
      .map(createSourceItem);
  }
};
