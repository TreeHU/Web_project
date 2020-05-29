/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

(function (){

  'use strict';

  //TODO this should be Users service
  angular.module('app.utils').factory('SDSite', ['$http','$q','dateUtils',
    function ($http,$q,dateUtils) {
      return {
                SDDemandByuses : function(date,next){
                var deferred = $q.defer();
                var parameter = new Object();
                date = dateUtils.yyyymmdd(date);
                parameter.date = date;
                $http.post('/api/SDDemandByuses',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
              SDSupplyByuses : function(date,next){
                var deferred = $q.defer();
                var parameter = new Object();
                date = dateUtils.yyyymmdd(date);
                parameter.date = date;
                $http.post('/api/SDSupplyByuses',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
            
            SDDemandByusesTwomonths : function(next){
              var deferred = $q.defer();
              $http.get('/api/SDDemandByusesTwomonths').then(function (result) {
                deferred.resolve(result.data);
              });
              return deferred.promise;
            },
                            
      };
    }
  ]);
})();





