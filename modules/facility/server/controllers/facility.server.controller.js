'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Facility = mongoose.model('Facility'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'))
const sql = require('mssql')
const poolPromise = require('../../../mssqlconfig/db.js');

/**
 * List of Users
 */
exports.list = async function (req, res) {
  var query = "select Sensor.equip_Id, Facility.facil_Id ,facilName,type,latitude,longitude,province,adminTel,admin,address,uses  from Facility,Sensor "+
  "where Facility.facil_Id=Sensor.facil_Id;"
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
};

exports.facilityName = async function (req, res) {
  var query = "select distinct facilName from Facility,Sensor where Facility.facil_Id=Sensor.facil_Id;"
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
};

/*
Sensor의 facil_Id 와 Facility의 facil_id 가 같은것들의 equip_Id(SensorList) 가져옴
 */
exports.getSensorId = async function (req, res) {
  var query = "select dbo.Sensor.equip_Id from dbo.Sensor INNER JOIN dbo.Facility ON dbo.Sensor.facil_Id = dbo.Facility.facil_Id";
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
};
/**
 * User middleware
 */
exports.facilityByfacil_Id = async function (req, res, next) {
  var facil_Id = req.body.facil_Id;

  var query = "select facilName,type,admin,adminTel,address,equip_Id from Facility,Sensor where Facility.facil_Id=Sensor.facil_Id and " + "sensor.facil_Id ='" + facil_Id + "'";
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
};

exports.facilityByID = async function (req, res, next) {
  var equip_Id = req.body.equip_Id;
 
  var query ="select facilName,type,admin,adminTel,address,equip_Id from Facility,Sensor where Facility.facil_Id=Sensor.facil_Id and "+"equip_Id ='"+equip_Id+"'"; 
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
};


exports.getFacilityEId = async function (req, res, next) {
  var name = req.body.name;
  var query = "select equip_Id from facility,Sensor where Facility.facil_Id=Sensor.facil_Id and  " + "facilName='" + name + "' ";
  
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
};


/* 
  #2 type 별로 get */
exports.facilityByType = async function (req, res, next) {
  var type = req.body.type;
  var query = "select facilName,type,adminTel,address,equip_Id from Facility,Sensor where Facility.facil_Id=Sensor.facil_Id " + "and type='" + type + "' ";
  
  console.log("facility query check: " + query);
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


};
/* 
  #4 type의 카운터 get */
exports.facilityCountByType = function (req, res, next) {
  var type = req.body.type;

  Facility.count({ 'type': type }, function (err, facilities) {
    if (err) {
      return next(err);
    } else if (!facilities) {
      return next(new Error('Failed to load facility' + type));
    }
    res.json(facilities);
  });

};

/* 
  #3 all type 중복없이 가져옴 */
exports.facilityGetTypes = function (req, res, next) {

  Facility.find().distinct('type', function (err, facility) {
    if (err) {
      return next(err);
    } else if (!facility) {
      return next(new Error('Failed to load facility'));
    }
    res.json(facility);
  });

};

/* 
 modify*/
exports.modify = function (req, res, next) {
  var obj = req.body;
  obj.updated = Date.now();
  Facility.update({ '_id': obj._id }, { $set: obj }, function (err, document) {
    if (err) {
      res.status(400).json({ error: err });
    }
    else {
      res.status(200).json({ message: '성공적으로 수정하였습니다.' });
    }
  });
};

/* 
insert*/
exports.insert = function (req, res, next) {
  var obj = req.body;

  var facility = new Facility(obj);
  facility.save(function (err) {
    if (err) {
      res.status(400).json({ error: err });
    }
    else {
      res.status(200).json({ message: '성공적으로 수정하였습니다.' });
    }
  });
};

/* delete */
exports.delete = function (req, res, next) {
  Facility.remove({ _id: { $in: req.body } }).exec(function (err, facility) {
    if (err) {
      return next(err);
    } else if (!facility) {
      return next(new Error('Failed to load facility ' + req.body));
    }

    res.status(200).json({ message: '성공적으로 삭제되었습니다.' });

  });

};