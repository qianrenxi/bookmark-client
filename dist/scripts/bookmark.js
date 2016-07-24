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

/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';
    angular.module('tmr.bookmark')
        .controller('folderController', ['$scope', 'folderService', FolderController]);

    function FolderController($scope, folderService) {
        var self = this;

        self.folderTree = [];

        $scope.data = self;

        loadFolderTree();

        function loadFolderTree() {
            folderService.findTree().then(function (folderTree) {
                $scope.folderTree = folderTree;
                angular.forEach($scope.folderTree, function(node, index){
                    node.$$isExpend = true;
                });
            });
        }

        $scope.selectFolder = selectFolder;
        function selectFolder(item) {
            //console.log(item);
            //console.log("selectFolder");
            //var folderId = item.id;
            $scope.currentFolder = item;
        }

        $scope.createFolder = createFolder;
        function createFolder() {
            //console.log('createFolder');
            layer.prompt({title: 'Folder Name'}, function(value, index, prompt){
                if(value.length>0){
                    var parentId = $scope.currentFolder && $scope.currentFolder.id ? $scope.currentFolder.id : '';
                    folderService.save({'name': value, 'parent.id': parentId}).then(function(result){
                        //reload
                        loadFolderTree();
                    });
                }
                layer.close(index);
            });
        }

        $scope.editFolder = editFolder;
        function editFolder() {
            layer.prompt({title: 'Folder Name', value: $scope.currentFolder.name}, function(value, index, prompt){
                if(value.length>0){
                    folderService.save({id: $scope.currentFolder.id, name: value}).then(function(result){
                        //reload
                        //loadFolderTree();
                        $scope.currentFolder.name = value;
                    });
                }
                layer.close(index);
            });
        }

        function saveFolder() {
        }

        $scope.deleteFolder = deleteFolder;
        function deleteFolder(item) {
            var currentId = $scope.currentFolder && $scope.currentFolder.id ? $scope.currentFolder.id : '';
            if(currentId){
                folderService.remove(currentId).then(function(result){
                    //getNode(currentId).remove();
                    loadFolderTree();
                });
            }
        }

        function getNode(nodeId, nodes){
            nodes = nodes || $scope.folderTree;
            var found = null;
            angular.forEach(nodes, function(node, index){
                if(node.id == nodeId){
                    found = node;
                    return;
                }
                if(node.children){
                    found = getNode(nodeId, node.children);
                }
            });
            if(found){
                return found;
            }
        }
    }
})();
/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';
    angular.module('tmr.bookmark')
        .controller('pageController', ['$scope','pageService','$routeParams', PageController]);

    function PageController($scope,pageService, $routeParams) {
        var self = this;

        self.pages = [];
        $scope.pages = self.pages;
        //console.log($routeParams);

        loadPages();

        function loadPages() {
            pageService.list($routeParams.folderId).then(function (pages) {
                $scope.pages = pages;
                //console.log(pages);
            });
        }

        function selectPage() {
        }

        function createPage() {
        }

        function editPage() {
        }

        function savePage() {
        }

        function deletePage() {
        }
    }
})();
/**
 * Created by tony on 16-6-12.
 */
(function () {
    "use strict";

    angular.module("tmr.bookmark.treeView", [])
        .directive('tmTreeView', TreeViewDirective)
        .controller('treeViewController', TreeViewController);

    function TreeViewDirective() {
        return {
            restrict: 'E',
            templateUrl: "tmr/templates/bookmark/treeView.html",
            controller: 'treeViewController',
            scope: {
                treeData: '=',
                canChecked: '=',
                textField: '@',
                itemClicked: '&',
                itemCheckedChanged: '&',
                itemTemplateUrl: '@'
            }
        };
    }

    function TreeViewController($scope) {
        $scope.itemExpended = function (item, $event) {
            item.$$isExpend = $scope.isLeaf(item)?false:!item.$$isExpend;
            //$event.stopPropagation();
        };
        var itemClicked = $scope.itemClicked;
        $scope.itemClicked = function(item, $event){
            //itemClicked();
            //console.log($scope.treeData);
            resetSelect($scope.treeData);
            item.selected = true;
            itemClicked({item: item});
        };

        $scope.getItemIcon = function (item) {
            var isLeaf = $scope.isLeaf(item);

            if (isLeaf) {
                return 'fa fa-folder-o';
            }

            return item.$$isExpend ? 'fa fa-folder-open-o' : 'fa fa-folder-o';
        };

        $scope.isLeaf = function (item) {
            return !item.children || !item.children.length;
        };

        $scope.warpCallback = function (callback, item, $event) {
            ($scope[callback] || angular.noop)({
                $item: item,
                $event: $event
            });
        };

        function resetSelect(items){
            angular.forEach(items, function(item, index){
                item.selected=false;
                if(item.children){
                    resetSelect(item.children);
                }
            });
        }
    }

    TreeViewController.$inject = ['$scope'];
})
();
/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';

    angular.module('tmr.bookmark')
        .service('folderService', ['$q','$http', FolderService]);

    function FolderService($q, $http) {
        return {
            findTree: findTree,
            save: save,
            remove: remove
        };

        function findTree() {
            var d = $q.defer();
            //console.log('http://qianrenxi.com/bookmark/folder/tree');
            $http({
                method:'GET',
                url:'http://localhost:8080/bookmark/folder/tree'
            }).then(function(resp){
                //console.log(resp);
                d.resolve(resp.data);
            });

            return d.promise;
        }

        function save(folder) {
            var d = $q.defer();
            $http({
                method:'POST',
                url:'http://localhost:8080/bookmark/folder/save',
                data: folder
            }).then(function(resp){
                d.resolve(resp.data);
            });

            return d.promise;
        }

        function remove(folderId) {
            var d = $q.defer();
            $http({
                method:'GET',
                url:'http://localhost:8080/bookmark/folder/'+folderId+'/delete'
            }).then(function(resp){
                d.resolve(resp.data);
            });

            return d.promise;
        }
    }
})();
/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';

    angular.module('tmr.bookmark')
        .service('pageService', ['$q','$http', PageService]);

    function PageService($q, $http) {
        return {
            list: list,
            save: save,
            remove: remove
        };

        function list(folderId) {
            var d = $q.defer();
            //console.log(folderId);
            //console.log('http://qianrenxi.com/bookmark/folder/tree');
            $http({
                method:'GET',
                url:'http://localhost:8080/bookmark/folder/'+folderId+'/page/list'
            }).then(function(resp){
                //console.log(resp);
                d.resolve(resp.data);
            });
            return d.promise;
        }

        function save() {

        }

        function remove() {

        }
    }
})();
(function(module) {
try {
  module = angular.module('tmr.bookmark');
} catch (e) {
  module = angular.module('tmr.bookmark', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tmr/templates/bookmark/bookmark.html',
    '<div class="workspace">\n' +
    '    <div class="sidebar">\n' +
    '        <div class="sidebar-inner">\n' +
    '            <div class="toolbar">\n' +
    '                <a class="links"><i class="fa fa-plus"></i></a>\n' +
    '            </div>\n' +
    '            <div class="folder-tree">\n' +
    '                <tm-tree-view tree-data="folderTree" text-field="name" value-field=\'id\'\n' +
    '                              can-checked="false"></tm-tree-view>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="product">\n' +
    '        <div class="product-main">\n' +
    '            <div class="toolbar"></div>\n' +
    '            <div class="data-list"></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('tmr.bookmark');
} catch (e) {
  module = angular.module('tmr.bookmark', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tmr/templates/bookmark/pageView.html',
    '<div class="row">\n' +
    '    <div class="">\n' +
    '        <div ng-repeat="page in pages" class="col-md-2">\n' +
    '            <div class="thumbnail">\n' +
    '                <a href="{{page.url}}"\n' +
    '                   target="_blank"><img style="width: 100%; " ng-src="{{page.favicon}}"/></a>\n' +
    '            <a href="{{page.url}}"\n' +
    '               target="_blank">{{page.name}}</a>\n' +
    '            <span class="text-info">[{{page.url}}]</span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('tmr.bookmark');
} catch (e) {
  module = angular.module('tmr.bookmark', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tmr/templates/bookmark/treeView.html',
    '<ul class="tree-view"><!-- list-tree -->\n' +
    '    <li ng-repeat="item in treeData" ng-include="\'templates/treeViewItem.html\'" ng-class="{\'selected\':item.selected }"></li>\n' +
    '</ul>');
}]);
})();

(function(module) {
try {
  module = angular.module('tmr.bookmark');
} catch (e) {
  module = angular.module('tmr.bookmark', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tmr/templates/bookmark/treeViewItem.html',
    '<div class="tree-node" ng-click="itemClicked(item, $event);" ng-dblclick="itemExpended(item, $event);">\n' +
    '    <i class="fa" style="width: 10px;"\n' +
    '       ng-class="{\'fa-caret-right\':!isLeaf(item)&&!item.$$isExpend, \'fa-caret-down\':!isLeaf(item)&&item.$$isExpend}"></i>\n' +
    '    <i style="width: 15px;" ng-click="itemExpended(item, $event);" class="{{getItemIcon(item)}}"></i>\n' +
    '\n' +
    '    <input type="checkbox" ng-model="item.$$isChecked" class="check-box" ng-if="canChecked"\n' +
    '           ng-change="warpCallback(\'itemCheckedChanged\', item, $event)">\n' +
    '\n' +
    '    <a href="#/{{item.id}}/pages"><span class=\'text-field\' onselectstart="return false;" style="-moz-user-select:none;">{{item.name}}</span></a>\n' +
    '</div>\n' +
    '<ul ng-if="!isLeaf(item)" ng-show="item.$$isExpend" class="list-tree">\n' +
    '    <li ng-repeat="item in item.children" ng-include="\'templates/treeViewItem.html\'"\n' +
    '        ng-class="{\'selected\':item.selected }">\n' +
    '    </li>\n' +
    '</ul>');
}]);
})();
