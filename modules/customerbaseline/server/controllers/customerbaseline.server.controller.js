'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CustomerBaseLine = mongoose.model('customerbaseline'),
  dateUtils = require('../util/dateUtils'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

const sql = require('mssql');
const poolPromise = require('../../../mssqlconfig/db.js');


exports.getCblByEquipmentID = function (req, res, next) {
  var EquipmentId = req.body.EquipmentId;
  var mode = req.body.mode;
  CustomerBaseLine.find({ 'EquipmentId': EquipmentId,'mode':mode }, function (err, data) {
    if (err) {
      return next(err);
    } else if (!data) {
      return next(new Error('Failed to load CBL MAX4/5 Data' + EquipmentId));
    }
    res.json(data);
  });
};

//Mssql Version
exports.getCBL = async function (req, res, next){
  var EquipmentId = req.body.EquipmentId;
  EquipmentId = EquipmentId.replace("Sensor","");
  console.log(EquipmentId);
  var mode = req.body.mode;
  var CBL_MODE={QUATER:3,HALF:6,HOUR:12};
  if(mode == CBL_MODE.QUATER)
  {
    mode = "CBL_LP_MAX45_QTY";
  }
  else if(mode == CBL_MODE.HALF)
  {
    mode = "CBL_HH_MAX45_QTY";
  }
  else if(mode == CBL_MODE.HOUR)
  {
    mode = "CBL_FH_MAX45_QTY";
  }
  var query;
  var testday = "20180206";
  
  //testquery = "select * from TB_DR_LP_DATA_5MIN_CBL where "+ " EquipmentId= '"+EquipmentId+"' and mr_ymdhh<= '"+end+ "' and mr_ymdhh>='"+start+"' ORDER BY mr_ymdhh, mmIndex asc FOR JSON AUTO";
  query = "select "+mode+" from TB_DR_LP_DATA where "+ "custNo = '"+EquipmentId+"' and mr_ymd = '" +testday+"' order by mr_hhmi asc";
  console.log(query);
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







