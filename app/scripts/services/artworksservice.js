'use strict';

/**
 * @ngdoc service
 * @name galleryApp.ArtworksService
 * @description
 * # ArtworksService
 * Service in the galleryApp.
 */
angular.module('galleryApp')
  .service('ArtworksService', function ArtworksService(Config, $http, $q) {
    function pack(item) {
      item.materials = item.url + '/materials';
      if (item.medium && angular.isObject(item.medium)) {
        item.medium = Config.apiUrl + '/mediums/' + item.medium.id;
      }
      return item;
    }

    //noinspection UnnecessaryLocalVariableJS
    var service = {
      loadAll:        function () {
        var d = $q.defer();
        $http.get(Config.apiUrl + '/artworks')
          .success(function (response) {
            if (!response.urls || !response.urls.length) {
              d.reject(arguments);
              return false;
            }
            var items = [];
            var subRequests = [];
            // it's very non-performant approach, but API forces us to do sub-request for each item
            angular.forEach(response.urls, function (url) {
              var subRequestPromise = $q.defer();
              subRequests.push(subRequestPromise.promise);
              $http.get(url).success(function (item) {
                items.push(item);
                // I almost feel pain when doing it, but... API is awful
                if (item.materials) {
                  // request just to get list of materials...
                  $http.get(item.materials).success(function (materials) {
                    if (!materials.urls || !materials.urls.length) {
                      subRequestPromise.resolve();
                      return false;
                    }
                    item.materials = [];
                    angular.forEach(materials.urls, function (materialUrl) {
                      // expand URLs, which we can expand
                      $http.get(materialUrl).success(function (material) {
                        item.materials.push(material);
                      }).finally(function () {
                        // we will not reject whole item if one of materials was not expanded
                        subRequestPromise.resolve();
                      });
                    });
                  }).error(function () {
                    subRequestPromise.resolve();
                  });
                }
                else {
                  subRequestPromise.resolve();
                }
              }).error(function () {
                subRequestPromise.reject(arguments);
              });
            });
            if (subRequests.length) {
              // when all sub-requests responded - resolve promise (even if some of them were not found)
              $q.all(subRequests).finally(function () {
                d.resolve(items);
              });
            }
          })
          .error(function () {
            d.reject(arguments);
          });
        return d.promise;
      },
      create:         function () {
        var d = $q.defer();
        var emptyObject = {
          'artist':           '',
          'description':      '',
          'dimension1':       0,
          'dimension2':       0,
          'dimension3':       0,
          'dimensions_in_cm': false,
          'id':               9999,
          'includes_vat':     false,
          'materials':        'http://54.77.217.175/artworks/9999/materials',
          'medium':           'http://54.77.217.175/mediums/1',
          'price':            0,
          'title':            'art',
          'url':              '',
          'vat':              0,
          'year':             0
        };
        $http.post(Config.apiUrl + '/artworks').success(function () {
          // API returns 500 error so I can't check what will be returned
          d.resolve(emptyObject);
        }).finally(function () {
          // return empty object just as workaround while API method doesn't work
          d.resolve(emptyObject);
        });
        return d.promise;
      },
      update:         function (item) {
        if (!item.id) {
          var r = $q.defer();
          r.reject();
          return r.promise;
        }
        var obj = angular.copy(item);
        pack(obj);
        return $http.put(Config.apiUrl + '/artworks/' + item.id, obj);
      },
      addMaterial:    function (artworkId, materialId) {
        return $http.post(Config.apiUrl + '/artworks/' + artworkId + '/materials',
          {url: Config.apiUrl + '/materials/' + materialId});
      },
      deleteMaterial: function (artworkId, materialId) {
        return $http.delete(Config.apiUrl + '/artworks/' + artworkId + '/materials',
          {url: Config.apiUrl + '/materials/' + materialId});
      },
      remove:         function (id) {
        if (id) {
          return $http.delete(Config.apiUrl + '/artworks/' + id);
        }
        else {
          var r = $q.defer();
          r.reject();
          return r.promise;
        }
      }
    };
    return service;
  });
