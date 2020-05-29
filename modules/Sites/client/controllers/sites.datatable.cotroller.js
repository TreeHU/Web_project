(function () {
    'use strict';

    angular
        .module('app.sites')
        .controller('PrototypeDatatableController', PrototypeDatatableController);
    PrototypeDatatableController.$inject = ['$scope', '$stateParams', '$http', '$q', 'dateUtils', 'DTOptionsBuilder', '$compile', 'DTColumnBuilder'];
    function PrototypeDatatableController($scope, $stateParams, $http, $q, dateUtils, DTOptionsBuilder, $compile, DTColumnBuilder) {
        var vm = this;
        var DATATABLE = {
            MODE: { RAW: 1, HOUR: 2, HALFHOUR: 3, QUARTERHOUR: 4 }
        };
        $scope.lastDatatableState = DATATABLE.MODE.RAW;

        $scope.$on('facilityData', function (event, data) {
            ColumnDefWithCBL();
            vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
                var date = new Date();
                var result = [];
                $scope.lastDatatableState = DATATABLE.MODE.HOUR;
                for(var i=0;i<24;i++){
                    var object = {};
                    object.mr_ymdhh = dateUtils.yyyymmdd(date);
                    object.mmIndex = i;
                    object.Value_5min = data.valueDataHour[i];
                    object.cbl=data.cblDataHour[i];
                    object.differenceValue=data.valueDataHour[i]-data.cblDataHour[i];
                    result.push(object);
                }
                var defer = $q.defer();
                defer.resolve(result);              
                return defer.promise;
            }).withDOM('frtip')
                .withPaginationType('full_numbers')
                .withOption('autoWidth',true)
                .withButtons([
                    'copy',
                    'print',
                    'excel',
                    // {
                    //     text: 'RAW',
                    //     key: DATATABLE.MODE.RAW,
                    //     action: function (e, dt, node, config) {
                    //         $scope.lastDatatableState = config.key;
                    //         vm.dtInstance.changeData(function () {
                    //             DefaultColumnDef();
                    //             var defer = $q.defer();
                    //             defer.resolve(data.usage);
                    //             return defer.promise;
                    //         });
                    //     }
                    // },
                    {
                        text: 'QUARTERHOUR',
                        key: DATATABLE.MODE.QUARTERHOUR,
                        action: function (e, dt, node, config) {
                            //옵션바꾸기
                            var date = new Date();
                            $scope.lastDatatableState = config.key;
                            vm.dtInstance.changeData(function () {
                                var result = [];
                                for(var i=0;i<96;i++){
                                    var object = {};
                                    object.mr_ymdhh = dateUtils.yyyymmdd(date);
                                    object.mmIndex = i;
                                    object.Value_5min = data.valueDataQuaterHour[i];
                                    object.cbl=data.cblDataQuater[i];
                                    object.differenceValue= object.Value_5min-object.cbl;
                                    result.push(object);
                                }
                                
                                var defer = $q.defer();
                                defer.resolve(result);              
                                return defer.promise;
                            });
                            // vm.dtInstance.rerender();
                        }
                    },
                    {
                        text: 'HALFHOUR',
                        key: DATATABLE.MODE.HALFHOUR,
                        action: function (e, dt, node, config) {
                            var date = new Date();
                            $scope.lastDatatableState = config.key;
                            vm.dtInstance.changeData(function () {
                                var result = [];
                                for(var i=0;i<48;i++){
                                    var object = {};
                                    object.mr_ymdhh = dateUtils.yyyymmdd(date);
                                    object.mmIndex = i;
                                    object.Value_5min = data.valueDataHalfHour[i];
                                    object.cbl=data.cblDataHalf[i];
                                    object.differenceValue= object.Value_5min-object.cbl;
                                    result.push(object);
                                }
                                
                                var defer = $q.defer();
                                defer.resolve(result);              
                                return defer.promise;
                            });
                        }
                    },
                    {
                        text: 'HOUR',
                        key: DATATABLE.MODE.HOUR,
                        action: function (e, dt, node, config) {
                            //옵션바꾸기
                            var date = new Date();
                            $scope.lastDatatableState = config.key;
                            vm.dtInstance.changeData(function () {
                                var result = [];
                                for(var i=0;i<24;i++){
                                    var object = {};
                                    object.mr_ymdhh = dateUtils.yyyymmdd(date);
                                    object.mmIndex = i;
                                    object.Value_5min = data.valueDataHour[i];
                                    object.cbl=data.cblDataHour[i];
                                    object.differenceValue=object.Value_5min-object.cbl;
                                    result.push(object);
                                }
                                var defer = $q.defer();
                                defer.resolve(result);              
                                return defer.promise;
                            });
                            // vm.dtInstance.rerender();
                        }
                    }
                ]);

            vm.dtInstance = {};
            //데이터테이블 초기화
            angular.element('#datatable').attr('datatable', '');
            $compile(angular.element('#datatable'))($scope);


        });
        function ColumnDefWithCBL() {
            vm.dtColumns = [
                DTColumnBuilder.newColumn('mr_ymdhh').withTitle('날짜'),
                DTColumnBuilder.newColumn('mmIndex').withTitle('시간')
                    .renderWith(function (data, type, full, meta) {
                        if ($scope.lastDatatableState === DATATABLE.MODE.HOUR) {
                            return dateUtils.hhmm(data);
                        }
                        else if($scope.lastDatatableState === DATATABLE.MODE.HALFHOUR){
                            return dateUtils.hhmm(data);
                        }
                        else if($scope.lastDatatableState === DATATABLE.MODE.QUARTERHOUR){
                            return dateUtils.hhmm(data);
                        }
                        else{
                            return data;
                        }
                    }),
                DTColumnBuilder.newColumn('Value_5min').withTitle('사용량')
                    .renderWith(function (data, type, full, meta) {
                        return parseFloat(data).toFixed(3)+ ' KWh';
                    }),
                DTColumnBuilder.newColumn('cbl').withTitle('CBL MAX(4/5)')
                    .renderWith(function (data, type, full, meta) {
                        return parseFloat(data).toFixed(3)+' KWh';
                }),
                DTColumnBuilder.newColumn('differenceValue').withTitle('차이값')
                .renderWith(function (data, type, full, meta) {
                    if(data>0){
                        return '<font color="red">▲'+parseFloat(data).toFixed(3)+' KWh'+'</font>';
                    }
                    else if(data<0){
                        return '<font color="blue">▼'+parseFloat(data).toFixed(3)+' KWh'+'</font>';
                    }
                    else{
                        return '〓 '+parseFloat(data).toFixed(3)+' KWh';
                    }
                    
                })
                //높으면빨간색 낮으면 파란색
                
            ];
        }
        function DefaultColumnDef() {
            vm.dtColumns = [
                DTColumnBuilder.newColumn('mr_ymdhh').withTitle('날짜'),
                DTColumnBuilder.newColumn('mmIndex').withTitle('시간')
                    .renderWith(function (data, type, full, meta) {
                        return data;
                }),
                DTColumnBuilder.newColumn('Value_5min').withTitle('사용량')
                    .renderWith(function (data, type, full, meta) {
                        return data.toFixed(3) + ' KWh';
                })          
            ];
        }

    }
})();
