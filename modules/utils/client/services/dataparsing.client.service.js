/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

 (function (){

    'use strict';
  
    //TODO this should be Users service
    angular.module('app.utils').factory('Dataparsing', ['$http','$q','dateUtils','predict',
      function ($http, $q, dateUtils, predict) {
        return {
                //총 사용량, 총생산량 데이터를, 차트 그릴때 요구되는 데이터 형식으로 파싱
                  total : function(mode,obj,d,facilityList){
                    
                    var now = new Date();
                    now.setHours(0,0,0,0);

                    //deferred할 객체
                    var info = new Object();

                    var data = new Object();//총 사용량 or 총 생산량
                    var pre_data = new Object();//총 사용량 예측데이터 or 총 생산량 예측데이터

                    var deferred = $q.defer();

                    data = getValue(obj,data);

                    //예측 데이터
                    pre_data.valueData1Day = tofixed_3(predict.pre1Call(data.valueData1Day));
                    //pre_data.valueDataHour = tofixed_3(predict.pre1Call(data.valueDataHour));
                    pre_data.valueDataHalfHour = tofixed_3(predict.pre1Call(data.valueDataHalfHour));
                    pre_data.valueDataQuaterHour = tofixed_3(predict.pre1Call(data.valueDataQuaterHour));
                    pre_data.raw = tofixed_3(predict.pre1Call(data.raw));
                    
                    switch (mode) {
                        case "Usage":
                            pre_data.valueDataHour = tofixed_3(predict.pre1Call(data.valueDataHour));
                            break;
                        case "Supply":
                            if(d < now){
                                //과거
                                var parameter = new Object();

                                d = dateUtils.yyyymmdd(d);
                                parameter.date = d;
                                parameter.facilityList = facilityList;

                                $http.post('/api/preSupplyHourV1_Past',parameter).then(function(result){
                                    pre_data.valueDataHour = result.data.map(function(item){
                                        return item.value.toFixed(3);
                                    });
                                });
                            }else{
                                //금일
                                var parameter = new Object();
                                parameter.facilityList = facilityList;

                                $http.post('/api/preSupplyHourV1_Today',parameter).then(function(result){
                                    pre_data.valueDataHour = result.data.map(function(item){
                                        return item.value.toFixed(3);
                                    });
                                });
                            }
                            break;
                    }

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

                    info.Energy = new Object();
                    info.Energy.data = tofixed_3_obj(data);
                    info.Energy.pre = pre_data;

                    deferred.resolve(info);
                    return deferred.promise;
                },
                totalSDD: function(usage,d){
                var deferred = $q.defer();
                var data = new Object();//총 사용량
                var result = new Object();//사용량,생산량 담을 객체
                result.pre_usage=[];
                var valueData=new Object();//사용량 생산량 value값만 
                valueData.data =[];
                               
                /*
                 총 사용량
                */           
                data.valueDataHour=[];
                data.valueDataHalfHour=[];
                data.valueDataQuaterHour=[];
                data.raw = usage.value_5min;
                for( var i=0; i<usage.value_15min.length; i++){
                    if(data.valueDataQuaterHour[i]===undefined){
                        data.valueDataQuaterHour[i]=0;
                    }
                    data.valueDataQuaterHour[i]+=usage.value_15min[i].value;
                }
                for( var i=0; i<usage.value_30min.length; i++){
                    if(data.valueDataHalfHour[i]===undefined){
                        data.valueDataHalfHour[i]=0;
                    }
                    data.valueDataHalfHour[i]+=usage.value_30min[i].value;
                }
                for( var i=0; i<usage.value_60min.length; i++){
                    if(data.valueDataHour[i]===undefined){
                        data.valueDataHour[i]=0;
                    }
                    data.valueDataHour[i]+=usage.value_60min[i].value;
                }            

                data.raw.forEach(function (item) {
                    valueData.data.push(item.value);
                }); 
                /*
                 사용량,생산량 예측값
                */
                function Pre_result(valueData) { 
                    var preData=new Object(); 
                    var rawdata=[];
                    valueData.raw.forEach(function (item) {
                        rawdata.push(item.value);
                    });                    
                    preData.raw = predict.pre1Call(rawdata);
                    preData.valueDataQuaterHour = predict.pre1Call(valueData.valueDataQuaterHour);
                    preData.valueDataHalfHour = predict.pre1Call(valueData.valueDataHalfHour);
                    preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);
                    return preData;
                    
                }

                result.pre_usage=Pre_result(data);
                result.usage = data;
                deferred.resolve(result);
                return deferred.promise;
                },
                SDDoutput:function(supply,d,predictHour){
                    var deferred = $q.defer();
                    //var data = new Object();//총 사용량
                    var output = new Object();//총 생산량
                    var result = new Object();//사용량,생산량 담을 객체
                    result.pre_output=[];                    
                    var valueData=new Object();//사용량 생산량 value값만 
                    valueData.output =[]; 
                    var todaydate = new Date();
                    console.log(todaydate);
                    console.log(d); 
                    /*
                     총 생산량
                    */
                    output.valueDataHour=[];
                    output.valueDataHalfHour=[];
                    output.valueDataQuaterHour=[];
                    output.raw = supply.value_5min;//usageservercontroller고치기 

                    for( var i=0; i<supply.value_15min.length; i++){
                        if(output.valueDataQuaterHour[i]===undefined){
                            output.valueDataQuaterHour[i]=0;
                        }
                        output.valueDataQuaterHour[i]+=supply.value_15min[i].value;
                    }
                    for( var i=0; i<supply.value_30min.length; i++){
                        if(output.valueDataHalfHour[i]===undefined){
                            output.valueDataHalfHour[i]=0;
                        }
                        output.valueDataHalfHour[i]+=supply.value_30min[i].value;
                    }
                    for( var i=0; i<supply.value_60min.length; i++){
                        if(output.valueDataHour[i]===undefined){
                            output.valueDataHour[i]=0;
                        }
                        output.valueDataHour[i]+=supply.value_60min[i].value;
                    }

                    output.raw.forEach(function (item) {
                        valueData.output.push(item.value);
                    });
                     /*
                     생산량 예측값
                    */
                    function Pre_result(valueData) { 
                        var preData=new Object(); 
                        preData.valueDataHour=[];
                        var rawdata=[];
                        valueData.raw.forEach(function (item) {
                            rawdata.push(item.value);
                        }); 
                        

                        preData.raw = predict.pre1Call(rawdata);
                        preData.valueDataQuaterHour = predict.pre1Call(valueData.valueDataQuaterHour);
                        preData.valueDataHalfHour = predict.pre1Call(valueData.valueDataHalfHour);
                        //preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);

                        return preData;
                        
                    }                   
                   
                    result.pre_output=Pre_result(output);
                                        
                    //공급량 1시간 예측 
                    if(dateUtils.yyyymmdd(todaydate)=== dateUtils.yyyymmdd(d)) {
                        predictHour.value_5min.forEach(function (item) {
                            result.pre_output.valueDataHour.push(item.valueHour);
                        });
                    }
                    else 
                    {
                        predictHour.value_15min.forEach(function (item) {
                            result.pre_output.valueDataHour.push(item.valueHour);
                        }); 

                    }
                    


                    //if(twodaysU[ind].YYYYMMDDHH=== dateUtils.yyyymmdd(time)) {
                    console.log(dateUtils.yyyymmdd(d));

                    console.log(predictHour);

                    result.supply = output;                    
                    deferred.resolve(result);
                    return deferred.promise;
                },                              
                usesParsing : function(uses,d,total){
                            var deferred = $q.defer();
                            var usesData = new Object();
                            var data = new Object();
                            data.valueDataHour=[];
                            data.valueDataHalfHour=[];
                            data.valueDataQuaterHour=[];
                            data.raw = total.value_5min;                    
                            /*
                             용도별 사용량
                            */
                            usesData.pre_usage=[];
                            usesData.edu = new Object(); //교육
                            usesData.edu.raw = [];
                            usesData.edu.valueDataHalfHour = [];
                            usesData.edu.valueDataHour = [];
                            usesData.edu.valueDataQuaterHour = [];

                            usesData.commercial = new Object(); //상업
                            usesData.commercial.raw = [];
                            usesData.commercial.valueDataHalfHour = [];
                            usesData.commercial.valueDataHour = [];
                            usesData.commercial.valueDataQuaterHour = [];

                            usesData.residential = new Object(); //주거
                            usesData.residential.raw = [];
                            usesData.residential.valueDataHalfHour = [];
                            usesData.residential.valueDataHour = [];
                            usesData.residential.valueDataQuaterHour = [];
       
                            for(var i=0; i<uses.value_5min.length; i++){   
                                if(uses.value_5min[i].uses == '교육'){
                                    usesData.edu.raw.push(uses.value_5min[i]);
                                }
                                if(uses.value_5min[i].uses == '상업'){
                                    usesData.commercial.raw.push(uses.value_5min[i]);
                                }
                                if(uses.value_5min[i].uses == '주거'){
                                    usesData.residential.raw.push(uses.value_5min[i]);
                                }                                
                            }                           
                            //15분데이터 
                            for(var i=0; i<uses.value_15min.length; i++){   
                                if(uses.value_15min[i].uses == '교육'){
                                    usesData.edu.valueDataQuaterHour.push(uses.value_15min[i].value);
                                }
                                if(uses.value_15min[i].uses == '상업'){
                                    usesData.commercial.valueDataQuaterHour.push(uses.value_15min[i].value);
                                }
                                if(uses.value_15min[i].uses == '주거'){
                                    usesData.residential.valueDataQuaterHour.push(uses.value_15min[i].value);
                                }                                
                            }
                            //30분 데이터                            
                            for(var i=0; i<uses.value_30min.length; i++){   
                                if(uses.value_30min[i].uses == '교육'){
                                    usesData.edu.valueDataHalfHour.push(uses.value_30min[i].value);
                                }
                                if(uses.value_30min[i].uses == '상업'){
                                    usesData.commercial.valueDataHalfHour.push(uses.value_30min[i].value);
                                }
                                if(uses.value_30min[i].uses == '주거'){
                                    usesData.residential.valueDataHalfHour.push(uses.value_30min[i].value);
                                }                                
                            }
                            //60분 데이터 
                            for(var i=0; i<uses.value_60min.length; i++){   
                                if(uses.value_60min[i].uses == '교육'){
                                    usesData.edu.valueDataHour.push(uses.value_60min[i].value);
                                }
                                if(uses.value_60min[i].uses == '상업'){
                                    usesData.commercial.valueDataHour.push(uses.value_60min[i].value);
                                }
                                if(uses.value_60min[i].uses == '주거'){
                                    usesData.residential.valueDataHour.push(uses.value_60min[i].value);
                                }                                
                            }
                            for( var i=0; i<total.value_15min.length; i++){
                                if(data.valueDataQuaterHour[i]===undefined){
                                    data.valueDataQuaterHour[i]=0;
                                }
                                data.valueDataQuaterHour[i]+=total.value_15min[i].value;
                            }
                            for( var i=0; i<total.value_30min.length; i++){
                                if(data.valueDataHalfHour[i]===undefined){
                                    data.valueDataHalfHour[i]=0;
                                }
                                data.valueDataHalfHour[i]+=total.value_30min[i].value;
                            }
                            for( var i=0; i<total.value_60min.length; i++){
                                if(data.valueDataHour[i]===undefined){
                                    data.valueDataHour[i]=0;
                                }
                                data.valueDataHour[i]+=total.value_60min[i].value;
                            }
                            function Pre_result(valueData) { 
                                var preData=new Object(); 
                                var rawdata=[];
                                valueData.raw.forEach(function (item) {
                                    rawdata.push(item.value);
                                }); 
                                preData.raw = predict.pre1Call(rawdata);
                                preData.valueDataQuaterHour = predict.pre1Call(valueData.valueDataQuaterHour);
                                preData.valueDataHalfHour = predict.pre1Call(valueData.valueDataHalfHour);
                                preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);            
                                return preData;                                
                            }
                            usesData.pre_usage=Pre_result(data);
                            deferred.resolve(usesData);
                            return deferred.promise;         
                    
                },
                usesParsing_sup : function(uses_supply,d,total,predictHour){
                    var deferred = $q.defer();
                    var data = new Object();
                    var usesData_supply = new Object(); //용도별 생산량 (교육 상업 주거)
                    usesData_supply.pre_usage=[];
                    data.valueDataHour=[];
                    data.valueDataHalfHour=[];
                    data.valueDataQuaterHour=[];
                    data.raw = total.value_5min;
                    var todaydate = new Date();
                    console.log(todaydate);
                    console.log(d); 

                    usesData_supply.edu = new Object(); //교육
                    usesData_supply.edu.raw = [];
                    usesData_supply.edu.valueDataHalfHour = [];
                    usesData_supply.edu.valueDataHour = [];
                    usesData_supply.edu.valueDataQuaterHour = [];

                    usesData_supply.commercial = new Object(); //상업
                    usesData_supply.commercial.raw = [];
                    usesData_supply.commercial.valueDataHalfHour = [];
                    usesData_supply.commercial.valueDataHour = [];
                    usesData_supply.commercial.valueDataQuaterHour = [];

                    usesData_supply.residential = new Object(); //주거
                    usesData_supply.residential.raw = [];
                    usesData_supply.residential.valueDataHalfHour = [];
                    usesData_supply.residential.valueDataHour = [];
                    usesData_supply.residential.valueDataQuaterHour = [];
                    //공급 5분 데이터 
                    for(var i=0; i<uses_supply.value_5min.length; i++){
                        if(uses_supply.value_5min[i].uses == '교육'){
                            usesData_supply.edu.raw.push(uses_supply.value_5min[i]);
                        }
                        if(uses_supply.value_5min[i].uses == '상업'){
                            usesData_supply.commercial.raw.push(uses_supply.value_5min[i]);
                        }
                        if(uses_supply.value_5min[i].uses == '주거'){
                            usesData_supply.residential.raw.push(uses_supply.value_5min[i]);
                        }
                    }
                    // 공급 15분 데이터
                    for(var i=0; i<uses_supply.value_15min.length; i++){   
                        if(uses_supply.value_15min[i].uses == '교육'){
                            usesData_supply.edu.valueDataQuaterHour.push(uses_supply.value_15min[i].value);
                        }
                        if(uses_supply.value_15min[i].uses == '상업'){
                            usesData_supply.commercial.valueDataQuaterHour.push(uses_supply.value_15min[i].value);
                        }
                        if(uses_supply.value_15min[i].uses == '주거'){
                            usesData_supply.residential.valueDataQuaterHour.push(uses_supply.value_15min[i].value);
                        }                                
                    }
                    //공급 30분 데이터
                    for(var i=0; i<uses_supply.value_30min.length; i++){   
                        if(uses_supply.value_30min[i].uses == '교육'){
                            usesData_supply.edu.valueDataHalfHour.push(uses_supply.value_30min[i].value);
                        }
                        if(uses_supply.value_30min[i].uses == '상업'){
                            usesData_supply.commercial.valueDataHalfHour.push(uses_supply.value_30min[i].value);
                        }
                        if(uses_supply.value_30min[i].uses == '주거'){
                            usesData_supply.residential.valueDataHalfHour.push(uses_supply.value_30min[i].value);
                        }                                
                    }

                    //공급 1시간 데이터 
                    for(var i=0; i<uses_supply.value_60min.length; i++){   
                        if(uses_supply.value_60min[i].uses == '교육'){
                            usesData_supply.edu.valueDataHour.push(uses_supply.value_60min[i].value);
                        }
                        if(uses_supply.value_60min[i].uses == '상업'){
                            usesData_supply.commercial.valueDataHour.push(uses_supply.value_60min[i].value);
                        }
                        if(uses_supply.value_60min[i].uses == '주거'){
                            usesData_supply.residential.valueDataHour.push(uses_supply.value_60min[i].value);
                        }                                
                    }
                    for( var i=0; i<total.value_15min.length; i++){
                        if(data.valueDataQuaterHour[i]===undefined){
                            data.valueDataQuaterHour[i]=0;
                        }
                        data.valueDataQuaterHour[i]+=total.value_15min[i].value;
                    }
                    for( var i=0; i<total.value_30min.length; i++){
                        if(data.valueDataHalfHour[i]===undefined){
                            data.valueDataHalfHour[i]=0;
                        }
                        data.valueDataHalfHour[i]+=total.value_30min[i].value;
                    }
                    for( var i=0; i<total.value_60min.length; i++){
                        if(data.valueDataHour[i]===undefined){
                            data.valueDataHour[i]=0;
                        }
                        data.valueDataHour[i]+=total.value_60min[i].value;
                    }

                    function Pre_result(valueData) { 
                        var preData=new Object(); 
                        preData.valueDataHour=[];
                        var rawdata=[];
                        valueData.raw.forEach(function (item) {
                            rawdata.push(item.value);
                        }); 
                        

                        preData.raw = predict.pre1Call(rawdata);
                        preData.valueDataQuaterHour = predict.pre1Call(valueData.valueDataQuaterHour);
                        preData.valueDataHalfHour = predict.pre1Call(valueData.valueDataHalfHour);
                        //preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);

                        return preData;
                        
                    }           

                    usesData_supply.pre_usage=Pre_result(data);
                   
                    //result.pre_output=Pre_result(output);
                                        
                    //공급량 1시간 예측 
                    if(dateUtils.yyyymmdd(todaydate)=== dateUtils.yyyymmdd(d)) {
                        predictHour.value_5min.forEach(function (item) {
                            usesData_supply.pre_usage.valueDataHour.push(item.valueHour);
                        });
                    }
                    else 
                    {
                        predictHour.value_15min.forEach(function (item) {
                            usesData_supply.pre_usage.valueDataHour.push(item.valueHour);
                        }); 

                    }
                    //usesData_supply.pre_usage=Pre_result(data);
                    deferred.resolve(usesData_supply);
                    return deferred.promise;              
                    
                },                
                eachFacilityParsing : function(mode,facilList,total,d,selectedList){

                    var now = new Date();
                    now.setHours(0,0,0,0);

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

                    var deferred = $q.defer();

                    //deferred할 객체
                    var info = new Object();

                    var result = new Object();//각각의 시설에서 사용한 전력 데이터 or 생산량 담을 객체
                    var pre_result = new Object();

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
                    });

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

                    switch (mode) {
                        case "Usage":
                            pre_result.valueDataHour = tofixed_3(predict.pre1Call(convertByMin(total.value_60min)));
                            break;
                        case "Supply":
                            if(d < now){
                                //과거
                                d = dateUtils.yyyymmdd(d);
                                var parameter = new Object();
                                parameter.date = d;
                                parameter.facilityList = selectedList;
                                
                                $http.post('/api/preSupplyHourV1_Past',parameter).then(function(result){
                                    pre_result.valueDataHour = result.data.map(function(item){
                                        return item.value.toFixed(3);
                                    });
                                });
                            }else{
                                //금일
                                var parameter = new Object();
                                parameter.facilityList = selectedList;
                                $http.post('/api/preSupplyHourV1_Today',parameter).then(function(result){
                                    pre_result.valueDataHour = result.data.map(function(item){
                                        return item.value.toFixed(3);
                                    });
                                });
                            }
                            break;

                    }

                    pre_result.valueData1Day = tofixed_3(predict.pre1Call(convertByMin(total.value_1day)));
                    //pre_result.valueDataHour = tofixed_3(predict.pre1Call(convertByMin(total.value_60min)));
                    pre_result.valueDataHalfHour = tofixed_3(predict.pre1Call(convertByMin(total.value_30min)));
                    pre_result.valueDataQuaterHour = tofixed_3(predict.pre1Call(convertByMin(total.value_15min)));
                    pre_result.raw = tofixed_3(predict.pre1Call(convertByMin(total.value_5min)));

                    for(var key in result){//사용량 or 생산량
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

                    info.Energy = new Object();
                    info.Energy.data = result;
                    info.Energy.pre = pre_result;
                    
                    deferred.resolve(info);
                    return deferred.promise; 
                },
                sitedataParsing : function(arr,mode,date){
                    var deferred = $q.defer();
                    var data = new Object();
                    var MODE = { RAW: 1, QUATER: 3, HALF: 6, HOUR: 12 };
                    data = ValueandPredict(arr,mode);
                    // switch (mode) {
                    //     case "Usage":
                    //         data= ValueandPredict(arr);
                    //         // data.raw = filterNowIndex(arr.EC_5min, MODE.RAW);
                    //         // data.valueDataQuaterHour = filterNowIndex(arr.EC_15min, MODE.QUATER);
                    //         // data.valueDataHalfHour = filterNowIndex(arr.EC_30min, MODE.HALF);
                    //         // data.valueDataHour = filterNowIndex(arr.EC_60min, MODE.HOUR);
                    //         break;
                    //     case "Supply":
                    //         data = ValueandPredict(arr);
                    //         // data.raw = filterNowIndex(arr.EO_5min, MODE.RAW);
                    //         // data.valueDataQuaterHour = filterNowIndex(arr.EO_15min, MODE.QUATER);
                    //         // data.valueDataHalfHour = filterNowIndex(arr.EO_30min, MODE.HALF);
                    //         // data.valueDataHour = filterNowIndex(arr.EO_60min, MODE.HOUR);
                    //         break;
                    // }
                    //object변수 안의 배열들을 소수점 3자리까지
                    function tofixed_3_obj(obj) {
                        for (var key in obj) {
                            obj[key] = obj[key].map(function (item) {
                                return item.toFixed(3);
                            });
                        }
                        return obj;
                    }
                    function ValueandPredict(obj, mode) { //value값으로만 배열로 만들기
                        var allData = new Object(); //최종 오브젝트
                        var valueData = new Object(); //raw값들만 분리
                        var preData = new Object(); //예측값 오브젝트

                        valueData.raw = [];
                        valueData.valueDataQuaterHour = [];
                        valueData.valueDataHalfHour = [];
                        valueData.valueDataHour = [];

                        obj._5min.forEach(function (item) {
                            valueData.raw.push(item.value);
                        });
                        obj._15min.forEach(function (item) {
                            valueData.valueDataQuaterHour.push(item.value);
                        });
                        obj._30min.forEach(function (item) {
                            valueData.valueDataHalfHour.push(item.value);
                        });
                        switch (mode) {
                            case "Usage": //60분수요 - pre1Call함수
                                obj._60min.forEach(function (item) {
                                    valueData.valueDataHour.push(item.value);
                                });
                                preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);
                                break;
                            case "Supply": //60분공급 - db
                                preData.valueDataHour = [];
                                obj._60min.forEach(function (item) {
                                    preData.valueDataHour.push(item.productAmount);
                                });
                                break;
                        }

                        preData.raw = predict.pre1Call(valueData.raw);
                        preData.valueDataQuaterHour = predict.pre1Call(valueData.valueDataQuaterHour);
                        preData.valueDataHalfHour = predict.pre1Call(valueData.valueDataHalfHour);
                        // preData.valueDataHour = predict.pre1Call(valueData.valueDataHour);
                        allData.data = tofixed_3_obj(valueData);
                        allData.pre = tofixed_3_obj(preData);
                        return allData;
                    }
                    function filterNowIndex(arr, mode) {
                        // var nowDate = dateUtils.yyyymmdd(new Date());
                        // console.log(nowDate);
                        var len = dateUtils.timeToIndex(date);
                        /*
                        총 사용량, 생산량 mmIndex 시간에 맞지 않는 데이터 삭제 (현재시간 17:30, mmIndex:288-> 삭제)
                        */
                        for (var i = 0; i < arr.length; i++) {
                            if ((len / mode) < arr[i].mmIndex) {
                                arr.splice(i, 1);
                            }
                        }
                        //중간에 누락된 데이터 value : 0 으로 채움
                        for (var i = 0; i < arr.length; i++) {
                            var obj = new Object();
                            if (arr[i].mmIndex != i + 1) {
                                obj.YYYYMMDDHH = dateUtils.yyyymmdd(date);
                                obj.mmIndex = i + 1;
                                obj.value = 0;
                                arr.splice(i, 0, obj);
                            }
                        }
                        return arr;
                    }
                    deferred.resolve(data);
                    return deferred.promise; 
                }
                              
        };
      }
    ]);
  })();