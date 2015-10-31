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
            $scope.master = {};
            $scope.create = function (newmodule) {
                var moduleDefn = { data: "module " + newmodule.name +
                        ";\r\n\r\nglobal protocol ProtocolName(role A, role B) {\r\n}\r\n" };
                $http.put('/scribble-server/modules/' + newmodule.name, moduleDefn).success(function (data) {
                    $location.path('/modules/' + newmodule.name);
                });
            };
            $scope.reset = function (form) {
                if (form) {
                    form.$setPristine();
                    form.$setUntouched();
                }
                $scope.newmodule = angular.copy($scope.master);
            };
            $scope.reset();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLnRzIiwic2NyaWJibGUvdHMvc2NyaWJibGVHbG9iYWxzLnRzIiwic2NyaWJibGUvdHMvc2NyaWJibGVQbHVnaW4udHMiLCJzY3JpYmJsZS90cy9tb2R1bGUudHMiLCJzY3JpYmJsZS90cy9tb2R1bGVzLnRzIiwic2NyaWJibGUvdHMvcm9sZS50cyJdLCJuYW1lcyI6WyJTY3JpYmJsZSJdLCJtYXBwaW5ncyI6IkFBQUEsMkRBQTJEO0FBQzNELDREQUE0RDtBQUM1RCxHQUFHO0FBQ0gsbUVBQW1FO0FBQ25FLG9FQUFvRTtBQUNwRSwyQ0FBMkM7QUFDM0MsR0FBRztBQUNILGdEQUFnRDtBQUNoRCxHQUFHO0FBQ0gsdUVBQXVFO0FBQ3ZFLHFFQUFxRTtBQUNyRSw0RUFBNEU7QUFDNUUsdUVBQXVFO0FBQ3ZFLGtDQUFrQztBQUVsQywwREFBMEQ7O0FDZjFELDJEQUEyRDtBQUMzRCw0REFBNEQ7QUFDNUQsR0FBRztBQUNILG1FQUFtRTtBQUNuRSxvRUFBb0U7QUFDcEUsMkNBQTJDO0FBQzNDLEdBQUc7QUFDSCxnREFBZ0Q7QUFDaEQsR0FBRztBQUNILHVFQUF1RTtBQUN2RSxxRUFBcUU7QUFDckUsNEVBQTRFO0FBQzVFLHVFQUF1RTtBQUN2RSxrQ0FBa0M7QUFFbEMseUNBQXlDO0FBQ3pDLElBQU8sUUFBUSxDQVFkO0FBUkQsV0FBTyxRQUFRLEVBQUMsQ0FBQztJQUVKQSxtQkFBVUEsR0FBR0EsVUFBVUEsQ0FBQ0E7SUFFeEJBLFlBQUdBLEdBQW1CQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxtQkFBVUEsQ0FBQ0EsQ0FBQ0E7SUFFN0NBLHFCQUFZQSxHQUFHQSx1QkFBdUJBLENBQUNBO0FBRXBEQSxDQUFDQSxFQVJNLFFBQVEsS0FBUixRQUFRLFFBUWQ7O0FDeEJELDJEQUEyRDtBQUMzRCw0REFBNEQ7QUFDNUQsR0FBRztBQUNILG1FQUFtRTtBQUNuRSxvRUFBb0U7QUFDcEUsMkNBQTJDO0FBQzNDLEdBQUc7QUFDSCxnREFBZ0Q7QUFDaEQsR0FB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QUFVLEdBQUcsSUFBSSxDQUFDO2dCQUV6QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUUxQyxJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXZELElBQUksU0FBUyxHQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBR2pDLElBQUksUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN0QyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQ0EsQ0FBQ0E7WUFFSEEsTUFBTUEsQ0FBQ0EsYUFBYUEsR0FBR0E7Z0JBQ3JCQSxZQUFZQSxFQUFHQSxJQUFJQTtnQkFDbkJBLFdBQVdBLEVBQUVBLElBQUlBO2dCQUNqQkEsUUFBUUEsRUFBRUEsSUFBSUE7Z0JBQ2RBLElBQUlBLEVBQUVBLFVBQVVBO2FBQ2pCQSxDQUFDQTtRQUVKQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUVOQSxDQUFDQSxFQWxDTSxRQUFRLEtBQVIsUUFBUSxRQWtDZCIsImZpbGUiOiJjb21waWxlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbGlicy9oYXd0aW8tdXRpbGl0aWVzL2RlZnMuZC50c1wiLz5cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGV4cG9ydCB2YXIgcGx1Z2luTmFtZSA9IFwic2NyaWJibGVcIjtcblxuICBleHBvcnQgdmFyIGxvZzogTG9nZ2luZy5Mb2dnZXIgPSBMb2dnZXIuZ2V0KHBsdWdpbk5hbWUpO1xuXG4gIGV4cG9ydCB2YXIgdGVtcGxhdGVQYXRoID0gXCJwbHVnaW5zL3NjcmliYmxlL2h0bWxcIjtcbiBcbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVHbG9iYWxzLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBleHBvcnQgdmFyIF9tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShTY3JpYmJsZS5wbHVnaW5OYW1lLCBbXCJ4ZWRpdGFibGVcIixcInVpLmNvZGVtaXJyb3JcIl0pO1xuXG4gIHZhciB0YWIgPSB1bmRlZmluZWQ7XG5cbiAgX21vZHVsZS5jb25maWcoW1wiJGxvY2F0aW9uUHJvdmlkZXJcIiwgXCIkcm91dGVQcm92aWRlclwiLCBcIkhhd3Rpb05hdkJ1aWxkZXJQcm92aWRlclwiLFxuICAgICgkbG9jYXRpb25Qcm92aWRlciwgJHJvdXRlUHJvdmlkZXI6IG5nLnJvdXRlLklSb3V0ZVByb3ZpZGVyLCBidWlsZGVyOiBIYXd0aW9NYWluTmF2LkJ1aWxkZXJGYWN0b3J5KSA9PiB7XG4gICAgdGFiID0gYnVpbGRlci5jcmVhdGUoKVxuICAgICAgLmlkKFNjcmliYmxlLnBsdWdpbk5hbWUpXG4gICAgICAudGl0bGUoKCkgPT4gXCJNb2R1bGVzXCIpXG4gICAgICAuaHJlZigoKSA9PiBcIi9tb2R1bGVzXCIpXG4gICAgICAuYnVpbGQoKTtcbiAgICBidWlsZGVyLmNvbmZpZ3VyZVJvdXRpbmcoJHJvdXRlUHJvdmlkZXIsIHRhYik7XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICRyb3V0ZVByb3ZpZGVyLlxuICAgICAgd2hlbignL21vZHVsZXMnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGx1Z2lucy9zY3JpYmJsZS9odG1sL21vZHVsZXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTY3JpYmJsZS5Nb2R1bGVzQ29udHJvbGxlcidcbiAgICAgIH0pLlxuICAgICAgd2hlbignL21vZHVsZXMvOm1vZHVsZScsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwbHVnaW5zL3NjcmliYmxlL2h0bWwvbW9kdWxlLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnU2NyaWJibGUuTW9kdWxlQ29udHJvbGxlcidcbiAgICAgIH0pLlxuICAgICAgd2hlbignL21vZHVsZXMvOm1vZHVsZS9yb2xlLzpyb2xlJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BsdWdpbnMvc2NyaWJibGUvaHRtbC9yb2xlLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnU2NyaWJibGUuUm9sZUNvbnRyb2xsZXInXG4gICAgICB9KTtcbiAgfV0pO1xuXG4gIF9tb2R1bGUucnVuKGZ1bmN0aW9uKGVkaXRhYmxlT3B0aW9ucykge1xuICAgIGVkaXRhYmxlT3B0aW9ucy50aGVtZSA9ICdiczMnOyAvLyBib290c3RyYXAzIHRoZW1lLiBDYW4gYmUgYWxzbyAnYnMyJywgJ2RlZmF1bHQnXG4gIH0pO1xuXG4gIF9tb2R1bGUucnVuKFtcIkhhd3Rpb05hdlwiLCAoSGF3dGlvTmF2OiBIYXd0aW9NYWluTmF2LlJlZ2lzdHJ5KSA9PiB7XG4gICAgSGF3dGlvTmF2LmFkZCh0YWIpO1xuICAgIGxvZy5kZWJ1ZyhcImxvYWRlZFwiKTtcbiAgfV0pO1xuXG5cbiAgaGF3dGlvUGx1Z2luTG9hZGVyLmFkZE1vZHVsZShTY3JpYmJsZS5wbHVnaW5OYW1lKTtcbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVQbHVnaW4udHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGV4cG9ydCB2YXIgTW9kdWxlQ29udHJvbGxlciA9IF9tb2R1bGUuY29udHJvbGxlcihcIlNjcmliYmxlLk1vZHVsZUNvbnRyb2xsZXJcIiwgW1wiJHNjb3BlXCIsIFwiJHJvdXRlUGFyYW1zXCIsIFwiJGh0dHBcIiwgJyRsb2NhdGlvbicsICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGh0dHAsICRsb2NhdGlvbikgPT4ge1xuXG4gICAgJHNjb3BlLm1vZHVsZU5hbWUgPSAkcm91dGVQYXJhbXMubW9kdWxlO1xuICAgICRzY29wZS5kaXJ0eSA9IGZhbHNlO1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICBcbiAgICAkc2NvcGUubW9kdWxlID0ge1xuICAgICAgZGVzY3JpcHRpb246IFwiXCIsXG4gICAgICBkYXRhOiBcIlwiXG4gICAgfTtcbiAgICBcbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvbW9kdWxlcy8nKyRzY29wZS5tb2R1bGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5tb2R1bGUuZGVzY3JpcHRpb24gPSBkYXRhLmRlc2NyaXB0aW9uO1xuICAgICAgJHNjb3BlLm1vZHVsZS5kYXRhID0gZGF0YS5kYXRhO1xuICAgICAgJHNjb3BlLnJlc2V0KCk7XG4gICAgfSk7XG5cbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvYWN0aW9ucy9yb2xlcy8nKyRzY29wZS5tb2R1bGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5yb2xlcyA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2F2ZU1vZHVsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwLnB1dCgnL3NjcmliYmxlLXNlcnZlci9tb2R1bGVzLycrJHNjb3BlLm1vZHVsZU5hbWUsICRzY29wZS5tb2R1bGUpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHNjb3BlLnJlc2V0KCk7XG4gICAgICAgICRzY29wZS52ZXJpZnkoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVzdG9yZU1vZHVsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvbW9kdWxlcy8nKyRzY29wZS5tb2R1bGVOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLm1vZHVsZS5kZXNjcmlwdGlvbiA9IGRhdGEuZGVzY3JpcHRpb247XG4gICAgICAgICRzY29wZS5tb2R1bGUuZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgICAgJHNjb3BlLnJlc2V0KCk7XG5cbiAgICAgICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL2FjdGlvbnMvcm9sZXMvJyskc2NvcGUubW9kdWxlTmFtZSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgJHNjb3BlLnJvbGVzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmRpcnR5ID0gZmFsc2U7XG4gICAgfTtcblxuICAgICRzY29wZS5zZXREaXJ0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmRpcnR5ID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmlzRGlydHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkc2NvcGUuZGlydHk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZWxlY3RlZE1hcmtlciA9IGZ1bmN0aW9uKG1hcmtlcikge1xuICAgICAgaWYgKCRzY29wZS5jdXJyZW50TWFya2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRNYXJrZXIuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmN1cnJlbnRNYXJrZXIgPSAkc2NvcGUuZG9jLm1hcmtUZXh0KFxuICAgICAgICB7bGluZTogbWFya2VyLnN0YXJ0TGluZS0xLCBjaDogbWFya2VyLnN0YXJ0UG9zfSxcbiAgICAgICAge2xpbmU6IG1hcmtlci5lbmRMaW5lLTEsIGNoOiBtYXJrZXIuZW5kUG9zfSxcbiAgICAgICAge2NsYXNzTmFtZTogXCJzdHlsZWQtYmFja2dyb3VuZFwifVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmVkaXRvck9wdGlvbnMgPSB7XG4gICAgICBsaW5lV3JhcHBpbmcgOiB0cnVlLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICBtb2RlOiAnc2NyaWJibGUnXG4gICAgfTtcblxuICAgICRzY29wZS5uYW1lT3JkZXJQcm9wID0gJ25hbWUnO1xuXG4gICAgJHNjb3BlLmNvZGVtaXJyb3JMb2FkZWQgPSBmdW5jdGlvbihfZWRpdG9yKSB7XG4gICAgICAkc2NvcGUuZWRpdG9yID0gX2VkaXRvcjtcbiAgICAgICRzY29wZS5kb2MgPSBfZWRpdG9yLmdldERvYygpO1xuICAgICAgXG4gICAgICAvLyBFZGl0b3IgcGFydFxuICAgICAgX2VkaXRvci5mb2N1cygpO1xuXG4gICAgICAvLyBPcHRpb25zXG4gICAgICBfZWRpdG9yLnNldE9wdGlvbignbGluZVdyYXBwaW5nJywgdHJ1ZSk7XG4gICAgICBfZWRpdG9yLnNldE9wdGlvbignbGluZU51bWJlcnMnLCB0cnVlKTtcbiAgICAgIF9lZGl0b3Iuc2V0T3B0aW9uKCdtb2RlJywgJ3NjcmliYmxlJyk7XG4gICAgICBcbiAgICAgICRzY29wZS5kb2MubWFya0NsZWFuKCk7XG4gICAgICBcbiAgICAgIF9lZGl0b3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLnNldERpcnR5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUudmVyaWZ5ID0gZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgICAkaHR0cC5wb3N0KCcvc2NyaWJibGUtc2VydmVyL2FjdGlvbnMvdmVyaWZ5LycrJHNjb3BlLm1vZHVsZU5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUubWFya2VycyA9IGRhdGE7XG5cbiAgICAgICAgaWYgKCRzY29wZS5jdXJyZW50TWFya2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAkc2NvcGUuY3VycmVudE1hcmtlci5jbGVhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL2FjdGlvbnMvcm9sZXMvJyskc2NvcGUubW9kdWxlTmFtZSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgJHNjb3BlLnJvbGVzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgICRzY29wZS52ZXJpZnkoKTtcbiAgfV0pO1xuXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNjcmliYmxlUGx1Z2luLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBleHBvcnQgdmFyIE1vZHVsZXNDb250cm9sbGVyID0gX21vZHVsZS5jb250cm9sbGVyKFwiU2NyaWJibGUuTW9kdWxlc0NvbnRyb2xsZXJcIiwgW1wiJHNjb3BlXCIsIFwiJGh0dHBcIiwgJyRsb2NhdGlvbicsICgkc2NvcGUsICRodHRwLCAkbG9jYXRpb24pID0+IHtcblxuICAgICRodHRwLmdldCgnL3NjcmliYmxlLXNlcnZlci9tb2R1bGVzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUubW9kdWxlcyA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUubmFtZU9yZGVyUHJvcCA9ICduYW1lJztcblxuICAgICRzY29wZS5tYXN0ZXIgPSB7fTtcblxuICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbihuZXdtb2R1bGUpIHtcbiAgICAgIHZhciBtb2R1bGVEZWZuID0geyBkYXRhOiBcIm1vZHVsZSBcIituZXdtb2R1bGUubmFtZStcbiAgICAgICAgICAgICAgXCI7XFxyXFxuXFxyXFxuZ2xvYmFsIHByb3RvY29sIFByb3RvY29sTmFtZShyb2xlIEEsIHJvbGUgQikge1xcclxcbn1cXHJcXG5cIiB9O1xuICAgICAgXHRcdFxuICAgICAgJGh0dHAucHV0KCcvc2NyaWJibGUtc2VydmVyL21vZHVsZXMvJytuZXdtb2R1bGUubmFtZSwgbW9kdWxlRGVmbikuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbW9kdWxlcy8nK25ld21vZHVsZS5uYW1lKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVzZXQgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgICBpZiAoZm9ybSkge1xuICAgICAgICBmb3JtLiRzZXRQcmlzdGluZSgpO1xuICAgICAgICBmb3JtLiRzZXRVbnRvdWNoZWQoKTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5uZXdtb2R1bGUgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm1hc3Rlcik7XG4gICAgfTtcblxuICAgICRzY29wZS5yZXNldCgpO1xuICB9XSk7XG5cbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVQbHVnaW4udHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGRlY2xhcmUgdmFyIGdyYXBobGliRG90OiBhbnk7XG4gIGRlY2xhcmUgdmFyIGRhZ3JlRDM6IGFueTtcbiBcbiAgZXhwb3J0IHZhciBSb2xlQ29udHJvbGxlciA9IF9tb2R1bGUuY29udHJvbGxlcihcIlNjcmliYmxlLlJvbGVDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIiRyb3V0ZVBhcmFtc1wiLCBcIiRodHRwXCIsICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGh0dHApID0+IHtcblxuICAgICRzY29wZS5tb2R1bGVOYW1lID0gJHJvdXRlUGFyYW1zLm1vZHVsZTtcbiAgICAkc2NvcGUucm9sZU5hbWUgPSAkcm91dGVQYXJhbXMucm9sZTtcbiAgICBcbiAgICAkaHR0cC5wb3N0KCcvc2NyaWJibGUtc2VydmVyL2FjdGlvbnMvcHJvamVjdC8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUucm9sZU5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgJHNjb3BlLnByb2plY3Rpb24gPSBkYXRhO1xuICAgICAgXG4gICAgICBpZiAoJHNjb3BlLnByb2plY3Rpb24uZ3JhcGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBQcm9kdWNlIGdyYXBoIGJ5IHBhcnNpbmcgdGhlIERPVCBzeW50YXggaW50byBhIGdyYXBobGliIG9iamVjdC5cbiAgICAgICAgdmFyIGdyYXBoID0gZ3JhcGhsaWJEb3QucGFyc2UoJHNjb3BlLnByb2plY3Rpb24uZ3JhcGgpO1xuICAgIFxuICAgICAgICB2YXIgY29udGFpbmVyPWQzLnNlbGVjdChcInN2ZyBnXCIpO1xuICAgICAgXG4gICAgICAgIC8vIFJlbmRlciB0aGUgZ3JhcGhsaWIgb2JqZWN0IHVzaW5nIGQzLlxuICAgICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgZGFncmVEMy5SZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5ydW4oZ3JhcGgsIGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuZWRpdG9yT3B0aW9ucyA9IHtcbiAgICAgIGxpbmVXcmFwcGluZyA6IHRydWUsXG4gICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgIHJlYWRPbmx5OiB0cnVlLFxuICAgICAgbW9kZTogJ3NjcmliYmxlJ1xuICAgIH07XG5cbiAgfV0pO1xuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

angular.module("scribble-ui-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/scribble/html/module.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModuleController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/modules\">Modules</a></li>\n      <li class=\"active\">{{moduleName}}</li>\n    </ol>\n\n    <h1><b>{{moduleName}}</b> <span style=\"color:grey\">Module</span></h1>\n\n    <a href=\"#\" editable-textarea=\"module.description\" e-rows=\"14\" e-cols=\"120\" rows=\"7\" onaftersave=\"setDirty()\" >\n        <pre><i>{{ module.description || \'No description\' }}</i></pre>\n    </a>\n    \n    <div>\n      <button type=\"button\" class=\"btn btn-success btn-sm\" ng-disabled=\"!dirty || loading\" ng-click=\"saveModule()\">Save</button>\n      <button type=\"button\" class=\"btn btn-danger btn-sm\" ng-disabled=\"!dirty || loading\" ng-click=\"restoreModule()\">Discard</button>\n      \n      <div style=\"float: right;\">\n      <label>Roles:</label>\n      <a type=\"button\" href=\"/modules/{{moduleName}}/role/{{role}}\" class=\"btn btn-sm btn-primary\"\n      							ng-repeat=\"role in roles\">{{role}}</a>\n      </div>\n    </div>\n    \n    <br>\n\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <!-- ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"module.definition\" ></ui-codemirror -->\n          <div ng-model=\"module.data\" ui-codemirror=\"{ onLoad : codemirrorLoaded }\" ></div>\n\n          <br>\n          \n          <ul class=\"list-group\">\n            <li ng-repeat=\"marker in markers\" class=\"list-group-item\"\n            				ng-click=\"selectedMarker(marker)\"\n            				ng-class=\"{\'list-group-item-danger\': marker.severity===\'Error\', \'list-group-item-warning\': marker.severity===\'Warning\'}\" >\n              {{marker.description}}\n            </li>\n          </ul>\n        </div>\n      </div>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/modules.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModulesController\">\n\n    <br>\n\n    <div class=\"row\">\n      <div class=\"col-md-9\">\n        Search: <input ng-model=\"query\">\n\n        <br>\n        <br>\n\n        <ul class=\"list-group\" >\n          <li ng-repeat=\"module in modules | filter:query\" class=\"list-group-item\" >\n            <h3><a href=\"/modules/{{module}}\">{{module}}</a></h3>\n          </li>\n       </ul>\n      </div>\n\n      <div class=\"col-md-3\">\n\n		<h2>Create a new module</h2>\n\n        <form name=\"newmoduleform\" class=\"css-form\" novalidate>\n          Module:\n          <input type=\"text\" ng-model=\"newmodule.name\" name=\"moduleName\" required=\"\" />\n          <br />\n          <div ng-show=\"newmoduleform.$submitted || newmoduleform.moduleName.$touched\">\n            <div ng-show=\"newmoduleform.moduleName.$error.required\"><font color=\"red\">Enter the module name.</font></div>\n          </div>\n\n          <br />\n          <input type=\"button\" ng-click=\"reset(newmoduleform)\" value=\"Reset\" />\n          <input type=\"submit\" ng-click=\"create(newmodule)\" value=\"Create\" />\n        </form>\n\n      </div>\n\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/role.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.RoleController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/\">Modules</a></li>\n      <li><a href=\"/modules/{{moduleName}}\">{{moduleName}}</a></li>\n      <li class=\"active\">{{roleName}}</li>\n    </ol>\n\n    <h1><b>{{roleName}}</b> <span style=\"color:grey\">Role</span></h1>\n\n<!-- Comment out tabs for now until work out how to resize graph (issue 16)\n    <ul class=\"nav nav-tabs\">\n      <li class=\"active\"><a data-toggle=\"tab\" href=\"#projection\">Projection</a></li>\n      <li><a data-toggle=\"tab\" href=\"#graph\">Graph</a></li>\n    </ul>\n\n    <div class=\"tab-content\">\n      <div id=\"projection\" class=\"tab-pane fade in active\">\n-->\n        <div class=\"row\">\n          <div class=\"col-md-12\">\n            <ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"projection.definition\" ></ui-codemirror>\n          </div>\n        </div>\n<!--\n      </div>\n      <div id=\"graph\" class=\"tab-pane fade\">\n-->\n		<br>\n\n        <div class=\"row\">\n          <div class=\"col-md-12\">\n            <svg id=\"graphContainer\" height=\"400\" width=\"400\">\n              <g height=\"400\" width=\"400\"/>\n            </svg>\n          </div>\n        </div>\n<!--\n      </div>\n    </div>\n-->\n\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("scribble-ui-templates");
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
