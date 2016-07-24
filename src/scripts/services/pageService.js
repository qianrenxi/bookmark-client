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