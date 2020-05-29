(function() {
    'use strict';

    angular
        .module('app.SiteSupplyAndDemand')
        .controller('SiteSupplyAndDemandController', SiteSupplyAndDemandController);

    SiteSupplyAndDemandController.$inject = ['$scope', 'ChartData', '$timeout', 'Colors','FacilityTotalUsage'];
    function SiteSupplyAndDemandController($scope, ChartData, $timeout, Colors, FacilityTotalUsage) {
        var vm = this;

        activate();

        ////////////////
        // $scope.$on('SdData',function(event,data){
        //     console.log(data);
        // })        

        function activate() {
            
            FacilityTotalUsage.usageBySDType().then(function (typeUsage) {
                //console.log(typeUsage);
                // $scope.usageByType= function(type){
                //     for(var i=0; typeUsage.length; i++){
                //         if(type == typeUsage[i].type){
                //             return (typeUsage[i].consumption).toFixed(3);
                //         }
                //     }
                // }
            });


        }
    }
})();