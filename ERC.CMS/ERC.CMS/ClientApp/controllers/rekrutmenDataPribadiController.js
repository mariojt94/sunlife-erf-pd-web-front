(function(app) {
    'use strict';


    app.controller('rekrutmenDataPribadiController',
        function ($window, $scope, $http, $state, authService, localStorageService, swalAlert, $rootScope, $cookies) {
            $scope.loginName = localStorageService.get('LoginName');
            $scope.sameData = false;
            $scope.field = {};
            $scope.fieldSama = {};
            $scope.fieldRekNpwp = {};
            $scope.fieldKesehatan = {};
            $scope.fieldrencana = {};
            $scope.ceklist = true;
            $scope.domisiliForm = true;
            $scope.formPenyakit = false;

            //#region declare kelas
            $scope.warnaMerahNM = 'form-control';
            $scope.warnaMerahKel = 'form-control';
            $scope.warnaMerahAl = 'form-control';
            $scope.warnaMerahRt = 'form-control';
            $scope.warnaMerahRw = 'form-control';
            $scope.warnaMerahProv = 'form-control';
            $scope.warnaMerahKot = 'form-control';
            $scope.warnaMerahKP = 'form-control';
            $scope.warnaMerahTeL = 'form-control';
            $scope.warnaMerahTaL = 'form-control';
            $scope.warnaMerahAg = 'form-control';
            $scope.warnaMerahSP = 'form-control';
            $scope.warnaMerahTB = 'form-control';
            $scope.warnaMerahBB = 'form-control';
            $scope.warnaMerahFSAl = 'form-control';
            $scope.warnaMerahFSRT = 'form-control';
            $scope.warnaMerahFSRW = 'form-control';
            $scope.warnaMerahFSProv = 'form-control';
            $scope.warnaMerahFSKot = 'form-control';
            $scope.warnaMerahFSKP = 'form-control';
            $scope.warnaMerahBank = 'form-control';
            $scope.warnaMerahCB = 'form-control';
            $scope.warnaMerahNR = 'form-control';
            $scope.warnaMerahNmR = 'form-control';
            $scope.warnaMerahKtp = 'form-control';
            $scope.warnaMerahTelp = 'form-control';
            $scope.warnaMerahEmail = 'form-control';
            $scope.warnaMerahKondisi = 'form-control-plaintext';
            //#endregion
            document.getElementById("datePickerId").max = new Date().toISOString().split("T")[0];

            $scope.tahunSekarang = new Date().getFullYear();
            $scope.bulanSekarang = new Date().getMonth()+1;
            $scope.tanggalSekarang = $scope.tahunSekarang + "-" + $scope.bulanSekarang;
            $scope.psikotes = localStorageService.get('statusPsikotes');

            $scope.clearDataSakit = function() {
                $scope.fieldKesehatan.penyakit = undefined;
                $scope.fieldKesehatan.tanggalSakit = null;
                $scope.fieldKesehatan.rs = undefined;
                $scope.fieldKesehatan.lamaDirawat = null;
                $scope.fieldKesehatan.isKambuh = undefined;
            }

            $scope.clearTglNikah = function() {
                $scope.fieldrencana.tanggalRencanaMenikah = undefined;
            }
            $scope.clearTglPunyaAnak = function() {
                $scope.fieldrencana.tanggalRencanaPunyaAnak = undefined;
            }
            $scope.clearTglKuliah = function() {
                $scope.fieldrencana.tanggalRencanaKuliah = undefined;
            }
            $scope.clearTglHaji = function() {
                $scope.fieldrencana.tanggalRencanaNaikHaji = undefined;
            }

            $scope.hapusNol = function() {
                var phone = $scope.field.PhoneNo;
                var phone2 = phone.substring(0,1);
                if (phone2 == "0") {
                    $scope.field.PhoneNo = "";
                }
            };
            //#region Get semua buat nentuin ceklis
            $scope.getKontak = $http({
                method: 'GET',
                url: 'api/Recruitment/GetKontak',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function(res) {
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
            }).then(function(res) {
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
            //}).then(function(res) {
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
                    if ($scope.nyariCV == null ||
                        $scope.nyariIjazah == null ||
                        $scope.nyariKTP == null ||
                        $scope.nyariFoto == null ||
                        $scope.nyariRek == null) {
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
            }).then(function(res) {
                //console.log(res.data);
                if (res.data != null && res.data.length != 0) {

                    $scope.GetCandidateExperienceBahasa = $http({
                        method: 'GET',
                        url: 'api/Recruitment/GetCandidateExperienceBahasa',
                        params: {
                            loginName: $scope.loginName
                        }
                    }).then(function(res) {
                        //console.log(res.data);
                        if (res.data != null && res.data.length != 0) {
                            $scope.GetCandidateExperienceMinat = $http({
                                method: 'GET',
                                url: 'api/Recruitment/GetCandidateExperienceMinat',
                                params: {
                                    loginName: $scope.loginName
                                }
                            }).then(function(res) {
                                //console.log(res.data);
                                if (res.data != null && res.data.length != 0) {
                                    $scope.GetCandidateExperiencePlusMin = $http({
                                        method: 'GET',
                                        url: 'api/Recruitment/GetCandidateExperiencePlusMin',
                                        params: {
                                            loginName: $scope.loginName
                                        }
                                    }).then(function(res) {
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
            }).then(function(res) {
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
            }).then(function(res) {
                if (res.data != null) {
                    //console.log(res);
                    $scope.statusDataPsikotes = true;
                } else {
                    $scope.statusDataPsikotes = false;
                }
            });

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
                url: 'api/Account/GetPDFSubmitStatus',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function(res) {
                if (res.data.IsSubmittedPDF == null || res.data.IsSubmittedPDF == false) {
                    //console.log(res);
                    $scope.statusDataReview = false;
                } else {
                    $scope.statusDataReview = true;
                }
            });
            //#endregion

            $http({
                method: 'GET',
                url: '/api/Recruitment/GetAgama'
            }).then(function(res) {
                $scope.listAgama = res.data;
                // $scope.loadData();
                console.log($scope.listAgama);
            });

            $http({
                method: 'GET',
                url: '/api/Recruitment/GetGender'
            }).then(function(res) {
                $scope.listGender = res.data;
            });

            $http({
                method: 'GET',
                url: '/api/Recruitment/GetStatusPerkawinan'
            }).then(function(res) {
                $scope.listStatusPerkawinan = res.data;
            });

            //ini ada di bankController
            $http({
                method: 'GET',
                url: '/api/Recruitment/GetBank'
            }).then(function(res) {
                $scope.listBank = res.data;
            });

            $http({
                method: 'GET',
                url: '/api/Province/GetProvinceName'
            }).then(function(res) {
                $scope.listProvince = res.data;
            });


            $http({
                method: 'GET',
                url: '/api/City/GetCity'
            }).then(function(res) {
                $scope.listCity = res.data;
                $scope.listCity2 = res.data;
                $scope.listAllCity = $scope.listCity;
            });


            $scope.changeProvince = function() {
                $scope.listCity = $scope.listAllCity.filter(a => { return a.provinceCode === $scope.field.provinsi; });
            };

            $scope.changeProvince2 = function () {
                $scope.listCity2 = $scope.listAllCity.filter(a => { return a.provinceCode === $scope.fieldSama.provinsi; });
            };

            $scope.ToPsikotes = function() {
                $http({
                    method: 'GET',
                    url: '/api/Recruitment/GetPsikotesHasil',
                    params: {
                        loginName: $scope.loginName
                    }
                }).then(function(res) {
                    if (res.data != null) {
                        //console.log(res);
                        $state.go('rekrutmenPsikotesFinish');
                    } else {
                        $state.go('rekrutmenPsikotes');
                    }
                });
            }

            $scope.ToPapikostik = function () {

                for (var index = 1; index <= 90; index++){ //15, 90 soal
                    var cookiesJawabanPapikostik = "cookiesJawabanPapikostik" + index;
                    var isiGetcookiesJawabanPapikostik = $cookies.get(cookiesJawabanPapikostik);

                    if (isiGetcookiesJawabanPapikostik == null || isiGetcookiesJawabanPapikostik == undefined) {
                        $cookies.put(cookiesJawabanPapikostik, undefined);
                    }
                }
                $state.go('rekrutmenPapikostik');
            }

            $http({
                method: 'GET',
                url: 'api/Recruitment/GetDataDomisili',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function(res) {
                $scope.fieldSama.namaLengkap = res.data[0].NamaLengkap;
                $scope.fieldSama.jenisKelamin = res.data[0].JenisKelamin;
                $scope.fieldSama.alamat = res.data[0].Alamat;
                $scope.fieldSama.rt = parseInt(res.data[0].Rt);
                $scope.fieldSama.rw = parseInt(res.data[0].Rw);
                $scope.fieldSama.provinsi = res.data[0].Provinsi;
                $scope.fieldSama.kota = res.data[0].Kota;
                $scope.fieldSama.kodePos = parseInt(res.data[0].KodePos);
                $scope.fieldSama.tempatLahir = res.data[0].TempatLahir;
                $scope.fieldSama.tanggalLahir = new Date(res.data[0].TanggalLahir);
                $scope.fieldSama.agama = res.data[0].Agama;
                $scope.fieldSama.statusPernikahan = res.data[0].StatusPernikahan;
                $scope.fieldSama.tinggiBadan = res.data[0].TinggiBadan;
                $scope.fieldSama.beratBadan = res.data[0].BeratBadan;
                $scope.fieldSama.bank = res.data[0].Bank;
            });

            $http({
                method: 'GET',
                url: 'api/Recruitment/GetDataPribadi2',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function(res) {
                console.log('data pribadi: ', res.data[0]);
                res.data[0].TanggalLahir == null ? $scope.field.tanggalLahir = null : $scope.field.tanggalLahir = new Date(res.data[0].TanggalLahir);
                $scope.field.namaLengkap = res.data[0].NamaLengkap;
                $scope.field.jenisKelamin = res.data[0].JenisKelamin;
                $scope.field.alamat = res.data[0].Alamat;
                $scope.field.rt = parseInt(res.data[0].Rt);
                $scope.field.rw = parseInt(res.data[0].Rw);
                $scope.field.provinsi = res.data[0].Provinsi;
                $scope.field.kota = res.data[0].Kota;
                $scope.field.kodePos = parseInt(res.data[0].KodePos);
                $scope.field.tempatLahir = res.data[0].TempatLahir;             
                $scope.field.PhoneNo = res.data[0].PhoneNo;
                $scope.field.Email = res.data[0].Email;
                $scope.field.NoKtp = res.data[0].NoKtp;
                //the working code//$scope.field.agama = $scope.listAgama.filter(a => { return a.IDAgama === res.data[0].Agama })[0];
                $scope.field.agama = res.data[0].Agama;
                $scope.field.statusPernikahan = res.data[0].StatusPernikahan;
                $scope.field.tinggiBadan = res.data[0].TinggiBadan;
                $scope.field.beratBadan = res.data[0].BeratBadan;
                $scope.field.bank = res.data[0].Bank;

                $scope.statusDataKeluarga = res.data[0].IsKeluargaComplete;


                if ($scope.fieldSama.alamat == res.data[0].Alamat &&
                    $scope.fieldSama.rt == parseInt(res.data[0].Rt) &&
                    $scope.fieldSama.rw == parseInt(res.data[0].Rw) &&
                    $scope.fieldSama.provinsi == res.data[0].Provinsi &&
                    $scope.fieldSama.kota == res.data[0].Kota &&
                    $scope.fieldSama.kodePos == res.data[0].KodePos) {
                    $scope.sameData = true;
                } else {
                    $scope.sameData = false;
                }
            });


            $http({
                method: 'GET',
                url: 'api/Recruitment/GetDataRekeningNPWP',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function(res) {
                $scope.fieldRekNpwp.namaBank = res.data[0].NamaBank;
                $scope.fieldRekNpwp.cabangBank = res.data[0].CabangBank;
                $scope.fieldRekNpwp.nomorRekening = res.data[0].NomorRekening;
                $scope.fieldRekNpwp.namaDiRekening = res.data[0].NamaDiRekening;
                $scope.fieldRekNpwp.nomorNPWP = res.data[0].NomorNPWP;
                $scope.fieldRekNpwp.namaWajibPajak = res.data[0].NamaWajibPajak;
                $scope.fieldRekNpwp.hubunganDgWajibPajak = res.data[0].HubunganDgWajibPajak;
                $scope.fieldRekNpwp.alamatNpwp = res.data[0].AlamatNpwp;

            });


            $http({
                method: 'GET',
                url: 'api/Recruitment/GetDataKesehatan',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function(res) {
                $scope.fieldKesehatan.isSehat = res.data[0].IsSehat;
                $scope.fieldKesehatan.kondisiKesehatan = res.data[0].KondisiKesehatan;
                $scope.fieldKesehatan.isPernahDirawat = res.data[0].IsPernahDirawat;
                $scope.fieldKesehatan.penyakit = res.data[0].Penyakit;
                //$scope.fieldKesehatan.tanggalSakit = new Date (res.data[0].TanggalSakit);

                var formatDate = moment(res.data[0].TanggalSakit).format("YYYY/MM/DD");
                $scope.fieldKesehatan.tanggalSakit = new Date(formatDate);

                $scope.fieldKesehatan.rs = res.data[0].RS;
                $scope.fieldKesehatan.lamaDirawat = res.data[0].LamaDirawat;
                $scope.fieldKesehatan.isKambuh = res.data[0].IsKambuh;
                $scope.fieldKesehatan.isHamil = res.data[0].IsHamil;
            });

            $http({
                method: 'GET',
                url: 'api/Recruitment/GetDataRencanaPribadi',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function(res) {
                $scope.fieldrencana.rencanaMenikah = res.data[0].RencanaMenikah;
                var formatDateRencanaNikah = moment(res.data[0].TanggalRencanaMenikah).format("YYYY/MM/DD");
                $scope.fieldrencana.tanggalRencanaMenikah = new Date(formatDateRencanaNikah);

                $scope.fieldrencana.rencanaPunyaAnak = res.data[0].RencanaPunyaAnak;
                var formatDateRencanaPunyaAnak = moment(res.data[0].TanggalRencanaPunyaAnak).format("YYYY/MM/DD");
                $scope.fieldrencana.tanggalRencanaPunyaAnak = new Date(formatDateRencanaPunyaAnak);

                $scope.fieldrencana.rencanaLanjutKuliah = res.data[0].RencanaLanjutKuliah;
                var formatDateRencanaLanjutKuliah = moment(res.data[0].TanggalRencanaKuliah).format("YYYY/MM/DD");
                $scope.fieldrencana.tanggalRencanaKuliah = new Date(formatDateRencanaLanjutKuliah);

                $scope.fieldrencana.rencanaNaikHaji = res.data[0].RencanaNaikHaji;
                var formatDateRencanaNaikHaji = moment(res.data[0].TanggalRencanaNaikHaji).format("YYYY/MM/DD");
                $scope.fieldrencana.tanggalRencanaNaikHaji = new Date(formatDateRencanaNaikHaji);
            });

            $scope.field.loginName = localStorageService.get('LoginName');
            $scope.fieldRekNpwp.loginName = localStorageService.get('LoginName');
            $scope.fieldKesehatan.loginName = localStorageService.get('LoginName');
            $scope.fieldrencana.loginName = localStorageService.get('LoginName');
            $scope.field.ChangedBy = $scope.field.loginName;
            //console.log($scope.field.LoginName);

            $scope.getSameData = function() {
                if ($scope.sameData == true) {
                    $scope.fieldSama.namaLengkap = $scope.field.namaLengkap;
                    $scope.fieldSama.jenisKelamin = $scope.field.jenisKelamin;
                    $scope.fieldSama.alamat = $scope.field.alamat;
                    $scope.fieldSama.rt = $scope.field.rt;
                    $scope.fieldSama.rw = $scope.field.rw;
                    $scope.fieldSama.provinsi = $scope.field.provinsi;
                    $scope.fieldSama.kota = $scope.field.kota;
                    $scope.fieldSama.kodePos = $scope.field.kodePos;
                    $scope.fieldSama.tempatLahir = $scope.field.tempatLahir;
                    $scope.fieldSama.tanggalLahir = $scope.field.tanggalLahir;
                    $scope.fieldSama.agama = $scope.field.agama;
                    $scope.fieldSama.statusPernikahan = $scope.field.statusPernikahan;
                    $scope.fieldSama.tinggiBadan = $scope.field.tinggiBadan;
                    $scope.fieldSama.beratBadan = $scope.field.beratBadan;
                    $scope.fieldSama.bank = $scope.field.bank;
                    $scope.fieldSama.LoginName = localStorageService.get('LoginName');
                    $scope.domisiliForm = false;
                    //localStorageService.get('ls.LoginName');

                } else {
                    $scope.fieldSama.namaLengkap = $scope.fieldSama.namaLengkap;
                    $scope.fieldSama.jenisKelamin = $scope.fieldSama.jenisKelamin;
                    $scope.fieldSama.alamat = $scope.fieldSama.alamat;
                    $scope.fieldSama.rt = $scope.fieldSama.rt;
                    $scope.fieldSama.rw = $scope.fieldSama.rw;
                    $scope.fieldSama.provinsi = $scope.fieldSama.provinsi;
                    $scope.fieldSama.kota = $scope.fieldSama.kota;
                    $scope.fieldSama.kodePos = $scope.fieldSama.kodePos;
                    $scope.fieldSama.tempatLahir = $scope.fieldSama.tempatLahir;
                    $scope.fieldSama.tanggalLahir = $scope.fieldSama.tanggalLahir;
                    $scope.fieldSama.agama = $scope.fieldSama.agama;
                    $scope.fieldSama.statusPernikahan = $scope.fieldSama.statusPernikahan;
                    $scope.fieldSama.beratBadan = $scope.fieldSama.beratBadan;
                    $scope.fieldSama.bank = $scope.fieldSama.bank;
                    $scope.fieldSama.LoginName = localStorageService.get('LoginName');
                    $scope.domisiliForm = true;
                }
            }

            $scope.formPenyakitcheck = function() {
                if ($scope.fieldKesehatan.isPernahDirawat == 'Ya') {
                    $scope.formPenyakit = true;
                } else {
                    $scope.formPenyakit = false;
                }
            };

            $scope.submitDataPribadi = function() {
                $rootScope.test = [];
                var date = new Date();
                if ($scope.fieldRekNpwp.nomorNPWP != undefined &&
                    $scope.fieldRekNpwp.nomorNPWP != "" &&
                    $scope.fieldRekNpwp.nomorNPWP != null &&
                    !$scope.fieldRekNpwp.nomorNPWP.contains('-')
                    ) {
                
                    $scope.fieldRekNpwp.nomorNPWP =
                        $scope.fieldRekNpwp.nomorNPWP.substring(0, 2) +
                        "." +
                        $scope.fieldRekNpwp.nomorNPWP.substring(2, 5) +
                        "." +
                        $scope.fieldRekNpwp.nomorNPWP.substring(5, 8) +
                        "." +
                        $scope.fieldRekNpwp.nomorNPWP.substring(8, 9) +
                        "-" +
                        $scope.fieldRekNpwp.nomorNPWP.substring(9, 12) +
                        "." +
                        $scope.fieldRekNpwp.nomorNPWP.substring(12); 
                    
                }
                //#region NOTIFIKASI DATA SESUAI KTP
                if ($scope.field.namaLengkap == undefined || $scope.field.namaLengkap == "") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Nama lengkap<br>");
                    } else if ($rootScope.test != null) {
                        $rootScope.test.push("Nama lengkap<br>");
                    }
                    $scope.warnaMerahNM = "form-control f-danger";
                } else {
                    $scope.warnaMerahNM =  "form-control";
                }
                if ($scope.field.alamat == undefined || $scope.field.alamat =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("alamat<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Alamat<br>");
                        //console.log($rootScope.test);
                    }
                    $scope.warnaMerahAl = "form-control f-danger";
                }
                else {
                    $scope.warnaMerahAl =  "form-control";
                }
                if ($scope.field.jenisKelamin == undefined || $scope.field.jenisKelamin =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("jenis Kelamin<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Jenis Kelamin<br>");
                    }
                    $scope.warnaMerahKel = "form-control f-danger";
                }
                else {
                    $scope.warnaMerahKel =  "form-control";
                }
                if ($scope.field.rt == undefined || $scope.field.rt ==""|| isNaN($scope.field.rt)) {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("RT<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("RT<br>");
                    }
                    $scope.warnaMerahRt= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahRt =  "form-control";
                }
                if ($scope.field.rw == undefined || $scope.field.rw ==""|| isNaN($scope.field.rw)) {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("RW<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("RW<br>");
                    }
                    $scope.warnaMerahRw= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahRw =  "form-control";
                }
                if ($scope.field.provinsi == undefined || $scope.field.provinsi =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Provinsi<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Provinsi<br>");
                    }
                    $scope.warnaMerahProv= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahProv =  "form-control";
                }
                if ($scope.field.kota == undefined || $scope.field.kota =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Kota<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Kota<br>");
                    }
                    $scope.warnaMerahKot= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahKot =  "form-control";
                }
                if ($scope.field.kodePos == undefined || $scope.field.kodePos ==""|| isNaN($scope.field.kodePos)) {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("kodePos<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("kodePos<br>");
                    }
                    $scope.warnaMerahKP= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahKP =  "form-control";
                }
                if ($scope.field.tempatLahir == undefined || $scope.field.tempatLahir =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Tempat Lahir<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tempat Lahir<br>");
                    }
                    $scope.warnaMerahTeL= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahTeL =  "form-control";
                }
                if ($scope.field.tanggalLahir == undefined || $scope.field.tanggalLahir =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Tanggal Lahir<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tanggal Lahir<br>");
                    }
                    $scope.warnaMerahTaL= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahTaL =  "form-control";
                }
                if ($scope.field.agama == undefined || $scope.field.agama =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Agama<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Agama<br>");
                    }
                    $scope.warnaMerahAg= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahAg =  "form-control";
                }
                if ($scope.field.statusPernikahan == undefined || $scope.field.statusPernikahan =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Status Pernikahan<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Status Pernikahan<br>");
                    }
                    $scope.warnaMerahSP= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahSP =  "form-control";
                }
                if ($scope.field.tinggiBadan == undefined || $scope.field.tinggiBadan =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Tinggi Badan<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tinggi Badan<br>");
                    }
                    $scope.warnaMerahTB= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahTB =  "form-control";
                }
                if ($scope.field.beratBadan == undefined || $scope.field.beratBadan =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Berat Badan<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Berat Badan<br>");
                    }
                    $scope.warnaMerahBB= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahBB =  "form-control";
                }
                //#endregion
                //#region DOMISILI
                if ($scope.fieldSama.alamat == undefined || $scope.fieldSama.alamat =="") {
                    if ($rootScope.test.includes("<b>Data Domisili<br>") != true) {
                        $rootScope.test.push("<b>Data Domisili<br>");
                        $rootScope.test.push("Alamat<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Alamat<br>");
                    }
                    $scope.warnaMerahFSAl= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahFSAl =  "form-control";
                }
                if ($scope.fieldSama.rt == undefined || $scope.fieldSama.rt =="") {
                    if ($rootScope.test.includes("<b>Data Domisili<br>") != true) {
                        $rootScope.test.push("<b>Data Domisili<br>");
                        $rootScope.test.push("RT<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("RT<br>");
                    }
                    $scope.warnaMerahFSRT= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahFSRT =  "form-control";
                }
                if ($scope.fieldSama.rw == undefined || $scope.fieldSama.rw =="") {
                    if ($rootScope.test.includes("<b>Data Domisili<br>") != true) {
                        $rootScope.test.push("<b>Data Domisili<br>");
                        $rootScope.test.push("RW<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("RW<br>");
                    }
                    $scope.warnaMerahFSRW= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahFSRW =  "form-control";
                }
                if ($scope.fieldSama.provinsi == undefined || $scope.fieldSama.provinsi =="") {
                    if ($rootScope.test.includes("<b>Data Domisili<br>") != true) {
                        $rootScope.test.push("<b>Data Domisili<br>");
                        $rootScope.test.push("Provinsi<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Provinsi<br>");
                    }
                    $scope.warnaMerahFSProv= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahFSProv =  "form-control";
                }
                if ($scope.fieldSama.kota == undefined || $scope.fieldSama.kota =="") {
                    if ($rootScope.test.includes("<b>Data Domisili<br>") != true) {
                        $rootScope.test.push("<b>Data Domisili<br>");
                        $rootScope.test.push("Kota<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Kota<br>");
                    }
                    $scope.warnaMerahFSKot= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahFSKot =  "form-control";
                }
                if ($scope.fieldSama.kodePos == undefined || $scope.fieldSama.kodePos =="") {
                    if ($rootScope.test.includes("<b>Data Domisili<br>") != true) {
                        $rootScope.test.push("<b>Data Domisili<br>");
                        $rootScope.test.push("kodePos<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("kodePos<br>");
                    }
                    $scope.warnaMerahFSKP= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahFSKP =  "form-control";
                }
                //#endregion
                //#region REKENING npwp
                if ($scope.fieldRekNpwp.namaBank == undefined || $scope.fieldRekNpwp.namaBank =="") {
                    if ($rootScope.test.includes("<b>Data NPWP<br>") != true) {
                        $rootScope.test.push("<b>Data NPWP<br>");
                        $rootScope.test.push("Nama Bank<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Nama Bank<br>");
                    }
                    $scope.warnaMerahBank= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahBank =  "form-control";
                }
                if ($scope.fieldRekNpwp.cabangBank == undefined || $scope.fieldRekNpwp.cabangBank =="") {
                    if ($rootScope.test.includes("<b>Data NPWP<br>") != true) {
                        $rootScope.test.push("<b>Data NPWP<br>");
                        $rootScope.test.push("cabang Bank<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("cabang Bank<br>");
                    }
                    $scope.warnaMerahCB= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahCB =  "form-control";
                }
                if ($scope.fieldRekNpwp.nomorRekening == undefined || $scope.fieldRekNpwp.nomorRekening =="") {
                    if ($rootScope.test.includes("<b>Data NPWP<br>") != true) {
                        $rootScope.test.push("<b>Data NPWP<br>");
                        $rootScope.test.push("nomor Rekening<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("nomor Rekening<br>");
                    }
                    $scope.warnaMerahNR= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahNR =  "form-control";
                }
                if ($scope.fieldRekNpwp.namaDiRekening == undefined || $scope.fieldRekNpwp.namaDiRekening =="") {
                    if ($rootScope.test.includes("<b>Data NPWP<br>") != true) {
                        $rootScope.test.push("<b>Data NPWP<br>");
                        $rootScope.test.push("nama DiRekening<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("nama DiRekening<br>");
                    }
                    $scope.warnaMerahNmR= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahNmR =  "form-control";
                }
                //if (($scope.fieldRekNpwp.nomorNPWP != undefined || $scope.fieldRekNpwp.nomorNPWP !=""|| $scope.fieldRekNpwp.nomorNPWP !=null) && ($scope.fieldRekNpwp.namaWajibPajak == undefined || $scope.fieldRekNpwp.namaWajibPajak =="")) {
                if (($scope.fieldRekNpwp.nomorNPWP) && ($scope.fieldRekNpwp.namaWajibPajak == undefined || $scope.fieldRekNpwp.namaWajibPajak =="")) {
                    if ($rootScope.test.includes("<b>Data NPWP<br>") != true) {
                        $rootScope.test.push("<b>Data NPWP<br>");
                        $rootScope.test.push("nama Wajib Pajak<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("nama Wajib Pajak<br>");
                    }
                    $scope.warnaMerahNmPajak= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahNmPajak =  "form-control";
                }
                if ($scope.field.NoKtp == undefined || $scope.field.NoKtp =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("No Ktp<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("No Ktp<br>");
                    }
                    $scope.warnaMerahKtp= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahKtp =  "form-control";
                }
                if ($scope.field.PhoneNo == undefined || $scope.field.PhoneNo =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("No telepon<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("No telepon<br>");
                    }
                    $scope.warnaMerahTelp= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahTelp =  "form-control";
                }
                if ($scope.field.Email == undefined || $scope.field.Email =="") {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Email<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Email<br>");
                    }
                    $scope.warnaMerahEmail= "form-control f-danger";
                }
                else {
                    $scope.warnaMerahEmail =  "form-control";
                }

/*                if (($scope.fieldRekNpwp.nomorNPWP != undefined || $scope.fieldRekNpwp.nomorNPWP !="") && ($scope.fieldRekNpwp.hubunganDgWajibPajak == undefined || $scope.fieldRekNpwp.hubunganDgWajibPajak =="")) {
                    if ($rootScope.test.includes("<b>Data NPWP<br>") != true) {
                        $rootScope.test.push("<b>Data NPWP<br>");
                        $rootScope.test.push("hubungan Dg Wajib Pajak<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("hubungan Dg Wajib Pajak<br>");
                    }
                }
                if (($scope.fieldRekNpwp.nomorNPWP != undefined || $scope.fieldRekNpwp.nomorNPWP !="") && ($scope.fieldRekNpwp.alamatNpwp == undefined || $scope.fieldRekNpwp.alamatNpwp =="")) {
                    if ($rootScope.test.includes("<b>Data NPWP<br>") != true) {
                        $rootScope.test.push("<b>Data NPWP<br>");
                        $rootScope.test.push("alamat Npwp<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("alamat Npwp<br>");
                    }
                }*/
                //#endregion
                //#region KONDISI KESEHATAN
                if ($scope.fieldKesehatan.isSehat == undefined || $scope.fieldKesehatan.isSehat =="") {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("Kondisi Kesehatan<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Kondisi Kesehatan<br>");
                        $scope.warnaMerahKondisi= "form-control-plaintext f-danger"; 
                    }
                }
                if ($scope.fieldKesehatan.isSehat == "Tidak" && ($scope.fieldKesehatan.kondisiKesehatan == "" || $scope.fieldKesehatan.kondisiKesehatan ==undefined)) {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("Penjelasan Kondisi Kesehatan<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Penjelasan Kondisi Kesehatan<br>");
                    }
                }
                if ($scope.fieldKesehatan.isPernahDirawat == undefined || $scope.fieldKesehatan.isSisPernahDirawatehat =="") {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("Data pernah dirawat<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Data pernah dirawat<br>");
                    }
                }
                if ($scope.fieldKesehatan.isPernahDirawat == "Ya" && ($scope.fieldKesehatan.penyakit == "" || $scope.fieldKesehatan.penyakit == undefined)) {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("Penjelasan Kondisi Kesehatan<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Penjelasan Kondisi Kesehatan<br>");
                    }
                }
                if ($scope.fieldKesehatan.isPernahDirawat == "Ya" && ($scope.fieldKesehatan.tanggalSakit == "Invalid Date" || $scope.fieldKesehatan.tanggalSakit == undefined|| $scope.fieldKesehatan.tanggalSakit == null)) {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("Tanggal Dirawat<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tanggal Dirawat<br>");
                    }
                }
                if ($scope.fieldKesehatan.isPernahDirawat == "Ya" && ($scope.fieldKesehatan.rs == "" || $scope.fieldKesehatan.rs == undefined|| $scope.fieldKesehatan.rs == null)) {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("rumah sakit<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("rumah sakit<br>");
                    }
                }
                if ($scope.fieldKesehatan.isPernahDirawat == "Ya" && ($scope.fieldKesehatan.lamaDirawat == "" || $scope.fieldKesehatan.lamaDirawat == undefined|| $scope.fieldKesehatan.lamaDirawat == null)) {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("lama Dirawat<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("lama Dirawat<br>");
                    }
                }
                if ($scope.fieldKesehatan.isPernahDirawat == "Ya" && ($scope.fieldKesehatan.isKambuh == "" || $scope.fieldKesehatan.isKambuh == undefined|| $scope.fieldKesehatan.isKambuh == null)) {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("kambuh<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("kambuh<br>");
                    }
                }
                if ($scope.fieldKesehatan.isHamil == undefined || $scope.fieldKesehatan.isHamil =="") {
                    if ($rootScope.test.includes("<b>Data Kondisi Kesehatan<br>") != true) {
                        $rootScope.test.push("<b>Data Kondisi Kesehatan<br>");
                        $rootScope.test.push("hamil<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("hamil<br>");
                    }
                }
                //#endregion
                //#region RENCANA PRIBADI
                if ($scope.fieldrencana.rencanaMenikah == undefined || $scope.fieldrencana.rencanaMenikah =="") {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Rencana Menikah<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Rencana Menikah<br>");
                    }
                }
                if ($scope.fieldrencana.rencanaMenikah == "Ya" && ($scope.fieldrencana.tanggalRencanaMenikah =="Invalid Date" || $scope.fieldrencana.tanggalRencanaMenikah == undefined || $scope.fieldrencana.tanggalRencanaMenikah == null)) {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Tanggal Rencana Menikah<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tanggal Rencana Menikah<br>");
                    }
                }
                if ($scope.fieldrencana.rencanaPunyaAnak == undefined || $scope.fieldrencana.rencanaPunyaAnak =="") {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("rencana Punya Anak<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("rencana Punya Anak<br>");
                    }
                }
                if ($scope.fieldrencana.rencanaPunyaAnak == "Ya" && ($scope.fieldrencana.tanggalRencanaPunyaAnak =="Invalid Date" || $scope.fieldrencana.tanggalRencanaPunyaAnak == undefined || $scope.fieldrencana.tanggalRencanaPunyaAnak == null)) {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Tanggal Rencana Punya Anak<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tanggal Rencana Punya Anak<br>");
                    }
                }
                if ($scope.fieldrencana.rencanaLanjutKuliah == undefined || $scope.fieldrencana.rencanaLanjutKuliah =="") {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("rencana Lanjut Kuliah<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("rencana Lanjut Kuliah<br>");
                    }
                }
                if ($scope.fieldrencana.rencanaLanjutKuliah == "Ya" && ($scope.fieldrencana.tanggalRencanaKuliah =="Invalid Date" || $scope.fieldrencana.tanggalRencanaKuliah == undefined || $scope.fieldrencana.tanggalRencanaKuliah == null)) {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Tanggal rencana Lanjut Kuliah<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tanggal rencana Lanjut Kuliah<br>");
                    }
                }
                if ($scope.fieldrencana.rencanaNaikHaji == undefined || $scope.fieldrencana.rencanaNaikHaji =="") {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("rencana Naik Haji<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("rencana Naik Haji<br>");
                    }
                }
                if ($scope.fieldrencana.rencanaNaikHaji == "Ya" && ($scope.fieldrencana.tanggalRencanaNaikHaji =="Invalid Date" || $scope.fieldrencana.tanggalRencanaNaikHaji == undefined || $scope.fieldrencana.tanggalRencanaNaikHaji == null)) {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Tanggal rencana Naik Haji<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tanggal rencana Naik Haji<br>");
                    }
                }
                //#endregion

                if ($scope.field.tanggalLahir > date) {
                    if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Pribadi<br>");
                        $rootScope.test.push("Tanggal Lahir<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Tanggal Lahir<br>");
                    }
                    $scope.warnaMerahTaL= "form-control f-danger";
                    
                    swalAlert.message('e', "tanggal lahir anda harus sebelum tanggal hari ini");
                    //return;
                }
                if ($scope.field.NoKtp != undefined) {
                    if ($scope.field.NoKtp.length != 16) {
                        if ($rootScope.test.includes("<b>Data Pribadi<br>") != true) {
                            $rootScope.test.push("<b>Data Pribadi<br>");
                            $rootScope.test.push("No Ktp<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("No Ktp<br>");
                        }
                        $scope.warnaMerahKtp = "form-control f-danger";
                        swalAlert.message('e', "Nomor KTP tidak boleh kurang dari 16 karakter");
                        //return;
                    }

                    if ($scope.field.NoKtp.length != 16 || $scope.field.tanggalLahir > date) {
                        swalAlert.message('e', "lengkapi semua data pribadi terlebih dahulu");
                        return;
                    }
                }

/*                $scope.field.forEach(function(elemen) {
                    if (elemen == undefined) {
                        $rootScope.test.push("<br>"+elemen);
                    }
                });*/
                if (!$scope.field.namaLengkap ||
                    !$scope.field.jenisKelamin ||
                    !$scope.field.alamat ||
                    !$scope.field.rt ||
                    !$scope.field.rw ||
                    !$scope.field.provinsi ||
                    !$scope.field.kota ||
                    !$scope.field.kodePos ||
                    !$scope.field.tempatLahir ||
                    !$scope.field.tanggalLahir ||
                    !$scope.field.agama ||
                    !$scope.field.statusPernikahan ||
                    !$scope.field.tinggiBadan ||
                    !$scope.field.beratBadan ||
                    !$scope.field.NoKtp||
                    !$scope.field.PhoneNo||
                    !$scope.field.Email||
                   /* !$scope.field.bank||*/
                    !$scope.fieldSama.alamat ||
                    !$scope.fieldSama.rt ||
                    !$scope.fieldSama.rw ||
                    !$scope.fieldSama.provinsi ||
                    !$scope.fieldSama.kota ||
                    !$scope.fieldSama.kodePos||
                    !$scope.fieldRekNpwp.namaBank||
                    !$scope.fieldRekNpwp.cabangBank||
                    !$scope.fieldRekNpwp.nomorRekening||
                    !$scope.fieldRekNpwp.namaDiRekening||
                    ($scope.fieldRekNpwp.nomorNPWP && !$scope.fieldRekNpwp.namaWajibPajak)
                    /*||
                    ($scope.fieldRekNpwp.nomorNPWP && !$scope.fieldRekNpwp.hubunganDgWajibPajak)||
                    ($scope.fieldRekNpwp.nomorNPWP && !$scope.fieldRekNpwp.alamatNpwp)*/
                    ) {
                    swalAlert.message('e', "lengkapi semua data pribadi terlebih dahulu");
                    return;
                }else if (!$scope.fieldKesehatan.isSehat || !$scope.fieldKesehatan.isPernahDirawat ||  !$scope.fieldKesehatan.isHamil) {
                    swalAlert.message('e', "lengkapi semua data kesehatan terlebih dahulu");
                    return;
                }else if ($scope.fieldKesehatan.isSehat == "Tidak" && !$scope.fieldKesehatan.kondisiKesehatan) {
                    swalAlert.message('e', "lengkapi semua data kesehatan terlebih dahulu");
                    return;
                }else if (($scope.fieldKesehatan.isPernahDirawat == "Ya" && !$scope.fieldKesehatan.penyakit) || 
                    ($scope.fieldKesehatan.isPernahDirawat == "Ya" && ($scope.fieldKesehatan.isPernahDirawat == "Ya" && ($scope.fieldKesehatan.tanggalSakit == "Invalid Date" || $scope.fieldKesehatan.tanggalSakit == null || $scope.fieldKesehatan.tanggalSakit == undefined)))||
                    ($scope.fieldKesehatan.isPernahDirawat == "Ya" && !$scope.fieldKesehatan.rs)||
                    ($scope.fieldKesehatan.isPernahDirawat == "Ya" && !$scope.fieldKesehatan.lamaDirawat)||
                    ($scope.fieldKesehatan.isPernahDirawat == "Ya" && !$scope.fieldKesehatan.isKambuh)) {
                    swalAlert.message('e', "lengkapi semua data kesehatan terlebih dahulu");
                    return;
                }else if (!$scope.fieldrencana.rencanaMenikah ||($scope.fieldrencana.rencanaMenikah == "Ya" && ($scope.fieldrencana.tanggalRencanaMenikah == "Invalid Date" || $scope.fieldrencana.tanggalRencanaMenikah == null || $scope.fieldrencana.tanggalRencanaMenikah == undefined))) {
                    swalAlert.message('e', "lengkapi semua data rencana terlebih dahulu");
                    return;
                }else if (($scope.fieldrencana.rencanaMenikah == "Ya" && ($scope.fieldrencana.tanggalRencanaMenikah < $scope.tanggalSekarang))) {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Rencana Menikah<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Rencana Menikah<br>");
                    }
                swalAlert.message('e', "Tanggal rencana menikah tidak boleh sebelum tanggal hari ini");
                    return;
                }else if (!$scope.fieldrencana.rencanaPunyaAnak ||($scope.fieldrencana.rencanaPunyaAnak == "Ya" && ($scope.fieldrencana.tanggalRencanaPunyaAnak == "Invalid Date" || $scope.fieldrencana.tanggalRencanaPunyaAnak == null || $scope.fieldrencana.tanggalRencanaPunyaAnak == undefined))) {
                    swalAlert.message('e', "lengkapi semua data rencana terlebih dahulu");
                    return;
                }else if (($scope.fieldrencana.rencanaPunyaAnak == "Ya" && ($scope.fieldrencana.tanggalRencanaPunyaAnak < $scope.tanggalSekarang))) {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Rencana Punya Anak<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Rencana Punya Anak<br>");
                    }
                    swalAlert.message('e', "Tanggal rencana memiliki anak tidak boleh sebelum tanggal hari ini");
                    return;
                }else if (!$scope.fieldrencana.rencanaLanjutKuliah ||($scope.fieldrencana.rencanaLanjutKuliah == "Ya" && ($scope.fieldrencana.tanggalRencanaKuliah == "Invalid Date" || $scope.fieldrencana.tanggalRencanaKuliah == null || $scope.fieldrencana.tanggalRencanaKuliah == undefined))) {
                    swalAlert.message('e', "lengkapi semua data rencana terlebih dahulu");
                    return;
                }else if (($scope.fieldrencana.rencanaLanjutKuliah == "Ya" && ($scope.fieldrencana.tanggalRencanaKuliah  < $scope.tanggalSekarang))) {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Rencana Lanjut Kuliah<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Rencana Lanjut Kuliah<br>");
                    }
                    swalAlert.message('e', "Tanggal rencana lanjut kuliah tidak boleh sebelum tanggal hari ini");
                    return;
                }else if (!$scope.fieldrencana.rencanaNaikHaji ||($scope.fieldrencana.rencanaNaikHaji == "Ya" && ($scope.fieldrencana.tanggalRencanaNaikHaji == "Invalid Date" || $scope.fieldrencana.tanggalRencanaNaikHaji == null || $scope.fieldrencana.tanggalRencanaNaikHaji == undefined))) {
                    swalAlert.message('e', "lengkapi semua data rencana terlebih dahulu");
                    return;
                }else if (($scope.fieldrencana.rencanaNaikHaji == "Ya" && ($scope.fieldrencana.tanggalRencanaNaikHaji < $scope.tanggalSekarang))) {
                    if ($rootScope.test.includes("<b>Data Rencana Pribadi<br>") != true) {
                        $rootScope.test.push("<b>Data Rencana Pribadi<br>");
                        $rootScope.test.push("Rencana Naik Haji<br>");
                    } else if($rootScope.test != null){
                        $rootScope.test.push("Rencana Naik Haji<br>");
                    }
                    swalAlert.message('e', "Tanggal rencana naik haji tidak boleh sebelum tanggal hari ini");
                    return;
                }
//if anything fails try this //$scope.field.agama = $scope.field.agama.IDAgama;

                if ($scope.fieldrencana.tanggalRencanaMenikah) { $scope.fieldrencana.tanggalRencanaMenikah = new Date($scope.fieldrencana.tanggalRencanaMenikah.getFullYear(), $scope.fieldrencana.tanggalRencanaMenikah.getMonth(), 2); }
                if ($scope.fieldrencana.tanggalRencanaPunyaAnak) { $scope.fieldrencana.tanggalRencanaPunyaAnak = new Date($scope.fieldrencana.tanggalRencanaPunyaAnak.getFullYear(), $scope.fieldrencana.tanggalRencanaPunyaAnak.getMonth(), 2); }
                if ($scope.fieldrencana.tanggalRencanaKuliah) { $scope.fieldrencana.tanggalRencanaKuliah = new Date($scope.fieldrencana.tanggalRencanaKuliah.getFullYear(), $scope.fieldrencana.tanggalRencanaKuliah.getMonth(), 2); }
                if ($scope.fieldrencana.tanggalRencanaNaikHaji) { $scope.fieldrencana.tanggalRencanaNaikHaji = new Date($scope.fieldrencana.tanggalRencanaNaikHaji.getFullYear(), $scope.fieldrencana.tanggalRencanaNaikHaji.getMonth(), 2); }

                console.log("$scope.field.agama:", $scope.field.agama);
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                $http.post('api/Recruitment/Submit', $scope.field).then(function(res) {
                    if (res.data.isSucceed == true) {
                        //console.log(res.data.isSucceed);
                        $http.post('api/Recruitment/SubmitDataDomisili', $scope.fieldSama).then(function(res) {
                            if (res.data.isSucceed == true) {
                                $http.post('api/Recruitment/SubmitDataRekeningNpwp', $scope.fieldRekNpwp).then(function(res) {
                                    if (res.data.isSucceed == true) {
                                        $http.post('api/Recruitment/SubmitDataKesehatan', $scope.fieldKesehatan).then(function(res) {
                                            if (res.data.isSucceed == true) {
                                                $http.post('api/Recruitment/SubmitDataRencanaPribadi', $scope.fieldrencana).then(function(res) {
                                                        if (res.data.isSucceed == true) {
                                                            swalAlert.message('s', res.data.message);
                                                            $('.spinner').fadeOut(500);
                                                            $(".OverlaySpinner").fadeOut(500);
                                                            $state.go('rekrutmenKontak');
                                                        } else {
                                                            $('.spinner').fadeOut(500);
                                                            $(".OverlaySpinner").fadeOut(500);
                                                            $scope.field = [];
                                                            $scope.fieldSama = [];
                                                            $scope.fieldRekNpwp = [];
                                                            $scope.fieldKesehatan = [];
                                                            $scope.fieldrencana = [];
                                                            swalAlert.message('e', res.data.message);
                                                            $state.reload();
                                                        }
                                                        });

                                            } else {
                                                $('.spinner').fadeOut(500);
                                                $(".OverlaySpinner").fadeOut(500);
                                                $scope.field = [];
                                                $scope.fieldSama = [];
                                                $scope.fieldRekNpwp = [];
                                                $scope.fieldKesehatan = [];
                                                swalAlert.message('e', res.data.message);
                                                $state.reload();
                                            }
                                        });

                                    } else {
                                        $('.spinner').fadeOut(500);
                                        $(".OverlaySpinner").fadeOut(500);
                                        $scope.field = [];
                                        $scope.fieldSama = [];
                                        $scope.fieldRekNpwp = [];
                                        swalAlert.message('e', res.data.message);
                                        $state.reload();
                                    }
                                });                             
                              // $state.go('rekrutmenKontak');
                            } else {
                                $('.spinner').fadeOut(500);
                                $(".OverlaySpinner").fadeOut(500);
                                $scope.field = [];
                                $scope.fieldSama = [];
                                $scope.fieldRekNpwp = [];
                                swalAlert.message('e', res.data.message);
                                $state.reload();
                            }
                        });
                    } else {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                        $scope.field = [];
                        $scope.fieldSama = [];
                        $scope.fieldRekNpwp = [];
                        swalAlert.message('e', res.data.message);
                        $state.reload();
                    }

                });
            }

        });

})(angular.module('SunLifeApp'));