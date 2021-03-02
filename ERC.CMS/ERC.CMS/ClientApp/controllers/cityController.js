(function (app) {
    'use strict';
    app.controller('cityController', cityController);
    app.controller('popUpCityController', popUpCityController);
    app.controller('popUpImportDataController', popUpImportDataController);
    app.controller('lookUpProvinsiController', lookUpProvinsiController);

    cityController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'localStorageService', 'swalAlert'];
    popUpCityController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpImportDataController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];
    lookUpProvinsiController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', 'swalAlert'];

    app.component('citycmsComponent', {
        templateUrl: 'cityContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpCityController
    });
    app.component('importCityComponent', {
        templateUrl: 'importDataCity.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpImportDataController
    });

    app.component('provinceLookupComponent', {
        templateUrl: 'provinceLookUp.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: lookUpProvinsiController
    });

    function popUpCityController($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            if (dataResolve.model !== undefined) {
                $ctrl.city = dataResolve.model;
                $ctrl.city.DisableCityCode = true;
                $ctrl.isEdit = true;
            } else {
                $ctrl.city = { ID: 0, CityCode: "", Name: "", provinceCode: "", ProvinceName: "", IsActive: true, DisableCityCode: false };
                $ctrl.isEdit = false;
            }
        };

        //Button Save:
        $ctrl.ok = function (formData) {
            formData.Url = '#!' + $location.path();
            var res = $http.post('api/City/Submit', formData)
                .then(function SuccessCallBack(response) {
                    if (response.data.isSucceed) {
                        //$window.alert(response.data.message);
                        swalAlert.message('s', response.data.message);
                        $ctrl.resolve.items.search();
                        $ctrl.close();
                    }
                }, function errorCallback(response) {
                    //$window.alert(response.data.ExceptionMessage);
                    swalAlert.message('e', response.data.ExceptionMessage);
                });
            $ctrl.resolve.items.search();
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search();
        };

        $scope.openLookupProvinsi = function () {
            $ctrl.modalInstance = $uibModal.open({
                templateUrl: 'provinceLookUp.html',
                controller: lookUpProvinsiController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $ctrl;
                    }
                }
            });
        }
    }

    function cityController($scope, myService, $http, $uibModal, $log, $document, $window, $location, localStorageService, swalAlert) {

        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        //untuk hilangin button ketika user tidak bisa delete add
        //generateAccessMenu();

        //function generateAccessMenu(){
        //    var location = '#!' + $location.path();
        //    var accessmenu = localStorageService.get('AccessMenu');
        //    var length = accessmenu.length;
        //    for (var i = 0; i < length; i++) {
        //        if(accessmenu[i].Link === location){
        //            $scope.currentAccessMenu = accessmenu[i];
        //            console.log($scope.currentAccessMenu);
        //        }

        //    }
        //}
        $scope.filterOptions = {
            //sequence: "",
            citycode: "",
            name: "",
            ProvinceName: "",
            isActive: "1",
            useExternalFilter: true
        };

        $scope.openLookupProvinsi = function () {
            $ctrl.modalInstance = $uibModal.open({
                templateUrl: 'provinceLookUp.html',
                controller: lookUpProvinsiController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $ctrl;
                    }
                }
            });
        }


        //niilai default list
        $scope.totalServerItems = 0;

        //nilai default paging
        $scope.pagingOptions = {
            pageSize: 15,
            currentPage: 1
        };

        //fungsi pagging
        $scope.setPagingData = function (data, page, pageSize, length) {
            $scope.myData = data;
            $scope.totalServerItems = length;
            //console.log('nilai length : ' + length);
            //console.log('isi data : ' + data);

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //get data dari sever
        $scope.getPagedDataAsync = function (pageSize, page, name) {
            setTimeout(function () {
                //$('.spinner').fadeIn(500);
                //$(".OverlaySpinner").fadeIn(500);
                if (name) {
                    $http({ method: 'GET', url: 'api/City/GetListCity', params: { page: page, rowspPage: pageSize, CityCode: name, Name: name, Province: name } }).
                        then(function (response) {
                            if (response.data.length <= 0) {
                                $scope.myData = response.data;
                                $scope.totalServerItems = 0;
                            }

                            $scope.setPagingData(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);

                        }).finally(function () {
                            //$('.spinner').fadeOut(500);
                            //$(".OverlaySpinner").fadeOut(500);
                        });
                } else {
                    $http({ method: 'GET', url: 'api/City/GetListCity', params: { page: page, rowspPage: pageSize, CityCode: name, Name: name, Province: name } }).
                        then(function (response) {
                            //  console.log(response.data);

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
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.citycode, $scope.filterOptions.name, $scope.filterOptions.ProvinceName, $scope.filterOptions.isActive);
            }
        }, true);

        //clear filter
        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.filterOptions.citycode = "";
            $scope.filterOptions.name = "";
            $scope.filterOptions.ProvinceName = "";
            $('#FilterProvinceName').val('');
            $scope.filterOptions.isActive = "1";
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync(pageSize, currentPage);
        };



        $scope.$watch('filterOptions.name', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (!newVal) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, 1, $scope.filterOptions.name);
                }
            }
        }, true);

        document.querySelector('#inputSearch').addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) { // 13 is enter
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, 1, $scope.filterOptions.name);
            }
        });
        //fungsi search
        $scope.search = function (name) {
            //note isactive tidk
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, name);
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
                    field: 'CityCode', displayName: 'Kode Kota', width: 100
                },
                {
                    field: 'Name', displayName: 'Nama Kota', width: 350
                },
                {
                    field: 'ProvinceName', displayName: 'Nama Provinsi'
                },
                { field: 'IsActive', displayName: 'Aktif', cellTemplate: statusTemplate1, width:75 },
                {
                    displayName: 'Tindakan',
                    cellTemplate: '<button class="btn btn-default" ng-click="openPopUp(row.entity)" ><i class="fa fa-pencil"></i></button>  <button class="btn btn-default" ng-click="delete(row.entity)" ><i class="fa fa-remove"></i></button> ',
                    width: 80
                }
            ]
        };

        //fungsi delete faq
        $scope.delete = function (formData) {
            var data = formData
            formData.Url = '#!' + $location.path();
            //if (confirm("Apakah Anda Yakin?")) {
            swalAlert.confirm(function (isConfirm) {
                if (isConfirm.value) {
                    var res = $http.post('api/City/DeleteCity', formData)
                        .then(function (response) {
                            //$window.alert(response.data.message);
                            swalAlert.message('s', response.data.message);
                            //$scope.refreshOptionGrid();
                            $scope.search();
                        });
                } else {
                    $scope.search();
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
            //console.log(formData);
            if (formData !== null) {
                data = formData;
                $scope.model = data;
            } else {
                $scope.model = null;
            }
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'citycmsComponent',
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
        $scope.downloadTemplateXls = function () {
            //open("/Content/templateImport/City.xlsx");
            $http({ method: 'GET', url: 'api/download/GetCityTemplate', params: { DateFrom: $scope.dateFrom, DateTo: $scope.dateTo } })
          .then(function (response) {
              if (response.data.isSucceed) {
                  document.location.href = '/File/' + response.data.CustomField.filename;
              }
          }).finally(function () {
              $('.spinner').fadeOut(500);
              $(".OverlaySpinner").fadeOut(500);
          });
        }
        $scope.openPopUpImportData = function () {
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'importCityComponent',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            })
        };

        $scope.ImportXls = function () {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            var file = $scope.myFile;
            var fd = new FormData();
            fd.append('file', file);

            $http.post('api/City/Import', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function SuccesCallbBack(response) {
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
                if (response.data.isSucceed) {
                    swalAlert.message('s', response.data.message);
                }
                else {
                    swalAlert.message('e', response.data.message);
                }
            }, function errorCallback(response) {
                swalAlert.message('s', response.data.ExceptionMessage);
            });
            $scope.search();
        };
    }

    function lookUpProvinsiController($scope, myService, $http, $uibModal, $log, $document, swalAlert) {
        var $ctrl = this;

        $scope.selectedItem = null;
        $scope.filterOptions3 = {
            provinceCode: "",
            provinceName: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions3 = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData3 = function (data, page, pageSize, length) {
            $scope.provinceData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync3 = function (pageSize, page, provincecode, provincename) {
            setTimeout(function () {
                var data;
                $http({ method: 'GET', url: 'api/Province/GetListProvince', params: { page: page, rowspPage: pageSize, provinceCode: provincecode, provinceName: provincename } }).
                    then(function (response) {
                        if (response.data.length <= 0) {
                            $scope.totalServerItems = 0;
                        }
                        $scope.setPagingData3(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    });
            }, 100);
        };

        $scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage);

        $scope.$watch('pagingOptions3', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage, $scope.filterOptions3.provinceCode, $scope.filterOptions3.provinceName);
            }
        }, true);

        $scope.search3 = function (provincecode, provincename) {
            $scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage, provincecode, provincename);
        };
        $scope.clearFilter3 = function (pageSize, currentPage) {
            $scope.filterOptions3.filterText = "";
            $scope.getPagedDataAsync3(pageSize, currentPage);
        };

        $scope.grid3Options = {
            data: 'provinceData',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions3,
            filterOptions: $scope.filterOptions3,
            columnDefs: [
                { field: 'ProvinceCode', displayName: 'Kode Provinsi' },
                { field: 'ProvinceName', displayName: 'Nama Provinsi' }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedItem = row.selectionProvider.selectedItems;
                }
            },
        };
        $scope.cancelLookUpProvince = function () {
            $scope.$resolve.items.modalInstance.close();
        };

        $scope.chooseProvince = function () {
            if ($scope.selectedItem !== null) {
                if (typeof $scope.$resolve.items.city !== "undefined") {
                    $scope.$resolve.items.city.provinceCode = $scope.selectedItem[0].ProvinceCode;
                    $scope.$resolve.items.city.ProvinceName = $scope.selectedItem[0].ProvinceName;
                }
                else {
                    $('#FilterProvinceName').val($scope.selectedItem[0].ProvinceName);
                }
                $scope.$resolve.items.modalInstance.close();
            }
            else {
                swalAlert.message('i', 'Pilih Provinsi!');
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

                $http.post('api/City/Import', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function SuccesCallbBack(response) {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                    if (response.data.isSucceed) {
                        swalAlert.message('s', response.data.message);
                        $ctrl.close();
                    }
                    else {
                        swalAlert.message('e', response.data.message);
                    }
                    $ctrl.resolve.items.search();
                }, function errorCallback(response) {
                    //$window.alert(response.data.ExceptionMessage);
                    swalAlert.message('s', response.data.ExceptionMessage);
                });
                //$ctrl.resolve.items.search();
            };
        }
    }

})(angular.module('SunLifeApp'));