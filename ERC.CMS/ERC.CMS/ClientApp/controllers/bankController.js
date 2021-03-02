(function (app) {
    'use strict';
    app.controller('bankController', bankController);
    app.controller('popUpBankController', popUpBankController);
    app.controller('popUpImportDataController', popUpImportDataController);

    bankController.$inject = ['$scope', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpBankController.$inject = ['$scope', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpImportDataController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];

    app.component('bankComponent', {
        templateUrl: 'bankContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpBankController
    });
    app.component('importBankComponent', {
        templateUrl: 'importData.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpImportDataController
    });

    function bankController($scope, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.filterOptions = {
            bankName: "",
            useExternalFilter: true
        };

        $scope.totalServerItems = 0;

        $scope.pagingOptions = {
            pageSize: 15,
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
        $scope.getPagedDataAsync = function (pageSize, page, bankname) {
            setTimeout(function () {
                //$('.spinner').fadeIn(500);
                //$(".OverlaySpinner").fadeIn(500);
                $http({ method: 'GET', url: 'api/Bank/GetListBank', params: { page: page, rowspPage: pageSize, bankName: bankname } }).
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

        //clear filter
        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.pagingOptions.currentPage = 1;
            $scope.filterOptions.bankName = "";
            $scope.getPagedDataAsync(pageSize, currentPage);
        };

        $scope.$watch('filterOptions.bankName', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (!newVal) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, 1, $scope.filterOptions.bankName);
                }
            }
        }, true);

        document.querySelector('#inputSearch').addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) { // 13 is enter
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, 1, $scope.filterOptions.bankName);
            }
        });

        //fungsi search
        $scope.search = function (bankName) {
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, bankName);
        };

        var statusTemplate = "<div>{{COL_FIELD == 1 ? 'Ya' : 'Tidak' }}</div>";

        //bind data
        $scope.gridOptions = {
            data: 'myData',
            enablePaging: true,
            showFooter: true,
            enableColumnResize:true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
            },
            columnDefs: [
                { field: 'ID', displayName: 'Id', visible: false },
                { field: 'BankCode', displayName: 'Kode Bank', width: 75 },
                { field: 'BankName', displayName: 'Nama Bank' },
                { field: 'IsActive', displayName: 'Aktif', cellTemplate: statusTemplate, width: 50 },
                {
                    cellTemplate: '<button class="btn btn-default" ng-click="openPopUp(row.entity)"><i class="fa fa-pencil"></i></button>  <button class="btn btn-default" ng-click="delete(row.entity)"><i class="fa fa-remove"></i></button>',
                    width: 80,
                    displayName: 'Tindakan'
                }
            ]
        };

        //fungsi delete faq
        $scope.delete = function (formData) {
            formData.Url = '#!' + $location.path();
            swalAlert.confirm(function (isConfirmed) {
                if (isConfirmed.value) {
                    var data = formData;
                    var res = $http.post('api/Bank/Delete', formData)
                        .then(function (response) {
                            swalAlert.message('s', response.data);
                        });
                    $scope.refreshOptionGrid();
                }
            });

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
                component: 'bankComponent',
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
            //open("/Content/templateImport/Bank.xlsx");

            $http({ method: 'GET', url: 'api/download/GetBankTemplate', params: { DateFrom: $scope.dateFrom, DateTo: $scope.dateTo } })
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
                component: 'importBankComponent',
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

            $http.post('api/Bank/Import', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function SuccesCallbBack(response) {
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
                if (response.data.isSucceed) {
                    swalAlert.message('s',response.data.message);
                    $ctrl.close();
                }
                else {
                    swalAlert.message('e', response.data.message);
                }
            }, function errorCallback(response) {
                swalAlert.message('e', Sresponse.data.ExceptionMessage);
            });
            $scope.search();
        };
    }

    function popUpBankController($scope, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;
        $ctrl.readonly = false;
        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            if (dataResolve.model !== undefined) {
                $ctrl.bank = dataResolve.model;
                $ctrl.readonly = true;
            } else {
                $ctrl.bank = { BankCode: "", BankName: "", IsActive: true };
            }
        };

        //Button Save:
        $ctrl.ok = function (formData) {
            formData.Url = '#!' + $location.path();
            //console.log(formData);
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            var res = $http.post('api/Bank/Submit', formData)
                .then(function SuccessCallBack(response) {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                    if (response.data.isSucceed) {
                        swalAlert.message('s',response.data.message);
                        $ctrl.close();
                    }
                    else {
                        swalAlert.message('e', response.data.message);
                    }
                }, function errorCallback(response) {
                    swalAlert.message('e', response.data.ExceptionMessage);
                }).finally(function () {
                    $ctrl.resolve.items.search($ctrl.resolve.items.filterOptions.bankName);
                    //$ctrl.resolve.items.search();
                });
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search($ctrl.resolve.items.filterOptions.bankName);
            //$ctrl.resolve.items.search();
        };
    }

    function popUpImportDataController($scope, myService, $http, $uibModal, $log, $document, $window,swalAlert) {
        var $ctrl = this;
        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            //Button Cancel:
            $ctrl.cancelImport = function () {
                $ctrl.dismiss();
            };
            //Import Data
            $ctrl.ImportXls = function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);

                $http.post('api/Bank/Import', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function SuccesCallbBack(response) {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                    if (response.data.isSucceed) {
                        swalAlert.message('s',response.data.message);
                        $ctrl.close();
                    }
                    else {
                        swalAlert.message('e', response.data.message);
                    }
                }, function errorCallback(response) {
                    swalAlert.message('e', Sresponse.data.ExceptionMessage);
                });
                $ctrl.resolve.items.search();
            };
        }
    }

})(angular.module('SunLifeApp'));