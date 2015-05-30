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

  export var ProtocolController = _module.controller("Scribble.ProtocolController", ["$scope", "$routeParams", "$http", ($scope, $routeParams, $http) => {

    $scope.moduleName = $routeParams.module;
    $scope.protocolName = $routeParams.protocol;
    
    $http.get('/scribble-server/protocols/'+$scope.moduleName+'/'+$scope.protocolName).success(function(data) {
      $scope.protocol = data;
    });

    $http.get('/scribble-server/protocols/'+$scope.moduleName+'/'+$scope.protocolName+'/roles').success(function(data) {
      $scope.roles = data;
    });

    $scope.saveProtocol = function() {
      return $http.put('/scribble-server/protocols/'+$scope.moduleName+'/'+$scope.protocolName, $scope.protocol)
        .success(function(data, status, headers, config) {
        var verifyAction = {
            module: $scope.moduleName,
            protocol: $scope.protocolName
        };
        
        $http.post('/scribble-server/actions/verify', verifyAction).success(function(data) {
          $scope.markers = data;
        });
      });
    };

    $scope.restoreProtocol = function() {
      $http.get('/scribble-server/protocols/'+$scope.moduleName+'/'+$scope.protocolName).success(function(data) {
        $scope.protocol = data;
      });
    };

    $scope.selectedMarker = function(marker) {
      if ($scope.currentMarker !== undefined) {
        $scope.currentMarker.clear();
      }

      $scope.currentMarker = $scope.doc.markText(
        {line: marker.startLine-1, ch: marker.startPos-1},
        {line: marker.endLine-1, ch: marker.endPos-1},
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
  }]);

}
