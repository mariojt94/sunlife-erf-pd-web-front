(function (app) {
    'use strict';

    app.controller('rekrutmenDataPekerjaanController', function ($window, $scope, $http, $state, authService, localStorageService, swalAlert, $rootScope, $cookies) {
        $scope.loginName = localStorageService.get('LoginName');
/*        $scope.statusDataPribadi = localStorageService.get('statusDataPribadi');
        $scope.statusKontak = localStorageService.get('statusKontak');
        $scope.statusDataKeluarga = localStorageService.get('statusDataKeluarga');
        $scope.statusDataPendidikan = localStorageService.get('statusDataPendidikan');
        $scope.statusDataPekerjaan = localStorageService.get('statusDataPekerjaan');
        $scope.statusDataDokumen = localStorageService.get('statusDataDokumen');*/
        $scope.jumlahMinat = [];
        $scope.listDataPekerjaan = [];
        $scope.listDataOrganisasi = [];
        $scope.listDataPenghargaan = [];
        $scope.listDataBahasa = [];
        $scope.listDataKeahlian = [];
        $scope.listDataPlusMin = [];
       
        $scope.KemampuanBahasa = ["SANGAT BAIK", "BAIK", "CUKUP","KURANG"];
        $scope.minat = {};
       

        $scope.tanggalSekarang = new Date();
        $scope.tahunSekarang = $scope.tanggalSekarang.getFullYear();

        /*
        $scope.deleteContactDarurat = function (index) {
            // remove the row specified in index
            $scope.listKontakDarurat.splice(index, 1);
            console.log($scope.listKontakDarurat);
        };
*/

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

        $scope.tambahPekerjaan = function () {
            var newItemNo = $scope.listDataPekerjaan.length + 1;
            $scope.listDataPekerjaan.push({ 'colId': newItemNo, loginName: $scope.loginName });
        };

        $scope.deletePekerjaan = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDataPekerjaan.splice(index, 1);
            $http.post('api/Recruitment/DeletePekerjaan', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");

                } else {
                    console.log("gagal ngapus");
                }
            });
           
        };


        $scope.tambahOrganisasi = function () {
            var newItemNo = $scope.listDataOrganisasi.length + 1;
            $scope.listDataOrganisasi.push({ 'colId': newItemNo, loginName: $scope.loginName });
        };
        $scope.deleteOrganisasi = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDataOrganisasi.splice(index, 1);
            $http.post('api/Recruitment/DeleteOrganisasi', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");

                } else {
                    console.log("gagal ngapus");
                }
            });
            
        };


        $scope.tambahPenghargaan = function () {
            var newItemNo = $scope.listDataPenghargaan.length + 1;
            $scope.listDataPenghargaan.push({ 'colId': newItemNo, loginName: $scope.loginName });
        };

        $scope.deletePenghargaan = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDataPenghargaan.splice(index, 1);
            $http.post('api/Recruitment/DeletePrestasi', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");

                } else {
                    console.log("gagal ngapus");
                }
            });
        };


        $scope.tambahBahasa = function () {
            var newItemNo = $scope.listDataBahasa.length + 1;
            $scope.listDataBahasa.push({ 'colId': newItemNo, loginName: $scope.loginName });

        };
        $scope.deleteBahasa = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDataBahasa.splice(index, 1);
            $http.post('api/Recruitment/DeleteBahasa', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");

                } else {
                    console.log("gagal ngapus");
                }
            });
        };


        $scope.tambahKeahlian = function () {
            var newItemNo = $scope.listDataKeahlian.length + 1;
            $scope.listDataKeahlian.push({ 'colId': newItemNo, loginName: $scope.loginName });
        };
        $scope.deleteKeahlian = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDataKeahlian.splice(index, 1);
            $http.post('api/Recruitment/DeleteKeahlian', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");

                } else {
                    console.log("gagal ngapus");
                }
            });
        };

        
        $scope.tambahPlusMin = function () {
            var newItemNo = $scope.listDataPlusMin.length + 1;
            $scope.listDataPlusMin.push({ 'colId': newItemNo, loginName: $scope.loginName });
        };

        $scope.deletePlusMin = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDataPlusMin.splice(index, 1);
            $http.post('api/Recruitment/DeletePlusMin', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");

                } else {
                    console.log("gagal ngapus");
                }
            });
        };

        $scope.maxMinat = 5;

        $scope.changeMinat = function (type, model) {
            var index = $scope.jumlahMinat.indexOf(type);
            if (model) {
                if (index < 0) {
                    $scope.jumlahMinat.push(type);
                }

            } else {
               if (index > -1) {
                   $scope.jumlahMinat.splice(index, 1);

                }
            }
        };

        //#region Get semua buat nentuin ceklis
        $http({
            method: 'GET',
            url: 'api/Recruitment/GetDataPribadi',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataKeluarga = res.data[0].IsKeluargaComplete;
                $scope.statusDataPribadi = true;
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
        //   // console.log(res.data);
        //    if (res.data != null && res.data.length != 0) {
        //        $scope.statusDataKeluarga = true;
        //    } else {
        //        $scope.statusDataKeluarga = false;
        //        // console.log($scope.statusDataKeluarga);
        //    }
        //});

        $scope.GetCandidateDataPendidikan = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateDataPendidikan',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataPendidikan = true;
            } else {
                $scope.statusDataPendidikan = false;
            }
        });


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


        //get pengalaman kerja
        $scope.GetCandidateExperiencePekerjaan = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateExperiencePekerjaan',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.ItemPekerjaan = res.data;
            if (res.data.length != 0) {
                $scope.ItemPekerjaan.forEach(function(element) {
                    $scope.listDataPekerjaan.push(element);
                });
            } else {
                $scope.listDataPekerjaan.push({ 'colId': 1, loginName: $scope.loginName });
            }
            
            //supaya gaji ada koma nya, jan lupa taro input-mask.js nya
            $('.money').inputmask({ alias: 'currency', prefix: '', digits: 0 });
        });


        //get pengalaman organisasi
        $scope.GetCandidateExperienceOrganisasi = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateExperienceOrganisasi',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.ItemOrganisasi = res.data;

            if (res.data.length != 0) {
                $scope.ItemOrganisasi.forEach(function(element) {
                    $scope.listDataOrganisasi.push(element);
                });
            } else {
                $scope.listDataOrganisasi.push({ 'colId': 1, loginName: $scope.loginName });
            }
        });

        //get prestasi
        $scope.GetCandidateExperiencePrestasi = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateExperiencePrestasi',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.ItemPrestasi = res.data;

            if (res.data.length != 0) {
                $scope.ItemPrestasi.forEach(function(element) {
                    element.TanggalTerima = new Date(element.TanggalTerima);
                    $scope.listDataPenghargaan.push(element);
                });
            } else {
                $scope.listDataPenghargaan.push({ 'colId': 1, loginName: $scope.loginName });
            }
        });

        //get kemampuan bahasa
        $scope.GetCandidateExperienceBahasa = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateExperienceBahasa',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.ItemBahasa = res.data;

            if (res.data.length != 0) {
                $scope.ItemBahasa.forEach(function(element) {
                    $scope.listDataBahasa.push(element);
                });
            } else {
                $scope.listDataBahasa.push({ 'colId': 1, loginName: $scope.loginName });
            }
        });


        //get keahlian
        $scope.GetCandidateExperienceKeahlian = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateExperienceKeahlian',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.ItemKeahlian = res.data;

            if (res.data.length != 0) {
                $scope.ItemKeahlian.forEach(function(element) {
                    $scope.listDataKeahlian.push(element);
                });
            } else {
                $scope.listDataKeahlian.push({ 'colId': 1, loginName: $scope.loginName });
            }
        });


        //get kelebihan kekurangan
        $scope.GetCandidateExperiencePlusMin = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateExperiencePlusMin',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.ItemPlusMin = res.data;

            if (res.data.length != 0) {
                $scope.ItemPlusMin.forEach(function(element) {
                    $scope.listDataPlusMin.push(element);
                });
            } else {
                $scope.listDataPlusMin.push({ 'colId': 1, loginName: $scope.loginName });
            }
        });


        //get minat
        $scope.GetCandidateExperienceMinat = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateExperienceMinat',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data.length > 0) {
                $scope.minat = res.data[0];
                
            }
            $scope.minat.loginName = $scope.loginName;
            
        });

        $scope.submitPekerjaan = function () {
            $rootScope.test = [];
            var isValidated = true;
            var arrayminat = [];
            arrayminat.push($scope.minat);
            $scope.listDataKeahlianToSend = {};
          
            $scope.index = 0;
            $scope.listDataPekerjaan.forEach(function(element) {
                if (element.NamaPerusahaan == undefined) {
                    $scope.indexNmPerusahaan = "nmPerusahaan" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexNmPerusahaan));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Nama Perusahaan<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Nama Perusahaan<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexNmPerusahaan = "nmPerusahaan" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexNmPerusahaan));
                    myEl.removeClass('f-danger');
                }
                if (element.JenisUsaha == undefined) {
                    $scope.indexJenisUsaha = "jenisUsaha" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexJenisUsaha));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Jenis Usaha<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Jenis Usaha<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexJenisUsaha = "jenisUsaha" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexJenisUsaha));
                    myEl.removeClass('f-danger');
                }
                if (element.Posisi == undefined) {
                    $scope.indexPosisi = "posisi" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexPosisi));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Posisi<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Posisi<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexPosisi = "posisi" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexPosisi));
                    myEl.removeClass('f-danger');
                }
                if (element.TanggalMasuk == undefined) {
                    $scope.indexThnMasuk = "thnMasuk" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexThnMasuk));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Tahun Masuk<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Tahun Masuk<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexThnMasuk = "thnMasuk" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexThnMasuk));
                    myEl.removeClass('f-danger');
                }
                if (element.TanggalResign == undefined) {
                    $scope.indexThnKeluar = "thnKeluar" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexThnKeluar));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Tahun Resign<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Tahun Resign<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexThnKeluar = "thnKeluar" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexThnKeluar));
                    myEl.removeClass('f-danger');
                }
                if (element.TelpKantor == undefined) {
                    $scope.indexTelp = "telp" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTelp));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Telepon Kantor<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Telepon Kantor<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexTelp = "telp" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTelp));
                    myEl.removeClass('f-danger');
                }
                if (element.Gaji == undefined) {
                    $scope.indexGaji = "gaji" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexGaji));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Gaji<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Gaji<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexGaji = "gaji" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexGaji));
                    myEl.removeClass('f-danger');
                }
                if (element.Tugas == undefined || element.Tugas == "") {
                    $scope.indexTugas = "tugas" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTugas));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Tugas<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Tugas<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexTugas = "tugas" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexTugas));
                    myEl.removeClass('f-danger');
                }
                if (element.AlasanBerhenti == undefined || element.AlasanBerhenti == "") {
                    $scope.indexAlasan = "alasan" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexAlasan));
                    if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                        $rootScope.test.push("<b>Pekerjaan<br>");
                        $rootScope.test.push("Alasan Berhenti<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Alasan Berhenti<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexAlasan = "alasan" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexAlasan));
                    myEl.removeClass('f-danger');
                }
                if (element.TanggalMasuk &&
                    element.TanggalResign) {
                    if (element.TanggalResign < element.TanggalMasuk) {
                        $scope.indexThnKeluar = "thnKeluar" + ($scope.index);
                        $scope.indexThnMasuk = "thnMasuk" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexThnKeluar));
                        var myEl2 = angular.element(document.getElementById($scope.indexThnMasuk));
                        if ($rootScope.test.includes("<b>Pekerjaan<br>") != true) {
                            $rootScope.test.push("<b>Pekerjaan<br>");

                        }
                        if ($rootScope.test != null) {
                            $rootScope.test.push("Tahun Resign<br>");
                            $rootScope.test.push("Tahun Masuk<br>");
                        }
                        myEl.addClass('form-control f-danger');
                        myEl2.addClass('form-control f-danger');
                    }
                }
                $scope.index = $scope.index + 1;
            });

            if ($scope.listDataOrganisasi != null) {
                $scope.index = 0;
                $scope.listDataOrganisasi.forEach(function (element) {
                    $scope.isiOrganisasi = (element.NamaOrganisasi ||
                        element.TanggalMasuk ||
                        element.Jabatan ||
                        element.TanggalBerhenti);

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.NamaOrganisasi == undefined ||
                        element.NamaOrganisasi == "") {
                        $scope.indexNamaOrg = "namaOrg" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexNamaOrg));
                        if ($rootScope.test.includes("<b>Data Organisasi<br>") != true) {
                            $rootScope.test.push("<b>Data Organisasi<br>");
                            $rootScope.test.push("Nama Organisasi<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Nama Organisasi<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexNamaOrg = "namaOrg" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexNamaOrg));
                        myEl.removeClass('f-danger');
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.TanggalMasuk == undefined ||
                        element.TanggalMasuk == "") {
                        $scope.indexTglMasukOrg = "tglMasukOrg" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglMasukOrg));
                        if ($rootScope.test.includes("<b>Data Organisasi<br>") != true) {
                            $rootScope.test.push("<b>Data Organisasi<br>");
                            $rootScope.test.push("Tanggal Masuk<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Masuk<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexTglMasukOrg = "tglMasukOrg" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglMasukOrg));
                        myEl.removeClass('f-danger');
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 && element.TanggalMasuk && element.TanggalBerhenti &&
                        element.TanggalMasuk > element.TanggalBerhenti) {
                        $scope.indexTglMasukOrg = "tglMasukOrg" + ($scope.index);
                        $scope.indexTglKeluarOrg = "tglKeluarOrg" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglMasukOrg));
                        var myEl2 = angular.element(document.getElementById($scope.indexTglKeluarOrg));

                        if ($rootScope.test.includes("<b>Data Organisasi<br>") != true) {
                            $rootScope.test.push("<b>Data Organisasi<br>");
                            $rootScope.test.push("Tanggal Masuk<br>");
                            $rootScope.test.push("Tanggal Berhenti<br>");
                        }
                        else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Masuk<br>");
                            $rootScope.test.push("Tanggal Berhenti<br>");
                        }

                        myEl.addClass('form-control f-danger');
                        myEl2.addClass('form-control f-danger');
                    } else {
                        $scope.indexTglMasukOrg = "tglMasukOrg" + ($scope.index);
                        $scope.indexTglKeluarOrg = "tglKeluarOrg" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglMasukOrg));
                        var myEl2 = angular.element(document.getElementById($scope.indexTglKeluarOrg));
                        myEl.removeClass('f-danger');
                        myEl2.removeClass('f-danger');
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.Jabatan == undefined ||
                        element.Jabatan == "") {
                        $scope.indexJabatan = "jabatan" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexJabatan));
                        if ($rootScope.test.includes("<b>Data Organisasi<br>") != true) {
                            $rootScope.test.push("<b>Data Organisasi<br>");
                            $rootScope.test.push("Jabatan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Jabatan<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexJabatan = "jabatan" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexJabatan));
                        myEl.removeClass('f-danger');
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.TanggalBerhenti == undefined ||
                        element.TanggalBerhenti == "") {
                        $scope.indexTglKeluarOrg = "tglKeluarOrg" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglKeluarOrg));
                        if ($rootScope.test.includes("<b>Data Organisasi<br>") != true) {
                            $rootScope.test.push("<b>Data Organisasi<br>");
                            $rootScope.test.push("Tanggal Berhenti<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Berhenti<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexTglKeluarOrg = "tglKeluarOrg" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglKeluarOrg));
                        myEl.removeClass('f-danger');
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.Kegiatan == undefined ||
                        element.Kegiatan == "") {
                        $scope.indexKegiatan = "kegiatan" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexKegiatan));
                        if ($rootScope.test.includes("<b>Data Organisasi<br>") != true) {
                            $rootScope.test.push("<b>Data Organisasi<br>");
                            $rootScope.test.push("Kegiatan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Kegiatan<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexKegiatan = "kegiatan" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexKegiatan));
                        myEl.removeClass('f-danger');
                    }
                    $scope.index = $scope.index + 1;
                });
            }

            $scope.index = 0;
            $scope.listDataBahasa.forEach(function (element) {
               
                if (element.Bahasa == undefined) {
                    $scope.indexNmBahasa = "nmBahasa" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexNmBahasa));
                    if ($rootScope.test.includes("<b>Bahasa<br>") != true) {
                        $rootScope.test.push("<b>Bahasa<br>");
                        $rootScope.test.push("Bahasa<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Bahasa<br>");
                    }
                    myEl.addClass('form-control f-danger');
                } else {
                    $scope.indexNmBahasa = "nmBahasa" + ($scope.index);
                    var myEl = angular.element(document.getElementById($scope.indexNmBahasa));
                    myEl.removeClass('f-danger');
                }
                if (element.Membaca == undefined) {
                    if ($rootScope.test.includes("<b>Bahasa<br>") != true) {
                        $rootScope.test.push("<b>Bahasa<br>");
                        $rootScope.test.push("Kemampuan Membaca<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Kemampuan Membaca<br>");
                    }
                }
                if (element.Berbicara == undefined) {
                    if ($rootScope.test.includes("<b>Bahasa<br>") != true) {
                        $rootScope.test.push("<b>Bahasa<br>");
                        $rootScope.test.push("Kemampuan Berbicara<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Kemampuan Berbicara<br>");
                    }
                }
                if (element.Menulis == undefined) {
                    if ($rootScope.test.includes("<b>Bahasa<br>") != true) {
                        $rootScope.test.push("<b>Bahasa<br>");
                        $rootScope.test.push("Kemampuan Menulis<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Kemampuan Menulis<br>");
                    }
                }
                $scope.index = $scope.index + 1;
            });

            if ($scope.minat == undefined) {
                $rootScope.test.push("Minat Kerja <br>");

            } else if ($scope.minat.FrontLiners == undefined ||
                $scope.minat.Administration == undefined ||
                $scope.minat.Accounting == undefined ||
                $scope.minat.Sales == undefined ||
                $scope.minat.Other == undefined) {
                if ($rootScope.test.includes("<b>Minat<br>") != true) {
                    $rootScope.test.push("<b>Minat<br>");
                    $rootScope.test.push("Minat Kerja<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Minat Kerja<br>");
                }
            }



            if ($scope.listDataKeahlian != null) {
                $scope.index = 0;
                $scope.listDataKeahlian.forEach(function (element) {
                    $scope.isiKeahlian = (element.NamaKeahlian || element.Sertifikasi);

                    if ($scope.isiKeahlian && $scope.listDataKeahlian.length != -1 && element.NamaKeahlian == undefined || element.NamaKeahlian == "") {
                        $scope.indexKeahlian = "keahlian" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexKeahlian));
                        if ($rootScope.test.includes("<b>Keahlian<br>") != true) {
                            $rootScope.test.push("<b>Keahlian<br>");
                            $rootScope.test.push("Nama Keahlian<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Nama Keahlian<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexKeahlian = "keahlian" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexKeahlian));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiKeahlian && $scope.listDataKeahlian.length != -1 && element.Sertifikasi == undefined || element.Sertifikasi == "") {
                        $scope.indexSertifikasi = "sertifikasi" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexSertifikasi));
                        if ($rootScope.test.includes("<b>Keahlian<br>") != true) {
                            $rootScope.test.push("<b>Keahlian<br>");
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
                    $scope.index = $scope.index + 1;
                });
            }

            if ($scope.listDataPenghargaan != null) {
                $scope.index = 0;
                $scope.listDataPenghargaan.forEach(function (element) {
                    $scope.isiPenghargaan =
                        element.NamaPenghargaan || element.PemberiPenghargaan || element.TanggalTerima;


                    if ($scope.isiPenghargaan &&
                        $scope.listDataPenghargaan.length != -1 &&
                        element.NamaPenghargaan == undefined ||
                        element.NamaPenghargaan == "") {
                        $scope.indexNmPenghargaan = "nmPenghargaan" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexNmPenghargaan));
                        if ($rootScope.test.includes("<b>Prestasi<br>") != true) {
                            $rootScope.test.push("<b>Prestasi<br>");
                            $rootScope.test.push("Nama Penghargaan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Nama Penghargaan<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexNmPenghargaan = "nmPenghargaan" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexNmPenghargaan));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiPenghargaan &&
                        $scope.listDataPenghargaan.length != -1 &&
                        element.PemberiPenghargaan == undefined ||
                        element.PemberiPenghargaan == "") {
                        $scope.indexPemberi = "pemberi" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexPemberi));
                        if ($rootScope.test.includes("<b>Prestasi<br>") != true) {
                            $rootScope.test.push("<b>Prestasi<br>");
                            $rootScope.test.push("Pemberi Penghargaan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Pemberi Penghargaan<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexPemberi = "pemberi" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexPemberi));
                        myEl.removeClass('f-danger');
                    }
                    if ($scope.isiPenghargaan &&
                        $scope.listDataPenghargaan.length != -1 &&
                        element.TanggalTerima == undefined ||
                        element.TanggalTerima == "") {
                        $scope.indexTglTerima = "tglTerima" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglTerima));
                        if ($rootScope.test.includes("<b>Prestasi<br>") != true) {
                            $rootScope.test.push("<b>Prestasi<br>");
                            $rootScope.test.push("Tanggal Terima<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Terima<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexTglTerima = "tglTerima" + ($scope.index);
                        var myEl = angular.element(document.getElementById($scope.indexTglTerima));
                        myEl.removeClass('f-danger');
                    }
                    $scope.index = $scope.index + 1;
                });
            }

            $scope.listDataPlusMin.forEach(function (element, key) {
                if (key == 0) {
                    if (element.Kelebihan == undefined || element.Kelebihan == "") {
                        if ($rootScope.test.includes("<b>Kelebihan & Kekurangan<br>") != true) {
                            $rootScope.test.push("<b>Kelebihan & Kekurangan<br>");
                            $rootScope.test.push("Kelebihan/Kekurangan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Kelebihan/Kekurangan<br>");
                        }
                        var myEl = angular.element(document.getElementById('plus'));
                        myEl.addClass('form-control f-danger');
                    } else {
                        //$scope.indexTglTerima = "tglTerima" + ($scope.index);
                        var myEl = angular.element(document.getElementById('plus'));
                        myEl.removeClass('f-danger');
                    }
                    if (element.Kekurangan == undefined || element.Kekurangan == "") {
                        if ($rootScope.test.includes("<b>Kelebihan & Kekurangan<br>") != true) {
                            $rootScope.test.push("<b>Kelebihan & Kekurangan<br>");
                            $rootScope.test.push("Kelebihan/Kekurangan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Kelebihan/Kekurangan<br>");
                        }
                        var myEl = angular.element(document.getElementById('min'));
                        myEl.addClass('form-control f-danger');
                    } else {
                        //$scope.indexTglTerima = "tglTerima" + ($scope.index);
                        var myEl = angular.element(document.getElementById('min'));
                        myEl.removeClass('f-danger');
                    }
                } 
            });

            $scope.index = 0;
            $scope.listDataPekerjaan.forEach(function(element) {
                if (element.NamaPerusahaan == undefined ||
                    element.NamaPerusahaan == "" ||
                    element.JenisUsaha == undefined ||
                    element.JenisUsaha == "" ||
                    element.Posisi == undefined ||
                    element.Posisi == "" ||
                    element.TanggalMasuk == undefined ||
                    element.TanggalMasuk == "" ||
                    element.TanggalResign == undefined ||
                    element.TanggalResign == "" ||
                    element.TelpKantor == undefined ||
                    element.TelpKantor == "" ||
                    element.Gaji == undefined ||
                    element.Gaji == "" ||
                    element.Tugas == undefined ||
                    element.Tugas == "" ||
                    element.AlasanBerhenti == undefined ||
                    element.AlasanBerhenti == "") {
                    swalAlert.message('e', "lengkapi data terlebih dahulu");
                    isValidated = false;
                    return;
                }

                if (element.TanggalResign < element.TanggalMasuk) {
                    swalAlert.message('e', "Tanggal masuk tidak boleh melebihi tanggal keluar");
                    isValidated = false;
                    return;
                }
                $scope.index = $scope.index + 1;
            });

            if ($scope.listDataOrganisasi != null) {
                $scope.index = 0;
                $scope.listDataOrganisasi.forEach(function(element) {
                    $scope.isiOrganisasi = (element.NamaOrganisasi ||
                        element.TanggalMasuk ||
                        element.Jabatan ||
                        element.TanggalBerhenti);

/*                    if (!isValidated) {
                        return;
                    }*/

                    if ((element.NamaOrganisasi == "" &&
                        element.TanggalMasuk == "" &&
                        element.Jabatan == "" &&
                        element.TanggalBerhenti == "")) {
                        //isValidated = true;
                        $scope.listDataOrganisasi.pop(element);
                    }
                    if ((element.NamaOrganisasi == "" || !element.NamaOrganisasi) &&
                        (element.TanggalMasuk == "" || !element.TanggalMasuk) &&
                        (element.Jabatan == "" || !element.Jabatan) &&
                        (element.TanggalBerhenti == "" || !element.TanggalBerhenti)) {
                        //isValidated = true;
                        $scope.listDataOrganisasi.pop(element);
                    }
                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.NamaOrganisasi == undefined ||
                        element.NamaOrganisasi == "") {

                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.TanggalMasuk == undefined ||
                        element.TanggalMasuk == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.TanggalMasuk > element.TanggalBerhenti) {
                        swalAlert.message('e', "Tanggal masuk tidak boleh melebihi tanggal keluar");
                        isValidated = false;
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.Jabatan == undefined ||
                        element.Jabatan == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.TanggalBerhenti == undefined ||
                        element.TanggalBerhenti == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }

                    if ($scope.isiOrganisasi &&
                        $scope.listDataOrganisasi.length != -1 &&
                        element.Kegiatan == undefined ||
                        element.Kegiatan == "") {
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    $scope.index = $scope.index + 1;
                });
            }
            if (!isValidated) {
                return;
            }

            if ($scope.listDataKeahlian != null) {
                $scope.listDataKeahlian.forEach(function (element) {
                    $scope.isiKeahlian = (element.NamaKeahlian || element.Sertifikasi);
                    if (!isValidated) {
                        return;
                    }
                    if ((element.NamaKeahlian == "" &&
                        element.Sertifikasi == "")) {
                        isValidated = true;
                        $scope.listDataKeahlian.pop(element);
                    }

                    else if ($scope.isiKeahlian && $scope.listDataKeahlian.length != -1 && element.NamaKeahlian == undefined || element.NamaKeahlian == "") {         
/*                        if ($rootScope.test.includes("<b>Keahlian<br>") != true) {
                            $rootScope.test.push("<b>Keahlian<br>");
                            $rootScope.test.push("Nama Keahlian<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Nama Keahlian<br>");
                        }*/
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                        return;
                    }
                    else if ($scope.isiKeahlian && $scope.listDataKeahlian.length != -1 && element.Sertifikasi == undefined || element.Sertifikasi == "") {
/*                        if ($rootScope.test.includes("<b>Keahlian<br>") != true) {
                            $rootScope.test.push("<b>Keahlian<br>");
                            $rootScope.test.push("Sertifikasi<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Sertifikasi<br>");
                        }*/
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                        return;
                    }
                    else if ((element.NamaKeahlian == "" || !element.NamaKeahlian) &&
                        (element.Sertifikasi == "" || !element.Sertifikasi)) {
                        isValidated = true;
                        $scope.listDataKeahlian.pop(element);
                    }
                    /*
                                    else if ($scope.listDataKeahlian.length != -1) {
                                        isValidated = false;
                                    }*/
                });
            }
            

            if (!isValidated) {
                return;
            }


            if ($scope.listDataPenghargaan != null) {
                $scope.listDataPenghargaan.forEach(function(element) {
                    $scope.isiPenghargaan =
                        element.NamaPenghargaan || element.PemberiPenghargaan || element.TanggalTerima;

                    if (!isValidated) {
                        return;
                    }

                    if ((element.NamaPenghargaan == "" &&
                        element.PemberiPenghargaan == "" &&
                        element.TanggalTerima == "")) {
                        isValidated = true;
                        $scope.listDataPenghargaan.pop(element);
                    } else if ((element.NamaPenghargaan == "" || !element.NamaPenghargaan) &&
                        (element.PemberiPenghargaan == "" || !element.PemberiPenghargaan) &&
                        (element.TanggalTerima == "" || !element.TanggalTerima)) {
                        isValidated = true;
                        $scope.listDataPenghargaan.pop(element);
                    } else if ($scope.isiPenghargaan &&
                        $scope.listDataKeahlian.length != -1 &&
                        element.NamaPenghargaan == undefined ||
                        element.NamaPenghargaan == "") {
/*                        if ($rootScope.test.includes("<b>Prestasi<br>") != true) {
                            $rootScope.test.push("<b>Prestasi<br>");
                            $rootScope.test.push("Nama Penghargaan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Nama Penghargaan<br>");
                        }*/
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    } else if ($scope.isiPenghargaan &&
                        $scope.listDataKeahlian.length != -1 &&
                        element.PemberiPenghargaan == undefined ||
                        element.PemberiPenghargaan == "") {
/*                        if ($rootScope.test.includes("<b>Prestasi<br>") != true) {
                            $rootScope.test.push("<b>Prestasi<br>");
                            $rootScope.test.push("Pemberi Penghargaan<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Pemberi Penghargaan<br>");
                        }*/
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    } else if ($scope.isiPenghargaan &&
                        $scope.listDataKeahlian.length != -1 &&
                        element.TanggalTerima == undefined ||
                        element.TanggalTerima == "") {
/*                        if ($rootScope.test.includes("<b>Prestasi<br>") != true) {
                            $rootScope.test.push("<b>Prestasi<br>");
                            $rootScope.test.push("Tanggal Terima<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Terima<br>");
                        }*/
                        swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                        isValidated = false;
                    }

                });
            }
            if (!isValidated) {
                return;
            }

            if ($scope.listDataKeahlian != null) {
                if ($scope.listDataKeahlian.length == 0) {
                    //$scope.listDataKeahlian = null;
                    $scope.listDataKeahlian = [];
                }
            }

            if ($scope.listDataOrganisasi != null) {
                if ($scope.listDataOrganisasi.length == 0) {
                    //$scope.listDataOrganisasi = null;
                    $scope.listDataOrganisasi = [];
                }
            }

            if ($scope.listDataPenghargaan != null) {
                if ($scope.listDataPenghargaan.length == 0) {
                    //$scope.listDataPenghargaan = null;
                    $scope.listDataPenghargaan = [];
                }
            }

            if ($scope.minat.FrontLiners == undefined ||
                $scope.minat.Administration == undefined ||
                $scope.minat.Accounting == undefined ||
                $scope.minat.Sales == undefined ||
                $scope.minat.Other == undefined) {
                swalAlert.message('e', "pastikan nilai minat hanya terisi angka 1 s.d 5");
            } else if ($scope.minat.FrontLiners == $scope.minat.Administration ||
                $scope.minat.FrontLiners == $scope.minat.Accounting ||
                $scope.minat.FrontLiners == $scope.minat.Sales ||
                $scope.minat.FrontLiners == $scope.minat.Other ||
                $scope.minat.Administration == $scope.minat.Accounting ||
                $scope.minat.Administration == $scope.minat.Sales ||
                $scope.minat.Administration == $scope.minat.Other ||
                $scope.minat.Accounting == $scope.minat.Sales ||
                $scope.minat.Accounting == $scope.minat.Other ||
                $scope.minat.Sales == $scope.minat.Other
            ) {
                swalAlert.message('e', "nilai minat tidak boleh sama, harap isi 1 s.d 5");
            } else {
               /* if (params.Prestasi[0].NamaPenghargaan == undefined) {
                    params.Prestasi[0].TanggalTerima = new Date('1/11/1753');
                    
                }
                if (params.Organisasi[0].NamaOrganisasi == undefined) {
                    params.Organisasi[0].TanggalMasuk = new Date('1/11/1753');
                    params.Organisasi[0].TanggalBerhenti = new Date('1/11/1753');
                    //$scope.listDataOrganisasi.push({ 'colId': 1, loginName: $scope.loginName });
                }*/


                $scope.listDataPlusMin.forEach(function (element, key) {
                    if (key == 0) {
                        if (element.Kelebihan == undefined ||element.Kelebihan == "" || element.Kekurangan == undefined || element.Kekurangan == "") {
                            swalAlert.message('e', "lengkapi data terlebih dahulu");
                            isValidated = false;
                        }
                    } else {
                        if ((element.Kelebihan == undefined || element.Kelebihan == "") && (element.Kekurangan == undefined || element.Kekurangan == "")) {
                            swalAlert.message('e', "lengkapi data terlebih dahulu");
                            isValidated = false;
                        }
                    }
                });
                if (!isValidated) {
                    return;
                }
                $scope.listDataBahasa.forEach(function (element) {
                    if (element.Bahasa == undefined) {
                        swalAlert.message('e', "lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if (element.Membaca == undefined) {
                        swalAlert.message('e', "lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if (element.Berbicara == undefined) {
                        swalAlert.message('e', "lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                    if (element.Menulis == undefined) {
                        swalAlert.message('e', "lengkapi data terlebih dahulu");
                        isValidated = false;
                    }
                });


                if (!isValidated) {
                    return;
                }
                //console.log(params);

                //get back to this later
                /*if ($scope.listDataOrganisasi != null) {
                    if ($scope.listDataOrganisasi.length == 0) {
                        $scope.listDataOrganisasi = null;
                    }
                    else if ($scope.listDataOrganisasi.length > 0 &&
                    ($scope.listDataOrganisasi[0].NamaOrganisasi == "" ||
                        $scope.listDataOrganisasi[0].NamaOrganisasi == undefined)) {
                        $scope.listDataOrganisasi = null;
                    }
                }

                if ($scope.listDataPenghargaan != undefined) {
                    if ($scope.listDataPenghargaan.length == 0) {
                        delete $scope.listDataOrganisasi;
                    }
                    if ($scope.listDataPenghargaan.length > 0 &&
                    ($scope.listDataPenghargaan[0].NamaPenghargaan == undefined ||
                        $scope.listDataPenghargaan[0].NamaPenghargaan == "")) {
                        delete $scope.listDataPenghargaan;
                    }
                }


                if ($scope.listDataKeahlian != undefined) {
                    if ($scope.listDataKeahlian.length == 0) {
                        delete $scope.listDataOrganisasi;
                    }
                    if ($scope.listDataKeahlian[0].NamaKeahlian == undefined ||
                        $scope.listDataKeahlian[0].NamaKeahlian == "") {
                        delete $scope.listDataKeahlian;
                    }
                }
*/

                var params = {
                    'Pekerjaan': $scope.listDataPekerjaan,
                    'Organisasi': $scope.listDataOrganisasi,
                    'Prestasi': $scope.listDataPenghargaan,
                    'Bahasa': $scope.listDataBahasa,
                    'Keahlian': $scope.listDataKeahlian,
                    'Minat': arrayminat,
                    'PlusMin': $scope.listDataPlusMin
                }


                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                //var fD = new FormData();
                //fD.append(params);
/*                $http({
                    method: 'POST',
                    url: '/api/Recruitment/submitPekerjaan',
                    header: {'Content-Type':'application/json'},
                    params: params
                }).then(function (response) {
                    //$state.go('rekrutmenPekerjaan');
                    if (response.data.isSucceed) {
                        localStorageService.set('statusDataPekerjaan', response.data.isSucceed);
                        swalAlert.message('s', response.data.message);
                        $state.go('rekrutmenDokumen');
                    } else {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                        swalAlert.message('e', res.data.message);
                    }
                });*/
                $http.post('api/Recruitment/submitPekerjaan', params)
                    .then(function (response) {
                        if (response.data.isSucceed) {                           
                            swalAlert.message('s', response.data.message);
                            $state.go('rekrutmenDokumen');
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        } else {
                            $scope.listDataPekerjaan = [];
                            $scope.listDataOrganisasi = [];
                            $scope.listDataPenghargaan = [];
                            $scope.listDataBahasa = [];
                            $scope.listDataKeahlian = [];
                            arrayminat = [];
                            $scope.listDataPlusMin = [];

                            swalAlert.message('e', response.data.message);
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);

                        }
                    });
            }

        };


    });

})(angular.module('SunLifeApp'));