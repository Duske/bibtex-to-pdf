var chai = require('chai');
var assert = chai.assert;
var should = require('chai').should();
var converter = require('../converter');
var filenameUtility = require('../filename-utility');

describe('filename-utility.js', function(){
  describe('composeFileName', function(){
    it('should compose a filename', function(){
      var result = filenameUtility.composeFileName(['a', 'b'], 'pdf');
      assert.equal('a-b.pdf', result);
    });
  });
});
