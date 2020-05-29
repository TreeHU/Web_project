/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

(function (){

  'use strict';

  //TODO this should be Users service
  angular.module('app.utils').factory('FacilityTotalUsage', ['$http','$q','dateUtils',
    function ($http,$q,dateUtils) {
      return {
              // getTotalUsage: function(next){
              //   var deferred = $q.defer();
              //   $http.get('/api/usageByALLFacility').then(function (result) {
              //     deferred.resolve(result.data);
              //     // deferred.resolve(result.data);
              //   });
              //   return deferred.promise;
              // },
              // getTotalUsageByDay: function(date,next){
              //   var d = new Date(date);
                
              //   var deferred = $q.defer();
              //   $http.post().then(function(result){
              //     deferred.resolve(result.data);
              //   });
              //   return deferred.promise;
              // },
              getSelectedUsage: function (facilityList,next) {
                var deferred = $q.defer();
                var parameter=new Object();
                parameter.facilityList=facilityList;
                $http.post('/api/usageSelectedFacility',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
              getSelectedEachType: function (facilityList,next) {
                var deferred = $q.defer();
                var parameter = new Object();
                parameter.facilityList = facilityList;
                $http.post('/api/usgSelectedEachType',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
              getTotalAVGforMon: function(next){
                var deferred = $q.defer();
                $http.get('/api/avgByALLFacility').then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;

              },
              // usageSelectedFacilityweek: function (facilityList,next) {
              //   var deferred = $q.defer();
              //   var parameter = new Object();
              //   parameter.facilityList = facilityList;
              //   $http.post('/api/usageSelectedFacilityweek',parameter).then(function (result) {
              //     deferred.resolve(result.data);
              //   });
              //   return deferred.promise;
              // },
              getElecAVG: function (facilName, next) {
                var deferred = $q.defer();
                var parameter = new Object();
                parameter.facilName = facilName;
                $http.post('/api/GetElecAVG', parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
              usageSelectedFacilityraw: function (facilityList,date,next) {
                var deferred = $q.defer();
                var parameter = new Object();
                parameter.facilityList = facilityList;
                date = dateUtils.yyyymmdd(date);
                parameter.date = date;
                $http.post('/api/usageSelectedFacilityraw',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              } ,
              usageSelectedFacilitysupply: function (facilityList,date,next) {
                var deferred = $q.defer();
                var parameter = new Object();
                parameter.facilityList = facilityList;
                date = dateUtils.yyyymmdd(date);
                parameter.date = date;
                $http.post('/api/usageSelectedFacilitysupply',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
              SelectedFacilTwodays: function (facilityList,next) {
                var deferred = $q.defer();
                var parameter = new Object();
                parameter.facilityList = facilityList;
                $http.post('/api/SelectedFacilTwodays',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              } ,
              SelectedPreMonth: function (facilityList,next) {
                var deferred = $q.defer();
                var parameter = new Object();
                parameter.facilityList = facilityList;
                $http.post('/api/SelectedPreMonth',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              } ,
              SelectedthisMonthSupply: function (facilityList,next) {
                var deferred = $q.defer();
                var parameter = new Object();
                parameter.facilityList = facilityList;
                $http.post('/api/SelectedthisMonthSupply',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              } , 
              usageBySDType : function (next) {
                var deferred = $q.defer();
                $http.get('/api/SDByType').then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
              SDTotalUsage : function(date,next){
                var deferred = $q.defer();
                var parameter = new Object();
                date = dateUtils.yyyymmdd(date);
                parameter.date = date;
                $http.post('/api/SDTotalUsage',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
              SDTpredictHour : function(date,next){
                var deferred = $q.defer();
                var parameter = new Object();
                date = dateUtils.yyyymmdd(date);
                parameter.date = date;
                $http.post('/api/SDTpredictHour',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              },
              SDTotalSupply : function(date,next){
                var deferred = $q.defer();
                var parameter = new Object();
                date = dateUtils.yyyymmdd(date);
                parameter.date = date;
                $http.post('/api/SDTotalSupply',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              }, 
              
              DeepusageGetdata : function(data,next){
                var deferred = $q.defer();
                var parameter = new Object();
                date = "2020-05-20";
                parameter.date = date;
                $http.post('/api/DeepusageGetdata',parameter).then(function (result) {
                  deferred.resolve(result.data);
                });
                return deferred.promise;
              }
      };
    }
  ]);
})();





