(function (app) {
    'use strict';
    app.controller('applicantStatusController', applicantStatusController);
    app.controller('popUpapplicantStatusController', popUpapplicantStatusController);

    applicantStatusController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'localStorageService', '$state', '$stateParams', 'swalAlert'];
    popUpapplicantStatusController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'swalAlert'];
    popUpTeamCtrl.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];

    app.component('applicantStatusComponent', {
        templateUrl: 'applicantStatusContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpapplicantStatusController
    });

    app.component('teamCheckComponent', {
        templateUrl: 'teamPopup.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpTeamCtrl
    });

    function popUpapplicantStatusController($scope, myService, $http, $uibModal, $log, $document, $window, $location, swalAlert) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            var dataResolve = $ctrl.resolve.items;
            if (dataResolve.model !== null) {
                $ctrl.city = dataResolve.model;
            } else {
                $ctrl.city = { Name: "", IsActive: false };
            }

        };

        $ctrl.ok = function (formData) {
            formData.Url = '#!' + $location.path();
            var res = $http.post('api/City/Submit', formData)
                .then(function SuccessCallBack(response) {
                    if (response.data.isSucceed) {
                        swalAlert.message('s', response.data.message);
                        $ctrl.close();
                    }
                    else {
                        swalAlert.message('e', response.data.message);
                    }
                }, function errorCallback(response) {
                    swalAlert.message('e', response.data.ExceptionMessage);
                });
            $ctrl.resolve.items.search();
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.search();
        };
    }

    function applicantStatusController($scope, myService, $http, $uibModal, $log, $document, $window, $location, localStorageService, $state, $stateParams, swalAlert) {

        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.filterOptions = {
            TeamId: "",
            TeamName: "",
            RecruiterAgentCode: "",
            RecruiterAgentName: "",
            Level: "",
            CandidateName: "",
            FromDate: "",
            ToDate: "",
            StatusDoc: "",
            NamaBranch: "",
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
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //get data dari sever;
        $scope.getPagedDataAsync = function (pageSize, page, teamCode, recruiterAgentCode, candidateName, level, recruiterName, namaBranch, fromDate, toDate, statusDoc) {
            setTimeout(function () {
                //teamCode = ((teamCode == undefined) ? "" : teamCode);
                //candidateName = ((candidateName == undefined) ? "" : candidateName);
                //level = ((level == undefined) ? "" : level);
                //recruiterName = ((recruiterName == undefined) ? "" : recruiterName);
                //namaBranch = ((namaBranch == undefined) ? "" : namaBranch);
                //statusDoc = ((statusDoc == undefined) ? "" : statusDoc);
                fromDate = ((fromDate == 'NaN-NaN-NaN') ? "" : fromDate);
                toDate = ((toDate == 'NaN-NaN-NaN') ? "" : toDate);
                //console.log(pageSize + ' ' + page + ' ' + teamCode + ' ' + recruiterAgentCode + ' ' + candidateName + ' ' + level + ' ' + recruiterName + ' ' + namaBranch + ' ' + fromDate + ' ' + toDate + ' ' + statusDoc);

                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                if (teamCode || recruiterAgentCode || candidateName) {
                    $http({
                        method: 'GET',
                        url: 'api/DocumentCheck/GetListDocumentCheck',
                        params: { page: page, rowspPage: pageSize, TeamCode: teamCode, RecruiterAgentCode: recruiterAgentCode, CandidateName: candidateName, Level: level, RecruiterName: recruiterName, NamaBranch: namaBranch, FromDate: fromDate, ToDate: toDate, StatusDoc: statusDoc }
                    }).then(function (response) {
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
                    $http({
                        method: 'GET',
                        url: 'api/DocumentCheck/GetListDocumentCheck',
                        params: { page: page, rowspPage: pageSize, TeamCode: teamCode, RecruiterAgentCode: recruiterAgentCode, CandidateName: candidateName, Level: level, RecruiterName: recruiterName, NamaBranch: namaBranch, FromDate: fromDate, ToDate: toDate, StatusDoc: statusDoc }
                    }).then(function (response) {
                        $scope.setPagingData(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    }).finally(function () {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    });
                }
            }, 100);
        };

        // execute ambil data ke server
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        //event untuk memasukan filter
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.TeamId, $scope.filterOptions.RecruiterAgentCode, $scope.filterOptions.CandidateName, $scope.filterOptions.Level, $scope.filterOptions.RecruiterAgenName, $scope.filterOptions.NamaBranch, $scope.filterOptions.FromDate, $scope.filterOptions.ToDate, $scope.filterOptions.StatusDoc);
            }
        }, true);

        //clear filter
        $scope.clearFilter = function (pageSize, currentPage) {
            $scope.filterOptions.TeamId = "",
            $scope.filterOptions.TeamCode = "",
            $scope.filterOptions.TeamName = "",
            $scope.filterOptions.Level = "",
            $scope.filterOptions.RecruiterAgentCode = "",
            $scope.filterOptions.RecruiterAgentName = "",
            $scope.filterOptions.CandidateName = "",
            $scope.filterOptions.FromDate = "",
            $scope.filterOptions.ToDate = "",
            $scope.filterOptions.NamaBranch = "",
            $scope.filterOptions.StatusDoc = "",
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync(pageSize, currentPage);
        };

        function convertDate(date) {
            var convertedDate;
            if (date) {
                var d = new Date(date);
                var curr_date = d.getDate();
                var curr_month = d.getMonth(); curr_month++;
                var curr_year = d.getFullYear();
                convertedDate = (curr_month + "-" + curr_date+ "-" + curr_year);
            }
            return convertedDate;
        }
        //fungsi search
        $scope.search = function (TeamCode, RecruiterAgentCode, RecruiterAgenName, CandidateName, Level, FromDate, ToDate, NamaBranch, StatusDoc) {
            ToDate = new Date(ToDate);
            ToDate.setDate(ToDate.getDate() + 1);
            var fromDate = convertDate(FromDate);
            var toDate = convertDate(ToDate);
            $scope.pagingOptions.currentPage = 1;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, TeamCode, RecruiterAgentCode, CandidateName, Level, RecruiterAgenName, NamaBranch, fromDate, toDate, StatusDoc);
        };
        //var statusTemplate1 = "<div>{{COL_FIELD == 'NEED REVISION' ? 'PENDING' : COL_FIELD }}</div>";
        //var templateWithTooltip = '<div tooltip="{{row.getProperty(\'ttip\')}}" tooltip-append-to-body="true" tooltip-placement="right" >{{row.getProperty(col.field)}}</div>';

        //bind data
        $scope.gridOptions = {
            data: 'myData',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            enableColumnResize: true,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
            },
            columnDefs: [

                { field: 'TeamCode', displayName: 'Kode Branch', width: 130, visible: false },
                //{ field: 'TeamName', displayName: 'Nama Branch', width: 350 },
                //{ field: 'RecruiterAgentCode', displayName: 'Kode Agen', width: 300, visible: false },
                //{ field: 'RecruiterName', displayName: 'Nama Agen', width: 200 },
                //{ field: 'CandidateName', displayName: 'Nama Kandidat', width: 200 },
                //{ field: 'Status', displayName: 'Status', width: 110 },
                //{ field: 'SubmitDate', displayName: 'Tanggal Submit' }
                { field: 'TemporaryAgentCode', displayName: 'Agent Code', width: 80 },
                { field: 'CandidateName', displayName: 'Nama Calon Agen', width: 200 },
                { field: 'Level', displayName: 'Level', width: 50 },
                { field: 'RecruiterAgentCode', displayName: 'Kode Recruiter', width: 100, 'visible': false },
                { field: 'RecruiterName', displayName: 'Nama Recruiter', width: 200, 'visible': false },
                { field: 'NamaBranch', displayName: 'Nama Branch', width: 200, 'visible': false },
                { field: 'AgentLocation', displayName: 'Lokasi', width: 300 },
                { field: 'SubmitDate', displayName: 'Tanggal Submit', width: 130 },
                { field: 'UpdateDate', displayName: 'Tanggal Update', width: 130 },
                { field: 'Status', displayName: 'Status', width: 100 },
                { field: 'StatusApproval', displayName: 'Approval Status', width: 200 },
                { field: 'Reason', displayName: 'Keterangan', width: 200 }
                //{ field: 'TeamName', displayName: 'Temp. Agent Code', width: 150 },
                //{ field: '', displayName: 'Action', width:100 }
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
                component: 'applicantStatusComponent',
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

        //open popup team
        $scope.lookupTeam = function () {

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'teamPopup.html',
                controller: popUpTeamCtrl,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        }
        //open popup agent
        $scope.lookupAgent = function () {
            if ($scope.filterOptions.TeamId === "" || $scope.filterOptions.TeamId === null) {
                swalAlert.message('i', 'Harap pilih Tim terlebih dahulu !');
            } else {
                $scope.modalInstance = $uibModal.open({
                    templateUrl: 'agentPopup.html',
                    controller: popUpAgentCtrl,
                    windowClass: 'app-modal-window',
                    resolve: {
                        items: function () {
                            return $scope;
                        }
                    }
                });
            }



        }

        //download report
        $scope.downloadExcel = function () {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            $http({ method: 'GET', url: 'api/documentCheck/PrintReport' })
            .then(function (response) {
                if (response.data.isSucceed) {
                    document.location.href = '/File/' + response.data.CustomField.filename;
                }
                else {
                    swalAlert.message('i', 'Tidak Ada Data / Terjadi Kesalahan');
                }
            }).finally(function () {
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
            });
        }

        //redirect ke halaman cek dokumen
        $scope.getCandidateDetail = function (data) {
            $state.go('documentCheckDetailCms', { 'candidateid': data });
            localStorageService.set('checkDocumentCandidateId', data);
        }
    }

    function popUpTeamCtrl($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;
        $scope.loing = myService;

        $scope.selectedItem = null;
        $scope.filterOptions2 = {
            TeamCode: "",
            TeamName: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions2 = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData2 = function (data, page, pageSize, length) {
            $scope.teamData = data;
            //console.log('masuk paging data');
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //filter manager based on business type dropdown
        $scope.getPagedDataAsync2 = function (pageSize, page, teamCode, teamName) {
            setTimeout(function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                if (teamCode || teamName) {
                    $http({ method: 'GET', url: 'api/Team/GetListTeam', params: { page: page, rowspPage: pageSize, TeamCode: teamCode, TeamName: teamName } }).
                        then(function (response) {
                            if (response.data.length <= 0) {
                                $scope.teamData = response.data;
                                $scope.totalServerItems = 0;

                            }
                            $scope.setPagingData2(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);

                        }).finally(function () {
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        });
                } else {
                    $http({ method: 'GET', url: 'api/Team/GetListTeam', params: { page: page, rowspPage: pageSize, TeamCode: teamCode, TeamName: teamName } }).
                        then(function (response) {
                            $scope.setPagingData2(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);

                        }).finally(function () {
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        });
                }
            }, 100);
        };

        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.TeamCode, $scope.filterOptions2.TeamCode);

        $scope.$watch('pagingOptions2', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.name);
            }
        }, true);

        $scope.search2 = function (teamCode, teamName) {
            $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, teamCode, teamName);
        };
        $scope.clearFilter2 = function (pageSize, currentPage) {
            $scope.filterOptions2.TeamCode = "";
            $scope.filterOptions2.TeamName = "";
            $scope.getPagedDataAsync2(pageSize, currentPage);
        };

        $scope.grid2Options = {
            data: 'teamData',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions2,
            filterOptions: $scope.filterOptions2,
            columnDefs: [
                { field: 'Id', visible: false },
                { field: 'TeamCode', displayName: 'Kode Branch' },
                { field: 'TeamName', displayName: 'Nama Branch' }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedItem = row.selectionProvider.selectedItems;
                }
            },
        };
        $scope.cancelTeam = function () {
            $scope.$resolve.items.modalInstance.close();
        };
        $scope.okTeam = function () {
            if ($scope.selectedItem !== null) {
                $scope.$resolve.items.filterOptions.TeamId = $scope.selectedItem[0].Id;
                $scope.$resolve.items.filterOptions.TeamCode = $scope.selectedItem[0].TeamCode;
                $scope.$resolve.items.filterOptions.TeamName = $scope.selectedItem[0].TeamName;
                $scope.$resolve.items.filterOptions.RecruiterAgentCode = "";
                $scope.$resolve.items.filterOptions.RecruiterAgentName = "";
                $scope.$resolve.items.modalInstance.close();
            }
            else {
                swalAlert.message('i', 'Please Choose !!!');
            }
        };
    }

    function popUpAgentCtrl($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;
        $scope.loading = myService;

        $scope.selectedItem = null;
        $scope.filterOptions3 = {
            TeamCode: "",
            AgentCode: "",
            DisplayName: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions3 = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData3 = function (data, page, pageSize, length) {
            $scope.agentData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync3 = function (pageSize, page, teamCode, agentCode, displayName) {
            setTimeout(function () {
                var data;
                $http({ method: 'GET', url: 'api/Account/GetListRecruiterAgentCode', params: { TeamCode: teamCode, AgentCode: agentCode, DisplayName: displayName, page: page, rowsPage: pageSize } }).
                then(function (response) {
                    if (response.data.length <= 0) {
                        $scope.agentData = response.data;
                        $scope.totalServerItems = 0;
                    }
                    $scope.setPagingData3(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                });
            }, 100);
        };

        $scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage, $scope.$resolve.items.filterOptions.TeamCode, $scope.filterOptions3.AgentCode, $scope.filterOptions3.DisplayName);

        $scope.$watch('pagingOptions3', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage, $scope.$resolve.items.filterOptions.TeamCode, filterOptions3.AgentCode, filterOptions3.DisplayName);
            }
        }, true);

        $scope.search3 = function (agentCode, displayName) {
            $scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage, $scope.$resolve.items.filterOptions.TeamCode, agentCode, displayName);
        };
        $scope.clearFilter3 = function (pageSize, currentPage) {
            $scope.filterOptions3.TeamCode = "";
            $scope.filterOptions3.AgentCode = "";
            $scope.filterOptions3.DisplayName = "";
            $scope.getPagedDataAsync3(pageSize, currentPage, $scope.$resolve.items.filterOptions.TeamCode);
        };

        $scope.grid2Options = {
            data: 'agentData',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions2,
            filterOptions: $scope.filterOptions2,
            columnDefs: [
                { field: 'AgentCode', displayName: 'Kode Agen' },
                { field: 'DisplayName', displayName: 'Nama Agen' }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedItem = row.selectionProvider.selectedItems;
                }
            },
        };
        $scope.cancelAgent = function () {
            $scope.$resolve.items.modalInstance.close();
        };
        $scope.okAgent = function () {
            if ($scope.selectedItem !== null) {
                $scope.$resolve.items.filterOptions.RecruiterAgentCode = $scope.selectedItem[0].AgentCode;
                $scope.$resolve.items.filterOptions.RecruiterAgentName = $scope.selectedItem[0].DisplayName;
                $scope.$resolve.items.modalInstance.close();
            }
            else {
                swalAlert.message('i', 'Please Choose !!!');
            }
        };
    }

})(angular.module('SunLifeApp'));