(function () {
    'use strict';

    angular.module('core')
    .controller('HomeBarChartController', HomeBarChartController);

    HomeBarChartController.$inject = ['$scope', '$q', '$timeout', 'Colors', '$http', 'dateUtils'];
    function HomeBarChartController($scope, $q, $timeout, Colors, $http, dateUtils) {
        var vm = this;
        var usageValue;
        $scope.$on('FacilityTotal', function (event, data) {
            // console.log(data);
            vm.FacilityTotal = data;
            usageValue = vm.FacilityTotal.usage;
            activate();
        });
        function activate() {
            vm.barLabels = [];
            var demandValue=[];
            var supplyValue=[];
            vm.barData = [];
        
            for (var i = 0; i < 26; i++) {
                if (i < usageValue.length) {
                    
                    vm.barLabels.push(usageValue[i].name);
                    demandValue.push(usageValue[i].sum_facility);
                    supplyValue.push(usageValue[i].sum_facility);
                }
                if (i >= usageValue.length) {
                    vm.barLabels.push(null);
                    demandValue.push(null);
                    supplyValue.push(null);
                }
            }
            vm.barSeries = ['생산량', '소비량'];
            
            vm.barData.push(demandValue);
            vm.barData.push(supplyValue);
            vm.barColors = [{
                backgroundColor: Colors.byName('primary'),
                borderColor: Colors.byName('primary')
            }, {
                backgroundColor: Colors.byName('info'),
                borderColor: Colors.byName('info')
            }];

            

        }
    }
})();