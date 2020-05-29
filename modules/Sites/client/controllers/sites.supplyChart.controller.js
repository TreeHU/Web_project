(function () {
    'use strict';

    angular.module('app.sites')
        .controller('supplyChartController', supplyChartController);

    supplyChartController.$inject = ['$scope', '$q', '$timeout', 'Colors', '$http', 'dateUtils'];
    function supplyChartController($scope, $q, $timeout, Colors, $http, dateUtils) {

        var vm = this;
        var dataset_usage = [];
        var config;
        var sitesSupplyChart;
        $scope.lastChartState;

        var object = new Object();
        var Linechart = {
            Mode: { RAW: 1, HOUR: 12, HALF: 6, QUARTER: 3 }
        };
        $scope.$on('supplyData', function (event, data) {
            vm.SiteData = data;
            activate(Linechart.Mode.RAW);
        });
        $scope.$on('supply_datepick', function (event, data) {
            vm.SiteData = data;
            activate(Linechart.Mode.RAW);
        });

        function activate(mode) {

            /* Usage Data is dataset[0]
             CBL Data is dataset[1] */
            vm.dataSet = buildChartDataSet(mode);
            config = bulidChartOptions(mode);
            drawChart(document.getElementById("sitesSupplyChart").getContext('2d'), config);
        }

        function buildChartDataSet(mode) {
            var usageValue;
            var preValue;
            //var cblValue;
            var dataSet = [];
            var usageData = [];
            var preData=[];
            //var cblData = [];
            switch (mode) {
                case Linechart.Mode.HOUR:
                    usageValue = vm.SiteData.data.valueDataHour;
                    preValue = vm.SiteData.pre.valueDataHour;
                    //cblValue = vm.SiteData.cblDataHour;
                    break;
                case Linechart.Mode.HALF:
                    usageValue = vm.SiteData.data.valueDataHalfHour;
                    preValue = vm.SiteData.pre.valueDataHalfHour;
                    //cblValue = vm.SiteData.cblDataHalf;
                    break;
                case Linechart.Mode.QUARTER:
                    usageValue = vm.SiteData.data.valueDataQuaterHour;
                    preValue = vm.SiteData.pre.valueDataQuaterHour;
                    //cblValue = vm.SiteData.cblDataQuater;
                    break;
                case Linechart.Mode.RAW:
                    usageValue = vm.SiteData.data.raw;
                    preValue = vm.SiteData.pre.raw;
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
                // cblData.label = 'CBL MAX(4/5)';
                // cblData.color = '#E71D36';
                // cblData.data = [];
                // cblData.value = [];
                for (var i = 0; i < parseInt(288 / mode); i++) {
                    usageData.indexTotime.push(dateUtils.hhmm(i * mode));
                }
                // for(var i=0; i<usageValue.length; i++){
                //     usageData.value.push(usageValue[i].value);
                // }
                usageData.value = usageValue;
                preData.value = preValue;
                dataSet.push(usageData);
                dataSet.push(preData);
                //dataSet.push(cblData);
                return dataSet;
            } else {
                //raw일경우
                usageData.xaxis = []; //x축 label : index (임시) 
                usageData.value = []; //인덱스제외 array : 사용량 값 
                usageData.data = [];
                usageData.indexTotime = [];

                preData.data = [];
                preData.value = [];
                /*
                 5분단위일때 x축 1시간 단위로 표시
                */
                for (var i = 0; i < 288; i++) {
                    if (i % 12 == 0) usageData.indexTotime.push(dateUtils.hhmm(i * mode));
                    else usageData.indexTotime.push("");
                }
                /*
                 5분단위일때 x축 5분단위로 표시 => 숫자 겹쳐서 뭉개짐 (보류)
                */
                // for(var i=0; i<288; i++){
                //     if(i<= parseInt(nowIndex)){
                //         usageData.indexTotime.push(dateUtils.hhmm(i));
                //     }
                //     else if(i>parseInt(nowIndex)){
                //         usageData.indexTotime.push(dateUtils.hhmm(i * mode));
                //     }
                // }

                // for (var i = 0; i < usageValue.length; i++) {
                //     usageData.value.push(usageValue[i].value);
                // }
                usageData.value = usageValue;
                preData.value = preValue;
                dataSet.push(usageData);
                dataSet.push(preData);
                return dataSet;
            }

            
        }


        function bulidChartOptions(mode) {


            var config = {
                type: 'bar',
                data: {
                    //labels : x축
                    labels: vm.dataSet[0].indexTotime,
                    datasets: [{
                        type: 'line',
                        label: "예측",
                        //pointRadius:0,
                        data: [],
                        borderColor: 'rgba(75, 00, 150,1)',
                        borderWidth: 1,
                        fill: false
                    },{
                        type: 'bar',
                        label: "열 + 전력",
                        data: [], //RAW 데이터 때문에 bulidoptions 함수에서 설정
                        spanGaps: true,
                        backgroundColor: '#ffd54f',
                        borderColor: '#ffcc80',
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
                options: {

                    elements: {
                        line: {
                            tension: 0
                        }
                    },
                    tooltips: {

                    },
                    legend: { //차트 밖에 뜨는 이름표, 클릭시 지워짐
                        display: true,
                        position: 'top',
                        labels: {
                            //boxWidth: 80,
                            fontColor: 'black'
                        }
                    },

                    maintainAspectRatio: false,
                    hover: { mode: null },

                    scales: {
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
                                autoSkip: false,
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
                                show: true,

                            },
                            ticks: {
                                min: 0,
                                beginAtZero: true
                            }
                        }]

                    }
                }
            };
            if (mode === Linechart.Mode.RAW) {
                config.data.datasets[0].data = vm.dataSet[1].value;
                config.data.datasets[1].data = vm.dataSet[0].value;
            } else if (mode === Linechart.Mode.QUARTER) {
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
            if (sitesSupplyChart != null) {
                sitesSupplyChart.destroy();
            }
            sitesSupplyChart = new Chart(objChart, data);
        }

        $scope.raw = function () {
            if ($scope.lastChartState !== Linechart.Mode.RAW) {
                activate(Linechart.Mode.RAW);
                sitesSupplyChart.update();
            }
        };
        $scope.quarter = function () {
            if ($scope.lastChartState !== Linechart.Mode.QUARTER) {
                activate(Linechart.Mode.QUARTER);
                sitesSupplyChart.update();
            }
        };
        $scope.half = function () {
            if ($scope.lastChartState !== Linechart.Mode.HALF) {
                activate(Linechart.Mode.HALF);
                sitesSupplyChart.update();
            }
        };
        $scope.hour = function () {
            if ($scope.lastChartState !== Linechart.Mode.HOUR) {
                activate(Linechart.Mode.HOUR);
                sitesSupplyChart.update();
            }
        };
    }
})();