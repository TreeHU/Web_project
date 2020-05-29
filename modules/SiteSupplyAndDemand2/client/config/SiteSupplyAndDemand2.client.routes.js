(function() {
    'use strict';

    angular
        .module('app.SiteSupplyAndDemand2')
        .config(appRoutes);
    appRoutes.$inject = ['$stateProvider', 'RouteHelpersProvider'];

    function appRoutes($stateProvider, helper) {

        $stateProvider
            .state('app.SiteSupplyAndDemand2', {
                url: '/SiteSupplyAndDemand2',
                templateUrl: 'modules/SiteSupplyAndDemand2/client/views/SiteSupplyAndDemand2.client.view.html',
                controller : 'SDDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons','chart.js')
            });


    }
})();