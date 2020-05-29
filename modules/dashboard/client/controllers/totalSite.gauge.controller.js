(function () {
    'use strict';

    angular
        .module('app.totalsite')
        .controller('totalSiteGaugeController', totalSiteGaugeController);

    totalSiteGaugeController.$inject = ['$scope',  '$timeout', '$stateParams', '$http', 'dateUtils', 'FacilityTotalUsage','datepick'];
    function totalSiteGaugeController($scope,  $timeout, $stateParams, $http, dateUtils, FacilityTotalUsage, datepick) {
        var vm = this;
        var demand_value;
        var supply_value;
        activate();

        function activate() {
            $scope.$on('selectedData', function (event, selectedData, datepick) {
                
                $scope.supply_yesterday = selectedData.twodaysSupply.yesterday.value;
                $scope.supply_today = selectedData.twodaysSupply.today.value;

                $scope.demand_yesterday = selectedData.twodaysDemand.yesterday.value;
                $scope.demand_today = selectedData.twodaysDemand.today.value;

                supply_value = checkValue(selectedData.twodaysSupply);
                demand_value = checkValue(selectedData.twodaysDemand);

                function checkValue(data){
                    if(data.yesterday.value==0){
                        return 0;
                    }else{
                        return (data.today.value/data.yesterday.value);
                    }
                }

                var demandGauge = c3.generate({
                    bindto: document.getElementById('demandGauge'),
                    data: {
                        columns: [
                            ['전력사용량',(demand_value)*100]
                        ],
                        type: 'gauge',
                    },
                    gauge: {
                        label: {
                            format: function (value, ratio) {
                               // return ((value/selectedData.cblDataHour[date.getHours()-1])*100).toFixed(3)+'%';
                            },
                            show: true // to turn off the min/max labels.
                        },
                        min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                        //max: parseFloat(selectedData.cblDataHour[date.getHours()-1]), // 100 is default
                        max:100,
                        units: ' ',
                        width: 39 // for adjusting arc thickness
                    },
                    color: {
                        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                        threshold: {
                            //            unit: 'value', // percentage is default
                                    //max: 200, // 100 is default
                            values: [30, 60, 90, 100]
                        }
                    },
                    size: {
                        width : 225,
                        height: 180
                    }
                });
                var supplyGauge = c3.generate({
                    bindto: document.getElementById('supplyGauge'),
                    data: {
                        columns: [
                            ['어제대비생산량',(supply_value)*100]
                        ],
                        type: 'gauge',
                    },
                    gauge: {
                        label: {
                            format: function (value, ratio) {
                               // return ((value/selectedData.cblDataHour[date.getHours()-1])*100).toFixed(3)+'%';
                            },
                            show: true // to turn off the min/max labels.
                        },
                        min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                        //max: parseFloat(selectedData.cblDataHour[date.getHours()-1]), // 100 is default
                        max:100,
                        units: ' ',
                        width: 39 // for adjusting arc thickness
                    },
                    color: {
                        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                        threshold: {
                                    //    unit: 'value', // percentage is default
                                    // max: 200, // 100 is default
                            values: [30, 60, 90, 100]
                        }
                    },
                    size: {
                        width : 225,
                        height: 180
                    }
                });

            });
            
        }
    }
})();