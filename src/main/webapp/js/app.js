'use strict';

// Declare app level module which depends on filters, and services
var spatwork = angular.module('spatwork', ['ngRoute', 'spatworkControllers', 'spatworkFilters', 'spatworkServices']);

//App controllers
var controllers = angular.module('spatworkControllers', ['restangular']);

spatwork.config(function($routeProvider, RestangularProvider) {

    $routeProvider
        .when('/players',
        {
            templateUrl: 'partials/players.html',
            controller: 'PlayersCtrl'
        });

    $routeProvider
        .when('/ranking', {
            templateUrl: 'partials/ranking.html',
            controller: 'RankCtrl'
    });

    $routeProvider
        .when('/game', {
            templateUrl: 'partials/game.html',
            controller: 'GameCtrl'
    });

    $routeProvider
        .when('/next-game', {
            templateUrl: 'partials/next-game.html',
            controller: 'NextGameCtrl'
    });

    $routeProvider
        .when('/about', {
            templateUrl: 'partials/about.html'
    });

    $routeProvider
        .otherwise({redirectTo: '/players'});

    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRestangularFields({
        id: '_id'
    });
});

spatwork.controller("AppCtrl", function($rootScope){
    $rootScope.$on("$routeChangeError", function(){
        console.log("Failed to route!");
    })
});
