/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 'use strict';

 //TODO this should be Users service
 angular.module('app.utils').factory('passingURL', ['$http','$q',
   function ($http,$q) {
    var data;
    return {   
        set : function(facilList){
            data = facilList;
        },
        get : function(){
            var deferred = $q.defer();
            deferred.resolve(data);
            return deferred.promise;
        }


        // getDataByDay: function(EquipmentId,startDate,next){
        //     var deferred = $q.defer();
        //     var parameter = new Object();
        //     parameter.startDate = startDate;
        //     parameter.EquipmentId = EquipmentId;
            
        //     $http.post('/api/usageByDay', parameter).then(function (result) {
        //       deferred.resolve(result.data);
        //       // deferred.resolve(result.data);
        //     });
        //     return deferred.promise;
        //   }
     }
   }
 ]);