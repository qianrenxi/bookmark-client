/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';

    var _templateBase = 'tmr/templates/bookmark/';

    angular.module('tmr.bookmark', [
        'ngRoute',
        //'ngMaterial',
        'ngAnimate',
        'tmr.bookmark.treeView',
        'ui.bootstrap',
        'qui.viewFramework'
    ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/:folderId/pages', {
                templateUrl: _templateBase + 'pageView.html',
                //controller: 'folderController',//['folderController', 'pageController'],
                //controllerAs: 'ctrl'//['_fc', '_pc']
                controller: 'pageController'//,//['folderController', 'pageController']
            });
            $routeProvider.otherwise({redirectTo: '/'});
        }
        ])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.defaults.transformRequest = function (obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join('&');
            };

            $httpProvider.defaults.headers.post = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }]);

})();
