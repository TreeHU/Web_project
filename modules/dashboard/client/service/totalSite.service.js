
'use strict';

//TODO this should be Users service
angular.module('app.totalsite').factory('dataFacility', ['$http','$q','dateUtils',
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
      sumofab: function (valueA,valuesB) {  
        var sumab = 0;
        sumab= valueA + valuesB; 
        return sumab;
      },
      eachData: function(rawusage,data,date){//raw데이터를 15분,30분,60분으로 분류 
        for(var i=0;i<rawusage.length;i++){
          var index=rawusage[i].mmIndex-1;
          if (rawusage[i].YYYYMMDDHH === dateUtils.yyyymmdd(date)) {
              if (data.valueDataQuaterHour[parseInt(index / 3)] === undefined) {
                  data.valueDataQuaterHour[parseInt(index / 3)] = 0;
              }
              data.valueDataQuaterHour[parseInt(index / 3)] +=rawusage[i].Value_5min;

              if (data.valueDataHalfHour[parseInt(index / 6)] === undefined) {
                  data.valueDataHalfHour[parseInt(index / 6)] = 0;
              }
              data.valueDataHalfHour[parseInt(index / 6)] += rawusage[i].Value_5min;

              if (data.valueDataHour[parseInt(index / 12)] === undefined) {
                  data.valueDataHour[parseInt(index / 12)] = 0;
              }
              data.valueDataHour[parseInt(index / 12)] += rawusage[i].Value_5min;
          }
      }  
      }

      


    };
  }
]);
