(function (app) {
    'use strict';
    app.controller('provinceController', provinceController);
    app.controller('popUpProvinceController', popUpProvinceController);
    app.controller('popUpImportDataController', popUpImportDataController);
    app.controller('lookUpCountryController', lookUpCountryController);

    provinceController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];
    popUpProvinceController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];
    popUpImportDataController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];
    lookUpCountryController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', 'swalAlert'];


    app.component('provinceComponent', {
        templateUrl: 'provinceContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpProvinceController
    });

    app.component('importProvinceComponent', {
        templateUrl: 'importData.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpImportDataController
    });

    app.component('countryLookupComponent', {
        templateUrl: 'countryLookUp.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: lookUpCountryController
    });

    function popUpProvinceController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            if (dataResolve.model !== undefined) {
                $ctrl.province = dataResolve.model;
                $ctrl.province.ProvinceCodeDisable = true;
            } else {
                $ctrl.province = { Id: "0", ProvinceCode: "", ProvinceName: "", CountryCode: "", CountryName: "", isactive: false, ProvinceCodeDisable: false };
            }

        };

        //Button Save:
        $ctrl.ok = function (formData) {
            var res = $http.post('api/Province/Submit', formData)
                .then(function SuccessCallBack(response) {
                    if (response.data.isSucceed) {
                        //$window.alert(response.data.message);
                        swalAlert.message('s', response.data.message);
                        $ctrl.close();
                    }
                    else {
                        //$window.alert(response.data.message);
                        swalAlert.message('e', response.data.message);
                    }
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    swalAlert.message('e', response.data.ExceptionMessage);

                    //$window.alert(response.data.ExceptionMessage);
                });
            $ctrl.resolve.items.search();
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search();
        };

        $scope.openLookupCountry = function () {
            $ctrl.modalInstance = $uibModal.open({
                templateUrl: 'countryLookUp.html',
                controller: lookUpCountryController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $ctrl;
                    }
                }
            });
        }
    }

    function provinceController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {

        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.filterOptions = {
            ProvinceCode: "",
            ProvinceName: "",
            CountryCode: "",
            isActive: "",
            useExternalFilter: true
        };
        //niilai default list
        $scope.totalServerItems = 0;

        //nilai default paging
        $scope.pagingOptions = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.openLookupCountry = function () {
            $ctrl.modalInstance = $uibModal.open({
                templateUrl: 'countryLookUp.html',
                controller: lookUpCountryController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $ctrl;
                    },
                    filterOpt: function () {
                        return $scope.filterOptions;
                    }
                }
            });
        }

        //fungsi pagging
        $scope.setPagingData = function (data, page, pageSize, length) {
            $scope.myData = data;
            $scope.totalServerItems = length;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //get data dari sever
        $scope.getPagedDataAsync = function (pageSize, page, provincecode, provincename, countrycode, isactive) {
            setTimeout(function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                if (name) {
                    $http({ method: 'GET', url: 'api/Province/GetListProvince', params: { page: page, rowspPage: pageSize, ProvinceCode: provincecode, ProvinceName: provincename, CountryCode: countrycode } }).
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
                    $http({ method: 'GET', url: 'api/Province/GetListProvince', params: { page: page, rowspPage: pageSize, ProvinceCode: provincecode, ProvinceName: provincename, CountryCode: countrycode } }).
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

        //event untuk memasukan filter
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.agentlocationcode, $scope.filterOptions.agentlocation, $scope.filterOptions.isactive);
            }
        }, true);

        //clear filter
        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.filterOptions.ProvinceCode = "";
            $scope.filterOptions.ProvinceName = "";
            $scope.filterOptions.countryCode = "";
            $scope.filterOptions.countryName = "";
            $scope.filterOptions.isActive = "1";
            $scope.getPagedDataAsync(pageSize, currentPage);
        };

        //fungsi search
        $scope.search = function (provincecode, provincename, countrycode, isActive) {
            //note isactive tidk
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, provincecode, provincename, countrycode, isActive);
        };
        var statusTemplate1 = "<div>{{COL_FIELD == 1 ? 'Ya' : 'Tidak' }}</div>";
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
                    displayName: '',
                    cellTemplate: '<button class="btn btn-primary" ng-click="openPopUp(row.entity)">Ubah</button>  <button class="btn btn-danger" ng-click="delete(row.entity)">Hapus</button> ',
                    width: 130
                },
                {
                    field: 'ProvinceCode', displayName: 'Kode Provinsi', width: 100
                },
                {
                    field: 'ProvinceName', displayName: 'Nama Provinsi'
                },
                {
                    field: 'CountryCode', displayName: 'Kode Region', width: 100
                },
                { field: 'IsActive', displayName: 'Aktif', cellTemplate: statusTemplate1, width: 100 }
            ]
        };

        //fungsi delete faq
        $scope.delete = function (formData) {
            var data = formData;
            if (confirm("Apakah Anda Yakin?")) {
                var res = $http.post('api/Province/DeleteProvince', formData)
                    .then(function (response) {
                        //$window.alert(response.data);
                        swalAlert.message('i', response.data)
                    });
            }
            $scope.refreshOptionGrid();
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
            if ($scope.pagingOptions.currentPage <= 0)
                $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, currentPage);
        };

        //open pop up
        $scope.openPopUp = function (formData) {
            var data;
            if (formData !== null) {
                data = formData;
               // console.log(data);
                $scope.model = data;
            } else {
                $scope.model = null;
            }
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'provinceComponent',
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
                $log.info('modal-component dismissed at: ' + new Date());
            });
        };

        $scope.downloadTemplateXls = function () {
            open("/Content/templateImport/Province.xlsx");
        }
        $scope.openPopUpImportData = function () {
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'importProvinceComponent',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            })
        };
    }

    function lookUpCountryController($scope, myService, $http, $uibModal, $log, $document, swalAlert) {
        var $ctrl = this;

        $scope.selectedItem = null;
        $scope.filterOptions2 = {
            countryCode: "",
            countryName: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions2 = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData2 = function (data, page, pageSize, length) {
            $scope.countryData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync2 = function (pageSize, page, countrycode, countryname) {
            setTimeout(function () {
                var data;
                $http({ method: 'GET', url: 'api/Country/GetListCountry', params: { page: page, rowspPage: pageSize, countryCode: countrycode, countryName: countryname } }).
                    then(function (response) {
                        if (response.data.length <= 0) {
                            $scope.totalServerItems = 0;
                        }
                        $scope.setPagingData2(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    });
            }, 500);
        };

        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);

        $scope.$watch('pagingOptions2', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.countryCode, $scope.filterOptions2.countryName);
            }
        }, true);

        $scope.search2 = function (countrycode, countryname) {
            $scope.getPagedDataAsync3($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, countrycode, countryname);
        };
        $scope.clearFilter2 = function (pageSize, currentPage) {
            $scope.filterOptions2.filterText = "";
            $scope.getPagedDataAsync2(pageSize, currentPage);
        };

        $scope.grid2Options = {
            data: 'countryData',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions2,
            filterOptions: $scope.filterOptions2,
            columnDefs: [
                { field: 'CountryCode', displayName: 'Kode Region' },
                { field: 'CountryName', displayName: 'Nama Region' }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedItem = row.selectionProvider.selectedItems;
                }
            },
        };
        $scope.cancelLookUpCountry = function () {
            $scope.$resolve.items.modalInstance.close();
        };

        $scope.chooseCountry = function () {
            if ($scope.selectedItem !== null) {
                if ($scope.$resolve.filterOpt != undefined) {
                    $scope.$resolve.filterOpt.countryCode = $scope.selectedItem[0].CountryCode;
                    $scope.$resolve.filterOpt.countryName = $scope.selectedItem[0].CountryName;
                }
                else {
                    $scope.$resolve.items.province.CountryCode = $scope.selectedItem[0].CountryCode;
                    $scope.$resolve.items.province.CountryName = $scope.selectedItem[0].CountryName;
                }

                $scope.$resolve.items.modalInstance.close();
            }
            else {
                //alert('Pilih Region!');
                swalAlert.message('i', 'Pilih Region');
            }
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

                $http.post('api/Province/Import', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function SuccesCallbBack(response) {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                    if (response.data.isSucceed) {
                        //alert(response.data.message);
                        swalAlert.message('s',response.data.message);
                        $ctrl.close();
                    }
                    else {
                        swalAlert.message('e', response.data.message);
                        //alert(response.data.message);
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