/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 (function() {
    'use strict';

    angular
        .module('app.utils')
        .service('customerBaseLineUtils', customerBaseLineUtils);

        customerBaseLineUtils.$inject = ['$http','$q'];
        function customerBaseLineUtils($http,$q) {
            return {
                getCustomerBaseLineMax4Per5: function (equipmentId,mode,optionSAS) {
                    // var CBL_MODE={QUATER:3,HALF:6,HOUR:12};
                    var parameterForUsage = new Object();
                    parameterForUsage.EquipmentId = equipmentId;
                    parameterForUsage.mode = mode;
                    var deferred = $q.defer();
                    $http.post('/api/cbl/max45',parameterForUsage).then(function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            };
        }
})();
