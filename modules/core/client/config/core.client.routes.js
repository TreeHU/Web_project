'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RouteHelpersProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider, helper) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    $locationProvider.html5Mode(false);

    // default route
    $urlRouterProvider.otherwise('/home');

    // Home state routing
    $stateProvider
    .state('app', {
      // url: '/',
      abstract: true,
      templateUrl: 'modules/core/client/views/core.client.view.html',
      resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'easypiechart', 'toaster', 'whirl')
    })
    

    .state('app.home', {
      url: '/home',
      templateUrl: 'modules/core/client/views/home.client.view.html',
      resolve: angular.extend(helper.resolveFor('angular-autocomplete','ngDialog','datatables','navermap','loadGoogleMapsJS','chart.js','angular-carousel',function(){
        return loadGoogleMaps(undefined,'AIzaSyC9dnIxKgE8STGPg_pKKOzBz5zPRIcD0I8',undefined);
      },'ui.map'), {
        tpl: function() {
            return {
                path: 'modules/elements/client/views/ngdialog-template.client.view.html'
            };
        }
     })
    })
    .state('app.not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('app.bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('app.forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });

    //
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // -----------------------------------
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })

  }
]);
