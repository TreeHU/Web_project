function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    angular.module('app.SiteSupplyAndDemand2')
    .controller('LineChartController', LineChartController);

    LineChartController.$inject = ['$scope', '$q', '$timeout', 'Colors', '$http', 'dateUtils'];
    function LineChartController($scope, $q, $timeout, Colors, $http, dateUtils) {

        var vm = this;
        var dataset_usage = [];
        var config;
        var demandChart;
        $scope.lastChartState;

        var object = new Object();
        var Linechart = {
            Mode: { RAW: 1, HOUR: 12, HALF: 6, QUARTER: 3 }
        };
        //초기값 SdData broadcast 발생
        $scope.$on('SdData', function (event, data) {
            vm.SdData = data.usage;
            vm.PreD = data.pre_usage;
            activate(Linechart.Mode.RAW);
        });
        //datepick 이벤트 발생 (금일 날짜 선택시 수정 예정)
        $scope.$on('totalUsage_datepick', function (event, data) {
            vm.SdData = data.usage;
            vm.PreD = data.pre_usage;
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
            var usageData = [];
            var preData = [];
            switch (mode) {
                case Linechart.Mode.HOUR:
                    usageValue = vm.SdData.valueDataHour;
                    preValue = vm.PreD.valueDataHour;
                    break;
                case Linechart.Mode.HALF:
                    usageValue = vm.SdData.valueDataHalfHour;
                    preValue = vm.PreD.valueDataHalfHour;
                    break;
                case Linechart.Mode.QUARTER:
                    usageValue = vm.SdData.valueDataQuaterHour;
                    preValue = vm.PreD.valueDataQuaterHour;
                    break;
                case Linechart.Mode.RAW:
                    usageValue = vm.SdData.raw;
                    preValue = vm.PreD.raw;
                    break;
            }
            $scope.lastChartState = mode;
            var nowIndex = dateUtils.timeToIndex(Date.now());
            if (mode !== Linechart.Mode.RAW) {
                usageData.xaxis = []; //x축 label : index (임시) 
                usageData.value = []; //인덱스제외 array : 사용량 값 
                usageData.indexTotime = [];
                usageData.color = '#004e66';
                usageData.data = [];

                preData.color = '#E71D36';
                preData.data = [];
                preData.value = [];

                for (var i = 0; i < parseInt(288 / mode); i++) {
                    usageData.indexTotime.push(dateUtils.hhmm(i * mode));
                }
                // for(var i=0; i<usageValue.length; i++){
                //     usageData.value.push(usageValue[i]);
                // }
                usageData.value=usageValue;
                preData.value=preValue;
                dataSet.push(usageData);
                dataSet.push(preData);
                return dataSet;
            } else {
                //raw일경우
                usageData.xaxis = []; //x축 label : index (임시) 
                usageData.value = []; //인덱스제외 array : 사용량 값 
                usageData.data = [];
                usageData.color = '#004e66';
                usageData.indexTotime = [];

                preData.data = [];
                preData.value = [];

                for (var i = 0; i < 288; i++) {
                    if(i%12==0) usageData.indexTotime.push(dateUtils.hhmm(i * mode));
                    else usageData.indexTotime.push("");
                }
                for(var i=0; i<usageValue.length; i++){
                    usageData.value.push(usageValue[i].value);
                }
            }
                //usageData.value=usageValue;
                preData.value=preValue;
                dataSet.push(usageData);
                dataSet.push(preData);
                return dataSet;
        }

        function bulidChartOptions(mode) {
            var _options;

            var config = {
                
                type: 'bar',
                data: {
                    // labels : vm.dataSet[0].xaxis,
                    //labels : x축
                    labels: vm.dataSet[0].indexTotime,
                    datasets: [{
                        type: 'line',
                        label: "예측",
                        data: [],
                        borderColor: 'rgba(75, 00, 150,1)',
                        borderWidth: 1,
                        fill: false,
                        pointBackgroundColor: 'rgba(75, 00, 150,1)'
                    },{
                        type: 'bar',
                        label: "전기",
                        
                        data: [], //RAW 데이터 때문에 bulidoptions 함수에서 설정
                        spanGaps: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }] //밑 주석부분 삭제하면 안됨
                    // ,{
                    //     type: 'line',
                    //     label: "CBL Max(4/5)",
                    //     //pointRadius:0,
                    //     data: [],
                    //     borderColor: 'rgba(75, 00, 150,1)',
                    //     borderWidth: 1,
                    //     fill: false
                    // }]
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
                            // boxWidth:80,
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
                            // min:0,
                            // max:23,
                            autoSkip : false,
                            // maxTicksLimit : 24,
                            minRotation: 90,
                            beginAtZero: true,
                            // stepSize: 1
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
                            beginAtZero:true,
                            min:0
                        }
                    }]

                }), _options)
            };
            if (mode === Linechart.Mode.RAW) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;

            } else if (mode === Linechart.Mode.QUARTER) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;
                // config.data.datasets[1].data = vm.dataSet[1].value;
            } else if (mode === Linechart.Mode.HALF) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;
                // config.data.datasets[1].data = vm.dataSet[1].value;
            } else if (mode === Linechart.Mode.HOUR) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;
                // config.data.datasets[1].data = vm.dataSet[1].value;
            }
            return config;
        }
        // var demandChart = null;
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
