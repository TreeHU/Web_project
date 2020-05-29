(function() {
    'use strict';

    angular
        .module('app.SiteSupplyAndDemand')
        .config(appRoutes);
    appRoutes.$inject = ['$stateProvider', 'RouteHelpersProvider'];

    function appRoutes($stateProvider, helper) {

        $stateProvider
            .state('app.SiteSupplyAndDemand', {
                url: '/SiteSupplyAndDemand',
                templateUrl: 'modules/SiteSupplyAndDemand/client/views/SiteSupplyAndDemand.client.view.html',
                controller : 'SDDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons','chart.js')
            });


    }
})();