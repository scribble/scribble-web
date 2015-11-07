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

  export var TraceController = _module.controller("Scribble.TraceController", ["$scope", "$routeParams", "$http", '$location', ($scope, $routeParams, $http, $location) => {

    $scope.moduleName = $routeParams.module;
    $scope.traceName = $routeParams.trace;
    $scope.dirty = false;
    $scope.loading = true;
    
    $scope.trace = {
      description: "",
      data: ""
    };
    
    $http.get('/scribble-server/traces/'+$scope.moduleName+'/'+$scope.traceName).success(function(data) {
      $scope.trace.description = data.description;
      $scope.trace.data = data.data;
      $scope.reset();
    });

    $scope.saveTrace = function() {
      return $http.put('/scribble-server/traces/'+$scope.moduleName+'/'+$scope.traceName, $scope.trace)
          .success(function(data, status, headers, config) {
        $scope.reset();
        $scope.verify();
      });
    };

    $scope.restoreTrace = function() {
      $scope.loading = true;

      $http.get('/scribble-server/traces/'+$scope.moduleName+'/'+$scope.traceName).success(function(data) {
        $scope.trace.description = data.description;
        $scope.trace.data = data.data;
        $scope.reset();
      });
    };
    
    $scope.reset = function() {
      $scope.dirty = false;
    };

    $scope.setDirty = function() {
      $scope.dirty = true;
    };

    $scope.isDirty = function() {
      return $scope.dirty;
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
      
      _editor.on("change", function() {
        if ($scope.loading) {
          $scope.loading = false;
        } else {
          $scope.setDirty();
        }
      });
    };

    $scope.verify = function() {
      $scope.markers = undefined;
    
      $http.post('/scribble-server/actions/simulate/'+$scope.moduleName+'/'+$scope.traceName).success(function(data) {
        $scope.markers = data;

        if ($scope.currentMarker !== undefined) {
          $scope.currentMarker.clear();
        }
      });
    };
    
    $scope.verify();
  }]);

}
