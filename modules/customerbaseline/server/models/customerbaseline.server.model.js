'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * CBL Schema
 */
var CustomerBaseLineSchema = new Schema({
  value: {
    type: Array
  },
  EquipmentId: {
    type: String
  },
  date : {
    type : Date
  },
  mode : {
    type : String
  }
});


mongoose.model('customerbaseline', CustomerBaseLineSchema);
module.exports=mongoose.model('customerbaseline');
