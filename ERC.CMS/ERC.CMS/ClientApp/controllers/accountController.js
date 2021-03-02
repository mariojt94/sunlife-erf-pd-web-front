(function (app) {
    'use strict';
    app.controller('accountController', accountController);
    app.controller('popUpAccountCtrl', popUpAccountCtrl);
    app.controller('popUpTeamController', popUpTeamController);

    app.controller('popUpManagerCtrl', popUpManagerCtrl);
    app.controller('popUpSeniorManagerCtrl', popUpSeniorManagerCtrl);
    app.controller('popUpDirectorCtrl', popUpDirectorCtrl);
    app.controller('popUpChangePassword', popUpChangePassword);
    app.controller('popUpUploadUser', popUpUploadUser);
    app.config(['$qProvider', function ($qProvider) { $qProvider.errorOnUnhandledRejections(false); }]);

    accountController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpAccountCtrl.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpTeamController.$inject = ['$scope', '$http', '$uibModal', '$log', '$document', 'swalAlert'];

    popUpManagerCtrl.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpSeniorManagerCtrl.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpDirectorCtrl.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpChangePassword.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpUploadUser.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];

    app.component('accountComponent', {
        templateUrl: 'accountContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpAccountCtrl
    });

    app.component('teamComponent', {
        templateUrl: 'teamPopup.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpTeamController
    });
    app.component('lokasiComponent', {
        templateUrl: 'lokasiPopup.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpLokasiController
    });

    app.component('managerComponent', {
        templateUrl: 'managerPopUp.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpManagerCtrl
    });

    app.component('seniormanagerComponent', {
        templateUrl: 'seniormanagerPopUp.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpSeniorManagerCtrl
    });

    app.component('directorComponent', {
        templateUrl: 'directorPopUp.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpDirectorCtrl
    });

    app.component('changePasswordComponent', {
        templateUrl: 'changePasswordContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpChangePassword
    });

    app.component('uploadUserComponent', {
        templateUrl: 'uploadUser.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpUploadUser
    });

    function accountController($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.filterOptions = {
            DisplayName: "",
            filterRoleID: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSize: 15,
            currentPage: 1
        };
        $scope.setPagingData = function (data, page, pageSize, length) {
            $scope.myData = data;
            $scope.totalServerItems = length;
        };

        $scope.getPagedDataAsync = function (pageSize, page, search) {
            setTimeout(function () {
                var data;
                //$('.spinner').fadeIn(500);
                //$(".OverlaySpinner").fadeIn(500);
                $http({ method: 'GET', url: 'api/Account/GetListUser', params: { displayName: search, page: page, rowspPage: pageSize, role: search } }).
                    then(function (response) {
                        $scope.setPagingData(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    }).finally(function () {
                        //$('.spinner').fadeOut(500);
                        //$(".OverlaySpinner").fadeOut(500);
                    });
            }, 500);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.DisplayName);
            }
        }, true);

        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.filterOptions.DisplayName = "";
            $scope.filterOptions.filterRoleID = "";
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync(pageSize, currentPage);
        };

        var statusTemplate = "<div>{{COL_FIELD == 1 ? '<i class='fa fa-check' aria-hidden='true'></i>' : '<i class='fa fa-times' aria-hidden='true'></i>' }}</div>";
        var statusTemplate1 = "<div>{{COL_FIELD == 1 ? 'Ya' : 'Tidak' }}</div>";
        var statusTemplate2 = "<div>{{COL_FIELD == 1 ? 'Ya' : 'Tidak' }}</div>";
        var statusTemplate3 = "<div>{{COL_FIELD >= 3 ? 'Ya' : 'Tidak' }}</div>";
        var statusTemplate4 = "<div>{{COL_FIELD == " + "L" + "? 'Laki-laki' : 'Perempuan' }}</div>";

        $scope.gridOptions = {
            data: 'myData',
            enablePaging: true,
            showFooter: true,
            enableColumnResize: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
            },
            columnDefs: [
                { field: 'LoginName', displayName: 'Nama Login', width: 70 },
                { field: 'DisplayName', displayName: 'Nama User', width: 250 },
                { field: 'TeamCode', displayName: 'Kode Team', width: 100, 'visible': false },
                { field: 'RoleName', displayName: 'RoleName', width: 70 },
                { field: 'TeamName', displayName: 'Team', width: 250 },
                { field: 'LocationName', displayName: 'Lokasi', width: 250 },
                { field: 'HiringDate', displayName: 'Hiring Date', width: 80 },
                { field: 'StatusEffective', displayName: 'Status Effective', width: 100 },
                { field: 'Email', displayName: 'Email', width: 200 },
                { field: 'IsActive', displayName: 'Aktif ?', cellTemplate: statusTemplate1, width: 50 },
                { field: 'RoleID', displayName: 'Role ID', width: 100, 'visible': false },
                {
                    displayName: 'Tindakan',
                    cellTemplate: '<button class="btn btn-default" ng-click="openPopUp(row.entity)"><i class="fa fa-pencil"></i></button>  <button class="btn btn-default" ng-click="delete(row.entity)"><i class="fa fa-remove"></i></button> ',
                    width: 80
                },
            ]
        };

        //Function to Delete User
        $scope.delete = function (formData) {
            formData.Url = '#!' + $location.path();
            var data = formData;
            swalAlert.confirm(function (isConfirmed) {
                if (isConfirmed.value) {
                    var res = $http.post('api/Account/DeleteUser', formData)
              .then(function (response) {
                  //$window.alert(response.data);
                  swalAlert.message('i', response.data)
              });
                    $scope.refreshOptionGrid();
                }
            });
        };

        $scope.$watch('filterOptions.DisplayName', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (!newVal) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, 1, $scope.filterOptions.DisplayName);
                }
            }
        }, true);

        document.querySelector('#inputSearch').addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) { // 13 is enter
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, 1, $scope.filterOptions.DisplayName);
            }
        });

        $scope.search = function () {
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.DisplayName);
            //$scope.refreshOptionGrid();
        };

        $scope.refreshOptionGrid = function () {
            var pagee = ($scope.totalServerItems) % $scope.pagingOptions.pageSize;
            var currentPage = $scope.pagingOptions.currentPage;
            if (pagee == 1) {
                currentPage -= 1;
                $scope.pagingOptions.currentPage -= 1;
                $scope.totalServerItems -= 1;
            }

            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, currentPage, $scope.filterOptions.DisplayName);
        };

        //Dropdown Role
        $scope.RoleList = null;
        $scope.fillRoleList = function () {
            $http({
                method: 'GET',
                url: 'api/Role/GetAllRole'
            }).then(function (response) {
                $scope.RoleList = response.data;
            });
        };
        $scope.fillRoleList();

        $scope.openPopUp = function (formData) {
            var data;
            if (formData != null) {
                data = formData;
                $scope.model = data;
            } else {
                $scope.model = null;
            }
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'accountComponent',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            })
            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                //$log.info('modal-component dismissed at: ' + new Date());
            });
        };

        $scope.openPopUpUploadUser = function () {

            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'uploadUserComponent',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            })
            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                //$log.info('modal-component dismissed at: ' + new Date());
            });
        };

        $scope.downloadTemplateXls = function () {
            //open("/Content/templateImport/UserList.xlsx");
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            $http({ method: 'GET', url: 'api/download/GetAccount', params: { DateFrom: $scope.dateFrom, DateTo: $scope.dateTo } })
          .then(function (response) {
              if (response.data.isSucceed) {
                  document.location.href = '/File/' + response.data.CustomField.filename;
              }
          }).finally(function () {
              $('.spinner').fadeOut(500);
              $(".OverlaySpinner").fadeOut(500);
          });
        }

        $scope.ImportXls = function () {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            var file = $scope.myFile;
            var fd = new FormData();
            fd.append('file', file);
            $http.post('api/Account/ImportUser', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function (response) {
                if (response.data.isSucceed) {
                    swalAlert.message('s', response.data.message);
                }
                else {
                    swalAlert.message('e', response.data.message);
                }
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, 1, $scope.filterOptions.DisplayName);
            }).finally(function () {
                console.log('masuk keneh');
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
            });
            $scope.search();
        };

        $scope.openPopUpPassword = function (formData) {
            var data;
            if (formData != null) {
                data = formData;
                $scope.model = data;
                var Name = data.LoginName;
            } else {
                $scope.model = null;
            }
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'changePasswordComponent',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            })

            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                //$log.info('modal-component dismissed at: ' + new Date());
            });
        };
    };

    function popUpAccountCtrl($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;

        $scope.options = {
            minDate: new Date(),
            showWeeks: true
        };

        $ctrl.$onInit = function () {
            $scope.isEdit = false;
            var dataResolve = $ctrl.resolve.items;
            var types = dataResolve.TypeList;
            var roles = dataResolve.RoleList;
            if (dataResolve.model != null) {
                $scope.isEdit = true;
                $ctrl.account = dataResolve.model;
                $ctrl.account.Id = 1;
                $ctrl.account.Password = '';
                $ctrl.account.JoinDate = $ctrl.account.JoinDate == "0001-01-01T00:00:00" ? new Date() : $ctrl.account.JoinDate;
                $ctrl.account.BirthDate = $ctrl.account.BirthDate == "0001-01-01T00:00:00" ? new Date() : $ctrl.account.BirthDate;
                $ctrl.account.TypeList = types;
                $ctrl.account.RoleList = roles;
                $ctrl.isEdit = true; // buat is loginname
            } else {
                $ctrl.account = { Id: '0', TypeList: types, RoleList: roles, JoinDate: new Date(), BirthDate: new Date() };
                $ctrl.isEdit = false; // buat is loginname
            }
        }

        //Button Save:
        $ctrl.ok = function (formData) {
            formData.Url = '#!' + $location.path();
            //console.log(formData.Url);
            var res = $http.post('api/Account/Submit', formData)
            .then(function SuccessCallBack(response) {
                if (response.data.isSucceed) {
                    //$window.alert(response.data.message);
                    swalAlert.message('s', response.data.message)
                    $ctrl.close();
                }
                else {
                    swalAlert.message('e', response.data.message)
                    //$window.alert(response.data.message);
                }
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                swalAlert.message('e', response.data.ExceptionMessage);
            }).finally(function () {
                $ctrl.resolve.items.search($ctrl.resolve.items.filterOptions.DisplayName);
            });
        }

        //Button Cancel:
        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search($ctrl.resolve.items.filterOptions.DisplayName);
        };

        $scope.openLookupTeam = function () {
            $ctrl.modalInstance = $uibModal.open({
                templateUrl: 'teamPopup.html',
                controller: popUpTeamController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $ctrl;
                    }
                }
            });
        }
        $scope.openLookupLokasi = function () {
            $ctrl.modalInstance = $uibModal.open({
                templateUrl: 'lokasiPopup.html',
                controller: popUpLokasiController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $ctrl;
                    }
                }
            });
        }

        $scope.lookup = function () {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'managerPopUp.html',
                controller: popUpManagerCtrl,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        }

        $scope.lookupSenior = function () {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'seniormanagerPopUp.html',
                controller: popUpSeniorManagerCtrl,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        }

        $scope.lookupDirector = function () {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'directorPopUp.html',
                controller: popUpDirectorCtrl,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        }
    }

    function popUpTeamController($scope, $http, $uibModal, $log, $document, swalAlert) {
        var $ctrl = this;
        $scope.selectedItem = null;
        $scope.filterOptionsTeam = {
            teamName: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptionsTeam = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingDataTeam = function (data, page, pageSize, length) {
            $scope.DataTeam = data;
            $scope.totalServerItems = length;
        };

        $scope.getPagedDataAsyncTeam = function (pageSize, page, teamName) {
            setTimeout(function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                var data;
                $http({ method: 'GET', url: 'api/Team/GetListTeamLookUp', params: { page: page, rowspPage: pageSize, TeamName: teamName } }).
                    then(function (response) {
                        $scope.setPagingDataTeam(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    }).finally(function () {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    });
            }, 100);
        };

        $scope.getPagedDataAsyncTeam($scope.pagingOptionsTeam.pageSize, $scope.pagingOptionsTeam.currentPage);

        $scope.$watch('pagingOptionsTeam', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsyncTeam($scope.pagingOptionsTeam.pageSize, $scope.pagingOptionsTeam.currentPage, $scope.filterOptionsTeam.teamName);
            }
        }, true);

        $scope.searchTeam = function (teamName) {
            $scope.getPagedDataAsyncTeam($scope.pagingOptionsTeam.pageSize, 1, teamName);
        };
        $scope.clearFilterTeam = function (pageSize, currentPage) {
            $scope.filterOptionsTeam.teamName = "";
            $scope.getPagedDataAsyncTeam(pageSize, currentPage);
        };
        var statusTemplate1 = "<div>{{COL_FIELD == 1 ? 'Ya' : 'Tidak' }}</div>";
        $scope.gridTeamOptions = {
            data: 'DataTeam',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptionsTeam,
            filterOptions: $scope.filterOptionsTeam,
            columnDefs: [
                { field: 'TeamCode', displayName: 'Kode Tim', width: 100 },
                { field: 'TeamName', displayName: 'Nama Tim', width: 300 },
                //{ field: 'LocationName', displayName: 'Nama Lokasi' },
                { field: 'Syariah', displayName: 'Syariah', cellTemplate: statusTemplate1, width: 100 }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedTeam = row.selectionProvider.selectedItems;
                }
            },
        };
        $scope.cancelLookupTeam = function () {
            $scope.$resolve.items.modalInstance.close();
        };

        $scope.chooseTeam = function () {
            if ($scope.selectedTeam !== null) {
                $scope.$resolve.items.account.TeamCode = $scope.selectedTeam[0].TeamCode;
                $scope.$resolve.items.account.TeamName = $scope.selectedTeam[0].TeamName;
                $scope.$resolve.items.modalInstance.close();
            }
            else {
                swalAlert.message('i', 'Pilih Team!');
            }
        };
    }

    function popUpLokasiController($scope, $http, $uibModal, $log, $document) {
        var $ctrl = this;
        $scope.selectedItem = null;
        $scope.filterOptionsLocation = {
            locationName: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptionsLocation = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingDataLocation = function (data, page, pageSize, length) {
            $scope.DataLocation = data;
            $scope.totalServerItems = length;
        };

        $scope.getPagedDataAsyncLocation = function (pageSize, page, LocationName) {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            setTimeout(function () {
                var data;
                $http({ method: 'GET', url: 'api/Location/GetListLocation', params: { page: page, rowspPage: pageSize, AgentLocation: LocationName } }).
                    then(function (response) {
                        $scope.setPagingDataLocation(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    }).finally(function () {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    });
            }, 100);
        };

        $scope.getPagedDataAsyncLocation($scope.pagingOptionsLocation.pageSize, $scope.pagingOptionsLocation.currentPage);

        $scope.$watch('pagingOptionsLocation', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsyncLocation($scope.pagingOptionsLocation.pageSize, $scope.pagingOptionsLocation.currentPage, $scope.filterOptionsLocation.LocationName);
            }
        }, true);

        $scope.searchLocation = function (LocationName) {
            $scope.getPagedDataAsyncLocation($scope.pagingOptionsLocation.pageSize, $scope.pagingOptionsLocation.currentPage, LocationName);
        };
        $scope.clearFilterLocation = function (pageSize, currentPage) {
            $scope.filterOptionsLocation.locationName = "";
            $scope.getPagedDataAsyncLocation(pageSize, currentPage);
        };
        $scope.gridLocationOptions = {
            data: 'DataLocation',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptionsLocation,
            filterOptions: $scope.filterOptionsLocation,
            columnDefs: [
                { field: 'AgentLocationCode', displayName: 'Kode Lokasi', width: 100 },
                { field: 'AgentLocation', displayName: 'Lokasi', width: 300 },
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedLocation = row.selectionProvider.selectedItems;
                }
            },
        };
        $scope.cancelLookupLocation = function () {
            $scope.$resolve.items.modalInstance.close();
        };

        $scope.chooseLocation = function () {
            if ($scope.selectedLocation !== null) {
                $scope.$resolve.items.account.LocationCode = $scope.selectedLocation[0].AgentLocationCode;
                $scope.$resolve.items.account.LocationName = $scope.selectedLocation[0].AgentLocation;
                $scope.$resolve.items.modalInstance.close();
            }
            else {

                swalAlert.message('i', 'Pilih Lokasi!')

                //alert('Pilih Lokasi!');
            }
        };
    }

    //======================================================

    function popUpChangePassword($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;
        //var dataResolves = $ctrl.resolve.items;
        $ctrl.$onInit = function () {
            var dataResolves = $ctrl.resolve.items;
            if (dataResolves.model != null) {
                $ctrl.account = dataResolves.model;
            }
            else {
                //  $ctrl.model = { LoginName: $scope.$resolve.items.$ctrl.account.LoginName };
            }
        }

        //save new password
        $ctrl.savePassword = function (formData) {
            // console.log("");
            formData.Url = '#!' + $location.path();
            var res = $http.post('/api/Account/ChangePasswordGrid', formData)
            .then(function (response) {
                if (response.data.isSucceed) {
                    //$window.alert(response.data.message);
                    swalAlert.message('s', response.data.message);
                    $ctrl.close();
                } else {
                    //$window.alert(response.data.message);
                    swalAlert.message('i', response.data.message);
                }

            });
        };

        $ctrl.cancelPassword = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search();
        }
    }

    function popUpManagerCtrl($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;

        $scope.selectedItem = null;
        $scope.filterOptions2 = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions2 = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData2 = function (data, page, pageSize, length) {
            $scope.managerData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //filter manager based on business type dropdown
        $scope.getPagedDataAsync2 = function (pageSize, page, searchText) {
            setTimeout(function () {
                var data;
                var typeid = $scope.$resolve.items.$ctrl.account.TypeID;
                $http({ method: 'GET', url: 'api/Account/GetManager', params: { displayName: searchText, page: page, rowsPage: pageSize } }).
                    then(function (response) {
                        if (response.data.length <= 0) {
                            $scope.myData = response.data;
                            $scope.totalServerItems = 0;
                        }
                        $scope.setPagingData2(response.data, page, pageSize);
                    });
            }, 100);
        };

        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);

        $scope.$watch('pagingOptions2', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
            }
        }, true);

        $scope.search2 = function (name) {
            $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, name);
        };
        $scope.clearFilter2 = function (pageSize, currentPage) {
            $scope.filterOptions2.filterText = "";
            $scope.getPagedDataAsync2(pageSize, currentPage);
        };


        //var statusTemplate7 = "<div>{{COL_FIELD == 1 ? 'Admin' : 'User' }}</div>";
        $scope.grid2Options = {
            data: 'managerData',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions2,
            filterOptions: $scope.filterOptions2,
            columnDefs: [
                { field: 'LoginName', displayName: 'Nama' },
                { field: 'DisplayName', displayName: 'Tampilan Nama' }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedItem = row.selectionProvider.selectedItems;
                }
            },
        };

        $scope.cancelManager = function () {
            $scope.$resolve.items.modalInstance.close();
        };

        $scope.okManager = function () {
            if ($scope.selectedItem != null) {
                $scope.$resolve.items.account = { ManagerLoginName: $scope.selectedItem[0].LoginName };
                $scope.$resolve.items.$ctrl.account.ManagerLoginName = $scope.selectedItem[0].LoginName;
                $scope.$resolve.items.modalInstance.close();
            }
            else {

                swalAlert.message('i', 'Please Choose');
                //$window.alert('Please Choose !!!');
            }
        };
    }

    function popUpSeniorManagerCtrl($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;

        $scope.selectedItem = null;
        $scope.filterOptions2 = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions2 = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData2 = function (data, page, pageSize, length) {
            $scope.managerData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //filter manager based on business type dropdown
        $scope.getPagedDataAsync2 = function (pageSize, page, searchText) {
            setTimeout(function () {
                var data;
                var typeid = $scope.$resolve.items.$ctrl.account.TypeID;
                $http({ method: 'GET', url: 'api/Account/GetManager', params: { loginName: searchText, page: page, rowsPage: pageSize } }).
                    then(function (response) {
                        if (response.data.length <= 0) {
                            $scope.myData = response.data;
                            $scope.totalServerItems = 0;
                        }
                        $scope.setPagingData2(response.data, page, pageSize);
                    });
            }, 100);
        };

        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);

        $scope.$watch('pagingOptions2', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
            }
        }, true);

        $scope.search2 = function (name) {
            $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, name);
        };
        $scope.clearFilter2 = function (pageSize, currentPage) {
            $scope.filterOptions2.filterText = "";
            $scope.getPagedDataAsync2(pageSize, currentPage);
        };

        $scope.grid3Options = {
            data: 'managerData',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions2,
            filterOptions: $scope.filterOptions2,
            columnDefs: [
                { field: 'LoginName', displayName: 'Nama' },
                { field: 'DisplayName', displayName: 'Tampilan Nama' }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedItem = row.selectionProvider.selectedItems;
                }
            },
        };

        $scope.cancelSeniorManager = function () {
            $scope.$resolve.items.modalInstance.close();
        };

        $scope.okSeniorManager = function () {
            if ($scope.selectedItem != null) {
                $scope.$resolve.items.account = { SeniorManagerLoginName: $scope.selectedItem[0].LoginName };
                $scope.$resolve.items.$ctrl.account.SeniorManagerLoginName = $scope.selectedItem[0].LoginName;
                $scope.$resolve.items.modalInstance.close();
            }
            else {
                swalAlert.message('i', 'Please Choose');
                //$window.alert('Please Choose !!!');
            }
        };
    }

    function popUpDirectorCtrl($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;

        $scope.selectedItem = null;
        $scope.filterOptions2 = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions2 = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData2 = function (data, page, pageSize, length) {
            $scope.managerData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //filter manager based on business type dropdown
        $scope.getPagedDataAsync2 = function (pageSize, page, searchText) {
            setTimeout(function () {
                var data;
                var typeid = $scope.$resolve.items.$ctrl.account.TypeID;
                $http({ method: 'GET', url: 'api/Account/GetManager', params: { loginName: searchText, page: page, rowsPage: pageSize } }).
                    then(function (response) {
                        if (response.data.length <= 0) {
                            $scope.myData = response.data;
                            //console.log(response.data);
                            $scope.totalServerItems = 0;
                        }
                        $scope.setPagingData2(response.data, page, pageSize);
                    });
            }, 100);
        };

        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);

        $scope.$watch('pagingOptions2', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
            }
        }, true);

        $scope.search2 = function (name) {
            $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, name);
        };
        $scope.clearFilter2 = function (pageSize, currentPage) {
            $scope.filterOptions2.filterText = "";
            $scope.getPagedDataAsync2(pageSize, currentPage);
        };

        $scope.grid4Options = {
            data: 'managerData',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions2,
            filterOptions: $scope.filterOptions2,
            columnDefs: [
                { field: 'LoginName', displayName: 'Nama' },
                { field: 'DisplayName', displayName: 'Tampilan Nama' }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedItem = row.selectionProvider.selectedItems;
                }
            },
        };

        $scope.cancelDirector = function () {
            $scope.$resolve.items.modalInstance.close();
        };

        $scope.okDirector = function () {
            if ($scope.selectedItem != null) {
                $scope.$resolve.items.account = { DirectorLoginName: $scope.selectedItem[0].LoginName };
                $scope.$resolve.items.$ctrl.account.DirectorLoginName = $scope.selectedItem[0].LoginName;
                $scope.$resolve.items.modalInstance.close();
            }
            else {
                swalAlert.message('i', 'Please Choose');
                //$window.alert('Please Choose !!!');
            }
        };
    }

    function popUpUploadUser($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            //Button Cancel:
            $ctrl.cancelUploadUser = function () {
                $ctrl.dismiss();
                dataResolve.search();
            };

            //Upload File
            $ctrl.uploadUser = function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                var file = $scope.myFile;
                var fd = new FormData();
                fd.append('file', file);
                $http.post('api/Account/ImportUser', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function (response) {
                    if (response.data.isSucceed) {
                        //alert(response.data.message);
                        swalAlert.message('s', response.data.message);
                        $scope.getPagedDataAsyncTeam($scope.pagingOptionsTeam.pageSize, $scope.pagingOptionsTeam.currentPage);
                        $ctrl.close();
                    }
                    else {
                        swalAlert.message('e', response.data.message);
                        //alert(response.data.message);
                    }
                }).finally(function () {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                    $ctrl.resolve.items.search();
                });
            };
        }
    }
})(angular.module('SunLifeApp'));