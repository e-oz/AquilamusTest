'use strict';
angular.module('galleryApp').service('ArtworksService', function(Config, $http, $q) {
  function pack(item) {
    item.materials = item.url + '/materials';
    if (item.medium && angular.isObject(item.medium)) {
      item.medium = Config.apiUrl + '/mediums/' + item.medium.id;
    }
    return item;
  }
  var ArtworksService = function ArtworksService() {};
  ($traceurRuntime.createClass)(ArtworksService, {
    loadAll: function() {
      var d = $q.defer();
      $http.get(Config.apiUrl + '/artworks').success(function(response) {
        if (!response.urls || !response.urls.length) {
          d.reject(arguments);
          return false;
        }
        var items = [];
        var subRequests = [];
        angular.forEach(response.urls, function(url) {
          var subRequestPromise = $q.defer();
          subRequests.push(subRequestPromise.promise);
          $http.get(url).success(function(item) {
            items.push(item);
            if (item.materials) {
              $http.get(item.materials).success(function(materials) {
                if (!materials.urls || !materials.urls.length) {
                  subRequestPromise.resolve();
                  return false;
                }
                item.materials = [];
                angular.forEach(materials.urls, function(materialUrl) {
                  $http.get(materialUrl).success(function(material) {
                    item.materials.push(material);
                  }).finally(function() {
                    subRequestPromise.resolve();
                  });
                });
              }).error(function() {
                subRequestPromise.resolve();
              });
            } else {
              subRequestPromise.resolve();
            }
          }).error(function() {
            subRequestPromise.reject(arguments);
          });
        });
        if (subRequests.length) {
          $q.all(subRequests).finally(function() {
            d.resolve(items);
          });
        }
      }).error(function() {
        d.reject(arguments);
      });
      return d.promise;
    },
    create: function() {
      var d = $q.defer();
      var emptyObject = {
        'artist': null,
        'description': null,
        'dimension1': 0,
        'dimension2': 0,
        'dimension3': 0,
        'dimensions_in_cm': false,
        'id': null,
        'includes_vat': false,
        'materials': null,
        'medium': null,
        'price': 0,
        'title': null,
        'url': null,
        'vat': null,
        'year': 0
      };
      $http.post(Config.apiUrl + '/artworks', emptyObject).success(function() {
        d.resolve(emptyObject);
      }).finally(function() {
        d.resolve(emptyObject);
      });
      return d.promise;
    },
    update: function(item) {
      if (!item.id) {
        var r = $q.defer();
        r.reject();
        return r.promise;
      }
      var obj = angular.copy(item);
      pack(obj);
      return $http.put(Config.apiUrl + '/artworks/' + item.id, obj);
    },
    addMaterial: function(artworkId, materialId) {
      return $http.post(Config.apiUrl + '/artworks/' + artworkId + '/materials', {url: Config.apiUrl + '/materials/' + materialId});
    },
    deleteMaterial: function(artworkId, materialId) {
      return $http.delete(Config.apiUrl + '/artworks/' + artworkId + '/materials', {url: Config.apiUrl + '/materials/' + materialId});
    },
    remove: function(id) {
      if (id) {
        return $http.delete(Config.apiUrl + '/artworks/' + id);
      } else {
        var r = $q.defer();
        r.reject();
        return r.promise;
      }
    }
  }, {});
  return new ArtworksService();
});
