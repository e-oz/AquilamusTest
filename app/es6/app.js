/**
 * @ngdoc overview
 * @name galleryApp
 * @description
 * # galleryApp
 *
 * Main module of the application.
 */
angular
  .module('galleryApp', [
    'ngMaterial',
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngAria'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.timeout = 7000;
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller:  'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
