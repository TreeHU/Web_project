(function () {
    'use strict';

    angular
        .module('core')
        .controller('HomeInfoController', HomeInfoController);

    HomeInfoController.$inject = ['$scope', '$timeout', '$stateParams', '$http', 'dateUtils', 'FacilityTotalUsage'];
    function HomeInfoController($scope, $timeout, $stateParams, $http, dateUtils, FacilityTotalUsage) {
        activate();
        function activate() {
            FacilityTotalUsage.getTotalAVGforMon().then(function (avg) {//
                $scope.EC_MonAVG = avg.EC_MonAVG[0].EC_MonAVG!=null ? (avg.EC_MonAVG[0].EC_MonAVG).toFixed(3) : 0;
                $scope.EO_MonAVG = avg.EO_MonAVG[0].EO_MonAVG != null ? (avg.EO_MonAVG[0].EO_MonAVG).toFixed(3) : 0;
                $scope.EC_DayAVG = avg.EC_DayAVG[0].EC_DayAVG != null ? (avg.EC_DayAVG[0].EC_DayAVG).toFixed(3) : 0;
                $scope.EO_DayAVG = avg.EO_DayAVG[0].EO_DayAVG != null ? (avg.EO_DayAVG[0].EO_DayAVG).toFixed(3) : 0;
                // var d = new Date();
                // var previousDay = dateUtils.PreviousDay_One(d);
                // var sum = 0;
                // for (var j = 0; j < avg.length; j++) {
                //     if (avg[j].YYYYMMDDHH = previousDay)
                //         $scope.avgforday = (avg[j].total_Avg).toFixed(3);
                //     sum += avg[j].total_Avg;
                // }
                // $scope.avgformonth = (sum / avg.length).toFixed(3);
            })
            //삭제x
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

            
        }
    }
})();