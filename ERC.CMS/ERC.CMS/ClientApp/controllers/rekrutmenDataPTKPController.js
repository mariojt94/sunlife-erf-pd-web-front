(function(app) {
    'use strict';

    app.controller('rekrutmenDataPTKPController',
        function ($window, $scope, $http, $state, authService, localStorageService, swalAlert, $rootScope, $cookies) {
            $scope.pilihan = [];
            $scope.field = {};
            $scope.loginName = localStorageService.get('LoginName');
            $scope.field.loginName = $scope.loginName;

            // ToPapikostik 
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

            // papikostik
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

            $http({
                method: 'GET',
                url: '/api/Recruitment/GetGender'
            }).then(function (res) {
                $scope.listGender = res.data;
            });

            $http({
                method: 'GET',
                url: '/api/Recruitment/GetDataPTKP'
            }).then(function (res) {
                $scope.listPTKP = res.data;
                console.log($scope.listPTKP);
            });

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

            //#region Get semua buat nentuin ceklis
            $http({
                method: 'GET',
                url: 'api/Recruitment/GetDataPribadi',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                if (res.data != null && res.data.length != 0) {
                    $scope.field.jenisKelaminPtkp = res.data[0].JenisKelamin;
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

            $scope.getKontak = $http({
                method: 'GET',
                url: 'api/Recruitment/GetKontak',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                //console.log(res.data);
                if (res.data != null && res.data.length != 0) {
                    $scope.statusKontak = true;
                } else {
                    $scope.statusKontak = false;
                    //console.log($scope.statusKontak);
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
            //    // console.log(res.data);
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
            }).then(function (res) {
                $scope.tes = res.data;

                $scope.tes.forEach(function (elemen) {
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


            $scope.getPTKP = $http({
                method: 'GET',
                url: 'api/Recruitment/GetCandidateDataPTKP',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                if (res.data.length != 0) {
                    console.log(res.data);
                    $scope.idDetailPTKP = res.data[0].IdDetailPTKP;
                   // $scope.pilihan = $scope.pilihan[$scope.field.idDetailPTKP];
                    $scope.field.hubunganKerjaPTKP = res.data[0].HubunganKerjaPTKP;
                    $scope.field.jenisKelaminPtkp = res.data[0].JenisKelaminPTKP;
                }
                if (res.data[0].JenisKelaminPTKP == null) {
                    $scope.field.jenisKelaminPtkp = "";
                }
                if (res.data[0].IdDetailPTKP !== null || res.data[0].IdDetailPTKP != undefined) {
                    $scope.pilihan[res.data[0].IdDetailPTKP] = true;
                } else {
                    $scope.pilihan = [];
                }
            });

            $scope.checkPTKP = null;
          
            $scope.clearPTKP = function () {
                var length = $scope.listPTKP.length;
                var data = $scope.listPTKP;
                for (var i = 0; i < length; i++) {
                    var index = data[i].ID;
                    $scope.pilihan[index] = false;
                }
            }

            $scope.checkPTKP = function (Id) {
             //  if (Id == $scope.field.IdDetailPTKP) {
                    //$scope.checkPTKP = true;
                $scope.clearPTKP();
                    $scope.pilihan[Id] = true;
               //}
            }

            //$scope.checkPTKP = function (id) {
             // console.log(id, 'kjjjk');
                /*   console.log($scope.pilihan.length);*/
                //$scope.tes = [];
                //angular.forEach($scope.pilihan,
                //    function (item, index) {
                //        //if (item == true) {
                //         //   $scope.tes.push(index);
                //        //}

                //        //if ($scope.tes.length > 1) {
                //           // $scope.pilihan[index] = false;
                //            //$scope.pilihan = [];
                //            //$scope.pilihan[Id] = true;
                //       // }                      
                //        /*        console.log(index);*/
                //    });

                //$scope.pilihan[id] = true;
            // }
          
            $scope.submitPTKP = function () {
                $scope.field.idDetailPTKP = $scope.pilihan.indexOf(true);
                $rootScope.test = [];

                if ($scope.field.hubunganKerjaPTKP == undefined || $scope.field.hubunganKerjaPTKP == null) {
                    if ($rootScope.test.includes("<b>Data PTKP<br>") != true) {
                        $rootScope.test.push("<b>Data PTKP<br>");
                        $rootScope.test.push("Hubungan Kerja<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Hubungan Kerja<br>");
                    }
                }
                if ($scope.field.jenisKelaminPtkp == undefined || $scope.field.jenisKelaminPtkp == null || $scope.field.jenisKelaminPtkp == "") {
                    if ($rootScope.test.includes("<b>Data PTKP<br>") != true) {
                        $rootScope.test.push("<b>Data PTKP<br>");
                        $rootScope.test.push("Jenis Kelamin<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Jenis Kelamin<br>");
                    }
                }
                if ($scope.field.idDetailPTKP == undefined || $scope.field.idDetailPTKP == null || $scope.field.idDetailPTKP == -1) {
                    if ($rootScope.test.includes("<b>Data PTKP<br>") != true) {
                        $rootScope.test.push("<b>Data PTKP<br>");
                        $rootScope.test.push("Jenis PTKP<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Jenis PTKP<br>");
                    }
                }


                if ($scope.field.idDetailPTKP == null ||
                    $scope.field.idDetailPTKP == undefined ||
                    $scope.field.idDetailPTKP == -1) {
                    swalAlert.message('e', "Silahkan pilih jenis PTKP terlebih dahulu");
                } else if ($scope.field.hubunganKerjaPTKP == undefined || $scope.field.hubunganKerjaPTKP == null) {
                    swalAlert.message('e', "Silahkan pilih hubungan kerja terlebih dahulu");
                } else if ($scope.field.jenisKelaminPtkp == undefined || $scope.field.jenisKelaminPtkp == null) {
                    swalAlert.message('e', "Silahkan pilih jenis kelamin terlebih dahulu");
                } else {
                    $('.spinner').fadeIn(500);
                    $(".OverlaySpinner").fadeIn(500);
                    $http.post('api/Recruitment/SubmitDataCandidatePTKP', $scope.field).then(function(response) {
                        if (response.data.isSucceed == true) {
                            swalAlert.message('s', response.data.message);
                            //$state.go('rekrutmenPsikotes');
                            //$scope.ToPsikotes();
                            $scope.ToPapikostik();
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        } else {
                            swalAlert.message('e', response.data.message);
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        }
                    });
                }
           // console.log($scope.field.jenisKelaminPtkp);
            }
           
        });

})(angular.module('SunLifeApp'));   