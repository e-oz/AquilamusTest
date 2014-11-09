'use strict';

function TestHelper($injector, scope, controllerName) {
  this.$injector = $injector;
  this.scope = scope;
  this.controllerName = controllerName;
}

TestHelper.prototype.getHttp = function (templatesReg, templatesResponse) {
  var $httpBackend = this.$injector.get('$httpBackend');
  templatesReg = templatesReg || /views\//;
  templatesResponse = templatesResponse || 'template';
  $httpBackend.whenGET(templatesReg).respond(templatesResponse);
  $httpBackend.expectGET(templatesReg);
  return $httpBackend;
};

TestHelper.prototype.createController = function (scope, name) {
  name = name || this.controllerName;
  scope = scope || this.scope;
  var $controller = this.$injector.get('$controller');
  if (((typeof scope) === 'object') && scope.hasOwnProperty('$scope')) {
    $controller(name, scope);
    if (scope['$scope']) {
      scope['$scope'].$digest();
    }
  }
  else {
    $controller(name, {'$scope': scope});
    scope.$digest();
  }
};
