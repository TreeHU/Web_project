(function() {
    'use strict';

    angular
        .module('app.sites')
        .config(appRoutes);
    appRoutes.$inject = ['$stateProvider', 'RouteHelpersProvider'];

    function appRoutes($stateProvider, helper) {

        $stateProvider
            .state('app.sites', {
                // url: '/sites/:equip_Id',
                url: '/sites/:facil_Id',
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller : 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons','datatables','chart.js','d3','c3')
            })
            .state('app.sites3', {
                url: "/sites/3",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites26', {
                url: "/sites/26",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites20', {
                url: "/sites/20",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites19', {
                url: "/sites/19",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites1', {
                url: "/sites/1",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites2', {
                url: "/sites/2",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites23', {
                url: "/sites/23",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites21', {
                url: "/sites/21",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites25', {
                url: "/sites/25",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites22', {
                url: "/sites/22",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites24', {
                url: "/sites/24",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites6', {
                url: "/sites/6",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites9', {
                url: "/sites/9",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites11', {
                url: "/sites/11",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites16', {
                url: "/sites/16",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites4', {
                url: "/sites/4",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites18', {
                url: "/sites/18",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites5', {
                url: "/sites/5",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites7', {
                url: "/sites/7",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites8', {
                url: "/sites/8",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites13', {
                url: "/sites/13",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites14', {
                url: "/sites/14",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites10', {
                url: "/sites/10",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites15', {
                url: "/sites/15",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites12', {
                url: "/sites/12",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            .state('app.sites17', {
                url: "/sites/17",
                templateUrl: 'modules/Sites/client/views/sites.client.view.html',
                controller: 'SiteDataController',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'datatables', 'chart.js', 'd3', 'c3')
            })
            
    
    }
})();