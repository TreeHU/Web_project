function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    angular.module('core').controller('HomeChartController', HomeChartController);

    HomeChartController.$inject = ['$scope', '$q', '$timeout', 'Colors', '$http', 'dateUtils', 'FacilityTotalUsage'];
    function HomeChartController($scope, $q, $timeout, Colors, $http, dateUtils, FacilityTotalUsage) {

        var vm = this;
        var dataset_usage = [];
        var config;

        $scope.lastChartState;

        var object = new Object();
        var Barchart = {
            Mode: { RAW: 26, elecD: 1, elecS: 2, heatD: 3, heatS: 4 }
        };
        var facilityList;
        $scope.$on('Allsensorlist', function (event, data) {
            facilityList = data;
            
            FacilityTotalUsage.getSelectedUsage(facilityList).then(function (usage) { //
                
                var data = new Object();
                data.usage = usage;
                FacilityTotalUsage.getSelectedEachType(facilityList).then(function (typeUsage) {//
                    data.typeUsage = typeUsage;
                    vm.FacilityTotal = data;
                    activate(Barchart.Mode.RAW);
                    activate(Barchart.Mode.elecD);
                    activate(Barchart.Mode.heatD);
                    activate(Barchart.Mode.elecS);
                    activate(Barchart.Mode.heatS);
                })
            })
        })

        function parsingstr(str){
            return str.replace('LH','');
        }

        function activate(mode) {
            vm.dataSet = buildChartDataSet(mode);
            config = bulidChartOptions(mode);
            if (mode == Barchart.Mode.RAW) {
                drawChart(document.getElementById("myChart").getContext('2d'), config);
            } else if (mode == Barchart.Mode.elecD) {
                drawChart(document.getElementById("myChart1").getContext('2d'), config);
            } else if (mode == Barchart.Mode.elecS) {
                drawChart(document.getElementById("myChart3").getContext('2d'), config);
            } else if (mode == Barchart.Mode.heatD) {
                drawChart(document.getElementById("myChart2").getContext('2d'), config);
            } else if (mode == Barchart.Mode.heatS) {
                drawChart(document.getElementById("myChart4").getContext('2d'), config);
            }
            function buildChartDataSet(mode) {
                var usageValue;
                var demandValue;
                var supplyValue;
                var usageData = [];
                var demandData = [];
                var supplyData = [];
                var dataSet = [];
                switch (mode) {
                    case Barchart.Mode.RAW:
                        demandValue = vm.FacilityTotal.usage;
                        supplyValue = vm.FacilityTotal.usage;
                        break;
                    case Barchart.Mode.elecD:
                        usageValue = vm.FacilityTotal.typeUsage;
                        break;
                    case Barchart.Mode.elecS:
                        usageValue = vm.FacilityTotal.typeUsage;
                        break;
                    case Barchart.Mode.heatD:
                        usageValue = vm.FacilityTotal.typeUsage;
                        break;
                    case Barchart.Mode.heatS:
                        usageValue = vm.FacilityTotal.typeUsage;
                        break;
                }
                if (mode == Barchart.Mode.RAW) {

                    demandData.xaxis = []; //x축 label : index (임시) 
                    demandData.value = []; //인덱스제외 array : 사용량 값 
                    demandData.typeName = [];
                    demandData.label = '생산량';
                    demandData.color = '#004e66';
                    demandData.data = [];

                    supplyData.value = []; //인덱스제외 array : 사용량 값 
                    supplyData.label = '생산량';
                    supplyData.color = '#E71D36';
                    supplyData.data = [];
                    

                    for (var i = 0; i < mode; i++) {
                        if (i < demandValue.length || i < supplyValue.length) {
                            var demandDataObject = [];
                            var supplyDataObject = [];
                            demandData.xaxis.push(i);
                            demandData.value.push(demandValue[i].sum_EC.toFixed(3));
                            demandData.typeName.push(parsingstr(demandValue[i].facilName));
                            demandDataObject.push(i);
                            demandDataObject.push(demandValue[i].sum_EC.toFixed(3));
                            demandData.data.push(demandDataObject);
                            if (supplyValue[i].sum_EO == null) {
                                supplyData.value.push(0);
                                supplyDataObject.push(i);
                                supplyDataObject.push(0);
                                supplyData.data.push(supplyDataObject);

                            }
                            else if (supplyValue[i].sum_EO != null) {
                                supplyData.value.push(supplyValue[i].sum_EO.toFixed(3));
                                supplyDataObject.push(i);
                                supplyDataObject.push(supplyValue[i].sum_EO.toFixed(3));
                                supplyData.data.push(supplyDataObject);
                            }
                        }
                        else {
                            var demandDataObject = [];
                            var supplyDataObject = [];
                            demandData.xaxis.push(null);
                            demandData.value.push(null);
                            demandData.typeName.push("");
                            demandDataObject.push(null);
                            demandDataObject.push(null);
                            demandData.data.push(null);

                            supplyData.value.push(null);
                            supplyDataObject.push(null);
                            supplyDataObject.push(null);
                            supplyData.data.push(null);
                        }
                    }
                    dataSet.push(demandData);
                    dataSet.push(supplyData);
                    return dataSet;
                } else {

                    usageData.xaxis = []; //x축 label : index (임시) 
                    usageData.value = []; //인덱스제외 array : 사용량 값 
                    usageData.label = '사용량';
                    usageData.color = '#004e66';
                    usageData.data = [];
                    usageData.typeName = [];
                    for (var i = 0; i < 6; i++) {

                        if (i < usageValue.length) {
                            usageData.typeName.push(usageValue[i].type);
                            var rawData = [];
                            switch (mode) {
                                case Barchart.Mode.elecD:
                                    if (usageValue[i].sum_EC != null) {
                                        usageData.value.push(usageValue[i].sum_EC.toFixed(3));
                                        rawData.push(usageValue[i].type);
                                        rawData.push(usageValue[i].sum_EC.toFixed(3));}
                                    else if (usageValue[i].sum_EC == null) {
                                        usageData.value.push(0);
                                        rawData.push(usageValue[i].type);
                                        rawData.push(0);
                                    }
                                    break;
                                case Barchart.Mode.elecS:
                                    if (usageValue[i].sum_EO != null) {
                                        usageData.value.push(usageValue[i].sum_EO.toFixed(3));
                                        rawData.push(usageValue[i].type);
                                        rawData.push(usageValue[i].sum_EO.toFixed(3));
                                    }
                                    else if (usageValue[i].sum_EO == null) {
                                        usageData.value.push(0);
                                        rawData.push(usageValue[i].type);
                                        rawData.push(0);
                                    }
                                    // usageData.value.push(usageValue[i].sum_EO.toFixed(3));
                                    // rawData.push(usageValue[i].type);
                                    // rawData.push(usageValue[i].sum_EO.toFixed(3));
                                    break;
                                case Barchart.Mode.heatD:
                                    if (usageValue[i].sum_EC != null) {
                                        usageData.value.push(usageValue[i].sum_EC.toFixed(3));
                                        rawData.push(usageValue[i].type);
                                        rawData.push(usageValue[i].sum_EC.toFixed(3));
                                    }
                                    else if (usageValue[i].sum_EC == null) {
                                        usageData.value.push(0);
                                        rawData.push(usageValue[i].type);
                                        rawData.push(0);
                                    }
                                    // usageData.value.push(usageValue[i].sum_EC.toFixed(3));
                                    // rawData.push(usageValue[i].type);
                                    // rawData.push(usageValue[i].sum_EC.toFixed(3));
                                    break;
                                case Barchart.Mode.heatS:
                                    if (usageValue[i].sum_EO != null) {
                                        usageData.value.push(usageValue[i].sum_EO.toFixed(3));
                                        rawData.push(usageValue[i].type);
                                        rawData.push(usageValue[i].sum_EO.toFixed(3));
                                    }
                                    else if (usageValue[i].sum_EO == null) {
                                        usageData.value.push(0);
                                        rawData.push(usageValue[i].type);
                                        rawData.push(0);
                                    }
                                    // usageData.value.push(usageValue[i].sum_EO.toFixed(3));
                                    // rawData.push(usageValue[i].type);
                                    // rawData.push(usageValue[i].sum_EO.toFixed(3));
                                    break;


                            }
                            // usageData.value.push(usageValue[i].sum_facility);
                            // rawData.push(usageValue[i].type);
                            // rawData.push(usageValue[i].sum_facility);
                            usageData.data.push(rawData);
                        } else {
                            usageData.data.push(null);
                            usageData.typeName.push("");
                            usageData.value.push(null);

                        }
                    }
                    dataSet.push(usageData);
                    return dataSet;
                }
            }

            function bulidChartOptions(mode) {
                var _options;

                var config = {
                    type: 'bar',
                    data: {
                        labels: vm.dataSet[0].typeName,
                        datasets: [{
                            type: 'bar',
                            label: "사용량",
                            data: [],
                            spanGaps: true,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        }, {
                            type: 'bar',
                            label: "생산량",
                            data: [],
                            spanGaps: true,
                            backgroundColor: 'rgba(75, 00, 150, 0.2)',
                            borderColor: 'rgba(75, 00, 150,1)',
                            borderWidth: 1,
                        }]
                    },
                    options: (_options = {
                        elements: {
                            line: {
                                tension: 0
                            }
                        },
                        tooltips: {},

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
                                autoSkip: false,
                                minRotation: 90,
                                beginAtZero: true,
                            }
                        }],

                        yAxes: [{
                            type: "linear",
                            position: "left",
                            gridLines: {
                                display: true
                            },
                            labels: {
                                show: true
                            },
                            ticks:{
                                beginAtZero:true
                            }
                        }]

                    }), _options)
                };
                if (mode === Barchart.Mode.RAW) {
                    config.data.datasets[0].data = vm.dataSet[0].value;
                    config.data.datasets[1].data = vm.dataSet[1].value;
                } else if (mode === Barchart.Mode.elecD) {
                    config.data.datasets[0].data = vm.dataSet[0].value;
                } else if (mode === Barchart.Mode.elecS) {
                    config.data.datasets[1].data = vm.dataSet[0].value;
                } else if (mode === Barchart.Mode.heatD) {
                    config.data.datasets[0].data = vm.dataSet[0].value;
                } else if (mode === Barchart.Mode.heatS) {
                    config.data.datasets[1].data = vm.dataSet[0].value;
                }
                return config;
            }

            var myChart = null;

            function drawChart(objChart, data) {
                if (myChart != null) {
                    myChart.destroy();
                }
                var ctx = objChart;
                myChart = new Chart(ctx, data);
            }
        }
    }
})();