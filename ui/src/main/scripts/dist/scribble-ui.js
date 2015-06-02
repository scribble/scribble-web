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
    Scribble.ModuleController = Scribble._module.controller("Scribble.ModuleController", ["$scope", "$routeParams", "$http", '$location', function ($scope, $routeParams, $http, $location) {
        $scope.moduleName = $routeParams.module;
        $http.get('/scribble-server/protocols/' + $scope.moduleName).success(function (data) {
            $scope.protocols = data;
        });
        $scope.nameOrderProp = 'name';
        $scope.master = {};
        $scope.create = function (newprotocol) {
            var protocolDefn = { definition: "module " + $scope.moduleName + ";\r\n\r\nglobal protocol " + newprotocol.protocol + "() {\r\n}\r\n" };
            $http.put('/scribble-server/protocols/' + $scope.moduleName + '/' + newprotocol.protocol, protocolDefn).success(function (data) {
                $location.path('/protocols/' + $scope.moduleName + '/' + newprotocol.protocol);
            });
        };
        $scope.reset = function (form) {
            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
            $scope.newprotocol = angular.copy($scope.master);
        };
        $scope.reset();
    }]);
})(Scribble || (Scribble = {}));

var Scribble;
(function (Scribble) {
    Scribble.ModulesController = Scribble._module.controller("Scribble.ModulesController", ["$scope", "$http", '$location', function ($scope, $http, $location) {
        $http.get('/scribble-server/protocols').success(function (data) {
            $scope.modules = data;
        });
        $scope.nameOrderProp = 'name';
        $scope.master = {};
        $scope.create = function (newprotocol) {
            var protocolDefn = { definition: "module " + newprotocol.module + ";\r\n\r\nglobal protocol " + newprotocol.protocol + "() {\r\n}\r\n" };
            $http.put('/scribble-server/protocols/' + newprotocol.module + '/' + newprotocol.protocol, protocolDefn).success(function (data) {
                $location.path('/protocols/' + newprotocol.module + '/' + newprotocol.protocol);
            });
        };
        $scope.reset = function (form) {
            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
            $scope.newprotocol = angular.copy($scope.master);
        };
        $scope.reset();
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
        $scope.selectedMarker = function (marker) {
            if ($scope.currentMarker !== undefined) {
                $scope.currentMarker.clear();
            }
            $scope.currentMarker = $scope.doc.markText({ line: marker.startLine - 1, ch: marker.startPos - 1 }, { line: marker.endLine - 1, ch: marker.endPos - 1 }, { className: "styled-background" });
        };
        $scope.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            mode: 'scribble'
        };
        $scope.nameOrderProp = 'name';
        $scope.codemirrorLoaded = function (_editor) {
            $scope.editor = _editor;
            $scope.doc = _editor.getDoc();
            _editor.focus();
            _editor.setOption('lineWrapping', true);
            _editor.setOption('lineNumbers', true);
            _editor.setOption('mode', 'scribble');
            $scope.doc.markClean();
        };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwic2NyaWJibGUvdHMvc2NyaWJibGVHbG9iYWxzLnRzIiwic2NyaWJibGUvdHMvc2NyaWJibGVQbHVnaW4udHMiLCJzY3JpYmJsZS90cy9tb2R1bGUudHMiLCJzY3JpYmJsZS90cy9tb2R1bGVzLnRzIiwic2NyaWJibGUvdHMvcHJvdG9jb2wudHMiLCJzY3JpYmJsZS90cy9yb2xlLnRzIl0sIm5hbWVzIjpbIlNjcmliYmxlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDZUEsSUFBTyxRQUFRLENBUWQ7QUFSRCxXQUFPLFFBQVEsRUFBQyxDQUFDO0lBRUpBLG1CQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtJQUV4QkEsWUFBR0EsR0FBbUJBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLG1CQUFVQSxDQUFDQSxDQUFDQTtJQUU3Q0EscUJBQVlBLEdBQUdBLHVCQUF1QkEsQ0FBQ0E7QUFFcERBLENBQUNBLEVBUk0sUUFBUSxLQUFSLFFBQVEsUUFRZDs7QUNQRCxJQUFPLFFBQVEsQ0E2Q2Q7QUE3Q0QsV0FBTyxRQUFRLEVBQUMsQ0FBQztJQUVKQSxnQkFBT0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0EsV0FBV0EsRUFBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFeEZBLElBQUlBLEdBQUdBLEdBQUdBLFNBQVNBLENBQUNBO0lBRXBCQSxnQkFBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxnQkFBZ0JBLEVBQUVBLDBCQUEwQkEsRUFDL0VBLFVBQUNBLGlCQUFpQkEsRUFBRUEsY0FBdUNBLEVBQUVBLE9BQXFDQTtRQUNsR0EsR0FBR0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FDbkJBLEVBQUVBLENBQUNBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLENBQ3ZCQSxLQUFLQSxDQUFDQSxjQUFNQSxrQkFBV0EsRUFBWEEsQ0FBV0Es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LENBQUNBLFVBQVVBO1lBQ3pCQSxRQUFRQSxFQUFFQSxNQUFNQSxDQUFDQSxZQUFZQTtZQUM3QkEsSUFBSUEsRUFBRUEsTUFBTUEsQ0FBQ0EsUUFBUUE7U0FDdEJBLENBQUNBO1FBRUZBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLGtDQUFrQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBU0EsSUFBSUE7WUFDeEYsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFFekIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFFMUMsSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUV2RCxJQUFJLFNBQVMsR0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUdqQyxJQUFJLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDakMsQ0FBQztRQUNILENBQUMsQ0FBQ0EsQ0FBQ0E7UUFFSEEsTUFBTUEsQ0FBQ0EsYUFBYUEsR0FBR0E7WUFDckJBLFlBQVlBLEVBQUdBLElBQUlBO1lBQ25CQSxXQUFXQSxFQUFFQSxJQUFJQTtZQUNqQkEsUUFBUUEsRUFBRUEsSUFBSUE7WUFDZEEsSUFBSUEsRUFBRUEsVUFBVUE7U0FDakJBLENBQUNBO0lBRUpBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBRU5BLENBQUNBLEVBekNNLFFBQVEsS0FBUixRQUFRLFFBeUNkIiwiZmlsZSI6ImNvbXBpbGVkLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBleHBvcnQgdmFyIHBsdWdpbk5hbWUgPSBcInNjcmliYmxlXCI7XG5cbiAgZXhwb3J0IHZhciBsb2c6IExvZ2dpbmcuTG9nZ2VyID0gTG9nZ2VyLmdldChwbHVnaW5OYW1lKTtcblxuICBleHBvcnQgdmFyIHRlbXBsYXRlUGF0aCA9IFwicGx1Z2lucy9zY3JpYmJsZS9odG1sXCI7XG4gXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNjcmliYmxlR2xvYmFscy50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBfbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoU2NyaWJibGUucGx1Z2luTmFtZSwgW1wieGVkaXRhYmxlXCIsXCJ1aS5jb2RlbWlycm9yXCJdKTtcblxuICB2YXIgdGFiID0gdW5kZWZpbmVkO1xuXG4gIF9tb2R1bGUuY29uZmlnKFtcIiRsb2NhdGlvblByb3ZpZGVyXCIsIFwiJHJvdXRlUHJvdmlkZXJcIiwgXCJIYXd0aW9OYXZCdWlsZGVyUHJvdmlkZXJcIixcbiAgICAoJGxvY2F0aW9uUHJvdmlkZXIsICRyb3V0ZVByb3ZpZGVyOiBuZy5yb3V0ZS5JUm91dGVQcm92aWRlciwgYnVpbGRlcjogSGF3dGlvTWFpbk5hdi5CdWlsZGVyRmFjdG9yeSkgPT4ge1xuICAgIHRhYiA9IGJ1aWxkZXIuY3JlYXRlKClcbiAgICAgIC5pZChTY3JpYmJsZS5wbHVnaW5OYW1lKVxuICAgICAgLnRpdGxlKCgpID0+IFwiUHJvdG9jb2xzXCIpXG4gICAgICAuaHJlZigoKSA9PiBcIi9wcm90b2NvbHNcIilcbiAgICAgIC5idWlsZCgpO1xuICAgIGJ1aWxkZXIuY29uZmlndXJlUm91dGluZygkcm91dGVQcm92aWRlciwgdGFiKTtcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgJHJvdXRlUHJvdmlkZXIuXG4gICAgICB3aGVuKCcvcHJvdG9jb2xzJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BsdWdpbnMvc2NyaWJibGUvaHRtbC9tb2R1bGVzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnU2NyaWJibGUuTW9kdWxlc0NvbnRyb2xsZXInXG4gICAgICB9KS5cbiAgICAgIHdoZW4oJy9wcm90b2NvbHMvOm1vZHVsZScsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwbHVnaW5zL3NjcmliYmxlL2h0bWwvbW9kdWxlLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnU2NyaWJibGUuTW9kdWxlQ29udHJvbGxlcidcbiAgICAgIH0pLlxuICAgICAgd2hlbignL3Byb3RvY29scy86bW9kdWxlLzpwcm90b2NvbCcsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwbHVnaW5zL3NjcmliYmxlL2h0bWwvcHJvdG9jb2wuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTY3JpYmJsZS5Qcm90b2NvbENvbnRyb2xsZXInXG4gICAgICB9KS5cbiAgICAgIHdoZW4oJy9wcm90b2NvbHMvOm1vZHVsZS86cHJvdG9jb2wvcm9sZS86cm9sZScsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwbHVnaW5zL3NjcmliYmxlL2h0bWwvcm9sZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1NjcmliYmxlLlJvbGVDb250cm9sbGVyJ1xuICAgICAgfSk7XG4gIH1dKTtcblxuICBfbW9kdWxlLnJ1bihmdW5jdGlvbihlZGl0YWJsZU9wdGlvbnMpIHtcbiAgICBlZGl0YWJsZU9wdGlvbnMudGhlbWUgPSAnYnMzJzsgLy8gYm9vdHN0cmFwMyB0aGVtZS4gQ2FuIGJlIGFsc28gJ2JzMicsICdkZWZhdWx0J1xuICB9KTtcblxuICBfbW9kdWxlLnJ1bihbXCJIYXd0aW9OYXZcIiwgKEhhd3Rpb05hdjogSGF3dGlvTWFpbk5hdi5SZWdpc3RyeSkgPT4ge1xuICAgIEhhd3Rpb05hdi5hZGQodGFiKTtcbiAgICBsb2cuZGVidWcoXCJsb2FkZWRcIik7XG4gIH1dKTtcblxuXG4gIGhhd3Rpb1BsdWdpbkxvYWRlci5hZGRNb2R1bGUoU2NyaWJibGUucGx1Z2luTmFtZSk7XG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNjcmliYmxlUGx1Z2luLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBleHBvcnQgdmFyIE1vZHVsZUNvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJTY3JpYmJsZS5Nb2R1bGVDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIiRyb3V0ZVBhcmFtc1wiLCBcIiRodHRwXCIsICckbG9jYXRpb24nLCAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRodHRwLCAkbG9jYXRpb24pID0+IHtcblxuICAgICRzY29wZS5tb2R1bGVOYW1lID0gJHJvdXRlUGFyYW1zLm1vZHVsZTtcblxuICAgICRodHRwLmdldCgnL3NjcmliYmxlLXNlcnZlci9wcm90b2NvbHMvJyskc2NvcGUubW9kdWxlTmFtZSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUucHJvdG9jb2xzID0gZGF0YTtcbiAgICB9KTtcblxuICAgICRzY29wZS5uYW1lT3JkZXJQcm9wID0gJ25hbWUnO1xuXG4gICAgJHNjb3BlLm1hc3RlciA9IHt9O1xuXG4gICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKG5ld3Byb3RvY29sKSB7XG4gICAgICB2YXIgcHJvdG9jb2xEZWZuID0geyBkZWZpbml0aW9uOiBcIm1vZHVsZSBcIiskc2NvcGUubW9kdWxlTmFtZStcbiAgICAgICAgICAgICAgIFwiO1xcclxcblxcclxcbmdsb2JhbCBwcm90b2NvbCBcIituZXdwcm90b2NvbC5wcm90b2NvbCtcIigpIHtcXHJcXG59XFxyXFxuXCIgfTtcbiAgICAgIFx0XHRcbiAgICAgICRodHRwLnB1dCgnL3NjcmliYmxlLXNlcnZlci9wcm90b2NvbHMvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrbmV3cHJvdG9jb2wucHJvdG9jb2wsIHByb3RvY29sRGVmbikuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvdG9jb2xzLycrJHNjb3BlLm1vZHVsZU5hbWUrJy8nK25ld3Byb3RvY29sLnByb3RvY29sKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVzZXQgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgICBpZiAoZm9ybSkge1xuICAgICAgICBmb3JtLiRzZXRQcmlzdGluZSgpO1xuICAgICAgICBmb3JtLiRzZXRVbnRvdWNoZWQoKTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5uZXdwcm90b2NvbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUubWFzdGVyKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlc2V0KCk7XG4gIH1dKTtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzY3JpYmJsZVBsdWdpbi50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBNb2R1bGVzQ29udHJvbGxlciA9IF9tb2R1bGUuY29udHJvbGxlcihcIlNjcmliYmxlLk1vZHVsZXNDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIiRodHRwXCIsICckbG9jYXRpb24nLCAoJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uKSA9PiB7XG5cbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvcHJvdG9jb2xzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUubW9kdWxlcyA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUubmFtZU9yZGVyUHJvcCA9ICduYW1lJztcblxuICAgICRzY29wZS5tYXN0ZXIgPSB7fTtcblxuICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbihuZXdwcm90b2NvbCkge1xuICAgICAgdmFyIHByb3RvY29sRGVmbiA9IHsgZGVmaW5pdGlvbjogXCJtb2R1bGUgXCIrbmV3cHJvdG9jb2wubW9kdWxlK1xuICAgICAgICAgICAgICBcIjtcXHJcXG5cXHJcXG5nbG9iYWwgcHJvdG9jb2wgXCIrbmV3cHJvdG9jb2wucHJvdG9jb2wrXCIoKSB7XFxyXFxufVxcclxcblwiIH07XG4gICAgICBcdFx0XG4gICAgJGh0dHAucHV0KCcvc2NyaWJibGUtc2VydmVyL3Byb3RvY29scy8nK25ld3Byb3RvY29sLm1vZHVsZSsnLycrbmV3cHJvdG9jb2wucHJvdG9jb2wsIHByb3RvY29sRGVmbikuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvdG9jb2xzLycrbmV3cHJvdG9jb2wubW9kdWxlKycvJytuZXdwcm90b2NvbC5wcm90b2NvbCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24oZm9ybSkge1xuICAgICAgaWYgKGZvcm0pIHtcbiAgICAgICAgZm9ybS4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgZm9ybS4kc2V0VW50b3VjaGVkKCk7XG4gICAgICB9XG4gICAgICAkc2NvcGUubmV3cHJvdG9jb2wgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm1hc3Rlcik7XG4gICAgfTtcblxuICAgICRzY29wZS5yZXNldCgpO1xuICB9XSk7XG5cbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVQbHVnaW4udHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGV4cG9ydCB2YXIgUHJvdG9jb2xDb250cm9sbGVyID0gX21vZHVsZS5jb250cm9sbGVyKFwiU2NyaWJibGUuUHJvdG9jb2xDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIiRyb3V0ZVBhcmFtc1wiLCBcIiRodHRwXCIsICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGh0dHApID0+IHtcblxuICAgICRzY29wZS5tb2R1bGVOYW1lID0gJHJvdXRlUGFyYW1zLm1vZHVsZTtcbiAgICAkc2NvcGUucHJvdG9jb2xOYW1lID0gJHJvdXRlUGFyYW1zLnByb3RvY29sO1xuICAgIFxuICAgICRodHRwLmdldCgnL3NjcmliYmxlLXNlcnZlci9wcm90b2NvbHMvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrJHNjb3BlLnByb3RvY29sTmFtZSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUucHJvdG9jb2wgPSBkYXRhO1xuICAgIH0pO1xuXG4gICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL3Byb3RvY29scy8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUucHJvdG9jb2xOYW1lKycvcm9sZXMnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5yb2xlcyA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2F2ZVByb3RvY29sID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAucHV0KCcvc2NyaWJibGUtc2VydmVyL3Byb3RvY29scy8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUucHJvdG9jb2xOYW1lLCAkc2NvcGUucHJvdG9jb2wpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgIHZhciB2ZXJpZnlBY3Rpb24gPSB7XG4gICAgICAgICAgICBtb2R1bGU6ICRzY29wZS5tb2R1bGVOYW1lLFxuICAgICAgICAgICAgcHJvdG9jb2w6ICRzY29wZS5wcm90b2NvbE5hbWVcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICRodHRwLnBvc3QoJy9zY3JpYmJsZS1zZXJ2ZXIvYWN0aW9ucy92ZXJpZnknLCB2ZXJpZnlBY3Rpb24pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICRzY29wZS5tYXJrZXJzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlc3RvcmVQcm90b2NvbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL3Byb3RvY29scy8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUucHJvdG9jb2xOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLnByb3RvY29sID0gZGF0YTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2VsZWN0ZWRNYXJrZXIgPSBmdW5jdGlvbihtYXJrZXIpIHtcbiAgICAgIGlmICgkc2NvcGUuY3VycmVudE1hcmtlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICRzY29wZS5jdXJyZW50TWFya2VyLmNsZWFyKCk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5jdXJyZW50TWFya2VyID0gJHNjb3BlLmRvYy5tYXJrVGV4dChcbiAgICAgICAge2xpbmU6IG1hcmtlci5zdGFydExpbmUtMSwgY2g6IG1hcmtlci5zdGFydFBvcy0xfSxcbiAgICAgICAge2xpbmU6IG1hcmtlci5lbmRMaW5lLTEsIGNoOiBtYXJrZXIuZW5kUG9zLTF9LFxuICAgICAgICB7Y2xhc3NOYW1lOiBcInN0eWxlZC1iYWNrZ3JvdW5kXCJ9XG4gICAgICApO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZWRpdG9yT3B0aW9ucyA9IHtcbiAgICAgIGxpbmVXcmFwcGluZyA6IHRydWUsXG4gICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgIG1vZGU6ICdzY3JpYmJsZSdcbiAgICB9O1xuXG4gICAgJHNjb3BlLm5hbWVPcmRlclByb3AgPSAnbmFtZSc7XG5cbiAgICAkc2NvcGUuY29kZW1pcnJvckxvYWRlZCA9IGZ1bmN0aW9uKF9lZGl0b3IpIHtcbiAgICAgICRzY29wZS5lZGl0b3IgPSBfZWRpdG9yO1xuICAgICAgJHNjb3BlLmRvYyA9IF9lZGl0b3IuZ2V0RG9jKCk7XG4gICAgICBcbiAgICAgIC8vIEVkaXRvciBwYXJ0XG4gICAgICBfZWRpdG9yLmZvY3VzKCk7XG5cbiAgICAgIC8vIE9wdGlvbnNcbiAgICAgIF9lZGl0b3Iuc2V0T3B0aW9uKCdsaW5lV3JhcHBpbmcnLCB0cnVlKTtcbiAgICAgIF9lZGl0b3Iuc2V0T3B0aW9uKCdsaW5lTnVtYmVycycsIHRydWUpO1xuICAgICAgX2VkaXRvci5zZXRPcHRpb24oJ21vZGUnLCAnc2NyaWJibGUnKTtcbiAgICAgIFxuICAgICAgJHNjb3BlLmRvYy5tYXJrQ2xlYW4oKTtcbiAgICB9O1xuICB9XSk7XG5cbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVQbHVnaW4udHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGRlY2xhcmUgdmFyIGdyYXBobGliRG90OiBhbnk7XG4gIGRlY2xhcmUgdmFyIGRhZ3JlRDM6IGFueTtcbiBcbiAgZXhwb3J0IHZhciBSb2xlQ29udHJvbGxlciA9IF9tb2R1bGUuY29udHJvbGxlcihcIlNjcmliYmxlLlJvbGVDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIiRyb3V0ZVBhcmFtc1wiLCBcIiRodHRwXCIsICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGh0dHApID0+IHtcblxuICAgICRzY29wZS5tb2R1bGVOYW1lID0gJHJvdXRlUGFyYW1zLm1vZHVsZTtcbiAgICAkc2NvcGUucHJvdG9jb2xOYW1lID0gJHJvdXRlUGFyYW1zLnByb3RvY29sO1xuICAgICRzY29wZS5yb2xlTmFtZSA9ICRyb3V0ZVBhcmFtcy5yb2xlO1xuICAgIFxuICAgICRzY29wZS5wcm9qZWN0QWN0aW9uID0ge1xuICAgICAgbW9kdWxlOiAkc2NvcGUubW9kdWxlTmFtZSxcbiAgICAgIHByb3RvY29sOiAkc2NvcGUucHJvdG9jb2xOYW1lLFxuICAgICAgcm9sZTogJHNjb3BlLnJvbGVOYW1lXG4gICAgfTtcbiAgICBcbiAgICAkaHR0cC5wb3N0KCcvc2NyaWJibGUtc2VydmVyL2FjdGlvbnMvcHJvamVjdCcsICRzY29wZS5wcm9qZWN0QWN0aW9uKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5wcm9qZWN0aW9uID0gZGF0YTtcbiAgICAgIFxuICAgICAgaWYgKCRzY29wZS5wcm9qZWN0aW9uLmdyYXBoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gUHJvZHVjZSBncmFwaCBieSBwYXJzaW5nIHRoZSBET1Qgc3ludGF4IGludG8gYSBncmFwaGxpYiBvYmplY3QuXG4gICAgICAgIHZhciBncmFwaCA9IGdyYXBobGliRG90LnBhcnNlKCRzY29wZS5wcm9qZWN0aW9uLmdyYXBoKTtcbiAgICBcbiAgICAgICAgdmFyIGNvbnRhaW5lcj1kMy5zZWxlY3QoXCJzdmcgZ1wiKTtcbiAgICAgIFxuICAgICAgICAvLyBSZW5kZXIgdGhlIGdyYXBobGliIG9iamVjdCB1c2luZyBkMy5cbiAgICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IGRhZ3JlRDMuUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIucnVuKGdyYXBoLCBjb250YWluZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJHNjb3BlLmVkaXRvck9wdGlvbnMgPSB7XG4gICAgICBsaW5lV3JhcHBpbmcgOiB0cnVlLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgIG1vZGU6ICdzY3JpYmJsZSdcbiAgICB9O1xuXG4gIH1dKTtcblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
angular.module("scribble-ui-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/scribble/html/module.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModuleController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/protocols\">Modules</a></li>\n      <li class=\"active\">{{moduleName}}</li>\n    </ol>\n\n    <h1><b>{{moduleName}}</b> <span style=\"color:grey\">Module</span></h1>\n\n    <div class=\"row\">\n      <div class=\"col-md-9\">\n        Search: <input ng-model=\"query\">\n\n        <br>\n        <br>\n\n        <ul class=\"list-group\" >\n          <li ng-repeat=\"protocol in protocols | orderBy:nameOrderProp | filter:query\" class=\"list-group-item\" >\n            <h3><a href=\"/protocols/{{moduleName}}/{{protocol.name}}\">{{protocol.name}}</a></h3>\n            <p><i>{{protocol.description}}</i></p>\n            <div ng-if=\"protocol.author != undefined\"><h5>By: {{protocol.author}}</h5></div>\n          </li>\n        </ul>\n      </div>\n\n      <div class=\"col-md-3\">\n\n		<h2>Create a new protocol</h2>\n\n        <form name=\"newprotocolform\" class=\"css-form\" novalidate>\n          Protocol:\n          <input type=\"text\" ng-model=\"newprotocol.protocol\" name=\"protocolName\" required=\"\" />\n          <br />\n          <div ng-show=\"newprotocolform.$submitted || newprotocolform.protocolName.$touched\">\n            <span ng-show=\"newprotocolform.protocolName.$error.required\"><font color=\"red\">Enter the protocol name.</font></span>\n          </div>\n\n          <br />\n          <input type=\"button\" ng-click=\"reset(newprotocolform)\" value=\"Reset\" />\n          <input type=\"submit\" ng-click=\"create(newprotocol)\" value=\"Create\" />\n        </form>\n\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/modules.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModulesController\">\n    <h1><span style=\"color:grey\">Modules</span></h1>\n\n    <div class=\"row\">\n      <div class=\"col-md-9\">\n        Search: <input ng-model=\"query\">\n\n        <br>\n        <br>\n\n        <ul class=\"list-group\" >\n          <li ng-repeat=\"module in modules | orderBy:nameOrderProp | filter:query\" class=\"list-group-item\" >\n            <h3><a href=\"/protocols/{{module.name}}\">{{module.name}}</a></h3>\n            <p><i>Number of protocols: {{module.numberOfProtocols}}</i></p>\n          </li>\n       </ul>\n\n      </div>\n\n      <div class=\"col-md-3\">\n\n		<h2>Create a new protocol</h2>\n\n        <form name=\"newprotocolform\" class=\"css-form\" novalidate>\n          Module:\n          <input type=\"text\" ng-model=\"newprotocol.module\" name=\"moduleName\" required=\"\" />\n          <br />\n          <div ng-show=\"newprotocolform.$submitted || newprotocolform.moduleName.$touched\">\n            <div ng-show=\"newprotocolform.moduleName.$error.required\"><font color=\"red\">Enter the module name.</font></div>\n          </div>\n\n          Protocol:\n          <input type=\"text\" ng-model=\"newprotocol.protocol\" name=\"protocolName\" required=\"\" />\n          <br />\n          <div ng-show=\"newprotocolform.$submitted || newprotocolform.protocolName.$touched\">\n            <span ng-show=\"newprotocolform.protocolName.$error.required\"><font color=\"red\">Enter the protocol name.</font></span>\n          </div>\n\n          <br />\n          <input type=\"button\" ng-click=\"reset(newprotocolform)\" value=\"Reset\" />\n          <input type=\"submit\" ng-click=\"create(newprotocol)\" value=\"Create\" />\n        </form>\n\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/protocol.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ProtocolController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/protocols\">Modules</a></li>\n      <li><a href=\"/protocols/{{moduleName}}\">{{moduleName}}</a></li>\n      <li class=\"active\">{{protocolName}}</li>\n    </ol>\n\n    <h1><b>{{protocolName}}</b> <span style=\"color:grey\">Protocol</span></h1>\n\n    <a href=\"#\" editable-textarea=\"protocol.description\" e-rows=\"14\" e-cols=\"120\" rows=\"7\" >\n        <pre><i>{{ protocol.description || \'No description\' }}</i></pre>\n    </a>\n    \n    <div>\n      <button type=\"button\" class=\"btn btn-success btn-sm\" ng-click=\"saveProtocol()\">Save</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm\" ng-click=\"restoreProtocol()\">Discard</button>\n      \n      <div style=\"float: right;\">\n      <label>Roles:</label>\n      <a type=\"button\" href=\"/protocols/{{moduleName}}/{{protocolName}}/role/{{role.name}}\" class=\"btn btn-sm btn-primary\"\n      							ng-repeat=\"role in roles | orderBy:nameOrderProp\">{{role.name}}</a>\n      </div>\n    </div>\n    \n    <br>\n\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <!-- ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"protocol.definition\" ></ui-codemirror -->\n          <div ng-model=\"protocol.definition\" ui-codemirror=\"{ onLoad : codemirrorLoaded }\" ></div>\n\n          <br>\n          \n          <ul class=\"list-group\">\n            <li ng-repeat=\"marker in markers\" class=\"list-group-item\"\n            				ng-click=\"selectedMarker(marker)\"\n            				ng-class=\"{\'list-group-item-danger\': marker.severity===\'Error\', \'list-group-item-warning\': marker.severity===\'Warning\'}\" >\n              {{marker.description}}\n            </li>\n          </ul>\n        </div>\n      </div>\n\n  </div>\n</div>\n");
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
