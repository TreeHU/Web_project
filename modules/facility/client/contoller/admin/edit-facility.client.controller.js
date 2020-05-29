/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.facility.admin')
        .controller('FacilityEditController', FacilityEditController);

        FacilityEditController.$inject = ['$timeout', '$resource','$stateParams','$http','$scope','dateUtils','$state','Notify'];
    function FacilityEditController($timeout, $resource,$stateParams,$http,$scope,dateUtils,$state,Notify) {
        var vm = this;
        var parameter = new Object();
        parameter.id=$stateParams.objectId;
            $http.post('/api/facility',parameter).then(function(result) {
                vm.origin_data=result.data;
                $scope.obj = {data: result.data, options: { mode: 'tree', onEditable: function(node){
                    var preventProperties = ['_id'];
                    if(!preventProperties.includes(node.field))
                    return true;
                    else return false;
                }
            }};
        });
        $scope.update=function(){
            if(vm.origin_data===$scope.obj.data){
                Notify.alert( 
                    '변경사항이 없습니다.', 
                    {status: 'danger'}
                );
            }
            else{
                if(confirm('수정하시겠습니까?')){
                    //수정일자 변경
                    $scope.obj.data.updated = dateUtils.yyyymmdd(Date.now());
                    //Submit
                    $http.post('/api/facility/modify',$scope.obj.data).success(function(result) {
                        //페이지 이동
                        $timeout(function(){
                            
                            Notify.alert( 
                                '데이터가 성공적으로 생성되었습니다.', 
                                {status: 'success'}
                            );
                          
                        }, 500);
                        $state.go('app.facilities');
                    });
                }
            }
        }
        $scope.cancle=function(){
            $scope.obj.data = vm.origin_data;
        }
       
        
        
    }
})();

