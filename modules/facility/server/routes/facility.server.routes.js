'use strict';

module.exports = function (app) {
  // User Routes
  var facilities = require('../controllers/facility.server.controller');


  app.route('/api/facilities').get(facilities.list);
  //app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/facility').post(facilities.facilityByID);
  app.route('/api/facilityByfacil_Id').post(facilities.facilityByfacil_Id);
  
  app.route('/api/facilitybytype').post(facilities.facilityByType);
  app.route('/api/facilitycountbytype').post(facilities.facilityCountByType);
  app.route('/api/facilitybyalltype').post(facilities.facilityGetTypes);
  app.route('/api/facility/modify').post(facilities.modify);
  app.route('/api/facility/delete').post(facilities.delete);
  app.route('/api/facility/insert').post(facilities.insert);
  app.route('/api/getSensorId').get(facilities.getSensorId);
  app.route('/api/facilityName').get(facilities.facilityName);
};
