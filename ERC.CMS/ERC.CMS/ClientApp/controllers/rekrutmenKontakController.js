(function (app) {
    'use strict';

    app.controller('rekrutmenKontakController', function ($window, $scope, $http, $state, authService, localStorageService, swalAlert, $rootScope, $cookies) {
        $scope.loginName = localStorageService.get('LoginName');
/*        $scope.statusDataPribadi = localStorageService.get('statusDataPribadi');
        $scope.statusKontak = localStorageService.get('statusKontak');
        $scope.statusDataKeluarga = localStorageService.get('statusDataKeluarga');
        $scope.statusDataPendidikan = localStorageService.get('statusDataPendidikan');
        $scope.statusDataPekerjaan = localStorageService.get('statusDataPekerjaan');
        $scope.statusDataDokumen = localStorageService.get('statusDataDokumen');*/

        $scope.listKontakDarurat = [];
        $scope.listKontakDarurat.push({ 'colId': 1, 'loginName': $scope.loginName,'NamaLengkap':null,'NoTelepon':null,'Hubungan':null,'Alamat':null});
        $scope.listKontakDarurat.push({ 'colId': 2, 'loginName': $scope.loginName,'NamaLengkap':null,'NoTelepon':null,'Hubungan':null,'Alamat':null});

        //#region declare kelas
        $scope.warnaMerahNM = 'form-control';
        $scope.warnaMerahTlp = 'form-control';
        $scope.warnaMerahHub = 'form-control';
        $scope.warnaMerahAl = 'form-control';
        //#endregion
        //console.log($scope.listKontakDarurat);
        //$scope.listKontakDarurat.push();

        // To Papikostik
        $scope.ToPapikostik = function () {

            for (var index = 1; index <= 90; index++) {
                var cookiesJawabanPapikostik = "cookiesJawabanPapikostik" + index;
                var isiGetcookiesJawabanPapikostik = $cookies.get(cookiesJawabanPapikostik);

                if (isiGetcookiesJawabanPapikostik == null || isiGetcookiesJawabanPapikostik == undefined) {
                    $cookies.put(cookiesJawabanPapikostik, undefined);
                }
            }
            $state.go('rekrutmenPapikostik');
        }

        // Papikostik
        $http({
            method: 'GET',
            url: '/api/Recruitment/GetIsFinishPapikostik',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data == null || res.data == false || res.data == 0) {
                //console.log(res);
                $scope.statusDataPapikostik = false;
            } else {
                $scope.statusDataPapikostik = true;
            }
        });

        //#region Get semua buat nentuin ceklis
        $http({
            method: 'GET',
            url: 'api/Recruitment/GetDataPribadi',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataPribadi = true;
                $scope.statusDataKeluarga = res.data[0].IsKeluargaComplete;
            } else {
                $scope.statusDataPribadi = false;
                //console.log($scope.statusKontak);
            }
        });


        $http({
            method: 'GET',
            url: 'api/Recruitment/GetDataDomisili',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataPribadi = true;
            } else {
                $scope.statusDataPribadi = false;
               // console.log($scope.statusKontak);
            }
        });

        $scope.GetCandidateDataPendidikan = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateDataPendidikan',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            //console.log(res.data);
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataPendidikan = true;
            } else {
                $scope.statusDataPendidikan = false;
                // console.log($scope.statusDataKeluarga);
            }
        });

        //$scope.GetCandidateDataKeluarga = $http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetCandidateDataKeluarga',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //   // console.log(res.data);
        //    if (res.data != null && res.data.length != 0) {
        //        $scope.statusDataKeluarga = true;
        //    } else {
        //        $scope.statusDataKeluarga = false;
        //        // console.log($scope.statusDataKeluarga);
        //    }
        //});

        $scope.GetDokumenCandidate = $http({
            method: 'GET',
            url: 'api/FileUpload/GetDokumenCandidate',
            params: {
                loginName: $scope.loginName
            }
        }).then(function(res) {
            $scope.tes = res.data;

            $scope.tes.forEach(function(elemen) {
                if (elemen.Type == "CV") {
                    $scope.nyariCV = elemen.Type;
                } else if (elemen.Type == "IJAZAH") {
                    $scope.nyariIjazah = elemen.Type;
                } else if (elemen.Type == "KTP") {
                    $scope.nyariKTP = elemen.Type;
                } else if (elemen.Type == "FOTO") {
                    $scope.nyariFoto = elemen.Type;
                } else if (elemen.Type == "REKENING") {
                    $scope.nyariRek = elemen.Type;
                } else if (elemen.Type == "LAIN-LAIN") {
                    $scope.nyariLain = elemen.Type;
                }
                if ($scope.nyariCV == null || $scope.nyariIjazah == null || $scope.nyariKTP == null ||
                    $scope.nyariFoto == null || $scope.nyariRek == null) {
                    $scope.statusDataDokumen = false;
                } else {
                    $scope.statusDataDokumen = true;
                }
            });
        });
        $scope.GetCandidateExperiencePekerjaan = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateExperiencePekerjaan',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            //console.log(res.data);
            if (res.data != null && res.data.length != 0) {

                $scope.GetCandidateExperienceBahasa = $http({
                    method: 'GET',
                    url: 'api/Recruitment/GetCandidateExperienceBahasa',
                    params: {
                        loginName: $scope.loginName
                    }
                }).then(function (res) {
                   // console.log(res.data);
                    if (res.data != null && res.data.length != 0) {
                        $scope.GetCandidateExperienceMinat = $http({
                            method: 'GET',
                            url: 'api/Recruitment/GetCandidateExperienceMinat',
                            params: {
                                loginName: $scope.loginName
                            }
                        }).then(function (res) {
                            //console.log(res.data);
                            if (res.data != null && res.data.length != 0) {
                                $scope.GetCandidateExperiencePlusMin = $http({
                                    method: 'GET',
                                    url: 'api/Recruitment/GetCandidateExperiencePlusMin',
                                    params: {
                                        loginName: $scope.loginName
                                    }
                                }).then(function (res) {
                                    //console.log(res.data);
                                    if (res.data != null && res.data.length != 0) {
                                        $scope.statusDataPekerjaan = true;
                                    } else {
                                        $scope.statusDataPekerjaan = false;
                                        // console.log($scope.statusDataKeluarga);
                                    }
                                });
                            } else {
                                $scope.statusDataPekerjaan = false;
                                // console.log($scope.statusDataKeluarga);
                            }
                        });
                    } else {
                        $scope.statusDataPekerjaan = false;
                        // console.log($scope.statusDataKeluarga);
                    }
                });

            } else {
                $scope.statusDataPekerjaan = false;
                // console.log($scope.statusDataKeluarga);
            }
        });

        $scope.getPTKP = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateDataPTKP',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            //console.log(res.data);
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataPtkp = true;
            } else {
                $scope.statusDataPtkp = false;
            }
        });

        $http({
            method: 'GET',
            url: '/api/Recruitment/GetPsikotesHasil',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data != null) {
               // console.log(res);
                $scope.statusDataPsikotes = true;
            } else {
                $scope.statusDataPsikotes = false;
            }
        });

        $http({
            method: 'GET',
            url: 'api/Account/GetPDFSubmitStatus',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data.IsSubmittedPDF == null || res.data.IsSubmittedPDF == false) {
                //console.log(res);
                $scope.statusDataReview = false;
            } else {
                $scope.statusDataReview = true;
            }
        });
        //#endregion
       
/*
                contoh
        $scope.get = $http({
            method: 'GET',
            url: 'api/FileUpload/GetDokumenCandidate',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            console.log(res);
            $scope.Path = res.data;
            $scope.Path.forEach(function (element) {
                console.log(element.Path);
            });
        });
*/
        $scope.ToPsikotes = function () {
            $http({
                method: 'GET',
                url: '/api/Recruitment/GetPsikotesHasil',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                if (res.data != null) {
                    //console.log(res);
                    $state.go('rekrutmenPsikotesFinish');
                } else {
                    $state.go('rekrutmenPsikotes');
                }
            });
        }


        $scope.getKontak = $http({
            method: 'GET',
            url: 'api/Recruitment/GetKontak',
            params: {
                loginName: $scope.loginName
            }
        }).then(function(res) {
            //console.log(res.data);
            if (res.data.length != 0) { $scope.listKontakDarurat = res.data; }
            //if (res.data.length < 2) {
            //}

            for (var i = $scope.listKontakDarurat.count; i > 2 ; i++)
            {
                $scope.listKontakDarurat.push({ 'colId': i, 'loginName': $scope.loginName, 'NamaLengkap': null, 'NoTelepon': null, 'Hubungan': null, 'Alamat': null });
            }
            while ($scope.listKontakDarurat.count < 2) {
                $scope.listKontakDarurat.push({});
            }
/*                $scope.listKontakDarurat.forEach(function (element) {
                    //console.log(element);
                });*/
        });

        $scope.addContactDarurat = function () {
            var newItemNo = $scope.listKontakDarurat.length + 1;
            $scope.listKontakDarurat.push({ 'colId': newItemNo, 'loginName': $scope.loginName });
        };

        $scope.deleteContactDarurat = function(index) {
                // remove the row specified in index
            $scope.deleted = $scope.listKontakDarurat.splice(index, 1);
            $http.post('api/Recruitment/DeleteKontak', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");

                } else {
                    console.log("gagal ngapus");
                }
            });
            //console.log($scope.deleted);
        };

        $scope.submitKontakDarurat = function () {
           // $scope.listKontakDarurat = [];
            //console.log($scope.listKontakDarurat);
            $rootScope.test = [];
            $scope.index = 0;

            $scope.listKontakDarurat.forEach(function (elemen) {

                if (elemen.NamaLengkap == undefined) {
                    $scope.indexNama = "nama" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexNama));
                    if ($rootScope.test.includes("<b>Kontak<br>") != true) {
                        $rootScope.test.push("<b>Kontak<br>");
                        $rootScope.test.push("Nama lengkap<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Nama lengkap<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexNama = "nama" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexNama));
                    myEl.removeClass('f-danger');
                }

                if (elemen.NoTelepon == undefined) {
                    $scope.indexTelp= "telp" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTelp));
                    if ($rootScope.test.includes("<b>Kontak<br>") != true) {
                        $rootScope.test.push("<b>Kontak<br>");
                        $rootScope.test.push("No. Telepon<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("No. Telepon<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexTelp = "telp" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTelp));
                    myEl.removeClass('f-danger');
                }

                if (elemen.Hubungan == undefined) {
                    $scope.indexHub = "hub" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexHub));
                    if ($rootScope.test.includes("<b>Kontak<br>") != true) {
                        $rootScope.test.push("<b>Kontak<br>");
                        $rootScope.test.push("Hubungan<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Hubungan<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexHub = "hub" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexHub));
                    myEl.removeClass('f-danger');
                }
                if (elemen.Alamat == undefined) {
                    $scope.indexAlamat = "alamat" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexAlamat));

                    if ($rootScope.test.includes("<b>Kontak<br>") != true) {
                        $rootScope.test.push("<b>Kontak<br>");
                        $rootScope.test.push("Alamat<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Alamat<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexAlamat = "alamat" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexAlamat));
                    myEl.removeClass('f-danger');
                }
                $scope.index = $scope.index + 1;
            });

            var isValidated = true;
            $scope.listKontakDarurat.forEach(function(elemen) {
                if (elemen.NamaLengkap == null || elemen.NoTelepon == null || elemen.Hubungan == null || elemen.Alamat == null) {
                    swalAlert.message('e', "lengkapi data terlebih dahulu");
                    isValidated = false;
                    return;
                }

            });
            if (!isValidated) {
                return;
            }

            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            $http.post('api/Recruitment/SubmitKontak', $scope.listKontakDarurat)
                .then(function(response) {
                    //console.log(response);
                    if (response.data.isSucceed) {

                        //localStorageService.set('statusKontak', response.data.isSucceed);
                        swalAlert.message('s', response.data.message);
                        $state.go('rekrutmenDataKeluarga');
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);

                    } else {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                        $scope.listKontakDarurat = [];
                        swalAlert.message('e', response.data.message);
                    }
                });
       
/*            if (!$scope.listKontakDarurat.namaLengkap||
                $scope.listKontakDarurat.noTelepon) {
                swalAlert.message('s', "lengkapi data terlebih dahulu");
            } else {
                $http.post('api/Recruitment/SubmitKontak', $scope.listKontakDarurat)
                    .then(function(response) {
                        console.log(response);
                        if (response.data.isSucceed) {
                            swalAlert.message('s', response.data.message);
                            $state.go('rekrutmenDataKeluarga');

                        } else {
                            swalAlert.message('e', response.data.message);
                        }


                    });
            }*/

        };
    });

})(angular.module('SunLifeApp'));