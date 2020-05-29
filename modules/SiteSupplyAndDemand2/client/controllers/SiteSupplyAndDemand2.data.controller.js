(function () {
    'use strict';

    angular
        .module('app.SiteSupplyAndDemand2')
        .controller('SDDataController', SDDataController);

    SDDataController.$inject = ['$scope',  '$timeout', '$stateParams', '$http', 'dateUtils', 'FacilityTotalUsage','customerBaseLineUtils','SDSite','predict'];
    function SDDataController($scope,  $timeout, $stateParams, $http, dateUtils, FacilityTotalUsage, customerBaseLineUtils, SDSite,predict) {
        var vm = this;
        var CBL_MODE={QUATER:3,HALF:6,HOUR:12};
        var date = new Date();
        activate();

        function activate() {
            //데이터가 안들어올때 마지막 mmIndex는 288이지만 총 갯수는 288미만일때가 존재 => mmIndex를 실제갯수와 맞춰서
            //존재하지않는 mmIndex에는 데이터 종류에 따라 consumption = 0 혹은 output=0 삽입
            FacilityTotalUsage.SDTotalUsage(date).then(function(usage){
                FacilityTotalUsage.SDTotalSupply(date).then(function(supply){
                    SDSite.SDDemandByuses(date).then(function(uses){
                        SDSite.SDSupplyByuses(date).then(function(uses_supply){
                            FacilityTotalUsage.SDTpredictHour(date).then(function(predictHour){//공급1시간 예측값 
                            
                               // console.log(predictHour);

                            var data = new Object();//총 사용량
                            var output = new Object();//총 생산량

                            var usesData = new Object();//용도별 사용량 (교육 상업 주거)
                            var usesData_supply = new Object(); //용도별 생산량 (교육 상업 주거)

                            var result = new Object();//사용량,생산량 담을 객체

                            result.pre_usage=[];
                            result.pre_output=[];
                            //result.pre_output.valueDataHour=[];

                            
                            var valueData=new Object();//사용량 생산량 value값만 
                            valueData.data =[];
                            valueData.output =[];
                            
                            //딥러닝 예측
                            var deepdade = new Object();
                            /*
                             총 사용량
                            */

                       
                            data.valueDataHour=[];
                            data.valueDataHalfHour=[];
                            data.valueDataQuaterHour=[];
                            data.raw = usage.value_5min;
                            for( var i=0; i<usage.value_15min.length; i++){
                                if(data.valueDataQuaterHour[i]===undefined){
                                    data.valueDataQuaterHour[i]=0;
                                }
                                data.valueDataQuaterHour[i]+=usage.value_15min[i].value;
                            }
                            for( var i=0; i<usage.value_30min.length; i++){
                                if(data.valueDataHalfHour[i]===undefined){
                                    data.valueDataHalfHour[i]=0;
                                }
                                data.valueDataHalfHour[i]+=usage.value_30min[i].value;
                            }
                            for( var i=0; i<usage.value_60min.length; i++){
                                if(data.valueDataHour[i]===undefined){
                                    data.valueDataHour[i]=0;
                                }
                                data.valueDataHour[i]+=usage.value_60min[i].value;
                            }
                         

                        
                            /*
                             총 생산량
                            */
                            output.valueDataHour=[];
                            output.valueDataHalfHour=[];
                            output.valueDataQuaterHour=[];
                            output.raw = supply.value_5min;//usageservercontroller고치기 

                            for( var i=0; i<supply.value_15min.length; i++){
                                if(output.valueDataQuaterHour[i]===undefined){
                                    output.valueDataQuaterHour[i]=0;
                                }
                                output.valueDataQuaterHour[i]+=supply.value_15min[i].value;
                            }
                            for( var i=0; i<supply.value_30min.length; i++){
                                if(output.valueDataHalfHour[i]===undefined){
                                    output.valueDataHalfHour[i]=0;
                                }
                                output.valueDataHalfHour[i]+=supply.value_30min[i].value;
                            }
                            for( var i=0; i<supply.value_60min.length; i++){
                                if(output.valueDataHour[i]===undefined){
                                    output.valueDataHour[i]=0;
                                }
                                output.valueDataHour[i]+=supply.value_60min[i].value;
                            }



                            //데이터 필터 
                            data.raw.forEach(function (item) {
                                valueData.data.push(item.value);
                            }); 
                            output.raw.forEach(function (item) {
                                valueData.output.push(item.value);
                            });

                            
                            /*
                             사용량,생산량 예측값
                            */

                            function Pre_result(valueData) { 
                                var preData=new Object(); 
                                preData.valueDataHour=[];
                                var rawdata=[];
                                valueData.raw.forEach(function (item) {
                                    rawdata.push(item.value);
                                }); 
                                

                                preData.raw = predict.pre1Call(rawdata);
                                preData.valueDataQuaterHour = predict.pre1Call(valueData.valueDataQuaterHour);
                                preData.valueDataHalfHour = predict.pre1Call(valueData.valueDataHalfHour);
                                //preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);

                                return preData;
                                
                            }

                           
                            result.pre_usage= Pre_result(data);
                            result.pre_output=Pre_result(output);
                            //사용량 1시간 예측
                            result.pre_usage.valueDataHour=predict.pre1Call(data.valueDataHour);
                            //공급량 1시간 예측 
                            predictHour.value_5min.forEach(function (item) {
                                result.pre_output.valueDataHour.push(item.valueHour);
                            }); 

                            // predictHour.value_5min.forEach(function (item) {
                            //     result.pre_usage.valueDataHour.push(item.valueHour);
                            // }); 


                            // result.pre_usage.valueDataHour
                            console.log(data);
                            console.log(result.pre_output);
                       


                            /*
                             용도별 사용량
                            */
                            usesData.edu = new Object(); //교육
                            usesData.edu.raw = [];
                            usesData.edu.valueDataHalfHour = [];
                            usesData.edu.valueDataHour = [];
                            usesData.edu.valueDataQuaterHour = [];

                            usesData.commercial = new Object(); //상업
                            usesData.commercial.raw = [];
                            usesData.commercial.valueDataHalfHour = [];
                            usesData.commercial.valueDataHour = [];
                            usesData.commercial.valueDataQuaterHour = [];

                            usesData.residential = new Object(); //주거
                            usesData.residential.raw = [];
                            usesData.residential.valueDataHalfHour = [];
                            usesData.residential.valueDataHour = [];
                            usesData.residential.valueDataQuaterHour = [];
                            /*
                             용도별 생산량
                            */
                            usesData_supply.edu = new Object(); //교육
                            usesData_supply.edu.raw = [];
                            usesData_supply.edu.valueDataHalfHour = [];
                            usesData_supply.edu.valueDataHour = [];
                            usesData_supply.edu.valueDataQuaterHour = [];

                            usesData_supply.commercial = new Object(); //상업
                            usesData_supply.commercial.raw = [];
                            usesData_supply.commercial.valueDataHalfHour = [];
                            usesData_supply.commercial.valueDataHour = [];
                            usesData_supply.commercial.valueDataQuaterHour = [];

                            usesData_supply.residential = new Object(); //주거
                            usesData_supply.residential.raw = [];
                            usesData_supply.residential.valueDataHalfHour = [];
                            usesData_supply.residential.valueDataHour = [];
                            usesData_supply.residential.valueDataQuaterHour = [];

                            //uses, uses_supply 원본 데이터 mmIndex:1 부터 안들어올때가있음.
                            for(var i=0; i<uses.value_5min.length; i++){   
                                if(uses.value_5min[i].uses == '교육'){
                                    usesData.edu.raw.push(uses.value_5min[i]);
                                }
                                if(uses.value_5min[i].uses == '상업'){
                                    usesData.commercial.raw.push(uses.value_5min[i]);
                                }
                                if(uses.value_5min[i].uses == '주거'){
                                    usesData.residential.raw.push(uses.value_5min[i]);
                                }                                
                            }

                           
                            //15분데이터 

                            for(var i=0; i<uses.value_15min.length; i++){   
                                if(uses.value_15min[i].uses == '교육'){
                                    usesData.edu.valueDataQuaterHour.push(uses.value_15min[i].value);
                                }
                                if(uses.value_15min[i].uses == '상업'){
                                    usesData.commercial.valueDataQuaterHour.push(uses.value_15min[i].value);
                                }
                                if(uses.value_15min[i].uses == '주거'){
                                    usesData.residential.valueDataQuaterHour.push(uses.value_15min[i].value);
                                }                                
                            }


                            //30분 데이터
                            
                            for(var i=0; i<uses.value_30min.length; i++){   
                                if(uses.value_30min[i].uses == '교육'){
                                    usesData.edu.valueDataHalfHour.push(uses.value_30min[i].value);
                                }
                                if(uses.value_30min[i].uses == '상업'){
                                    usesData.commercial.valueDataHalfHour.push(uses.value_30min[i].value);
                                }
                                if(uses.value_30min[i].uses == '주거'){
                                    usesData.residential.valueDataHalfHour.push(uses.value_30min[i].value);
                                }                                
                            }


                            //60분 데이터 
                            for(var i=0; i<uses.value_60min.length; i++){   
                                if(uses.value_60min[i].uses == '교육'){
                                    usesData.edu.valueDataHour.push(uses.value_60min[i].value);
                                }
                                if(uses.value_60min[i].uses == '상업'){
                                    usesData.commercial.valueDataHour.push(uses.value_60min[i].value);
                                }
                                if(uses.value_60min[i].uses == '주거'){
                                    usesData.residential.valueDataHour.push(uses.value_60min[i].value);
                                }                                
                            }

                                                   
                          //공급 5분 데이터 
                            
                            for(var i=0; i<uses_supply.value_5min.length; i++){
                                if(uses_supply.value_5min[i].uses == '교육'){
                                    usesData_supply.edu.raw.push(uses_supply.value_5min[i]);
                                }
                                if(uses_supply.value_5min[i].uses == '상업'){
                                    usesData_supply.commercial.raw.push(uses_supply.value_5min[i]);
                                }
                                if(uses_supply.value_5min[i].uses == '주거'){
                                    usesData_supply.residential.raw.push(uses_supply.value_5min[i]);
                                }
                            }

                            // 공급 15분 데이터

                            for(var i=0; i<uses_supply.value_15min.length; i++){   
                                if(uses_supply.value_15min[i].uses == '교육'){
                                    usesData_supply.edu.valueDataQuaterHour.push(uses_supply.value_15min[i].value);
                                }
                                if(uses_supply.value_15min[i].uses == '상업'){
                                    usesData_supply.commercial.valueDataQuaterHour.push(uses_supply.value_15min[i].value);
                                }
                                if(uses_supply.value_15min[i].uses == '주거'){
                                    usesData_supply.residential.valueDataQuaterHour.push(uses_supply.value_15min[i].value);
                                }                                
                            }

                            //공급 30분 데이터

                            for(var i=0; i<uses_supply.value_30min.length; i++){   
                                if(uses_supply.value_30min[i].uses == '교육'){
                                    usesData_supply.edu.valueDataHalfHour.push(uses_supply.value_30min[i].value);
                                }
                                if(uses_supply.value_30min[i].uses == '상업'){
                                    usesData_supply.commercial.valueDataHalfHour.push(uses_supply.value_30min[i].value);
                                }
                                if(uses_supply.value_30min[i].uses == '주거'){
                                    usesData_supply.residential.valueDataHalfHour.push(uses_supply.value_30min[i].value);
                                }                                
                            }

                            //공급 1시간 데이터 
                            for(var i=0; i<uses_supply.value_60min.length; i++){   
                                if(uses_supply.value_60min[i].uses == '교육'){
                                    usesData_supply.edu.valueDataHour.push(uses_supply.value_60min[i].value);
                                }
                                if(uses_supply.value_60min[i].uses == '상업'){
                                    usesData_supply.commercial.valueDataHour.push(uses_supply.value_60min[i].value);
                                }
                                if(uses_supply.value_60min[i].uses == '주거'){
                                    usesData_supply.residential.valueDataHour.push(uses_supply.value_60min[i].value);
                                }                                
                            }
                         


                        
                          

                        
                            
                                                   
                           // function filterNowIndex(arr,type,insertdata){
                            //     var len = dateUtils.timeToIndex(date);
                            //     /*
                            //     총 사용량, 생산량 mmIndex 시간에 맞지 않는 데이터 삭제 (현재시간 17:30, mmIndex:288-> 삭제)
                            //     */
                            //     for(var i=0; i<arr.length; i++){
                            //         if(len < arr[i].mmIndex){
                            //             arr.splice(i,1);
                            //         }
                            //     }
                            //     //중간에 누락된 데이터 value : 0 으로 채움
                            //     for(var i=0; i<arr.length; i++){
                            //         var obj = new Object();
                            //         if(arr[i].mmIndex != i+1){
                            //             if(type){//type 인자 있으면 배열에 넣어주는 형식 지정
                            //                 obj.uses = type;
                            //                 obj.mmIndex = i+1;
                            //                 obj.YYYYMMDDHH = dateUtils.yyyymmdd(date);
                            //                 obj.value = 0;
                            //                 arr.splice(i,0,obj);                                            
                            //             }else{ //type 인자 없을때 넣어주는 형식 지정
                            //                 obj.mmIndex = i+1;
                            //                 obj.YYYYMMDDHH = dateUtils.yyyymmdd(date);
                            //                 obj.value = 0;
                            //                 arr.splice(i,0,obj);    
                            //             }
                            //         }
                            //     }
                            //     //15분 30분 60분 그룹핑
                            //     for(var i=0; i<arr.length; i++){
                            //         if (arr[i].YYYYMMDDHH === dateUtils.yyyymmdd(date)) {
                            //             if (insertdata.valueDataQuaterHour[parseInt(i / 3)] === undefined) {
                            //                 insertdata.valueDataQuaterHour[parseInt(i / 3)] = 0;
                            //             }
                            //             insertdata.valueDataQuaterHour[parseInt(i / 3)] += arr[i].value;
                
                            //             if (insertdata.valueDataHalfHour[parseInt(i / 6)] === undefined) {
                            //                 insertdata.valueDataHalfHour[parseInt(i / 6)] = 0;
                            //             }
                            //             insertdata.valueDataHalfHour[parseInt(i / 6)] += arr[i].value;
                
                            //             if (insertdata.valueDataHour[parseInt(i / 12)] === undefined) {
                            //                 insertdata.valueDataHour[parseInt(i / 12)] = 0;
                            //             }
                            //             insertdata.valueDataHour[parseInt(i / 12)] += arr[i].value;
                            //         }
                            //     }

                            // }

                            result.usage = data;
                            result.supply = output;
                            result.uses = usesData;
                            result.uses_supply = usesData_supply;
                            
                            $scope.$broadcast('SdData',result);
                        });
                        });
                    });
                });

            });


            
        }
    }
})();