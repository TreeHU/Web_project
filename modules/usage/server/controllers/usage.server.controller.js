'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  async = require('async'),
  Usage = mongoose.model('value_5min'),
  dateUtils = require('../util/dateUtils'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const sql = require('mssql');
const poolPromise = require('../../../mssqlconfig/db.js');

/**
 * User middleware  
 * 
 */
exports.usageByID =async function (req, res, next) {
  var id = req.body.EquipmentId;

  Usage.findById(id).exec(function (err, usage) {
    if (err) {
      return next(err);
    } else if (!usage) {
      return next(new Error('Failed to load usage ' + id));
    }
    res.send(usage.EquipmentId);
  });
};

/* 
  #2 equipmentID 넣으면  */
exports.usageByEquipmentID =async function (req, res, next) {
  var EquipmentId = req.body.EquipmentId;

  Usage.find({ 'EquipmentId': EquipmentId }, function (err, usages) {
    if (err) {
      return next(err);
    } else if (!usages) {
      return next(new Error('Failed to load usage' + EquipmentId));
    }
    res.json(usages);
  });
};

// exports.usageGetdata = function (req, res, next) {

//   var EquipmentId = req.body.EquipmentId;
//   var now = new Date();
//   var oneWeekBefore = new Date();
//   oneWeekBefore.setDate(now.getDate() - 7);
//   var start = dateUtils.yyyymmdd(now);
//   var end = dateUtils.yyyymmdd(oneWeekBefore);

//   Usage.find({ 'EquipmentId': EquipmentId, 'mr_ymdhh': { $gt: end, $lte: start } }).sort([['mr_ymdhh', 1]]).sort([['mmIndex', 1]]).exec(function (err, usages) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     }
//     res.json(usages);
//   });
// }

//deep data test
exports.DeepusageGetdata =async function (req, res, next) {

  var equip_Id = "TD0000010010001";
  var now = new Date();
  var oneWeekBefore = new Date();
  oneWeekBefore.setDate(now.getDate() - 7);
  var start = dateUtils.yyyymmdd(now);
  var end = dateUtils.yyyymmdd(oneWeekBefore);
  var query;
  query = "select equip_Id,YYYYMMDDHH,mmIndex,Value_5min from dbo.Electricity_consumption_15min_deep" ;
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}


exports.usageGetdata =async function (req, res, next) {

  var equip_Id = req.body.equip_Id;
  var now = new Date();
  var oneWeekBefore = new Date();
  oneWeekBefore.setDate(now.getDate() - 7);
  var start = dateUtils.yyyymmdd(now);
  var end = dateUtils.yyyymmdd(oneWeekBefore);
  var query;
  query = "select equip_Id,YYYYMMDDHH,mmIndex,Value_5min from dbo.Electricity_consumption_5min where " + "equip_Id='" + equip_Id + "' and YYYYMMDDHH<='" + start + "' and YYYYMMDDHH>='" + end + "' ORDER BY YYYYMMDDHH,mmIndex";
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}
//사이트별 현황 에너지 수요
exports.usageGetElec5min = async function (req, res, next) {
  var facilName = req.body.facilName;
  var date = req.body.date;
  // var query;
  
  var query_5min = "select YYYYMMDDHH,mmIndex,sum(Value_5min) as value from dbo.Electricity_consumption_5min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and " +
    "facilName = '" + facilName + "' and YYYYMMDDHH ='" + date +"' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
  var query_15min = "select YYYYMMDDHH,mmIndex,sum(Value_15min) as value from dbo.Electricity_consumption_15min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and " +
    "facilName = '" + facilName + "' and YYYYMMDDHH ='" + date + "' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
  var query_30min = "select YYYYMMDDHH,mmIndex,sum(Value_30min) as value from dbo.Electricity_consumption_30min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and " +
    "facilName = '" + facilName + "' and YYYYMMDDHH ='" + date + "' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
  var query_60min = "select YYYYMMDDHH,mmIndex,sum(Value_60min) as value from dbo.Electricity_consumption_60min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and " +
    "facilName = '" + facilName + "' and YYYYMMDDHH ='" + date + "' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
  try {
    const pool = await poolPromise;
    const result_5min = await pool.request().query(query_5min);
    const result_15min = await pool.request().query(query_15min);
    const result_30min = await pool.request().query(query_30min);
    const result_60min = await pool.request().query(query_60min);
    var arr = new Object();
    arr._5min = result_5min.recordset;
    arr._15min = result_15min.recordset;
    arr._30min = result_30min.recordset;
    arr._60min = result_60min.recordset;
    res.json(arr);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
}
//사이트별 현황 에너지 공급
exports.supplyGetElec5min = async function (req, res, next) {
  var facilName = req.body.facilName;
  var date = req.body.date;
  // var query = "select YYYYMMDDHH,mmIndex,sum(Value_5min) as Value_5min from dbo.Electricity_output_5min as EO,Facility,Sensor "+
  // "where Sensor.equip_Id = EO.equip_Id and Facility.facil_Id = sensor.facil_Id and "+
  // "facilName = '" + facilName + "' and YYYYMMDDHH ='"+ date +"' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
  var query_5min = "select YYYYMMDDHH,mmIndex,sum(Value_5min) as value from dbo.Electricity_output_5min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and " +
    "facilName = '" + facilName + "' and YYYYMMDDHH ='" + date + "' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
  var query_15min = "select YYYYMMDDHH,mmIndex,sum(Value_15min) as value from dbo.Electricity_output_15min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and " +
    "facilName = '" + facilName + "' and YYYYMMDDHH ='" + date + "' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
  var query_30min = "select YYYYMMDDHH,mmIndex,sum(Value_30min) as value from dbo.Electricity_output_30min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and " +
    "facilName = '" + facilName + "' and YYYYMMDDHH ='" + date + "' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
  var query_60min = "select YYYYMMDDHH,mmIndex,sum(Value_60min) as value from dbo.Electricity_output_60min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and " +
    "facilName = '" + facilName + "' and YYYYMMDDHH ='" + date + "' group by YYYYMMDDHH, mmIndex ORDER BY YYYYMMDDHH, mmIndex;";
    try {
      const pool = await poolPromise;
      const result_5min = await pool.request().query(query_5min);
      const result_15min = await pool.request().query(query_15min);
      const result_30min = await pool.request().query(query_30min);
      const result_60min = await pool.request().query(query_60min);
      var arr = new Object();
      arr._5min = result_5min.recordset;
      arr._15min = result_15min.recordset;
      arr._30min = result_30min.recordset;
      arr._60min = result_60min.recordset;
      res.json(arr);
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
}

//사이트별 페이지 60분공급 금일 예측값
exports.supply60min_Today = async function (req, res, next) {

  var facil_Id = req.body.facil_Id;
  var query;
  query = "select productAmount from dbo.predictionInfo where facil_Id="+ facil_Id+" order by hour;";
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr = [];
    arr = result.recordset;
    res.json(arr);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }

}

//사이트별 페이지 60분공급 오늘이전 예측값
exports.supply60min_Past = async function (req, res, next) {

  var facil_Id = req.body.facil_Id;
  var date = req.body.date;
  date=dateUtils.yyyymmdd(date);
  var query;
  query = "select * from dbo.predictionArchive where facil_Id="+facil_Id+" and date='"+date+"' order by hour;";
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr = [];
    arr = result.recordset;
    res.json(arr);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }

}

exports.GetElecAVG = async function (req, res, next) { //시설별 상세페이지 첫번째 박스

  var facilName = req.body.facilName;
  var d = new Date();
  var preMon= dateUtils.preMonth(d);
  var preYear= dateUtils.preYear(d);
  var query1, query2, query3, query4;
  query1 = "select sum(Value_5min)/"+preMon.lastDay+" as MonAVG from dbo.Electricity_output_5min as EO,Facility,Sensor "+
  "where Sensor.equip_Id = EO.equip_Id and Facility.facil_Id = sensor.facil_Id"+
    " and facilName = '" + facilName + "' and YYYYMMDDHH like '" + preMon.date + "';";
  query2 = "select sum(Value_5min) / 12 as YearAVG from dbo.Electricity_output_5min as EO, Facility, Sensor "+
  "where Sensor.equip_Id = EO.equip_Id and Facility.facil_Id = sensor.facil_Id "+
    "and facilName = '" + facilName + "' and YYYYMMDDHH like '" + preYear +"';";
  query3 = "select sum(Value_5min)/" + preMon.lastDay +" as MonAVG from dbo.Electricity_consumption_5min as EC,Facility,Sensor "+
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id "+
    "and facilName = '" + facilName + "' and YYYYMMDDHH like '" + preMon.date + "';";
  query4 = "select sum(Value_5min)/12 as YearAVG from dbo.Electricity_consumption_5min as EC,Facility,Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id " +
    "and facilName = '" + facilName + "' and YYYYMMDDHH like '" + preYear + "';";
  
  try {
    const pool = await poolPromise;
    const result1 = await pool.request().query(query1);
    const result2 = await pool.request().query(query2);
    const result3 = await pool.request().query(query3);
    const result4 = await pool.request().query(query4);
    var arr = new Object();
    arr.EO_MonAVG = result1.recordset;
    arr.EO_YearAVG = result2.recordset;
    arr.EC_MonAVG = result3.recordset;
    arr.EC_YearAVG = result4.recordset;
    res.json(arr);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
}

exports.usageByDay =async function(req,res,next){
  var equip_Id = req.body.equip_Id;
  var startDate = req.body.startDate;
  var d = new Date(req.body.startDate);
  d.setMonth(d.getMonth()-1);
  var endDate = dateUtils.yyyymmdd(d);
  var query = "select YYYYMMDDHH, SUM(Value_5min) as SUM_Value5min from dbo.Electricity_consumption_5min where " + 
  "equip_Id='"  + equip_Id + "' and YYYYMMDDHH>='" + endDate + "' and YYYYMMDDHH<='" + startDate + "' group by YYYYMMDDHH";
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}

exports.usageByMonth =async function(req,res,next){
  var equip_Id = req.body.equip_Id;
  var startDate = new Date();//금일기준 일년전 그 달의 1일
  var endDate = new Date();//현재시간
  
  startDate.setFullYear(startDate.getFullYear()-1);
  startDate.setMonth(startDate.getMonth());
  startDate.setDate(1);
  startDate = dateUtils.yyyymmdd(startDate);
  endDate = dateUtils.yyyymmdd(endDate);

  var query = "select YYYYMMDDHH, SUM(Value_5min) as SUM_Value5min from dbo.Electricity_consumption_5min where " +
  "equip_Id='"  + equip_Id + "' and YYYYMMDDHH>='" + startDate + "' and YYYYMMDDHH<='" + endDate + "' group by YYYYMMDDHH";
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}


//모든 시설 시간대별 총합
exports.usageByALLFacility =async function(req,res,next){

  var d = new Date();
  var now = dateUtils.yyyymmdd(d);

  var query = "select mmIndex,SUM(dbo.Electricity_consumption_5min.Value_5min) as Facility_Total" +
  " from dbo.Electricity_consumption_5min, dbo.Facility, dbo.Sensor" +
  " where (dbo.Facility.facil_Id = dbo.Sensor.facil_Id) and dbo.Electricity_consumption_5min.YYYYMMDDHH= '" +  now + "' group by mmIndex order by mmIndex";

  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
  
}

exports.avgByALLFacility = async function (req, res, next) {

  var d = new Date();
  var preMon = dateUtils.preMonth(d);
  var previousDay = dateUtils.PreviousDay_One(d);
  var query1 = "select sum(Value_5min)/" + preMon.lastDay + " as EC_MonAVG " +
    "from dbo.Electricity_consumption_5min as EC, Facility, Sensor " +
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and YYYYMMDDHH like '" + preMon.date + "';"; 
  var query2 = "select sum(Value_5min)/" + preMon.lastDay +" as EO_MonAVG "+ 
  "from dbo.Electricity_output_5min as EO, Facility, Sensor "+
  "where Sensor.equip_Id = EO.equip_Id and Facility.facil_Id = sensor.facil_Id and YYYYMMDDHH like '"+preMon.date+"';"; 
  var query3 = "select sum(Value_5min)/count(distinct EC.equip_Id) as EC_DayAVG "+
    "from dbo.Electricity_consumption_5min as EC, Facility, Sensor "+
    "where Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = sensor.facil_Id and YYYYMMDDHH='" + previousDay +"';";
  var query4 = "select sum(Value_5min)/count(distinct EO.equip_Id) as EO_DayAVG " +
    "from dbo.Electricity_output_5min as EO, Facility, Sensor " +
    "where Sensor.equip_Id = EO.equip_Id and Facility.facil_Id = sensor.facil_Id and YYYYMMDDHH='" + previousDay + "';";
  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query1);
    const result2 = await pool.request().query(query2);
    const result3 = await pool.request().query(query3);
    const result4 = await pool.request().query(query4);
    var arr = new Object();
    arr.EC_MonAVG = result1.recordset;
    arr.EO_MonAVG = result2.recordset;
    arr.EC_DayAVG = result3.recordset;
    arr.EO_DayAVG = result4.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

exports.avgByEachFacility =async function (req, res, next) {//각 용도별 시설의 날짜별 한달평균(한달,하루평균 포함)

  var d = new Date('2018-07-16');
  var previousDay = dateUtils.PreviousDay_One(d);
  var previousMonth = dateUtils.PreviousMonth(previousDay);

  var query = "select Facility.type,YYYYMMDDHH, SUM(Electricity_consumption_5min.Value_5min)/T.TypeCount as total_Avg from dbo.Sensor,dbo.Electricity_consumption_5min,dbo.Facility,(select type,count(type) from Facility group by type ) as T(Ttype,TypeCount) where (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=Electricity_consumption_5min.equip_Id) and (dbo.Facility.type=T.Ttype) and YYYYMMDDHH<='" + previousDay + "' and YYYYMMDDHH>='"+previousMonth+"' group by YYYYMMDDHH,dbo.Facility.type,T.TypeCount order by type,YYYYMMDDHH ;" 
  // "select dbo.Facility.type,mr_ymdhh, SUM(dbo.TB_DR_LP_DATA_5MIN.Value_5min)/T.TypeCount as total_Avg from dbo.TB_DR_LP_DATA_5MIN,dbo.Facility,(select type,count(type) from Facility group by type ) as T(Ttype,TypeCount) where (dbo.Facility.EquipmentId=dbo.TB_DR_LP_DATA_5MIN.EquipmentId) and (dbo.Facility.type=T.Ttype) and mr_ymdhh<='" + previousDay + "' and mr_ymdhh>='" + previousMonth + "' group by mr_ymdhh,dbo.Facility.type,T.TypeCount order by type,mr_ymdhh ;"
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

exports.usageSelectedFacility = async function (req, res, next) {

  var d = new Date();
  var now = dateUtils.yyyymmdd(d);
  var facilityList = req.body.facilityList;
  var query = "select t1.facilName,sum_EC,sum_EO from "+
  "(select facilName, sum(EC.Value_5min) as sum_EC from Electricity_consumption_5min as EC, Sensor, Facility where (Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = Sensor.facil_Id and EC.YYYYMMDDHH = '"+now
  +"' and EC.equip_Id in "+facilityList+") group by facilName) as t1 left outer join "+
    "(select facilName, sum(EO.Value_5min) as sum_EO from Electricity_output_5min as EO, Sensor, Facility where (Sensor.equip_Id = EO.equip_Id and Facility.facil_Id = Sensor.facil_Id and EO.YYYYMMDDHH = '"+ now 
    +"' and EO.equip_Id in "+facilityList+") group by facilName)as t2 on t1.facilName = t2.facilName;"
  // var query = "select t1.facil_Id,sum_EC,sum_EO from " +
  //   "(select facility.facil_Id, sum(EC.Value_5min) as sum_EC from Electricity_consumption_5min as EC, Sensor, Facility where (Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = Sensor.facil_Id and EC.YYYYMMDDHH = '" + now
  //   + "' and EC.equip_Id in " + facilityList + ") group by facility.facil_Id) as t1 left outer join " +
  //   "(select facility.facil_Id, sum(EO.Value_5min) as sum_EO from Electricity_output_5min as EO, Sensor, Facility where (Sensor.equip_Id = EO.equip_Id and Facility.facil_Id = Sensor.facil_Id and EO.YYYYMMDDHH = '" + now
  //   + "' and EO.equip_Id in " + facilityList + ") group by facility.facil_Id)as t2 on t1.facil_Id = t2.facil_Id;"
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

exports.usgSelectedEachType = async function (req, res, next) {//선택된 전체 시설의 소비량,,
  var d = new Date();
  var now = dateUtils.yyyymmdd(d);
  var facilityList=req.body.facilityList;
  var query = "select t1.type,sum_EC,sum_EO from " +
    "(select type, sum(EC.Value_5min) as sum_EC from Electricity_consumption_5min as EC, Sensor, Facility where (Sensor.equip_Id = EC.equip_Id and Facility.facil_Id = Sensor.facil_Id and EC.YYYYMMDDHH = '" + now
    + "' and EC.equip_Id in " + facilityList + ") group by type) as t1 left outer join " +
    "(select type, sum(EO.Value_5min) as sum_EO from Electricity_output_5min as EO, Sensor, Facility where (Sensor.equip_Id = EO.equip_Id and Facility.facil_Id = Sensor.facil_Id and EO.YYYYMMDDHH = '" + now
    + "' and EO.equip_Id in " + facilityList + ") group by type)as t2 on t1.type = t2.type;"
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}
//금일,어제 사용량
exports.usageSelectedFacilityweek = async function (req, res, next) {
  var date = req.body.date;
  var yesterday = req.body.yesterday;
  var facilityList = req.body.facilityList;
  var query="select YYYYMMDDHH,sum(Value_5min) as value from Electricity_consumption_5min "+
  "where YYYYMMDDHH<='"+date+"'and YYYYMMDDHH>='"+yesterday+"' and equip_Id in "+facilityList+
  " GROUP BY YYYYMMDDHH";
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}
//금일,어제 생산량
exports.supplySelectedFacility = async function (req, res, next) {
  var date = req.body.date;
  var yesterday = req.body.yesterday;
  var facilityList = req.body.facilityList;
  var query="select YYYYMMDDHH,sum(Value_5min) as value from Electricity_output_5min "+
  "where YYYYMMDDHH<='"+date+"'and YYYYMMDDHH>='"+yesterday+"' and equip_Id in "+facilityList+
  " GROUP BY YYYYMMDDHH";
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
} 

exports.usageSelectedFacilityraw = async function (req, res, next) {
  var date = req.body.date;
  var facilityList = req.body.facilityList;

  var query_5min = "select EC5.YYYYMMDDHH, EC5.mmIndex, SUM(EC5.Value_5min) as value "+ 
  "from Electricity_consumption_5min as EC5, Facility, Sensor "+
  "where EC5.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EC5.equip_Id) "+
  "and EC5.equip_Id in "+facilityList+
  "group by EC5.YYYYMMDDHH,EC5.mmIndex "+
  "order by EC5.mmIndex;"
  var query_15min = "select EC15.YYYYMMDDHH, EC15.mmIndex, SUM(EC15.Value_15min) as value "+ 
  "from Electricity_consumption_15min as EC15, Facility, Sensor "+
  "where EC15.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EC15.equip_Id) "+
  "and EC15.equip_Id in "+facilityList+
  "group by EC15.YYYYMMDDHH,EC15.mmIndex "+
  "order by EC15.mmIndex;"
  var query_30min = "select EC30.YYYYMMDDHH, EC30.mmIndex, SUM(EC30.Value_30min) as value "+ 
  "from Electricity_consumption_30min as EC30, Facility, Sensor "+
  "where EC30.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EC30.equip_Id) "+
  "and EC30.equip_Id in "+facilityList+
  "group by EC30.YYYYMMDDHH,EC30.mmIndex "+
  "order by EC30.mmIndex;"
  var query_60min = "select EC60.YYYYMMDDHH, EC60.mmIndex, SUM(EC60.Value_60min) as value "+ 
  "from Electricity_consumption_60min as EC60, Facility, Sensor "+
  "where EC60.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EC60.equip_Id) "+
  "and EC60.equip_Id in "+facilityList+
  "group by EC60.YYYYMMDDHH,EC60.mmIndex "+
  "order by EC60.mmIndex;"
  var query_1day = "select EC1day.YYYYMMDDHH, SUM(EC1day.Value_1day) as value "+ 
  "from Electricity_consumption_day as EC1day, Facility, Sensor "+
  "where EC1day.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EC1day.equip_Id) "+
  "and EC1day.equip_Id in "+facilityList+
  "group by EC1day.YYYYMMDDHH;"

  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query_5min);
    const result2 = await pool.request().query(query_15min);
    const result3 = await pool.request().query(query_30min);
    const result4 = await pool.request().query(query_60min);
    const result5 = await pool.request().query(query_1day);
    var arr = new Object();
    arr.value_5min = result1.recordset;
    arr.value_15min = result2.recordset;
    arr.value_30min = result3.recordset;
    arr.value_60min = result4.recordset;
    arr.value_1day = result5.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

//전체 사이트 전력에너지 공급 
exports.usageSelectedFacilitysupply = async function (req, res, next) {
  var date = req.body.date;
  var facilityList = req.body.facilityList;

  var query_5min = "select EO5.YYYYMMDDHH, EO5.mmIndex, SUM(EO5.Value_5min) as value "+ 
  "from Electricity_output_5min as EO5, Facility, Sensor "+
  "where EO5.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EO5.equip_Id) "+
  "and EO5.equip_Id in "+facilityList+
  "group by EO5.YYYYMMDDHH,EO5.mmIndex "+
  "order by EO5.mmIndex;"
  var query_15min = "select EO15.YYYYMMDDHH, EO15.mmIndex, SUM(EO15.Value_15min) as value "+ 
  "from Electricity_output_15min as EO15, Facility, Sensor "+
  "where EO15.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EO15.equip_Id) "+
  "and EO15.equip_Id in "+facilityList+
  "group by EO15.YYYYMMDDHH,EO15.mmIndex "+
  "order by EO15.mmIndex;"
  var query_30min = "select EO30.YYYYMMDDHH, EO30.mmIndex, SUM(EO30.Value_30min) as value "+ 
  "from Electricity_output_30min as EO30, Facility, Sensor "+
  "where EO30.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EO30.equip_Id) "+
  "and EO30.equip_Id in "+facilityList+
  "group by EO30.YYYYMMDDHH,EO30.mmIndex "+
  "order by EO30.mmIndex;"
  var query_60min = "select EO60.YYYYMMDDHH, EO60.mmIndex, SUM(EO60.Value_60min) as value "+ 
  "from Electricity_output_60min as EO60, Facility, Sensor "+
  "where EO60.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EO60.equip_Id) "+
  "and EO60.equip_Id in "+facilityList+
  "group by EO60.YYYYMMDDHH,EO60.mmIndex "+
  "order by EO60.mmIndex;"
  var query_1day = "select EO1day.YYYYMMDDHH, SUM(EO1day.Value_1day) as value "+ 
  "from Electricity_output_day as EO1day, Facility, Sensor "+
  "where EO1day.YYYYMMDDHH='"+date+"' and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=EO1day.equip_Id) "+
  "and EO1day.equip_Id in "+facilityList+
  "group by EO1day.YYYYMMDDHH;"

  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query_5min);
    const result2 = await pool.request().query(query_15min);
    const result3 = await pool.request().query(query_30min);
    const result4 = await pool.request().query(query_60min);
    const result5 = await pool.request().query(query_1day);
    var arr = new Object();
    arr.value_5min = result1.recordset;
    arr.value_15min = result2.recordset;
    arr.value_30min = result3.recordset;
    arr.value_60min = result4.recordset;
    arr.value_1day = result5.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

//DOD이용 
//메인페이지에서 선택된 시설 전력 사용량 -  이번달 1일부터 오늘까지 데이터 가져오기 
exports.SelectedFacilTwodays= async function (req, res, next) {

  var test3= new Date();
  var now = dateUtils.yyyymmdd(test3);
  var facilityList = req.body.facilityList;
  //하루전 
  var onedaybefore = new Date(test3);
  onedaybefore.setDate(test3.getDate() - 1);
  var start = dateUtils.PreviousMonthfirstday(test3)
  var end = dateUtils.yyyymmdd(test3);
  //var query="select Facility.facilName,Electricity_consumption_5min.Value_5min,mmIndex,YYYYMMDDHH,NowDate from Sensor,Electricity_consumption_5min,Facility where  YYYYMMDDHH<='" + end + "' and YYYYMMDDHH>='" + start + "'  and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=Electricity_consumption_5min.equip_Id) and Electricity_consumption_5min.equip_Id in "+facilityList+" order by mmIndex"
  var query="select Facility.facilName,Electricity_consumption_5min.Value_5min,mmIndex,YYYYMMDDHH,NowDate from Sensor,Electricity_consumption_5min,Facility where  YYYYMMDDHH<='" + end + "' and YYYYMMDDHH>='" + start + "'  and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=Electricity_consumption_5min.equip_Id) and Electricity_consumption_5min.equip_Id in "+facilityList+" order by YYYYMMDDHH"

  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}
//저번달 1일부터 저번달의 오늘 날짜 까지 
exports.SelectedPreMonth= async function (req, res, next) {

  var test3= new Date();
  var now = dateUtils.yyyymmdd(test3);
  var facilityList = req.body.facilityList;
  //하루전 
  var onedaybefore = new Date(test3);
  onedaybefore.setDate(test3.getDate() - 1);
  var start = dateUtils.PreviousMonthfirstday(now);
  //var start = dateUtils.yyyymmdd(onedaybefore);
  //var end = dateUtils.yyyymmdd(test3);
  var end = dateUtils.PreviousMonth(now);

  //var query="select Facility.facilName,Electricity_consumption_5min.Value_5min,mmIndex,YYYYMMDDHH,NowDate from Sensor,Electricity_consumption_5min,Facility where  YYYYMMDDHH<='" + end + "' and YYYYMMDDHH>='" + start + "'  and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=Electricity_consumption_5min.equip_Id) and Electricity_consumption_5min.equip_Id in "+facilityList+" order by mmIndex"
  var query="select Facility.facilName,Electricity_consumption_5min.Value_5min,mmIndex,YYYYMMDDHH,NowDate from Sensor,Electricity_consumption_5min,Facility where  YYYYMMDDHH<='" + end + "' and YYYYMMDDHH>='" + start + "'  and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=Electricity_consumption_5min.equip_Id) and Electricity_consumption_5min.equip_Id in "+facilityList+" order by YYYYMMDDHH"

  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

exports.SelectedthisMonthSupply = async function (req, res, next) {
  var test3= new Date();
  var now = dateUtils.yyyymmdd(test3);
  var facilityList = req.body.facilityList;
  var start = dateUtils.PreviousMonthfirstday(test3);
  var end = dateUtils.yyyymmdd(test3);
  var query="select Facility.facilName,Electricity_output_5min.Value_5min,mmIndex,YYYYMMDDHH,NowDate from Sensor,Electricity_output_5min,Facility where YYYYMMDDHH<='" + end + "' and YYYYMMDDHH>='" + start + "'and (dbo.Facility.facil_Id=Sensor.facil_Id) and (Sensor.equip_Id=Electricity_output_5min.equip_Id) and Electricity_output_5min.equip_Id in "+facilityList+" order by YYYYMMDDHH"
  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

/*
전체사이트 페이지 사용, 금일 데이터 모든 시설 사용량 시설별, 인덱스별로 가져옴
 */
exports.EachFacilityUsage = async function (req, res, next) {
  var date = req.body.date;

  var query_5min = "select EC5.mmIndex, EC5.YYYYMMDDHH,Facility.facilName, SUM(EC5.Value_5min) as value "+
  "from Facility,Sensor,Electricity_consumption_5min as EC5 "+
  "where EC5.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EC5.equip_Id "+
  "group by Facility.facilName, EC5.mmIndex,EC5.YYYYMMDDHH "+
  "order by Facility.facilName asc, EC5.mmIndex asc;"

  var query_15min = "select EC15.mmIndex, EC15.YYYYMMDDHH,Facility.facilName, SUM(EC15.Value_15min) as value "+
  "from Facility,Sensor,Electricity_consumption_15min as EC15 "+
  "where EC15.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EC15.equip_Id "+
  "group by Facility.facilName, EC15.mmIndex,EC15.YYYYMMDDHH "+
  "order by Facility.facilName asc, EC15.mmIndex asc;"

  var query_30min = "select EC30.mmIndex, EC30.YYYYMMDDHH,Facility.facilName, SUM(EC30.Value_30min) as value "+
  "from Facility,Sensor,Electricity_consumption_30min as EC30 "+
  "where EC30.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EC30.equip_Id "+
  "group by Facility.facilName, EC30.mmIndex,EC30.YYYYMMDDHH "+
  "order by Facility.facilName asc, EC30.mmIndex asc;"

  var query_60min = "select EC60.mmIndex, EC60.YYYYMMDDHH,Facility.facilName, SUM(EC60.Value_60min) as value "+
  "from Facility,Sensor,Electricity_consumption_60min as EC60 "+
  "where EC60.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EC60.equip_Id "+
  "group by Facility.facilName, EC60.mmIndex,EC60.YYYYMMDDHH "+
  "order by Facility.facilName asc, EC60.mmIndex asc;"

  var query_1day = "select EC1day.YYYYMMDDHH,Facility.facilName, SUM(EC1day.Value_1day) as value "+
  "from Facility,Sensor,Electricity_consumption_day as EC1day "+
  "where EC1day.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EC1day.equip_Id "+
  "group by Facility.facilName, EC1day.YYYYMMDDHH "+
  "order by Facility.facilName asc;"
  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query_5min);
    const result2 = await pool.request().query(query_15min);
    const result3 = await pool.request().query(query_30min);
    const result4 = await pool.request().query(query_60min);
    const result5 = await pool.request().query(query_1day);
    var arr = new Object();
    arr.value_5min = result1.recordset;
    arr.value_15min = result2.recordset;
    arr.value_30min = result3.recordset;
    arr.value_60min = result4.recordset;
    arr.value_1day = result5.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}
/*
전체사이트 페이지 사용, 금일 데이터 모든 시설 생산량 시설별, 인덱스별로 가져옴
 */
exports.EachFacilitySupply = async function (req, res, next) {
  var date = req.body.date;

  var query_5min = "select EO5.mmIndex, EO5.YYYYMMDDHH,Facility.facilName, SUM(EO5.Value_5min) as value "+
  "from Facility,Sensor,Electricity_output_5min as EO5 "+
  "where EO5.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EO5.equip_Id "+
  "group by Facility.facilName, EO5.mmIndex,EO5.YYYYMMDDHH "+
  "order by Facility.facilName asc, EO5.mmIndex asc;"

  var query_15min = "select EO15.mmIndex, EO15.YYYYMMDDHH,Facility.facilName, SUM(EO15.Value_15min) as value "+
  "from Facility,Sensor,Electricity_output_15min as EO15 "+
  "where EO15.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EO15.equip_Id "+
  "group by Facility.facilName, EO15.mmIndex,EO15.YYYYMMDDHH "+
  "order by Facility.facilName asc, EO15.mmIndex asc;"

  var query_30min = "select EO30.mmIndex, EO30.YYYYMMDDHH,Facility.facilName, SUM(EO30.Value_30min) as value "+
  "from Facility,Sensor,Electricity_output_30min as EO30 "+
  "where EO30.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EO30.equip_Id "+
  "group by Facility.facilName, EO30.mmIndex,EO30.YYYYMMDDHH "+
  "order by Facility.facilName asc, EO30.mmIndex asc;"

  var query_60min = "select EO60.mmIndex, EO60.YYYYMMDDHH,Facility.facilName, SUM(EO60.Value_60min) as value "+
  "from Facility,Sensor,Electricity_output_60min as EO60 "+
  "where EO60.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EO60.equip_Id "+
  "group by Facility.facilName, EO60.mmIndex,EO60.YYYYMMDDHH "+
  "order by Facility.facilName asc, EO60.mmIndex asc;"

  var query_1day = "select EO1day.YYYYMMDDHH,Facility.facilName, SUM(EO1day.Value_1day) as value "+
  "from Facility,Sensor,Electricity_output_day as EO1day "+
  "where EO1day.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = EO1day.equip_Id "+
  "group by Facility.facilName, EO1day.YYYYMMDDHH "+
  "order by Facility.facilName asc;"
  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query_5min);
    const result2 = await pool.request().query(query_15min);
    const result3 = await pool.request().query(query_30min);
    const result4 = await pool.request().query(query_60min);
    const result5 = await pool.request().query(query_1day);
    var arr = new Object();
    arr.value_5min = result1.recordset;
    arr.value_15min = result2.recordset;
    arr.value_30min = result3.recordset;
    arr.value_60min = result4.recordset;
    arr.value_1day = result5.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

/* 
  전체사이트페이지사용(v1), 선택 시설, 시간대별 과거날짜 1시간 예측 생산량 데이터
 */
exports.preSupplyHourV1_Today = async function(req, res, next){

  var facilityList = req.body.facilityList;

  var query = "select predictionInfo.hour, SUM(productAmount) as value from predictionInfo "+
  "where predictionInfo.facil_Id in (select Sensor.facil_Id from Sensor "+
  "where Sensor.equip_Id in " + facilityList +
  "group by Sensor.facil_Id) "+
  "group by predictionInfo.hour order by predictionInfo.hour asc;"
  console.log(query);
  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query);
    res.json(result1.recordset);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}

/* 
  전체사이트페이지사용(v1), 선택 시설, 시간대별 금일 1시간 예측 생산량 데이터
 */
exports.preSupplyHourV1_Past = async function(req, res, next){

  var date = req.body.date;

  var facilityList = req.body.facilityList;

  var query = "select predictionArchive.hour, SUM(productAmount) as value from predictionArchive "+
  "where predictionArchive.facil_Id in (select Sensor.facil_Id from Sensor "+
  "where Sensor.equip_Id in " + facilityList +
  "group by Sensor.facil_Id) and predictionArchive.date= '"+date+"' "+
  "group by predictionArchive.hour order by predictionArchive.hour asc;"

  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query);
    res.json(result1.recordset);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}

/* 
  전체사이트페이지사용(v2), 모든시설 시간대별 금일 1시간 예측 생산량 데이터
 */
exports.preSupplyHourV2_Today = async function(req, res, next){

  var query = "select predictionInfo.hour, SUM(productAmount) as value "+ 
  "from predictionInfo,Facility where Facility.facil_Id = predictionInfo.facil_Id "+
  "group by predictionInfo.hour order by predictionInfo.hour asc;"

  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query);
    res.json(result1.recordset);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}

exports.preSupplyHourV2_Past = async function(req, res, next){

  var date = req.body.date;
  
  var query = "select predictionArchive.hour, SUM(productAmount) as value "+
  "from predictionArchive,Facility where Facility.facil_Id = predictionArchive.facil_Id and predictionArchive.date='"+date+"' "+
  "group by predictionArchive.hour order by predictionArchive.hour asc;"

  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query);
    res.json(result1.recordset);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}

//용도별 수급 현황 페이지에서 사용,
//센서 type(지역본부,사옥,주택,..)별로 당일 합계를 출력
exports.SDByType = async function (req, res, next) {
  
  var d = new Date();
  var now = dateUtils.yyyymmdd(d);
  var query = "select Facility.type, SUM(Electricity_consumption_5min.Value_5min) as consumption "+
  "from Facility,Sensor,Electricity_consumption_5min "+
  "where Electricity_consumption_5min.YYYYMMDDHH= '"+ now + "' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_5min.equip_Id "+
  "group by Facility.type;"

  try{
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    var arr=[];
    arr = result.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}
/*
용도별 수급 현황 페이지에서 사용, 금일 데이터 모든시설 사용량 총합 인덱스별로 가져옴 mmIndex:1 consumption:1000, mmIndex:2, consumption:990,..
*/
exports.SDTotalUsage = async function (req, res, next) {
  var date = req.body.date;
  // var d = new Date(date);
  // var now = dateUtils.yyyymmdd(d);

  var query_5min = "select Electricity_consumption_5min.mmIndex, Electricity_consumption_5min.YYYYMMDDHH, SUM(Electricity_consumption_5min.Value_5min) as value "+
  "from Facility,Sensor,Electricity_consumption_5min "+
  "where Electricity_consumption_5min.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_5min.equip_Id "+
  "group by Electricity_consumption_5min.mmIndex,Electricity_consumption_5min.YYYYMMDDHH order by Electricity_consumption_5min.mmIndex asc;"


  var query_15min = "select Electricity_consumption_15min.mmIndex, Electricity_consumption_15min.YYYYMMDDHH, SUM(Electricity_consumption_15min.Value_15min) as value "+
  "from Facility,Sensor,Electricity_consumption_15min "+
  "where Electricity_consumption_15min.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_15min.equip_Id "+
  "group by Electricity_consumption_15min.mmIndex,Electricity_consumption_15min.YYYYMMDDHH order by Electricity_consumption_15min.mmIndex asc;"
  
  var query_30min = "select Electricity_consumption_30min.mmIndex, Electricity_consumption_30min.YYYYMMDDHH, SUM(Electricity_consumption_30min.Value_30min) as value "+
  "from Facility,Sensor,Electricity_consumption_30min "+
  "where Electricity_consumption_30min.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_30min.equip_Id "+
  "group by Electricity_consumption_30min.mmIndex,Electricity_consumption_30min.YYYYMMDDHH order by Electricity_consumption_30min.mmIndex asc;"

  var query_60min = "select Electricity_consumption_60min.mmIndex, Electricity_consumption_60min.YYYYMMDDHH, SUM(Electricity_consumption_60min.Value_60min) as value "+
  "from Facility,Sensor,Electricity_consumption_60min "+
  "where Electricity_consumption_60min.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_60min.equip_Id "+
  "group by Electricity_consumption_60min.mmIndex,Electricity_consumption_60min.YYYYMMDDHH order by Electricity_consumption_60min.mmIndex asc;"


  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query_5min);
    const result2 = await pool.request().query(query_15min);
    const result3 = await pool.request().query(query_30min);
    const result4 = await pool.request().query(query_60min);
    var arr= new Object();
    arr.value_5min = result1.recordset;
    arr.value_15min = result2.recordset;
    arr.value_30min = result3.recordset;
    arr.value_60min = result4.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}
/*
용도별 수급 현황 페이지에서 사용, 금일 데이터 모든시설 생산량 총합 인덱스 별로 가져옴 mmIndex:1 output:0, mmindex:2, output:0.1
 */
exports.SDTotalSupply = async function (req, res, next) {
  var date = req.body.date;
  // var d = new Date();
  // var now = dateUtils.yyyymmdd(d);

  var query_5min = "select Electricity_output_5min.mmIndex, Electricity_output_5min.YYYYMMDDHH, SUM(Electricity_output_5min.Value_5min) as value "+
  "from Facility,Sensor,Electricity_output_5min "+
  "where Electricity_output_5min.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_output_5min.equip_Id "+
  "group by Electricity_output_5min.mmIndex,Electricity_output_5min.YYYYMMDDHH order by Electricity_output_5min.mmIndex asc;"
  
  var query_15min = "select Electricity_output_15min.mmIndex, Electricity_output_15min.YYYYMMDDHH, SUM(Electricity_output_15min.Value_15min) as value "+
  "from Facility,Sensor,Electricity_output_15min "+
  "where Electricity_output_15min.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_output_15min.equip_Id "+
  "group by Electricity_output_15min.mmIndex,Electricity_output_15min.YYYYMMDDHH order by Electricity_output_15min.mmIndex asc;"
  
  var query_30min = "select Electricity_output_30min.mmIndex, Electricity_output_30min.YYYYMMDDHH, SUM(Electricity_output_30min.Value_30min) as value "+
  "from Facility,Sensor,Electricity_output_30min "+
  "where Electricity_output_30min.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_output_30min.equip_Id "+
  "group by Electricity_output_30min.mmIndex,Electricity_output_30min.YYYYMMDDHH order by Electricity_output_30min.mmIndex asc;"
  
  var query_60min = "select Electricity_output_60min.mmIndex, Electricity_output_60min.YYYYMMDDHH, SUM(Electricity_output_60min.Value_60min) as value "+
  "from Facility,Sensor,Electricity_output_60min "+
  "where Electricity_output_60min.YYYYMMDDHH= '"+date+ "' and "+
  "Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_output_60min.equip_Id "+
  "group by Electricity_output_60min.mmIndex,Electricity_output_60min.YYYYMMDDHH order by Electricity_output_60min.mmIndex asc;"
  
  
  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query_5min);
    const result2 = await pool.request().query(query_15min);
    const result3 = await pool.request().query(query_30min);
    const result4 = await pool.request().query(query_60min);
    var arr= new Object();
    arr.value_5min = result1.recordset;
    arr.value_15min = result2.recordset;
    arr.value_30min = result3.recordset;
    arr.value_60min = result4.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

/*용도별 수급 현황 페이지에서 사용, 용도별(상업,주거,교육) 사용량 mmIndex 별 합계 가져옴*/
exports.SDDemandByuses = async function(req,res,next){
    //금일 날짜데이터 없어 테스트날짜 사용
    // var d = new Date();
    // var now = dateUtils.yyyymmdd(d);
    var date = req.body.date;

    var query_5min = "select Facility.uses, Electricity_consumption_5min.mmIndex, Electricity_consumption_5min.YYYYMMDDHH, SUM(Electricity_consumption_5min.Value_5min) as value "+ 
    "from Facility,Sensor,Electricity_consumption_5min "+
    "where Electricity_consumption_5min.YYYYMMDDHH= '"+date+"' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_5min.equip_Id "+
    "group by Facility.uses, Electricity_consumption_5min.YYYYMMDDHH ,Electricity_consumption_5min.mmIndex "+
    "order by Facility.uses asc ,Electricity_consumption_5min.mmIndex asc;"

    var query_15min="select Facility.uses, Electricity_consumption_15min.mmIndex, Electricity_consumption_15min.YYYYMMDDHH, SUM(Electricity_consumption_15min.Value_15min) as value "+ 
    "from Facility,Sensor,Electricity_consumption_15min "+
    "where Electricity_consumption_15min.YYYYMMDDHH= '"+date+"' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_15min.equip_Id "+
    "group by Facility.uses, Electricity_consumption_15min.YYYYMMDDHH ,Electricity_consumption_15min.mmIndex "+
    "order by Facility.uses asc ,Electricity_consumption_15min.mmIndex asc;"

    var query_30min="select Facility.uses, Electricity_consumption_30min.mmIndex, Electricity_consumption_30min.YYYYMMDDHH, SUM(Electricity_consumption_30min.Value_30min) as value "+ 
    "from Facility,Sensor,Electricity_consumption_30min "+
    "where Electricity_consumption_30min.YYYYMMDDHH= '"+date+"' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_30min.equip_Id "+
    "group by Facility.uses, Electricity_consumption_30min.YYYYMMDDHH ,Electricity_consumption_30min.mmIndex "+
    "order by Facility.uses asc ,Electricity_consumption_30min.mmIndex asc;"


    var query_60min="select Facility.uses, Electricity_consumption_60min.mmIndex, Electricity_consumption_60min.YYYYMMDDHH, SUM(Electricity_consumption_60min.Value_60min) as value "+ 
    "from Facility,Sensor,Electricity_consumption_60min "+
    "where Electricity_consumption_60min.YYYYMMDDHH= '"+date+"' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_60min.equip_Id "+
    "group by Facility.uses, Electricity_consumption_60min.YYYYMMDDHH ,Electricity_consumption_60min.mmIndex "+
    "order by Facility.uses asc ,Electricity_consumption_60min.mmIndex asc;"

    try{
      const pool = await poolPromise;
      const result1 = await pool.request().query(query_5min);
      const result2 = await pool.request().query(query_15min);
      const result3 = await pool.request().query(query_30min);
      const result4 = await pool.request().query(query_60min);
      var arr= new Object();
      arr.value_5min = result1.recordset;
      arr.value_15min = result2.recordset;
      arr.value_30min = result3.recordset;
      arr.value_60min = result4.recordset;
      res.json(arr);
    } catch(err){
      res.status(500);
      res.send(err.message);
    }
}

/*용도별 수급 현황 페이지에서 사용, 용도별(상업,주거,교육) 생산량 mmIndex 별 합계 가져옴*/
exports.SDSupplyByuses = async function(req,res,next){
  
  // var d = new Date();
  // var now = dateUtils.yyyymmdd(d);
  var date = req.body.date;

  var query_5min = "select Facility.uses, Electricity_output_5min.mmIndex, Electricity_output_5min.YYYYMMDDHH, SUM(Electricity_output_5min.Value_5min) as value "+ 
  "from Facility,Sensor,Electricity_output_5min "+
  "where Electricity_output_5min.YYYYMMDDHH= '"+date+"' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_output_5min.equip_Id "+
  "group by Facility.uses, Electricity_output_5min.YYYYMMDDHH ,Electricity_output_5min.mmIndex "+
  "order by Facility.uses asc ,Electricity_output_5min.mmIndex asc;"

  var query_15min = "select Facility.uses, Electricity_output_15min.mmIndex, Electricity_output_15min.YYYYMMDDHH, SUM(Electricity_output_15min.Value_15min) as value "+ 
  "from Facility,Sensor,Electricity_output_15min "+
  "where Electricity_output_15min.YYYYMMDDHH= '"+date+"' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_output_15min.equip_Id "+
  "group by Facility.uses, Electricity_output_15min.YYYYMMDDHH ,Electricity_output_15min.mmIndex "+
  "order by Facility.uses asc ,Electricity_output_15min.mmIndex asc;"

  var query_30min = "select Facility.uses, Electricity_output_30min.mmIndex, Electricity_output_30min.YYYYMMDDHH, SUM(Electricity_output_30min.Value_30min) as value "+ 
  "from Facility,Sensor,Electricity_output_30min "+
  "where Electricity_output_30min.YYYYMMDDHH= '"+date+"' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_output_30min.equip_Id "+
  "group by Facility.uses, Electricity_output_30min.YYYYMMDDHH ,Electricity_output_30min.mmIndex "+
  "order by Facility.uses asc ,Electricity_output_30min.mmIndex asc;"

  var query_60min = "select Facility.uses, Electricity_output_60min.mmIndex, Electricity_output_60min.YYYYMMDDHH, SUM(Electricity_output_60min.Value_60min) as value "+ 
  "from Facility,Sensor,Electricity_output_60min "+
  "where Electricity_output_60min.YYYYMMDDHH= '"+date+"' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_output_60min.equip_Id "+
  "group by Facility.uses, Electricity_output_60min.YYYYMMDDHH ,Electricity_output_60min.mmIndex "+
  "order by Facility.uses asc ,Electricity_output_60min.mmIndex asc;"
  try{
      const pool = await poolPromise;
      const result1 = await pool.request().query(query_5min);
      const result2 = await pool.request().query(query_15min);
      const result3 = await pool.request().query(query_30min);
      const result4 = await pool.request().query(query_60min);
      var arr= new Object();
      arr.value_5min = result1.recordset;
      arr.value_15min = result2.recordset;
      arr.value_30min = result3.recordset;
      arr.value_60min = result4.recordset;
    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }
}




/*용도별 수급현황 페이지에서 사용, 용도별(상업,주거,교육) 사용량  날짜,mmIndex 별로 가져옴 (지난달 1일부터 오늘 날짜 까지 )  */
exports.SDDemandByusesTwomonths = async function(req,res,next){
var d = new Date();
var now = dateUtils.yyyymmdd(d);
var PreviousMonfirstday=dateUtils.PreviousMonthfirstday(d);
//YYYYMMDDHH<='" + start + "' and YYYYMMDDHH>='" + end + "'

var query =  "select Facility.type, Electricity_consumption_5min.mmIndex, Electricity_consumption_5min.YYYYMMDDHH, SUM(Electricity_consumption_5min.Value_5min) as value from Facility,Sensor,Electricity_consumption_5min where  Electricity_consumption_5min.YYYYMMDDHH>= '" + PreviousMonfirstday+ "' and Electricity_consumption_5min.YYYYMMDDHH<= '" + now + "' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_5min.equip_Id group by Facility.type, Electricity_consumption_5min.YYYYMMDDHH ,Electricity_consumption_5min.mmIndex order by Facility.type asc ,Electricity_consumption_5min.YYYYMMDDHH asc,Electricity_consumption_5min.mmIndex asc;"

//var query =  "select Facility.type, Electricity_consumption_5min.mmIndex, Electricity_consumption_5min.YYYYMMDDHH, SUM(Electricity_consumption_5min.Value_5min) as value from Facility,Sensor,Electricity_consumption_5min where  Electricity_consumption_5min.YYYYMMDDHH>= '2018-07-13' and Electricity_consumption_5min.YYYYMMDDHH<= '2018-08-13' and Sensor.facil_Id=Facility.facil_Id and Sensor.equip_Id = Electricity_consumption_5min.equip_Id group by Facility.type, Electricity_consumption_5min.YYYYMMDDHH ,Electricity_consumption_5min.mmIndex order by Facility.type asc ,Electricity_consumption_5min.YYYYMMDDHH asc,Electricity_consumption_5min.mmIndex asc;"

try{
  const pool = await poolPromise;
  const result = await pool.request().query(query);
  var arr=[];
  arr = result.recordset;
  res.json(arr);
} catch(err){
  res.status(500);
  res.send(err.message);
}
}




exports.SDTpredictHour = async function (req, res, next) {
  var date = req.body.date;
  // var d = new Date(date);
  // var now = dateUtils.yyyymmdd(d);

  var query_5min = "select hour,sum(productAmount)as valueHour from dbo.predictionInfo group by hour order by hour;"



  var query_15min ="select hour,sum(productAmount)as valueHour from dbo.predictionArchive where date= '"+date+ "' group by hour order by hour;" 
  

  //console.log(query_5min);
  try{
    const pool = await poolPromise;
    const result1 = await pool.request().query(query_5min);
    const result2 = await pool.request().query(query_15min);

    var arr= new Object();
    arr.value_5min = result1.recordset;
    arr.value_15min = result2.recordset;

    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}

exports.DeepusageGetdata = async function(req, res, next){
  var query_15min = "select * from dbo.Electricity_consumption_15min_deep;"

  console.log(query_5min);
  try{
    const pool = await poolPromise;
    const result2 = await pool.request().query(query_15min);

    var arr= new Object();
    arr.value_5min = result1.recordset;
    arr.value_15min = result2.recordset;

    res.json(arr);
  } catch(err){
    res.status(500);
    res.send(err.message);
  }

}




exports.InsertTestData = async function(req, res, next){
  




}








