function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    angular
        .module('app.totalsite')
        .controller('totalSiteElecDemandController', totalSiteElecDemandController);

    totalSiteElecDemandController.$inject = ['$scope', '$timeout', '$stateParams', '$http', 'dateUtils', 'FacilityTotalUsage','$q'];
    function totalSiteElecDemandController($scope, $timeout, $stateParams, $http, dateUtils, FacilityTotalUsage,$q) {

        var vm = this;
        var dataset_usage = [];
        var config;
        var demandChart;
        $scope.lastChartState;

        var object = new Object();
        var Linechart = {
            Mode: { RAW: 1, HOUR: 12, HALF: 6, QUARTER: 3 }
        };
        $scope.$on('selectedData', function (event, data) {
            vm.selectedData = data.Energy_Usage;
            activate(Linechart.Mode.RAW);
        });

        $scope.$on('demand_datepick', function (event, data) {
            vm.selectedData = data.Energy;
            activate(Linechart.Mode.RAW);
        });

        function activate(mode) {
            /* Usage Data is dataset[0]
             CBL Data is dataset[1] */
            vm.dataSet = buildChartDataSet(mode);
            config = bulidChartOptions(mode);
            drawChart(document.getElementById("demandChart").getContext('2d'), config);
        }

        function buildChartDataSet(mode) {
            var usageValue;
            var preValue;
            var dataSet = [];
            var usageData = new Object();
            var preData = new Object();
            switch (mode) {
                case Linechart.Mode.HOUR:
                    usageValue = vm.selectedData.data.valueDataHour;
                    preValue = vm.selectedData.pre.valueDataHour;
                    break;
                case Linechart.Mode.HALF:
                    usageValue = vm.selectedData.data.valueDataHalfHour;
                    preValue = vm.selectedData.pre.valueDataHalfHour;
                    break;
                case Linechart.Mode.QUARTER:
                    usageValue = vm.selectedData.data.valueDataQuaterHour;
                    preValue = vm.selectedData.pre.valueDataQuaterHour;
                    break;
                case Linechart.Mode.RAW:
                    usageValue = vm.selectedData.data.raw;
                    preValue = vm.selectedData.pre.raw;
                    break;
            }
            $scope.lastChartState = mode;
            
            if (mode !== Linechart.Mode.RAW) {

                usageData.xaxis = []; //x축 label : index (임시) 
                usageData.value = []; //인덱스제외 array : 사용량 값 
                usageData.indexTotime = [];
                usageData.label = '실제사용량';
                usageData.color = '#004e66';

                preData.label = '예측값';
                preData.color = '#E71D36';
                preData.value = [];

                //mode별 x축 설정 
                for (var i = 0; i < parseInt(288 / mode); i++) {
                    usageData.indexTotime.push(dateUtils.hhmm(i * mode));
                }
                //사용량값 배열
                usageValue.forEach(function(item,i){
                    usageData.value.push(item);
                });
                //예측값 배열
                preValue.forEach(function(item,i){
                    preData.value.push(item);
                });

                dataSet.push(usageData);
                dataSet.push(preData);
                
                return dataSet;

            } else {
                //raw일경우
                usageData.xaxis = []; //x축 label : index (임시) 
                usageData.value = []; //인덱스제외 array : 사용량 값 
                usageData.label = '실제사용량';
                usageData.color = '#004e66';
                usageData.indexTotime = [];

                preData.label = '예측값';
                preData.color = '#E71D36';
                preData.value = [];

                for (var i = 0; i < 288; i++) {
                    if(i%12==0) usageData.indexTotime.push(dateUtils.hhmm(i * mode));
                    else usageData.indexTotime.push("");
                }
                //사용량값 배열
                usageValue.forEach(function(item,i){
                    usageData.value.push(item);
                });
                //예측값 배열
                preValue.forEach(function(item,i){
                    preData.value.push(item);
                });

                dataSet.push(usageData);
                dataSet.push(preData);

                return dataSet;
            }
        }

        function bulidChartOptions(mode) {
            var _options;

            var config = {
                
                type: 'bar',
                data: {
                    //labels : x축
                    labels: vm.dataSet[0].indexTotime,
                    datasets: [
                    {
                        type: 'line',
                        label: "예측",
                        data: [],
                        borderColor: 'rgba(75, 00, 150,1)',
                        borderWidth: 1,
                        fill: false,
                        pointBackgroundColor : 'rgba(75, 00, 150,1)'
                    },
                    {
                        type: 'bar',
                        label: "전력 사용량",
                        data: [], //RAW 데이터 때문에 bulidoptions 함수에서 설정
                        spanGaps: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: (_options = {
                    elements: {
                        line: {
                            tension: 0
                        }
                    },
                    tooltips: {},
                    legend:{
                        display : true,
                        position : 'top',
                        labels:{
                            usePointStyle: true,
                            fontColor:'black'
                        }
                    },
                    maintainAspectRatio: false,
                    hover: { mode: null }
                }, _defineProperty(_options, 'maintainAspectRatio', false), _defineProperty(_options, 'scales', {
                    xAxes: [{
                        type: "category",
                        display: true,
                        gridLines: {
                            display: true
                        },
                        labels: {
                            show: true
                        },
                        ticks: {
                            autoSkip : false,
                            minRotation: 90,
                            beginAtZero: true,
                        }
                    }],
                    

                    yAxes: [{
                        type: "linear",
                        // display: true,
                        position: "left",
                        gridLines: {
                            display: true
                        },
                        labels: {
                            show: true
                        },
                        ticks:{
                            beginAtZero: true,
                            min : 0
                        }
                    }]

                }), _options)
            };
            if (mode === Linechart.Mode.RAW) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;
            } 
            else if (mode === Linechart.Mode.QUARTER) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;
            } else if (mode === Linechart.Mode.HALF) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;
            } else if (mode === Linechart.Mode.HOUR) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;
            }
            return config;
        }

      
        function drawChart(objChart, data) {
            if (demandChart != null) {
                demandChart.destroy();
            }
            demandChart = new Chart(objChart, data);
        }
        $scope.raw = function () {
            if ($scope.lastChartState !== Linechart.Mode.RAW) {
                activate(Linechart.Mode.RAW);
                demandChart.update();
            }
        };
        $scope.quarter = function () {
            if ($scope.lastChartState !== Linechart.Mode.QUARTER) {
                activate(Linechart.Mode.QUARTER);
                demandChart.update();
            }
        };
        $scope.half = function () {
            if ($scope.lastChartState !== Linechart.Mode.HALF) {
                activate(Linechart.Mode.HALF);
                demandChart.update();
            }
        };
        $scope.hour = function () {
            if ($scope.lastChartState !== Linechart.Mode.HOUR) {
                activate(Linechart.Mode.HOUR);
                demandChart.update();
            }
        };
    }
})();