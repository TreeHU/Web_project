/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 (function () {
    'use strict';
  
    angular
      .module('app.utils')
      .service('chartUtils', chartUtils);
  
      chartUtils.$inject = [];
    function chartUtils() {
      return {
        getYxaisMaxValue: function (array) {
          var result = 0;
          for(var i=0;i<array.length;i++){
             if(result<array[i]) result = array[i];
          }
          return result;
        }
      };
    }
  })();
  