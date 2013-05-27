'use strict';

var App = angular.module('ngUploaderView', ['ngResource', 'blueimp.fileupload']);

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
        return $resource('/file_uploader/rest/files/:id', {
            id: '@id' //this binds the ID of the model to the URL param
        }, {
            query: { method: 'GET', isArray: true },
            save: { method: 'PUT' },
            create: { method: 'POST' },
            destroy: { method: 'DELETE' }
        });
    }
]);

App.factory('AlbumCache', [
    '$cacheFactory',
    function($cacheFactory) {
        return $cacheFactory('AlbumCache');
    }
]);

App.config([
    '$httpProvider',
    function($httpProvider) {
        var headers = $httpProvider.defaults.headers;
        var token = document.querySelector('input[name=csrfmiddlewaretoken]');

        headers.common['X-CSRFToken'] = token.value;
        $.ajaxSetup({
            headers: { 'X-CSRFToken': token.value }
        });
    }
]);

App.config([
    '$httpProvider', 'fileUploadProvider',
    function ($httpProvider, fileUploadProvider) {
        angular.extend(fileUploadProvider.defaults, {
            disableImageResize: true,
            previewMaxWidth: 158,
            previewMaxHeight: 140,
            previewCrop: true,
            maxFileSize: 5000000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            autoUpload: true
        });
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
                       album: retrieveAlbum }
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
.service('retrieveAlbums', [
    '$rootScope', '$q', 'MonAlbum',
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
]);

App
.controller('AlbumController', [
    '$scope', '$rootScope', 'MonAlbum', 'albums', 'album',
    function AlbumController($scope, $rootScope, MonAlbum, albums, album) {

        $scope.saveAlbum = function() {
            if (this.albumForm.$valid) {
                album.$save(function() {
                    albums[album.id] = album;
                    setActiveAlbum(album);
                });
            }
        };

        $scope.$on('fileuploaddone', function(e, data) {
            var file = data.result;
            var queuedFile = data.files[0];
            angular.extend(queuedFile, data.result);
        });

        setActiveAlbum(album);
        $scope.queue = $scope.album.files;

        function setActiveAlbum(album) {
            $scope.album = new MonAlbum(album);
            $rootScope.activeAlbum = album.id;
        }
    }
]);

function retrieveAlbum($q, $route, AlbumCache, MonAlbum) {
    var albumId = $route.current.params.albumId;

    function getPromiseForAlbum() {
        var albumLoaded = $q.defer();
        MonAlbum.get({ id: albumId }, function(album) {
            AlbumCache.put(albumId, album);
            albumLoaded.resolve(album);
        });
        return albumLoaded.promise;
    }

    return AlbumCache.get(albumId) || getPromiseForAlbum();
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
                });
            }
        };
    }
]);

App.controller('FileController', [
    '$scope', 'MonFile',
    function($scope, MonFile) {
        console.log($scope.$parent.$index);
        var album = $scope.$parent.$parent.album;
        var file = $scope.file = new MonFile($scope.$parent.image);

        $scope.saveFile = function() {
            if (this.fileForm.$valid) {
                file.$save(function() { });
            }
        };

        $scope.removeFile = function() {
            if (confirm('Are you sure you want to remove this file?')) {
                $scope.file.$destroy(function() {
                    // remove file from album files
                });
            }
        };

        $scope.setAsAlbumCover = function() {

        };
    }
]);
