var chai = require('chai');
var assert = chai.assert;
var converter = require('../converter');
var extractor = require('../extractor');

describe('converter.js', function(){
  describe('composeFileName', function(){
    it('should compose a filename', function(){
      var result = converter.composeFileName(['a', 'b'], 'pdf');
      assert.equal('a-b.pdf', result);
    });
  });
});

describe('extractor.js', function(){
  describe('getExtractedSourceList', function(){
    var bibtextObject = {
      test1: {
        'URL': 'http://test.com',
        'AUTHOR': 'testauthor',
        'TITLE': 'testtitle'
      },
      noUrlProperty: {
        'AUTHOR': 'testauthor2',
        'TITLE': 'testtitle2'
      },
      inValidUrl: {
        'URL': 'http:/testcom',
        'AUTHOR': 'testauthor',
        'TITLE': 'testtitle'
      }
    };
    var bibtextArray = [
      {
        url: 'http://test.com',
        title: 'testtitle',
        author: 'testauthor'
      }
    ];
    it('should extract the sources', function(){
      var result = extractor.getExtractedSourceList(bibtextObject);
      assert.deepEqual(bibtextArray, result);
    });
    it('should return an empty array if no object is supplied', function(){
      var result1 = extractor.getExtractedSourceList(null);
      assert.deepEqual([], result1);
    });
  });
});