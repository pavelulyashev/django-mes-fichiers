'use strict';

var App = angular.module('ngUploaderView', ['ngResource']);

App.config([
    '$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/file_uploader/', {
            templateUrl: '/albums.html',
            controller: AlbumsController
        });

        $routeProvider.when('/file_uploader/album/', {
            templateUrl: '/album.html',
            controller: 'NewAlbumController'
        });

        $routeProvider.when('/file_uploader/album/:albumId', {
            templateUrl: '/album.html',
            controller: AlbumController
        });

        $routeProvider.otherwise({
            redirectTo: '/file_uploader/'
        });

        $locationProvider.html5Mode(true);
    }
]);

App.config([
    '$httpProvider',
    function($httpProvider) {
        var token = document.querySelector('input[name=csrfmiddlewaretoken]');
        $httpProvider.defaults.headers.post['X-CSRFToken'] = token.value;
    }
]);

App.factory('MonAlbum', [
    '$resource',
    function ($resource) {
        return $resource('/file_uploader/albums/:id', {
            id: '@id' //this binds the ID of the model to the URL param
        }, {
            query: { method: 'GET', isArray: true },
            save: { method: 'PATCH' },
            create: { method: 'POST' },
            destroy: { method: 'DELETE' }
        });
    }
]);

App.factory('MonFile', [
    '$resource',
    function ($resource) {
        $resource('/files/:id', {
            id: '@id' //this binds the ID of the model to the URL param
        }, {
            query: { method: 'GET', isArray: true },
            save: { method: 'PATCH' },
            create: { method: 'POST' },
            destroy: { method: 'DELETE' }
        });
    }
]);

function AlbumsController($rootScope) {
    $rootScope.activeAlbum = null;
}

function AlbumController($scope, $routeParams, $rootScope) {
    var id = $rootScope.activeAlbum = $routeParams.albumId;
    $scope.album = $rootScope.albums[id];
}

App.controller('NewAlbumController', [
    '$scope', '$rootScope', '$location', 'MonAlbum',
    function NewAlbumController($scope, $rootScope, $location, MonAlbum) {
        $rootScope.activeAlbum = 'new';

        $scope.album = new MonAlbum();
        $scope.saveAlbum = function() {
            if (this.albumForm.$valid) {
                this.album.$create(function(newAlbum) {
                    $rootScope.albums[newAlbum.id] = newAlbum;
                    $location.url('/file_uploader/album/' + newAlbum.id);
                }, function(err) {
                    console.log(err);
                })
            }
        };
    }
]);

App.controller('UploaderController', [
    '$scope', '$rootScope', '$route', '$routeParams', '$location', 'MonAlbum',
    function UploaderController($scope, $rootScope, $route,
                                $routeParams, $location, MonAlbum) {
        window.MonAlbum = MonAlbum;
        window.scope = $scope;

        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;

//        if (!$rootScope.albums) {
//            MonAlbum.query(function(albums) {
//                $scope.albums = $rootScope.albums = albums;
//            });
//        }

        $scope.albums1 = {
            1: {
                id: 1,
                name: 'Les Oiseaux',
                cover: 'http://img301.imageshack.us/img301/4472/blx8.jpg',
                files: [
                    {
                        id: 1,
                        name: 'L\'Oiseaux beauté',
                        description: '',
                        thumbnail: 'http://cordis.europa.eu/news/images/20120301-2.jpg'
                    },
                    {
                        id: 2,
                        name: 'Oiseau',
                        description: '',
                        thumbnail: 'http://photosergio.zenfolio.com/img/s8/v83/p1428423432-11.jpg'
                    },
                    {
                        id: 3,
                        name: '',
                        description: '',
                        thumbnail: 'http://www.observatoire-estran-tranchais.fr/fiches-techniques/images/pipit-rousseline.jpg'
                    },
                    {
                        id: 4,
                        name: '',
                        description: '',
                        thumbnail: 'https://www.lebelage.ca/sites/default/files/styles/medium/public/images/articles/observer-oiseaux.jpg?itok=l6nF8tfV'
                    },
                    {
                        id: 23,
                        name: '',
                        description: '',
                        thumbnail: 'http://parcsaintecroix.com/wp-content/uploads/2013/03/shutterstock_58202509.jpg'
                    },
                    {
                        id: 89,
                        name: '',
                        description: '',
                        thumbnail: 'http://ds4.ds.static.rtbf.be/article/square200/9/d/b/200_200_4c4c413ca85d4359888b78996c464957-1328256272.jpg'
                    },
                    {
                        id: 122,
                        name: '',
                        description: '',
                        thumbnail: 'http://rds.relaisdsciences.org/img_clt/visuel_mnf_1336547023.jpg'
                    },
                    {
                        id: 7,
                        name: '',
                        description: '',
                        thumbnail: 'http://cordis.europa.eu/news/images/20100906-2.jpg'
                    }
                ]
            },
            2: {
                id: 2,
                name: 'Les Animaux',
                cover: 'http://4.bp.blogspot.com/-9shlt1v0F_U/TZs-N72WMVI/AAAAAAAAAN8/_iyKyHsESqg/s1600/animaux2.jpg',
                files: [
                    {
                        name: 'L\'Ours',
                        description: '',
                        thumbnail: 'http://stock.wikimini.org/w/images/c/cf/Ours_polaire.jpg'
                    }
                ]
            }
        };
    }
]);
