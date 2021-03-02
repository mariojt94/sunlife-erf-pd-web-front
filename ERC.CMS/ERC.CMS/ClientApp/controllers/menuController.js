(function (app) {
    'use strict';
    app.controller('menuController', menuController);
    app.controller('popUpMenuController', popUpMenuController);

    menuController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert', 'authService', 'Idle', '$state', 'localStorageService', '$rootScope'];
    popUpMenuController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];

    app.component('menuComponent', {
        templateUrl: 'menuContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpMenuController
    });

    function popUpMenuController($scope, myService, $http, $uibModal, $log, $document, $window,swalAlert) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            if (dataResolve.model !== null) {
                $ctrl.menu = dataResolve.model;
            } else {
                $ctrl.menu = { Name: "", IsActive: false };
            }

        };

        //Button Save:
        $ctrl.ok = function (formData) {
            var res = $http.post('api/Menu/Submit', formData)
                .then(function SuccessCallBack(response) {
                    if (response.data.isSucceed) {
                        //$window.alert(response.data.message);
                        swalAlert.message('s',response.data.message);
                        $ctrl.close();
                    }
                    else {
                        //$window.alert(response.data.message);
                      swalAlert.message('e',response.data.message);
                    }
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //$window.alert(response.data.ExceptionMessage);
                    swalAlert.message('e',response.data.ExceptionMessage);
                });
            $ctrl.resolve.items.search();
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search();
        };
    }

    function menuController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert, authService, Idle, $state, localStorageService, $rootScope) {

        $('.spinner').fadeIn(1000);
        $(".OverlaySpinner").fadeIn(1000);

        var $ctrl = this;
        $ctrl.animationsEnabled = true;
        $scope.loginName = localStorageService.get('LoginName');


        //$('[data-toggle="tooltip"]').tooltip();
        $scope.check = function() {
            //console.log($rootScope.test);
            $('[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner large"></div></div>',
                content: function () {
                    
                    return $rootScope.test;
                }
            });
        };


        $scope.$watch('$root.test.length', function () {
            if (!$rootScope.test) return;
            if ($rootScope.test.includes("<b>Data Domisili<br>") && $rootScope.test.includes("<b>Data Pribadi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Ayah<br>") && $rootScope.test.includes("<b>Ibu<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data NPWP<br>") &&
                $rootScope.test.includes("<b>Data Kondisi Kesehatan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data NPWP<br>") &&
                $rootScope.test.includes("<b>Data Rencana Pribadi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") &&
                $rootScope.test.includes("<b>Data Rencana Pribadi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data NPWP<br>") &&
                $rootScope.test.includes("<b>Data Pribadi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") &&
                $rootScope.test.includes("<b>Data Pribadi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") &&
                $rootScope.test.includes("<b>Data Pribadi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Ayah<br>") &&
                $rootScope.test.includes("<b>Saudara<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Suami/Istri<br>") &&
                $rootScope.test.includes("<b>Saudara<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Anak<br>") &&
                $rootScope.test.includes("<b>Saudara<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Ayah<br>") &&
                $rootScope.test.includes("<b>Anak<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pendidikan Formal<br>") &&
                $rootScope.test.includes("<b>Pendidikan NonFormal<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pekerjaan<br>") &&
                $rootScope.test.includes("<b>Data Organisasi<br>")&&
                $rootScope.test.includes("<b>Prestasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 3;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Bahasa<br>") &&
                $rootScope.test.includes("<b>Keahlian<br>") &&
                $rootScope.test.includes("<b>Kelebihan & Kekurangan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 3;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pekerjaan<br>") &&
                $rootScope.test.includes("<b>Data Organisasi<br>")&&
                $rootScope.test.includes("<b>Prestasi<br>")&&
                $rootScope.test.includes("<b>Bahasa<br>")&&
                $rootScope.test.includes("<b>Keahlian<br>")&&
                $rootScope.test.includes("<b>Kelebihan & Kekurangan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 6;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pekerjaan<br>") &&
                $rootScope.test.includes("<b>Data Organisasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pekerjaan<br>") &&
                $rootScope.test.includes("<b>Prestasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pekerjaan<br>") &&
                $rootScope.test.includes("<b>Bahasa<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pekerjaan<br>") &&
                $rootScope.test.includes("<b>Keahlian<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Prestasi<br>") &&
                $rootScope.test.includes("<b>Keahlian<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Bahasa<br>") &&
                $rootScope.test.includes("<b>Keahlian<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Bahasa<br>") &&
                $rootScope.test.includes("<b>Prestasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Bahasa<br>") &&
                $rootScope.test.includes("<b>Data Organisasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            }  else if ($rootScope.test.includes("<b>Bahasa<br>") &&
                $rootScope.test.includes("<b>Kelebihan & Kekurangan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Keahlian<br>") &&
                $rootScope.test.includes("<b>Kelebihan & Kekurangan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Prestasi<br>") &&
                $rootScope.test.includes("<b>Kelebihan & Kekurangan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Prestasi<br>") &&
                $rootScope.test.includes("<b>Data Organisasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pekerjaan<br>") &&
                $rootScope.test.includes("<b>Kelebihan & Kekurangan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Keahlian<br>") &&
                $rootScope.test.includes("<b>Data Organisasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 2;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data NPWP<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Ayah<br>") || $rootScope.test.includes("<b>Ibu<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data Domisili<br>") ||
                $rootScope.test.includes("<b>Data Pribadi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Kontak<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pendidikan Formal<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data PTKP<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pekerjaan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Bahasa<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Anak<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Saudara<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Suami/Istri<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Data Organisasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Keahlian<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Prestasi<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            } else if ($rootScope.test.includes("<b>Kelebihan & Kekurangan<br>")) {
                $scope.jumlahNotif = $rootScope.test.length - 1;
                return $rootScope.test;
            }
            $scope.jumlahNotif = $rootScope.test.length;
        });

        $scope.checkOut = function() {
            $('[data-toggle="tooltip"]').tooltip("close");
        }

        //$rootScope.test = "TEST";
        //console.log($rootScope.test);
        //sunlife erf pd
        $scope.logOut = function () {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            localStorage.removeItem('ls.LoginName');
            localStorage.removeItem('ls.statusDataPribadi');
            localStorage.removeItem('ls.statusKontak');
            localStorage.removeItem('ls.statusDataKeluarga');
            localStorage.removeItem('ls.statusDataPendidikan');
            localStorage.removeItem('ls.statusDataPekerjaan');
            localStorage.removeItem('ls.statusDataDokumen');
            localStorage.removeItem('ls.statusDataPsikotes');
            authService.logOut();
            $state.go('auth');
            //$window.location.reload();
            Idle.watch();
            $('.spinner').fadeOut(500);
            $(".OverlaySpinner").fadeOut(500);
        }

        //sunlife erf pd
        $scope.setting =function() {
            $state.go('changePasswordFromSetting');
        }


        //sunlife erf pd
            $http({
                method: 'GET',
                url: 'api/Profile/GetAccountForProfile',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                $scope.AccountData = res.data;
                $scope.displayName = $scope.AccountData.DisplayName;
                $scope.namaDepan = $scope.AccountData.NamaDepan;
                $scope.namaBelakang = $scope.AccountData.NamaBelakang;
                $scope.email = $scope.AccountData.Email;
                $scope.phoneNo = $scope.AccountData.PhoneNo;
                $scope.sourceCandidate = $scope.AccountData.RefName;
                //$scope.AccountData.loginName = $scope.loginName;
                //console.log($scope.AccountData);

                $scope.checkKosong = $rootScope.test;
                //$scope.dataEdit.push($scope.namaLengkap, $scope.namaDepan, $scope.namaBelakang, $scope.email, $scope.noTelp, $scope.loginName);
            });
        
        //sunlife erf pd
        $http({
            method: 'GET',
            url: 'api/Profile/GetProfilePicture',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.AccountData = res.data;
            //console.log($scope.AccountData);
            $scope.PicPath = res.data.Path;
        });

        //sunlife erf pd
/*
        var listState = [];
        $scope.namaState = $state.current.name;
        console.log($state.current.name);
*/



        $('.spinner').fadeOut(1000);
        $(".OverlaySpinner").fadeOut(1000);


        $scope.filterOptions = {
            title: "",
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

        //fungsi pagging
        $scope.setPagingData = function (data, page, pageSize, length) {
            $scope.myData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //get data dari sever
        /*$scope.getPagedDataAsync = function (pageSize, page, title, isactive) {
            setTimeout(function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                if (name) {
                    $http({ method: 'GET', url: 'api/Menu/GetListMenu', params: { page: page, rowspPage: pageSize, Title: title } }).
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
                    $http({ method: 'GET', url: 'api/Menu/GetListMenu', params: { page: page, rowspPage: pageSize, Title: title } }).
                        then(function (response) {
                            $scope.setPagingData(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                        }).finally(function () {
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        });
                }
            }, 500);
        };*/

        // execute ambil data ke server
        //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        //event untuk memasukan filter
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.title, $scope.filterOptions.isActive);
            }
        }, true);

        //clear filter
        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.filterOptions.title = "";
            $scope.filterOptions.isActive = "1";
            $scope.pagingOptions.currentPage = 1;
            //$scope.getPagedDataAsync(pageSize, currentPage);
        };

        //fungsi search
        $scope.search = function (title, isActive) {
            $scope.pagingOptions.currentPage = 1
            //note isactive tidk
            //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, title, isActive);

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
                    cellTemplate: '<button class="btn btn-primary" ng-click="openPopUp(row.entity)">Ubah</button>',
                    width: 130
                },
                {
                    field: 'Icon', displayName: 'Ikon', width: 106
                },
                {
                    field: 'Title', displayName: 'Judul'
                },
                {
                    field: 'Link', displayName: 'Link Halaman', width: 410
                }
            ]
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
            //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, currentPage);
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
                component: 'menuComponent',
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

/*        $scope.countInbox = function () {
            $http({
                method: 'GET',
                url: 'api/Inbox/GetCountUnreadMessage'
            })
                .then(function (response) {
                    $scope.totalInbox = response.data;
                    $scope.displayNotif = $scope.totalInbox != 0;
                });
        };
        $scope.countInbox();*/
    }
})(angular.module('SunLifeApp'));