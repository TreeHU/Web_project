'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var cron = require('./cron/cron_scheduler');
// var saa = require('./cron/saa_option');
var server = app.start(function(){
    
    // // //CBL값 이미 계산되었는지 체크함
     //cron.init();
    // // //이벤트 스케쥴링 등록
     //cron.cronTask.start();
    // saa.getSAAdays();
    //moving함수 임시위치로 cron에 만들어둠..
    // cron.movingAvg('Sensor0135192119'); 
    
    
});
