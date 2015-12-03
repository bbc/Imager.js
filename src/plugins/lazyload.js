'use strict';

export function register (imgr) {
  imgr.scrolled = false;

  imgr.interval = window.setInterval(() => imgr.scrollCheck(), imgr.scrollDelay);

  window.addEventListener('scroll', () => {
    imgr.scrolled = true
  });

  window.addEventListener('resize', () => {
    imgr.viewportHeight = document.documentElement.clientHeight;
    imgr.scrolled = true;
  });

  // to execute once ready
  return () => {
    imgr.scrolled = true;
    imgr.scrollCheck();
  };
}
