(function (app) {
    'use strict';

    app.controller('fileUploadController', fileUploadController);
    fileUploadController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];

    app.component('fileUploadComponent', {
        templateUrl: 'fileUpload.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function ($http, $scope, $window, swalAlert) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                var dataResolve = $ctrl.resolve.items;
                //Button Cancel:
                $ctrl.cancel = function () {
                    $ctrl.dismiss();
                    dataResolve.search();
                };

                //Upload File
                $ctrl.uploadFile = function () {

                    var file = $scope.myFile;

                    var fd = new FormData();
                    fd.append('file', file);

                    $http.post('api/FileUpload/Submit', fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }).then(function SuccesCallbBack(response) {
                        if (response.data.isSucceed) {
                            //$window.alert(response.data.message);
                            swalAlert.message('s', response.data.message);
                            $ctrl.close();
                            dataResolve.search();
                        } else {
                            swalAlert.message('e', response.data.message);
                        }
                    }, function errorCallback(response) {
                        //$window.alert(response.data.ExceptionMessage);
                        swalAlert.message('e', response.data.ExceptionMessage);
                    });
                };
            }
        }
    });

    function fileUploadController($scope, myService, $http, $uibModal, $log, $document, $window,swalAlert) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.filterOptions = {
            filterText: "",
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
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            setTimeout(function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                var data;
                $http({ method: 'GET', url: 'api/FileUpload/GetListFileUpload', params: { fileName: searchText, page: page, rowsPage: pageSize } }).
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
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

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
                //{
                //    displayName: '', cellTemplate:
                //    '<button class="btn btn-danger" ng-click="delete(row.entity)">Hapus</button>', width: 80
                //},
                { field: 'ID', displayName: 'ID', visible: false, width: 70 },
                { field: 'FileName', displayName: 'Nama File', width: 420 },
                { field: 'Path', displayName: 'Path', width: 650, enableCellEdit: true, wordWrap: true }
            ]
        };



        $scope.delete = function (formData) {
            var data = formData;
            if (confirm("Are you sure?")) {
                var res = $http.post('api/FileUpload/DeleteFileUpload', formData)
                    .then(function (response) {
                        //$window.alert(response.data.message);
                        swalAlert.message('s', response.data.message);
                    }, function errorCallback(response) {
                        //$window.alert(response.data.ExceptionMessage);
                        swalAlert.message('e', response.data.ExceptionMessage);
                    });
                $scope.refreshOptionGrid();
            }
        };

        //clear filter
        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.filterOptions.filterText = "";
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync(pageSize, currentPage);
        };

        $scope.search = function (fileName) {
            //myService.showSpinner();

            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, fileName);
        };
        $scope.refreshOptionGrid = function (Description) {
            var pagee = ($scope.totalServerItems) % $scope.pagingOptions.pageSize;
            var currentPage = $scope.pagingOptions.currentPage;
            if (pagee === 1) {
                currentPage -= 1;
                $scope.pagingOptions.currentPage -= 1;
                $scope.totalServerItems -= 1;
            }
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, currentPage, Description);
        };

        $scope.openPopUp = function (formData) {
            var data;
            if (formData !== null) {
                data = formData;
                $scope.model = data;
            }
            else {
                $scope.model = null;
            }
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'fileUploadComponent',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            })
            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                $log.info('modal-component dismissed at: ' + new Date());
            });
        };


    };
})(angular.module('SunLifeApp'));
