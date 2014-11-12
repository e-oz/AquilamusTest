'use strict';
angular.module('galleryApp').service('MediumsService', function(Config, $http, $q) {
  var MediumsService = function MediumsService() {};
  ($traceurRuntime.createClass)(MediumsService, {loadAll: function() {
      var d = $q.defer();
      var items = [];
      $http.get(Config.apiUrl + '/mediums').success(function(response) {
        if (response.urls) {
          var subRequests = [];
          angular.forEach(response.urls, function(url) {
            var subRequestPromise = $q.defer();
            subRequests.push(subRequestPromise.promise);
            $http.get(url).success(function(medium) {
              items.push(medium);
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
    }}, {});
  return new MediumsService();
});
