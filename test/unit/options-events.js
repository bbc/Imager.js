'use strict';

/* globals describe, it, beforeEach, afterEach, sinon, Imager */

describe('Imager.js Events', function(){
  describe('Constructor Options', function(){
    var sandbox;

    beforeEach(function(){
      sandbox = sinon.sandbox.create();
    });

    afterEach(function(){
      sandbox.restore();
    });

    it('should register the relevant events by default', function(){
      var imgr = new Imager();

      expect(imgr.onResize).to.equal(true);
      expect(imgr.lazyload).to.equal(false);
    });

    it('should handle onResize only', function(done){
      var imgr = new Imager({ onResize: true, lazyload: false });
      var resizeSpy = sandbox.spy(imgr, 'registerResizeEvent');
      var scrollSpy = sandbox.spy(imgr, 'registerScrollEvent');

      expect(resizeSpy.called).to.equal(false);
      expect(scrollSpy.called).to.equal(false);

      setTimeout(function(){
        expect(resizeSpy.callCount).to.equal(1);
        expect(scrollSpy.callCount).to.equal(0);

        done();
      }, 100);
    });

    it('should handle onScroll only', function(done){
      var imgr = new Imager({ onResize: false, lazyload: true });
      var resizeSpy = sandbox.spy(imgr, 'registerResizeEvent');
      var scrollSpy = sandbox.spy(imgr, 'registerScrollEvent');

      expect(resizeSpy.called).to.equal(false);
      expect(scrollSpy.called).to.equal(false);

      setTimeout(function(){
        expect(resizeSpy.callCount).to.equal(0);
        expect(scrollSpy.callCount).to.equal(1);

        done();
      }, 100);
    });


    it('should run onImagesReplaced callback after images have been modified', function(done){
      var imgr = new Imager();
      var replaceImagesSpy = sandbox.spy(imgr, 'onImagesReplaced');

      expect(replaceImagesSpy.called).to.equal(false);

      setTimeout(function(){
        expect(replaceImagesSpy.callCount).to.equal(1);
        done();
      }, 100);
    });

  });
});