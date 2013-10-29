'use strict';

describe('Imager.js', function(){
  describe('constructor', function(){
    var fixtures;

    beforeEach(function(){
      fixtures = window.__html__['test/fixtures/regular.html'];
    });

    it('should initialise without arguments', function(done){
      var imgr = new Imager();

      setTimeout(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.cache).to.be.empty;

        done();
      }, 100);
    });

    it('should target elements with a string as first argument', function(done){
      var imgr = new Imager('#main .delayed-image-load');

      setTimeout(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.cache).to.have.length.of(3);

        done();
      }, 100);
    });

    it('should target elements contained in a static NodeList collection', function(done){
      var imgr = new Imager(fixtures.querySelectorAll('#main .delayed-image-load'));

      setTimeout(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.cache).to.have.length.of(3);

        done();
      }, 100);
    });

    it('should target elements contained in a live NodeList collection', function(done){
      var imgr = new Imager(fixtures.getElementById('main').getElementsByClassName('delayed-image-load'));

      setTimeout(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.cache).to.have.length.of(3);

        done();
      }, 100);
    });

    it('should target elements contained in a third-party library collection', function(done){
      var imgr = new Imager($('#main .delayed-image-load', fixtures));

      setTimeout(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.cache).to.have.length.of(3);

        done();
      }, 100);
    });

  });
});