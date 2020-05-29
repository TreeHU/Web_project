/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 (function (){

    'use strict';
  
    //TODO this should be Users service
    angular.module('app.utils').factory('totalSite', ['$http','$q','dateUtils',
      function ($http,$q,dateUtils) {
        return {
                EachFacilityUsage : function(date,next){
                var deferred = $q.defer();
                var parameter = new Object();
                date = dateUtils.yyyymmdd(date);
                parameter.date = date;
                $http.post('/api/EachFacilityUsage',parameter).then(function (result) {
                deferred.resolve(result.data);
                });
                return deferred.promise;
                },
                EachFacilitySupply : function(date,next){
                  var deferred = $q.defer();
                  var parameter = new Object();
                  date = dateUtils.yyyymmdd(date);
                  parameter.date = date;
                  $http.post('/api/EachFacilitySupply',parameter).then(function (result) {
                  deferred.resolve(result.data);
                  });
                  return deferred.promise;
                },
                usageSelectedFacilityweek: function (facilityList,date) {
                  var deferred = $q.defer();
                  var parameter = new Object();
                  date = dateUtils.yyyymmdd(date);
                  var yesterday = dateUtils.PreviousDay_One(date);

                  parameter.facilityList = facilityList;
                  parameter.date = date;
                  parameter.yesterday = yesterday;
                  $http.post('/api/usageSelectedFacilityweek',parameter).then(function (result) {
                    deferred.resolve(result.data);
                  });
                  return deferred.promise;
                },
                supplySelectedFacility : function(facilityList,date){
                  var deferred = $q.defer();
                  var parameter = new Object();
                  date = dateUtils.yyyymmdd(date);
                  var yesterday = dateUtils.PreviousDay_One(date);

                  parameter.facilityList = facilityList;
                  parameter.date = date;
                  parameter.yesterday = yesterday;
                  $http.post('/api/supplySelectedFacility',parameter).then(function (result) {
                  deferred.resolve(result.data);
                  });
                  return deferred.promise;
                }
                              
        };
      }
    ]);
  })();
  
  
  
  
  
  