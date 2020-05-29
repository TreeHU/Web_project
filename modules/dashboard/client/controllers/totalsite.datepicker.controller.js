/**=========================================================
 * Module: demo-datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

 (function() {
  'use strict';

  angular
      .module('app.totalsite')
      .controller('TSDatepickerCtrl', TSDatepickerCtrl);

  TSDatepickerCtrl.$inject=['$scope', '$http', '$location', 'sensorlist','sessionstoarge','FacilityTotalUsage', 'totalSite','Dataparsing','facilityInfo'];
  function TSDatepickerCtrl($scope, $http, $location, sensorlist, sessionstoarge, FacilityTotalUsage, totalSite, Dataparsing, facilityInfo) {
      var vm = this;
      var facilityList;

      if($location.path().indexOf('v2')>0){
          facilityInfo.getSensorList().then(function(facilList){
              sensorlist.convertstring(facilList).then(function(result){
                  facilityList = result; 
              });
          });
      }else{
          facilityList = sessionstoarge.get('facilityList');
      }
    
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
          facilityInfo.getFacilityName().then(function(facilList){
            FacilityTotalUsage.usageSelectedFacilityraw(facilityList,date).then(function(rawusage){
              Dataparsing.total("Usage",rawusage,date,facilityList).then(function(demand){
                var Energy_Usage = new Object();
                Energy_Usage = demand;
                $scope.$emit('demand_datepick',Energy_Usage);
              });
            });
          });   
        };

        $scope.redraw_TotalSupply = function(date){
          facilityInfo.getFacilityName().then(function(facilList){
            FacilityTotalUsage.usageSelectedFacilitysupply(facilityList,date).then(function(rawsupply){
              Dataparsing.total("Supply",rawsupply,date,facilityList).then(function(supply){
                var Energy_Supply = new Object();
                Energy_Supply = supply;
                $scope.$emit('supply_datepick',Energy_Supply);
              });

            });
          });   
        };

        $scope.redraw_ElecDemand = function(date){
          facilityInfo.getFacilityName().then(function(facilList){
            totalSite.EachFacilityUsage(date).then(function(total){
              Dataparsing.eachFacilityParsing("Usage",facilList,total,date,facilityList).then(function(ElecDemand){
                var Elec_Usage = new Object();
                Elec_Usage = ElecDemand;
                $scope.$emit('ElecDemand_datepick',Elec_Usage);
              });
            });
          })          
        };
        $scope.redraw_ElecSupply = function(date){
          facilityInfo.getFacilityName().then(function(facilList){
            totalSite.EachFacilitySupply(date).then(function(total){
              Dataparsing.eachFacilityParsing("Supply",facilList,total,date,facilityList).then(function(ElecSupply){
                var Elec_Supply = new Object();
                Elec_Supply = ElecSupply;
                $scope.$emit('ElecSupply_datepick',Elec_Supply);
              });
            });
          })   
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


