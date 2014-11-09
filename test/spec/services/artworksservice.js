'use strict';

describe('Service: ArtworksService', function () {

  // load the service's module
  beforeEach(module('galleryApp'));

  // instantiate service
  var ArtworksService;
  beforeEach(inject(function (_ArtworksService_) {
    ArtworksService = _ArtworksService_;
  }));

  it('should do something', function () {
    // here should be checks for REST methods, but it's better to do in e2e tests
    expect(!!ArtworksService).toBe(true);
  });

});
