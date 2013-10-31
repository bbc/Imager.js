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

      expect(imgr.onResize).to.be.true;
      expect(imgr.lazyload).to.be.false;
    });

    it('should handle onResize only', function(done){
      var imgr = new Imager({ onResize: true, lazyload: false });
      var resizeSpy = sandbox.spy(imgr, 'registerResizeEvent');
      var scrollSpy = sandbox.spy(imgr, 'registerScrollEvent');

      expect(resizeSpy.called).to.be.false;
      expect(scrollSpy.called).to.be.false;

      setTimeout(function(){
        expect(resizeSpy.callCount).to.eq(1);
        expect(scrollSpy.callCount).to.eq(0);

        done();
      }, 100);
    });

    it('should handle onScroll only', function(done){
      var imgr = new Imager({ onResize: false, lazyload: true });
      var resizeSpy = sandbox.spy(imgr, 'registerResizeEvent');
      var scrollSpy = sandbox.spy(imgr, 'registerScrollEvent');

      expect(resizeSpy.called).to.be.false;
      expect(scrollSpy.called).to.be.false;

      setTimeout(function(){
        expect(resizeSpy.callCount).to.eq(0);
        expect(scrollSpy.callCount).to.eq(1);

        done();
      }, 100);
    });

  });
});