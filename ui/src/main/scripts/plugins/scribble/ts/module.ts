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

  export var ModuleController = _module.controller("Scribble.ModuleController", ["$scope", "$routeParams", "$http", '$location', ($scope, $routeParams, $http, $location) => {

    $scope.moduleName = $routeParams.module;

    $http.get('/scribble-server/protocols/'+$scope.moduleName).success(function(data) {
      $scope.protocols = data;
    });

    $scope.nameOrderProp = 'name';

    $scope.master = {};

    $scope.create = function(newprotocol) {
      var protocolDefn = { definition: "module "+$scope.moduleName+
               ";\r\n\r\nglobal protocol "+newprotocol.protocol+"() {\r\n}\r\n" };
      		
      $http.put('/scribble-server/protocols/'+$scope.moduleName+'/'+newprotocol.protocol, protocolDefn).success(function(data) {
        $location.path('/protocols/'+$scope.moduleName+'/'+newprotocol.protocol);
      });
    };

    $scope.reset = function(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
      $scope.newprotocol = angular.copy($scope.master);
    };

    $scope.reset();
  }]);

}
