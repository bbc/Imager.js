// Karma configuration

module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: [
      'mocha',
      'chai'
    ],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-mocha',
      'karma-chai'
    ],
    files: [
      'src/imager.js',
      'src/replacers/*.js',
      'test/**/*.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: process.env.TRAVIS ? ['Phantom'] : ['Chrome', 'Firefox', 'Safari'],
    captureTimeout: 5000
  });
};