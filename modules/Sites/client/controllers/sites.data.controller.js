(function () {
    'use strict';

    angular
        .module('app.sites')
        .controller('SiteDataController', SiteDataController);

    SiteDataController.$inject = ['$scope', '$timeout', '$stateParams', '$http', 'dateUtils', 'facilityInfo', 'customerBaseLineUtils', 'predict'];
    function SiteDataController($scope, $timeout, $stateParams, $http, dateUtils, facilityInfo, customerBaseLineUtils, predict) {
        var vm = this;
        var CBL_MODE={QUATER:3,HALF:6,HOUR:12};
        var date = new Date();
        
        //object변수 안의 배열들을 소수점 3자리까지
        function tofixed_3_obj(obj) {
            for (var key in obj) {
                obj[key] = obj[key].map(function (item) {
                    return item.toFixed(3);
                });
            }
            return obj;
        }
        activate();

        function activate() {
            facilityInfo.getFacilityInfo1($stateParams.facil_Id).then(function (info) {
                facilityInfo.supply60min_Today($stateParams.facil_Id).then(function (pre60min) {  
                    facilityInfo.getFacilityElecUsage(info.facilName,date).then(function(usage){
                        facilityInfo.getFacilityElecSupply(info.facilName,date).then(function(supply){
                            // customerBaseLineUtils.getCustomerBaseLineMax4Per5(info.equip_Id,CBL_MODE.HOUR).then(function(cblDataHour){
                                // customerBaseLineUtils.getCustomerBaseLineMax4Per5(info.equip_Id,CBL_MODE.HALF).then(function(cblDataHalf){
                                    // customerBaseLineUtils.getCustomerBaseLineMax4Per5(info.equip_Id,CBL_MODE.QUATER).then(function(cblDataQuater){
                            
                            var data = new Object();
                            var data_EC = new Object(); //EC는 전력 소비
                            var data_EO = new Object(); //EC는 전력 생산
                            var MODE = { RAW: 1, QUATER: 3, HALF: 6, HOUR: 12 };
                            
                            data_EC = ValueandPredict(usage,"Usage");
                            data_EO = ValueandPredict(supply,"Supply");
                            // data_EC.raw = filterNowIndex(data_EC.raw, MODE.RAW);
                            // data_EC.valueDataQuaterHour = filterNowIndex(data_EC.valueDataQuaterHour, MODE.QUATER);
                            // data_EC.valueDataHalfHour = filterNowIndex(data_EC.valueDataHalfHour, MODE.HALF);
                            // data_EC.valueDataHour = filterNowIndex(data_EC.valueDataHour, MODE.HOUR);

                            // data_EO.raw = filterNowIndex(data_EO.raw, MODE.RAW);
                            // data_EO.valueDataQuaterHour = filterNowIndex(data_EO.valueDataQuaterHour, MODE.QUATER);
                            // data_EO.valueDataHalfHour = filterNowIndex(data_EO.valueDataHalfHour, MODE.HALF);
                            // data_EO.valueDataHour = filterNowIndex(data_EO.valueDataHour, MODE.HOUR);


                            function ValueandPredict(obj,mode) { //value값으로만 배열로 만들기
                                var allData=new Object(); //최종 오브젝트
                                var valueData=new Object(); //값들만 분리
                                var preData=new Object(); //예측값 오브젝트
                                
                                valueData.raw = [];
                                valueData.valueDataQuaterHour = [];
                                valueData.valueDataHalfHour = [];
                                valueData.valueDataHour = [];
                                
                                //5분,15분,30분,60분 별로 데이터들을 value값들만 배열에 push
                                obj._5min.forEach(function (item) {
                                    valueData.raw.push(item.value);
                                }); 
                                obj._15min.forEach(function (item) {
                                    valueData.valueDataQuaterHour.push(item.value);
                                });
                                obj._30min.forEach(function (item) {
                                    valueData.valueDataHalfHour.push(item.value);
                                });
                                switch(mode){
                                    case "Usage":
                                        obj._60min.forEach(function (item) {
                                            valueData.valueDataHour.push(item.value);
                                        });
                                        preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);
                                        break;
                                    case "Supply":
                                        preData.valueDataHour=[];
                                        pre60min.forEach(function (item) {
                                            preData.valueDataHour.push(item.productAmount);
                                        });
                                        break; 
                                }

                                preData.raw = predict.pre1Call(valueData.raw);
                                preData.valueDataQuaterHour = predict.pre1Call(valueData.valueDataQuaterHour);
                                preData.valueDataHalfHour = predict.pre1Call(valueData.valueDataHalfHour);
                                // preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);
                                //data:raw 데이터오브젝트 / pre: 예측데이터 오브젝트
                                allData.data =tofixed_3_obj(valueData);
                                allData.pre =tofixed_3_obj(preData);
   
                                return allData;
                            }
                            function filterNowIndex(arr, mode){
                                var len = dateUtils.timeToIndex(date);
                                /*
                                총 사용량, 생산량 mmIndex 시간에 맞지 않는 데이터 삭제 (현재시간 17:30, mmIndex:288-> 삭제)
                                */
                                for(var i=0; i<arr.length; i++){
                                    if((len/mode) < arr[i].mmIndex){
                                        arr.splice(i,1);
                                    }
                                }
                                //중간에 누락된 데이터 value : 0 으로 채움
                                for(var i=0; i<arr.length; i++){
                                    var obj = new Object();
                                    if(arr[i].mmIndex != i+1){
                                        obj.YYYYMMDDHH = dateUtils.yyyymmdd(date);
                                        obj.mmIndex = i+1;
                                        obj.value = 0;
                                        arr.splice(i,0,obj);    
                                    }
                                }
                                return arr;
                            } 

                            //주석 삭제하지 말것!
                            // cblDataQuater.data.forEach(function(obj,index){
                            //     for(var key in obj){
                            //         data.cblDataQuater.push(obj[key]);
                            //     }
                            // });
                            // cblDataHalf.data.forEach(function(obj,index){
                            //     for(var key in obj){
                            //         data.cblDataHalf.push(obj[key]);
                            //     }
                            // })
                            // cblDataHour.data.forEach(function(obj,index){
                            //     for(var key in obj){
                            //         data.cblDataHour.push(obj[key]);
                            //     }
                            // })
                            // for(var i=0; i<288; i++){
                            //     var dic = new Object();
                            //     if(i+1 != data.raw[i].mmIndex){
                            //         dic['equip_Id'] = info.equip_Id;                      
                            //         dic['YYYYMMDDHH'] = dateUtils.yyyymmdd(date);
                            //         dic['mmIndex'] = i+1;
                            //         dic['Value_5min'] = 0;
                            //         data.raw.splice(i, 0, dic);
                            //     }
                                
                            // }


                            data.info=info;
                            data_EC.info=info;
                            data_EO.info=info;
                            
                            $scope.$broadcast('info', data);
                            $scope.$broadcast('demandData', data_EC);
                            $scope.$broadcast('supplyData', data_EO);
                            $scope.$broadcast('Elec_demandData',data_EC);
                            $scope.$broadcast('Elec_supplyData',data_EO);
                        });
                    });
                });
                    // });
                // });
            // });
            });
        }
    }
})();