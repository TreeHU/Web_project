/**=========================================================
 * Module: chart.controller.js
 * Controller for ChartJs
 =========================================================*/

 (function() {
    'use strict';

    angular
        .module('app.sites')
        .controller('UsgController',UsgController);

    UsgController.$inject = ['$scope',  '$timeout', '$stateParams', '$http', 'dateUtils', 'Colors','facilityInfo'];

    function UsgController($scope, $timeout, $stateParams, $http, dateUtils, Colors,facilityInfo) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
         $scope.$on('SiteData', function (event, SiteData) {
            // console.log(facilityData.valueDataHour);
            var nowIndex = dateUtils.timeToIndex(Date.now());
             
            vm.barLabels = [];
             for (var i = 0; i <= parseInt(nowIndex / 12);i++){
                vm.barLabels.push(i);
            }
            // vm.barSeries = ['Series A'];
            vm.barData=[];
             for (var k = 0; k <= parseInt(nowIndex / 12);k++){
                vm.barData.push(SiteData.valueDataHour[k]);
            }
        });

        }
    }
})();