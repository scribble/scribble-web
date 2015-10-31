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

    $scope.master = {};

    $scope.create = function(newmodule) {
      var moduleDefn = { data: "module "+newmodule.name+
              ";\r\n\r\nglobal protocol ProtocolName(role A, role B) {\r\n}\r\n" };
      		
      $http.put('/scribble-server/modules/'+newmodule.name, moduleDefn).success(function(data) {
        $location.path('/modules/'+newmodule.name);
      });
    };

    $scope.reset = function(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
      $scope.newmodule = angular.copy($scope.master);
    };

    $scope.reset();
  }]);

}
