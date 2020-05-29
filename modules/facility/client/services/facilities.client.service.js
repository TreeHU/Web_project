'use strict';

//TODO this should be Users service
angular.module('app.facility').factory('facilityInfo', ['$http','$q','dateUtils',
  function ($http,$q,dateUtils) {
    return {
      // getFacilityEId: function(next){
      //   var deferred = $q.defer();
      //   var parameter = new Object();
      //   parameter.EquipmentId = EquipmentId;
      //   // parameter.id = objectId;
      //   $http.post('/api/facility', parameter).then(function (result) {
      //     deferred.resolve(result.data[0]);
      //     // deferred.resolve(result.data);
      //   });
      //   return deferred.promise;
      // }
      // ,
      getFacilityInfo: function (equip_Id, next) {  
        var deferred = $q.defer();
        var parameter = new Object();
        parameter.equip_Id = equip_Id;
        $http.post('/api/facility', parameter).then(function (result) {
          deferred.resolve(result.data[0]);
          // deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      getFacilityInfo1: function (facil_Id, next) {
        var deferred = $q.defer();
        var parameter = new Object();
        parameter.facil_Id = facil_Id;
        $http.post('/api/facilityByfacil_Id', parameter).then(function (result) {
          deferred.resolve(result.data[0]);
          // deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      getFacilityUsageInfo: function (equip_Id){
        var deferred = $q.defer();
        var parameter = new Object();
        parameter.equip_Id = equip_Id;
        
        $http.post('/api/usagegetdata', parameter).then(function (result) {
          deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      getFacilityElecUsage: function (facilName,date) {
        var deferred = $q.defer();
        var parameter = new Object();
        date = dateUtils.yyyymmdd(date);
        parameter.facilName = facilName;
        parameter.date = date;
        $http.post('/api/usageGetElec5min', parameter).then(function (result) {
          deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      getFacilityElecSupply : function(facilName,date){
        var deferred = $q.defer();
        var parameter = new Object();
        date = dateUtils.yyyymmdd(date);
        parameter.facilName = facilName;
        parameter.date = date;
        $http.post('/api/supplyGetElec5min', parameter).then(function (result) {
          deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      supply60min_Today: function (facil_Id) {
        var deferred = $q.defer();
        var parameter = new Object();
        parameter.facil_Id = facil_Id;
        $http.post('/api/supply60min_Today', parameter).then(function (result) {
          deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      supply60min_Past: function (facil_Id, date) {
        var deferred = $q.defer();
        var parameter = new Object();
        parameter.facil_Id = facil_Id;
        parameter.date = date;
        $http.post('/api/supply60min_Past', parameter).then(function (result) {
          deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      getFacilityList : function(){
        var deferred = $q.defer();
        $http.get('/api/facilities').then(function (result) {
          deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      getSensorList : function(){
        var deferred = $q.defer();
        $http.get('/api/getSensorId').then(function (result) {
          deferred.resolve(result.data);
        });
        return deferred.promise;
      },
      getFacilityName : function(){
        var deferred = $q.defer();
        $http.get('/api/facilityName').then(function(result){
          deferred.resolve(result.data);
        });
        return deferred.promise;
      }
    }
  }
]);
