(function (app) {
    'use strict';

    app.controller('rekrutmenDataPendidikanController', function ($window, $scope, $http, $state, authService, localStorageService, swalAlert, $rootScope, $cookies) {
        $scope.loginName = localStorageService.get('LoginName');
        $scope.pendidikan = [];
        $scope.pendidikanNon = [];
        $scope.allPendidikan = [];


        $scope.listDatapendidikan = [];
        $scope.listDatapendidikanNonFormal = [];

        $scope.tanggalSekarang = new Date();
        $scope.tahunSekarang = $scope.tanggalSekarang.getFullYear();

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

        $scope.tambahPendidikanFormal = function () {
            var newItemNo = $scope.listDatapendidikan.length + 1;
            $scope.listDatapendidikan.push({ 'colId': newItemNo, 'Jenis': 'Formal', 'loginName': $scope.loginName });
        };

        $scope.deletePendidikanFormal = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDatapendidikan.splice(index, 1);
             $http.post('api/Recruitment/DeletePendidikan', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");

                } else {
                    console.log("gagal ngapus");
                }
            });
        };


        $scope.tambahPendidikanNonFormal = function () {
            var newItemNo = $scope.listDatapendidikanNonFormal.length + 1;
            $scope.listDatapendidikanNonFormal.push({ 'colId': newItemNo, 'Jenis': 'NonFormal', 'loginName': $scope.loginName });
        };

        $scope.deletePendidikanNonFormal = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDatapendidikanNonFormal.splice(index, 1);
                        $http.post('api/Recruitment/DeletePendidikan', $scope.deleted).then(function (response) {
                            if (response.data.isSucceed) {
                                console.log("berhasil ngapus");
            
                            } else {
                                console.log("gagal ngapus");
                            }
                        });
        };


        $scope.ToPsikotes = function () {
            $http({
                method: 'GET',
                url: '/api/Recruitment/GetPsikotesHasil',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                if (res.data != null) {
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
                $scope.statusDataPribadi = true;
                $scope.statusDataKeluarga = res.data[0].IsKeluargaComplete;
            } else {
                $scope.statusDataPribadi = false;
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
            }
        });

        $scope.getKontak = $http({
            method: 'GET',
            url: 'api/Recruitment/GetKontak',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data != null && res.data.length != 0) {
                $scope.statusKontak = true;
            } else {
                $scope.statusKontak = false;
            }
        });

        //$scope.GetCandidateDataKeluarga = $http({
        //    method: 'GET',
        //    url: 'api/Recruitment/GetCandidateDataKeluarga',
        //    params: {
        //        loginName: $scope.loginName
        //    }
        //}).then(function (res) {
        //    //console.log(res.data);
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
            if (res.data != null && res.data.length != 0) {

                $scope.GetCandidateExperienceBahasa = $http({
                    method: 'GET',
                    url: 'api/Recruitment/GetCandidateExperienceBahasa',
                    params: {
                        loginName: $scope.loginName
                    }
                }).then(function (res) {
                    if (res.data != null && res.data.length != 0) {
                        $scope.GetCandidateExperienceMinat = $http({
                            method: 'GET',
                            url: 'api/Recruitment/GetCandidateExperienceMinat',
                            params: {
                                loginName: $scope.loginName
                            }
                        }).then(function (res) {
                            if (res.data != null && res.data.length != 0) {
                                $scope.GetCandidateExperiencePlusMin = $http({
                                    method: 'GET',
                                    url: 'api/Recruitment/GetCandidateExperiencePlusMin',
                                    params: {
                                        loginName: $scope.loginName
                                    }
                                }).then(function (res) {
                                    if (res.data != null && res.data.length != 0) {
                                        $scope.statusDataPekerjaan = true;
                                    } else {
                                        $scope.statusDataPekerjaan = false;
                                    }
                                });
                            } else {
                                $scope.statusDataPekerjaan = false;
                            }
                        });
                    } else {
                        $scope.statusDataPekerjaan = false;
                    }
                });

            } else {
                $scope.statusDataPekerjaan = false;
            }
        });

        $scope.getPTKP = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateDataPTKP',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
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
                $scope.statusDataReview = false;
            } else {
                $scope.statusDataReview = true;
            }
        });
        //#endregion


        $http({
            method: 'GET',
            url: '/api/Recruitment/GetLevelPendidikan'
        }).then(function (res) {
            $scope.listLevelPendidikan = res.data;
        });


        $scope.GetCandidateDataPendidikan = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateDataPendidikan',
            params: {
                loginName: $scope.loginName
            }
        }).then(function(res) {
            $scope.ItemPendidikan = res.data;
            if (res.data.length != 0) {
                $scope.ItemPendidikan.forEach(function(element) {
                    if (element.Jenis == 'Formal') {
                        $scope.listDatapendidikan.push(element);
                    }

                    if (element.Jenis.contains('NonFormal')) {
                        //$scope.listDatapendidikanNonFormal.push({ 'colId': 1, 'jenis': 'NonFormal', 'loginName': $scope.loginName });
                        $scope.listDatapendidikanNonFormal.push(element);
                    }
                    
                    if ((!element.Jenis.contains('NonFormal') && !element.Jenis == 'Formal')) {
                        $scope.listDatapendidikanNonFormal.push({ 'colId': 1, 'jenis': 'NonFormal', 'loginName': $scope.loginName });
                    }                

                });
            } else {
                $scope.listDatapendidikan.push({ 'colId': 1, 'Jenis': 'Formal', 'loginName': $scope.loginName });
                $scope.listDatapendidikanNonFormal.push({ 'colId': 1, 'Jenis': 'NonFormal', 'loginName': $scope.loginName });
            }
        });

        $scope.submitPendidikan = function () {
            $rootScope.test = [];
            var isValidated = true;
          
            //foreach list semuanya karena ada banyak dan semuanya masuk array jadi ada array dalem array and you cant do that
            $scope.listDatapendidikan.forEach(function (element) {
                $scope.allPendidikan.push(element);
            });

            //console.log($scope.allPendidikan);
            $scope.index = 0;
            //ngecek ada yg kosong apa engga buat di notif
            $scope.listDatapendidikan.forEach(function (element) {
                if (element.LevelPendidikan == undefined) {
                    $scope.indexLevel = "level" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexLevel));
                    if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                        $rootScope.test.push("<b>Pendidikan Formal<br>");
                        $rootScope.test.push("Level Pendidikan<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Level Pendidikan<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexLevel = "level" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexLevel));
                    myEl.removeClass('f-danger');
                }

                if (element.NamaInstitusi == undefined) {
                    $scope.indexNmFormal = "nmFormal" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexNmFormal));
                    if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                        $rootScope.test.push("<b>Pendidikan Formal<br>");
                        $rootScope.test.push("Nama Institusi<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Nama Institusi<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexNmFormal = "nmFormal" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexNmFormal));
                    myEl.removeClass('f-danger');
                }

                if (element.Kota == undefined) {
                    $scope.indexKota = "kota" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexKota));
                    if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                        $rootScope.test.push("<b>Pendidikan Formal<br>");
                        $rootScope.test.push("Kota<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Kota<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexKota = "kota" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexKota));
                    myEl.removeClass('f-danger');
                }

                if (element.Jurusan == undefined) {
                    $scope.indexJurusan = "jurusan" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexJurusan));
                    if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                        $rootScope.test.push("<b>Pendidikan Formal<br>");
                        $rootScope.test.push("Jurusan<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Jurusan<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexJurusan = "jurusan" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexJurusan));
                    myEl.removeClass('f-danger');
                }

                if (element.Gelar == undefined) {
                    $scope.indexGelar = "gelar" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexGelar));
                    if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                        $rootScope.test.push("<b>Pendidikan Formal<br>");
                        $rootScope.test.push("Gelar<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Gelar<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexGelar = "gelar" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexGelar));
                    myEl.removeClass('f-danger');
                }

                if (element.IPK == undefined) {
                    $scope.indexIpk = "ipk" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexIpk));
                    if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                        $rootScope.test.push("<b>Pendidikan Formal<br>");
                        $rootScope.test.push("IPK<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("IPK<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexIpk = "ipk" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexIpk));
                    myEl.removeClass('f-danger');
                }

                if (element.TanggalMasuk == undefined) {
                    $scope.indexTglMasuk = "tglMasuk" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTglMasuk));
                    if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                        $rootScope.test.push("<b>Pendidikan Formal<br>");
                        $rootScope.test.push("Tahun Masuk<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Tahun Masuk<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexTglMasuk = "tglMasuk" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTglMasuk));
                    myEl.removeClass('f-danger');
                }

                if (element.TanggalLulus == undefined) {
                    $scope.indexTglLulus = "tglLulus" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTglLulus));
                    if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                        $rootScope.test.push("<b>Pendidikan Formal<br>");
                        $rootScope.test.push("Tahun Lulus<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Tahun Lulus<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexTglLulus = "tglLulus" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTglLulus));
                    myEl.removeClass('f-danger');
                }
                if (element.TanggalMasuk &&
                    element.TanggalLulus) {
                    if (element.TanggalMasuk > element.TanggalLulus) {
                        $scope.indexTglLulus = "tglLulus" + ($scope.index);
                        $scope.indexTglMasuk = "tglMasuk" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglLulus));
                        var myEl2 = angular.element(document.getElementById($scope.indexTglMasuk));
                        if ($rootScope.test.includes("<b>Pendidikan Formal<br>") != true) {
                            $rootScope.test.push("<b>Pendidikan Formal<br>");
                            //$rootScope.test.push("Tanggal Lulus<br>");
                            //$rootScope.test.push("Tanggal Masuk<br>");
                        }
                        if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Masuk<br>");
                            $rootScope.test.push("Tanggal Lulus<br>");
                        }
                        myEl.addClass('form-control f-danger');
                        myEl2.addClass('form-control f-danger');
                    } else {
                        $scope.indexTglLulus = "tglLulus" + ($scope.index);
                        $scope.indexTglMasuk = "tglMasuk" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglLulus));
                        var myEl2 = angular.element(document.getElementById($scope.indexTglMasuk));
                        myEl.removeClass('f-danger');
                        myEl2.removeClass('f-danger');
                    }
                }
                $scope.index = $scope.index + 1;
            });

            if ($scope.listDatapendidikanNonFormal != null) {
                $scope.index = 0;
                $scope.listDatapendidikanNonFormal.forEach(function (element) {
                    $scope.isiPendidikanNon = (element.TopikPelatihan ||
                        element.Kota ||
                        element.Lembaga ||
                        element.Sertifikasi ||
                        element.IPK ||
                        element.TanggalMasuk ||
                        element.TanggalLulus);

                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.TopikPelatihan == undefined ||
                        element.TopikPelatihan == "") {
                        $scope.indexTopik = "topik" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTopik));
                        if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>") != true) {
                            $rootScope.test.push("<b>Pendidikan NonFormal<br>");
                            $rootScope.test.push("Topik Pelatihan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Topik Pelatihan<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexTopik = "topik" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTopik));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.Kota == undefined ||
                        element.Kota == "") {
                        $scope.indexKotaNon = "kotaNon" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexKotaNon));
                        if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>") != true) {
                            $rootScope.test.push("<b>Pendidikan NonFormal<br>");
                            $rootScope.test.push("Kota<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Kota<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexKotaNon = "kotaNon" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexKotaNon));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.Sertifikasi == undefined ||
                        element.Sertifikasi == "") {
                        $scope.indexSertifikasi = "sertifikasi" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexSertifikasi));
                        if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>") != true) {
                            $rootScope.test.push("<b>Pendidikan NonFormal<br>");
                            $rootScope.test.push("Sertifikasi<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Sertifikasi<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexSertifikasi = "sertifikasi" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexSertifikasi));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.Lembaga == undefined ||
                        element.Lembaga == "") {
                        $scope.indexLembaga = "lembaga" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexLembaga));
                        if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>") != true) {
                            $rootScope.test.push("<b>Pendidikan NonFormal<br>");
                            $rootScope.test.push("Lembaga<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Lembaga<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexLembaga = "lembaga" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexLembaga));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.IPK == undefined ||
                        element.IPK == "") {
                        $scope.indexNilaiNon = "nilaiNon" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexNilaiNon));
                        if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>") != true) {
                            $rootScope.test.push("<b>Pendidikan NonFormal<br>");
                            $rootScope.test.push("IPK<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("IPK<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexNilaiNon = "nilaiNon" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexNilaiNon));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.TanggalMasuk == undefined ||
                        element.TanggalMasuk == "") {
                        $scope.indexTglMasukNon = "tglMasukNon" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglMasukNon));
                        if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>") != true) {
                            $rootScope.test.push("<b>Pendidikan NonFormal<br>");
                            $rootScope.test.push("Tanggal Masuk<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Masuk<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexTglMasukNon = "tglMasukNon" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglMasukNon));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.TanggalLulus == undefined ||
                        element.TanggalLulus == "") {
                        $scope.indexTglLulusNon = "tglLulusNon" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglLulusNon));
                        if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>") != true) {
                            $rootScope.test.push("<b>Pendidikan NonFormal<br>");
                            $rootScope.test.push("Tanggal Lulus<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Lulus<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexTglLulusNon = "tglLulusNon" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglLulusNon));
                        myEl.removeClass('f-danger');
                    }

                    if (element.TanggalMasuk &&
                        element.TanggalLulus) {
                        if ($scope.isiPendidikanNon &&
                            $scope.listDatapendidikanNonFormal.length != -1 &&
                            element.TanggalMasuk > element.TanggalLulus) {
                            $scope.indexTglLulusNon = "tglLulusNon" + ($scope.index);
                            $scope.indexTglMasukNon = "tglMasukNon" + ($scope.index);
                            var myEl = angular.element(document.getElementById($scope.indexTglLulusNon));
                            var myEl2 = angular.element(document.getElementById($scope.indexTglMasukNon));
                            if ($rootScope.test.includes("<b>Pendidikan NonFormal<br>") != true) {
                                $rootScope.test.push("<b>Pendidikan NonFormal<br>");
                                //$rootScope.test.push("Tanggal Lulus<br>");
                                //$rootScope.test.push("Tanggal Masuk<br>");
                            }
                            if ($rootScope.test != null) {
                                $rootScope.test.push("Tanggal Masuk<br>");
                                $rootScope.test.push("Tanggal Lulus<br>");
                            }
                            myEl.addClass('form-control f-danger');
                            myEl2.addClass('form-control f-danger');
                        } else {
                            $scope.indexTglLulusNon = "tglLulusNon" + ($scope.index);
                            $scope.indexTglMasukNon = "tglMasukNon" + ($scope.index);
                            var myEl = angular.element(document.getElementById($scope.indexTglLulusNon));
                            var myEl2 = angular.element(document.getElementById($scope.indexTglMasukNon));
                            myEl.removeClass('f-danger');
                            myEl2.removeClass('f-danger');
                        }
                    }
                    $scope.index = $scope.index + 1;
                });
            }


            if ($scope.listDatapendidikanNonFormal != null) {
                $scope.index = 0;
                $scope.listDatapendidikanNonFormal.forEach(function (element) {
                    $scope.isiPendidikanNon = (element.TopikPelatihan ||
                        element.Kota ||
                        element.Lembaga ||
                        element.Sertifikasi ||
                        element.IPK ||
                        element.TanggalMasuk ||
                        element.TanggalLulus);

/*                    if (!isValidated) {
                        return;
                    }*/

                    if ((element.TopikPelatihan == "" &&
                        element.Kota == "" &&
                        element.Lembaga == "" &&
                        element.Sertifikasi == "" &&
                        element.IPK == "" &&
                        element.TanggalMasuk == "" &&
                        element.TanggalLulus == "")) {
                       // isValidated = false;
                        $scope.listDatapendidikanNonFormal.pop(element);
                    }
                    if ((element.TopikPelatihan == "" || !element.TopikPelatihan) &&
                        (element.Kota == "" || !element.Kota) &&
                        (element.Lembaga == "" || !element.Lembaga) &&
                        (element.Sertifikasi == "" || !element.Sertifikasi) &&
                        (element.IPK == "" || !element.IPK) &&
                        (element.TanggalMasuk == "" || !element.TanggalMasuk) &&
                        (element.TanggalLulus == "" || !element.TanggalLulus)) {
                        //isValidated = false;
                        $scope.listDatapendidikanNonFormal.pop(element);
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.TopikPelatihan == undefined ||
                        element.TopikPelatihan == "") {

                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.Kota == undefined ||
                        element.Kota == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.Sertifikasi == undefined ||
                        element.Sertifikasi == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.Lembaga == undefined ||
                        element.Lembaga == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.IPK == undefined ||
                        element.IPK == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.TanggalMasuk == undefined ||
                        element.TanggalMasuk == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.TanggalLulus == undefined ||
                        element.TanggalLulus == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if ($scope.isiPendidikanNon &&
                        $scope.listDatapendidikanNonFormal.length != -1 &&
                        element.TanggalMasuk > element.TanggalLulus) {
                        swalAlert.message('e', "Tanggal masuk tidak boleh melebihi tanggal lulus");
                        isValidated = false;
                    }
                    $scope.index = $scope.index + 1;
                });
            }

            
/*            $scope.listDatapendidikanNonFormal.forEach(function(element) {
            });*/
            $scope.index = 0;
            $scope.allPendidikan.forEach(function (element) {
                if (element.Jenis == 'Formal') {
                    if (element.TanggalLulus < element.TanggalMasuk) {
                        swalAlert.message('e', "Tanggal masuk tidak boleh melebihi tanggal lulus");
                        isValidated = false;
                        return;
                    }


                    if (element.LevelPendidikan == undefined ||
                        element.NamaInstitusi == undefined ||
                        element.Kota == undefined ||
                        element.Jurusan == undefined ||
                        element.Gelar == undefined ||
                        element.IPK == undefined ||
                        element.TanggalMasuk == undefined ||
                        element.TanggalLulus == undefined) {
                        swalAlert.message('e', "lengkapi data terlebih dahulu");
                        $scope.allPendidikan = [];
                        isValidated = false;
                        return;
                    }
                }
                $scope.index = $scope.index + 1;
            });

    

            $scope.listDatapendidikanNonFormal.forEach(function (element) {
                $scope.allPendidikan.push(element);
                /*              if (element.TanggalMasuk == undefined) {
                              } else {
                                  $scope.allPendidikan.push(element);
                              }*/
            });


            if (!isValidated) {
                return;
            }
           
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            $http.post('api/Recruitment/SubmitDataPendidikan', $scope.allPendidikan).then(function (response) {
                //$state.go('rekrutmenPekerjaan');
               
                if (response.data.isSucceed) {                                      
                    swalAlert.message('s', response.data.message);
                    $state.go('rekrutmenPekerjaan');
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                   
                } else {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                    $scope.allPendidikan = [];
                    swalAlert.message('e', response.data.message);
                }
            });
        };
    });

})(angular.module('SunLifeApp'));