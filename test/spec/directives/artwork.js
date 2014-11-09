'use strict';

describe('Directive: artwork', function () {

  // load the directive's module
  beforeEach(module('galleryApp'));
  beforeEach(module('views/directives/artwork.html'));

  var element, scope, $httpBackend;

  beforeEach(inject(function ($rootScope, $injector, $compile) {
    scope = $rootScope.$new();
    var Helper = new TestHelper($injector, scope);
    $httpBackend = Helper.getHttp();
    $httpBackend.expectGET(/mediums/);
    $httpBackend.whenGET(/mediums/).respond({});
    scope.model = {};
    element = angular.element('<artwork ng-model="model"></artwork>');
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should add md-card', function () {
    var html = element.html();
    expect(html).toContain('</md-card>');
  });
});
