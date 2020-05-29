'use strict';

angular.module('app.facility.admin').controller('FacilityListController', ['$scope', '$filter', 'Admin', '$http', '$q', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$state', 'Notify','$timeout',
  function ($scope, $filter, Admin, $http, $q, DTOptionsBuilder, DTColumnBuilder, $compile, $state, Notify,$timeout) {
    var vm = this;
    vm.selected = [];


    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
      var defer = $q.defer();
      $http.get('/api/facilities').then(function (result) {
        for (var i = 0; i < result.data.length; i++) {
          result.data[i].replaceAdress = result.data[i].address.toString().replace(/,/g, ' ');
        }
        defer.resolve(result.data);
      });
      return defer.promise;
    }).withDOM('frtip')
      .withPaginationType('full_numbers')
      .withDisplayLength(50)
      .withOption('order', [1, 'desc'])
      .withOption('rowCallback', rowCallback)
      .withOption('createdRow', function (row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
      })
      // .withOption('rowCallback',rowcallback)
      .withButtons([
        'copy',
        'print',
        'excel',
        {
          text: '생성',
          key: '2',
          action: function (e, dt, node, config) {
            $state.go('app.insert-facility');
          }
        },
        {
          text: '삭제',
          key: '1',
          action: function (e, dt, node, config) {
            if (vm.selected.length > 0) {
              if (confirm('정말 삭제하시겠습니까?')) {
                $http.post('/api/facility/delete', vm.selected).success(function (result) {
                  //페이지 이동
                  $timeout(function () {

                    Notify.alert(
                      '데이터가 성공적으로 삭제되었습니다.',
                      { status: 'success' }
                    );

                  }, 500);
                  $state.reload();
                });
              }

            }
            else {
              alert('선택된 데이터가 없습니다.');
            }
          }
        }

      ]);
    vm.dtColumns = [
      DTColumnBuilder.newColumn(null).withTitle('선택').notSortable()
        .renderWith(function (data, type, full, meta) {
          return '<input type="checkbox" ng-click="datatables.toggleOne(\'' + data._id + '\')">';
        }).notSortable().withOption('className', 'dt-center'),
      DTColumnBuilder.newColumn('name').withTitle('시설명'),
      DTColumnBuilder.newColumn('type').withTitle('시설형태'),
      DTColumnBuilder.newColumn('replaceAdress').withTitle('주소'),
      DTColumnBuilder.newColumn('tell_am').withTitle('전화번호'),
      DTColumnBuilder.newColumn('tell_pm').withTitle('야간전화번호')
    ];
    vm.toggleOne = function (data) {
      if (vm.selected.includes(data)) {
        var idx = vm.selected.indexOf(data);
        vm.selected.splice(idx, 1);
      }
      else {
        vm.selected.push(data);
      }

    }
    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
      $('td', nRow).unbind('click');
      $('td', nRow).bind('click', function () {
        $scope.$apply(function () {
          $state.go('app.facility-edit', { 'objectId': aData._id });
        });
      });
      $('.dt-center', nRow).unbind('click');
      return nRow;
    }

  }
]);
