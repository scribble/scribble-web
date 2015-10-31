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

/// <reference path="scribblePlugin.ts"/>
module Scribble {

  export var ModulesController = _module.controller("Scribble.ModulesController", ["$scope", "$http", '$location', ($scope, $http, $location) => {

    $http.get('/scribble-server/modules').success(function(data) {
      $scope.modules = data;
    });

    $scope.nameOrderProp = 'name';

    $scope.newModuleName = "";

    $scope.addModule = function() {
      var moduleDefn = { data: "module "+$scope.newModuleName+
              ";\r\n\r\nglobal protocol ProtocolName(role A, role B) {\r\n}\r\n" };
      		
      $http.put('/scribble-server/modules/'+$scope.newModuleName, moduleDefn).success(function(data) {
        $location.path('/modules/'+$scope.newModuleName);
      });
    };

    $scope.deleteModule = function(name) {
      if (confirm('Are you sure you want to delete module \"'+name+'\"?')) {
        $http.delete('/scribble-server/modules/'+name).success(function(data) {
          console.log('Deleted module: '+name);
          $scope.modules.remove(name);
        });
      }
    };

  }]);

}
