(function () {
  'use strict';

  angular
    .module('core')
    .controller('CoreHomeMapController', CoreHomeMapController);

  CoreHomeMapController.$inject = ['$timeout', '$http', 'Colors', '$compile', '$scope', 'dateUtils', '$state','facilityInfo','passingURL','FacilityTotalUsage','sessionstoarge'];
  function CoreHomeMapController($timeout, $http, Colors, $compile, $scope, dateUtils, $state,facilityInfo,passingURL,FacilityTotalUsage,sessionstoarge) {
    var vm = this;
    var lastInfoWindow = undefined;
    var faciliInfo;
    var selectedItem = new Object();
    $scope.serchKeyword=null;
    
    var icons = { 
      headquarter: {
        icon: './img/mapicons/if_building_35759.png'
      },
      laboratory: {
        icon: './img/mapicons/if_Retort_32545.png'
      },
      regionHeadquarter: {
        icon: './img/mapicons/if_buildings_101742.png'
      },
      trainingCenter: {
        icon: './img/mapicons/if_lyx_6537.png'
      },
      school:{
        icon:'./img/mapicons/school.png'
      },
      home:{
        icon:'./img/mapicons/home.png'
      }
    };

    //selected area,uses
    $scope.usesSelection=[];
    $scope.areaSelection=[];

    $scope.uses=[{type:'본사',selected:false},{type:'사옥',selected:false},{type:'연수원',selected:false},{type:'주택',selected:false},
                {type:'지역본부',selected:false},{type:'학교',selected:false}];
    $scope.local=[{area:'강원',selected:false},{area:'경기',selected:false},{area:'경남',selected:false},{area:'광주',selected:false},
                {area:'대구',selected:false},{area:'대전',selected:false},{area:'부산',selected:false},{area:'서울',selected:false},
                {area:'세종',selected:false},{area:'인천',selected:false},{area:'전북',selected:false},{area:'제주',selected:false},
                {area:'충남',selected:false}];

    //용도별 모두 체크 함수
    $scope.usesCheckAll = function(event){
      if(event.currentTarget.checked==true){
        var togglestatus = $scope.useAllSelected;
        angular.forEach($scope.uses,function(object){
          object.selected = togglestatus;
        })
      }else{
        angular.forEach($scope.uses,function(object){
          object.selected = false;
        })
      }
    }
    //지역별 모두 체크 함수
    $scope.areaCheckAll = function(event){
      if(event.currentTarget.checked==true){
        var togglestatus = $scope.areaAllSelected;
        angular.forEach($scope.local,function(object){
          object.selected = togglestatus;
        })
      }else{
        angular.forEach($scope.local,function(object){
          object.selected = false;
        })
      }
    }

    activate();
    

    var gmarker=[];
    var place,fixedMark;
    ////////////////
    //var initMapCenterPosition = {lat: 36.216207, lng:127.478371};
    function activate() {

      //배열 객체 중복 제거 함수 [{},{},{},..] 중복을 체크하고싶은 key값을 넣으면
      //중복을 제거한 새로운 배열 객체가 반환됨.
      var removeDuplicates = function(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};
        for(var i in originalArray) {
           lookupObject[originalArray[i][prop]] = originalArray[i];
        }
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
         return newArray;
      };


      vm.addMarker = addMarker;
      // custom map style
      var MapStyles = [{ 'featureType': 'water', 'stylers': [{ 'visibility': 'on' }, { 'color': '#bdd1f9' }] }, { 'featureType': 'all', 'elementType': 'labels.text.fill', 'stylers': [{ 'color': '#334165' }] }, { featureType: 'landscape', stylers: [{ color: '#e9ebf1' }] }, { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#c5c6c6' }] }, { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fff' }] }, { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#fff' }] }, { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#d8dbe0' }] }, { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#cfd5e0' }] }, { featureType: 'administrative', stylers: [{ visibility: 'on' }, { lightness: 33 }] }, { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'on' }, { lightness: 20 }] }, { featureType: 'road', stylers: [{ color: '#d8dbe0', lightness: 20 }] }];
      vm.mapOptions1 = {
        zoom: 7,  //9
        center: new google.maps.LatLng(36.216207, 127.478371),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        mapTypeControl: false,
        streetViewControl:false,
        rotateControl:false
        
      };

      //용도별 지역별 체크박스 클릭시 객체로 정보 담음.
      //중복 없는 unique한 시설 정보가 객체로 담김 
      function filterMarker(info,selectedInfo){
        //info 파라미터는 unique한 시설 정보
        var filterInfo = [];
        var temp = [];
         //{use:['지역본부','연수원'],area:['서울','경기']}
        //해당지역에 일치하는것 용도들만 => 서울,경기에 있는 지역본부, 연수원만
        if (selectedInfo.use.length != 0 && selectedInfo.area.length==0){ //용도만 선택했을 때
          for (var i = 0; i < info.length; i++) {
            for (var j = 0; j < selectedInfo.use.length; j++) {
              if (info[i].type == selectedInfo.use[j]) {
                filterInfo.push(info[i]);
                break;
              }
            }
          }
        }
        if (selectedInfo.use.length == 0 && selectedInfo.area.length != 0) { //지역만 선택했을 때
          for(var i=0; i<info.length; i++){
            for(var j=0; j<selectedInfo.area.length; j++){
              if(info[i].province == selectedInfo.area[j]){
                filterInfo.push(info[i]);
                break;
              }
            }
          }
        }
        if (selectedInfo.use.length != 0 && selectedInfo.area.length != 0) { //용도,지역 선택했을 때
          for (var i = 0; i < info.length; i++) {
            for (var j = 0; j < selectedInfo.area.length; j++) {
              if (info[i].province == selectedInfo.area[j]) {
                temp.push(info[i]);
                break;
              }
            }
          }
          temp.forEach(function (value) { //선택된 지역에 한정된 용도만 걸러준다.
            for (var k = 0; k < selectedInfo.use.length; k++) {
              if (value.type == selectedInfo.use[k]) {
                filterInfo.push(value);
                break;
              }
            }
          })
        }

        if (selectedInfo.use.length == 0 && selectedInfo.area.length == 0) { //아무것도 선택하지 않았을 때
          for (var i = 0; i < info.length; i++) {
            filterInfo.push(info[i]);
          }
        }

        return filterInfo;
      }

      //적용 버튼 누를때마다 데이터 갱신됨
      //info 변수에 체크된 시설정보 들어감.
      $scope.save = function(){
        var info;
        var sensorList;
        selectedItem.use=[];
        selectedItem.area=[];
        angular.forEach($scope.uses,function(use){
          if(use.selected){
            selectedItem.use.push(use.type);
          }
        });
        angular.forEach($scope.local,function(area){
          if(area.selected){
            selectedItem.area.push(area.area);
          }
        });
        //selectedItem 객체 => {use:['지역본부','연수원'],area:['서울','경기']}
        //중복없는 시설 정보
        var uniqueInfo = removeDuplicates(faciliInfo,"facilName");
        sensorList = filterMarker(faciliInfo, selectedItem); //여기 수정!!
        //중복없는 시설 정보
        filterMarkerView(uniqueInfo,selectedItem);
        $scope.$broadcast('sensorList', sensorList);
        return sensorList;
      };
      

      var filterMarkerView = function(info,selectedList){
        //unique한 info 전체 시설 정보
        //selectedList 체크박스로 선택된 정보
        //gmarker 구글맵 옵션 포함된 info 정보

        //아무것도 선택하지 않았을때
        if(selectedList.use.length == 0 && selectedList.area.length == 0){
          gmarker.filter(function(value){
            value.setVisible(true);
          })
        }
        //용도만 선택했을때
        for(var i=0; i<gmarker.length; i++){
            if(selectedList.use.length != 0 && selectedList.area.length ==0){
              for(var j=0; j<selectedList.use.length; j++){
                if(gmarker[i].type == selectedList.use[j]){
                  gmarker[i].setVisible(true);
                  break;
                }
                else{
                  gmarker[i].setVisible(false);
                }
              }
            }
        }
        //지역만 선택했을때
        for(var i=0; i<gmarker.length; i++){
            if(selectedList.area.length != 0 && selectedList.use.length ==0){
              for(var j=0; j<selectedList.area.length; j++){
                if(gmarker[i].province == selectedList.area[j]){
                  gmarker[i].setVisible(true);
                  break;
                }
                else{
                  gmarker[i].setVisible(false);
                }
              }
            }
        }
        //용도,지역 선택했을때
        var showGmarker = [];
        
        if(selectedList.use.length != 0 && selectedList.area.length !=0){
          for(var i=0; i<gmarker.length; i++){
            for(var j=0; j<selectedList.area.length; j++){
              if (gmarker[i].province == selectedList.area[j]){
                showGmarker.push(gmarker[i]);
                break;
                // gmarker[i].setVisible(true);
                // break;
              }
              else{
                gmarker[i].setVisible(false);
              }
            }
          }
          showGmarker.forEach(function(value){
            for(var k=0; k<selectedList.use.length; k++){
              if(value.type == selectedList.use[k]){
                value.setVisible(true);
                break;
              }
              else{
                value.setVisible(false);
              }
            }
          })
        }  
      }

      function addSearchList(map) {
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
      }
      function CenterControl(controlDiv, map) {
        var controlUI = document.createElement('div');
        controlDiv.appendChild(controlUI);
        var controlText = angular.element('<input id="searchPlace" type="text" placeholder="원하시는 항목을 입력해 주세요" class="form-control searchBox" ng-model="searchKeyword" auto-complete="autoCompleteOptions">');
        $compile(controlText)($scope);
        controlUI.appendChild(controlText[0]);
      }


      /*
      */
      
      facilityInfo.getFacilityList().then(function(response){
        faciliInfo = response;
        var Allsensorlist = '';
        faciliInfo.forEach(function(value){
          Allsensorlist+="'"+value.equip_Id+"',";
        })
        Allsensorlist = Allsensorlist.slice(0, (Allsensorlist.length - 1));
        Allsensorlist = "(" + Allsensorlist + ")";
        $scope.$broadcast('Allsensorlist', Allsensorlist);
        response = removeDuplicates(response,"facilName");
        
      // $http.get('/api/facilities').success(function (response) {
        
        for (var i = 0; i < response.length; i++) {
          $timeout(addMarker(vm.myMap1, response[i]));
        }
        $scope.autoCompleteOptions = {
          minimumChars: 2,
          dropdownWidth: '300px',
          containerCssClass: 'color-codes',
          selectedTextAttr: 'facilName',
          data: function (searchText) {
              searchText = searchText.toUpperCase();
              return _.filter(response, function (data) {
                return data.facilName.includes(searchText);
              });
          },
          itemSelected: function (item) {
            place = item.item.facilName;  
            fixedMark = gmarker.filter(function(item){ 
              return item.facilName===place;
            });
            vm.myMap1.setCenter({lat: item.item.latitude, lng: item.item.longitude}); //좌표정보로 마커
            var showInfo=new google.maps.Marker(fixedMark[0]); 
            showInfo.addListener("click",function(){
              infowindow.open(map,showInfo);//검색 후 정보창 오픈되도록 이벤트 설정
              //viewContent();       
            });
            google.maps.event.trigger(showInfo,"click"); //클릭이벤트로 정보창 오픈
          }
        };
        
        addSearchList(vm.myMap1);
        
      });
      /*

      */

      function parsingstring(str){
        return str.replace('LH','');
      }

      ///////////////
      function addMarker(map, data) {
        var iconType;
        // var usageMonthAvg, usageYearAvg, outputMonthAvg, outputYearAvg;
        switch (data.type) {
          case '지역본부':
            iconType = icons.regionHeadquarter.icon;
            break;
          case '본사':
            iconType = icons.laboratory.icon;
            break;
          case '연수원':
            iconType = icons.trainingCenter.icon;
            break;
          case '사옥':
            iconType = icons.headquarter.icon;
            break;
          case '학교':
            iconType = icons.school.icon;
            break;
          case '주택':
            iconType = icons.home.icon;
            break;
        }
        var marker = new google.maps.Marker({
          map: map,
          position: { lat: data.latitude, lng: data.longitude },
          icon: iconType,
          facilName: data.facilName,
          type : data.type,
          province : data.province,
          uses : data.uses
        });

        gmarker.push(marker);     
        // var facilityData;
        marker.addListener('click',function () { //
          //이전창 닫기
          if (lastInfoWindow !== undefined) {
            lastInfoWindow.close();
          }
          var parameter = new Object();
          parameter.facilName = data.facilName;
          $http.post('/api/GetElecAVG', parameter).then(function (result) {
            var facilityData=result.data;
            // console.log(facilityData);
            var EC_MonAVG = facilityData.EC_MonAVG[0].MonAVG;
            var EC_YearAVG = facilityData.EC_YearAVG[0].YearAVG;
            var EO_MonAVG = facilityData.EO_MonAVG[0].MonAVG;
            var EO_YearAVG = facilityData.EO_YearAVG[0].YearAVG;
            if (EC_MonAVG == null) { EC_MonAVG = 0; };
            if (EC_YearAVG == null) { EC_YearAVG = 0; };
            if (EO_MonAVG == null) { EO_MonAVG = 0; };
            if (EO_YearAVG == null) { EO_YearAVG = 0; };
            EC_MonAVG = (EC_MonAVG.toFixed(3));
            EC_YearAVG = (EC_YearAVG.toFixed(3));
            EO_MonAVG = (EO_MonAVG.toFixed(3));
            EO_YearAVG = (EO_YearAVG.toFixed(3));
            var contentString = '<div class="contentBox" >' +
            '<div>' +
            '</div>' +
            '<h4>' + data.facil_Id + '</h4>' +
            '<div class="row">'+
              '<div class="contentImg">'+
                '<img src="img/lh.png" width="100" height="100">'+
              '</div>'+
              '<div class="leftContent">'+
                '<div class="leftContent2">' +
                  '<li>용도: '+data.uses+'</li>'+
                  '<li>평균 일간 전력사용량 : ' + EC_MonAVG +'KWh</li>'+
                  '<li>평균 일간 신재생발전량 : ' + EO_MonAVG +'KWh</li>'+
                  '<li>평균 월간 전력사용량 : ' + EC_YearAVG +'KWh</li>'+
                  '<li>평균 월간 신재생발전량 : ' + EO_YearAVG +'KWh</li>'+
                '</div>'+
              '</div>' +
            '</div>'+
            '<div class="row">' +
            '<table class="leftContent3" border="2" width=300 style="table-layout: fixed" >'+
            '<tr>'+
                '<th width="30%">주소</th>'+
                '<th width="70%">'+data.address+'</th>'+
            '</tr>'+
            '<tr>'+
                '<td>담당자</td>'+
                '<td>'+data.admin+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>연락처</td>'+
                '<td>'+data.adminTel+'</td>'+
            '</tr>'+
            '</table>'+ 
            '</div>'+     
          //  '<canvas id="myChart" width="400" height="200"></canvas>'+
           
            // '<br>마지막 업데이트: ' + dateUtils.yyyymmddhhmmss(data.updated) +

              "<br><strong><a ng-click=changePrototypeState('" + data.facil_Id + "')>상세현황보기</a></strong>" +
            
            
            //'<br><a ng-click=changePrototypeState("Sensor1113117634")>상세현황보기</a>' +
            '</div>';
            

            var infowindow = new google.maps.InfoWindow();
            $compile(contentString)($scope, function (compiled) {
              //Directive 미인식으로 초기화 한번 필요함
              if (lastInfoWindow === undefined) {
                google.maps.event.trigger(vm.myMap1, 'resize');
              }
              infowindow.setContent(compiled[0]);
              lastInfoWindow = infowindow;
              // setTimeout(undefined,2000);
              infowindow.open(map, marker);

              //$scope.$apply();
            });
          });
          return marker;
        });
      }
    }

    

  

    $scope.changePrototypeState = function (facil_Id) {
      $state.go('app.sites', { 'facil_Id': facil_Id  })
    };
    $scope.changePrototypeSelect = function (facilityList) {
      sessionstoarge.set('facilityList',facilityList);
      $state.go('app.totalsite');
    };

  }
})();
