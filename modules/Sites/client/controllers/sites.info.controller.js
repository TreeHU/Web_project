(function () {
    'use strict';

    angular
        .module('app.sites')
        .controller('SitesInfoController', SitesInfoController);

    SitesInfoController.$inject = ['$scope', '$timeout', 'dateUtils', 'FacilityTotalUsage'];
    function SitesInfoController($scope, $timeout, dateUtils, FacilityTotalUsage) {
        var vm = this;
        var usage;
        var usageData = []; 
        var valueDataHour;
        var nowIndex = dateUtils.timeToIndex(Date.now());
        activate();

        function parsingstr(str){
            return str.replace('LH','');
        }

        function activate(){
            $scope.$on('Elec_demandData', function (event, demand) {
                $scope.$on('Elec_supplyData', function (event, supply) {
            
            
                var nowIndex = dateUtils.timeToIndex(Date.now());

                vm.barLabels = [];
                for (var i = 0; i <= parseInt(nowIndex / 12); i++) {
                    vm.barLabels.push(i);
                }
                vm.barData = [];
                for (var k = 0; k <= parseInt(nowIndex / 12); k++) {
                    vm.barData.push(demand.data.valueDataHour[k]);
                }

                vm.suppbarData = [];
                for (var j = 0; j <= parseInt(nowIndex / 12); j++) {
                    vm.suppbarData.push(supply.data.valueDataHour[j]);
                }
                vm.info = demand.info;
                // vm.usageData = data.usage_EC;
                
                $scope.Fname = parsingstr(vm.info.facilName);

                $scope.Type = vm.info.type;
                $scope.Aname = vm.info.admin;
                $scope.Call = vm.info.adminTel;
                $scope.Address = vm.info.address;
                // var nowIndex = dateUtils.timeToIndex(Date.now());
                // var daySum = 0;
                // var dayAvg=0;
                // console.log(usageData);
                // console.log(data);
                // console.log(data.usage_EC);
                // for(var i=0;i<nowIndex;i++){
                //     daySum+=vm.usageData[i].Value_5min;
                // }
                // $scope.dayAvg = daySum.toFixed(3);
                FacilityTotalUsage.getElecAVG(vm.info.facilName).then(function (data) {
                    $scope.usageMonthAvg = data.EC_MonAVG[0].MonAVG != null ? (data.EC_MonAVG[0].MonAVG.toFixed(3)) : 0;
                    $scope.usageYearAvg = data.EC_YearAVG[0].YearAVG != null ? (data.EC_YearAVG[0].YearAVG.toFixed(3)) : 0;
                    $scope.outputMonthAvg = data.EO_MonAVG[0].MonAVG != null ? (data.EO_MonAVG[0].MonAVG.toFixed(3)) : 0;
                    $scope.outputYearAvg = data.EO_YearAVG[0].YearAVG != null ? (data.EO_YearAVG[0].YearAVG.toFixed(3)) : 0;

                })
            })
        })

            


        
            



        }
    }
})();