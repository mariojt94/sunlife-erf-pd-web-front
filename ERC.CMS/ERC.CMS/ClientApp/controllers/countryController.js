(function (app) {
    'use strict';
    app.controller('countryController', countryController);
    app.controller('popUpCountryController', popUpCountryController);
    app.controller('popUpImportDataController', popUpImportDataController);

    countryController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];
    popUpCountryController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];
    popUpImportDataController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];


    app.component('countryComponent', {
        templateUrl: 'countryContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpCountryController
    });

    app.component('importCountryComponent', {
        templateUrl: 'importData.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpImportDataController
    });

    function countryController($scope, myService, $http, $uibModal, $log, $document, $window) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.filterOptions = {
            countryCode: "",
            countryName: "",
            useExternalFilter: true
        };

        $scope.totalServerItems = 0;

        $scope.pagingOptions = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData = function (data, page, pageSize, length) {
            $scope.myData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //get data dari sever
        $scope.getPagedDataAsync = function (pageSize, page, countrycode, countryname) {
            setTimeout(function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                if (name) {
                    $http({ method: 'GET', url: 'api/Country/GetListCountry', params: { page: page, rowspPage: pageSize, countryCode: countrycode, countryName: countryname } }).
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
                } else {
                    $http({ method: 'GET', url: 'api/Country/GetListCountry', params: { page: page, rowspPage: pageSize, countryCode: countrycode, countryName: countryname } }).
                        then(function (response) {
                            $scope.setPagingData(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                        }).finally(function () {
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        });
                }
            }, 500);
        };

        // execute ambil data ke server
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        //clear filter
        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.filterOptions.countryCode = "";
            $scope.filterOptions.countryName = "";
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync(pageSize, currentPage);
        };

        //fungsi search
        $scope.search = function (countryCode, countryName) {
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, countryCode, countryName);
        };

        var statusTemplate = "<div>{{COL_FIELD == 1 ? 'Ya' : 'Tidak' }}</div>";

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
                    displayName: 'Action'
                },
                { field: 'ID', displayName: 'Id', visible: false },
                { field: 'CountryCode', displayName: 'Country Code', width: 200 },
                { field: 'CountryName', displayName: 'Country Name' },
                { field: 'IsActive', displayName: 'Aktif', cellTemplate: statusTemplate, width: 100 }
            ]
        };

        //fungsi delete faq
        $scope.delete = function (formData) {
            var data = formData;
            swalAlert.confirm(function (isConfirmed) {
                if (isConfirmed.value) {

                    var res = $http.post('api/Country/Delete', formData)
                        .then(function (response) {
                            swalAlert.message('s', response.data);
                            $scope.refreshOptionGrid();
                        });
                }
            })
        };

        //function refresh di gunakan seteleh delete data
        $scope.refreshOptionGrid = function () {
            var pagee = ($scope.totalServerItems) % $scope.pagingOptions.pageSize;
            var currentPage = $scope.pagingOptions.currentPage;
            if (pagee === 1) {
                //currentPage -= 1;
                $scope.pagingOptions.currentPage -= 1;
                $scope.totalServerItems -= 1;
            }
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, currentPage);
        };

        $scope.downloadTemplateXls = function () {
            open("/Content/templateImport/Country.xlsx");
        }
        $scope.openPopUpImportData = function () {
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'importCountryComponent',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            })
        };


        //event untuk memasukan filter
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.countryCode, $scope.filterOptions.countryName);
            }
        }, true);

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
                component: 'countryComponent',
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

    function popUpCountryController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;
        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            if (dataResolve.model !== undefined) {
                $ctrl.country = dataResolve.model;
                $ctrl.country.CountryCodeDisable = true;
            } else {
                $ctrl.country = { CountryCode: "", CountryName: "", IsActive: true };
            }
        };

        //Button Save:
        $ctrl.ok = function (formData) {
            var res = $http.post('api/Country/Submit', formData)
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
                });
            $ctrl.resolve.items.search();
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search();
        };
    }

    function popUpImportDataController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;
        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            //Button Cancel:
            $ctrl.cancelImport = function () {
                $ctrl.dismiss();
                dataResolve.search();
            };
            //Import Data
            $ctrl.ImportXls = function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);

                $http.post('api/Country/Import', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function SuccesCallbBack(response) {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
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
                    //$window.alert(response.data.ExceptionMessage);
                    swalAlert.message('e', response.data.ExceptionMessage);
                });
                $ctrl.resolve.items.search();
            };
        }
    }
})(angular.module('SunLifeApp'));