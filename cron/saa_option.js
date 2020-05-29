'use strict';

/**
 * Module dependencies
 */
 
var mongoose = require('mongoose'),
    Usage = mongoose.model('value_5min'),
    Facility = mongoose.model('Facility'),
    dateUtils = require('./dateUtils'),
    UsageData = require('./cron_scheduler'),
    CustomerBaseLine = mongoose.model('customerbaseline');
var maxMmindex = 288;

var saa4Days = [];
exports.getSAAdays = function(){
    var CBL_MODE = { QUATER: 3, HALF: 6, HOUR: 12 };
    Facility.find({}, { EquipmentId: true, _id: false }).exec(function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            //테스트 코드 정상작동확인
            //getUsageData('Sensor1016102645', CBL_MODE.QUATER);
            for(var i=0;i<doc.length;i++){
                getUsageData(doc[i]._doc.EquipmentId[0],CBL_MODE.HOUR);
                getUsageData(doc[i]._doc.EquipmentId[0],CBL_MODE.HALF);
                getUsageData(doc[i]._doc.EquipmentId[0],CBL_MODE.QUATER);
            }
    
        }


    });

}

function getUsageData(EquipmentId,mode){
    var startDate = new Date();
    var recentTenDays = [];

    init(dateUtils.yyyymmdd(startDate), recentTenDays);
    Usage.find({ 'EquipmentId': EquipmentId, 'mr_ymdhh': { $in: recentTenDays } }).sort([['mr_ymdhh', 1]]).sort([['mmIndex', 1]]).exec(function (err, doc) {
        if (err) {
            console.log(err);
        }
        //시간대별로 변환
        //이전날 288번과 병합이 필요함
        //mmIndex를 0부터 시작하므로써 병합완료
        var valueArray = [];
        var valueDataHour = [];
        for (var i = 0; i < doc.length; i++) {
            if (valueArray[doc[i].mr_ymdhh] === undefined || valueDataHour[doc[i].mr_ymdhh] === undefined) {
                valueArray[doc[i].mr_ymdhh] = [];
                valueDataHour[doc[i].mr_ymdhh] = [];
            }
            if (valueArray[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / mode)] === undefined || valueDataHour[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / 12)] === undefined) {
                valueArray[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / mode)] = 0;
                valueDataHour[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / 12)] = 0;
            }
            valueArray[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / mode)] += doc[i].Value_5min;
            valueDataHour[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / 12)] += doc[i].Value_5min;
            
        }

        var modeAvg = [];
        //288=하루동안들어오는 mmindex
        for (var j = 0; j < maxMmindex / mode; j++) {
            var sum = 0;
            for (var k = 0; k < recentTenDays.length; k++) {
                sum += valueArray[recentTenDays[k]][j];
            }
            //데이터가 없을경우 NaN
            if (isNaN(sum / recentTenDays.length))
                modeAvg.push(0);
            else {
                modeAvg.push(sum / recentTenDays.length);
            }
        }
        
        calcAvgDays(modeAvg, valueArray, mode, recentTenDays);
        saa4daysUsage(saa4Days,valueDataHour,mode);
        
    });
}

// 유사일4일 조회 및 SAA 계산 
//1.감축시간대 4시간전 3시간동안의 같은시간대 사용량 평균
function saa4daysUsage(saa4Days,valueDataHour,mode){
    
    var startday = new Date(Date.now());
    var X=0; // X : 감축일 3시간 평균계량값
    var Y=0; // Y : 유사일의 3시간 평균계량값

    //3시간동안 시간대 리스트
    var sethourList = [ dateUtils.minusHours(startday,4),
                        dateUtils.minusHours(startday,3),
                        dateUtils.minusHours(startday,2)];
    
    //같은시간대 obj['2018-03-19':[1500,1655,...]]
    var timezone = {};
    for(var i=0; i<saa4Days.length; i++){
        Object.keys(valueDataHour).forEach(function(key){
            if(key == saa4Days[i]){
                timezone[key] = valueDataHour[key];
            }
        })
    }
    
    //3시간만 추출
    var saaobj = {};
    var array = [];
    // var array_X= 0;
    Object.keys(timezone).forEach(function(key){
        array = [];
        for(var j=0; j < sethourList.length; j++){
            array.push(timezone[key][sethourList[j]]);
            Y += timezone[key][sethourList[j]]; 
        }
        saaobj[key] = array;
        if(key == dateUtils.yyyymmdd(Date.now())){
            for(var k=0; k < sethourList.length; k++){
                X += timezone[key][sethourList[k]];
            }
        }
    })

    Y = Y/12;
    X = X/4;
    var saaOptionValue = X-Y;
    console.dir(saaOptionValue);
}

function calcAvgDays(modeAvg, valueArray, mode, recentTenDays){
    //1.유사일(date 형식으로)만 반환
    for(var i=0; i<maxMmindex / mode; i++){
        for(var j=0; j<recentTenDays.length; j++){
            if(valueArray[recentTenDays[j]][i]> modeAvg[i] * 0.75){
                if(saa4Days.length < 4){
                    saa4Days.push(recentTenDays[j]);
                }
                else{
                    break;
                }
            }
        }
    } 

    
}

//주말,공휴일제외 설정날짜부터 최대10일까지 요일 반환 - 재귀적으로 처리함 
function init(date, recentTenDays) {
    if (recentTenDays.length >= 10) {
        return;
    }
    if (!dateUtils.isLunarHoliday(date) && !dateUtils.isSolarHoliday(date) && !dateUtils.isWeekends(date)) {
        recentTenDays.push(date);
    }
    init(dateUtils.getYesterday(date), recentTenDays);
}


