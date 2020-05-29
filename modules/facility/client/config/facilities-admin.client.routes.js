'use strict';

// Setting up route
angular.module('app.facility.admin').config(['$stateProvider','RouteHelpersProvider',
  function ($stateProvider,helper) {
    $stateProvider
      .state('app.facilities', {
        url: '/facilities',
        templateUrl: 'modules/facility/client/views/admin/list-facilities.client.view.html',
        controller: 'FacilityListController',
        resolve: helper.resolveFor('datatables')
      })
      .state('app.facility', {
        url: '/facilities/:facilityId',
        templateUrl: 'modules/facility/client/views/admin/view-facility.client.view.html',
        controller: 'FacilityController',
        resolve: {
          facilityResolve : ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              facilityId: $stateParams.facilityId
            });
          }]
        }
      })
      .state('app.facility-edit', {
        url: '/facilities/edit/:objectId',
        templateUrl: 'modules/facility/client/views/admin/edit-facility.client.view.html',
        controller: 'FacilityEditController',
        resolve: helper.resolveFor('ng-jsoneditor')
      })
      .state('app.insert-facility', {
        url: '/facility/insert',
        templateUrl: 'modules/facility/client/views/admin/insert-facility.client.view.html',
        controller: 'FacilityInsertController',
        resolve: helper.resolveFor('ng-jsoneditor')
      });
  }
]);
