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
/// <reference path="../libs/hawtio-utilities/defs.d.ts"/>

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
var Scribble;
(function (Scribble) {
    Scribble.pluginName = "scribble";
    Scribble.log = Logger.get(Scribble.pluginName);
    Scribble.templatePath = "plugins/scribble/html";
})(Scribble || (Scribble = {}));

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
var Scribble;
(function (Scribble) {
    Scribble._module = angular.module(Scribble.pluginName, ["xeditable", "ui.codemirror"]);
    var tab = undefined;
    Scribble._module.config(["$locationProvider", "$routeProvider", "HawtioNavBuilderProvider",
        function ($locationProvider, $routeProvider, builder) {
            tab = builder.create()
                .id(Scribble.pluginName)
                .title(function () { return "Modules"; })
                .href(function () { return "/modules"; })
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
    Scribble._module.run(function (editableOptions) {
        editableOptions.theme = 'bs3';
    });
    Scribble._module.run(["HawtioNav", function (HawtioNav) {
            HawtioNav.add(tab);
            Scribble.log.debug("loaded");
        }]);
    hawtioPluginLoader.addModule(Scribble.pluginName);
})(Scribble || (Scribble = {}));

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
var Scribble;
(function (Scribble) {
    Scribble.ModuleController = Scribble._module.controller("Scribble.ModuleController", ["$scope", "$routeParams", "$http", '$location', function ($scope, $routeParams, $http, $location) {
            $scope.moduleName = $routeParams.module;
            $scope.dirty = false;
            $scope.loading = true;
            $scope.module = {
                description: "",
                data: ""
            };
            $http.get('/scribble-server/modules/' + $scope.moduleName).success(function (data) {
                $scope.module.description = data.description;
                $scope.module.data = data.data;
                $scope.reset();
            });
            $http.get('/scribble-server/actions/roles/' + $scope.moduleName).success(function (data) {
                $scope.roles = data;
            });
            $scope.saveModule = function () {
                return $http.put('/scribble-server/modules/' + $scope.moduleName, $scope.module)
                    .success(function (data, status, headers, config) {
                    $scope.reset();
                    $scope.verify();
                });
            };
            $scope.restoreModule = function () {
                $scope.loading = true;
                $http.get('/scribble-server/modules/' + $scope.moduleName).success(function (data) {
                    $scope.module.description = data.description;
                    $scope.module.data = data.data;
                    $scope.reset();
                    $http.get('/scribble-server/actions/roles/' + $scope.moduleName).success(function (data) {
                        $scope.roles = data;
                    });
                });
            };
            $scope.reset = function () {
                $scope.dirty = false;
            };
            $scope.setDirty = function () {
                $scope.dirty = true;
            };
            $scope.isDirty = function () {
                return $scope.dirty;
            };
            $scope.selectedMarker = function (marker) {
                if ($scope.currentMarker !== undefined) {
                    $scope.currentMarker.clear();
                }
                $scope.currentMarker = $scope.doc.markText({ line: marker.startLine - 1, ch: marker.startPos }, { line: marker.endLine - 1, ch: marker.endPos }, { className: "styled-background" });
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
                _editor.on("change", function () {
                    if ($scope.loading) {
                        $scope.loading = false;
                    }
                    else {
                        $scope.setDirty();
                    }
                });
            };
            $scope.verify = function () {
                $scope.markers = undefined;
                $http.post('/scribble-server/actions/verify/' + $scope.moduleName).success(function (data) {
                    $scope.markers = data;
                    if ($scope.currentMarker !== undefined) {
                        $scope.currentMarker.clear();
                    }
                    $http.get('/scribble-server/actions/roles/' + $scope.moduleName).success(function (data) {
                        $scope.roles = data;
                    });
                });
            };
            $scope.verify();
        }]);
})(Scribble || (Scribble = {}));

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
var Scribble;
(function (Scribble) {
    Scribble.ModulesController = Scribble._module.controller("Scribble.ModulesController", ["$scope", "$http", '$location', function ($scope, $http, $location) {
            $http.get('/scribble-server/modules').success(function (data) {
                $scope.modules = data;
            });
            $scope.nameOrderProp = 'name';
            $scope.newModuleName = "";
            $scope.addModule = function () {
                var moduleDefn = { data: "module " + $scope.newModuleName +
                        ";\r\n\r\nglobal protocol ProtocolName(role A, role B) {\r\n}\r\n" };
                $http.put('/scribble-server/modules/' + $scope.newModuleName, moduleDefn).success(function (data) {
                    $location.path('/modules/' + $scope.newModuleName);
                });
            };
            $scope.deleteModule = function (name) {
                if (confirm('Are you sure you want to delete module \"' + name + '\"?')) {
                    $http.delete('/scribble-server/modules/' + name).success(function (data) {
                        console.log('Deleted module: ' + name);
                        $scope.modules.remove(name);
                    });
                }
            };
        }]);
})(Scribble || (Scribble = {}));

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
var Scribble;
(function (Scribble) {
    Scribble.RoleController = Scribble._module.controller("Scribble.RoleController", ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
            $scope.moduleName = $routeParams.module;
            $scope.roleName = $routeParams.role;
            $http.post('/scribble-server/actions/project/' + $scope.moduleName + '/' + $scope.roleName).success(function (data) {
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
var Scribble;
(function (Scribble) {
    Scribble.TraceController = Scribble._module.controller("Scribble.TraceController", ["$scope", "$routeParams", "$http", '$location', function ($scope, $routeParams, $http, $location) {
            $scope.moduleName = $routeParams.module;
            $scope.traceName = $routeParams.trace;
            $scope.dirty = false;
            $scope.loading = true;
            $scope.trace = {
                description: "",
                data: ""
            };
            $http.get('/scribble-server/traces/' + $scope.moduleName + '/' + $scope.traceName).success(function (data) {
                $scope.trace.description = data.description;
                $scope.trace.data = data.data;
                $scope.reset();
            });
            $scope.saveTrace = function () {
                return $http.put('/scribble-server/traces/' + $scope.moduleName + '/' + $scope.traceName, $scope.trace)
                    .success(function (data, status, headers, config) {
                    $scope.reset();
                    $scope.verify();
                });
            };
            $scope.restoreTrace = function () {
                $scope.loading = true;
                $http.get('/scribble-server/traces/' + $scope.moduleName + '/' + $scope.traceName).success(function (data) {
                    $scope.trace.description = data.description;
                    $scope.trace.data = data.data;
                    $scope.reset();
                });
            };
            $scope.reset = function () {
                $scope.dirty = false;
            };
            $scope.setDirty = function () {
                $scope.dirty = true;
            };
            $scope.isDirty = function () {
                return $scope.dirty;
            };
            $scope.selectedMarker = function (marker) {
                if ($scope.currentMarker !== undefined) {
                    $scope.currentMarker.clear();
                }
                $scope.currentMarker = $scope.doc.markText({ line: marker.startLine - 1, ch: marker.startPos }, { line: marker.endLine - 1, ch: marker.endPos }, { className: "styled-background" });
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
                _editor.on("change", function () {
                    if ($scope.loading) {
                        $scope.loading = false;
                    }
                    else {
                        $scope.setDirty();
                    }
                });
            };
            $scope.verify = function () {
                $scope.markers = undefined;
                $http.post('/scribble-server/actions/simulate/' + $scope.moduleName + '/' + $scope.traceName).success(function (data) {
                    $scope.markers = data;
                    if ($scope.currentMarker !== undefined) {
                        $scope.currentMarker.clear();
                    }
                });
            };
            $scope.verify();
        }]);
})(Scribble || (Scribble = {}));

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
var Scribble;
(function (Scribble) {
    Scribble.TracesController = Scribble._module.controller("Scribble.TracesController", ["$scope", "$routeParams", "$http", '$location', function ($scope, $routeParams, $http, $location) {
            $scope.moduleName = $routeParams.module;
            $scope.running = 0;
            $scope.failed = 0;
            $scope.successful = 0;
            $http.get('/scribble-server/traces/' + $scope.moduleName).success(function (data) {
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
            $http.get('/scribble-server/actions/roles/' + $scope.moduleName).success(function (data) {
                $scope.roles = data;
            });
            $scope.simulate = function (trace) {
                $scope.running = $scope.running + 1;
                $http.post('/scribble-server/actions/simulate/' + $scope.moduleName + '/' + trace.name).success(function (data) {
                    trace.issues = data;
                    $scope.running = $scope.running - 1;
                    if (data.length > 0) {
                        $scope.failed = $scope.failed + 1;
                    }
                    else {
                        $scope.successful = $scope.successful + 1;
                    }
                });
            };
            $scope.nameOrderProp = 'name';
            $scope.newTraceName = "";
            $scope.addTrace = function () {
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
                $http.put('/scribble-server/traces/' + $scope.moduleName + '/' + $scope.newTraceName, content).success(function (data) {
                    $location.path('/modules/' + $scope.moduleName + '/trace/' + $scope.newTraceName);
                });
            };
            $scope.deleteTrace = function (trace) {
                if (confirm('Are you sure you want to delete trace \"' + trace.name + '\"?')) {
                    $http.delete('/scribble-server/traces/' + $scope.moduleName + '/' + trace.name).success(function (data) {
                        console.log('Deleted trace: ' + trace.name);
                        $scope.traces.remove(trace);
                    });
                }
            };
        }]);
})(Scribble || (Scribble = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLnRzIiwic2NyaWJibGUvdHMvc2NyaWJibGVHbG9iYWxzLnRzIiwic2NyaWJibGUvdHMvc2NyaWJibGVQbHVnaW4udHMiLCJzY3JpYmJsZS90cy9tb2R1bGUudHMiLCJzY3JpYmJsZS90cy9tb2R1bGVzLnRzIiwic2NyaWJibGUvdHMvcm9sZS50cyIsInNjcmliYmxlL3RzL3RyYWNlLnRzIiwic2NyaWJibGUvdHMvdHJhY2VzLnRzIl0sIm5hbWVzIjpbIlNjcmliYmxlIl0sIm1hcHBpbmdzIjoiQUFBQSwyREFBMkQ7QUFDM0QsNERBQTREO0FBQzVELEdBQUc7QUFDSCxtRUFBbUU7QUFDbkUsb0VBQW9FO0FBQ3BFLDJDQUEyQztBQUMzQyxHQUFHO0FBQ0gsZ0RBQWdEO0FBQ2hELEdBQUc7QUFDSCx1RUFBdUU7QUFDdkUscUVBQXFFO0FBQ3JFLDRFQUE0RTtBQUM1RSx1RUFBdUU7QUFDdkUsa0NBQWtDO0FBRWxDLDBEQUEwRDs7QUNmMUQsMkRBQTJEO0FBQzNELDREQUE0RDtBQUM1RCxHQUFHO0FBQ0gsbUVBQW1FO0FBQ25FLG9FQUFvRTtBQUNwRSwyQ0FBMkM7QUFDM0MsR0FBRztBQUNILGdEQUFnRDtBQUNoRCxHQUFHO0FBQ0gsdUVBQXVFO0FBQ3ZFLHFFQUFxRTtBQUNyRSw0RUFBNEU7QUFDNUUsdUVBQXVFO0FBQ3ZFLGtDQUFrQztBQUVsQyx5Q0FBeUM7QUFDekMsSUFBTyxRQUFRLENBUWQ7QUFSRCxXQUFPLFFBQVEsRUFBQyxDQUFDO0lBRUpBLG1CQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtJQUV4QkEsWUFBR0EsR0FBbUJBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLG1CQUFVQSxDQUFDQSxDQUFDQTtJQUU3Q0EscUJBQVlBLEdBQUdBLHVCQUF1QkEsQ0FBQ0E7QUFFcERBLENBQUNBLEVBUk0sUUFBUSxLQUFSLFFBQVEsUUFRZDs7QUN4QkQsMkRBQTJEO0FBQzNELDREQUE0RDtBQUM1RCxHQUFHO0FBQ0gsbUVBQW1FO0FBQ25FLG9FQUFv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QVUsR0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUk7d0JBQzdGLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDOUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUMsQ0FBQ0E7UUFFSkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFTkEsQ0FBQ0EsRUFwRk0sUUFBUSxLQUFSLFFBQVEsUUFvRmQiLCJmaWxlIjoiY29tcGlsZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2xpYnMvaGF3dGlvLXV0aWxpdGllcy9kZWZzLmQudHNcIi8+XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBleHBvcnQgdmFyIHBsdWdpbk5hbWUgPSBcInNjcmliYmxlXCI7XG5cbiAgZXhwb3J0IHZhciBsb2c6IExvZ2dpbmcuTG9nZ2VyID0gTG9nZ2VyLmdldChwbHVnaW5OYW1lKTtcblxuICBleHBvcnQgdmFyIHRlbXBsYXRlUGF0aCA9IFwicGx1Z2lucy9zY3JpYmJsZS9odG1sXCI7XG4gXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNjcmliYmxlR2xvYmFscy50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBfbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoU2NyaWJibGUucGx1Z2luTmFtZSwgW1wieGVkaXRhYmxlXCIsXCJ1aS5jb2RlbWlycm9yXCJdKTtcblxuICB2YXIgdGFiID0gdW5kZWZpbmVkO1xuXG4gIF9tb2R1bGUuY29uZmlnKFtcIiRsb2NhdGlvblByb3ZpZGVyXCIsIFwiJHJvdXRlUHJvdmlkZXJcIiwgXCJIYXd0aW9OYXZCdWlsZGVyUHJvdmlkZXJcIixcbiAgICAoJGxvY2F0aW9uUHJvdmlkZXIsICRyb3V0ZVByb3ZpZGVyOiBuZy5yb3V0ZS5JUm91dGVQcm92aWRlciwgYnVpbGRlcjogSGF3dGlvTWFpbk5hdi5CdWlsZGVyRmFjdG9yeSkgPT4ge1xuICAgIHRhYiA9IGJ1aWxkZXIuY3JlYXRlKClcbiAgICAgIC5pZChTY3JpYmJsZS5wbHVnaW5OYW1lKVxuICAgICAgLnRpdGxlKCgpID0+IFwiTW9kdWxlc1wiKVxuICAgICAgLmhyZWYoKCkgPT4gXCIvbW9kdWxlc1wiKVxuICAgICAgLmJ1aWxkKCk7XG4gICAgYnVpbGRlci5jb25maWd1cmVSb3V0aW5nKCRyb3V0ZVByb3ZpZGVyLCB0YWIpO1xuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAkcm91dGVQcm92aWRlci5cbiAgICAgIHdoZW4oJy9tb2R1bGVzJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BsdWdpbnMvc2NyaWJibGUvaHRtbC9tb2R1bGVzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnU2NyaWJibGUuTW9kdWxlc0NvbnRyb2xsZXInXG4gICAgICB9KS5cbiAgICAgIHdoZW4oJy9tb2R1bGVzLzptb2R1bGUnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGx1Z2lucy9zY3JpYmJsZS9odG1sL21vZHVsZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1NjcmliYmxlLk1vZHVsZUNvbnRyb2xsZXInXG4gICAgICB9KS5cbiAgICAgIHdoZW4oJy9tb2R1bGVzLzptb2R1bGUvcm9sZS86cm9sZScsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwbHVnaW5zL3NjcmliYmxlL2h0bWwvcm9sZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1NjcmliYmxlLlJvbGVDb250cm9sbGVyJ1xuICAgICAgfSkuXG4gICAgICB3aGVuKCcvbW9kdWxlcy86bW9kdWxlL3RyYWNlJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BsdWdpbnMvc2NyaWJibGUvaHRtbC90cmFjZXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTY3JpYmJsZS5UcmFjZXNDb250cm9sbGVyJ1xuICAgICAgfSkuXG4gICAgICB3aGVuKCcvbW9kdWxlcy86bW9kdWxlL3RyYWNlLzp0cmFjZScsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwbHVnaW5zL3NjcmliYmxlL2h0bWwvdHJhY2UuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTY3JpYmJsZS5UcmFjZUNvbnRyb2xsZXInXG4gICAgICB9KTtcbiAgfV0pO1xuXG4gIF9tb2R1bGUucnVuKGZ1bmN0aW9uKGVkaXRhYmxlT3B0aW9ucykge1xuICAgIGVkaXRhYmxlT3B0aW9ucy50aGVtZSA9ICdiczMnOyAvLyBib290c3RyYXAzIHRoZW1lLiBDYW4gYmUgYWxzbyAnYnMyJywgJ2RlZmF1bHQnXG4gIH0pO1xuXG4gIF9tb2R1bGUucnVuKFtcIkhhd3Rpb05hdlwiLCAoSGF3dGlvTmF2OiBIYXd0aW9NYWluTmF2LlJlZ2lzdHJ5KSA9PiB7XG4gICAgSGF3dGlvTmF2LmFkZCh0YWIpO1xuICAgIGxvZy5kZWJ1ZyhcImxvYWRlZFwiKTtcbiAgfV0pO1xuXG5cbiAgaGF3dGlvUGx1Z2luTG9hZGVyLmFkZE1vZHVsZShTY3JpYmJsZS5wbHVnaW5OYW1lKTtcbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVQbHVnaW4udHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGV4cG9ydCB2YXIgTW9kdWxlQ29udHJvbGxlciA9IF9tb2R1bGUuY29udHJvbGxlcihcIlNjcmliYmxlLk1vZHVsZUNvbnRyb2xsZXJcIiwgW1wiJHNjb3BlXCIsIFwiJHJvdXRlUGFyYW1zXCIsIFwiJGh0dHBcIiwgJyRsb2NhdGlvbicsICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGh0dHAsICRsb2NhdGlvbikgPT4ge1xuXG4gICAgJHNjb3BlLm1vZHVsZU5hbWUgPSAkcm91dGVQYXJhbXMubW9kdWxlO1xuICAgICRzY29wZS5kaXJ0eSA9IGZhbHNlO1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICBcbiAgICAkc2NvcGUubW9kdWxlID0ge1xuICAgICAgZGVzY3JpcHRpb246IFwiXCIsXG4gICAgICBkYXRhOiBcIlwiXG4gICAgfTtcbiAgICBcbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvbW9kdWxlcy8nKyRzY29wZS5tb2R1bGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5tb2R1bGUuZGVzY3JpcHRpb24gPSBkYXRhLmRlc2NyaXB0aW9uO1xuICAgICAgJHNjb3BlLm1vZHVsZS5kYXRhID0gZGF0YS5kYXRhO1xuICAgICAgJHNjb3BlLnJlc2V0KCk7XG4gICAgfSk7XG5cbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvYWN0aW9ucy9yb2xlcy8nKyRzY29wZS5tb2R1bGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5yb2xlcyA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2F2ZU1vZHVsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwLnB1dCgnL3NjcmliYmxlLXNlcnZlci9tb2R1bGVzLycrJHNjb3BlLm1vZHVsZU5hbWUsICRzY29wZS5tb2R1bGUpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHNjb3BlLnJlc2V0KCk7XG4gICAgICAgICRzY29wZS52ZXJpZnkoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVzdG9yZU1vZHVsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvbW9kdWxlcy8nKyRzY29wZS5tb2R1bGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLm1vZHVsZS5kZXNjcmlwdGlvbiA9IGRhdGEuZGVzY3JpcHRpb247XG4gICAgICAgICRzY29wZS5tb2R1bGUuZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgICAgJHNjb3BlLnJlc2V0KCk7XG5cbiAgICAgICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL2FjdGlvbnMvcm9sZXMvJyskc2NvcGUubW9kdWxlTmFtZSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgJHNjb3BlLnJvbGVzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmRpcnR5ID0gZmFsc2U7XG4gICAgfTtcblxuICAgICRzY29wZS5zZXREaXJ0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmRpcnR5ID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmlzRGlydHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkc2NvcGUuZGlydHk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZWxlY3RlZE1hcmtlciA9IGZ1bmN0aW9uKG1hcmtlcikge1xuICAgICAgaWYgKCRzY29wZS5jdXJyZW50TWFya2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRNYXJrZXIuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmN1cnJlbnRNYXJrZXIgPSAkc2NvcGUuZG9jLm1hcmtUZXh0KFxuICAgICAgICB7bGluZTogbWFya2VyLnN0YXJ0TGluZS0xLCBjaDogbWFya2VyLnN0YXJ0UG9zfSxcbiAgICAgICAge2xpbmU6IG1hcmtlci5lbmRMaW5lLTEsIGNoOiBtYXJrZXIuZW5kUG9zfSxcbiAgICAgICAge2NsYXNzTmFtZTogXCJzdHlsZWQtYmFja2dyb3VuZFwifVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmVkaXRvck9wdGlvbnMgPSB7XG4gICAgICBsaW5lV3JhcHBpbmcgOiB0cnVlLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICBtb2RlOiAnc2NyaWJibGUnXG4gICAgfTtcblxuICAgICRzY29wZS5uYW1lT3JkZXJQcm9wID0gJ25hbWUnO1xuXG4gICAgJHNjb3BlLmNvZGVtaXJyb3JMb2FkZWQgPSBmdW5jdGlvbihfZWRpdG9yKSB7XG4gICAgICAkc2NvcGUuZWRpdG9yID0gX2VkaXRvcjtcbiAgICAgICRzY29wZS5kb2MgPSBfZWRpdG9yLmdldERvYygpO1xuICAgICAgXG4gICAgICAvLyBFZGl0b3IgcGFydFxuICAgICAgX2VkaXRvci5mb2N1cygpO1xuXG4gICAgICAvLyBPcHRpb25zXG4gICAgICBfZWRpdG9yLnNldE9wdGlvbignbGluZVdyYXBwaW5nJywgdHJ1ZSk7XG4gICAgICBfZWRpdG9yLnNldE9wdGlvbignbGluZU51bWJlcnMnLCB0cnVlKTtcbiAgICAgIF9lZGl0b3Iuc2V0T3B0aW9uKCdtb2RlJywgJ3NjcmliYmxlJyk7XG4gICAgICBcbiAgICAgICRzY29wZS5kb2MubWFya0NsZWFuKCk7XG4gICAgICBcbiAgICAgIF9lZGl0b3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLnNldERpcnR5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUudmVyaWZ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUubWFya2VycyA9IHVuZGVmaW5lZDtcbiAgICBcbiAgICAgICRodHRwLnBvc3QoJy9zY3JpYmJsZS1zZXJ2ZXIvYWN0aW9ucy92ZXJpZnkvJyskc2NvcGUubW9kdWxlTmFtZSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRzY29wZS5tYXJrZXJzID0gZGF0YTtcblxuICAgICAgICBpZiAoJHNjb3BlLmN1cnJlbnRNYXJrZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICRzY29wZS5jdXJyZW50TWFya2VyLmNsZWFyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvYWN0aW9ucy9yb2xlcy8nKyRzY29wZS5tb2R1bGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAkc2NvcGUucm9sZXMgPSBkYXRhO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgJHNjb3BlLnZlcmlmeSgpO1xuICB9XSk7XG5cbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVQbHVnaW4udHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGV4cG9ydCB2YXIgTW9kdWxlc0NvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJTY3JpYmJsZS5Nb2R1bGVzQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCIkaHR0cFwiLCAnJGxvY2F0aW9uJywgKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbikgPT4ge1xuXG4gICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL21vZHVsZXMnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5tb2R1bGVzID0gZGF0YTtcbiAgICB9KTtcblxuICAgICRzY29wZS5uYW1lT3JkZXJQcm9wID0gJ25hbWUnO1xuXG4gICAgJHNjb3BlLm5ld01vZHVsZU5hbWUgPSBcIlwiO1xuXG4gICAgJHNjb3BlLmFkZE1vZHVsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG1vZHVsZURlZm4gPSB7IGRhdGE6IFwibW9kdWxlIFwiKyRzY29wZS5uZXdNb2R1bGVOYW1lK1xuICAgICAgICAgICAgICBcIjtcXHJcXG5cXHJcXG5nbG9iYWwgcHJvdG9jb2wgUHJvdG9jb2xOYW1lKHJvbGUgQSwgcm9sZSBCKSB7XFxyXFxufVxcclxcblwiIH07XG4gICAgICBcdFx0XG4gICAgICAkaHR0cC5wdXQoJy9zY3JpYmJsZS1zZXJ2ZXIvbW9kdWxlcy8nKyRzY29wZS5uZXdNb2R1bGVOYW1lLCBtb2R1bGVEZWZuKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tb2R1bGVzLycrJHNjb3BlLm5ld01vZHVsZU5hbWUpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5kZWxldGVNb2R1bGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBtb2R1bGUgXFxcIicrbmFtZSsnXFxcIj8nKSkge1xuICAgICAgICAkaHR0cC5kZWxldGUoJy9zY3JpYmJsZS1zZXJ2ZXIvbW9kdWxlcy8nK25hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdEZWxldGVkIG1vZHVsZTogJytuYW1lKTtcbiAgICAgICAgICAkc2NvcGUubW9kdWxlcy5yZW1vdmUobmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgfV0pO1xuXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNjcmliYmxlUGx1Z2luLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBkZWNsYXJlIHZhciBncmFwaGxpYkRvdDogYW55O1xuICBkZWNsYXJlIHZhciBkYWdyZUQzOiBhbnk7XG4gXG4gIGV4cG9ydCB2YXIgUm9sZUNvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJTY3JpYmJsZS5Sb2xlQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCIkaHR0cFwiLCAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRodHRwKSA9PiB7XG5cbiAgICAkc2NvcGUubW9kdWxlTmFtZSA9ICRyb3V0ZVBhcmFtcy5tb2R1bGU7XG4gICAgJHNjb3BlLnJvbGVOYW1lID0gJHJvdXRlUGFyYW1zLnJvbGU7XG4gICAgXG4gICAgJGh0dHAucG9zdCgnL3NjcmliYmxlLXNlcnZlci9hY3Rpb25zL3Byb2plY3QvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrJHNjb3BlLnJvbGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5wcm9qZWN0aW9uID0gZGF0YTtcbiAgICAgIFxuICAgICAgaWYgKCRzY29wZS5wcm9qZWN0aW9uLmdyYXBoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gUHJvZHVjZSBncmFwaCBieSBwYXJzaW5nIHRoZSBET1Qgc3ludGF4IGludG8gYSBncmFwaGxpYiBvYmplY3QuXG4gICAgICAgIHZhciBncmFwaCA9IGdyYXBobGliRG90LnBhcnNlKCRzY29wZS5wcm9qZWN0aW9uLmdyYXBoKTtcbiAgICBcbiAgICAgICAgdmFyIGNvbnRhaW5lcj1kMy5zZWxlY3QoXCJzdmcgZ1wiKTtcbiAgICAgIFxuICAgICAgICAvLyBSZW5kZXIgdGhlIGdyYXBobGliIG9iamVjdCB1c2luZyBkMy5cbiAgICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IGRhZ3JlRDMuUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIucnVuKGdyYXBoLCBjb250YWluZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJHNjb3BlLmVkaXRvck9wdGlvbnMgPSB7XG4gICAgICBsaW5lV3JhcHBpbmcgOiB0cnVlLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgIG1vZGU6ICdzY3JpYmJsZSdcbiAgICB9O1xuXG4gIH1dKTtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzY3JpYmJsZVBsdWdpbi50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBUcmFjZUNvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJTY3JpYmJsZS5UcmFjZUNvbnRyb2xsZXJcIiwgW1wiJHNjb3BlXCIsIFwiJHJvdXRlUGFyYW1zXCIsIFwiJGh0dHBcIiwgJyRsb2NhdGlvbicsICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGh0dHAsICRsb2NhdGlvbikgPT4ge1xuXG4gICAgJHNjb3BlLm1vZHVsZU5hbWUgPSAkcm91dGVQYXJhbXMubW9kdWxlO1xuICAgICRzY29wZS50cmFjZU5hbWUgPSAkcm91dGVQYXJhbXMudHJhY2U7XG4gICAgJHNjb3BlLmRpcnR5ID0gZmFsc2U7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgIFxuICAgICRzY29wZS50cmFjZSA9IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlwiLFxuICAgICAgZGF0YTogXCJcIlxuICAgIH07XG4gICAgXG4gICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL3RyYWNlcy8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUudHJhY2VOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS50cmFjZS5kZXNjcmlwdGlvbiA9IGRhdGEuZGVzY3JpcHRpb247XG4gICAgICAkc2NvcGUudHJhY2UuZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgICRzY29wZS5yZXNldCgpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNhdmVUcmFjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwLnB1dCgnL3NjcmliYmxlLXNlcnZlci90cmFjZXMvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrJHNjb3BlLnRyYWNlTmFtZSwgJHNjb3BlLnRyYWNlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICRzY29wZS5yZXNldCgpO1xuICAgICAgICAkc2NvcGUudmVyaWZ5KCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlc3RvcmVUcmFjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvdHJhY2VzLycrJHNjb3BlLm1vZHVsZU5hbWUrJy8nKyRzY29wZS50cmFjZU5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUudHJhY2UuZGVzY3JpcHRpb24gPSBkYXRhLmRlc2NyaXB0aW9uO1xuICAgICAgICAkc2NvcGUudHJhY2UuZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgICAgJHNjb3BlLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmRpcnR5ID0gZmFsc2U7XG4gICAgfTtcblxuICAgICRzY29wZS5zZXREaXJ0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmRpcnR5ID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmlzRGlydHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkc2NvcGUuZGlydHk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZWxlY3RlZE1hcmtlciA9IGZ1bmN0aW9uKG1hcmtlcikge1xuICAgICAgaWYgKCRzY29wZS5jdXJyZW50TWFya2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRNYXJrZXIuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmN1cnJlbnRNYXJrZXIgPSAkc2NvcGUuZG9jLm1hcmtUZXh0KFxuICAgICAgICB7bGluZTogbWFya2VyLnN0YXJ0TGluZS0xLCBjaDogbWFya2VyLnN0YXJ0UG9zfSxcbiAgICAgICAge2xpbmU6IG1hcmtlci5lbmRMaW5lLTEsIGNoOiBtYXJrZXIuZW5kUG9zfSxcbiAgICAgICAge2NsYXNzTmFtZTogXCJzdHlsZWQtYmFja2dyb3VuZFwifVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmVkaXRvck9wdGlvbnMgPSB7XG4gICAgICBsaW5lV3JhcHBpbmcgOiB0cnVlLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICBtb2RlOiAnc2NyaWJibGUnXG4gICAgfTtcblxuICAgICRzY29wZS5uYW1lT3JkZXJQcm9wID0gJ25hbWUnO1xuXG4gICAgJHNjb3BlLmNvZGVtaXJyb3JMb2FkZWQgPSBmdW5jdGlvbihfZWRpdG9yKSB7XG4gICAgICAkc2NvcGUuZWRpdG9yID0gX2VkaXRvcjtcbiAgICAgICRzY29wZS5kb2MgPSBfZWRpdG9yLmdldERvYygpO1xuICAgICAgXG4gICAgICAvLyBFZGl0b3IgcGFydFxuICAgICAgX2VkaXRvci5mb2N1cygpO1xuXG4gICAgICAvLyBPcHRpb25zXG4gICAgICBfZWRpdG9yLnNldE9wdGlvbignbGluZVdyYXBwaW5nJywgdHJ1ZSk7XG4gICAgICBfZWRpdG9yLnNldE9wdGlvbignbGluZU51bWJlcnMnLCB0cnVlKTtcbiAgICAgIF9lZGl0b3Iuc2V0T3B0aW9uKCdtb2RlJywgJ3NjcmliYmxlJyk7XG4gICAgICBcbiAgICAgICRzY29wZS5kb2MubWFya0NsZWFuKCk7XG4gICAgICBcbiAgICAgIF9lZGl0b3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLnNldERpcnR5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUudmVyaWZ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUubWFya2VycyA9IHVuZGVmaW5lZDtcbiAgICBcbiAgICAgICRodHRwLnBvc3QoJy9zY3JpYmJsZS1zZXJ2ZXIvYWN0aW9ucy9zaW11bGF0ZS8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUudHJhY2VOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLm1hcmtlcnMgPSBkYXRhO1xuXG4gICAgICAgIGlmICgkc2NvcGUuY3VycmVudE1hcmtlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgJHNjb3BlLmN1cnJlbnRNYXJrZXIuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICAkc2NvcGUudmVyaWZ5KCk7XG4gIH1dKTtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzY3JpYmJsZVBsdWdpbi50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBUcmFjZXNDb250cm9sbGVyID0gX21vZHVsZS5jb250cm9sbGVyKFwiU2NyaWJibGUuVHJhY2VzQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCIkaHR0cFwiLCAnJGxvY2F0aW9uJywgKCRzY29wZSwgJHJvdXRlUGFyYW1zLCAkaHR0cCwgJGxvY2F0aW9uKSA9PiB7XG5cbiAgICAkc2NvcGUubW9kdWxlTmFtZSA9ICRyb3V0ZVBhcmFtcy5tb2R1bGU7XG5cbiAgICAkc2NvcGUucnVubmluZyA9IDA7XG4gICAgJHNjb3BlLmZhaWxlZCA9IDA7XG4gICAgJHNjb3BlLnN1Y2Nlc3NmdWwgPSAwO1xuXG4gICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL3RyYWNlcy8nKyRzY29wZS5tb2R1bGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS50cmFjZXMgPSBbXTtcbiAgICAgIFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0cmFjZSA9IHtcbiAgICAgICAgICBuYW1lOiBkYXRhW2ldLFxuICAgICAgICAgIGlzc3VlczogdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS50cmFjZXMucHVzaCh0cmFjZSk7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuc2ltdWxhdGUodHJhY2UpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgICRodHRwLmdldCgnL3NjcmliYmxlLXNlcnZlci9hY3Rpb25zL3JvbGVzLycrJHNjb3BlLm1vZHVsZU5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgJHNjb3BlLnJvbGVzID0gZGF0YTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zaW11bGF0ZSA9IGZ1bmN0aW9uKHRyYWNlKSB7XG4gICAgICAkc2NvcGUucnVubmluZyA9ICRzY29wZS5ydW5uaW5nICsgMTtcblxuICAgICAgJGh0dHAucG9zdCgnL3NjcmliYmxlLXNlcnZlci9hY3Rpb25zL3NpbXVsYXRlLycrJHNjb3BlLm1vZHVsZU5hbWUrJy8nK3RyYWNlLm5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0cmFjZS5pc3N1ZXMgPSBkYXRhO1xuXG4gICAgICAgICRzY29wZS5ydW5uaW5nID0gJHNjb3BlLnJ1bm5pbmcgLSAxO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICRzY29wZS5mYWlsZWQgPSAkc2NvcGUuZmFpbGVkICsgMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuc3VjY2Vzc2Z1bCA9ICRzY29wZS5zdWNjZXNzZnVsICsgMTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5uYW1lT3JkZXJQcm9wID0gJ25hbWUnO1xuXG4gICAgJHNjb3BlLm5ld1RyYWNlTmFtZSA9IFwiXCI7XG5cbiAgICAkc2NvcGUuYWRkVHJhY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzdGVwcyA9IFtdO1xuXG4gICAgICB2YXIgc3RlcCA9IHtcbiAgICAgICAgdHlwZTogXCJNZXNzYWdlVHJhbnNmZXJcIixcbiAgICAgICAgbWVzc2FnZToge1xuICAgICAgICAgIG9wZXJhdG9yOiBcIm5hbWVcIixcbiAgICAgICAgICB0eXBlczogW1widHlwZVwiXSxcbiAgICAgICAgICB2YWx1ZXM6IFtcIlwiXVxuICAgICAgICB9LFxuICAgICAgICBmcm9tUm9sZTogXCJGcm9tUm9sZVwiLFxuICAgICAgICB0b1JvbGVzOiBbXCJUb1JvbGVcIl1cbiAgICAgIH07XG4gICAgICBcbiAgICAgIHN0ZXBzLnB1c2goc3RlcCk7XG5cbiAgICAgIHZhciBjb250ZW50ID0ge1xuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShzdGVwcywgbnVsbCwgMilcbiAgICAgIH07XG5cbiAgICAgICRodHRwLnB1dCgnL3NjcmliYmxlLXNlcnZlci90cmFjZXMvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrJHNjb3BlLm5ld1RyYWNlTmFtZSwgY29udGVudCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbW9kdWxlcy8nKyRzY29wZS5tb2R1bGVOYW1lKycvdHJhY2UvJyskc2NvcGUubmV3VHJhY2VOYW1lKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZGVsZXRlVHJhY2UgPSBmdW5jdGlvbih0cmFjZSkge1xuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdHJhY2UgXFxcIicrdHJhY2UubmFtZSsnXFxcIj8nKSkge1xuICAgICAgICAkaHR0cC5kZWxldGUoJy9zY3JpYmJsZS1zZXJ2ZXIvdHJhY2VzLycrJHNjb3BlLm1vZHVsZU5hbWUrJy8nK3RyYWNlLm5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdEZWxldGVkIHRyYWNlOiAnK3RyYWNlLm5hbWUpO1xuICAgICAgICAgICRzY29wZS50cmFjZXMucmVtb3ZlKHRyYWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICB9XSk7XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

angular.module("scribble-ui-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/scribble/html/module.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModuleController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/modules\">Modules</a></li>\n      <li class=\"active\">{{moduleName}}</li>\n    </ol>\n\n    <h1><b>{{moduleName}}</b> <span style=\"color:grey\">Module</span></h1>\n\n    <a href=\"#\" editable-textarea=\"module.description\" e-rows=\"14\" e-cols=\"120\" rows=\"7\" onaftersave=\"setDirty()\" >\n        <pre><i>{{ module.description || \'No description\' }}</i></pre>\n    </a>\n    \n    <div>\n      <button type=\"button\" class=\"btn btn-success btn-sm\" ng-disabled=\"!dirty || loading\" ng-click=\"saveModule()\">Save</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm\" ng-disabled=\"!dirty || loading\" ng-click=\"restoreModule()\">Discard</button>\n      \n      <div style=\"float: right;\">\n        <label ng-show=\"roles.length > 0\">Roles:</label>\n        <a type=\"button\" href=\"/modules/{{moduleName}}/role/{{role}}\" class=\"btn btn-sm btn-primary\"\n      							ng-repeat=\"role in roles\">{{role}}</a>\n        <label>    </label>\n        <a type=\"button\" href=\"/modules/{{moduleName}}/trace\" class=\"btn btn-sm btn-info\">Traces</a>\n      </div>\n    </div>\n    \n    <br>\n\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <!-- ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"module.definition\" ></ui-codemirror -->\n          <div ng-model=\"module.data\" ui-codemirror=\"{ onLoad : codemirrorLoaded }\" ></div>\n\n          <br>\n          \n          <div class=\"text-center\" ng-hide=\"markers !== undefined\">\n            <div class=\"spinner spinner-lg\"></div>\n            <p>Verifying module ...</p>\n          </div>\n          \n          <ul class=\"list-group\" ng-show=\"markers !== undefined\">\n            <li ng-repeat=\"marker in markers\" class=\"list-group-item\"\n            				ng-click=\"selectedMarker(marker)\"\n            				ng-class=\"{\'list-group-item-danger\': marker.severity===\'Error\', \'list-group-item-warning\': marker.severity===\'Warning\'}\" >\n              {{marker.description}}\n            </li>\n          </ul>\n        </div>\n      </div>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/modules.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModulesController\">\n\n    <br>\n\n     <form class=\"form-horizontal\" name=\"addModuleForm\" role=\"form\" novalidate >\n      <div class=\"form-group input\">\n        <div class=\"col-lg-6 col-sm-8 col-xs-12\">\n          <div class=\"input-group input-group-lg\">\n            <input type=\"text\" class=\"form-control\" name=\"newModuleNameField\"\n                 ng-model=\"newModuleName\" ng-model-options=\"{ updateOn: \'default blur\'}\"\n                 placeholder=\"Enter a new module name\" required>\n            <span class=\"input-group-btn\">\n              <input class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"!newModuleName\" ng-click=\"addModule()\" value=\"Add\" />\n            </span>\n          </div>\n        </div>\n      </div>\n    </form>\n \n    <div class=\"row\">\n      <div class=\"col-md-12\">\n      \n        <div>\n        Search: <input ng-model=\"query\">\n        </div>\n\n        <br>\n        <br>\n\n        <ul class=\"list-group\" >\n          <li ng-repeat=\"module in modules | filter:query\" class=\"list-group-item\" >\n            <h3><a href=\"/modules/{{module}}\">{{module}}</a>\n            <span class=\"pull-right\">\n              <a href=\"#\" ng-click=\"deleteModule(module)\"><i class=\"fa fa-trash-o\"></i></a>\n            </span>\n            </h3>\n          </li>\n       </ul>\n      </div>\n\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/role.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.RoleController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/\">Modules</a></li>\n      <li><a href=\"/modules/{{moduleName}}\">{{moduleName}}</a></li>\n      <li class=\"active\">{{roleName}}</li>\n    </ol>\n\n    <h1><b>{{roleName}}</b> <span style=\"color:grey\">Role</span></h1>\n\n<!-- Comment out tabs for now until work out how to resize graph (issue 16)\n    <ul class=\"nav nav-tabs\">\n      <li class=\"active\"><a data-toggle=\"tab\" href=\"#projection\">Projection</a></li>\n      <li><a data-toggle=\"tab\" href=\"#graph\">Graph</a></li>\n    </ul>\n\n    <div class=\"tab-content\">\n      <div id=\"projection\" class=\"tab-pane fade in active\">\n-->\n        <div class=\"row\">\n          <div class=\"col-md-12\">\n            <ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"projection.definition\" ></ui-codemirror>\n          </div>\n        </div>\n<!--\n      </div>\n      <div id=\"graph\" class=\"tab-pane fade\">\n-->\n		<br>\n\n        <div class=\"row\">\n          <div class=\"col-md-12\">\n            <svg id=\"graphContainer\" height=\"400\" width=\"400\">\n              <g height=\"400\" width=\"400\"/>\n            </svg>\n          </div>\n        </div>\n<!--\n      </div>\n    </div>\n-->\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/trace.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.TraceController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/\">Modules</a></li>\n      <li><a href=\"/modules/{{moduleName}}\">{{moduleName}}</a></li>\n      <li><a href=\"/modules/{{moduleName}}/trace\">Traces</a></li>\n      <li class=\"active\">{{traceName}}</li>\n    </ol>\n\n    <h1><b>{{traceName}}</b> <span style=\"color:grey\">Trace</span></h1>\n\n    <a href=\"#\" editable-textarea=\"trace.description\" e-rows=\"14\" e-cols=\"120\" rows=\"7\" onaftersave=\"setDirty()\" >\n        <pre><i>{{ trace.description || \'No description\' }}</i></pre>\n    </a>\n    \n    <div>\n      <button type=\"button\" class=\"btn btn-success btn-sm\" ng-disabled=\"!dirty || loading\" ng-click=\"saveTrace()\">Save</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm\" ng-disabled=\"!dirty || loading\" ng-click=\"restoreTrace()\">Discard</button>\n    </div>\n    \n    <br>\n\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <!-- ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"module.definition\" ></ui-codemirror -->\n          <div ng-model=\"trace.data\" ui-codemirror=\"{ onLoad : codemirrorLoaded }\" ></div>\n\n          <br>\n          \n          <div class=\"text-center\" ng-hide=\"markers !== undefined\">\n            <div class=\"spinner spinner-lg\"></div>\n            <p>Verifying trace and simulating ...</p>\n          </div>\n          \n          <ul class=\"list-group\" ng-show=\"markers !== undefined\">\n            <li ng-repeat=\"marker in markers\" class=\"list-group-item\"\n            				ng-click=\"selectedMarker(marker)\"\n            				ng-class=\"{\'list-group-item-danger\': marker.severity===\'Error\', \'list-group-item-warning\': marker.severity===\'Warning\'}\" >\n              {{marker.description}}\n            </li>\n          </ul>\n        </div>\n      </div>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/traces.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.TracesController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/\">Modules</a></li>\n      <li><a href=\"/modules/{{moduleName}}\">{{moduleName}}</a></li>\n      <li class=\"active\">Traces</li>\n    </ol>\n\n    <h1><b>{{moduleName}}</b> <span style=\"color:grey\">Traces</span></h1>\n\n    <br>\n\n     <form class=\"form-horizontal\" name=\"addTraceForm\" role=\"form\" novalidate >\n      <div class=\"form-group input\">\n        <div class=\"col-lg-6 col-sm-8 col-xs-12\">\n          <div class=\"input-group input-group-lg\">\n            <input type=\"text\" class=\"form-control\" name=\"newTraceNameField\"\n                 ng-model=\"newTraceName\" ng-model-options=\"{ updateOn: \'default blur\'}\"\n                 placeholder=\"Enter a new trace name\" required>\n            <span class=\"input-group-btn\">\n              <input class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"!newTraceName\" ng-click=\"addTrace()\" value=\"Add\" />\n            </span>\n          </div>\n        </div>\n      </div>\n    </form>\n \n    <div class=\"row\">\n      <div class=\"col-md-12\">\n      \n        <div>\n        Search: <input ng-model=\"query\">\n\n      <div style=\"float: right;\">\n        <a type=\"button\" href=\"#\" class=\"btn btn-sm btn-info\" ng-hide=\"running === 0\">Simulating {{running}}</a>\n        <label>    </label>\n        <a type=\"button\" href=\"#\" class=\"btn btn-sm btn-success\" ng-hide=\"successful === 0\">Successful {{successful}}</a>\n        <label>    </label>\n        <a type=\"button\" href=\"#\" class=\"btn btn-sm btn-danger\" ng-hide=\"failed === 0\">Failed {{failed}}</a>\n      </div>\n        </div>\n\n        <br>\n        <br>\n\n        <ul class=\"list-group\" >\n          <li ng-repeat=\"trace in traces | filter:query\" class=\"list-group-item\" >\n            \n            <h3>\n            <i class=\"fa fa-spinner fa-pulse\" ng-hide=\"trace.issues !== undefined\"></i>\n            <i class=\"glyphicon glyphicon-ok\" style=\"color:green\" ng-show=\"trace.issues.length === 0\"></i>\n            <i class=\"glyphicon glyphicon-remove\" style=\"color:red\" ng-show=\"trace.issues.length > 0\"></i>\n            <a href=\"/modules/{{moduleName}}/trace/{{trace.name}}\">{{trace.name}}</a>\n            <span class=\"pull-right\">\n              <a href=\"#\" ng-click=\"deleteTrace(trace)\"><i class=\"fa fa-trash-o\"></i></a>\n            </span>\n            </h3>\n\n            <ul class=\"list-group\" ng-show=\"trace.issues.length > 0\">\n              <li ng-repeat=\"issue in trace.issues\" class=\"list-group-item\"\n            				ng-class=\"{\'list-group-item-danger\': issue.severity===\'Error\', \'list-group-item-warning\': issue.severity===\'Warning\'}\" >\n                {{issue.description}}\n              </li>\n            </ul>\n          </li>\n       </ul>\n      </div>\n\n    </div>\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("scribble-ui-templates");
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
