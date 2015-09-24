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
    
    $http.get('/scribble-server/modules/'+$scope.moduleName).success(function(data) {
      $scope.module = data;
    });

    $http.get('/scribble-server/actions/roles/'+$scope.moduleName).success(function(data) {
      $scope.roles = data;
    });

    $scope.saveModule = function() {
      return $http.put('/scribble-server/modules/'+$scope.moduleName, $scope.module)
        .success(function(data, status, headers, config) {
        //if ($scope.moduleName !== data.module) {
        //  $location.path('/modules/'+data.module);
        //} else {
          $scope.verify();
        //}
      });
    };

    $scope.restoreModule = function() {
      $http.get('/scribble-server/modules/'+$scope.moduleName).success(function(data) {
        $scope.module = data;

        $http.get('/scribble-server/actions/roles/'+$scope.moduleName).success(function(data) {
          $scope.roles = data;
        });
      });
    };

    $scope.selectedMarker = function(marker) {
      if ($scope.currentMarker !== undefined) {
        $scope.currentMarker.clear();
      }

      $scope.currentMarker = $scope.doc.markText(
        {line: marker.startLine-1, ch: marker.startPos},
        {line: marker.endLine-1, ch: marker.endPos},
        {className: "styled-background"}
      );
    };

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'scribble'
    };

    $scope.nameOrderProp = 'name';

    $scope.codemirrorLoaded = function(_editor) {
      $scope.editor = _editor;
      $scope.doc = _editor.getDoc();
      
      // Editor part
      _editor.focus();

      // Options
      _editor.setOption('lineWrapping', true);
      _editor.setOption('lineNumbers', true);
      _editor.setOption('mode', 'scribble');
      
      $scope.doc.markClean();
    };

    $scope.verify = function() {
    
      $http.post('/scribble-server/actions/verify/'+$scope.moduleName).success(function(data) {
        $scope.markers = data;

        if ($scope.currentMarker !== undefined) {
          $scope.currentMarker.clear();
        }

        $http.get('/scribble-server/actions/roles/'+$scope.moduleName).success(function(data) {
          $scope.roles = data;
        });
      });
    };
    
    $scope.verify();
  }]);

}
