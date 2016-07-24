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