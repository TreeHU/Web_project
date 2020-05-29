'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Usage Schema
 */
var UsageSchema = new Schema({
  EquipmentId: {
    type: String,
    default: ''
  },
  mr_ymdhh: {
    type: String,
    default: ''
  },
  mmIndex: {
    type: Number,
    default: '0'
  },
  Value_5min: {
    type: Number,
    default: '0'
  },
  NowDate : {
    type : String,    
    default: ''
  }
});



// module.exports=mongoose.model('value_5min', UsageSchema);
mongoose.model('value_5min', UsageSchema);
module.exports=mongoose.model('value_5min');
