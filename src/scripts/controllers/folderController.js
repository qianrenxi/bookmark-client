/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';
    angular.module('bookmark')
        .controller('folderController', ['$scope', 'folderService', FolderController]);

    function FolderController($scope, folderService) {
        var self = this;

        self.folderTree = [];

        $scope.data = self;

        loadFolderTree();

        function loadFolderTree() {
            folderService.findTree().then(function (folderTree) {
                $scope.folderTree = folderTree;
            });
        }

        function selectFolder() {
        }

        function createFolder() {
        }

        function editFolder() {
        }

        function saveFolder() {
        }

        function deleteFolder() {
        }
    }
})();