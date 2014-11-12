'use strict';

/**
 * @ngdoc service
 * @name galleryApp.MaterialsService
 * @description
 * # MaterialsService
 * Service in the galleryApp.
 */
angular.module('galleryApp')
  .service('MaterialsService', function ($http, $q, Config) {
    class MaterialsService {
      loadAll() {
        var d = $q.defer();
        var items = [];
        $http.get(Config.apiUrl + '/materials').success(function (response) {
          if (response.urls) {
            var subRequests = [];
            angular.forEach(response.urls, function (url) {
              var subRequestPromise = $q.defer();
              subRequests.push(subRequestPromise.promise);
              $http.get(url).success(function (material) {
                items.push(material);
              }).finally(function () {
                subRequestPromise.resolve();
              });
            });
            $q.all(subRequests).finally(function () {
              d.resolve(items);
            });
          }
        }).error(function () {
          d.reject(arguments);
        });
        return d.promise;
      }

      create(material) {
        return $http.post(Config.apiUrl + '/materials', material);
      }
    }
    return new MaterialsService();
  });
