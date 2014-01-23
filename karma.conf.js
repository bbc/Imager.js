// Karma configuration
// Generated on Tue Oct 29 2013 11:45:20 GMT+0000 (GMT)

module.exports = function (config) {
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
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJSCustom', 'Firefox'],

    sauceLabs: {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      build: process.env.TRAVIS_JOB_NUMBER || 'local tunnel',
      testName: 'Imager.js',
      startConnect: true
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
      SauceIE8: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '8'
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
      SauceiOS: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.8',
        version: '5.1'
      },
      SauceSafari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.8'
      }
    },


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
