'use strict';

describe('RefluxReactRouterExampleApp', function () {
  var React = require('react/addons');
  var RefluxReactRouterExampleApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    RefluxReactRouterExampleApp = require('components/RefluxReactRouterExampleApp.js');
    component = React.createElement(RefluxReactRouterExampleApp);
  });

  it('should create a new instance of RefluxReactRouterExampleApp', function () {
    expect(component).toBeDefined();
  });
});
