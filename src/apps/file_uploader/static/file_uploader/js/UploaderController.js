'use strict';

angular.module('ngUploaderView', [], function($routeProvider, $locationProvider) {
    $routeProvider.when('/file_uploader/', {
        templateUrl: '/albums.html',
        controller: AlbumsController
    });

    $routeProvider.when('/file_uploader/album/', {
        templateUrl: '/album.html',
        controller: NewAlbumController
    });

    $routeProvider.when('/file_uploader/album/:albumId', {
        templateUrl: '/album.html',
        controller: AlbumController
    });

    $locationProvider.html5Mode(true);
});

function AlbumsController($rootScope) {
    $rootScope.activeAlbum = null;
}

function AlbumController($scope, $routeParams, $rootScope) {
    var id = $rootScope.activeAlbum = $routeParams.albumId;
    $scope.album = $scope.$parent.albums[id];
}

function NewAlbumController($scope, $rootScope) {
    $rootScope.activeAlbum = 'new';
}

function UploaderController($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.albums = {
        1: {
            id: 1,
            title: 'Les Oiseaux',
            cover: 'http://img301.imageshack.us/img301/4472/blx8.jpg',
            images: [
                {
                    id: 1,
                    title: 'L\'Oiseaux beauté',
                    description: '',
                    thumbnail: 'http://cordis.europa.eu/news/images/20120301-2.jpg'
                },
                {
                    id: 2,
                    title: 'Oiseau',
                    description: '',
                    thumbnail: 'http://photosergio.zenfolio.com/img/s8/v83/p1428423432-11.jpg'
                },
                {
                    id: 3,
                    title: '',
                    description: '',
                    thumbnail: 'http://www.observatoire-estran-tranchais.fr/fiches-techniques/images/pipit-rousseline.jpg'
                },
                {
                    id: 4,
                    title: '',
                    description: '',
                    thumbnail: 'https://www.lebelage.ca/sites/default/files/styles/medium/public/images/articles/observer-oiseaux.jpg?itok=l6nF8tfV'
                },
                {
                    id: 23,
                    title: '',
                    description: '',
                    thumbnail: 'http://parcsaintecroix.com/wp-content/uploads/2013/03/shutterstock_58202509.jpg'
                },
                {
                    id: 89,
                    title: '',
                    description: '',
                    thumbnail: 'http://ds4.ds.static.rtbf.be/article/square200/9/d/b/200_200_4c4c413ca85d4359888b78996c464957-1328256272.jpg'
                },
                {
                    id: 122,
                    title: '',
                    description: '',
                    thumbnail: 'http://rds.relaisdsciences.org/img_clt/visuel_mnf_1336547023.jpg'
                },
                {
                    id: 7,
                    title: '',
                    description: '',
                    thumbnail: 'http://cordis.europa.eu/news/images/20100906-2.jpg'
                }
            ]
        },
        2: {
            id: 2,
            title: 'Les Animaux',
            cover: 'http://4.bp.blogspot.com/-9shlt1v0F_U/TZs-N72WMVI/AAAAAAAAAN8/_iyKyHsESqg/s1600/animaux2.jpg',
            images: [
                {
                    title: 'L\'Ours',
                    description: '',
                    thumbnail: 'http://stock.wikimini.org/w/images/c/cf/Ours_polaire.jpg'
                }
            ]
        }
    };
}