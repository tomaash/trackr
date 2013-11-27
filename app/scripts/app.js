'use strict';

angular.module('trackrApp', ['restangular'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api/v1');
        RestangularProvider.setRestangularFields({id: "_id"});
    });

