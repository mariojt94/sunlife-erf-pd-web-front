(function (app) {
    'use strict';

    app.controller('rekrutmenDataKeluargaController', function ($window, $scope, $http, $state, authService, localStorageService, swalAlert, $rootScope, $cookies) {
        $scope.saudaraForm = true;
        $scope.spouseForm = true;
        $scope.childForm = true;
        $scope.listKeluarga = [];
        $scope.loginName = localStorageService.get('LoginName');

        document.getElementById("datePickerDad").max = new Date().toISOString().split("T")[0];
        document.getElementById("datePickerMom").max = new Date().toISOString().split("T")[0];
        


       $scope.ayah = {};
        $scope.ayah['hubungan'] = "AYAH";
        $scope.ayah['loginName'] = $scope.loginName;


        $scope.ibu = {};
        $scope.ibu.hubungan = "IBU";
        $scope.ibu.loginName = $scope.loginName;

        $scope.listDataSaudara = [];
        $scope.listDataAnak = [];

        $scope.spouse = {};
        if ($scope.spouseForm == false) {
            $scope.spouse.loginName = $scope.loginName;
        }

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

        $scope.tambahSaudara = function() {
            $scope.saudaraForm = false;
            var newItemNo = $scope.listDataSaudara.length + 1;
            $scope.listDataSaudara.push({ 'colId': newItemNo, 'hubungan': "SAUDARA", loginName: $scope.loginName});
           
        };
        $scope.noFutureDateSdr = function () {
            $scope.index = "datePickerSdr" + ($scope.listDataSaudara.length - 1);
            document.getElementById($scope.index).max = new Date().toISOString().split("T")[0];
        }
        $scope.deleteDataSaudara = function(index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDataSaudara.splice(index, 1);
            $http.post('api/Recruitment/DeleteKeluarga', $scope.deleted).then(function(response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");
                } else {
                    console.log("gagal ngapus");
                }
            });
            };
        

        $scope.spouseFormDisplay = function() {
            if ($scope.spouseFormcheck == true) {
                $scope.spouseForm = false;
                $scope.childForm = false;
            } else {
                $scope.spouseForm = true;

               $scope.childForm = true;
               $scope.listDataAnak = [];
                $scope.spouse = {};
            }
        };
        
        $scope.noFutureDateSpouse = function () {
            //$scope.index = "datePickerSpouse" + ($scope.listDataAnak.length - 1);
            document.getElementById("datePickerSpouse").max = new Date().toISOString().split("T")[0];
        }
        $scope.tambahAnak = function () {
            // $scope.childForm = false;
            var newItemNo = $scope.listDataAnak.length + 1;
            $scope.listDataAnak.push({ 'colId': newItemNo, 'hubungan': "ANAK", loginName: $scope.loginName });
        };

        $scope.noFutureDateKid = function () {
            $scope.index = "datePickerKid" + ($scope.listDataAnak.length - 1);
            document.getElementById($scope.index).max = new Date().toISOString().split("T")[0];
        }
        $scope.deleteDataAnak = function (index) {
            // remove the row specified in index
            $scope.deleted = $scope.listDataAnak.splice(index, 1);
            $http.post('api/Recruitment/DeleteKeluarga', $scope.deleted).then(function (response) {
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
                $scope.StatusPernikahan = res.data[0].StatusPernikahan;

                if (res.data[0].StatusPernikahan == "BM") {
                    document.getElementById("dataSpouseID").disabled = true;
                }
                if (res.data[0].StatusPernikahan == "JA" || res.data[0].StatusPernikahan == "DA") {
                    //$scope.spouseFormcheck = true;
                    
                    document.getElementById("dataSpouseID").disabled = true;
                   $scope.childForm = false;
                    //$scope.spouseForm = false;
                } if (res.data[0].StatusPernikahan == "ME") {
                    $scope.spouseFormcheck = true;
                }
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
            url: 'api/FileUpload/GetDokumenPDF',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataReview = true;
            } else {
                $scope.statusDataReview = false;
            }
        });
        //#endregion


        $scope.GetCandidateDataKeluarga = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateDataKeluarga',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.getAllKeluarga = res.data;

            if (res.data.length == 0) {
                return;
            }
            $scope.getAllKeluarga.forEach(function (elemen) {
                
                if (elemen.Hubungan == 'AYAH') {
                    elemen.TanggalLahir == null ? elemen.TanggalLahir = null : elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    //elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    $scope.ayah = elemen;
                    $scope.saudaraForm = false;
                }

                if (elemen.Hubungan == 'IBU') {
                    elemen.TanggalLahir == null ? elemen.TanggalLahir = null : elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    //elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    $scope.ibu = elemen;
                    $scope.saudaraForm = false;
                }

                if (elemen.Hubungan == 'SAUDARA') {
                    elemen.TanggalLahir == null ? elemen.TanggalLahir = null : elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    //elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    $scope.listDataSaudara.push(elemen);
                    $scope.saudaraForm = false;
                }

                if (elemen.Hubungan == 'SUAMI' || elemen.Hubungan == 'ISTRI') {
                    elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    $scope.spouseFormcheck = true;
                    $scope.spouse = elemen;
                }
                if (elemen.Hubungan == 'ANAK') {
                    elemen.TanggalLahir == null ? elemen.TanggalLahir = null : elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    $scope.listDataAnak.push(elemen);
                    //elemen.TanggalLahir = new Date(elemen.TanggalLahir);
                    
                }

            });

/*            $scope.GetCandidateDataKeluarga = $http({
                method: 'GET',
                url: 'api/Recruitment/GetCandidateDataSaudara',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
              $scope.listDataSaudara = res.data;
                $scope.listDataSaudara.forEach(function(element) {
                    element.TanggalLahir = new Date(element.TanggalLahir);
                });
                $scope.saudaraForm = false;
            });*/

        //    $scope.listDataAnak = res.data[4];
        });
  
      
        $scope.submitDataKeluarga = function () {
            // $scope.ayah = {};
            var date = new Date();
            $scope.listKeluarga = [];
            $rootScope.test = [];
            //if($scope.childForm == true) {$scope.listDataAnak = [];}

            if ($scope.spouseFormcheck == true) {
                $scope.spouse.loginName = $scope.loginName;
            }

            $scope.isiAyah = ($scope.ayah.NamaLengkap ||
                $scope.ayah.TanggalLahir ||
                $scope.ayah.PendidikanTerakhir ||
                $scope.ayah.Pekerjaan);

            $scope.isiIbu = ($scope.ibu.NamaLengkap ||
                $scope.ibu.TanggalLahir ||
                $scope.ibu.PendidikanTerakhir ||
                $scope.ibu.Pekerjaan);

            //ilang per tgl 12 12? 12 12?? 12 12???!!
/*            if ($scope.isiAyah && $scope.ayah.NamaLengkap == undefined) {
                $scope.indexNama = "nama";
                var myEl = angular.element(document.getElementById($scope.indexNama));

                if ($rootScope.test.includes("<b>Ayah<br>") != true) {
                    $rootScope.test.push("<b>Ayah<br>");
                    $rootScope.test.push("Nama lengkap<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Nama lengkap<br>");
                }
                myEl.addClass('form-control f-danger');
            }*/


            /*if ($scope.isiAyah && $scope.ayah.TanggalLahir == undefined) {
                $scope.indexTglLahir = "datePickerDad";
                var myEl = angular.element(document.getElementById($scope.indexTglLahir));
                
                if ($rootScope.test.includes("<b>Ayah<br>") != true) {
                    $rootScope.test.push("<b>Ayah<br>");
                    $rootScope.test.push("Tanggal Lahir<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Tanggal Lahir<br>");
                }
                myEl.addClass('form-control f-danger');
            }
            if ($scope.isiAyah && $scope.ayah.PendidikanTerakhir == undefined) {
                $scope.indexPendidikan = "pendidikan";
                var myEl = angular.element(document.getElementById($scope.indexPendidikan));

                if ($rootScope.test.includes("<b>Ayah<br>") != true) {
                    $rootScope.test.push("<b>Ayah<br>");
                    $rootScope.test.push("Pendidikan Terakhir<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Pendidikan Terakhir<br>");
                }
                myEl.addClass('form-control f-danger');
            }

            if ($scope.isiAyah && $scope.ayah.Pekerjaan == undefined) {
                $scope.indexPekerjaan = "pekerjaan";
                var myEl = angular.element(document.getElementById($scope.indexPekerjaan));

                if ($rootScope.test.includes("<b>Ayah<br>") != true) {
                    $rootScope.test.push("<b>Ayah<br>");
                    $rootScope.test.push("Pekerjaan<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Pekerjaan<br>");
                }
                myEl.addClass('form-control f-danger');
            }


            if ($scope.isiIbu && $scope.ibu.NamaLengkap == undefined) {
                $scope.indexNamaIbu = "namaIbu";
                var myEl = angular.element(document.getElementById($scope.indexNamaIbu));

                if ($rootScope.test.includes("<b>Ibu<br>") != true) {
                    $rootScope.test.push("<b>Ibu<br>");
                    $rootScope.test.push("Nama lengkap<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Nama lengkap<br>");
                }
                myEl.addClass('form-control f-danger');
            }
            if ($scope.isiIbu && $scope.ibu.TanggalLahir == undefined) {
                $scope.indexTglLahirIbu = "datePickerMom";
                var myEl = angular.element(document.getElementById($scope.indexTglLahirIbu));
                
                if ($rootScope.test.includes("<b>Ibu<br>") != true) {
                    $rootScope.test.push("<b>Ibu<br>");
                    $rootScope.test.push("Tanggal Lahir<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Tanggal Lahir<br>");
                }
                myEl.addClass('form-control f-danger');
            }
            if ($scope.isiIbu && $scope.ibu.PendidikanTerakhir == undefined) {
                $scope.indexPendidikanIbu = "pendidikanIbu";
                var myEl = angular.element(document.getElementById($scope.indexPendidikanIbu));
                
                if ($rootScope.test.includes("<b>Ibu<br>") != true) {
                    $rootScope.test.push("<b>Ibu<br>");
                    $rootScope.test.push("Pendidikan Terakhir<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Pendidikan Terakhir<br>");
                }
                myEl.addClass('form-control f-danger');
            }
            if ($scope.isiIbu && $scope.ibu.Pekerjaan == undefined) {
                $scope.indexPekerjaanIbu = "pekerjaanIbu";
                var myEl = angular.element(document.getElementById($scope.indexPekerjaanIbu));
                
                if ($rootScope.test.includes("<b>Ibu<br>") != true) {
                    $rootScope.test.push("<b>Ibu<br>");
                    $rootScope.test.push("Pekerjaan<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Pekerjaan<br>");
                }
                myEl.addClass('form-control f-danger');
            }*/

            if (($scope.ayah.TanggalLahir > date)) {
                var myEl = angular.element(document.getElementById('datePickerDad'));

                if ($rootScope.test.includes("<b>Ayah<br>") != true) {
                    $rootScope.test.push("<b>Ayah<br>");
                    $rootScope.test.push("Tanggal Lahir<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Tanggal Lahir<br>");
                }
                myEl.addClass('form-control f-danger');
            } else {
                var myEl = angular.element(document.getElementById('datePickerDad'));
                myEl.removeClass('f-danger');
            }

            if (($scope.ibu.TanggalLahir > date)) {
                var myEl = angular.element(document.getElementById('datePickerMom'));

                if ($rootScope.test.includes("<b>Ibu<br>") != true) {
                    $rootScope.test.push("<b>Ibu<br>");
                    $rootScope.test.push("Tanggal Lahir<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Tanggal Lahir<br>");
                }
                myEl.addClass('form-control f-danger');
            } else {
                var myEl = angular.element(document.getElementById('datePickerMom'));
                myEl.removeClass('f-danger');
            }

            if ($scope.spouseFormcheck == true &&($scope.spouse.Hubungan == undefined ||$scope.spouse.Hubungan == "" ||$scope.spouse.Hubungan == null)) {
                var myEl = angular.element(document.getElementById('hubunganSpouse'));

                if ($rootScope.test.includes("<b>Suami/Istri<br>") != true) {
                    $rootScope.test.push("<b>Suami/Istri<br>");
                    $rootScope.test.push("Hubungan<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Hubungan<br>");
                }
                myEl.addClass('form-control f-danger');
            } else {
                var myEl = angular.element(document.getElementById('hubunganSpouse'));
                myEl.removeClass('f-danger');
            }
            if ($scope.spouseFormcheck == true &&
            ($scope.spouse.NamaLengkap == undefined ||
                $scope.spouse.NamaLengkap == "" ||
                $scope.spouse.NamaLengkap == null)) {
                var myEl = angular.element(document.getElementById('namaSpouse'));
                if ($rootScope.test.includes("<b>Suami/Istri<br>") != true) {
                    $rootScope.test.push("<b>Suami/Istri<br>");
                    $rootScope.test.push("Nama Lengkap<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Nama Lengkap<br>");
                }
                myEl.addClass('form-control f-danger');
            } else {
                var myEl = angular.element(document.getElementById('namaSpouse'));
                myEl.removeClass('f-danger');
            }

            if ($scope.spouseFormcheck == true &&
            ($scope.spouse.TanggalLahir == undefined ||
                $scope.spouse.TanggalLahir == "" ||
                $scope.spouse.TanggalLahir == null)) {
                var myEl = angular.element(document.getElementById('datePickerSpouse'));
                if ($rootScope.test.includes("<b>Suami/Istri<br>") != true) {
                    $rootScope.test.push("<b>Suami/Istri<br>");
                    $rootScope.test.push("Tanggal Lahir<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Tanggal Lahir<br>");
                }
                myEl.addClass('form-control f-danger');
            } else {
                var myEl = angular.element(document.getElementById('datePickerSpouse'));
                myEl.removeClass('f-danger');
            }
            if ($scope.spouseFormcheck == true &&
            ($scope.spouse.PendidikanTerakhir == undefined ||
                $scope.spouse.PendidikanTerakhir == "" ||
                $scope.spouse.PendidikanTerakhir == null)) {
                var myEl = angular.element(document.getElementById('pendidikanSpouse'));
                if ($rootScope.test.includes("<b>Suami/Istri<br>") != true) {
                    $rootScope.test.push("<b>Suami/Istri<br>");
                    $rootScope.test.push("Pendidikan Terakhir<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Pendidikan Terakhir<br>");
                }
                myEl.addClass('form-control f-danger');
            } else {
                var myEl = angular.element(document.getElementById('pendidikanSpouse'));
                myEl.removeClass('f-danger');
            }
            if ($scope.spouseFormcheck == true &&
            ($scope.spouse.Pekerjaan == undefined ||
                $scope.spouse.Pekerjaan == "" ||
                $scope.spouse.Pekerjaan == null)) {
                var myEl = angular.element(document.getElementById('pekerjaanSpouse'));
                if ($rootScope.test.includes("<b>Suami/Istri<br>") != true) {
                    $rootScope.test.push("<b>Suami/Istri<br>");
                    $rootScope.test.push("Pekerjaan<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Pekerjaan<br>");
                }
                myEl.addClass('form-control f-danger');
            } else {
                var myEl = angular.element(document.getElementById('pekerjaanSpouse'));
                myEl.removeClass('f-danger');
            }
            if ($scope.listDataAnak.length >= 0) {
                $scope.listDataAnak.forEach(function (elemen) {
                    var index = $scope.listDataAnak.indexOf(elemen);
                    if (elemen.TanggalLahir > date) {
                        $scope.indexAnak = "datePickerKid" + (index);

                        var myEl = angular.element(document.getElementById($scope.indexAnak));
                        if ($rootScope.test.includes("<b>Anak<br>") != true) {
                            $rootScope.test.push("<b>Anak<br>");
                            $rootScope.test.push("Tanggal Lahir Anak<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Lahir Anak<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexAnak = "datePickerKid" + (index);
                        var myEl = angular.element(document.getElementById($scope.indexAnak));
                        myEl.removeClass('f-danger');
                    }
                });
            }

            if ($scope.listDataSaudara.length >= 1) {
                $scope.listDataSaudara.forEach(function (elemen) {
                    var index = $scope.listDataSaudara.indexOf(elemen);
                    if (elemen.TanggalLahir > date) {
                        $scope.indexSaudara = "datePickerSdr" + (index);
                        var myEl = angular.element(document.getElementById($scope.indexSaudara));
                        if ($rootScope.test.includes("<b>Saudara<br>") != true) {
                            $rootScope.test.push("<b>Saudara<br>");
                            $rootScope.test.push("Tanggal Lahir Saudara<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Lahir Saudara<br>");
                        }
                        myEl.addClass('form-control f-danger');
                    } else {
                        $scope.indexSaudara = "datePickerSdr" + (index);
                        var myEl = angular.element(document.getElementById($scope.indexSaudara));
                        myEl.removeClass('f-danger');
                    }
                });

            }
/* 
                        
            //ILANG DI TGL 12 12
           /* if ($scope.isiAyah &&
                $scope.ayah.NamaLengkap == undefined ||
                $scope.ayah.NamaLengkap == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            } else if ($scope.isiAyah &&
                $scope.ayah.TanggalLahir == undefined ||
                $scope.ayah.TanggalLahir == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            } else if ($scope.isiAyah &&
                $scope.ayah.PendidikanTerakhir == undefined ||
                $scope.ayah.PendidikanTerakhir == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            } else if ($scope.isiAyah &&
                $scope.ayah.Pekerjaan == undefined ||
                $scope.ayah.Pekerjaan == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            } */if ((!$scope.ayah.NamaLengkap &&
                !$scope.ayah.TanggalLahir &&
                !$scope.ayah.PendidikanTerakhir &&
                !$scope.ayah.Pekerjaan)) {
                $scope.ayah = {};
            }

            /*if ($scope.isiIbu &&
                $scope.ibu.NamaLengkap == undefined ||
                $scope.ibu.NamaLengkap == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            } else if ($scope.isiIbu &&
                $scope.ibu.TanggalLahir == undefined ||
                $scope.ibu.TanggalLahir == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            } else if ($scope.isiIbu &&
                $scope.ibu.PendidikanTerakhir == undefined ||
                $scope.ibu.PendidikanTerakhir == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            } else if ($scope.isiIbu &&
                $scope.ibu.PendidikanTerakhir == undefined ||
                $scope.ibu.PendidikanTerakhir == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            } else if ($scope.isiIbu &&
                $scope.ibu.Pekerjaan == undefined ||
                $scope.ibu.Pekerjaan == "") {
                swalAlert.message('e', "silahkan lengkapi data terlebih dahulu");
                return;
            }*/
            if ((!$scope.ibu.NamaLengkap &&
                    !$scope.ibu.TanggalLahir &&
                    !$scope.ibu.PendidikanTerakhir &&
                    !$scope.ibu.Pekerjaan)) {
                $scope.ibu = {};
            }

            var isValidated = true;
            if ($scope.listDataAnak.length >= 0) {
                $scope.listDataAnak.forEach(function (elemen) {
                    var index = $scope.listDataAnak.indexOf(elemen);
                    if (elemen.TanggalLahir > date) {
                        swalAlert.message('e', "tanggal lahir anda harus sebelum tanggal hari ini");
                        isValidated = false;
                    }

                    if ((elemen.NamaLengkap == null || elemen.NamaLengkap == undefined || elemen.NamaLengkap == "") &&
                        (elemen.TanggalLahir == null || elemen.TanggalLahir == undefined || elemen.TanggalLahir == "") &&
                        (elemen.PendidikanTerakhir == null ||elemen.PendidikanTerakhir == undefined ||elemen.PendidikanTerakhir == "")) {
                        
                        $scope.listDataAnak.splice(index, 1);
                          
                    } else {
                        $scope.listKeluarga.push(elemen);
                    }
                    /*if (elemen.NamaLengkap == undefined || elemen.NamaLengkap == "") {
                        if ($rootScope.test.includes("<b>Anak<br>") != true) {
                            $rootScope.test.push("<b>Anak<br>");
                            $rootScope.test.push("Nama Lengkap<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Nama Lengkap<br>");
                        }
                    }
                    if (elemen.TanggalLahir == undefined || elemen.TanggalLahir == "") {
                        if ($rootScope.test.includes("<b>Anak<br>") != true) {
                            $rootScope.test.push("<b>Anak<br>");
                            $rootScope.test.push("Tanggal Lahir<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Tanggal Lahir<br>");
                        }
                    }
                    if (elemen.PendidikanTerakhir == undefined || elemen.PendidikanTerakhir == "") {
                        if ($rootScope.test.includes("<b>Anak<br>") != true) {
                            $rootScope.test.push("<b>Anak<br>");
                            $rootScope.test.push("Pendidikan Terakhir<br>");
                        } else if ($rootScope.test != null) {
                            $rootScope.test.push("Pendidikan Terakhir<br>");
                        }
                    }*/

                    if (!isValidated) {
                        return;
                    }
                });
            }

            if (!isValidated) {
                return;
            }


            if ($scope.listDataSaudara.length >= 1) {
                $scope.listDataSaudara.forEach(function (elemen) {
                    var index = $scope.listDataSaudara.indexOf(elemen);
                    if (elemen.TanggalLahir > date) {
                        swalAlert.message('e', "tanggal lahir anda harus sebelum tanggal hari ini");
                        isValidated = false;
                    }

                    if ((elemen.NamaLengkap == null || elemen.NamaLengkap == undefined || elemen.NamaLengkap == "") &&
                        (elemen.TanggalLahir == null || elemen.TanggalLahir == undefined || elemen.TanggalLahir == "") &&
                        (elemen.PendidikanTerakhir == null || elemen.PendidikanTerakhir == undefined || elemen.PendidikanTerakhir == "")&&
                        (elemen.Pekerjaan == null || elemen.Pekerjaan == undefined || elemen.Pekerjaan == "")) {
                        
                        $scope.listDataSaudara.splice(index, 1);

                        //$scope.listDataSaudara = [];
                    } else{
                        $scope.listKeluarga.push(elemen);
                    }

                    if (!isValidated) {
                        return;
                    }
                });

                $scope.index = $scope.index + 1;
            }
            if (!isValidated) {
                return;
            }

  /*          if ($scope.listDataSaudara.length > 0 && (!$scope.ayah.NamaLengkap ||
                !$scope.ayah.PendidikanTerakhir ||
                !$scope.ayah.Pekerjaan ||
                !$scope.ibu.NamaLengkap ||
                !$scope.ibu.PendidikanTerakhir ||
                !$scope.ibu.Pekerjaan)) {
                swalAlert.message('e', "lengkapi data terlebih dahulu");
            }*/
            if (($scope.ayah.TanggalLahir > date)) {
                swalAlert.message('e', "tanggal lahir anda harus sebelum tanggal hari ini");
                return;
            }
            if (($scope.ibu.TanggalLahir > date)) {
                swalAlert.message('e', "tanggal lahir anda harus sebelum tanggal hari ini");
                return;
            } else if ($scope.spouseFormcheck == true &&
            (($scope.spouse.Hubungan == undefined ||
                    $scope.spouse.Hubungan == "" ||
                    $scope.spouse.Hubungan == null) ||
                ($scope.spouse.NamaLengkap == undefined ||
                    $scope.spouse.NamaLengkap == "" ||
                    $scope.spouse.NamaLengkap == null) ||
                ($scope.spouse.PendidikanTerakhir == undefined ||
                    $scope.spouse.PendidikanTerakhir == "" ||
                    $scope.spouse.PendidikanTerakhir == null) ||
                ($scope.spouse.Pekerjaan == undefined ||
                    $scope.spouse.Pekerjaan == "" ||
                    $scope.spouse.Pekerjaan == null) ||
                ($scope.spouse.TanggalLahir == undefined ||
                    $scope.spouse.Pekerjaan == "" ||
                    $scope.spouse.Pekerjaan == null))) {
                swalAlert.message('e', "lengkapi data terlebih dahulu");
            } else if ($scope.spouse.TanggalLahir > date) {
                var myEl = angular.element(document.getElementById('datePickerSpouse'));
                if ($rootScope.test.includes("<b>Suami/Istri<br>") != true) {
                    $rootScope.test.push("<b>Suami/Istri<br>");
                    $rootScope.test.push("Tanggal Lahir Suami/Istri<br>");
                } else if ($rootScope.test != null) {
                    $rootScope.test.push("Tanggal Lahir Suami/Istri<br>");
                }
                myEl.addClass('form-control f-danger');
                swalAlert.message('e', "tanggal lahir anda harus sebelum tanggal hari ini");
                return;
            } else {
                $scope.listKeluarga.push($scope.ayah, $scope.ibu, $scope.spouse);
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                $http.post('api/Recruitment/SubmitDataKeluarga', $scope.listKeluarga).then(function(res) {
                    if (res.data.isSucceed) {
                        swalAlert.message('s', res.data.message);
                        $state.go('rekrutmenPendidikan');
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    } else {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                        $scope.listKeluarga = [];
                        swalAlert.message('e', res.data.message);

                    }
                });
            }

        };
    });

})(angular.module('SunLifeApp'));