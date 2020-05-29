function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    angular.module('app.SiteSupplyAndDemand')
    .controller('StackedDemandChartController', StackedDemandChartController);

    StackedDemandChartController.$inject = ['$scope', '$q', '$timeout', 'Colors', '$http', 'dateUtils'];
    function StackedDemandChartController($scope, $q, $timeout, Colors, $http, dateUtils) {

        var vm = this;
        var dataset_usage = [];
        var config;
        var stackedChart;
        $scope.lastChartState;

        var object = new Object();
        var Linechart = {
            Mode: { RAW: 1, HOUR: 12, HALF: 6, QUARTER: 3 }
        };
        $scope.$on('SdData', function (event, data) {
            vm.SdData = data.uses;
            vm.PreD = data.pre_usage;
            activate(Linechart.Mode.RAW);
            
        });
        $scope.$on('ElecDemand_datepick', function (event, data) {
            vm.SdData = data;
            vm.PreD = data.pre_usage;
            activate(Linechart.Mode.RAW);
            
        });

        function activate(mode) {
            //vm.SdData.commercial :{raw:Array(288),valueDataHalfHour:Array(48),..}
            //vm.SdData.edu :{raw:Array(288),valueDataHalfHour:Array(48),..}
            //vm.SdData.residential :{raw:Array(288),valueDataHalfHour:Array(48),..}

            //mode바뀔때마다 값도 변경,
            //config.data.datesets[0].data 교육, config.data.datesets[1].data 상업, config.data.datesets[2].data 주거
             
            //var dataObj = {"commercial":[100,200],"edu":[100,200],"residential":[200,100]}
            //config.data.datesets[0].data = dataObj.edu;
            //config.data.datesets[1].data = dataObj.commercial;
            //config.data.datesets[2].data = dataObj.residential;
            vm.dataSet = buildChartDataSet(mode);
            
            config = bulidChartOptions(mode);
            
            drawChart(document.getElementById("stackedChart").getContext('2d'), config);
        }

        function buildChartDataSet(mode) {
            var value_edu=[];
            var value_commercial=[];
            var value_residential=[];
            var preValue=[];
            
            var dataObj={};

            dataObj.commercial=[];
            dataObj.edu=[];
            dataObj.residential=[];
            dataObj.preData=[];

            var dataSet = [];
 
            switch (mode) {
                case Linechart.Mode.HOUR:
                    value_commercial = vm.SdData.commercial.valueDataHour;
                    value_edu = vm.SdData.edu.valueDataHour;
                    value_residential = vm.SdData.residential.valueDataHour;
                    preValue = vm.PreD.valueDataHour;
                    break;
                case Linechart.Mode.HALF:
                    value_commercial = vm.SdData.commercial.valueDataHalfHour;
                    value_edu = vm.SdData.edu.valueDataHalfHour;
                    value_residential = vm.SdData.residential.valueDataHalfHour;
                    preValue = vm.PreD.valueDataHalfHour;
                    break;
                case Linechart.Mode.QUARTER:
                    value_commercial = vm.SdData.commercial.valueDataQuaterHour;
                    value_edu = vm.SdData.edu.valueDataQuaterHour;
                    value_residential = vm.SdData.residential.valueDataQuaterHour;
                    preValue = vm.PreD.valueDataQuaterHour;
                    break;
                case Linechart.Mode.RAW:
                    value_commercial = vm.SdData.commercial;
                    value_edu = vm.SdData.edu;
                    value_residential = vm.SdData.residential;
                    preValue = vm.PreD.raw;
                    break;
            }
            $scope.lastChartState = mode;
            var nowIndex = dateUtils.timeToIndex(Date.now());
            if (mode !== Linechart.Mode.RAW) {
                dataObj.xaxis = []; //x축 label : index (임시) 
                for (var i = 0; i < parseInt(288 / mode); i++) {
                    dataObj.xaxis.push(dateUtils.hhmm(i * mode));
                }
                for(var i=0; i<value_commercial.length; i++){
                    dataObj.commercial.push(value_commercial[i]);
                }
                for(var i=0; i<value_residential.length; i++){
                    dataObj.residential.push(value_residential[i]);
                }
                for(var i=0; i<value_edu.length; i++){
                    dataObj.edu.push(value_edu[i]);
                }
                for(var i=0; i<preValue.length; i++){
                    dataObj.preData.push(preValue[i]);
                }
                dataSet.push(dataObj);               
                return dataSet;
            } else {
                //raw일경우
                dataObj.xaxis = []; //x축 label : index (임시) 
                for (var i = 0; i < 288; i++) {
                    if(i%12==0) dataObj.xaxis.push(dateUtils.hhmm(i * mode));
                    else dataObj.xaxis.push("");
                }
                
                for(var i=0; i<value_commercial.raw.length; i++){
                    dataObj.commercial.push(value_commercial.raw[i].value);
                }
                for(var i=0; i<value_residential.raw.length; i++){
                    dataObj.residential.push(value_residential.raw[i].value);
                }
                for(var i=0; i<value_edu.raw.length; i++){
                    dataObj.edu.push(value_edu.raw[i].value);
                }
                for(var i=0; i<preValue.length; i++){
                    dataObj.preData.push(preValue[i]);
                }

                dataSet.push(dataObj);
                
                return dataSet;
                //dateSet => dateSet[dataObj:{commercial:Array(), resi}]
            }
        }

        function bulidChartOptions(mode) {
            var _options;

            var config = {
                
                type: 'bar',
                data: {
                    
                    //labels : x축
                    //labels: vm.dataSet[0].indexTotime,
                    labels: [],
                    datasets: [{
                        label: "상업", //이름표
                        data: [], //RAW 데이터 때문에 bulidoptions 함수에서 설정 => 값만 있는 배열
                        spanGaps: true,
                        backgroundColor: 'rgba(179, 153, 255, 0.9)',
                        borderColor: 'rgba(179, 153, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: "주거", //이름표
                        data: [], //RAW 데이터 때문에 bulidoptions 함수에서 설정 => 값만 있는 배열
                        spanGaps: true,
                        backgroundColor: 'rgba(128, 191, 255, 0.9)',
                        borderColor: 'rgba(128, 191, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: "교육", //이름표
                        data: [], //RAW 데이터 때문에 bulidoptions 함수에서 설정 => 값만 있는 배열
                        spanGaps: true,
                        backgroundColor: 'rgba(249, 108, 110, 0.8)',
                        borderColor: 'rgba(249, 108, 110, 1)',
                        borderWidth: 1
                    },{
                        type: 'line',
                        label: "예측",
                        data: [],
                        borderColor: 'rgba(75, 00, 150,1)',
                        borderWidth: 1,
                        fill: false,
                        pointBackgroundColor: 'rgba(75, 00, 150,1)'
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
                    animation : {
                        duration : 200
                    },
                    tooltips: {
                        callbacks:{
                            footer : function(tooltipItem){
                                var total = 0;
                                tooltipItem.forEach(function(element){
                                    total += element.yLabel;
                                });
                                return 'Total:'+total;
                            }
                        },
                        enabled: true,
                        mode: 'index',
                        intersect : false
                    },
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
                    hover: { intersect: false }
                }, _defineProperty(_options, 'maintainAspectRatio', false), _defineProperty(_options, 'scales', {
                    xAxes: [{
                        stacked: true,
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
                        stacked:true,
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
                //x축
                config.data.labels = vm.dataSet[0].xaxis;
                config.data.datasets[0].data = vm.dataSet[0].commercial;
                config.data.datasets[1].data = vm.dataSet[0].residential;
                config.data.datasets[2].data = vm.dataSet[0].edu;
                config.data.datasets[3].data = vm.dataSet[0].preData;

            } else if (mode === Linechart.Mode.QUARTER) {
                config.data.labels = vm.dataSet[0].xaxis;
                config.data.datasets[0].data = vm.dataSet[0].commercial;
                config.data.datasets[1].data = vm.dataSet[0].residential;
                config.data.datasets[2].data = vm.dataSet[0].edu;
                config.data.datasets[3].data = vm.dataSet[0].preData;
            } else if (mode === Linechart.Mode.HALF) {
                config.data.labels = vm.dataSet[0].xaxis;
                config.data.datasets[0].data = vm.dataSet[0].commercial;
                config.data.datasets[1].data = vm.dataSet[0].residential;
                config.data.datasets[2].data = vm.dataSet[0].edu;
                config.data.datasets[3].data = vm.dataSet[0].preData;
            } else if (mode === Linechart.Mode.HOUR) {
                config.data.labels = vm.dataSet[0].xaxis;
                config.data.datasets[0].data = vm.dataSet[0].commercial;
                config.data.datasets[1].data = vm.dataSet[0].residential;
                config.data.datasets[2].data = vm.dataSet[0].edu;
                config.data.datasets[3].data = vm.dataSet[0].preData;
            }
            return config;
        }
        // var stackedChart = null;
        function drawChart(objChart, data) {
            if (stackedChart != null) {
                stackedChart.destroy();
            }
            stackedChart = new Chart(objChart, data);
        }
    
        $scope.raw = function () {
            if ($scope.lastChartState !== Linechart.Mode.RAW) {
                activate(Linechart.Mode.RAW);
                stackedChart.update();
            }
        };
        $scope.quarter = function () {
            if ($scope.lastChartState !== Linechart.Mode.QUARTER) {
                activate(Linechart.Mode.QUARTER);
                stackedChart.update();
            }
        };
        $scope.half = function () {
            if ($scope.lastChartState !== Linechart.Mode.HALF) {
                activate(Linechart.Mode.HALF);
                stackedChart.update();
            }
        };
        $scope.hour = function () {
            if ($scope.lastChartState !== Linechart.Mode.HOUR) {
                activate(Linechart.Mode.HOUR);
                stackedChart.update();
            }
        };
    }
})();
