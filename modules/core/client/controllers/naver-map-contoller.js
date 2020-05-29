
(function() {
    'use strict';

    angular
        .module('core')
        .controller('NaverMapController', NaverMapController);

        NaverMapController.$inject = ['$timeout','$http'];
    function NaverMapController($timeout,$http) {
        var vm = this;
        var map = angular.element( document.querySelector( '#navermap' ) );
        activate();

        function activate() {
            var mapOptions = {
                center: new naver.maps.LatLng(37.3595704, 127.105399),
                zoom: 1,
                zoomControl: true, //줌 컨트롤의 표시 여부
                zoomControlOptions: { //줌 컨트롤의 옵션
                    position: naver.maps.Position.TOP_RIGHT
                }
        
            };
            
            var map = new naver.maps.Map('map', mapOptions);

        }
    }
})();
