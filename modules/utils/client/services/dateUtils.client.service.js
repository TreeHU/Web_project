/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

  
(function () {
  'use strict';

  angular
    .module('app.utils')
    .service('dateUtils', dateUtils);

  dateUtils.$inject = [];
  function dateUtils() {
    return {
      yyyymmddhhmmss: function (date) {
        var now = new Date(date);
        var year = '' + now.getFullYear();
        var month = '' + (now.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + now.getDate(); if (day.length == 1) { day = '0' + day; }
        var hour = '' + now.getHours(); if (hour.length == 1) { hour = '0' + hour; }
        var minute = '' + now.getMinutes(); if (minute.length == 1) { minute = '0' + minute; }
        var second = '' + now.getSeconds(); if (second.length == 1) { second = '0' + second; }
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      },
      yyyymmdd: function (date) {
        var now = new Date(date);
        var year = '' + now.getFullYear();
        var month = '' + (now.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + now.getDate(); if (day.length == 1) { day = '0' + day; }
        return year + '-' + month + '-' + day;
      },
      yyyymmdd_7 : function(date){
        var now = new Date(date);
        now.setDate(now.getDate()-7);
        var year = '' + now.getFullYear();
        var month = '' + (now.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + now.getDate(); if (day.length == 1) { day = '0' + day; }
        return year + '-' + month + '-' + (day);
      },
      // hhmm: function (date) {
      //   var now = new Date(date);
      //   var hour = '' + now.getHours(); if (hour.length == 1) { hour = '0' + hour; }
      //   var minute = '' + now.getMinutes(); if (minute.length == 1) { minute = '0' + minute; }
      //   return hour + ':' + minute;
      // },
      hhmm : function(index){
        var hour=(index*5)/60; hour=parseInt(hour);
        var minute = (index*5)%60; 
        if(hour<10) {
          hour = '0' +hour; if(minute==0||minute==5){minute = '0' + minute;}
          return hour + ':' + minute;
        }else{
          if(minute==0||minute==5){minute = '0' + minute;}
          return hour + ':' + minute;
        }
      },
      isSolarHoliday: function (date) {

        var now = new Date(date);
        var year = '' + now.getFullYear();
        var month = '' + (now.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + now.getDate(); if (day.length == 1) { day = '0' + day; }
        if (month === 1) {
          //신정
          if (day === 1) return true;
        }
        if (month === 3) {
          //삼일절
          if (day === 1) return true;
        }
        if (month === 5) {
          //어린이날
          if (day === 5) return true;
        }
        if (month === 6) {
          //현충일
          if (day === 6) return true;
        }
        if (month === 8) {
          //광복적
          if (day === 15) return true;
        }
        if (month === 10) {
          //개천절
          if (day === 3) return true;
          //한글날
          if (day === 9) return true;
        }
        if (month === 12) {
          //크리스마스
          if (day === 25) return true;
        }

        return false;
      },
      isLunarHoliday: function (date) {
        
        var solarToLunar = new LunarSolarConverter();
        var solar = new DateToSolar(date);
        var lunar = solarToLunar.SolarToLunar(solar);

        if(lunar.lunarMonth===1){
          //설날
          if(lunar.lunarDay===1) return true;
        }
        if(lunar.lunarMonth===4){
          //부처님 오신날
          if(lunar.lunarDay===8) return true;
        }
        if(lunar.lunarMonth===8){
          //추석
          if(lunar.lunarDay===15) return true;
        }

        function DateToSolar(date){
          var now = new Date(date);
          var year = '' + now.getFullYear();
          var month = '' + (now.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
          var day = '' + now.getDate(); if (day.length == 1) { day = '0' + day; }

          var solar = new Solar();
          solar.solarYear = parseInt(year);
          solar.solarMonth = parseInt(month);
          solar.solarDay = parseInt(day);
          return solar;
        }

        /**
          * Created by isee15 on 15/1/14.
          */
        function Lunar() {
          this.isleap = false;
          this.lunarDay = 0;
          this.lunarMonth = 0;
          this.lunarYear = 0;
        }
        
        function Solar() {
          this.solarDay = 0;
          this.solarMonth = 0;
          this.solarYear = 0;
        }

        function LunarSolarConverter() {
          this.lunar_month_days = [1887, 0x1694, 0x16aa, 0x4ad5,
            0xab6, 0xc4b7, 0x4ae, 0xa56, 0xb52a, 0x1d2a, 0xd54, 0x75aa, 0x156a,
            0x1096d, 0x95c, 0x14ae, 0xaa4d, 0x1a4c, 0x1b2a, 0x8d55, 0xad4,
            0x135a, 0x495d, 0x95c, 0xd49b, 0x149a, 0x1a4a, 0xbaa5, 0x16a8,
            0x1ad4, 0x52da, 0x12b6, 0xe937, 0x92e, 0x1496, 0xb64b, 0xd4a,
            0xda8, 0x95b5, 0x56c, 0x12ae, 0x492f, 0x92e, 0xcc96, 0x1a94,
            0x1d4a, 0xada9, 0xb5a, 0x56c, 0x726e, 0x125c, 0xf92d, 0x192a,
            0x1a94, 0xdb4a, 0x16aa, 0xad4, 0x955b, 0x4ba, 0x125a, 0x592b,
            0x152a, 0xf695, 0xd94, 0x16aa, 0xaab5, 0x9b4, 0x14b6, 0x6a57,
            0xa56, 0x1152a, 0x1d2a, 0xd54, 0xd5aa, 0x156a, 0x96c, 0x94ae,
            0x14ae, 0xa4c, 0x7d26, 0x1b2a, 0xeb55, 0xad4, 0x12da, 0xa95d,
            0x95a, 0x149a, 0x9a4d, 0x1a4a, 0x11aa5, 0x16a8, 0x16d4, 0xd2da,
            0x12b6, 0x936, 0x9497, 0x1496, 0x1564b, 0xd4a, 0xda8, 0xd5b4,
            0x156c, 0x12ae, 0xa92f, 0x92e, 0xc96, 0x6d4a, 0x1d4a, 0x10d65,
            0xb58, 0x156c, 0xb26d, 0x125c, 0x192c, 0x9a95, 0x1a94, 0x1b4a,
            0x4b55, 0xad4, 0xf55b, 0x4ba, 0x125a, 0xb92b, 0x152a, 0x1694,
            0x96aa, 0x15aa, 0x12ab5, 0x974, 0x14b6, 0xca57, 0xa56, 0x1526,
            0x8e95, 0xd54, 0x15aa, 0x49b5, 0x96c, 0xd4ae, 0x149c, 0x1a4c,
            0xbd26, 0x1aa6, 0xb54, 0x6d6a, 0x12da, 0x1695d, 0x95a, 0x149a,
            0xda4b, 0x1a4a, 0x1aa4, 0xbb54, 0x16b4, 0xada, 0x495b, 0x936,
            0xf497, 0x1496, 0x154a, 0xb6a5, 0xda4, 0x15b4, 0x6ab6, 0x126e,
            0x1092f, 0x92e, 0xc96, 0xcd4a, 0x1d4a, 0xd64, 0x956c, 0x155c,
            0x125c, 0x792e, 0x192c, 0xfa95, 0x1a94, 0x1b4a, 0xab55, 0xad4,
            0x14da, 0x8a5d, 0xa5a, 0x1152b, 0x152a, 0x1694, 0xd6aa, 0x15aa,
            0xab4, 0x94ba, 0x14b6, 0xa56, 0x7527, 0xd26, 0xee53, 0xd54, 0x15aa,
            0xa9b5, 0x96c, 0x14ae, 0x8a4e, 0x1a4c, 0x11d26, 0x1aa4, 0x1b54,
            0xcd6a, 0xada, 0x95c, 0x949d, 0x149a, 0x1a2a, 0x5b25, 0x1aa4,
            0xfb52, 0x16b4, 0xaba, 0xa95b, 0x936, 0x1496, 0x9a4b, 0x154a,
            0x136a5, 0xda4, 0x15ac];

          this.solar_1_1 = [1887, 0xec04c, 0xec23f, 0xec435, 0xec649,
            0xec83e, 0xeca51, 0xecc46, 0xece3a, 0xed04d, 0xed242, 0xed436,
            0xed64a, 0xed83f, 0xeda53, 0xedc48, 0xede3d, 0xee050, 0xee244,
            0xee439, 0xee64d, 0xee842, 0xeea36, 0xeec4a, 0xeee3e, 0xef052,
            0xef246, 0xef43a, 0xef64e, 0xef843, 0xefa37, 0xefc4b, 0xefe41,
            0xf0054, 0xf0248, 0xf043c, 0xf0650, 0xf0845, 0xf0a38, 0xf0c4d,
            0xf0e42, 0xf1037, 0xf124a, 0xf143e, 0xf1651, 0xf1846, 0xf1a3a,
            0xf1c4e, 0xf1e44, 0xf2038, 0xf224b, 0xf243f, 0xf2653, 0xf2848,
            0xf2a3b, 0xf2c4f, 0xf2e45, 0xf3039, 0xf324d, 0xf3442, 0xf3636,
            0xf384a, 0xf3a3d, 0xf3c51, 0xf3e46, 0xf403b, 0xf424e, 0xf4443,
            0xf4638, 0xf484c, 0xf4a3f, 0xf4c52, 0xf4e48, 0xf503c, 0xf524f,
            0xf5445, 0xf5639, 0xf584d, 0xf5a42, 0xf5c35, 0xf5e49, 0xf603e,
            0xf6251, 0xf6446, 0xf663b, 0xf684f, 0xf6a43, 0xf6c37, 0xf6e4b,
            0xf703f, 0xf7252, 0xf7447, 0xf763c, 0xf7850, 0xf7a45, 0xf7c39,
            0xf7e4d, 0xf8042, 0xf8254, 0xf8449, 0xf863d, 0xf8851, 0xf8a46,
            0xf8c3b, 0xf8e4f, 0xf9044, 0xf9237, 0xf944a, 0xf963f, 0xf9853,
            0xf9a47, 0xf9c3c, 0xf9e50, 0xfa045, 0xfa238, 0xfa44c, 0xfa641,
            0xfa836, 0xfaa49, 0xfac3d, 0xfae52, 0xfb047, 0xfb23a, 0xfb44e,
            0xfb643, 0xfb837, 0xfba4a, 0xfbc3f, 0xfbe53, 0xfc048, 0xfc23c,
            0xfc450, 0xfc645, 0xfc839, 0xfca4c, 0xfcc41, 0xfce36, 0xfd04a,
            0xfd23d, 0xfd451, 0xfd646, 0xfd83a, 0xfda4d, 0xfdc43, 0xfde37,
            0xfe04b, 0xfe23f, 0xfe453, 0xfe648, 0xfe83c, 0xfea4f, 0xfec44,
            0xfee38, 0xff04c, 0xff241, 0xff436, 0xff64a, 0xff83e, 0xffa51,
            0xffc46, 0xffe3a, 0x10004e, 0x100242, 0x100437, 0x10064b, 0x100841,
            0x100a53, 0x100c48, 0x100e3c, 0x10104f, 0x101244, 0x101438,
            0x10164c, 0x101842, 0x101a35, 0x101c49, 0x101e3d, 0x102051,
            0x102245, 0x10243a, 0x10264e, 0x102843, 0x102a37, 0x102c4b,
            0x102e3f, 0x103053, 0x103247, 0x10343b, 0x10364f, 0x103845,
            0x103a38, 0x103c4c, 0x103e42, 0x104036, 0x104249, 0x10443d,
            0x104651, 0x104846, 0x104a3a, 0x104c4e, 0x104e43, 0x105038,
            0x10524a, 0x10543e, 0x105652, 0x105847, 0x105a3b, 0x105c4f,
            0x105e45, 0x106039, 0x10624c, 0x106441, 0x106635, 0x106849,
            0x106a3d, 0x106c51, 0x106e47, 0x10703c, 0x10724f, 0x107444,
            0x107638, 0x10784c, 0x107a3f, 0x107c53, 0x107e48];

          /**
           * @return {number}
           */
          this.GetBitInt = function (data, length, shift) {
            return (data & (((1 << length) - 1) << shift)) >> shift;
          };

          // WARNING: Dates before Oct. 1582 are inaccurate
          /**
           * @return {number}
           */
          this.SolarToInt = function (y, m, d) {
            m = (m + 9) % 12;
            y = parseInt(y) - parseInt(m / 10);
            return 365 * y + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) + parseInt((m * 306 + 5) / 10)
              + (d - 1);
          };

          this.SolarFromInt = function (g) {
            var y = parseInt((10000 * g + 14780) / 3652425);
            var ddd = g - (365 * y + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400));
            if (ddd < 0) {
              y--;
              ddd = g - (365 * y + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400));
            }
            var mi = parseInt((100 * ddd + 52) / 3060);
            var mm = (mi + 2) % 12 + 1;
            y = y + parseInt((mi + 2) / 12);
            var dd = ddd - parseInt((mi * 306 + 5) / 10) + 1;
            var solar = new Solar();
            solar.solarYear = parseInt(y);
            solar.solarMonth = parseInt(mm);
            solar.solarDay = parseInt(dd);
            return solar;
          };

          this.LunarToSolar = function (lunar) {
            var days = this.lunar_month_days[lunar.lunarYear - this.lunar_month_days[0]];
            var leap = this.GetBitInt(days, 4, 13);
            var offset = 0;
            var loopend = leap;
            if (!lunar.isleap) {
              if (lunar.lunarMonth <= leap || leap == 0) {
                loopend = lunar.lunarMonth - 1;
              } else {
                loopend = lunar.lunarMonth;
              }
            }
            for (var i = 0; i < loopend; i++) {
              offset += this.GetBitInt(days, 1, 12 - i) == 1 ? 30 : 29;
            }
            offset += lunar.lunarDay;

            var solar11 = this.solar_1_1[lunar.lunarYear - this.solar_1_1[0]];

            var y = this.GetBitInt(solar11, 12, 9);
            var m = this.GetBitInt(solar11, 4, 5);
            var d = this.GetBitInt(solar11, 5, 0);

            return this.SolarFromInt(this.SolarToInt(y, m, d) + offset - 1);
          };

          this.SolarToLunar = function (solar) {
            var lunar = new Lunar();
            var index = solar.solarYear - this.solar_1_1[0];
            var data = (solar.solarYear << 9) | (solar.solarMonth << 5)
              | (solar.solarDay);
            if (this.solar_1_1[index] > data) {
              index--;
            }
            var solar11 = this.solar_1_1[index];
            var y = this.GetBitInt(solar11, 12, 9);
            var m = this.GetBitInt(solar11, 4, 5);
            var d = this.GetBitInt(solar11, 5, 0);
            var offset = this.SolarToInt(solar.solarYear, solar.solarMonth,
              solar.solarDay) - this.SolarToInt(y, m, d);

            var days = this.lunar_month_days[index];
            var leap = this.GetBitInt(days, 4, 13);

            var lunarY = index + this.solar_1_1[0];
            var lunarM = 1;
            offset += 1;

            for (var i = 0; i < 13; i++) {
              var dm = this.GetBitInt(days, 1, 12 - i) == 1 ? 30 : 29;
              if (offset > dm) {
                lunarM++;
                offset -= dm;
              } else {
                break;
              }
            }
            var lunarD = parseInt(offset);
            lunar.lunarYear = lunarY;
            lunar.lunarMonth = lunarM;
            lunar.isleap = false;
            if (leap != 0 && lunarM > leap) {
              lunar.lunarMonth = lunarM - 1;
              if (lunarM == leap + 1) {
                lunar.isleap = true;
              }
            }

            lunar.lunarDay = lunarD;
            return lunar;
          }
        }
      },
      isWeekends: function (date) {
        var now = new Date(date);
        var day = '' + now.getDate(); if (day.length == 1) { day = '0' + day; }
        var daySequence = now.getDay();
        if (daySequence === 0 || daySequence === 6) {
          return true;
        }
        else {
          return false;
        }
      },
      needAlternativeHoliday : function(date){
        if(this.isLunarHoliday(date)||this.isSolarHoliday(date)){
          if(this.isWeekends(date)){
            return true;

          }
        }
        return false;

      },latestdays_end_yyyymmdd: function(date,pre){
        var now = new Date(date);
        var endDate = new Date();

        endDate.setDate(now.getDate()-pre);
        
        var year = '' + endDate.getFullYear();
        var month = '' + (endDate.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + endDate.getDate(); if (day.length == 1) { day = '0' + day; }
        return year + '-' + month + '-' + day;
      },latestdays_start_yyyymmdd: function(date,pre){
        var now = new Date(date);
        var startDate = new Date();

        startDate.setDate(now.getDate()-pre);
        
        var year = '' + startDate.getFullYear();
        var month = '' + (startDate.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + startDate.getDate(); if (day.length == 1) { day = '0' + day; }
        return year + '-' + month + '-' + day;
      },latestdays_yyyymmdd : function(paramdate){
        var temp = new Date(paramdate);
        var recurDate = new Date();

        recurDate.setDate(temp.getDate()-1);
        
        var year = '' + recurDate.getFullYear();
        var month = '' + (recurDate.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + recurDate.getDate(); if (day.length == 1) { day = '0' + day; }
        return year + '-' + month + '-' + day;

      },

      mmIndexTohhmm : function(index){
        if(!index) return '0:00';
        var originValue = index * 5;
        var hour = Math.floor(originValue / 60);
        var minute = originValue % 60;
          return hour+' : '+minute;
        //}

      },
      timeToIndex : function(date){
        var time = new Date(date);
        var h = time.getHours(), m=time.getMinutes();
        var nowIndex = (h*12)+(m/5);
        nowIndex = parseInt(nowIndex);
        return nowIndex;
      },
      PreviousDay_One : function (date) {
        var predate = new Date(date);
        predate.setDate(predate.getDate() - 1);
        var year = '' + predate.getFullYear();
        var month = '' + (predate.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + predate.getDate(); if (day.length == 1) { day = '0' + day; }
        return year + '-' + month + '-' + day;
      },
      PreviousMonth : function (date) { //한달전 날짜 알려줌
        var temp = new Date(date);
        var predate = new Date(temp.setMonth(temp.getMonth() - 1));
        var year = '' + predate.getFullYear();
        var month = '' + (predate.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '' + predate.getDate(); if (day.length == 1) { day = '0' + day; }
        return year + '-' + month + '-' + day;
      },
      preMonth: function (date) { //금년 전달
        var temp = new Date(date);
        var predate = new Date(temp.setMonth(temp.getMonth() - 1));
        var year = predate.getFullYear();
        var month = '' + (predate.getMonth() + 1);
        if (month.length == 1) { month = '0' + month; }
        return year + '-' + month + '-' + '%';
      },
      preYear: function (date) {
        var temp = new Date(date);
        var predate = new Date(temp.setFullYear(temp.getFullYear() - 1));
        var year = predate.getFullYear();
        return year + '-' + '%';
      },
      PreviousMonthfirstday : function (date) {//저번달 1일 
        var temp = new Date(date);
        var predate = new Date(temp.setMonth(temp.getMonth() - 1));
        var year = '' + predate.getFullYear();
        var month = '' + (predate.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '01' ;  
        return year + '-' + month + '-' + day;
      },
      firstDay : function (date) {//이번달 1일
        var temp = new Date(date);
        var predate = new Date(temp.setMonth(temp.getMonth()));
        var year = '' + predate.getFullYear();
        var month = '' + (predate.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
        var day = '01' ;  
        return year + '-' + month + '-' + day;
      }
    };
  }
})();
