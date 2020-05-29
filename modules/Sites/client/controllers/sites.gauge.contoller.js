(function () {
    'use strict';

    angular
        .module('app.sites')
        .controller('PrototypeGaugeController', PrototypeGaugeController);

        PrototypeGaugeController.$inject = ['$scope',  '$timeout', '$stateParams', '$http', 'dateUtils', 'facilityInfo'];
    function PrototypeGaugeController($scope,  $timeout, $stateParams, $http, dateUtils, facilityInfo) {
        var vm = this;
        

        activate();

        function activate() {
            $scope.$on('facilityData', function (event, facilityData) {
                /* db 실시간 못받아와 임시로 날짜(2018-02-01 15시) 설정하였음

                    기존 코드 
                    var date = new Date();
                    date = dateUtils.yyyymmdd(date);
                */
                
               
                var nowDate = new Date();
                var yesterDate = nowDate.getTime() - (1*24*60*60*1000);
                nowDate.setTime(yesterDate);

                var yesterYear = nowDate.getFullYear();
                var yesterMonth = nowDate.getMonth()+1;
                var yesterDay = nowDate.getDate();

                if(yesterMonth<10){
                    yesterMonth = '0'+ yesterMonth;
                }
                if(yesterDay<10){
                    yesterDay='0'+ yesterDay;
                }

                var resultDate = yesterYear+'-'+yesterMonth +'-'+yesterDay;//어제 날짜 

                console.log(resultDate);

                var nowDate2 = new Date();
                var nowYear = nowDate2.getFullYear();
                var nowMonth = nowDate2.getMonth()+1;
                var nowDay = nowDate2.getDate();

                if(nowMonth<10){
                    nowMonth = '0'+nowMonth;
                }
                if(nowDay<10){
                    nowDay='0'+ nowDay;
                }

                var todayDate = nowYear + '-'+nowMonth+'-'+nowDay;//오늘날짜 

                console.log(todayDate);

                var todayUsg=0;
                var YesterUsg=0;
                
            
                facilityData.usage.forEach(function (item, index, array) {
                    if (array[index].mr_ymdhh==resultDate){
                        //console.log(array[index]);
                        YesterUsg+=array[index].Value_5min;
                    }
                    else if(array[index].mr_ymdhh==todayDate){
                        todayUsg+=array[index].Value_5min;
                    }
                    

                });
            
               
                console.log(YesterUsg);
                console.log(todayUsg);


                $scope.YUsg = YesterUsg;
            
                $scope.TUsg = todayUsg;
      


                var date = new Date();
                date.setHours(15);
                console.log(facilityData.valueDataHour[date.getHours()-1].toFixed(3));

                var chart = c3.generate({
                    data: {
                        columns: [
                            ['전력사용량',facilityData.valueDataHour[date.getHours()-1].toFixed(3)]
                        ],
                        type: 'gauge',
                    },
                    gauge: {
                        label: {
                            format: function (value, ratio) {
                                return ((value/facilityData.cblDataHour[date.getHours()-1])*100).toFixed(3)+'%';
                            },
                            show: true // to turn off the min/max labels.
                        },
                        min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                        max: parseFloat(facilityData.cblDataHour[date.getHours()-1]), // 100 is default
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
                        height: 180
                    }
                });
                var chart2= c3.generate({
                    bindto: '#linechart2',
                    data: {
                        columns: [
                            ['전력사용량',facilityData.valueDataHour[date.getHours()-1].toFixed(3)]
                        ],
                        type: 'gauge',
                    },
                    gauge: {
                        label: {
                            format: function (value, ratio) {
                                return ((value/facilityData.cblDataHour[date.getHours()-1])*100).toFixed(3)+'%';
                            },
                            show: true // to turn off the min/max labels.
                        },
                        min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                        max: parseFloat(facilityData.cblDataHour[date.getHours()-1]), // 100 is default
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
                        height: 180
                    }
                });
               


                
           

            });
            
        }
    }
})();