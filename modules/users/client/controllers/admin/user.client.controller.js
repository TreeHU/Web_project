'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve','dateUtils','Notify',
  function ($scope, $state, Authentication, userResolve, dateUtils,Notify) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;
    $scope.remove = function (user) {
      if (confirm('정말로 사용자를 삭제하시겠습니까?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            Notify.alert( 
              '데이터가 성공적으로 삭제되었습니다.', 
              {status: 'success'}
          );
            $state.go('app.users');
          });
        }
      }
    };
    $scope.yyyymmddhhmmss = function(date){
      return dateUtils.yyyymmddhhmmss(date);
    }

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      //자기 자신 수정시 DisplayName이 변동되지않는데...
      var user = $scope.user;
      user.$update(function () {
        Notify.alert( 
          '데이터가 성공적으로 변경되었습니다.', 
          {status: 'success'}
        );
        $state.go('app.users');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
