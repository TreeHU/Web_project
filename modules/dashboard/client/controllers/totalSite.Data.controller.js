(function () {
    'use strict';

    angular
        .module('app.totalsite')
        .controller('totalSiteDataController', totalSiteDataController);

    totalSiteDataController.$inject = ['$scope', '$http','dateUtils', 'FacilityTotalUsage','totalSite','facilityInfo','sessionstoarge','predict'];
    function totalSiteDataController($scope, $http ,dateUtils, FacilityTotalUsage, totalSite, facilityInfo, sessionstoarge, predict) {

        var date = new Date();
        var facilityList = sessionstoarge.get('facilityList');

        //2차원 배열 여러개 배열들의 각각의 인덱스별로 합 계산
        function convertByMin(arry){
            return arry.reduce(function(pre,cur){
                cur.forEach(function(ele,i){
                    pre[i] = (pre[i]||0) + ele.value;
                });
                return pre;
            },[]);
        }
        //배열 소수점 3자리까지 자름
        function tofixed_3(arry){
            return arry.map(function(item){
                return item.toFixed(3);
            });
        }
        //obj 배열 소수점 3자리까지 자름 
        function tofixed_3_obj(obj){
            for(var key in obj){
                obj[key] = obj[key].map(function(item){
                    return item.toFixed(3);
                });
            }
            return obj;
        }

        activate();

        function activate() {
            facilityInfo.getFacilityName().then(function(facilList){
                FacilityTotalUsage.usageSelectedFacilityraw(facilityList,date).then(function(rawusage){//사용량
                    FacilityTotalUsage.usageSelectedFacilitysupply(facilityList,date).then(function(rawsupply){//생산량
                        totalSite.EachFacilityUsage(date).then(function(total){//모든 시설, 각각의 시설별 금일 사용량
                            totalSite.EachFacilitySupply(date).then(function(total_supply){//모든 시설, 각각의 시설별 금일 생산량
                                totalSite.supplySelectedFacility(facilityList,date).then(function(supply){//금일,어제 생산량
                                    totalSite.usageSelectedFacilityweek(facilityList,date).then(function(usage){//금일,어제 사용량
                                        
                                        //broadcast할 객체
                                        var data = new Object();

                                        //금일,어제 사용량/생산량 총합
                                        var twodaysSupply = { yesterday : {}, today : {} };
                                        var twodaysDemand = { yesterday : {}, today : {} };

                                        //에너지 사용량
                                        var energy_usage = new Object();
                                        energy_usage = getValue(rawusage,energy_usage);

                                        //에너지 생산량
                                        var energy_supply = new Object();
                                        energy_supply = getValue(rawsupply,energy_supply);

                                        //각각의 시설 전력소비량 담을 객체
                                        var result = new Object();
                                        //각각의 시설 전력 생산량 담을 객체
                                        var result_supply = new Object();

                                        //에너지 예측 사용량
                                        var pre_energy_usage = new Object();
                                        pre_energy_usage.valueData1Day = tofixed_3(predict.pre1Call(energy_usage.valueData1Day));
                                        pre_energy_usage.valueDataHour = tofixed_3(predict.pre1Call(energy_usage.valueDataHour));
                                        pre_energy_usage.valueDataHalfHour = tofixed_3(predict.pre1Call(energy_usage.valueDataHalfHour));
                                        pre_energy_usage.valueDataQuaterHour = tofixed_3(predict.pre1Call(energy_usage.valueDataQuaterHour));
                                        pre_energy_usage.raw = tofixed_3(predict.pre1Call(energy_usage.raw));

                                        //에너지 예측 생산량
                                        var pre_energy_supply = new Object();
                                        pre_energy_supply.valueData1Day = tofixed_3(predict.pre1Call(energy_supply.valueData1Day));
                                        //pre_energy_supply.valueDataHour = tofixed_3(predict.pre1Call(energy_supply.valueDataHour));
                                        pre_energy_supply.valueDataHalfHour = tofixed_3(predict.pre1Call(energy_supply.valueDataHalfHour));
                                        pre_energy_supply.valueDataQuaterHour = tofixed_3(predict.pre1Call(energy_supply.valueDataQuaterHour));
                                        pre_energy_supply.raw = tofixed_3(predict.pre1Call(energy_supply.raw));

                                        //에너지 사용량 ,에너지 생산량사용
                                        function getValue(obj,newobj){

                                            newobj.valueData1Day = [];
                                            newobj.valueDataHour = [];
                                            newobj.valueDataHalfHour = [];
                                            newobj.valueDataQuaterHour = [];
                                            newobj.raw = [];

                                            for(var key in obj){
                                                if(key == 'value_5min'){
                                                    obj[key].forEach(function(item){
                                                        newobj.raw.push(item.value);
                                                    });                   
                                                }else if(key == 'value_15min'){
                                                    obj[key].forEach(function(item){
                                                        newobj.valueDataQuaterHour.push(item.value);
                                                    });
                                                }else if(key == 'value_30min'){
                                                    obj[key].forEach(function(item){
                                                        newobj.valueDataHalfHour.push(item.value);
                                                    });
                                                }else if(key == 'value_60min'){
                                                    obj[key].forEach(function(item){
                                                        newobj.valueDataHour.push(item.value);
                                                    });
                                                }else if(key == 'value_1day'){
                                                    obj[key].forEach(function(item){
                                                        newobj.valueData1Day.push(item.value);
                                                    });
                                                }
                                            }

                                            return newobj;
                                        }
    
                                        parsingTwodays(usage,twodaysDemand);
                                        parsingTwodays(supply,twodaysSupply);
                                        
                                        //금일,어제 사용량/생산량 데이터 없을시 value=0 설정
                                        function parsingTwodays(data,twodaysData){
                                            if(!data.length){//0개일때
                                                twodaysData.yesterday.value=0;
                                                twodaysData.today.value=0;
                                            }else if(data.length==1){//1개일때
                                                if(data[0].YYYYMMDDHH != dateUtils.yyyymmdd(date)){
                                                    twodaysData.today.value = 0;
                                                    twodaysData.yesterday = data[0];
                                                }else{
                                                    twodaysData.today = data[0];
                                                    twodaysData.yesterday.value = 0;
                                                }
                                            }else{
                                                data.forEach(function(item){
                                                    if(item.YYYYMMDDHH == dateUtils.yyyymmdd(date)){
                                                        twodaysData.today = item;
                                                    }else{
                                                        twodaysData.yesterday = item;
                                                    }
                                                });
                                            }
                                        }

                                        //시설이름 공백제거
                                        facilList = facilList.map(function(item){
                                            return item.facilName.replace(/\s+/g,'');
                                        });
                                        
                                        facilList.forEach(function(item){
                                            result[item] = new Object();
                                            result[item].raw = [];
                                            result[item].valueDataQuaterHour = [];
                                            result[item].valueDataHalfHour = [];
                                            result[item].valueDataHour = [];
                                            result[item].valueData1Day = [];
                    
                                            result_supply[item] = new Object();
                                        })
                                        
                                        //#step 1 : 각각의 시설별로 객체 나누기
                                        //객체배열을 속성으로 grouping 하는 함수
                                        function groupBy(array , f){
                                            var groups = new Object();
                                            array.forEach(function(o){
                                            var group = JSON.stringify(f(o));
                                            groups[group] = groups[group] || [];
                                            groups[group].push(o);  
                                            });
                                            return Object.keys(groups).map(function(group){
                                            return groups[group]; 
                                            });
                                        }
                                        for(var key in total){
                                            total[key] = groupBy(total[key],function(item){
                                                return [item.facilName];
                                            });
                                        }
                                        
                                        var pre_result = new Object();
                                        pre_result.valueData1Day = tofixed_3(predict.pre1Call(convertByMin(total.value_1day)));
                                        pre_result.valueDataHour = tofixed_3(predict.pre1Call(convertByMin(total.value_60min)));
                                        pre_result.valueDataHalfHour = tofixed_3(predict.pre1Call(convertByMin(total.value_30min)));
                                        pre_result.valueDataQuaterHour = tofixed_3(predict.pre1Call(convertByMin(total.value_15min)));
                                        pre_result.raw = tofixed_3(predict.pre1Call(convertByMin(total.value_5min)));

                                        for(var key in total_supply){
                                            total_supply[key] = groupBy(total_supply[key],function(item){
                                                return [item.facilName];
                                            });
                                        }

                                        var pre_result_supply = new Object();
                                        pre_result_supply.valueData1Day = tofixed_3(predict.pre1Call(convertByMin(total_supply.value_1day)));
                                        //pre_result_supply.valueDataHour = tofixed_3(predict.pre1Call(convertByMin(total_supply.value_60min)));
                                        
                                        var parameter = new Object();
                                        parameter.facilityList = facilityList;
                                        $http.post('/api/preSupplyHourV1_Today',parameter).then(function(result){
                                            pre_result_supply.valueDataHour = result.data.map(function(item){
                                                return item.value.toFixed(3);
                                            });
                                            pre_energy_supply.valueDataHour = pre_result_supply.valueDataHour;
                                        });

                                        pre_result_supply.valueDataHalfHour = tofixed_3(predict.pre1Call(convertByMin(total_supply.value_30min)));
                                        pre_result_supply.valueDataQuaterHour = tofixed_3(predict.pre1Call(convertByMin(total_supply.value_15min)));
                                        pre_result_supply.raw = tofixed_3(predict.pre1Call(convertByMin(total_supply.value_5min)));
                                        
                                        for(var key in result){//사용량
                                            total.value_5min.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result[key].raw = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                }
                                            });
                                            total.value_15min.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result[key].valueDataQuaterHour = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                }
                                            });
                                            total.value_30min.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result[key].valueDataHalfHour = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                }
                                            });
                                            total.value_60min.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result[key].valueDataHour = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                }
                                            });
                                            total.value_1day.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result[key].valueData1Day = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                } 
                                            });                                            
                                        }             
                                        
                                        for(var key in result_supply){//생산량
                                            total_supply.value_5min.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result_supply[key].raw = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                }
                                            });
                                            total_supply.value_15min.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result_supply[key].valueDataQuaterHour = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                }
                                            });
                                            total_supply.value_30min.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result_supply[key].valueDataHalfHour = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                }
                                            });
                                            total_supply.value_60min.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result_supply[key].valueDataHour = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                }
                                            });
                                            total_supply.value_1day.forEach(function(item){
                                                item[0].facilName = item[0].facilName.replace(/ +/g, "");
                                                if(key == item[0].facilName){
                                                    result_supply[key].valueData1Day = item.map(function(ele){
                                                        return ele.value.toFixed(3);
                                                    });
                                                } 
                                            });
                                        }


                                        
                                        //15분30분1시간데이터
                                        var data2 = new Object();
                                        data2.usage= usage;//센서별 금일,어제 사용량           
                                        
                                        //어제 오늘 사용량 계산 
                                        var nowDate = new Date('2018-07-16');
                                        var yesterDate = nowDate.getTime() - (1*24*60*60*1000);
                                        nowDate.setTime(yesterDate);
                        
                                        var yesterYear = nowDate.getFullYear();
                                        var yesterMonth = nowDate.getMonth()+1;
                                        var yesterDay = nowDate.getDate();
                        
                                        if(yesterMonth<10){
                                            yesterMonth = '0'+ yesterMonth;
                                        }
                                        if(yesterDay<10){
                                            yesterDay='0'+ yesterDay;
                                        }
                        
                                        var resultDate = yesterYear+'-'+yesterMonth +'-'+yesterDay;//어제 날짜 

                                        var nowDate2 = new Date('2018-07-16');
                                        var nowYear = nowDate2.getFullYear();
                                        var nowMonth = nowDate2.getMonth()+1;
                                        var nowDay = nowDate2.getDate();
                                        
                                        if(nowMonth<10){
                                            nowMonth = '0'+nowMonth;
                                        }
                                        if(nowDay<10){
                                            nowDay='0'+ nowDay;
                                        }
                                        var todayDate = nowYear + '-'+nowMonth+'-'+nowDay;//오늘날짜 

                                        var todaySupplyusg =0;

                                        data.Energy_Usage = new Object();
                                        data.Energy_Usage.data = tofixed_3_obj(energy_usage);
                                        data.Energy_Usage.pre = pre_energy_usage;

                                        data.Energy_Supply = new Object();
                                        data.Energy_Supply.data = tofixed_3_obj(energy_supply);
                                        data.Energy_Supply.pre = pre_energy_supply;
                                        //**
                                        data.EachFacilityUsage = new Object();
                                        data.EachFacilityUsage.data = result;
                                        data.EachFacilityUsage.pre = pre_result;

                                        data.EachFacilitySupply = new Object();
                                        data.EachFacilitySupply.data = result_supply;
                                        data.EachFacilitySupply.pre = pre_result_supply;
                                        //**
                                        data.twodaysSupply = twodaysSupply;
                                        data.twodaysDemand = twodaysDemand;
                                        data.sensorlist = facilityList;
                                        
                                        $scope.$broadcast('selectedData',data);
                                    });
                                });
                            });
                        });
                    });       
                });
            });
        }
    }
})();