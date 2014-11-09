'use strict';

describe('Controller: MainCtrl', function () {

  beforeEach(module('galleryApp'));

  var scope, Helper, $httpBackend;

  beforeEach(inject(function ($rootScope, $injector) {
    scope = $rootScope.$new();
    Helper = new TestHelper($injector, scope, 'MainCtrl');
    $httpBackend = Helper.getHttp();
    $httpBackend.expectGET(/\/artworks/);
    $httpBackend.whenGET(/\/artworks/).respond({url: []});
  }));

  it('should initialize scope', function () {
    Helper.createController();
    expect(angular.isArray(scope.items)).toBe(true);
    expect(angular.isObject(scope.data)).toBe(true);
    expect(angular.isFunction(scope.newArtwork)).toBe(true);
  });

  it('should send create request', function () {
    $httpBackend.expectPOST(/\/artworks/);
    $httpBackend.whenPOST(/\/artworks/).respond(500); //exactly as API responds now
    Helper.createController();
    scope.newArtwork();
    scope.$digest();
  });

});
