(function (app) {
    'use strict';
    app.controller('versionCmsController', versionCmsController);

    versionCmsController.$inject = ['$scope', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];

    app.component('versionCmsComponent', {
        templateUrl: 'versionContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpversionCmsController
    });

    function popUpversionCmsController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            if (dataResolve.model !== undefined) {
                $ctrl.data = dataResolve.model;
            } else {
            }
        }

        //Button Save:
        $ctrl.ok = function (formData) {
            formData.Url = $window.location.hash;
            var res = $http.post('api/Version/UpdateVersion', formData)
                .then(function SuccessCallBack(response) {
                    if (response.data.isSucceed) {
                        //$window.alert(response.data.message);
                        swalAlert.message('s', response.data.message);
                        $ctrl.close();
                        $ctrl.resolve.items.getPagedDataAsync(10, 1)
                    }
                    else {
                        //$window.alert(response.data.message);
                        swalAlert.message('e', response.data.message);
                    }

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //$window.alert(response.data.ExceptionMessage);
                    swalAlert.message('e', response.data.ExceptionMessage);
                });
        }

        //Button Cancel:
        $ctrl.cancel = function () {
            $ctrl.dismiss();
        };
    }

    function versionCmsController($scope, $http, $uibModal, $log, $document, $window, $location) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.totalServerItems = 0;

        $scope.pagingOptions = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData = function (data, page, pageSize, length) {
            var pagedData = data;
            $scope.myData = pagedData;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //get data dari sever
        $scope.getPagedDataAsync = function (pageSize, page) {
            setTimeout(function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                $http({ method: 'GET', url: 'api/Version/GetListVersion', params: { page: page, rowspPage: pageSize } }).
                    then(function (response) {
                        if (response.data.length <= 0) {
                            $scope.myData = response.data;
                            $scope.totalServerItems = 0;
                        }
                        $scope.setPagingData(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    }).finally(function () {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    });
            }, 500);
        };

        //event untuk memasukan filter
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.bankName);
            }
        }, true);

        // execute ambil data ke server
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        ////clear filter
        //$scope.clearFilter = function (pageSize, currentPage) {
        //    $scope.pagingOptions.currentPage = 1;
        //    $scope.filterOptions.bankName = "";
        //    $scope.getPagedDataAsync(pageSize, currentPage);
        //};

        ////fungsi search
        //$scope.search = function (bankName) {
        //    $scope.pagingOptions.currentPage = 1;
        //    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, bankName);
        //};


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
                    cellTemplate: '<button class="btn btn-primary" ng-click="openPopUp(row.entity)">Ubah</button>',
                    //cellTemplate: '<button class="btn btn-primary" ng-click="openPopUp(row.entity)">Ubah</button>  <button class="btn btn-danger" ng-click="delete(row.entity)">Hapus</button>',
                    width: 100,
                    displayName: ''
                },
                { field: 'ID', displayName: 'Id', visible: false },
                { field: 'Version', displayName: 'Versi', width: 200 },
                { field: 'Description', displayName: 'Keterangan' }
            ]
        };

        ////fungsi delete faq
        //$scope.delete = function (formData) {
        //    formData.Url = '#!' + $location.path();
        //    var data = formData;
        //    if (confirm("Apakah Anda Yakin?")) {
        //        var res = $http.post('api/Bank/Delete', formData)
        //            .then(function (response) {
        //                alert(response.data);
        //            });
        //    }
        //    $scope.refreshOptionGrid();
        //};

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
                component: 'versionCmsComponent',
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
                //$log.info('modal-component dismissed at: ' + new Date());
            });
        };
    }


})(angular.module('SunLifeApp'));