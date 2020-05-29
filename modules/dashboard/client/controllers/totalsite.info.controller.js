

(function () {
    'use strict';

    angular
        .module('app.totalsite')
        .controller('totalSiteInfoController', totalSiteInfoController);

    totalSiteInfoController.$inject = ['$scope', '$location', 'sessionstoarge', '$http', 'dateUtils', 'facilityInfo','FacilityTotalUsage','customerBaseLineUtils','sensorlist'];
    function totalSiteInfoController($scope, $location, sessionstoarge, $http, dateUtils, facilityInfo, FacilityTotalUsage, customerBaseLineUtils,sensorlist) {

        var facilityList;
        // if($location.path().indexOf('v2')>0){
        //     facilityInfo.getSensorList().then(function(facilList){
        //         sensorlist.convertstring(facilList).then(function(result){
        //             facilityList = result;
        //         });
        //     });
        // }else{
        //     facilityList = sessionstoarge.get('facilityList'); 
        // }
        // console.log(facilityList);
        $scope.$on('selectedData',function(event,data){
            facilityList = data.sensorlist;
            activate();
        });
        

        function momdod(twodaysU){ //dod 비율 
                var data = new Object();
                var dodValue = 0;
                var dodTodayValue = 0;
                var dodSupplyU =0; //현재 시간일때 어제 전력 공급량 
                var dodTodaySupplyU=0;//현재 전력 공급량 
                var time = new Date();
                var h = time.getHours();
                var hourIndex = (h*12);
                
                for(var ind=0; ind<twodaysU.length; ind++){
                    if(twodaysU[ind].YYYYMMDDHH=== dateUtils.PreviousDay_One(time)) {
                        for(var ind2=0; ind2<hourIndex+1; ind2++){
                            if(twodaysU[ind].mmIndex ===ind2)
                                {dodValue += twodaysU[ind].Value_5min;}//현재시간일때 어제 전력 사용량
                        }
                    }
                }                      

                for( ind=0; ind<twodaysU.length; ind++){
                    if(twodaysU[ind].YYYYMMDDHH=== dateUtils.yyyymmdd(time)) {
                        for(var ind3=0; ind3<hourIndex+1; ind3++){
                            if(twodaysU[ind].mmIndex ===ind3)
                                {dodTodayValue += twodaysU[ind].Value_5min;} //오늘 전력 사용량 
                        }
                    }
                }


                var date = new Date();
                var preMonthU =0;
                var thisMonthU=0;               
                for(var a =0; a< twodaysU.length; a++){
                    if(twodaysU[a].YYYYMMDDHH <=dateUtils.PreviousMonth(date)){
                        preMonthU +=twodaysU[a].Value_5min;
                    }
                }
                
                for(var a2=0; a2< twodaysU.length; a2++){
                    if(twodaysU[a2].YYYYMMDDHH <=dateUtils.yyyymmdd(date)&&twodaysU[a2].YYYYMMDDHH >=dateUtils.firstDay(date)){
                        thisMonthU +=twodaysU[a2].Value_5min;
                    }
                }


                data.DODPercet=[];
                data.DODAbsol=[];
                data.MOMPercent=[];
                data.MOMAbsol=[];

                
                data.DODPercet=(dodTodayValue*100/dodValue).toFixed(1);
                
               
                data.DODAbsol=Math.abs(dodTodayValue-dodValue).toFixed(1);
                

                
                data.MOMPercent=(thisMonthU*100/preMonthU).toFixed(1); //전력소비 mom 비율
               
                
 
                           
                data.MOMAbsol=Math.abs(thisMonthU-preMonthU).toFixed(1);//전력 소비 mom 절대값 
           
                return data; 

        
            }


            
            

            function calculateUsg(twodaysU){
                var dodTodayValue=0;
                var time = new Date();
                for( var ind=0; ind<twodaysU.length; ind++){
                    if(twodaysU[ind].YYYYMMDDHH=== dateUtils.yyyymmdd(time)) {
                        dodTodayValue += twodaysU[ind].Value_5min; //오늘 전력 사용량 
                        
                    }
                }

                return dodTodayValue;
            }

            function cityEnergy(twodaysU,thisMonthS){
                
                var dodValue = 0;
                var dodTodayValue = 0;
                var time = new Date();
                var h = time.getHours();
                var hourIndex = (h*12);

                var data = new Object();
                var date = new Date();
                var preMonthU =0;
                var thisMonthU=0;               
                for(var a =0; a< twodaysU.length; a++){
                
                
                    if(twodaysU[a].YYYYMMDDHH <=dateUtils.PreviousMonth(date)){
                        preMonthU +=twodaysU[a].Value_5min;
                }
            }
                for ( var b=0; b<thisMonthS.length; b++){
                    if(thisMonthS[a].YYYYMMDDHH <=dateUtils.PreviousMonth(date)){
                        preMonthU +=thisMonthS[b].Value_5min;
                    
                }
            }
                
                for(var a2=0; a2< twodaysU.length; a2++){
                    if(twodaysU[a2].YYYYMMDDHH <=dateUtils.yyyymmdd(date)&&twodaysU[a2].YYYYMMDDHH >=dateUtils.firstDay(date)){
                        thisMonthU +=twodaysU[a2].Value_5min;
                    }
                }
                for(var a3=0; a3< thisMonthS.length; a3++){
                    if(thisMonthS[a3].YYYYMMDDHH <=dateUtils.yyyymmdd(date)&&thisMonthS[a3].YYYYMMDDHH >=dateUtils.firstDay(date)){
                        thisMonthU +=thisMonthS[a3].Value_5min;
                    }
                }
                data.MOMPercent=[];
                data.MOMAbsol=[];
                data.MOMPercent=(thisMonthU*100/preMonthU).toFixed(1); //전력소비 mom 비율
                data.MOMAbsol=Math.abs(thisMonthU-preMonthU).toFixed(1);


                for(var ind=0; ind<twodaysU.length; ind++){
                    if(twodaysU[ind].YYYYMMDDHH=== dateUtils.PreviousDay_One(time)) {
                        for(var ind2=0; ind2<hourIndex+1; ind2++){
                            if(twodaysU[ind].mmIndex ===ind2)
                                {dodValue += twodaysU[ind].Value_5min;}//현재시간일때 어제 전력 사용량
                        }
                    }
                    if(twodaysU[ind].YYYYMMDDHH=== dateUtils.yyyymmdd(time)) {
                        for(var ind3=0; ind3<hourIndex+1; ind3++){
                            if(twodaysU[ind].mmIndex ===ind3)
                                {dodTodayValue += twodaysU[ind].Value_5min;} //오늘 전력 사용량 
                        }
                    }
                }                      

                
                for(var ind4=0; ind4<thisMonthS.length; ind4++){
                    if(thisMonthS[ind4].YYYYMMDDHH=== dateUtils.PreviousDay_One(time)) {
                        for(var ind5=0; ind5<hourIndex+1; ind5++){
                            if(thisMonthS[ind4].mmIndex ===ind5)
                                {dodValue += thisMonthS[ind4].Value_5min;}//현재시간일때 어제 전력 사용량
                        }
                    }
                    if(thisMonthS[ind4].YYYYMMDDHH=== dateUtils.yyyymmdd(time)) {
                        for(var ind6=0; ind6<hourIndex+1; ind6++){
                            if(thisMonthS[ind4].mmIndex ===ind6)
                                {dodTodayValue += thisMonthS[ind4].Value_5min;} //오늘 전력 사용량 
                        }
                    }
                }                      

               
                
               
                
                data.DODPercent=[];
                data.DODAbsol=[];
                data.DODAbsol=Math.abs(dodTodayValue-dodValue).toFixed(1);
                data.DODPercent=(dodTodayValue*100/dodValue).toFixed(1);
              

                return data; 

            }
        
        function activate() {
            
            FacilityTotalUsage.SelectedFacilTwodays(facilityList).then(function(twodaysU){//선택된 시설의 이번달 전력 사용량 
                FacilityTotalUsage.SelectedthisMonthSupply(facilityList).then(function(thisMonthS){//선택된 시설의 오늘까지 공급량
                
                
                // var dodElecDemand,dodAbsoluteElecD,dodElecS,dodAbsoluteElecS;
                // var momElecDemand,momAbsoluteElecD,momElecS,momAbsoluteElecS;
                // var todayElecUsg,todayElecSpp;
                var elecCData,elecSData,cityEnergyData;

                elecCData=momdod(twodaysU);
                $scope.elecCData=elecCData;
               

                elecSData=momdod(thisMonthS);
                $scope.elecSData=elecSData;

                // //전력 소비 DOD 비율 
                // $scope.dodElecDemand=dod(twodaysU);
                // //전력 소비 DOD 절대값
                // $scope.dodAbsoluteElecD=dodAbsolute(twodaysU);
                // // //전력 소비 MOM 비율
                // momElecDemand=mom(twodaysU);
                // $scope.momElecDemand=momElecDemand;

                // // //전력 소비 MOM 절대값
                // momAbsoluteElecD=momAbsolute(twodaysU);
                // $scope.momAbsoluteElecD=momAbsoluteElecD;

            

                // //전력 생산 DOD 비율 
                // $scope.dodElecS=dod(thisMonthS);
                // //전력 생산 DOD 절대값
                // $scope.dodAbsoluteElecS=dodAbsolute(thisMonthS);

                // // //전력 생산 MOM 비율 
                // momElecS=mom(thisMonthS);
                // $scope.momElecS=momElecS;
                // // //전력 생산 MOM 절대값
                // momAbsoluteElecS=momAbsolute(thisMonthS);
                // $scope.momAbsoluteElecS=momAbsoluteElecS;

                //오늘 전력 소비량 
                $scope.todayElecUsg=calculateUsg(twodaysU).toFixed(1);
               
                //오늘 전력 생산량
                $scope.todayElecSpp=calculateUsg(thisMonthS).toFixed(1);
                

                // //city energy mom
                cityEnergyData=cityEnergy(twodaysU,thisMonthS);
                $scope.cityEnergyData=cityEnergyData;
                
                
                

         
         
            });         
        });   
        }
    }
})();