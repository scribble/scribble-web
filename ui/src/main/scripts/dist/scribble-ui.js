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
            $scope.protocolNames = data;
        });
    }]);
})(Scribble || (Scribble = {}));

var Scribble;
(function (Scribble) {
    Scribble.ModulesController = Scribble._module.controller("Scribble.ModulesController", ["$scope", "$http", function ($scope, $http) {
        $http.get('/scribble-server/protocols').success(function (data) {
            $scope.moduleNames = data;
        });
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
        $scope.saveProtocol = function () {
            return $http.put('/scribble-server/protocols/' + $scope.moduleName + '/' + $scope.protocolName, $scope.protocol);
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
    }]);
})(Scribble || (Scribble = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwic2NyaWJibGUvdHMvc2NyaWJibGVHbG9iYWxzLnRzIiwic2NyaWJibGUvdHMvc2NyaWJibGVQbHVnaW4udHMiLCJzY3JpYmJsZS90cy9tb2R1bGUudHMiLCJzY3JpYmJsZS90cy9tb2R1bGVzLnRzIiwic2NyaWJibGUvdHMvcHJvdG9jb2wudHMiXSwibmFtZXMiOlsiU2NyaWJibGUiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNlQSxJQUFPLFFBQVEsQ0FPZDtBQVBELFdBQU8sUUFBUSxFQUFDLENBQUM7SUFFSkEsbUJBQVVBLEdBQUdBLFVBQVVBLENBQUNBO0lBRXhCQSxZQUFHQSxHQUFtQkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsbUJBQVVBLENBQUNBLENBQUNBO0lBRTdDQSxxQkFBWUEsR0FBR0EsdUJBQXVCQSxDQUFDQTtBQUNwREEsQ0FBQ0EsRUFQTSxRQUFRLEtBQVIsUUFBUSxRQU9kOztBQ05ELElBQU8sUUFBUSxDQXlDZDtBQXpDRCxXQUFPLFFBQVEsRUFBQyxDQUFDO0lBRUpBLGdCQUFPQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxXQUFXQSxFQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUV4RkEsSUFBSUEsR0FBR0EsR0FBR0EsU0FBU0EsQ0FBQ0E7SUFFcEJBLGdCQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxtQkFBbUJBLEVBQUVBLGdCQUFnQkEsRUFBRUEsMEJBQTBCQSxFQUMvRUEsVUFBQ0EsaUJBQWlCQSxFQUFFQSxjQUF1Q0EsRUFBRUEsT0FBcUNBO1FBQ2xHQSxHQUFHQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUNuQkEsRUFBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FDdkJBLEtBQUtBLENBQUNBLGNBQU1BLGtCQUFXQSxFQUFYQSxDQUFXQSxDQUFDQSxDQUN4QkEsSUFBSUEsQ0FB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QUFHLEdBQUMsTUFBTSxDQUFDLFlBQVksR0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJO2dCQUNqSCxNQUFNLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDQTtRQUVGQSxNQUFNQSxDQUFDQSxhQUFhQSxHQUFHQTtZQUNyQkEsWUFBWUEsRUFBR0EsSUFBSUE7WUFDbkJBLFdBQVdBLEVBQUVBLElBQUlBO1lBQ2pCQSxJQUFJQSxFQUFFQSxVQUFVQTtTQUNqQkEsQ0FBQ0E7SUFDSkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFTkEsQ0FBQ0EsRUFsQ00sUUFBUSxLQUFSLFFBQVEsUUFrQ2QiLCJmaWxlIjoiY29tcGlsZWQuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG5tb2R1bGUgU2NyaWJibGUge1xuXG4gIGV4cG9ydCB2YXIgcGx1Z2luTmFtZSA9IFwic2NyaWJibGVcIjtcblxuICBleHBvcnQgdmFyIGxvZzogTG9nZ2luZy5Mb2dnZXIgPSBMb2dnZXIuZ2V0KHBsdWdpbk5hbWUpO1xuXG4gIGV4cG9ydCB2YXIgdGVtcGxhdGVQYXRoID0gXCJwbHVnaW5zL3NjcmliYmxlL2h0bWxcIjtcbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic2NyaWJibGVHbG9iYWxzLnRzXCIvPlxubW9kdWxlIFNjcmliYmxlIHtcblxuICBleHBvcnQgdmFyIF9tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShTY3JpYmJsZS5wbHVnaW5OYW1lLCBbXCJ4ZWRpdGFibGVcIixcInVpLmNvZGVtaXJyb3JcIl0pO1xuXG4gIHZhciB0YWIgPSB1bmRlZmluZWQ7XG5cbiAgX21vZHVsZS5jb25maWcoW1wiJGxvY2F0aW9uUHJvdmlkZXJcIiwgXCIkcm91dGVQcm92aWRlclwiLCBcIkhhd3Rpb05hdkJ1aWxkZXJQcm92aWRlclwiLFxuICAgICgkbG9jYXRpb25Qcm92aWRlciwgJHJvdXRlUHJvdmlkZXI6IG5nLnJvdXRlLklSb3V0ZVByb3ZpZGVyLCBidWlsZGVyOiBIYXd0aW9NYWluTmF2LkJ1aWxkZXJGYWN0b3J5KSA9PiB7XG4gICAgdGFiID0gYnVpbGRlci5jcmVhdGUoKVxuICAgICAgLmlkKFNjcmliYmxlLnBsdWdpbk5hbWUpXG4gICAgICAudGl0bGUoKCkgPT4gXCJQcm90b2NvbHNcIilcbiAgICAgIC5ocmVmKCgpID0+IFwiL3Byb3RvY29sc1wiKVxuICAgICAgLmJ1aWxkKCk7XG4gICAgYnVpbGRlci5jb25maWd1cmVSb3V0aW5nKCRyb3V0ZVByb3ZpZGVyLCB0YWIpO1xuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAkcm91dGVQcm92aWRlci5cbiAgICAgIHdoZW4oJy9wcm90b2NvbHMnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGx1Z2lucy9zY3JpYmJsZS9odG1sL21vZHVsZXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTY3JpYmJsZS5Nb2R1bGVzQ29udHJvbGxlcidcbiAgICAgIH0pLlxuICAgICAgd2hlbignL3Byb3RvY29scy86bW9kdWxlJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BsdWdpbnMvc2NyaWJibGUvaHRtbC9tb2R1bGUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTY3JpYmJsZS5Nb2R1bGVDb250cm9sbGVyJ1xuICAgICAgfSkuXG4gICAgICB3aGVuKCcvcHJvdG9jb2xzLzptb2R1bGUvOnByb3RvY29sJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BsdWdpbnMvc2NyaWJibGUvaHRtbC9wcm90b2NvbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1NjcmliYmxlLlByb3RvY29sQ29udHJvbGxlcidcbiAgICAgIH0pO1xuICB9XSk7XG5cbiAgX21vZHVsZS5ydW4oZnVuY3Rpb24oZWRpdGFibGVPcHRpb25zKSB7XG4gICAgZWRpdGFibGVPcHRpb25zLnRoZW1lID0gJ2JzMyc7IC8vIGJvb3RzdHJhcDMgdGhlbWUuIENhbiBiZSBhbHNvICdiczInLCAnZGVmYXVsdCdcbiAgfSk7XG5cbiAgX21vZHVsZS5ydW4oW1wiSGF3dGlvTmF2XCIsIChIYXd0aW9OYXY6IEhhd3Rpb01haW5OYXYuUmVnaXN0cnkpID0+IHtcbiAgICBIYXd0aW9OYXYuYWRkKHRhYik7XG4gICAgbG9nLmRlYnVnKFwibG9hZGVkXCIpO1xuICB9XSk7XG5cblxuICBoYXd0aW9QbHVnaW5Mb2FkZXIuYWRkTW9kdWxlKFNjcmliYmxlLnBsdWdpbk5hbWUpO1xufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzY3JpYmJsZVBsdWdpbi50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBNb2R1bGVDb250cm9sbGVyID0gX21vZHVsZS5jb250cm9sbGVyKFwiU2NyaWJibGUuTW9kdWxlQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCIkaHR0cFwiLCAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRodHRwKSA9PiB7XG5cbiAgICAkc2NvcGUubW9kdWxlTmFtZSA9ICRyb3V0ZVBhcmFtcy5tb2R1bGU7XG5cbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvcHJvdG9jb2xzLycrJHNjb3BlLm1vZHVsZU5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgJHNjb3BlLnByb3RvY29sTmFtZXMgPSBkYXRhO1xuICAgIH0pO1xuXG4gIH1dKTtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzY3JpYmJsZVBsdWdpbi50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBNb2R1bGVzQ29udHJvbGxlciA9IF9tb2R1bGUuY29udHJvbGxlcihcIlNjcmliYmxlLk1vZHVsZXNDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIiRodHRwXCIsICgkc2NvcGUsICRodHRwKSA9PiB7XG5cbiAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvcHJvdG9jb2xzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAkc2NvcGUubW9kdWxlTmFtZXMgPSBkYXRhO1xuICAgIH0pO1xuXG4gIH1dKTtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzY3JpYmJsZVBsdWdpbi50c1wiLz5cbm1vZHVsZSBTY3JpYmJsZSB7XG5cbiAgZXhwb3J0IHZhciBQcm90b2NvbENvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJTY3JpYmJsZS5Qcm90b2NvbENvbnRyb2xsZXJcIiwgW1wiJHNjb3BlXCIsIFwiJHJvdXRlUGFyYW1zXCIsIFwiJGh0dHBcIiwgKCRzY29wZSwgJHJvdXRlUGFyYW1zLCAkaHR0cCkgPT4ge1xuXG4gICAgJHNjb3BlLm1vZHVsZU5hbWUgPSAkcm91dGVQYXJhbXMubW9kdWxlO1xuICAgICRzY29wZS5wcm90b2NvbE5hbWUgPSAkcm91dGVQYXJhbXMucHJvdG9jb2w7XG4gICAgXG4gICAgJGh0dHAuZ2V0KCcvc2NyaWJibGUtc2VydmVyL3Byb3RvY29scy8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUucHJvdG9jb2xOYW1lKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICRzY29wZS5wcm90b2NvbCA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2F2ZVByb3RvY29sID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAucHV0KCcvc2NyaWJibGUtc2VydmVyL3Byb3RvY29scy8nKyRzY29wZS5tb2R1bGVOYW1lKycvJyskc2NvcGUucHJvdG9jb2xOYW1lLCAkc2NvcGUucHJvdG9jb2wpO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVzdG9yZVByb3RvY29sID0gZnVuY3Rpb24oKSB7XG4gICAgICAkaHR0cC5nZXQoJy9zY3JpYmJsZS1zZXJ2ZXIvcHJvdG9jb2xzLycrJHNjb3BlLm1vZHVsZU5hbWUrJy8nKyRzY29wZS5wcm90b2NvbE5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUucHJvdG9jb2wgPSBkYXRhO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5wcm9qZWN0UHJvdG9jb2wgPSBmdW5jdGlvbigpIHtcbiAgICAgICRodHRwLmdldCgnL3NjcmliYmxlLXNlcnZlci9wcm90b2NvbHMvJyskc2NvcGUubW9kdWxlTmFtZSsnLycrJHNjb3BlLnByb3RvY29sTmFtZSsnL3Byb2plY3QnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLnByb3RvY29sUHJvamVjdGlvbiA9IGRhdGE7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmVkaXRvck9wdGlvbnMgPSB7XG4gICAgICBsaW5lV3JhcHBpbmcgOiB0cnVlLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICBtb2RlOiAnc2NyaWJibGUnXG4gICAgfTtcbiAgfV0pO1xuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
angular.module("scribble-ui-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/scribble/html/module.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModuleController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/protocols\">Modules</a></li>\n      <li class=\"active\">{{moduleName}}</li>\n    </ol>\n\n    <h1><b>{{moduleName}}</b> <span style=\"color:grey\">Module</span></h1>\n\n    <div class=\"col-md-12\">\n      Search: <input ng-model=\"query\">\n    </div>\n\n    <br>\n\n    <ul>\n      <li ng-repeat=\"protocolName in protocolNames | orderBy:nameOrderProp | filter:query\">\n        <h3><a href=\"/protocols/{{moduleName}}/{{protocolName}}\">{{protocolName}}</a></h3>\n      </li>\n    </ul>\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/modules.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ModulesController\">\n    <h1><span style=\"color:grey\">Modules</span></h1>\n\n    <div class=\"col-md-12\">\n      Search: <input ng-model=\"query\">\n    </div>\n\n    <br>\n\n    <ul>\n      <li ng-repeat=\"module in moduleNames | orderBy:nameOrderProp | filter:query\">\n        <h3><a href=\"/protocols/{{module}}\">{{module}}</a></h3>\n      </li>\n    </ul>\n  </div>\n</div>\n");
$templateCache.put("plugins/scribble/html/protocol.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Scribble.ProtocolController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/protocols\">Modules</a></li>\n      <li><a href=\"/protocols/{{moduleName}}\">{{moduleName}}</a></li>\n      <li class=\"active\">{{protocolName}}</li>\n    </ol>\n\n    <h1><b>{{protocolName}}</b> <span style=\"color:grey\">Protocol</span></h1>\n\n    <a href=\"#\" editable-textarea=\"protocol.description\" e-rows=\"14\" e-cols=\"120\" rows=\"7\" >\n        <pre><i>{{ protocol.description || \'No description\' }}</i></pre>\n    </a>\n\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-9\">\n          <ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"protocol.definition\" ></ui-codemirror>\n        </div>\n        <div class=\"col-sm-4 col-md-3 sidebar-pf sidebar-pf-right\">\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <h2 class=\"h5\">Actions</h2>\n\n            <ul class=\"list-group\">\n              <li class=\"list-group-item\" ng-click=\"saveProtocol()\"><span class=\"glyphicon glyphicon-ok-circle\"></span>&nbsp;&nbsp;Save</li>        \n              <li class=\"list-group-item\" ng-click=\"restoreProtocol()\"><span class=\"glyphicon glyphicon-remove-circle\"></span>&nbsp;&nbsp;Restore</li>        \n              <li class=\"list-group-item\" ng-click=\"projectProtocol()\"><span class=\"glyphicon glyphicon-fullscreen\"></span>&nbsp;&nbsp;Project</li>        \n            </ul>\n\n          </div>\n        </div>\n      </div>\n\n<!-- Example of how errors could be displayed?\n      <div>\n        <ul class=\"list-group\">\n          <li class=\"list-group-item list-group-item-success\">200 OK: The server successfully processed the request.</li>\n          <li class=\"list-group-item list-group-item-info\">100 Continue: The client should continue with its request.</li>\n          <li class=\"list-group-item list-group-item-warning\">503 Service Unavailable: The server is temporarily unable to handle the request.</li>\n          <li class=\"list-group-item list-group-item-danger\">400 Bad Request: The request cannot be fulfilled due to bad syntax.</li>\n        </ul>\n      </div>\n-->\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("scribble-ui-templates");
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
