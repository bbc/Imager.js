'use strict';

function loadFixtures(location){
  var fixtures = document.createElement('div');
  fixtures.id = 'karma-fixtures';
  fixtures.innerHTML = window.__html__['test/fixtures/'+location+'.html'];
  document.body.appendChild(fixtures);

  return fixtures;
}

function cleanFixtures(fixtures){
  // workaround for HTMLElement not existing in IE8
  if (fixtures !== undefined && fixtures.nodeType === 1) {
    document.body.removeChild(fixtures);
  }
}