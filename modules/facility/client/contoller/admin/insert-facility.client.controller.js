/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

 (function() {
    'use strict';

    angular
        .module('app.facility.admin')
        .controller('FacilityInsertController', FacilityInsertController);

        FacilityInsertController.$inject = ['$timeout', '$resource','$stateParams','$http','$scope','dateUtils','Notify','$state'];
    function FacilityInsertController($timeout, $resource,$stateParams,$http,$scope,dateUtils,Notify,$state) {
        var vm = this;
        var parameter = new Object();
        var jsonString = {
            "name" : "",
            "district" : "",
            "address" : [ 
                ""
            ],
            "tell_am" : "",
            "tell_pm" : "",
            "latitude" : 0,
            "longitude" : 0,
            "type" : "",
            "updated" : dateUtils.yyyymmdd(Date.now()),
            "EquipmentId" : [ 
                ""
            ]
        };
        init();
        
        function init(){
            var copy = Object.assign({}, jsonString);
            $scope.obj = {data: copy, options: { mode: 'tree', onEditable: function(node){
                var preventProperties = [];
                if(!preventProperties.includes(node.field))
                return true;
                else return false;
            }
          }
        };
        }
        $scope.insert = function(){
            if(confirm('생성 하시겠습니까?')){
                //Submit
                $http.post('/api/facility/insert',$scope.obj.data).success(function(result) {
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

        $scope.cancle = function(){
            if(confirm('초기화 하시겠습니까?')){
                $scope.obj.data = Object.assign({},jsonString);   
                $timeout(function(){
                    
                    Notify.alert( 
                        '데이터가 성공적으로 초기화되었습니다.', 
                        {status: 'success'}
                    );
                  
                }, 500);
            }
            
        }

    }
})();

