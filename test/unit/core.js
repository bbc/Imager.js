'use strict';

describe('Imager.js', function(){
  describe('constructor', function(){

    it('should initialise without arguments', function(done){
      var imgr = new Imager();

      setTimeout(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.cache).to.be.empty;

        done();
      }, 100);
    });

  });
});