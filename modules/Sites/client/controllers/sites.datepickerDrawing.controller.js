(function () {
    'use strict';

    angular
        .module('app.sites')
        .controller('datepickDrawingChartController', datepickDrawingChartController);

    datepickDrawingChartController.$inject = ['$scope', 'ChartData', '$timeout', 'Colors', '$http', 'dateUtils'];
    function datepickDrawingChartController($scope, ChartData, $timeout, Colors, $http, dateUtils) {
        
        var vm = this;
        
        var config;
        var object = new Object();

    
        $scope.$on('ShowByDay', function (event, data) {
            vm.ShowByDay = data;
            activate();
        });
        $scope.$on('ShowByMonth',function(event,data){
            vm.ShowByMonth = data;
            activate();
        })

        function activate() {
            vm.dataSet = buildChartDataSet();
            config = bulidChartOptions(vm.dataSet);
            $("#myChart").remove();
            $("#myChartContent").html("<canvas id='myChart' width='500px' height='300px'></canvas>");
            var ctx = document.getElementById("myChart").getContext('2d');
            var chart = new Chart(ctx,config);
        }

        function buildChartDataSet() {
            var data = new Object();
            data.usageValue = [];
            data.xIndex = [];

            for(var i=0; i<vm.ShowByDay.length; i++){
                data.usageValue.push(vm.ShowByDay[i].SUM_Value5min);
                data.xIndex.push(vm.ShowByDay[i].mr_ymdhh);
            }

            return data;
        }
        
        function bulidChartOptions(VMdata){

            var config = {
                type : 'bar',
                data : {
                    labels : VMdata.xIndex,
                    datasets : [{
                        type : 'bar',
                        label : "Usage",
                        data : VMdata.usageValue,
                        backgroundColor: 'rgb(75, 192, 192)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        
                    }
                    // ,{
                    //     type : 'line',
                    //     label : "CBL Max(4/5)",
                    //     data : [],
                    //     borderColor: 'rgba(75, 00, 150,1)',
                    //     borderWidth: 1,
                    //     fill : false
                    // }
                    ]
                },
                options : {
                    elements: {
                        line: {
                            tension: 0
                        }
                    },
                    
                tooltips:{
                    
                },

                    maintainAspectRatio: false,
                    hover: {mode: null},
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type : "category",
                            id : "axis-bar",
                            display: true,
                            gridLines: {
                                display: true
                            },
                            labels: {
                                show: true,
                            },
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1,
                              }
                        }],                        
            
                        yAxes: [{
                            type: "linear",
                            // display: true,
                            position: "left",
                            gridLines:{
                                display: true
                            },
                            labels: {
                                show:true,
                                
                            }
                        }]
                        
                    } 
                }
            };

            return config;
        }



        /*
            차트 redraw 함수 재정의 예정
            차트 call 할때마다 reset시키거나 destroy, remove..
        */
        
        // function drawChart(objChart, data) {
        //     if (myChart != null) {
        //         myChart.destroy();
        //     }
        //     var ctx = objChart;
        //     myChart = new Chart(ctx, data);
            
        // }

    }
})();