/**=========================================================
 * Module: demo-datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sites')
        .controller('SiteDatepickerCtrl', SiteDatepickerCtrl);

    SiteDatepickerCtrl.$inject=['$scope','$http', '$stateParams', 'dateUtils','datepick', 'Dataparsing','facilityInfo']
    function SiteDatepickerCtrl($scope, $http, $stateParams, dateUtils, datepick, Dataparsing, facilityInfo) {
        var vm = this;

        activate();
      ////////////////

      function activate() {

        vm.dates = {
          date1 : new Date(),//에너지 수요
          date2 : new Date(),//에너지 공급
          date3 : new Date(),//전력 수요
          date4 : new Date()//전력 공급
        };
        vm.open = {
          date1 : false,
          date2 : false,
          date3 : false,
          date4 : false
        }

        $scope.redraw_EnergyUsage = function(date){
          facilityInfo.getFacilityInfo1($stateParams.facil_Id).then(function (info){
            facilityInfo.getFacilityElecUsage(info.facilName,date).then(function(usage){
              Dataparsing.sitedataParsing(usage,"Usage",date).then(function(result){
                $scope.$emit('usage_datepick',result);
              });
            });
          });
        };

        $scope.redraw_EnergySupply = function(date){
          facilityInfo.getFacilityInfo1($stateParams.facil_Id).then(function (info){
            facilityInfo.supply60min_Past($stateParams.facil_Id, date).then(function (pre60min) {
              facilityInfo.getFacilityElecSupply(info.facilName,date).then(function(supply){
                supply._60min=pre60min;
                Dataparsing.sitedataParsing(supply,"Supply",date).then(function(result){
                  $scope.$emit('supply_datepick',result);
                });
              });
            });
          });  
        };

        $scope.redraw_ElecDemand = function(date){
          facilityInfo.getFacilityInfo1($stateParams.facil_Id).then(function (info){
            facilityInfo.getFacilityElecUsage(info.facilName,date).then(function(usage){
              Dataparsing.sitedataParsing(usage,"Usage",date).then(function (result) {
                $scope.$emit('elecUsage_datepick',result);
              });
            });
          });           
        };

        $scope.redraw_ElecSupply = function(date){
          facilityInfo.getFacilityInfo1($stateParams.facil_Id).then(function (info){
            facilityInfo.supply60min_Past($stateParams.facil_Id, date).then(function (pre60min) {
              facilityInfo.getFacilityElecSupply(info.facilName,date).then(function(supply){
                supply._60min = pre60min;
                Dataparsing.sitedataParsing(supply,"Supply",date).then(function (result) {
                  $scope.$emit('elecSupply_datepick',result);
                });
              });
            });
          });  
        };

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

        vm.open = function($event,id) {
          $event.preventDefault();
          $event.stopPropagation();

          vm.open[id] = true;
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

