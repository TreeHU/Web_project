(function() {
    'use strict';

    angular
        .module('app.totalsite')
        .config(appRoutes);
    appRoutes.$inject = ['$stateProvider', 'RouteHelpersProvider'];

    function appRoutes($stateProvider, helper) {

        $stateProvider
            .state('app.totalsite', {
                url: '/dashboard/',
                controller:'totalSiteDataController',
                templateUrl: 'modules/dashboard/client/views/totalsite.client.view.html',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons','chart.js','c3','d3')
            })
            .state('app.totalsite_v2', {
                url: '/dashboard/v2',
                templateUrl: 'modules/dashboard/client/views/totalsite_V2.client.view.html',
                controller: 'TotalSiteV2Controller',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons','chart.js','c3','d3')
            });
            // .state('app.dashboard_v3', {
            //     url: '/dashboard/v3',
            //     title: 'Dashboard v3',
            //     controller: 'DashboardV3Controller',
            //     controllerAs: 'dash3',
            //     templateUrl: 'modules/dashboard/client/views/dashboard_v3.client.view.html',
            //     resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'vector-map', 'vector-map-maps')
            // });

    }
})();