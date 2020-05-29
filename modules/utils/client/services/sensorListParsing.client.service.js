/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 'use strict';

//메인페이지에서 구글맵 체크한 센서들 session Stoarge 에 set ,get 하는 함수
//session stoarge 는 사용자가 윈도우를 닫거나 탭을 닫을때 제거됨.(영구적X)
 angular.module('app.utils').factory('sensorlist', ['$q',
   function ($q) {
     return {
         convertstring : function(data){
            var deferred = $q.defer();
            var single = '';

            data.forEach(function(value){
                single += "'" + value.equip_Id + "',";
            })
            single = single.slice(0, (single.length - 1));
            single = "(" + single + ")";
            deferred.resolve(single);
            return deferred.promise;
         }
     }
   }
 ]);