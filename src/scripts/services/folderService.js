/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';

    angular.module('bookmark')
        .service('folderService', ['$q','$http', FolderService]);

    function FolderService($q, $http) {
        return {
            findTree: findTree,
            save: save,
            remove: remove
        };

        function findTree() {
            var d = $q.defer();
            $http({
                method:'GET',
                url:'http://localhost:8080/folder/tree'
            }).then(function(resp){
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