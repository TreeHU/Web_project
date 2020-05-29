'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','ngDialog','$http', 'FacilityTotalUsage',
  function ($scope, Authentication, ngDialog, $http, FacilityTotalUsage) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
    $scope.open = function (type) {
      $scope.type=type;
      /* div 태그 안으로 수정*/
      ngDialog.open({
        template: 'firstDialogId',
        controller: 'FacilitiesPopupController',
        scope: $scope
      });
    };
    // $scope.headquterCount = setFacilityCount('지역본부');
    // $scope.laboratoryCount = setFacilityCount('연구소');
    // $scope.buildingCount = setFacilityCount('사옥');
    // $scope.trainingCenterCount= setFacilityCount('연수원');
    
    function setFacilityCount(type){
      var parameter = new Object();
      parameter.type=type;
      $http.post('/api/facilitycountbytype',parameter).success(function (response) {        
        return response;
         
       }).error(function (response) {
         alert(response.massage);
       });
    }



  }
]);