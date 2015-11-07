/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.

/// <reference path="../../includes.ts"/>
/// <reference path="scribbleGlobals.ts"/>
module Scribble {

  export var _module = angular.module(Scribble.pluginName, ["xeditable","ui.codemirror"]);

  var tab = undefined;

  _module.config(["$locationProvider", "$routeProvider", "HawtioNavBuilderProvider",
    ($locationProvider, $routeProvider: ng.route.IRouteProvider, builder: HawtioMainNav.BuilderFactory) => {
    tab = builder.create()
      .id(Scribble.pluginName)
      .title(() => "Modules")
      .href(() => "/modules")
      .build();
    builder.configureRouting($routeProvider, tab);
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/modules', {
        templateUrl: 'plugins/scribble/html/modules.html',
        controller: 'Scribble.ModulesController'
      }).
      when('/modules/:module', {
        templateUrl: 'plugins/scribble/html/module.html',
        controller: 'Scribble.ModuleController'
      }).
      when('/modules/:module/role/:role', {
        templateUrl: 'plugins/scribble/html/role.html',
        controller: 'Scribble.RoleController'
      }).
      when('/modules/:module/trace', {
        templateUrl: 'plugins/scribble/html/traces.html',
        controller: 'Scribble.TracesController'
      }).
      when('/modules/:module/trace/:trace', {
        templateUrl: 'plugins/scribble/html/trace.html',
        controller: 'Scribble.TraceController'
      });
  }]);

  _module.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  });

  _module.run(["HawtioNav", (HawtioNav: HawtioMainNav.Registry) => {
    HawtioNav.add(tab);
    log.debug("loaded");
  }]);


  hawtioPluginLoader.addModule(Scribble.pluginName);
}
