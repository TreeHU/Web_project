'use strict';

angular.module('core').controller('SitesController', ['$scope', 'Authentication','ngDialog','$http', 'FacilityTotalUsage',
  function ($scope, Authentication, ngDialog, $http, FacilityTotalUsage) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
    $scope.open = function () {
    //   $scope.type=type;
      /* div 태그 안으로 수정*/
      ngDialog.open({
        template: 'firstDialogId',
        controller: 'FacilitiesPopupController',
        scope: $scope
      });
    }; 
  }
]);