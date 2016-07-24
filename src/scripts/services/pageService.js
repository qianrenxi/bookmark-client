/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';

    angular.module('bookmark')
        .service('pageService', ['$http', PageService]);

    function PageService($http) {
        return {
            list: list,
            save: save,
            remove: remove
        };

        function list() {

        }

        function save() {

        }

        function remove() {

        }
    }
})();