'use strict';

/**
 * @ngdoc directive
 * @name galleryApp.directive:artwork
 * @description
 * # artwork
 */
angular.module('galleryApp')
  .directive('artwork', function (MediumsService, ArtworksService, $timeout) {
    return {
      templateUrl: 'views/directives/artwork.html',
      restrict:    'AE',
      scope:       {
        artwork:    '=ngModel',
        collection: '='
      },
      link:        function (scope) {
        scope.data = {};
        function loadMediums() {
          scope.mediums = scope.$root.mediums;
          if (scope.mediums.length) {
            if (!scope.artwork.medium) {
              //noinspection JSPrimitiveTypeWrapperUsage
              scope.artwork.medium = scope.mediums[0];
            }
            else {
              if (typeof scope.artwork.medium === 'string') {
                angular.forEach(scope.mediums, function (medium) {
                  if (scope.artwork.medium === medium.url) {
                    scope.artwork.medium = medium;
                    return false;
                  }
                });
              }
            }
          }
        }

        if (!scope.$root.mediums) {
          MediumsService.loadAll().then(function (mediums) {
            scope.$root.mediums = mediums;
            loadMediums();
          });
        }
        else {
          loadMediums();
        }
        scope.remove = function () {
          ArtworksService.remove(scope.artwork.id).finally(function () {
            var i = scope.collection.indexOf(scope.artwork);
            if (i > -1) {
              scope.collection.splice(i, 1);
            }
          });
        };

        scope.$watch('artwork', function () {
          if (!angular.equals(scope.artwork, {})) {
            var changed = angular.copy(scope.artwork);
            $timeout(function () {
              // debounced update
              if (angular.equals(scope.artwork, changed)) {
                console.log('update', scope.artwork.id);
                ArtworksService.update(scope.artwork);
              }
            }, 1000);
          }
        }, true);
      }
    };
  });
