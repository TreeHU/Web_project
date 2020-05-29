'use strict';

module.exports = function (app) {
  // User Routes
  var usages = require('../controllers/usage.server.controller');


  // app.route('/api/usages').get(usages.list);
  //app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/usage').post(usages.usageByID);
  app.route('/api/usagebyequipmentid').post(usages.usageByEquipmentID);  
  app.route('/api/usagegetdata').post(usages.usageGetdata);

  //일별 사용량 총합 (한달치)
  app.route('/api/usageByDay').post(usages.usageByDay);
  //시설별 월별 사용량, 총 12개월치 
  app.route('/api/usageByMonth').post(usages.usageByMonth);
  app.route('/api/GetElecAVG').post(usages.GetElecAVG);
  //모든시설 시간대별 사용량 총합
  app.route('/api/usageByALLFacility').get(usages.usageByALLFacility);
  app.route('/api/avgByALLFacility').get(usages.avgByALLFacility);
  app.route('/api/avgByEachFacility').get(usages.avgByEachFacility); //각시설별 평균사용량
  app.route('/api/usageSelectedFacility').post(usages.usageSelectedFacility);//선택된 전체시설 사용량 - 메인페이지사용
  app.route('/api/usgSelectedEachType').post(usages.usgSelectedEachType); //선택된 시설 용도별 사용량
  app.route('/api/avgByEachFacility').get(usages.avgByEachFacility); //각시설별 평균사용량
  app.route('/api/usageSelectedFacilityraw').post(usages.usageSelectedFacilityraw);//전체사이트 소비량
  app.route('/api/usageSelectedFacilitysupply').post(usages.usageSelectedFacilitysupply);//전체사이트 공급량
  app.route('/api/SelectedFacilTwodays').post(usages.SelectedFacilTwodays);//선택된 시설의 어제 오늘 사용량
  app.route('/api/SelectedPreMonth').post(usages.SelectedPreMonth); 
  app.route('/api/SelectedthisMonthSupply').post(usages.SelectedthisMonthSupply); //선택된 시설 오늘까지 공급량
  
  /*
  사이트별 현황 사용
   */
  app.route('/api/supplyGetElec5min').post(usages.supplyGetElec5min);
  app.route('/api/usageGetElec5min').post(usages.usageGetElec5min);
  app.route('/api/supply60min_Today').post(usages.supply60min_Today);
  app.route('/api/supply60min_Past').post(usages.supply60min_Past);
  /*
  전체 사이트 현황 사용
   */
  app.route('/api/EachFacilityUsage').post(usages.EachFacilityUsage);
  app.route('/api/EachFacilitySupply').post(usages.EachFacilitySupply);
  app.route('/api/supplySelectedFacility').post(usages.supplySelectedFacility);//금일,어제 생산량
  app.route('/api/usageSelectedFacilityweek').post(usages.usageSelectedFacilityweek);//금일,어제 사용량

  app.route('/api/preSupplyHourV2_Today').get(usages.preSupplyHourV2_Today);//금일 60분 생산량 예측 
  app.route('/api/preSupplyHourV2_Past').post(usages.preSupplyHourV2_Past);//과거 60분 생산량 예측

  app.route('/api/preSupplyHourV1_Today').post(usages.preSupplyHourV1_Today);//V1 - 금일 60분 생산량 예측
  app.route('/api/preSupplyHourV1_Past').post(usages.preSupplyHourV1_Past);//V1 - 과거 60분 생산량 예측
  /*
  용도별 수급현황 사용
   */
  app.route('/api/SDByType').get(usages.SDByType);//type별 전력소비 총합
  app.route('/api/SDTotalUsage').post(usages.SDTotalUsage);//실시간 모든시설 전력소비 총합
  app.route('/api/SDTotalSupply').post(usages.SDTotalSupply);//실시간 모든시설 전력생산 총합
  app.route('/api/SDDemandByuses').post(usages.SDDemandByuses);//실시간 용도별 전력소비 총합
  app.route('/api/SDSupplyByuses').post(usages.SDSupplyByuses);//실시간 용도별 전력생산 총합
  app.route('/api/SDDemandByusesTwomonths').get(usages.SDDemandByusesTwomonths);//실시간 용도별 전력소비 지난달1일부터 오늘까지 
  app.route('/api/SDTpredictHour').post(usages.SDTpredictHour);//1시간 공급 예측 데이터 

  /*
  용도별 수급현황2 사용
  */
  app.route('/api/DeepusageGetdata').post(usages.DeepusageGetdata);//1시간 공급 예측 데이터 
};
