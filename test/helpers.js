'use strict';

function loadFixtures(location){
  var fixtures = document.createElement('div');
  fixtures.id = 'karma-fixtures';
  fixtures.innerHTML = window.__html__['test/fixtures/'+location+'.html'];
  document.body.appendChild(fixtures);

  return fixtures;
}

/**
 * Runs a bit of code after an Animation Frame. Supposedly.
 *
 * @param {Function} fn
 * @returns {Number} Timeout ID
 */
function runAfterAnimationFrame(fn){
  return setTimeout(fn, 20);
}