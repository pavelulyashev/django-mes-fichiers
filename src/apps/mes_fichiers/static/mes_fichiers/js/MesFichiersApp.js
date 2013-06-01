'use strict';

var App = angular.module('ngUploaderView', ['ngResource', 'blueimp.fileupload']);

App.factory('MonAlbum', [
    '$resource',
    function ($resource) {
        return $resource('/mes_fichiers/rest/albums/:id', {
            id: '@id' //this binds the ID of the model to the URL param
        }, {
            query: { method: 'GET', isArray: true },
            save: { method: 'PUT' },
            create: { method: 'POST' },
            destroy: { method: 'DELETE' }
        });
    }
]);

App.factory('MonFichier', [
    '$resource',
    function ($resource) {
        return $resource('/mes_fichiers/rest/files/:id', {
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

        headers.common['X-CSRFToken'] = token.value;
        // jQuery-file-upload uses jQuery.ajax
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
        $routeProvider.when('/mes_fichiers/', {
            templateUrl: '/albums.html',
            controller: 'AlbumsController',
            resolve: { albums: 'retrieveAlbums' }
        });

        $routeProvider.when('/mes_fichiers/album/', {
            templateUrl: '/album.html',
            controller: 'NewAlbumController',
            resolve: { albums: 'retrieveAlbums' }
        });

        $routeProvider.when('/mes_fichiers/album/:albumId', {
            templateUrl: '/album.html',
            controller: 'AlbumController',
            resolve: { albums: 'retrieveAlbums',
                       album: retrieveAlbum }
        });

        $routeProvider.otherwise({
            redirectTo: '/mes_fichiers/'
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
                album.files_count = album.files.length;
                albumsObj[album.id] = album;
            }
            albumsLoaded.resolve(albumsObj);
        }

        return albumsLoaded.promise;
    }
]);

App
.controller('AlbumController', [
    '$scope', '$rootScope', '$location', 'MonAlbum', 'albums', 'album',
    function AlbumController($scope, $rootScope, $location, MonAlbum, albums, album) {
        var album = $scope.album = angular.extend(albums[album.id], album);
        album._fetched = true;
        $scope.queue = album.files;
        $rootScope.activeAlbum = album.id;

        $scope.saveAlbum = function() {
            if ($scope.albumForm.$valid) {
                new MonAlbum({
                    id: album.id,
                    name: album.name,
                    description: album.description
                }).$save(function() {
                    $scope.albumForm.$setPristine();
                });
            }
        };

        $scope.removeAlbum = function() {
            if (confirm('Are you sure you want to remove this album?')) {
                new MonAlbum({id: album.id}).$destroy(function() {
                    delete albums[album.id];
                    $location.url('/mes_fichiers/');
                });
            }
        };

        $scope.setCover = function() {
            new MonAlbum({
                id: album.id,
                cover: album.cover && album.cover.id
            }).$save(updateAlbum);
        };

        $scope.$on('fileuploaddone', function(e, data) {
            var file = data.result;
            var queuedFile = data.files[0];
            angular.extend(queuedFile, data.result);
            ++album.files_count;
        });

        function updateAlbum(updatedAlbum) {
            angular.extend(album, updatedAlbum);
        }
    }
]);

function retrieveAlbum($rootScope, $q, $route, MonAlbum) {
    var albumId = Number($route.current.params.albumId);

    function getFromRootScope() {
        if ($rootScope.albums) {
            var album = $rootScope.albums[albumId];
            if (album && album._fetched) {
                return album;
            }
        }
    }

    function getPromiseForAlbum() {
        var albumLoaded = $q.defer();
        MonAlbum.get({ id: albumId }, function(album) {
            albumLoaded.resolve(album);
        });
        return albumLoaded.promise;
    }

    return getFromRootScope() || getPromiseForAlbum();
}

App.controller('NewAlbumController', [
    '$scope', '$rootScope', '$location', 'MonAlbum',
    function NewAlbumController($scope, $rootScope, $location, MonAlbum) {
        $rootScope.activeAlbum = 'new';
        $scope.album = {
            files_count: 0
        };

        $scope.saveAlbum = function() {
            if (this.albumForm.$valid) {
                new MonAlbum($scope.album).$create(onAlbumCreated);
            }
        };

        function onAlbumCreated(newAlbum) {
            var newAlbum = angular.extend($scope.album, newAlbum);
            $rootScope.albums[newAlbum.id] = newAlbum;
            $location.url('/mes_fichiers/album/' + newAlbum.id);
        }
    }
]);

App.controller('FileController', [
    '$scope', 'MonFichier',
    function($scope, MonFichier) {
        var album = $scope.$parent.album;
        var file = $scope.file;

        if (file.error) {
            file.$deleted = true;
        }

        // Newly uploaded file is instance of File,
        // File.name is only getter, so we need model another field
        file.name_ = file.name;

        $scope.saveFile = function() {
            if ($scope.fileForm.$valid) {
                new MonFichier({
                    id: file.id,
                    name: file.name_,
                    description: file.description
                }).$save(function() {
                    $scope.fileForm.$setPristine();
                });
            }
        };

        $scope.removeFile = function() {
            if (confirm('Are you sure you want to remove this file?')) {
                new MonFichier({id: file.id}).$destroy(removeFileFromAlbum);
            }
        };

        $scope.sendToEditor = function() {
            window.parent.postMessage(file, window.parent.location.href);
        };

        function removeFileFromAlbum() {
            file.$deleted = true;
            --album.files_count;

            if (album.cover && album.cover.id === file.id) {
                album.cover = null;
                $scope.$parent.setCover();
            }
        }
    }
]);

App.directive('ngMonFichier', function() {
    return {
        controller: 'FileController',
        templateUrl: '/file.html',
        scope: false
    }
});
