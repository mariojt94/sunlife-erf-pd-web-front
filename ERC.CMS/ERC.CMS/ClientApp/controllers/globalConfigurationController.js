(function (app) {
    'use strict';
    app.controller('globalConfigurationController', globalConfigurationController);
    app.controller('popUpGlobalConfigurationController', popUpGlobalConfigurationController);

    globalConfigurationController.$inject = ['$scope', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpGlobalConfigurationController.$inject = ['$scope', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];

    app.component('globalConfigurationComponent', {
        templateUrl: 'globalConfigurationContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpGlobalConfigurationController
    });

    function globalConfigurationController($scope, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.filterOptions = {
            keyword: "",
            useExternalFilter: true
        };

        $scope.totalServerItems = 0;

        $scope.pagingOptions = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData = function (data, page, pageSize, length) {
            var pagedData = data;
            $scope.myData = pagedData;
            $scope.totalServerItems = length;
            //if (!$scope.$$phase) {
            //    $scope.$apply();
            //}
        };

        //get data dari sever
        $scope.getPagedDataAsync = function (pageSize, page, keyword) {
            setTimeout(function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                $http({ method: 'GET', url: 'api/GlobalConfiguration/GetList', params: { page: page, rowspPage: pageSize, keyword: keyword } }).
                    then(function (response) {
                        $scope.setPagingData(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    }).finally(function () {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    });
            }, 100);
        };

        // execute ambil data ke server
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);


        //event untuk pagging
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.keyword);
            }
        }, true);


        //clear filter
        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.filterOptions.keyword = "";
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync(pageSize, currentPage);
        };

        //fungsi search
        $scope.search = function (keyword) {
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, keyword);
        };

        //bind data
        $scope.gridOptions = {
            data: 'myData',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
            },
            columnDefs: [
                {
                    cellTemplate: '<button class="btn btn-primary" ng-click="openPopUp(row.entity)">Ubah</button>  <button class="btn btn-danger" ng-click="delete(row.entity)">Hapus</button>',
                    width: 136,
                    displayName: ''
                },
                { field: 'Keyword', displayName: 'Kata Kunci', width: 200 },
                { field: 'KeyGroup', displayName: 'Grup' },
                { field: 'Value', displayName: 'Nilai' }
            ]
        };

        //fungsi delete
        $scope.delete = function (formData) {
            formData.Url = '#!' + $location.path();
            var data = formData;
            //if (confirm("Apakah Anda Yakin?")) {
            swalAlert.confirm(function (isConfirm) {
                if (isConfirm.value) {
                    var res = $http.post('api/GlobalConfiguration/Delete', formData)
                        .then(function (response) {
                            //alert(response.data);
                            swalAlert.message('s', response.data);
                        });
                    $scope.refreshOptionGrid();
                }
            })
        };

        //function refresh di gunakan seteleh delete data
        $scope.refreshOptionGrid = function () {
            var pagee = ($scope.totalServerItems) % $scope.pagingOptions.pageSize;
            var currentPage = $scope.pagingOptions.currentPage;
            if (pagee === 1) {
                currentPage -= 1;
                $scope.pagingOptions.currentPage -= 1;
                $scope.totalServerItems -= 1;
            }
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, currentPage);
        };

        //open pop up
        $scope.openPopUp = function (formData) {
            var data;
            if (formData !== null) {
                data = formData;
                $scope.model = data;
            } else {
                $scope.model = null;
            }
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'globalConfigurationComponent',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {

            });
        };
    }

    function popUpGlobalConfigurationController($scope, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;
        $scope.editFlag = false;
        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            if (dataResolve.model != undefined || dataResolve.model != null) {
                $scope.editFlag = true;
                $ctrl.globalconfig = dataResolve.model;
            } else {
                $ctrl.globalconfig = { Keyword: "", Keygroup: "", Value: "" };
            }
        };

        //Button Save:
        $ctrl.ok = function (formData) {
            formData.Url = '#!' + $location.path();
            var res = $http.post('api/GlobalConfiguration/Submit', formData)
                .then(function SuccessCallBack(response) {
                    if (response.data.isSucceed) {
                        //alert(response.data.message);
                        swalAlert.message('s', response.data.message);
                        $ctrl.close();
                    }
                    else {
                        //alert(response.data.message);
                        swalAlert.message('e', response.data.message);
                    }
                }, function errorCallback(response) {
                    //alert(response.data.ExceptionMessage);
                    swalAlert.message('e', response.data.ExceptionMessage);
                }).finally(function () {
                    $ctrl.resolve.items.search();
                });
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search();
        };
    }

})(angular.module('SunLifeApp'));