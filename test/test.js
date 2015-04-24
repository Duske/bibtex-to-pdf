var chai = require('chai');
var assert = chai.assert;
var converter = require('../converter');

describe('converter.js', function(){
  describe('composeFileName', function(){
    it('should compose a filename', function(){
      var result = converter.composeFileName(['a', 'b'], 'pdf');
      assert.equal('a-b.pdf', result);
    })
  })
});
