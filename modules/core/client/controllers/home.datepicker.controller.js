/**=========================================================
 * Module: demo-datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('core')
        .controller('HomeDatepickerCtrl', HomeDatepickerCtrl);

    HomeDatepickerCtrl.$inject=['$scope','$http','dateUtils','datepick']
    function HomeDatepickerCtrl($scope, $http, dateUtils, datepick) {
        var vm = this;
        var params = new Object();
     
        // $scope.$on('facilityUsageData', function (event, data){
        //   vm.facilityData = data;
        //   params.EquipmentId = vm.facilityData.info.EquipmentId;
        //   activate();
        // });

        // $scope.ShowByDay = function(date){
        //   datepick.getDataByDay(params.EquipmentId,date).then(function(result){
        //     console.dir(result);
        //     $scope.$emit('ShowByDay',result);
        //   })
        // };
        

         activate();

        ////////////////

        function activate() {

          vm.today = function() {
            vm.dt = new Date();
          };
          vm.today();

          vm.clear = function () {
            vm.dt = null;
          };

          // Disable weekend selection
          vm.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          vm.toggleMin = function() {
            vm.minDate = vm.minDate ? null : new Date();
          };
          vm.toggleMin();

          vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
          };

          vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          vm.initDate = new Date('2019-10-20');
          vm.formats = ['yyyy/MM/dd', 'dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
          vm.format = vm.formats[0];
        }
    }
})();

