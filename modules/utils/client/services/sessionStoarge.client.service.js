/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 'use strict';

//메인페이지에서 구글맵 체크한 센서들 session Stoarge 에 set ,get 하는 함수
//session stoarge 는 사용자가 윈도우를 닫거나 탭을 닫을때 제거됨.(영구적X)
 angular.module('app.utils').factory('sessionstoarge', ['$window','$sessionStorage',
   function ($window, $sessionStorage) {
     return {
        set : function(key,value){
            $sessionStorage.key = value;
        },
        get : function(key){
            return $sessionStorage.key;
        }
     }
   }
 ]);