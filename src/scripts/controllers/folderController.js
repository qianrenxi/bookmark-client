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