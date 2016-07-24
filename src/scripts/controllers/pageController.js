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