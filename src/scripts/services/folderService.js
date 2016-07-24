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