/**=========================================================
 * Module: demo-datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

 (function() {
  'use strict';

  angular
      .module('app.SiteSupplyAndDemand')
      .controller('SDDatepickerCtrl', SDDatepickerCtrl);

  SDDatepickerCtrl.$inject=['$scope','$http','dateUtils','datepick','FacilityTotalUsage', 'SDSite','Dataparsing'];
  function SDDatepickerCtrl($scope, $http, dateUtils, datepick, FacilityTotalUsage, SDSite, Dataparsing) {
      var vm = this;

      // $scope.redraw = function(date){
      //   console.log(date);
      // }

      activate();

      ////////////////

      function activate() {

        vm.dates = {
          date1 : new Date(),//에너지 수요
          date2 : new Date(),//에너지 공급
          date3 : new Date(),//전력 수요
          date4 : new Date()//전력 생산
        };
        vm.open = {
          date1 : false,
          date2 : false,
          date3 : false,
          date4 : false
        }

        $scope.redraw_TotalUsage = function(date){
          FacilityTotalUsage.SDTotalUsage(date).then(function(total){
            Dataparsing.totalSDD(total,date).then(function(totalUsage){
              $scope.$emit('totalUsage_datepick',totalUsage);
            });
          });
        };
      
        $scope.redraw_TotalSupply = function(date){
          FacilityTotalUsage.SDTotalSupply(date).then(function(total){
            FacilityTotalUsage.SDTpredictHour(date).then(function(predictHour){
            Dataparsing.SDDoutput(total,date,predictHour).then(function(totalSupply){
              $scope.$emit('totalSupply_datepick',totalSupply);
            });
          });
          });
        };

        $scope.redraw_ElecDemand = function(date){
          SDSite.SDDemandByuses(date).then(function(uses){ 
            FacilityTotalUsage.SDTotalUsage(date).then(function(total){         
            Dataparsing.usesParsing(uses,date,total).then(function(ElecDemand){
              $scope.$emit('ElecDemand_datepick',ElecDemand);
            });
          });
          });
        };
        $scope.redraw_ElecSupply = function(date){
          SDSite.SDSupplyByuses(date).then(function(supply){
            FacilityTotalUsage.SDTotalSupply(date).then(function(total){
            FacilityTotalUsage.SDTpredictHour(date).then(function(predictHour){
            Dataparsing.usesParsing_sup(supply,date,total,predictHour).then(function(ElecSupply){
              $scope.$emit('ElecSupply_datepick',ElecSupply);
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


