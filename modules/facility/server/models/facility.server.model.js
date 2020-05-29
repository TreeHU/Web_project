'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


  
/**
 * Facility Schema
 */
var FacilitySchema = new Schema({
  name: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: Array
  },
  tell_am: {
    type: String,
    trim: true,
    default: ''
  },
  tell_pm: {
    type: String,
    trim: true,
    default: ''
  },
  district: {
    type: String,
    trim: true,
    default: ''
  },
  latitude: {
    type: Number,
    default: '0'
  },
  longitude: {
    type: Number,
    default: '0'
  },
  type : {
    type : String,    
    trim : true
  },
  updated : {
    type : Date,
    default : Date.now
  }
});



mongoose.model('Facility', FacilitySchema);
