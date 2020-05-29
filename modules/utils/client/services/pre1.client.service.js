/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 'use strict';



 angular.module('app.utils').factory('predict', ['$window',function ($window) {

    function pre1Call(arry){
        
        var pre = [];
        var result = [];
        result[0] = 0;

        arry.forEach(function(item,i){
            if(i >= 2){
                pre[i] = pre1(arry[i],arry[i-1],arry[i-2]);
            }else{
                pre[i] = pre1(arry[i],arry[i],arry[i]);
            }
        });
        
        pre.forEach(function(item,i){
            result[i+1] = pre[i];
        });

        return result;
    }
    //외사법
    //결과 18:15분 예측 데이터
    //y1-18:00, y2-17:45, y3-17:30 
    function pre1(y1,y2,y3){
        
        var x0 = 0;
        var x1 = 1;
        var x2 = 2;

        var a1 = (3*(0*y3 + 1*y2 + 2*y1)-sum([x0,x1,x2])*sum([y1,y2,y3])) / (3*(x0*x0 + x1*x1 + x2*x2) - (sum([x0,x1,x2]) * sum([x0,x1,x2])));
        var a0 = (sum([y1, y2, y3]) / 3) - (a1 * sum([x0, x1, x2]) / 3);

        var p = a0 + a1*3;

        return p;
    }

    function sum(arry){
        var result = 0.0;
        arry.forEach(function(item){
            result += item;
        });
        return result;
    }
    return {
        pre1Call : pre1Call

    }
   }
 ]);