(function () {
    'use strict';

    angular
        .module('core')
        .controller('HomeDataController', HomeDataController);

    HomeDataController.$inject = ['$scope', '$timeout', '$stateParams', '$http', 'dateUtils', 'FacilityTotalUsage'];
    function HomeDataController($scope, $timeout, $stateParams, $http, dateUtils, FacilityTotalUsage) {
        // console.log($scope.slist);
        // if($scope.list==null){}
        // $scope.$on('info', function (event, args) {
        //     // $scope.list = args.info;
        //     console.log(args);
        // });
        activate();
        console.log("act");
        function activate() {
            // var facilityList;
            // $scope.$on('info', function (event, args) {
            //     // $scope.list = args.info;
            //     console.log(args);
            // });
            // facilityList=$scope.sensorList;
            // $http.get('/facilityList')
            // $http.get('/facilityList').then(function (result) {
            //     console.log(result);
            // })
            var facilityList = "('ND00000138400060', 'ND00000138400057', 'ND00000138400054', 'ND00000138400059', 'ND00000138400052', 'ND00000138400055', 'ND00000138400053', 'ND00000138400061', 'ND00000138400056', 'ND00000138400058', 'ND00000138400081', 'ND00000138400072', 'ND00000138400071', 'ND00000138400068', 'ND00000138400063')";
            FacilityTotalUsage.getSelectedUsage(facilityList).then(function(usage){ //시설이름에 따른 전체 사용량 합
                var data = new Object();
                data.usage= usage;
                FacilityTotalUsage.getSelectedEachType(facilityList).then(function (typeUsage) {// 시설 타입에 따른 전체 사용량 합
                    data.typeUsage=typeUsage;
                    $scope.$broadcast('FacilityTotal', data);
                })
                // FacilityTotalUsage.getTotalAVGforMon().then(function (avg) {//
                //     var d = new Date('2018-07-16');
                //     var previousDay = dateUtils.PreviousDay_One(d);
                //     var sum = 0;
                //     for (var j = 0; j < avg.length; j++) {
                //         if (avg[j].YYYYMMDDHH = previousDay)
                //             $scope.avgforday = (avg[j].total_Avg).toFixed(3);
                //         sum += avg[j].total_Avg;
                //     }
                //     $scope.avgformonth = (sum / avg.length).toFixed(3);
                // })

                // FacilityTotalUsage.getEachAVGforMon().then(function (avg) {////
                //     var d = new Date('2018-02-01');
                //     var previousDay = dateUtils.PreviousDay_One(d);
                //     var previousMonth = dateUtils.PreviousMonth(previousDay);
                //     var sum = 0;
                //     var count = 0;
                //     var prevData = new Object();
                //     console.log(avg.length);
                //     for (var j = 0; j < avg.length; j++) {
                //         if (avg[j].mr_ymdhh = previousDay)
                //             prevData.avgDay = avg[j];
                //         if (avg[j].mr_ymdhh >= previousMonth && avg[j].mr_ymdhh <= previousDay) {
                //             sum += avg[j].total_Avg;
                //             count++;
                //         }
                //         if (avg[j].mr_ymdhh == previousDay) {
                //             var Monthdata = new Object();
                //             Monthdata.type = avg[j].type;
                //             Monthdata.monthAvg = (sum / count).toFixed(3);
                //             prevData.avgMonth = Monthdata;
                //             sum = 0; count = 0;
                //         }
                //     }
                //     console.log(prevData);
            });
        }
    }
})();