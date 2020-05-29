/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 'use strict';

 //TODO this should be Users service
 angular.module('app.utils').factory('datepick', ['$http','$q',
   function ($http,$q) {
     return {
        /*
            일별 조회
        */
       getDataByDay: function(EquipmentId,startDate,next){
         var deferred = $q.defer();
         var parameter = new Object();
         parameter.startDate = startDate;
         parameter.EquipmentId = EquipmentId;
         
         $http.post('/api/usageByDay', parameter).then(function (result) {
           deferred.resolve(result.data);
           // deferred.resolve(result.data);
         });
         return deferred.promise;
       }
       ,
       /*
        월별 조회
        해당 월 기준 총12개월 데이터 가져옴
        */
       getDataByMonth: function (EquipmentId, next) {  
         var deferred = $q.defer();
         var parameter = new Object();
         
         parameter.EquipmentId = EquipmentId;
         $http.post('/api/usageByMonth', parameter).then(function (result) {
           deferred.resolve(result.data);
         });
         return deferred.promise;
       }

     }
   }
 ]);