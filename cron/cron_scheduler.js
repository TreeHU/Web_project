'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    cron = require('node-cron'),
    mongoose = require('mongoose'),
    Usage = mongoose.model('value_5min'),
    Facility = mongoose.model('Facility'),
    dateUtils = require('./dateUtils'),
    CustomerBaseLine = mongoose.model('customerbaseline');
var maxMmindex = 288;
const sql = require('mssql');
const config = {
    user: 'sa',
    password: 'gksmlWkd587',
    server: "DESKTOP-OC1JFSB",
    database: 'CEMS-DR',
    port: '1433'
};

// 2018-02-18 원래는 메모리 DB를 도입해야하나 몽고디비로 처리하였음. 
//마지막데이터가 0시 10분까지 들어온다는 가정하에 실행
//10 0 * * 1-5
//“At 00:10 on every day-of-week from Monday through Friday.”

exports.cronTask = cron.schedule('10 0 * * 1-5', function () {
    CustomerBaseLine.remove({}).exec(function(err,doc){
        if(!err){
            console.log('이전 CBL 데이터 삭제 완료');
            init();
        }
        else{
            console.log(err);
        }
    });
}, false);

exports.getCron = function () {
    return this.cronTask;
};

exports.init = function () {
    //추가적으로 계산중 서버종료가 될경우를 고려하여야함
    CustomerBaseLine.find({}).exec(function (err, doc) {
        if (doc.length <= 0) {
            start();
        }
        //현재 78개 계산됨 일단 이렇게 하고 연산으로 갯수를 구하는 로직을 도입해야함
        //
        else if (doc.length>=78){
            console.log('정상CBL 보유');
        }
        else {
            console.log('데이터 갯수 이상');
            CustomerBaseLine.remove({}).exec(function(err,doc){
                if(!err){
                    console.log('이전 CBL 데이터 삭제 완료');
                    start();
                }
                else{
                    console.log(err);
                }
            });
        }
    });
};



function start(){
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


var saaday=[];
function calcCblData (modeAvg, valueArray, mode, recentTenDays,sensorId) {
    var array = [];
    //Step #2 #3 #4
    //최근 날짜부터 평균의 75%가 넘는지 확인하여 push, Array의 Length가 4개면 Break.
    for (var i = 0; i < maxMmindex / mode; i++) {
        array[i] = [];
        for (var j = 0; j < recentTenDays.length; j++) {

            if (valueArray[recentTenDays[j]][i] > modeAvg[i] * 0.75) {
                if (array[i].length < 4)
                    array[i].push(valueArray[recentTenDays[j]][i].toFixed(3));
                else break;
            }
        }
    }
    

    //Step #5
    //평균 계산후 리턴
    var cblValue = [];
    for (var k = 0; k < array.length; k++) {
        var sum = 0;
        for (var l = 0; l < array[k].length; l++) {
            sum += parseFloat(array[k][l]);
        }
        cblValue.push((sum / array[k].length).toFixed(3));
    }

    uploadMongodb(cblValue,mode,sensorId);
    
}

//산출된 CBL값 DB에 저장
function uploadMongodb(array, mode, equipmentId) {
    var object = new Object();
    var date = dateUtils.yyyymmdd(new Date());
    object.date= date;
    object.EquipmentId=equipmentId;
    object.value=array;
    object.mode=mode;
    var customerbaseline = new CustomerBaseLine(object);
    customerbaseline.save(function(err,doc){
        if(err){
            console.log(err); 
        }
    });
}

//Step #1
//1.시설별 전기소비량 DB에서 가져온뒤 mode(15분, 30분, 60분)별로 묶어줌
//2.mode별 평균 계산 후 modeAvg에 push
function getUsageData(EquipmentId, mode) {
    var startDate = new Date('2018-01-24');
    var recentTenDays = [];
    init(dateUtils.yyyymmdd(startDate), recentTenDays);
    console.log(recentTenDays);
    Usage.find({ 'EquipmentId': EquipmentId, 'mr_ymdhh': { $in: recentTenDays } }).sort([['mr_ymdhh', 1]]).sort([['mmIndex', 1]]).exec(function (err, doc) {
        if (err) {
            console.log(err);
        }
        //시간대별로 변환
        //이전날 288번과 병합이 필요함
        //mmIndex를 0부터 시작하므로써 병합완료
        var valueArray = [];
        for (var i = 0; i < doc.length; i++) {
            if (valueArray[doc[i].mr_ymdhh] === undefined) {
                valueArray[doc[i].mr_ymdhh] = [];
            }
            if (valueArray[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / mode)] === undefined) {
                valueArray[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / mode)] = 0;
            }
            valueArray[doc[i].mr_ymdhh][Math.floor((doc[i].mmIndex - 1) / mode)] += doc[i].Value_5min;
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
        calcCblData(modeAvg, valueArray, mode, recentTenDays,EquipmentId);
    });
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

//1. 최대참고일 기간의 평균계량값
//2. 비정상근무일 제외(75% 미만)
//3. 참고일 선정(감축일부터 최근 5일)
//4. 유사일 선정(4일)
//5. CBL 산출

exports.movingAvg=function(EquipmentId){
    var test = new Date('2018-02-01');
    var nowdate = dateUtils.yyyymmdd(test);
    var previousdate = dateUtils.PreviousDay_One(nowdate); //하루 전날 
    var nowIndex=280;
    var testquery;
    testquery=
        "(select mr_ymdhh, mmIndex, Value_5min from TB_DR_LP_DATA_5MIN where EquipmentId = '" + EquipmentId + "' and mr_ymdhh = '" 
        + previousdate+"'and mmIndex >= '277' and mmIndex <= '288') union(select mr_ymdhh, mmIndex, Value_5min from TB_DR_LP_DATA_5MIN where EquipmentId = '"
        +EquipmentId+"' and mr_ymdhh = '"+nowdate+"'and mmIndex <= '"+nowIndex+"') order by mr_ymdhh, mmIndex";
    console.log("now"+nowIndex);
    sql.close();
    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query(testquery, function (err, recordset) {
            console.log(testquery);
            if (err) console.log(err)
            var doc = [];
            doc=recordset.recordset;
            console.log("!!doc\n"+doc.length);
            var array = [];
            var order = doc.length - 4;
            var movingAvg=[]; //이동함수 평균값
            for(var k=nowIndex-1;k>=0;k--){
                array[k]=[];
                movingAvg[k]=[];
                var sum=0;
                for(var i=order;i>=0;i=i-3){
                    if(array[k].length<4){
                    array[k].push(doc[i].Value_5min);
                    sum=sum+doc[i].Value_5min;
                    }
                    if (array[k].length == 4) {
                        var avg=sum/4;
                        order = order - 1;
                        movingAvg[k].push(avg.toFixed(3));
                        break;
                    }
                }
            }
            console.log(movingAvg);
        })
    })
}
