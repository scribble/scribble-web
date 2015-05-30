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


var Scribble;
(function (Scribble) {
    Scribble.pluginName = "scribble";
    Scribble.log = Logger.get(Scribble.pluginName);
    Scribble.templatePath = "plugins/scribble/html";
})(Scribble || (Scribble = {}));

var Scribble;
(function (Scribble) {
    Scribble._module = angular.module(Scribble.pluginName, ["xeditable", "ui.codemirror"]);
    var tab = undefined;
    Scribble._module.config(["$locationProvider", "$routeProvider", "HawtioNavBuilderProvider", function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(Scribble.pluginName).title(function () { return "Protocols"; }).href(function () { return "/protocols"; }).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
        $routeProvider.when('/protocols', {
            templateUrl: 'plugins/scribble/html/modules.html',
            controller: 'Scribble.ModulesController'
        }).when('/protocols/:module', {
            templateUrl: 'plugins/scribble/html/module.html',
            controller: 'Scribble.ModuleController'
        }).when('/protocols/:module/:protocol', {
            templateUrl: 'plugins/scribble/html/protocol.html',
            controller: 'Scribble.ProtocolController'
        }).when('/protocols/:module/:protocol/role/:role', {
            templateUrl: 'plugins/scribble/html/role.html',
            controller: 'Scribble.RoleController'
        });
    }]);
    Scribble._module.run(function (editableOptions) {
        editableOptions.theme = 'bs3';
    });
    Scribble._module.run(["HawtioNav", function (HawtioNav) {
        HawtioNav.add(tab);
        Scribble.log.debug("loaded");
    }]);
    hawtioPluginLoader.addModule(Scribble.pluginName);
})(Scribble || (Scribble = {}));

var Scribble;
(function (Scribble) {
    Scribble.ModuleController = Scribble._module.controller("Scribble.ModuleController", ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
        $scope.moduleName = $routeParams.module;
        $http.get('/scribble-server/protocols/' + $scope.moduleName).success(function (data) {
            $scope.protocols = data;
        });
        $scope.nameOrderProp = 'name';
    }]);
})(Scribble || (Scribble = {}));

var Scribble;
(function (Scribble) {
    Scribble.ModulesController = Scribble._module.controller("Scribble.ModulesController", ["$scope", "$http", function ($scope, $http) {
        $http.get('/scribble-server/protocols').success(function (data) {
            $scope.modules = data;
        });
        $scope.nameOrderProp = 'name';
    }]);
})(Scribble || (Scribble = {}));

var Scribble;
(function (Scribble) {
    Scribble.ProtocolController = Scribble._module.controller("Scribble.ProtocolController", ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
        $scope.moduleName = $routeParams.module;
        $scope.protocolName = $routeParams.protocol;
        $http.get('/scribble-server/protocols/' + $scope.moduleName + '/' + $scope.protocolName).success(function (data) {
            $scope.protocol = data;
        });
        $http.get('/scribble-server/protocols/' + $scope.moduleName + '/' + $scope.protocolName + '/roles').success(function (data) {
            $scope.roles = data;
        });
        $scope.saveProtocol = function () {
            return $http.put('/scribble-server/protocols/' + $scope.moduleName + '/' + $scope.protocolName, $scope.protocol).success(function (data, status, headers, config) {
                var verifyAction = {
                    module: $scope.moduleName,
                    protocol: $scope.protocolName
                };
                $http.post('/scribble-server/actions/verify', verifyAction).success(function (data) {
                    $scope.markers = data;
                });
            });
        };
        $scope.restoreProtocol = function () {
            $http.get('/scribble-server/protocols/' + $scope.moduleName + '/' + $scope.protocolName).success(function (data) {
                $scope.protocol = data;
            });
        };
        $scope.projectProtocol = function () {
            $http.get('/scribble-server/protocols/' + $scope.moduleName + '/' + $scope.protocolName + '/project').success(function (data) {
                $scope.protocolProjection = data;
            });
        };
        $scope.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            mode: 'scribble'
        };
        $scope.nameOrderProp = 'name';
    }]);
})(Scribble || (Scribble = {}));

var Scribble;
(function (Scribble) {
    Scribble.RoleController = Scribble._module.controller("Scribble.RoleController", ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
        $scope.moduleName = $routeParams.module;
        $scope.protocolName = $routeParams.protocol;
        $scope.roleName = $routeParams.role;
        $scope.projectAction = {
            module: $scope.moduleName,
            protocol: $scope.protocolName,
            role: $scope.roleName
        };
        $http.post('/scribble-server/actions/project', $scope.projectAction).success(function (data) {
            $scope.projection = data;
            if ($scope.projection.graph !== undefined) {
                var graph = graphlibDot.parse($scope.projection.graph);
                var container = d3.select("svg g");
                var renderer = new dagreD3.Renderer();
                renderer.run(graph, container);
            }
        });
        $scope.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            readOnly: true,
            mode: 'scribble'
        };
    }]);
})(Scribble || (Scribble = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwic2NyaWJibGUvdHMvc2NyaWJibGVHbG9iYWxzLnRzIiwic2NyaWJibGUvdHMvc2NyaWJibGVQbHVnaW4udHMiLCJzY3JpYmJsZS90cy9tb2R1bGUudHMiLCJzY3JpYmJsZS90cy9tb2R1bGVzLnRzIiwic2NyaWJibGUvdHMvcHJvdG9jb2wudHMiLCJzY3JpYmJsZS90cy9yb2xlLnRzIl0sIm5hbWVzIjpbIlNjcmliYmxlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDZUEsSUFBTyxRQUFRLENBUWQ7QUFSRCxXQUFPLFFBQVEsRUFBQyxDQUFDO0lBRUpBLG1CQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtJQUV4QkEsWUFBR0EsR0FBbUJBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLG1CQUFVQSxDQUFDQSxDQUFDQTtJQUU3Q0EscUJBQVlBLEdBQUdBLHVCQUF1QkEsQ0FBQ0E7QUFFcERBLENBQUNBLEVBUk0sUUFBUSxLQUFSLFFBQVEsUUFRZDs7QUNQRCxJQUFPLFFBQVEsQ0E2Q2Q7QUE3Q0QsV0FBTyxRQUFRLEVBQUMsQ0FBQztJQUVKQSxnQkFBT0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0EsV0FBV0EsRUFBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFeEZBLElBQUlBLEdBQUdBLEdBQUdBLFNBQVNBLENBQUNBO0lBRXBCQSxnQkFBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxnQkFBZ0JBLEVBQUVBLDBCQUEwQkEsRUFDL0VBLFVBQUNBLGlCQUFpQkEsRUFBRUEsY0FBdUNBLEVBQUVBLE9BQXFDQTtRQUNsR0EsR0FBR0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FDbkJBLEVBQUVBLENBQUNBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLENBQ3ZCQSxLQUFLQSxDQUFDQSxjQUFNQSxrQkFBV0EsRUFBWEEsQ0FBV0Es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QUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFdkQsSUFBSSxTQUFTLEdBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFHakMsSUFBSSxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3RDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7UUFDSCxDQUFDLENBQUNBLENBQUNBO1FBRUhBLE1BQU1BLENBQUNBLGFBQWFBLEdBQUdBO1lBQ3JCQSxZQUFZQSxFQUFHQSxJQUFJQTtZQUNuQkEsV0FBV0EsRUFBRUEsSUFBSUE7WUFDakJBLFFBQVFBLEVBQUVBLElBQUlBO1lBQ2RBLElBQUlBLEVBQUVBLFVBQVVBO1NBQ2pCQSxDQUFDQTtJQUVKQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUVOQSxDQUFDQSxFQXpDTSxRQUFRLEtBQVIsUUFBUSxRQXlDZCIsImZpbGUiOiJjb21waWxlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBwbHVnaW5OYW1lID0gXCJzY3JpYmJsZVwiO1xuXG4gIGV4cG9ydCB2YXIgbG9nOiBMb2dnaW5nLkxvZ2dlciA9IExvZ2dlci5nZXQocGx1Z2luTmFtZSk7XG5cbiAgZXhwb3J0IHZhciB0ZW1wbGF0ZVBhdGggPSBcInBsdWdpbnMvc2NyaWJibGUvaHRtbFwiO1xuIFxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzY3JpYmJsZUdsb2JhbHMudHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGV4cG9ydCB2YXIgX21vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKFNjcmliYmxlLnBsdWdpbk5hbWUsIFtcInhlZGl0YWJsZVwiLFwidWkuY29kZW1pcnJvclwiXSk7XG5cbiAgdmFyIHRhYiA9IHVuZGVmaW5lZDtcblxuICBfbW9kdWxlLmNvbmZpZyhbXCIkbG9jYXRpb25Qcm92aWRlclwiLCBcIiRyb3V0ZVByb3ZpZGVyXCIsIFwiSGF3dGlvTmF2QnVpbGRlclByb3ZpZGVyXCIsXG4gICAgKCRsb2NhdGlvblByb3ZpZGVyLCAkcm91dGVQcm92aWRlcjogbmcucm91dGUuSVJvdXRlUHJvdmlkZXIsIGJ1aWxkZXI6IEhhd3Rpb01haW5OYXYuQnVpbGRlckZhY3RvcnkpID0+IHtcbiAgICB0YWIgPSBidWlsZGVyLmNyZWF0ZSgpXG4gICAgICAuaWQoU2NyaWJibGUucGx1Z2luTmFtZSlcbiAgICAgIC50aXRsZSgoKSA9PiBcIlByb3RvY29sc1wiKVxuICAgICAgLmhyZWYoKCkgPT4gXCIvcHJvdG9jb2xzXCIpXG4gICAgICAuYnVpbGQoKTtcbiAgICBidWlsZGVyLmNvbmZpZ3VyZVJvdXRpbmcoJHJvdXRlUHJvdmlkZXIsIHRhYik7XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICRyb3V0ZVByb3ZpZGVyLlxuICAgICAgd2hlbignL3Byb3RvY29scycsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwbHVnaW5zL3NjcmliYmxlL2h0bWwvbW9kdWxlcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1NjcmliYmxlLk1vZHVsZXNDb250cm9sbGVyJ1xuICAgICAgfSkuXG4gICAgICB3aGVuKCcvcHJvdG9jb2xzLzptb2R1bGUnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGx1Z2lucy9zY3JpYmJsZS9odG1sL21vZHVsZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1NjcmliYmxlLk1vZHVsZUNvbnRyb2xsZXInXG4gICAgICB9KS5cbiAgICAgIHdoZW4oJy9wcm90b2NvbHMvOm1vZHVsZS86cHJvdG9jb2wnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGx1Z2lucy9zY3JpYmJsZS9odG1sL3Byb3RvY29sLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnU2NyaWJibGUuUHJvdG9jb2xDb250cm9sbGVyJ1xuICAgICAgfSkuXG4gICAgICB3aGVuKCcvcHJvdG9jb2xzLzptb2R1bGUvOnByb3RvY29sL3JvbGUvOnJvbGUnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGx1Z2lucy9zY3JpYmJsZS9odG1sL3JvbGUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTY3JpYmJsZS5Sb2xlQ29udHJvbGxlcidcbiAgICAgIH0pO1xuICB9XSk7XG5cbiAgX21vZHVsZS5ydW4oZnVuY3Rpb24oZWRpdGFibGVPcHRpb25zKSB7XG4gICAgZWRpdGFibGVPcHRpb25zLnRoZW1lID0gJ2JzMyc7IC8vIGJvb3RzdHJhcDMgdGhlbWUuIENhbiBiZSBhbHNvICdiczInLCAnZGVmYXVsdCdcbiAgfSk7XG5cbiAgX21vZHVsZS5ydW4oW1wiSGF3dGlvTmF2XCIsIChIYXd0aW9OYXY6IEhhd3Rpb01haW5OYXYuUmVnaXN0cnkpID0+IHtcbiAgICBIYXd0aW9OYXYuYWRkKHRhYik7XG4gICAgbG9nLmRlYnVnKFwibG9hZGVkXCIpO1xuICB9XSk7XG5cblxuICBoYXd0aW9QbHVnaW5Mb2FkZXIuYWRkTW9kdWxlKFNjcmliYmxlLnBsdWdpbk5hbWUpO1xufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzY3JpYmJsZVBsdWdpbi50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBNb2R1bGVDb250cm9sbGVyID0gX21vZHVsZS5jb250cm9sbGVyKFwiU2NyaWJibGUuTW9kdWxlQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCIkaHR0cFwiLCAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRodHRwKSA9PiB7XG5cbiAgICAkc2NvcGUubW9kdWxlTmFtZSA9ICRyb3V0ZVBhcmFtcy5tb2R1bGU7XG5cbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvcHJvdG9jb2xzLycrJHNjb3BlLm1vZHVsZU5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgJHNjb3BlLnByb3RvY29scyA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUubmFtZU9yZGVyUHJvcCA9ICduYW1lJztcblxuICB9XSk7XG5cbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVQbHVnaW4udHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGV4cG9ydCB2YXIgTW9kdWxlc0NvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJTY3JpYmJsZS5Nb2R1bGVzQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCIkaHR0cFwiLCAoJHNjb3BlLCAkaHR0cCkgPT4ge1xuXG4gICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL3Byb3RvY29scycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgJHNjb3BlLm1vZHVsZXMgPSBkYXRhO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLm5hbWVPcmRlclByb3AgPSAnbmFtZSc7XG5cbiAgfV0pO1xuXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNjcmliYmxlUGx1Z2luLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBleHBvcnQgdmFyIFByb3RvY29sQ29udHJvbGxlciA9IF9tb2R1bGUuY29udHJvbGxlcihcIlNjcmliYmxlLlByb3RvY29sQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCIkaHR0cFwiLCAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRodHRwKSA9PiB7XG5cbiAgICAkc2NvcGUubW9kdWxlTmFtZSA9ICRyb3V0ZVBhcmFtcy5tb2R1bGU7XG4gICAgJHNjb3BlLnByb3RvY29sTmFtZSA9ICRyb3V0ZVBhcmFtcy5wcm90b2NvbDtcbiAgICBcbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvcHJvdG9jb2xzLycrJHNjb3BlLm1vZHVsZU5hbWUrJy8nKyRzY29wZS5wcm90b2NvbE5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgJHNjb3BlLnByb3RvY29sID0gZGF0YTtcbiAgICB9KTtcblxuICAgICRodHRwLmdldCgnL3NjcmliYmxlLXNlcnZlci9wcm90b2NvbHMvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrJHNjb3BlLnByb3RvY29sTmFtZSsnL3JvbGVzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUucm9sZXMgPSBkYXRhO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNhdmVQcm90b2NvbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwLnB1dCgnL3NjcmliYmxlLXNlcnZlci9wcm90b2NvbHMvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrJHNjb3BlLnByb3RvY29sTmFtZSwgJHNjb3BlLnByb3RvY29sKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICB2YXIgdmVyaWZ5QWN0aW9uID0ge1xuICAgICAgICAgICAgbW9kdWxlOiAkc2NvcGUubW9kdWxlTmFtZSxcbiAgICAgICAgICAgIHByb3RvY29sOiAkc2NvcGUucHJvdG9jb2xOYW1lXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAkaHR0cC5wb3N0KCcvc2NyaWJibGUtc2VydmVyL2FjdGlvbnMvdmVyaWZ5JywgdmVyaWZ5QWN0aW9uKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAkc2NvcGUubWFya2VycyA9IGRhdGE7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5yZXN0b3JlUHJvdG9jb2wgPSBmdW5jdGlvbigpIHtcbiAgICAgICRodHRwLmdldCgnL3NjcmliYmxlLXNlcnZlci9wcm90b2NvbHMvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrJHNjb3BlLnByb3RvY29sTmFtZSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRzY29wZS5wcm90b2NvbCA9IGRhdGE7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnByb2plY3RQcm90b2NvbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL3Byb3RvY29scy8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUucHJvdG9jb2xOYW1lKycvcHJvamVjdCcpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUucHJvdG9jb2xQcm9qZWN0aW9uID0gZGF0YTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZWRpdG9yT3B0aW9ucyA9IHtcbiAgICAgIGxpbmVXcmFwcGluZyA6IHRydWUsXG4gICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgIG1vZGU6ICdzY3JpYmJsZSdcbiAgICB9O1xuXG4gICAgJHNjb3BlLm5hbWVPcmRlclByb3AgPSAnbmFtZSc7XG5cbiAgfV0pO1xuXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNjcmliYmxlUGx1Z2luLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBkZWNsYXJlIHZhciBncmFwaGxpYkRvdDogYW55O1xuICBkZWNsYXJlIHZhciBkYWdyZUQzOiBhbnk7XG4gXG4gIGV4cG9ydCB2YXIgUm9sZUNvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJTY3JpYmJsZS5Sb2xlQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCIkaHR0cFwiLCAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRodHRwKSA9PiB7XG5cbiAgICAkc2NvcGUubW9kdWxlTmFtZSA9ICRyb3V0ZVBhcmFtcy5tb2R1bGU7XG4gICAgJHNjb3BlLnByb3RvY29sTmFtZSA9ICRyb3V0ZVBhcmFtcy5wcm90b2NvbDtcbiAgICAkc2NvcGUucm9sZU5hbWUgPSAkcm91dGVQYXJhbXMucm9sZTtcbiAgICBcbiAgICAkc2NvcGUucHJvamVjdEFjdGlvbiA9IHtcbiAgICAgIG1vZHVsZTogJHNjb3BlLm1vZHVsZU5hbWUsXG4gICAgICBwcm90b2NvbDogJHNjb3BlLnByb3RvY29sTmFtZSxcbiAgICAgIHJvbGU6ICRzY29wZS5yb2xlTmFtZVxuICAgIH07XG4gICAgXG4gICAgJGh0dHAucG9zdCgnL3NjcmliYmxlLXNlcnZlci9hY3Rpb25zL3Byb2plY3QnLCAkc2NvcGUucHJvamVjdEFjdGlvbikuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUucHJvamVjdGlvbiA9IGRhdGE7XG4gICAgICBcbiAgICAgIGlmICgkc2NvcGUucHJvamVjdGlvbi5ncmFwaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFByb2R1Y2UgZ3JhcGggYnkgcGFyc2luZyB0aGUgRE9UIHN5bnRheCBpbnRvIGEgZ3JhcGhsaWIgb2JqZWN0LlxuICAgICAgICB2YXIgZ3JhcGggPSBncmFwaGxpYkRvdC5wYXJzZSgkc2NvcGUucHJvamVjdGlvbi5ncmFwaCk7XG4gICAgXG4gICAgICAgIHZhciBjb250YWluZXI9ZDMuc2VsZWN0KFwic3ZnIGdcIik7XG4gICAgICBcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBncmFwaGxpYiBvYmplY3QgdXNpbmcgZDMuXG4gICAgICAgIHZhciByZW5kZXJlciA9IG5ldyBkYWdyZUQzLlJlbmRlcmVyKCk7XG4gICAgICAgIHJlbmRlcmVyLnJ1bihncmFwaCwgY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICRzY29wZS5lZGl0b3JPcHRpb25zID0ge1xuICAgICAgbGluZVdyYXBwaW5nIDogdHJ1ZSxcbiAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICBtb2RlOiAnc2NyaWJibGUnXG4gICAgfTtcblxuICB9XSk7XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
angular.module("scribble-ui-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/scribble/html/module.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModuleController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/protocols\">Modules</a></li>\n      <li class=\"active\">{{moduleName}}</li>\n    </ol>\n\n    <h1><b>{{moduleName}}</b> <span style=\"color:grey\">Module</span></h1>\n\n    <div class=\"row\">\n      <div class=\"col-sm-8 col-md-9\">\n        Search: <input ng-model=\"query\">\n\n        <br>\n        <br>\n\n        <ul class=\"list-group\" >\n          <li ng-repeat=\"protocol in protocols | orderBy:nameOrderProp | filter:query\" class=\"list-group-item\" >\n            <h3><a href=\"/protocols/{{moduleName}}/{{protocol.name}}\">{{protocol.name}}</a></h3>\n            <p><i>{{protocol.description}}</i></p>\n            <div ng-if=\"protocol.author != undefined\"><h5>By: {{protocol.author}}</h5></div>\n          </li>\n        </ul>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/modules.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModulesController\">\n    <h1><span style=\"color:grey\">Modules</span></h1>\n\n    <div class=\"row\">\n      <div class=\"col-sm-8 col-md-9\">\n        Search: <input ng-model=\"query\">\n\n        <br>\n        <br>\n\n        <ul class=\"list-group\" >\n          <li ng-repeat=\"module in modules | orderBy:nameOrderProp | filter:query\" class=\"list-group-item\" >\n            <h3><a href=\"/protocols/{{module.name}}\">{{module.name}}</a></h3>\n            <p><i>Number of protocols: {{module.numberOfProtocols}}</i></p>\n          </li>\n       </ul>\n\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/protocol.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ProtocolController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/protocols\">Modules</a></li>\n      <li><a href=\"/protocols/{{moduleName}}\">{{moduleName}}</a></li>\n      <li class=\"active\">{{protocolName}}</li>\n    </ol>\n\n    <h1><b>{{protocolName}}</b> <span style=\"color:grey\">Protocol</span></h1>\n\n    <a href=\"#\" editable-textarea=\"protocol.description\" e-rows=\"14\" e-cols=\"120\" rows=\"7\" >\n        <pre><i>{{ protocol.description || \'No description\' }}</i></pre>\n    </a>\n    \n    <div>\n      <button type=\"button\" class=\"btn btn-success btn-sm\" ng-click=\"saveProtocol()\">Save</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm\" ng-click=\"restoreProtocol()\">Discard</button>\n      \n      <div style=\"float: right;\">\n      <label>Roles:</label>\n      <a type=\"button\" href=\"/protocols/{{moduleName}}/{{protocolName}}/role/{{role.name}}\" class=\"btn btn-sm btn-primary\"\n      							ng-repeat=\"role in roles | orderBy:nameOrderProp\">{{role.name}}</a>\n      </div>\n    </div>\n    \n    <br>\n\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"protocol.definition\" ></ui-codemirror>\n\n          <br>\n          \n          <ul class=\"list-group\">\n            <li ng-repeat=\"marker in markers\" class=\"list-group-item\"\n            				ng-class=\"{\'list-group-item-danger\': marker.severity===\'Error\', \'list-group-item-warning\': marker.severity===\'Warning\'}\" >\n              {{marker.description}}\n            </li>\n          </ul>\n        </div>\n      </div>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/role.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.RoleController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/protocols\">Modules</a></li>\n      <li><a href=\"/protocols/{{moduleName}}\">{{moduleName}}</a></li>\n      <li><a href=\"/protocols/{{moduleName}}/{{protocolName}}\">{{protocolName}}</a></li>\n      <li class=\"active\">{{roleName}}</li>\n    </ol>\n\n    <h1><b>{{roleName}}</b> <span style=\"color:grey\">Role</span></h1>\n\n<!-- Comment out tabs for now until work out how to resize graph (issue 16)\n    <ul class=\"nav nav-tabs\">\n      <li class=\"active\"><a data-toggle=\"tab\" href=\"#projection\">Projection</a></li>\n      <li><a data-toggle=\"tab\" href=\"#graph\">Graph</a></li>\n    </ul>\n\n    <div class=\"tab-content\">\n      <div id=\"projection\" class=\"tab-pane fade in active\">\n-->\n        <div class=\"row\">\n          <div class=\"col-md-12\">\n            <ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"projection.definition\" ></ui-codemirror>\n          </div>\n        </div>\n<!--\n      </div>\n      <div id=\"graph\" class=\"tab-pane fade\">\n-->\n		<br>\n\n        <div class=\"row\">\n          <div class=\"col-md-12\">\n            <svg id=\"graphContainer\" height=\"400\" width=\"400\">\n              <g height=\"400\" width=\"400\"/>\n            </svg>\n          </div>\n        </div>\n<!--\n      </div>\n    </div>\n-->\n\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("scribble-ui-templates");
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("scribble", function(config) {
  function words(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }
  var keywords = words(
    "module import type protocol global local role sig instantiates as from to choice at " +
    "or rec continue par and interruptible with by throws catches do spawn ");
  var blockKeywords = words("global local protocol choice rec par interruptible");
  var atoms = words("null true false this");

  var curPunc;
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      return startString(ch, stream, state);
    }
    if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      curPunc = ch;
      return null;
    }
    if (/\d/.test(ch)) {
      stream.eatWhile(/[\w\.]/);
      if (stream.eat(/eE/)) { stream.eat(/\+\-/); stream.eatWhile(/\d/); }
      return "number";
    }
    if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize.push(tokenComment);
        return tokenComment(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
      if (expectExpression(state.lastToken)) {
        return startString(ch, stream, state);
      }
    }
    if (ch == "-" && stream.eat(">")) {
      curPunc = "->";
      return null;
    }
    if (/[+\-*&%=<>!?|\/~]/.test(ch)) {
      stream.eatWhile(/[+\-*&%=<>|~]/);
      return "operator";
    }
    stream.eatWhile(/[\w\$_]/);
    if (ch == "@") { stream.eatWhile(/[\w\$_\.]/); return "meta"; }
    if (state.lastToken == ".") return "property";
    if (stream.eat(":")) { curPunc = "proplabel"; return "property"; }
    var cur = stream.current();
    if (atoms.propertyIsEnumerable(cur)) { return "atom"; }
    if (keywords.propertyIsEnumerable(cur)) {
      if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
      return "keyword";
    }
    return "variable";
  }
  tokenBase.isBase = true;

  function startString(quote, stream, state) {
    var tripleQuoted = false;
    if (quote != "/" && stream.eat(quote)) {
      if (stream.eat(quote)) tripleQuoted = true;
      else return "string";
    }
    function t(stream, state) {
      var escaped = false, next, end = !tripleQuoted;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {
          if (!tripleQuoted) { break; }
          if (stream.match(quote + quote)) { end = true; break; }
        }
        if (quote == '"' && next == "$" && !escaped && stream.eat("{")) {
          state.tokenize.push(tokenBaseUntilBrace());
          return "string";
        }
        escaped = !escaped && next == "\\";
      }
      if (end) state.tokenize.pop();
      return "string";
    }
    state.tokenize.push(t);
    return t(stream, state);
  }

  function tokenBaseUntilBrace() {
    var depth = 1;
    function t(stream, state) {
      if (stream.peek() == "}") {
        depth--;
        if (depth == 0) {
          state.tokenize.pop();
          return state.tokenize[state.tokenize.length-1](stream, state);
        }
      } else if (stream.peek() == "{") {
        depth++;
      }
      return tokenBase(stream, state);
    }
    t.isBase = true;
    return t;
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize.pop();
        break;
      }
      maybeEnd = (ch == "*");
    }
    return "comment";
  }

  function expectExpression(last) {
    return !last || last == "operator" || last == "->" || /[\.\[\{\(,;:]/.test(last) ||
      last == "newstatement" || last == "keyword" || last == "proplabel";
  }

  function Context(indented, column, type, align, prev) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.align = align;
    this.prev = prev;
  }
  function pushContext(state, col, type) {
    return state.context = new Context(state.indented, col, type, null, state.context);
  }
  function popContext(state) {
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}")
      state.indented = state.context.indented;
    return state.context = state.context.prev;
  }

  // Interface

  return {
    startState: function(basecolumn) {
      return {
        tokenize: [tokenBase],
        context: new Context((basecolumn || 0) - config.indentUnit, 0, "top", false),
        indented: 0,
        startOfLine: true,
        lastToken: null
      };
    },

    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
        // Automatic semicolon insertion
        if (ctx.type == "statement" && !expectExpression(state.lastToken)) {
          popContext(state); ctx = state.context;
        }
      }
      if (stream.eatSpace()) return null;
      curPunc = null;
      var style = state.tokenize[state.tokenize.length-1](stream, state);
      if (style == "comment") return style;
      if (ctx.align == null) ctx.align = true;

      if ((curPunc == ";" || curPunc == ":") && ctx.type == "statement") popContext(state);
      // Handle indentation for {x -> \n ... }
      else if (curPunc == "->" && ctx.type == "statement" && ctx.prev.type == "}") {
        popContext(state);
        state.context.align = false;
      }
      else if (curPunc == "{") pushContext(state, stream.column(), "}");
      else if (curPunc == "[") pushContext(state, stream.column(), "]");
      else if (curPunc == "(") pushContext(state, stream.column(), ")");
      else if (curPunc == "}") {
        while (ctx.type == "statement") ctx = popContext(state);
        if (ctx.type == "}") ctx = popContext(state);
        while (ctx.type == "statement") ctx = popContext(state);
      }
      else if (curPunc == ctx.type) popContext(state);
      else if (ctx.type == "}" || ctx.type == "top" || (ctx.type == "statement" && curPunc == "newstatement"))
        pushContext(state, stream.column(), "statement");
      state.startOfLine = false;
      state.lastToken = curPunc || style;
      return style;
    },

    indent: function(state, textAfter) {
      if (!state.tokenize[state.tokenize.length-1].isBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), ctx = state.context;
      if (ctx.type == "statement" && !expectExpression(state.lastToken)) ctx = ctx.prev;
      var closing = firstChar == ctx.type;
      if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : config.indentUnit);
      else if (ctx.align) return ctx.column + (closing ? 0 : 1);
      else return ctx.indented + (closing ? 0 : config.indentUnit);
    },

    electricChars: "{}",
    fold: "brace"
  };
});

CodeMirror.defineMIME("text/x-scribble", "scribble");

});
