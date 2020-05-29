/**=========================================================
 * Module: facility popup builder,js
 * Angular Datatable popup controller
 =========================================================*/

 (function() {
    'use strict';

    angular
        .module('app.facility')
        .controller('FacilitiesPopupController', FacilitiesPopupController);

        FacilitiesPopupController.$inject = ['$http','$q', 'DTOptionsBuilder', 'DTColumnBuilder','$scope','$state','ngDialog'];
    function FacilitiesPopupController($http,$q, DTOptionsBuilder, DTColumnBuilder,$scope,$state,ngDialog) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            var parameter = new Object();
            // parameter.type = $scope.type;
            vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                var defer = $q.defer();
                // $http.post('/api/facilitybytype',parameter).then(function(result) {
                //     defer.resolve(result.data);
                // });
                $http.get('/api/facilities').then(function (result) {
                    defer.resolve(result.data);
                });
                return defer.promise;
            }).withDOM('frtip')
            .withPaginationType('full_numbers')
            .withOption('rowCallback',rowcallback)
            .withButtons([
                'copy',
                'print',
                'excel'
            ]);
        
            vm.dtColumns = [
                DTColumnBuilder.newColumn('facilName').withTitle('시설명'),
                DTColumnBuilder.newColumn('adminTel').withTitle('전화번호'),
                DTColumnBuilder.newColumn('type').withTitle('시설타입')
                
            ];
            
           
            
        }
        function rowcallback(nRow, aData, iDisplayIndex, iDisplayIndexFull){
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    ngDialog.close();
                    // $state.go('app.prototype',{'objectId':aData._id});
                    $state.go('app.sites', { 'equip_Id': aData.equip_Id });
                });
            });
            return nRow;
        }
    }
})();
