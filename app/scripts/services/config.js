'use strict';

/**
 * @ngdoc service
 * @name galleryApp.Config
 * @description
 * # Config
 * Service in the galleryApp.
 */
angular.module('galleryApp')
  .service('Config', function Config() {
    return {
      apiUrl: 'http://54.77.217.175'
    };
  });
