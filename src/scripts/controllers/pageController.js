/**
 * Created by tony on 16-6-11.
 */
(function () {
    'use strict';
    angular.module('bookmark')
        .controller('pageController', ['pageService', PageController]);

    function PageController(pageService) {
        var self = this;

        self.pages = [];

        function loadPages() {
            pageService.list().then(function (pages) {
                self.pages = pages;
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