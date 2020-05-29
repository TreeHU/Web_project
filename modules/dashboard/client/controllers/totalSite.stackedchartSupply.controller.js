function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    angular.module('app.totalsite')
    .controller('ElecSupplyStackedChartController', ElecSupplyStackedChartController);

    ElecSupplyStackedChartController.$inject = ['$scope', '$q', '$timeout', 'Colors', '$http', 'dateUtils'];
    function ElecSupplyStackedChartController($scope, $q, $timeout, Colors, $http, dateUtils) {
        function parsingstr(str){
            return str.replace('LH','');
        }
        var vm = this;
        var dataset_usage = [];
        var config;
        var stackedSupplyChart;

        var colors = ['#84ffff','#ffbb33','#00C851','#33b5e5','#e1bee7','#e57373','#7cb342','#a1887f',
                     '#3F729B','#f8bbd0','#3E4551','#880e4f','#e040fb','#1a237e','#e1f5fe','#004d40',
                     '#827717','#e65100','#ffea00','#ffccbc','#e0e0e0','#d0d6e2','#8bc34a','#0091ea',
                     '#aa00ff ','#69f0ae'];

        $scope.lastChartState;

        var object = new Object();
        var Usageobj = new Object();

        var preValue;
        var preData = new Object();

        var Linechart = {
            Mode: { RAW: 1, HOUR: 12, HALF: 6, QUARTER: 3 }
        };
        //차트 말풍선 위치 고정
        Chart.Tooltip.positioners.myCustomPosition = function(unused, position) {
            return { x: position.x, y: 85 }; // HARDCODING VALUES
         }

        $scope.$on('selectedData', function (event, data) {
            vm.TsData = data.EachFacilitySupply;         
            //각 시설별 사용량만 담을 변수 선언
            for(var key in vm.TsData.data){
                Usageobj[key] = [];
            }
            activate(Linechart.Mode.RAW);
        });
        $scope.$on('ElecSupply_datepick', function (event, data) {
            vm.TsData = data.Energy;
            //각 시설별 사용량만 담을 변수 선언
            for(var key in vm.TsData.data){
                Usageobj[key] = [];
            }
            activate(Linechart.Mode.RAW);
        });
        function groupingByMin(obj1,obj2,mode){
            switch(mode){
                case Linechart.Mode.HOUR:
                    for(var key in obj1){
                        for(var name in obj2){
                            if(key == name){
                                obj1[key] = obj2[name].valueDataHour;
                            }
                        }
                    }
                    preValue = vm.TsData.pre.valueDataHour;
                    break;
                case Linechart.Mode.HALF:
                    for(var key in obj1){
                        for(var name in obj2){
                            if(key == name){
                                obj1[key] = obj2[name].valueDataHalfHour;
                            }
                        }
                    }
                    preValue = vm.TsData.pre.valueDataHalfHour;
                    break;
                case Linechart.Mode.QUARTER:
                    for(var key in obj1){
                        for(var name in obj2){
                            if(key == name){
                                obj1[key] = obj2[name].valueDataQuaterHour;
                            }
                        }
                    }
                    preValue = vm.TsData.pre.valueDataQuaterHour;
                    break;
                case Linechart.Mode.RAW:
                    for(var key in obj1){
                        for(var name in obj2){
                            if(key == name){
                                obj1[key] = obj2[name].raw;
                            }
                        }
                    }
                    preValue = vm.TsData.pre.raw;
                    break;
            }
        }

        function activate(mode) {
            vm.dataSet = buildChartDataSet(mode);
            config = bulidChartOptions(mode);
            drawChart(document.getElementById("stackedSupplyChart").getContext('2d'), config);
        }

        function buildChartDataSet(mode) {
            var dataObj={};
            var dataSet = [];

            groupingByMin(Usageobj, vm.TsData.data, mode);

            $scope.lastChartState = mode;
            var nowIndex = dateUtils.timeToIndex(Date.now());
            if (mode !== Linechart.Mode.RAW) {

                dataObj.xaxis = []; //x축 label : index (임시) 
                dataObj.value = Usageobj;

                preData.label = '예측값';
                preData.color = '#E71D36';
                preData.value = [];

                for (var i = 0; i < parseInt(288 / mode); i++) {
                    dataObj.xaxis.push(dateUtils.hhmm(i * mode));
                }

                //예측값 배열
                preValue.forEach(function(item,i){
                    preData.value.push(item);
                });

                dataSet.push(dataObj);
                dataSet.push(preData);

                return dataSet;
            } else {
                //raw일경우
                dataObj.xaxis = []; //x축 label : index (임시)
                dataObj.raw = new Object();
                
                preData.label = '예측값';
                preData.color = '#E71D36';
                preData.value = [];

                for (var i = 0; i < 288; i++) {
                    if(i%12==0) dataObj.xaxis.push(dateUtils.hhmm(i * mode));
                    else dataObj.xaxis.push("");
                }

                //예측값 배열
                preValue.forEach(function(item,i){
                    preData.value.push(item);
                });

                dataObj.raw = Usageobj;

                dataSet.push(dataObj);
                dataSet.push(preData);

                return dataSet;
            }
        }

        function bulidChartOptions(mode) {
 
            //dataset 이름, 색상 지정 함수
            function setDataSets(obj){
                var datasets = [];

                var linedata = new Object();
                linedata.type = 'line';
                linedata.label = "예측";
                linedata.data = [];
                linedata.borderColor = 'rgba(75, 00, 150,1)';
                linedata.borderWidth = 1;
                linedata.pointBackgroundColor = 'rgba(75, 00, 150,1)';
                linedata.fill = false;

                datasets[0] = linedata;

                for(var i=1; i<Object.keys(obj).length; i++){
                    var dic = new Object();
                    dic.label = Object.keys(obj)[i];
                    dic.data = [];
                    dic.spanGaps = true;
                    dic.backgroundColor = colors[i];
                    dic.borderColor = colors[i];
                    dic.borderWidth = 1;
                    datasets.splice(i,0,dic);
                }
                return datasets;  
            };

            var _options;
            
            var config = {
                
                type: 'bar',
                data: {
                    
                    //labels : x축
                    labels: [],

                },
                options: (_options = {
                    elements: {
                        line: {
                            tension: 0
                        }
                    },
                    hover : {mode : null},
                    tooltips: {
                        callbacks:{
                            footer : function(tooltipItem){
                                var total = 0;
                                tooltipItem.forEach(function(element){
                                    total += element.yLabel;
                                });
                                total = total.toFixed(3);
                                return 'Total:'+total;
                            }
                        },                        
                        enabled: true,
                        mode: 'index',
                        intersect : false,
                        bodyFontSize: 10,
                        position:"myCustomPosition"
                    },
                    legend:{
                        display : true,
                        position : 'top',
                        labels:{
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
                            autoSkip : false,
                            minRotation: 90,
                            beginAtZero: true,
                        }
                    }],
                    yAxes: [{
                        stacked:true,
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

            config.data.datasets = setDataSets(Usageobj);

            if (mode === Linechart.Mode.RAW) {
                //x축
                config.data.labels = vm.dataSet[0].xaxis;
                for(var key in vm.dataSet[0].raw){
                    for(var i=0; i<config.data.datasets.length; i++){
                        if(config.data.datasets[i].label == key){
                            config.data.datasets[i].data = vm.dataSet[0].raw[key];
                            config.data.datasets[i].label = parsingstr(config.data.datasets[i].label);
                        }
                    }
                }
                config.data.datasets[0].data = vm.dataSet[1].value;
            } else if (mode === Linechart.Mode.QUARTER) {
                config.data.labels = vm.dataSet[0].xaxis;
                for(var key in vm.dataSet[0].value){
                    for(var i=0; i<config.data.datasets.length; i++){
                        if(config.data.datasets[i].label == key){
                            config.data.datasets[i].data = vm.dataSet[0].value[key];
                            config.data.datasets[i].label = parsingstr(config.data.datasets[i].label);
                        }
                    }
                }
                config.data.datasets[0].data = vm.dataSet[1].value;
            } else if (mode === Linechart.Mode.HALF) {
                config.data.labels = vm.dataSet[0].xaxis;
                for(var key in vm.dataSet[0].value){
                    for(var i=0; i<config.data.datasets.length; i++){
                        if(config.data.datasets[i].label == key){
                            config.data.datasets[i].data = vm.dataSet[0].value[key];
                            config.data.datasets[i].label = parsingstr(config.data.datasets[i].label);
                        }
                    }
                }
                config.data.datasets[0].data = vm.dataSet[1].value;
            } else if (mode === Linechart.Mode.HOUR) {
                config.data.labels = vm.dataSet[0].xaxis;
                for(var key in vm.dataSet[0].value){
                    for(var i=0; i<config.data.datasets.length; i++){
                        if(config.data.datasets[i].label == key){
                            config.data.datasets[i].data = vm.dataSet[0].value[key];
                            config.data.datasets[i].label = parsingstr(config.data.datasets[i].label);
                        }
                    }
                }
                config.data.datasets[0].data = vm.dataSet[1].value;
            }
            return config;
        }
        // var stackedSupplyChart = null;
        function drawChart(objChart, data) {
            if (stackedSupplyChart != null) {
                stackedSupplyChart.destroy();
            }
            stackedSupplyChart = new Chart(objChart, data);
        }
    
        $scope.raw = function () {
            if ($scope.lastChartState !== Linechart.Mode.RAW) {
                activate(Linechart.Mode.RAW);
                stackedSupplyChart.update();
            }
        };
        $scope.quarter = function () {
            if ($scope.lastChartState !== Linechart.Mode.QUARTER) {
                activate(Linechart.Mode.QUARTER);
                stackedSupplyChart.update();
            }
        };
        $scope.half = function () {
            if ($scope.lastChartState !== Linechart.Mode.HALF) {
                activate(Linechart.Mode.HALF);
                stackedSupplyChart.update();
            }
        };
        $scope.hour = function () {
            if ($scope.lastChartState !== Linechart.Mode.HOUR) {
                activate(Linechart.Mode.HOUR);
                stackedSupplyChart.update();
            }
        };
    }
})();
