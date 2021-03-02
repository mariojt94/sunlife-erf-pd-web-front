(function (app) {
    'use strict';

    app.controller('createAccountController', createAccountController);
    createAccountController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$state', 'authService', 'localStorageService', 'swalAlert'];

    function createAccountController($scope, myService, $http, $uibModal, $log, $document, $window, $state, authService, localStorageService, swalAlert) {
        $scope.account = {
            NamaDepan: "",
            NamaBelakang: "",
            Email: "",
            PhoneNo: "",
            RecruitmentSrc: "",
            Password: "",
            RePassword: ""
        }

        $scope.cityList = null;
        /*$scope.fillCity = function () {
            $http({
                method: 'GET',
                url: 'api/City/GetCity'
            })
                .then(function (response) {
                    $scope.cityList = response.data;
                });
        };
        $scope.fillCity();*/

        $http({
            method: 'GET',
            url: '/api/Recruitment/GetRecruitmentSource'
        }).then(function (res) {
            $scope.listRecruitmentSource = res.data;
        });

       
        $scope.levelList = null;
        /*$scope.fillLevel = function () {
            $http({
                method: 'GET',
                url: 'api/Contact/GetContactLevel'
            })
                .then(function (response) {
                    $scope.levelList = response.data;
                });
        };
        $scope.fillLevel();
        $scope.contactList = null;
        $scope.fillContact = function () {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            //get agent code
            $http({
                method: 'GET',
                url: 'api/Account/GetUser',
                params: { loginName: $scope.username }
            })
                .then(function (response) {
                    //nilai agent code  
                    $scope.agentCode = response.data.AgentCode;
                    $scope.candidate.RecruiterAgentCode = $scope.agentCode;
                    //get contact filtered by agentcode
                    $http({
                        method: 'GET',
                        url: 'api/Contact/GetContact',
                        params: { agentCode: $scope.agentCode, page: 1, rowspPage: 5, nama: '', filter: 0 }
                    })
                    .then(function (response) {
                        $scope.contactList = response.data;
                        //$scope.contactList[0].photourl = "data:image/jpeg;base64,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";
                        $scope.setPage(1, response.data.length > 0 ? response.data[0].Length : 0);
                    }).finally(function () {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    });

                })
        }*/
        //$scope.fillContact();

        $scope.pagingOptions = {
            currentPage: 1
        };
        $scope.filterOptions = {
            name: "",
            sortBy: 1,
            useExternalFilter: true
        };
        /*$scope.getPagedDataAsync = function (page, name, Filter) {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            $http({
                method: 'GET',
                url: 'api/Account/GetUser',
                params: { loginName: $scope.username }
            })
            .then(function (response) {
                $scope.agentCode = response.data.AgentCode;
                //get contact filtered by agentcode
                $http({
                    method: 'GET',
                    url: 'api/Contact/GetContact',
                    params: { agentCode: $scope.agentCode, page: page, rowspPage: 5, nama: name, filter: Filter }
                })
                .then(function (response) {
                    $scope.contactList = response.data;
                    $scope.setPage(page, response.data.length > 0 ? response.data[0].Length : 0);
                }).finally(function () {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                });
            })
        };*/
        //$scope.getPagedDataAsync(1, $scope.filterOptions.name, $scope.filterOptions.filter);

/*        $scope.listFilter = [
            { id: 0, value: "Semua Data" },
            { id: 1, value: "Pengisian RF" },
            { id: 2, value: "Menunggu Persetujuan" },
            { id: 3, value: "Menunggu Proses Dokumen Cek" },
            { id: 4, value: "Menunggu Hasil Elearning" },
            { id: 5, value: "Menunggu Hasil Ujian AAJI" },
            { id: 6, value: "Kode Agen Aktif" },
        ]*/


        //tombol kirim:
        $scope.ok = function (formData) {
            var data = formData;
         /*   if (data.NamaDepan === "" || data.NamaBelakang === "" || data.Email === "" || data.Telp === "" || data.RecruitmentSrc === "" || data.Password === !data.RePassword)*/
            if (data.Password !== data.RePassword) {
                swalAlert.message('i', '  Pastikan password sudah sama');
            } else {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);

                var res = $http.post('api/Account/Submit', formData)    //pake add Account, Account nyambung ke user
                    .then(function SuccessCallBack(response) {
                        if (response.data.isSucceed) {
                            //$window.alert(response.data.message);                            
                            window.location.href = "#!/login";
                        } else {
                            swalAlert.message('e', response.data.message);
                        }
                    }, function errorCallback(response) {
                        swalAlert.message('e', response.data.ExceptionMessage);
                    }).finally(function () {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    });
                //clearForm();
            }
        };

        $scope.delete = function (id) {
            swalAlert.confirm(function (isConfirmed) {
                if (isConfirmed.value) {
                    var res = $http.post('api/Contact/DeleteContact', id)
                        .then(function SuccessCallBack(response) {
                            if (response.data.isSucceed) {
                                swalAlert.message('i', response.data.message);
                                $scope.fillContact();

                            }
                            else {
                                swalAlert.message('e', response.data.message);
                            }
                        }, function errorCallback(response) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            //$window.alert(response.data.ExceptionMessage);
                            swalAlert.message('i', response.data.ExceptionMessage);
                        });
                }
            });
        }

        $scope.getDetailContact = function (candidateId, status) {
            if (status == 'REJECT') {
                //alert('Candidate Sudah Di Reject');
                swalAlert.message('i', 'Candidate Sudah Di Reject');
            }
            else {
                $state.go('detailcontact', { id: candidateId });
                localStorageService.set('CandidateId', candidateId);
                var candidateid = localStorageService.get('CandidateId');
            }
        }

        $scope.pager = {};
        $scope.setPage = function (page, length) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
            // get pager object from service
            $scope.pager = GetPager(length, page);
            // get current page of items
        }
        function GetPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;
            // default page size is 10
            pageSize = pageSize || 5;
            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);
            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }
            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
            // create an array of pages to ng-repeat in the pager control
            var pages = []; //_.range(startPage, endPage + 1);
            for (var i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }
    }
})(angular.module('SunLifeApp'));