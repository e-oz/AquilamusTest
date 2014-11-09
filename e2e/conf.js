'use strict';

exports.config = {
  allScriptsTimeout: 11000,
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl:'http://localhost:9000/',
  specs: ['scenarios/*.js']
};
