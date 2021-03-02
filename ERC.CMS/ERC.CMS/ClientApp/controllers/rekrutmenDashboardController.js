(function (app) {
    'use strict';
    app.controller('rekrutmenDashboardController', function ($scope, $rootScope, $http, $state, authService, $window, swalAlert, $location, localStorageService) {
        $scope.loginName = localStorageService.get('LoginName');
        $scope.notifStatus = false;
        $scope.jumlahNotif = [];
        $scope.tabKosong = [];
       
/*
        //$http({
        //    method: 'GET',
        //    url: 'api/Account/GetPDFSubmitStatus',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function(res) {
        //    if (res.data.IsSubmittedPDF == null || res.data.IsSubmittedPDF == false) {
        //        //console.log(res);
        //        $scope.statusDataReview = false;
        //    } else {
        //        $scope.statusDataReview = true;
        //    }
        //});
        
       */

        $scope.toStatusApp = function() {
            $state.go('applicantStatus');

            $http({
                method: 'GET',
                url: 'api/Recruitment/GetStatusAppNotif',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                if (res.data[0].StatusJadwalInterview1 == "OK" || res.data[0].StatusJadwalInterview1 == "SUCCESS") {
                    $http({
                        method: 'POST',
                        url: 'api/Recruitment/SetStatusAppNotif1',
                        params: { loginName: $scope.loginName}
                    }).then(function (response) {
                    });
                }

                if (res.data[0].StatusJadwalInterview2 == "OK" || res.data[0].StatusJadwalInterview2 == "SUCCESS") {
                    $http({
                        method: 'POST',
                        url: 'api/Recruitment/SetStatusAppNotif2',
                        params: { loginName: $scope.loginName }
                    }).then(function (response) {
                    });
                }
            });

        }

        $http({
            method: 'GET',
            url: 'api/Recruitment/GetStatusAppNotif',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            console.log(res.data.IsSeenNotif1);
            if (res.data[0].IsSeenNotif1 == true &&
                (res.data[0].StatusJadwalInterview1 == "OK" || res.data[0].StatusJadwalInterview1 == "SUCCESS")) {
                $scope.notifStatus = false;
            }
            else if (res.data[0].IsSeenNotif2 == true &&
                (res.data[0].StatusJadwalInterview2 == "OK" || res.data[0].StatusJadwalInterview2 == "SUCCESS")) {
                $scope.notifStatus = false;
            }
            else {
                $scope.notifStatus = true;
            }

            if (res.data[0].StatusJadwalInterview1 == null && res.data[0].StatusJadwalInterview2 == null) {
                $scope.notifStatus = false;
            }
            if ((res.data[0].IsSeenNotif2 == false) && 
                (res.data[0].StatusJadwalInterview2 == "OK" || res.data[0].StatusJadwalInterview2 == "SUCCESS")) {
                $scope.notifStatus = true;
            }

        });

        //#region Get semua buat nentuin ceklis
        $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateProgress',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data != null && res.data.length != 0) {
                $scope.tabKosong.push(res.data);
            } else {
                $scope.jumlahNotif.push(1);
                $scope.tabKosong.push('rekrutmenDataPribadi');
            }
        });


        //$http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetDataPribadi',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    if (res.data != null && res.data.length != 0) {
        //        $scope.statusDataPribadi = true;
        //    } else {
        //        $scope.jumlahNotif.push(1);
        //        $scope.tabKosong.push('rekrutmenDataPribadi');
        //    }
        //});

        //$http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetDataDomisili',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    if (res.data == null && res.data.length == 0) {
        //        $scope.jumlahNotif = $scope.jumlahNotif - 1;
        //    }
        //});

        //$scope.getKontak = $http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetKontak',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    // console.log(res.data);
        //    if (res.data == null || res.data.length == 0) {
        //        $scope.jumlahNotif.push(1);
        //        $scope.tabKosong.push('rekrutmenKontak');
        //    }
        //});

        //$scope.GetCandidateDataKeluarga = $http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetCandidateDataKeluarga',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    console.log(res.data);
        //    if (res.data != null && res.data.length != 0) {
        //    } else {
        //        $scope.jumlahNotif.push(1);
        //        $scope.tabKosong.push('rekrutmenDataKeluarga');
        //    }
        //});

        //$scope.GetCandidateDataPendidikan = $http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetCandidateDataPendidikan',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    //console.log(res.data);
        //    if (res.data == null || res.data.length == 0) {
        //        $scope.jumlahNotif.push(1);
        //        $scope.tabKosong.push('rekrutmenPendidikan');
        //    }
        //});

        //$scope.GetCandidateExperiencePekerjaan = $http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetCandidateExperiencePekerjaan',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    //console.log(res.data);
        //    if (res.data != null && res.data.length != 0) {

        //        $scope.GetCandidateExperienceBahasa = $http({
        //            method: 'GET',
        //            url: 'api/Recruitment/GetCandidateExperienceBahasa',
        //            params: {
        //                loginName: $scope.loginName
        //            }
        //        }).then(function (res) {
        //            //console.log(res.data);
        //            if (res.data != null && res.data.length != 0) {
        //                $scope.GetCandidateExperienceMinat = $http({
        //                    method: 'GET',
        //                    url: 'api/Recruitment/GetCandidateExperienceMinat',
        //                    params: {
        //                        loginName: $scope.loginName
        //                    }
        //                }).then(function (res) {
        //                   // console.log(res.data);
        //                    if (res.data != null && res.data.length != 0) {
        //                        $scope.GetCandidateExperiencePlusMin = $http({
        //                            method: 'GET',
        //                            url: 'api/Recruitment/GetCandidateExperiencePlusMin',
        //                            params: {
        //                                loginName: $scope.loginName
        //                            }
        //                        }).then(function (res) {
        //                            // console.log(res.data);
        //                            if (res.data == null || res.data.length == 0) {
        //                                $scope.jumlahNotif.push(1);
        //                                $scope.tabKosong.push('rekrutmenPekerjaan');
        //                            }
        //                        });
        //                    }
        //                });
        //            }
        //        });

        //    } else {
        //        $scope.tabKosong.push('rekrutmenPekerjaan');
        //        //$scope.jumlahNotif = $scope.jumlahNotif + 1;
        //    }
        //});

        //$scope.GetDokumenCandidate = $http({
        //    method: 'GET',
        //    url: 'api/FileUpload/GetDokumenCandidate',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    $scope.tes = res.data;

        //    $scope.tes.forEach(function (elemen) {
        //        if (elemen.Type == "CV") {
        //            $scope.nyariCV = elemen.Type;
        //        } else if (elemen.Type == "IJAZAH") {
        //            $scope.nyariIjazah = elemen.Type;
        //        } else if (elemen.Type == "KTP") {
        //            $scope.nyariKTP = elemen.Type;
        //        } else if (elemen.Type == "FOTO") {
        //            $scope.nyariFoto = elemen.Type;
        //        } else if (elemen.Type == "REKENING") {
        //            $scope.nyariRek = elemen.Type;
        //        } else if (elemen.Type == "LAIN-LAIN") {
        //            $scope.nyariLain = elemen.Type;
        //        }
        //    });
        //    if ($scope.nyariCV == null || $scope.nyariIjazah == null || $scope.nyariKTP == null ||
        //        $scope.nyariFoto == null || $scope.nyariRek == null) {
        //        $scope.jumlahNotif.push(1);
        //        $scope.tabKosong.push('rekrutmenDokumen');
        //    }
        //});

        //$http({
        //    method: 'GET',
        //    url: '/api/Recruitment/GetPsikotesHasil',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    if (res.data != null) {
        //        //console.log(res);
               
        //    } else {
        //        $scope.jumlahNotif.push(1);
        //        $scope.tabKosong.push('rekrutmenPsikotes');
        //    }
        //});
        //console.log($scope.jumlahNotif);

        //$http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetCandidateDataPTKP',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    //console.log(res.data);
        //    if (res.data != null && res.data.length != 0) {             
        //        //$scope.statusDataPtkp = true;
        //        //localStorageService.set('statusDataPTKP', "done");
        //    } else {
        //        $scope.jumlahNotif.push(1);
        //        $scope.tabKosong.push('rekrutmenPTKP');
        //        //$scope.statusDataPtkp = false;
        //        //localStorageService.set('statusDataPTKP', "undone");
        //    }
        //});

        //$http({
        //    method: 'GET',
        //    url: 'api/Account/GetPDFSubmitStatus',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    if (res.data.IsSubmittedPDF == null || res.data.IsSubmittedPDF == false) {
        //        //console.log(res);
        //        $scope.jumlahNotif.push(1);
        //        $scope.statusDataReview = false;
        //        $scope.tabKosong.push('rekrutmenReview');
        //    } else {
        //        $scope.statusDataReview = true;
        //    }
        //    //if ($scope.jumlahNotif.length > 0) {
        //    //    $scope.notifGabung = true;
        //    //} else {
        //    //    $scope.statusDataReview = true;
        //    //}
        //});
        //#endregion

        $http({
            method: 'GET',
            url: 'api/Account/GetPDFSubmitStatus',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data.IsSubmittedPDF == null || res.data.IsSubmittedPDF == false) {
                //$scope.jumlahNotif.push(1);
                $scope.statusDataReview = false;
                //$scope.tabKosong.push('rekrutmenReview');
            } else {
                $scope.statusDataReview = true;
            }
            //if ($scope.jumlahNotif.length > 0) {
            //    $scope.notifGabung = true;
            //} else {
            //    $scope.statusDataReview = true;
            //}
        });
        
        $scope.toTabKosong = function() {
            $scope.linkKosong = $scope.tabKosong[0];

            if ($scope.statusDataReview == true) {
                console.log($scope.statusDataReview);
                return;
            }

            if ($scope.tabKosong[0] != undefined) {
                $state.go($scope.tabKosong[0]);
            } else {
                $state.go('rekrutmenDataPribadi');
            }
        };

        $scope.tentangSunlife = function () {
            
            $state.go('webTentangSunlife');
            
        };


    });
})(angular.module('SunLifeApp'));