(function () {
    'use strict';

    angular
        .module('app.SiteSupplyAndDemand2')
        .controller('SDInfoController', SDInfoController);

    SDInfoController.$inject = ['$scope',  '$timeout', '$stateParams', '$http', 'dateUtils', 'FacilityTotalUsage','customerBaseLineUtils','SDSite'];
    function SDInfoController($scope,  $timeout, $stateParams, $http, dateUtils, FacilityTotalUsage, customerBaseLineUtils, SDSite) {
        var vm = this;
    

        activate();

        function dod(twodaysU){ //dod 비율 
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
                                {dodValue += twodaysU[ind].value;}//현재시간일때 어제 전력 사용량
                        }
                    }
                }                      

                for( ind=0; ind<twodaysU.length; ind++){
                    if(twodaysU[ind].YYYYMMDDHH=== dateUtils.yyyymmdd(time)) {
                        for(var ind3=0; ind3<hourIndex+1; ind3++){
                            if(twodaysU[ind].mmIndex ===ind3)
                                {dodTodayValue += twodaysU[ind].value;} //오늘 전력 사용량 
                        }
                    }
                }

                var DODPercet;
                DODPercet=(dodTodayValue*100/dodValue).toFixed(1);
                return DODPercet;

        
            }


            function dodAbsolute(twodaysU){ //dod 절대값 
                var dodValue = 0;
                var dodTodayValue = 0;
                var dodSupplyU =0; //현재 시간일때 어제 전력 공급량 
                var dodTodaySupplyU=0;//현재 전력 공급량 
                var time = new Date();
                var h = time.getHours();
                var hourIndex = (h*12);
                
                for(var ind=0; ind<twodaysU.length; ind++){
                    if(twodaysU[ind].YYYYMMDDHH=== dateUtils.PreviousDay_One(time)) {//어제 날짜 구하는 걸로 바꿔야함 
                        for(var ind2=0; ind2<hourIndex+1; ind2++){
                            if(twodaysU[ind].mmIndex ===ind2)
                                {dodValue += twodaysU[ind].value;}//현재시간일때 어제 전력 사용량
                        }
                    }
                }                      

                for( ind=0; ind<twodaysU.length; ind++){
                    if(twodaysU[ind].YYYYMMDDHH=== dateUtils.yyyymmdd(time)) {
                        for(var ind3=0; ind3<hourIndex+1; ind3++){
                            if(twodaysU[ind].mmIndex ===ind3)
                                {dodTodayValue += twodaysU[ind].value;} 
                        }
                    }
                }               
                var DODAbsol;
                DODAbsol=Math.abs(dodTodayValue-dodValue).toFixed(1);
                return DODAbsol;
        }

        function mom(twodaysU){
                var date = new Date();
                var preMonthU =0;
                var thisMonthU=0;               
                for(var a =0; a< twodaysU.length; a++){
                    if(twodaysU[a].YYYYMMDDHH <=dateUtils.PreviousMonth(date)){
                        preMonthU +=twodaysU[a].value;
                    }
                }
                
                for(var a2=0; a2< twodaysU.length; a2++){
                    if(twodaysU[a2].YYYYMMDDHH <=dateUtils.yyyymmdd(date)&&twodaysU[a2].YYYYMMDDHH >=dateUtils.firstDay(date)){
                        thisMonthU +=twodaysU[a2].value;//오늘 까지 사용량  mom은 1일까지 ㅏ용량을 빼야함 
                    }
                }
                var MOMelecD;
                MOMelecD=(thisMonthU*100/preMonthU).toFixed(1); //전력소비 mom 비율
                //MOMelecDA=Math.abs(thisMonthU-preMonthU);//전력 소비 mom 절대값 
                
                // console.log(thisMonthU);
                return MOMelecD; 
       }
       function momAbsolute(twodaysU){
                var date = new Date();
                var preMonthU =0;
                var thisMonthU=0;               
                for(var a =0; a< twodaysU.length; a++){
                    if(twodaysU[a].YYYYMMDDHH <=dateUtils.PreviousMonth(date)){
                        preMonthU +=twodaysU[a].value;
                    }
                }
                
                for(var a2=0; a2< twodaysU.length; a2++){
                    if(twodaysU[a2].YYYYMMDDHH <=dateUtils.yyyymmdd(date)&&twodaysU[a2].YYYYMMDDHH >=dateUtils.firstDay(date)){
                        thisMonthU +=twodaysU[a2].value;//오늘 까지 사용량  mom은 1일까지 ㅏ용량을 빼야함 
                    }
                }
                var MOMelecA;
                //MOMelecD=(thisMonthU*100/preMonthU); //전력소비 mom 비율
                MOMelecA=Math.abs(thisMonthU-preMonthU).toFixed(1);//전력 소비 mom 절대값 
                
                // console.log(thisMonthU);
                return MOMelecA; 
}
        
        function activate() {           
            SDSite.SDDemandByusesTwomonths().then(function(uses){
                var usesData = new Object();
                var obj = new Object();
                var arr = ['본사','사옥','연수원','주택','지역본부','학교'];
                for(var i=0; i<arr.length; i++){
                    obj[arr[i]]  =[];
                }
                //console.log(obj);
              
                for(var i=0; i<uses.length; i++){   
                    if(uses[i].type== '본사'){
                        obj[arr[0]].push(uses[i]);
                    }
                    if(uses[i].type == '사옥'){
                        obj[arr[1]].push(uses[i]);
                    }
                    if(uses[i].type == '연수원'){
                        obj[arr[2]].push(uses[i]);
                    }  
                    if(uses[i].type== '주택'){
                        obj[arr[3]].push(uses[i]);
                    }
                    if(uses[i].type== '지역본부'){
                        obj[arr[4]].push(uses[i]);
                    }
                    if(uses[i].type== '학교'){
                        obj[arr[5]].push(uses[i]);
                    }                              
                }

                var Headquarters,Companybuilding,traininginstitute,residence,localheadquarters,school;
                var HeadquartersDOD,CompanybuildingDOD,traininginstituteDOD,residenceDOD,localheadquartersDOD,schoolDOD;

                //DOD 비율

            
               

                $scope.dodByType=function(type){
                    return dod(obj[type]);
                };
                $scope.dodAbsoluteByType=function(type){
                    return dodAbsolute(obj[type]);
                };

                //MOM 비율
                $scope.momByType=function(type){
                    return mom(obj[type]);
                };

                //MOM 절대값
                $scope.momAbsoluteByType=function (type){
                    return momAbsolute(obj[type]);
                }; 
                
                var date = new Date();

                console.log(dateUtils.PreviousDay_One(date));
               



            });           
        }
    }
})();