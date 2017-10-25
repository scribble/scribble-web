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

  export var TracesController = _module.controller("Scribble.TracesController", ["$scope", "$routeParams", "$http", '$location', ($scope, $routeParams, $http, $location) => {

    $scope.moduleName = $routeParams.module;

    $scope.running = 0;
    $scope.failed = 0;
    $scope.successful = 0;

    $http.get('/scribble-server/traces/'+$scope.moduleName).success(function(data) {
      $scope.traces = [];
      
      for (var i = 0; i < data.length; i++) {
        var trace = {
          name: data[i],
          issues: undefined
        };
        $scope.traces.push(trace);
        
        $scope.simulate(trace);
      }
    });
    
    $http.get('/scribble-server/actions/roles/'+$scope.moduleName).success(function(data) {
      $scope.roles = data;
    });

    $scope.simulate = function(trace) {
      $scope.running = $scope.running + 1;

      $http.post('/scribble-server/actions/simulate/'+$scope.moduleName+'/'+trace.name).success(function(data) {
        trace.issues = data;

        $scope.running = $scope.running - 1;
        
        if (data.length > 0) {
          $scope.failed = $scope.failed + 1;
        } else {
          $scope.successful = $scope.successful + 1;
        }
      });
    };

    $scope.nameOrderProp = 'name';

    $scope.newTraceName = "";

    $scope.addTrace = function() {
      var steps = [];

      var step = {
        type: "MessageTransfer",
        message: {
          operator: "name",
          types: ["type"],
          values: [""]
        },
        fromRole: "FromRole",
        toRoles: ["ToRole"]
      };
      
      steps.push(step);

      var content = {
        data: JSON.stringify(steps, null, 2)
      };

      $http.put('/scribble-server/traces/'+$scope.moduleName+'/'+$scope.newTraceName, content).success(function(data) {
        $location.path('/modules/'+$scope.moduleName+'/trace/'+$scope.newTraceName);
      });
    };

    $scope.deleteTrace = function(trace) {
      if (confirm('Are you sure you want to delete trace \"'+trace.name+'\"?')) {
        $http.delete('/scribble-server/traces/'+$scope.moduleName+'/'+trace.name).success(function(data) {
          console.log('Deleted trace: '+trace.name);
          $scope.traces.remove(trace);
        });
      }
    };

  }]);

}
