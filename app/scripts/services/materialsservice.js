'use strict';
angular.module('galleryApp').service('MaterialsService', function($http, $q, Config) {
  var MaterialsService = function MaterialsService() {};
  ($traceurRuntime.createClass)(MaterialsService, {
    loadAll: function() {
      var d = $q.defer();
      var items = [];
      $http.get(Config.apiUrl + '/materials').success(function(response) {
        if (response.urls) {
          var subRequests = [];
          angular.forEach(response.urls, function(url) {
            var subRequestPromise = $q.defer();
            subRequests.push(subRequestPromise.promise);
            $http.get(url).success(function(material) {
              items.push(material);
            }).finally(function() {
              subRequestPromise.resolve();
            });
          });
          $q.all(subRequests).finally(function() {
            d.resolve(items);
          });
        }
      }).error(function() {
        d.reject(arguments);
      });
      return d.promise;
    },
    create: function(material) {
      return $http.post(Config.apiUrl + '/materials', material);
    }
  }, {});
  return new MaterialsService();
});
