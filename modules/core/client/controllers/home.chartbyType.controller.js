function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    angular.module('core').controller('ChartbyTypeController', ChartbyTypeController);

    ChartbyTypeController.$inject = ['$scope', '$q', '$timeout', 'Colors', '$http', 'dateUtils','FacilityTotalUsage'];
    function ChartbyTypeController($scope, $q, $timeout, Colors, $http, dateUtils, FacilityTotalUsage) {

        function parsingstr(str){
            return str.replace('LH','');
        }
        var vm = this;

        var config;
        $scope.lastChartState;
        var Barchart = {
            Mode: { RAW: 26, elecD: 1, elecS: 2, heatD: 3, heatS: 4 }
        };
        // $scope.$on('Allsensorlist', function (event, data) {
        //     facilityList=data;
        //     console.log(facilityList);
        //     FacilityTotalUsage.getSelectedUsage(facilityList).then(function (usage) { //
        //         var data = new Object();
        //         data.usage = usage;
        //         // vm.FacilityTotal.usage=usage;
        //         // console.log()
        //         FacilityTotalUsage.getSelectedEachType(facilityList).then(function (typeUsage) {//
        //             data.typeUsage = typeUsage;
        //             vm.FacilityTotal = data;
        //             console.log(data);
        //             activate(Barchart.Mode.RAW, facilityList);
        //             activate(Barchart.Mode.elecD, facilityList);
        //             activate(Barchart.Mode.heatD, facilityList);
        //             activate(Barchart.Mode.elecS, facilityList);
        //             activate(Barchart.Mode.heatS, facilityList);
        //             // vm.FacilityTotal.typeUsage = typeUsage;
        //             // $scope.$broadcast('FacilityTotal', data);
        //         })
        //     })
        // })
        //1
        $scope.$on('sensorList', function (event, data) {
            if(data.length!=null){
            // console.log(data);
                var facilityList = '';
                data.forEach(function (value, index) {
                    facilityList += "'" + value.equip_Id + "',";
                })
                facilityList = facilityList.slice(0, (facilityList.length - 1));
                facilityList = "(" + facilityList + ")";
                $scope.lastChartState = facilityList;
                FacilityTotalUsage.getSelectedUsage(facilityList).then(function (usage) { //
                    var data = new Object();
                    data.usage = usage;
                    // vm.FacilityTotal.usage=usage;
                    // console.log()
                    FacilityTotalUsage.getSelectedEachType(facilityList).then(function (typeUsage) {//
                        data.typeUsage = typeUsage;
                        vm.FacilityTotal = data;
                        
                        activate(Barchart.Mode.RAW);
                        activate(Barchart.Mode.elecD);
                        activate(Barchart.Mode.heatD);
                        activate(Barchart.Mode.elecS);
                        activate(Barchart.Mode.heatS);
                        // vm.FacilityTotal.typeUsage = typeUsage;
                        // $scope.$broadcast('FacilityTotal', data);
                    })
                })
            }
        })

        function activate(mode) {
            vm.dataSet = buildChartDataSet(mode);
            config = bulidChartOptions(mode);
            if (mode == Barchart.Mode.RAW) {
                $("canvas#myChart").remove();
                $("#myChartContent").html("<canvas id='myChart' width='500px' height='400px'></canvas>");
                drawChart(document.getElementById("myChart").getContext('2d'), config);
            } else if (mode == Barchart.Mode.elecD) {
                $("#myChart1").remove();
                $("#myChartContent1").html("<canvas id='myChart1' width='500px' height='300px'></canvas>");
                drawChart(document.getElementById("myChart1").getContext('2d'), config);
            } else if (mode == Barchart.Mode.elecS) {
                $("#myChart3").remove();
                $("#myChartContent3").html("<canvas id='myChart3' width='500px' height='300px'></canvas>");
                drawChart(document.getElementById("myChart3").getContext('2d'), config);
            } else if (mode == Barchart.Mode.heatD) {
                $("#myChart2").remove();
                $("#myChartContent2").html("<canvas id='myChart2' width='500px' height='300px'></canvas>");
                drawChart(document.getElementById("myChart2").getContext('2d'), config);
            } else if (mode == Barchart.Mode.heatS) {
                $("#myChart4").remove();
                $("#myChartContent4").html("<canvas id='myChart4' width='500px' height='300px'></canvas>");
                drawChart(document.getElementById("myChart4").getContext('2d'), config);
            }
            function buildChartDataSet(mode) {
                var usageValue;
                var demandValue=[];
                var supplyValue=[];
                var usageData = [];
                var demandData = [];
                var supplyData=[];
                var dataSet = [];
                // switch (mode) {
                //     case Barchart.Mode.RAW:
                //         console.log(vm.FacilityTotal.usage);
                //         // console.log(vm.FacilityTotal[0]);
                //         demandValue = vm.FacilityTotal.usage;
                //         supplyValue = vm.FacilityTotal.usage;
                //         // supplyValue = vm.FacilityTotal;
                //         // demandValue = vm.FacilityTotal;
                //         console.log(damandValue);
                //         break;
                //     case Barchart.Mode.elecD:
                //         // usageValue = vm.FacilityTotal.typeUsage;
                //         usageValue = vm.FacilityTotal[0];
                //         break;
                //     case Barchart.Mode.elecS:
                //         // usageValue = vm.FacilityTotal.typeUsage;
                //         usageValue = vm.FacilityTotal[0];
                //         break;
                //     case Barchart.Mode.heatD:
                //         // usageValue = vm.FacilityTotal.typeUsage;
                //         usageValue = vm.FacilityTotal[0];
                //         break;
                //     case Barchart.Mode.heatS:
                //         // usageValue = vm.FacilityTotal.typeUsage;
                //         usageValue = vm.FacilityTotal[0];
                //         break;
                // }
                // $scope.lastChartState = list;
                if (mode == Barchart.Mode.RAW) {

                    demandData.xaxis = []; //x축 label : index (임시) 
                    demandData.value = []; //인덱스제외 array : 사용량 값 
                    demandData.typeName = [];
                    demandData.label = '사용량';
                    demandData.color = '#004e66';
                    demandData.data = [];

                    supplyData.value = []; //인덱스제외 array : 사용량 값 
                    supplyData.label = '생산량';
                    supplyData.color = '#E71D36';
                    supplyData.data = [];

                    for (var i = 0; i < mode; i++) {
                        if (i < vm.FacilityTotal.usage.length || i < vm.FacilityTotal.usage.length) {
                            var demandDataObject = [];
                            var supplyDataObject = [];
                            demandData.xaxis.push(i);
                            demandData.value.push(vm.FacilityTotal.usage[i].sum_EC.toFixed(3));
                            demandData.typeName.push(parsingstr(vm.FacilityTotal.usage[i].facilName));
                            demandDataObject.push(i);
                            demandDataObject.push(vm.FacilityTotal.usage[i].sum_EC.toFixed(3));
                            demandData.data.push(demandDataObject);
                            if (vm.FacilityTotal.usage[i].sum_EO == null){
                                supplyData.value.push(0);
                                supplyDataObject.push(i);
                                supplyDataObject.push(null);
                                supplyData.data.push(supplyDataObject);
                            }
                            else if (vm.FacilityTotal.usage[i].sum_EO!=null){
                                supplyData.value.push(vm.FacilityTotal.usage[i].sum_EO.toFixed(3));
                                supplyDataObject.push(i);
                                supplyDataObject.push(vm.FacilityTotal.usage[i].sum_EO.toFixed(3));
                                supplyData.data.push(supplyDataObject);}
                        }
                        else{
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
                    // usageData.label = '사용량';
                    // usageData.color = '#004e66';
                    usageData.data = [];
                    usageData.typeName = [];
                    for (var i = 0; i < 6; i++) {
                        if (i < vm.FacilityTotal.typeUsage.length ) {
                            usageData.typeName.push(vm.FacilityTotal.typeUsage[i].type);
                            var rawData = [];
                            switch(mode){
                                case Barchart.Mode.elecD:
                                    if (vm.FacilityTotal.typeUsage[i].sum_EC != null) {
                                        usageData.value.push(vm.FacilityTotal.typeUsage[i].sum_EC.toFixed(3));
                                        rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                        rawData.push(vm.FacilityTotal.typeUsage[i].sum_EC.toFixed(3));
                                    }
                                    else if (vm.FacilityTotal.typeUsage[i].sum_EC == null) {
                                        usageData.value.push(0);
                                        rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                        rawData.push(0);
                                    }
                                    // usageData.value.push(vm.FacilityTotal.typeUsage[i].sum_EC.toFixed(3));
                                    // rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                    // rawData.push(vm.FacilityTotal.typeUsage[i].sum_EC.toFixed(3));
                                    break;
                                case Barchart.Mode.elecS:
                                    if (vm.FacilityTotal.typeUsage[i].sum_EO != null) {
                                    usageData.value.push(vm.FacilityTotal.typeUsage[i].sum_EO.toFixed(3));
                                    rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                    rawData.push(vm.FacilityTotal.typeUsage[i].sum_EO.toFixed(3));}
                                    else if (vm.FacilityTotal.typeUsage[i].sum_EO == null) {
                                        usageData.value.push(0);
                                        rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                        rawData.push(0);
                                    }
                                    break;
                                case Barchart.Mode.heatD:
                                    // usageData.value.push(vm.FacilityTotal.typeUsage[i].sum_EC.toFixed(3));
                                    // rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                    // rawData.push(vm.FacilityTotal.typeUsage[i].sum_EC.toFixed(3));
                                    if (vm.FacilityTotal.typeUsage[i].sum_EC != null) {
                                        usageData.value.push(vm.FacilityTotal.typeUsage[i].sum_EC.toFixed(3));
                                        rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                        rawData.push(vm.FacilityTotal.typeUsage[i].sum_EC.toFixed(3));
                                    }
                                    else if (vm.FacilityTotal.typeUsage[i].sum_EC == null) {
                                        usageData.value.push(0);
                                        rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                        rawData.push(0);
                                    }
                                    break;
                                case Barchart.Mode.heatS:
                                    if (vm.FacilityTotal.typeUsage[i].sum_EO != null) {
                                        usageData.value.push(vm.FacilityTotal.typeUsage[i].sum_EO.toFixed(3));
                                        rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                        rawData.push(vm.FacilityTotal.typeUsage[i].sum_EO.toFixed(3));
                                    }
                                    else if (vm.FacilityTotal.typeUsage[i].sum_EO == null) {
                                        usageData.value.push(0);
                                        rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                        rawData.push(0);
                                    }
                                    // usageData.value.push(vm.FacilityTotal.typeUsage[i].sum_EO.toFixed(3));
                                    // rawData.push(vm.FacilityTotal.typeUsage[i].type);
                                    // rawData.push(vm.FacilityTotal.typeUsage[i].sum_EO.toFixed(3));
                                    break;


                            }
                            // usageData.value.push(usageValue[i].sum_facility);
                            // rawData.push(usageValue[i].type);
                            // rawData.push(usageValue[i].sum_facility);
                            usageData.data.push(rawData);
                        }else{
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
                        },{
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
                            ticks: {
                                beginAtZero : true
                                
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
            function drawChart(objChart, data) {
                var myChart = null;
                if (myChart != null) {
                    myChart.destroy();
                }
                myChart = new Chart(objChart, data);
            }
        }     
    }
})();