'use strict';

/* jshint node:true */

module.exports = function (config) {
  var isCI = (Boolean(process.env.CI) && Boolean(process.env.SAUCE_ACCESS_KEY)) === true;

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'mocha', 'expect', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/components-jquery/jquery.min.js',
      'test/fixtures/jquery-noconflict.js',
      'test/fixtures/*.html',
      'Imager.js',
      'test/*.js',
      'test/unit/**/*.js',
      { 'pattern': 'Demo - Grunt/Assets/Images/**/*.jpg', 'included': false, 'served': true },
      { 'pattern': 'test/fixtures/**/*.jpg', 'included': false, 'served': true },
      { 'pattern': 'test/fixtures/oldformat/*', 'included': false, 'served': true }
    ],

    preprocessors: {
      '**/*.html': ['html2js']
    },

    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    browsers: isCI ? ['SauceIE8', 'SauceiOS6', 'SauceAndroid', 'SauceFirefox', 'SauceSafari5'] : ['PhantomJSCustom', 'Firefox'],

    sauceLabs: {
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || null,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      testName: 'Imager.js',
      startConnect: false
    },

    customLaunchers: {
      'PhantomJSCustom': {
        base: 'PhantomJS',
        options: {
          viewportSize: {
            width: 1024,
            height: 768
          }
        }
      },
      SauceIE6: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '6'
      },
      SauceIE7: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '7'
      },
      SauceIE8: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '8'
      },
      SauceIE9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9'
      },
      SauceIE10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10'
      },
      SauceIE11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      },
      SauceFirefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 7',
        version: '21'
      },
      SauceAndroid: {
        base: 'SauceLabs',
        browserName: 'android',
        platform: 'Linux',
        version: '4.0'
      },
      SauceiOS7: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.9',
        version: '7.1'
      },
      SauceiOS6: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.8',
        version: '6.1'
      },
      SauceiOS5: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.8',
        version: '5.1'
      },
      SauceiOS4: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.6',
        version: '4.3'
      },
      SauceSafari5: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.6'
      }
    },


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
