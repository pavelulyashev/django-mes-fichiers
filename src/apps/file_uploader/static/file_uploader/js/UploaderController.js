'use strict';

var App = angular.module('ngUploaderView', ['ngResource']);

App.factory('MonAlbum', [
    '$resource',
    function ($resource) {
        return $resource('/file_uploader/rest/albums/:id', {
            id: '@id' //this binds the ID of the model to the URL param
        }, {
            query: { method: 'GET', isArray: true },
            save: { method: 'PUT' },
            create: { method: 'POST' },
            destroy: { method: 'DELETE' }
        });
    }
]);

App.factory('MonFile', [
    '$resource',
    function ($resource) {
        $resource('/file_uploader/rest/files/:id', {
            id: '@id' //this binds the ID of the model to the URL param
        }, {
            query: { method: 'GET', isArray: true },
            save: { method: 'PUT' },
            create: { method: 'POST' },
            destroy: { method: 'DELETE' }
        });
    }
]);

App.config([
    '$httpProvider',
    function($httpProvider) {
        var headers = $httpProvider.defaults.headers;
        var token = document.querySelector('input[name=csrfmiddlewaretoken]');
        headers.post['X-CSRFToken'] = headers.put['X-CSRFToken'] = token.value;
    }
]);

App.config([
    '$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/file_uploader/', {
            templateUrl: '/albums.html',
            controller: 'AlbumsController',
            resolve: { albums: 'retrieveAlbums' }
        });

        $routeProvider.when('/file_uploader/album/', {
            templateUrl: '/album.html',
            controller: 'NewAlbumController',
            resolve: { albums: 'retrieveAlbums' }
        });

        $routeProvider.when('/file_uploader/album/:albumId', {
            templateUrl: '/album.html',
            controller: 'AlbumController',
            resolve: { albums: 'retrieveAlbums',
                       album: 'retrieveAlbum' }
        });

        $routeProvider.otherwise({
            redirectTo: '/file_uploader/'
        });

        $locationProvider.html5Mode(true);
    }
]);

App
.controller('AlbumsController', [
    '$rootScope', 'albums',
    function AlbumsController($rootScope, albums) {
        $rootScope.activeAlbum = null;
        $rootScope.albums = albums;
    }
])
.service('retrieveAlbums',
    function($rootScope, $q, MonAlbum) {
        var albumsLoaded = $q.defer();

        if ($rootScope.albums) {
            albumsLoaded.resolve($rootScope.albums);
        } else {
            MonAlbum.query(onAlbumsReceived);
        }

        function onAlbumsReceived(albums) {
            var albumsObj = $rootScope.albums = {};
            for (var i = 0, len = albums.length; i < len; i++) {
                var album = albums[i];
                albumsObj[album.id] = album;
            }
            albumsLoaded.resolve(albumsObj);
        }

        return albumsLoaded.promise;
    }
);

App
.controller('AlbumController', [
    '$scope', '$rootScope', 'albums', 'album',
    function AlbumController($scope, $rootScope, albums, album) {
        $scope.album = album;
        $rootScope.activeAlbum = album.id;

        $scope.saveAlbum = function() {
            if (this.albumForm.$valid) {
                album.$save(function() {
                    albums[album.id] = album;
                });
            }
        };
    }
])
.service('retrieveAlbum',
    function($q, $route, MonAlbum) {
        var albumId = $route.current.params.albumId;
        var albumsLoaded = $q.defer();
        MonAlbum.get({ id: albumId }, function(album) {
            albumsLoaded.resolve(new MonAlbum(album));
        });
        return albumsLoaded.promise;
    }
);

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
                });
            }
        };
    }
]);

App.controller('UploaderController', [
    '$scope', '$rootScope', 'MonAlbum',
    function UploaderController($scope, $rootScope, MonAlbum) {
    }
]);
