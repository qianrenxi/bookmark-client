/**
 * Created by tony on 16-6-12.
 */
(function () {
    "use strict";

    angular.module("terminal.components.treeView", [])
        .directive('tmTreeView', TreeViewDirective)
        .controller('treeViewController', TreeViewController);

    function TreeViewDirective() {
        return {
            restrict: 'E',
            templateUrl: "views/treeView.html",
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
            item.$$isExpend = !item.$$isExpend;
            $event.stopPropagation();
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
    }

    TreeViewController.$inject = ['$scope'];
})
();