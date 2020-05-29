'use strict';

module.exports = function (app) {
  // User Routes
  var cbl = require('../controllers/customerbaseline.server.controller');


  app.route('/api/cbl/max45').post(cbl.getCBL);
  //app.route('/api/cbl/max45').post(cbl.getCblByEquipmentID);


};
