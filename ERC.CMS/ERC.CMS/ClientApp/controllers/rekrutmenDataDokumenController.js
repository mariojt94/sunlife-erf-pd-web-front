(function (app) {
    'use strict';

    app.controller('rekrutmenDataDokumenController', rekrutmenDataDokumenController);
    rekrutmenDataDokumenController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert', 'localStorageService', '$state', '$rootScope', '$cookies'];

    function rekrutmenDataDokumenController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert, localStorageService, $state, $rootScope, $cookies) {
        $scope.loginName = localStorageService.get('LoginName');

        $scope.checkNpwp = false;
        $scope.lengthKtp = true;
        $scope.statusKandidat = [];
        $scope.listCVsNames = [];
        $scope.listIjazahsNames = [];
        $scope.listFotosNames = [];
        $scope.listKtpsNames = [];
        $scope.listReksNames = [];
        $scope.listLainsNames = [];
        $scope.listNpwpsNames = [];

        var megabyte = 1024 * 1024;
        $scope.maxSize = 2.5;

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
                localStorageService.set('statusDataPapikostik', "done");
            }
        });

        $http({
            method: 'GET',
            url: 'api/Profile/GetAccountForProfile',
            params: {
                loginName: $scope.loginName
            }
        }).then(function(res) {
            $scope.Email = res.data.Email;
            $scope.DisplayName = res.data.DisplayName;
        });


        $scope.ToPsikotes = function() {
            $http({
                method: 'GET',
                url: '/api/Recruitment/GetPsikotesHasil',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function(res) {
                if (res.data != null) {
                    $state.go('rekrutmenPsikotesFinish');
                } else {
                    $state.go('rekrutmenPsikotes');
                }
            });
        };

        //#region Get semua buat nentuin ceklis
        $http({
            method: 'GET',
            url: 'api/Recruitment/GetDataPribadi',
            params: {
                loginName: $scope.loginName
            }
        }).then(function(res) {
            if (res.data != null && res.data.length != 0) {
                $scope.statusKandidat.push(res.data[0].Status);
                $scope.statusDataPribadi = true;
                $scope.statusDataKeluarga = res.data[0].IsKeluargaComplete;
                localStorageService.set('statusDataPribadi', "done");
            } else {
                $scope.statusDataPribadi = false;
            }

            if ($scope.statusKandidat[0] == undefined) {
                localStorageService.set('statusKandidat', "null");
            } else {
                localStorageService.set('statusKandidat', "notnull");
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
                localStorageService.set('statusDataPribadi', "undone");
            }
        });

        $http({
            method: 'GET',
            url: 'api/Recruitment/GetDataRekeningNPWP',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            if (res.data[0].NomorNPWP != null) {
                $scope.checkNpwp = true;
                localStorageService.set('submitNPWP', "yes");
            } else {
                $scope.checkNpwp = false;
                localStorageService.set('submitNPWP', "no");
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
                localStorageService.set('statusKontak', "done");
            } else {
                $scope.statusKontak = false;
                localStorageService.set('statusKontak', "undone");
            }
        });

        $scope.GetCandidateDataPendidikan = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateDataPendidikan',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
           // console.log(res.data);
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataPendidikan = true;
                localStorageService.set('statusDataPendidikan', "done");
            } else {
                $scope.statusDataPendidikan = false;
                localStorageService.set('statusDataPendidikan', "undone");
            }
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
                            params: { loginName: $scope.loginName }
                        }).then(function(res) {
                            //console.log(res.data);
                            if (res.data != null && res.data.length != 0) {
                                $scope.GetCandidateExperiencePlusMin = $http({
                                    method: 'GET',
                                    url: 'api/Recruitment/GetCandidateExperiencePlusMin',
                                    params: { loginName: $scope.loginName }
                                }).then(function(res) {
                                    //console.log(res.data);
                                    if (res.data != null && res.data.length != 0) {
                                        $scope.statusDataPekerjaan = true;
                                        localStorageService.set('statusDataPekerjaan', "done");
                                    } else {
                                        $scope.statusDataPekerjaan = false;
                                        localStorageService.set('statusDataPekerjaan', "undone");
                                    }
                                });
                            } else {
                                $scope.statusDataPekerjaan = false;
                                localStorageService.set('statusDataPekerjaan', "undone");
                            }
                        });
                    } else {
                        $scope.statusDataPekerjaan = false;
                        localStorageService.set('statusDataPekerjaan', "undone");
                    }
                });

            } else {
                $scope.statusDataPekerjaan = false;
                localStorageService.set('statusDataPekerjaan', "undone");
            }
        });

        $scope.GetDokumenCandidate = $http({
            method: 'GET',
            url: 'api/FileUpload/GetDokumenCandidate',
            params: { loginName: $scope.loginName }
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
                } else if (elemen.Type == "NPWP") {
                    $scope.nyariNpwp = elemen.Type;
                }

                if ($scope.nyariNpwp == null) {
                    localStorageService.set('isUploadNPWP', "no");
                } else {
                    localStorageService.set('isUploadNPWP', "yes");
                }

                if ($scope.nyariCV == null || $scope.nyariIjazah == null || $scope.nyariKTP == null ||
                    $scope.nyariFoto == null || $scope.nyariRek == null) {
                    $scope.statusDataDokumen = false;
                    localStorageService.set('statusDataDokumen', "undone");
                } else {
                    $scope.statusDataDokumen = true;
                    localStorageService.set('statusDataDokumen', "done");
                }
            });
        });

        $scope.getPTKP = $http({
            method: 'GET',
            url: 'api/Recruitment/GetCandidateDataPTKP',
            params: { loginName: $scope.loginName }
        }).then(function (res) {
            if (res.data != null && res.data.length != 0) {
                $scope.statusDataPtkp = true;
                localStorageService.set('statusDataPTKP', "done");
            } else {
                $scope.statusDataPtkp = false;
                localStorageService.set('statusDataPTKP', "undone");
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
                localStorageService.set('statusDataPsikotes', "done");
            } else {
                $scope.statusDataPsikotes = false;
                localStorageService.set('statusDataPsikotes', "undone");
            }
        });

        $http({
            method: 'GET',
            url: 'api/Account/GetPDFSubmitStatus',
            params: { loginName: $scope.loginName }
        }).then(function (res) {
            $scope.statusDataReview = res.data.IsSubmittedPDF != null && res.data.IsSubmittedPDF != false;
        });
        //#endregion


        //di get sekalian but open
        $scope.get = $http({
            method: 'GET',
            url: 'api/FileUpload/GetDokumenCandidate',
            params: { loginName: $scope.loginName }
        }).then(function (res) {
            console.log(res);
            $scope.Path = res.data;
            $scope.pdfIcon = "Content/assets/img/pdf-icon.png";

            $scope.Path.forEach(function(element) {
                if (element.Type == 'CV') {
                    $scope.stepsModelCV.push(element.Path.includes("pdf") ? $scope.pdfIcon : element.Path);
                    $scope.listCVs.push(element.Path);
                    $scope.listCVsNames.push(element.FileName);
                } else if (element.Type == 'IJAZAH') {
                    $scope.stepsModelIjazah.push(element.Path.includes("pdf") ? $scope.pdfIcon : element.Path);
                    $scope.listIjazahs.push(element.Path);
                    $scope.listIjazahsNames.push(element.FileName);
                } else if (element.Type == 'FOTO') {
                    $scope.stepsModelFoto.push(element.Path);
                    $scope.listFotos.push($scope.stepsModelFoto);
                    $scope.listFotosNames.push(element.FileName);
                } else if (element.Type == 'KTP') {
                    $scope.stepsModelKTP.push(element.Path.includes("pdf") ? $scope.pdfIcon : element.Path);
                    $scope.listKtps.push(element.Path);
                    $scope.listKtpsNames.push(element.FileName);
                } else if (element.Type == 'REKENING') {
                    $scope.stepsModelRek.push(element.Path.includes("pdf") ? $scope.pdfIcon : element.Path);
                    $scope.listReks.push(element.Path);
                    $scope.listReksNames.push(element.FileName);
                } else if (element.Type == 'LAIN-LAIN') {
                    $scope.stepsModelLain.push(element.Path.includes("pdf") ? $scope.pdfIcon : element.Path);
                    $scope.listLains.push(element.Path);
                    $scope.listLainsNames.push(element.FileName);
                } else if (element.Type == 'NPWP') {
                    $scope.stepsModelNpwp.push(element.Path.includes("pdf") ? $scope.pdfIcon : element.Path);
                    $scope.listNpwps.push(element.Path);
                    $scope.listNpwpsNames.push(element.FileName);
                }

                //buat buka gambarnya ke new tab
                $scope.openCV = function(index) {
                    if ($scope.stepsModelCV[index] == "Content/assets/img/pdf-icon.png") {
                        if (typeof $scope.listCVs[index] == "string" &&
                            $scope.listCVs[index].includes(".pdf") &&
                            $scope.listCVs[index] != null) {
                            $scope.link = $scope.listCVs[index];
                        } else { //newly uploaded file (not yet on server)
                            $scope.link = URL.createObjectURL($scope.listCVs[index]);
                        }
                    } else {
                        $scope.link = $scope.stepsModelCV[index];
                    }
                    var win = window.open();
                    win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                };

                $scope.openIjazah = function(index) {
                    if ($scope.stepsModelIjazah[index] == "Content/assets/img/pdf-icon.png") {
                        if (typeof $scope.listIjazahs[index] == "string" &&
                            $scope.listIjazahs[index].includes(".pdf") &&
                            $scope.listIjazahs[index] != null) {
                            $scope.link = $scope.listIjazahs[index];
                        } else { //newly uploaded file (not yet on server)
                            $scope.link = URL.createObjectURL($scope.listIjazahs[index]);
                        }
                    } else {
                        $scope.link = $scope.stepsModelIjazah[index];
                    }
                    var win = window.open();
                    win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                };

                $scope.openFoto = function(index) {
                    $scope.link = $scope.stepsModelFoto[index];
                    var win = window.open();
                    win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                };

                $scope.openKTP = function(index) {
                    if ($scope.stepsModelKTP[index] == "Content/assets/img/pdf-icon.png") {
                        if (typeof $scope.listKtps[index] == "string" &&
                            $scope.listKtps[index].includes(".pdf") &&
                            $scope.listKtps[index] != null) {
                            $scope.link = $scope.listKtps[index];
                        } else { //newly uploaded file (not yet on server)
                            $scope.link = URL.createObjectURL($scope.listKtps[index]);
                        }
                    } else {
                        $scope.link = $scope.stepsModelKTP[index];
                    }
                    var win = window.open();
                    win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                };

                $scope.openRek = function(index) {
                    if ($scope.stepsModelRek[index] == "Content/assets/img/pdf-icon.png") {
                        if (typeof $scope.listReks[index] == "string" &&
                            $scope.listReks[index].includes(".pdf") &&
                            $scope.listReks[index] != null) {
                            $scope.link = $scope.listReks[index];
                        } else { //newly uploaded file (not yet on server)
                            $scope.link = URL.createObjectURL($scope.listReks[index]);
                        }
                    } else {
                        $scope.link = $scope.stepsModelRek[index];
                    }
                    var win = window.open();
                    win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                };

                $scope.openLain = function(index) {
                    if ($scope.stepsModelLain[index] == "Content/assets/img/pdf-icon.png") {
                        if (typeof $scope.listLains[index] == "string" &&
                            $scope.listLains[index].includes(".pdf") &&
                            $scope.listLains[index] != null) {
                            $scope.link = $scope.listLains[index];
                        } else { //newly uploaded file (not yet on server)
                            $scope.link = URL.createObjectURL($scope.listLains[index]);
                        }
                    } else {
                        $scope.link = $scope.stepsModelLain[index];
                    }
                    var win = window.open();
                    win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                };

                $scope.openNpwp = function(index) {
                    if ($scope.stepsModelNpwp[index] == "Content/assets/img/pdf-icon.png") {
                        if (typeof $scope.listNpwps[index] == "string" &&
                            $scope.listNpwps[index].includes(".pdf") &&
                            $scope.listNpwps[index] != null) {
                            $scope.link = $scope.listNpwps[index];
                        } else { //newly uploaded file (not yet on server)
                            $scope.link = URL.createObjectURL($scope.listNpwps[index]);
                        }
                    } else {
                        $scope.link = $scope.stepsModelNpwp[index];
                    }
                    var win = window.open();

                    win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                };

            });
        });

        $scope.openCV = function(index) {
            if ($scope.stepsModelCV[index] == "Content/assets/img/pdf-icon.png") {
                if (typeof $scope.listCVs[index] == "string" &&
                    $scope.listCVs[index].includes(".pdf") &&
                    $scope.listCVs[index] != null) {
                    $scope.link = $scope.listCVs[index];
                } else { //newly uploaded file (not yet on server)
                    $scope.link = URL.createObjectURL($scope.listCVs[index]);
                }
            } else {
                $scope.link = $scope.stepsModelCV[index];
            }
            var win = window.open();
            win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        };

        $scope.openIjazah = function(index) {
            if ($scope.stepsModelIjazah[index] == "Content/assets/img/pdf-icon.png") {
                if (typeof $scope.listIjazahs[index] == "string" &&
                    $scope.listIjazahs[index].includes(".pdf") &&
                    $scope.listIjazahs[index] != null) {
                    $scope.link = $scope.listIjazahs[index];
                } else { //newly uploaded file (not yet on server)
                    $scope.link = URL.createObjectURL($scope.listIjazahs[index]);
                }
            } else {
                $scope.link = $scope.stepsModelIjazah[index];
            }
            var win = window.open();
            win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        };

        $scope.openFoto = function(index) {
            $scope.link = $scope.stepsModelFoto[index];
            var win = window.open();
            win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        };

        $scope.openKTP = function(index) {
            if ($scope.stepsModelKTP[index] == "Content/assets/img/pdf-icon.png") {
                if (typeof $scope.listKtps[index] == "string" &&
                    $scope.listKtps[index].includes(".pdf") &&
                    $scope.listKtps[index] != null) {
                    $scope.link = $scope.listKtps[index];
                } else { //newly uploaded file (not yet on server)
                    $scope.link = URL.createObjectURL($scope.listKtps[index]);
                }
            } else {
                $scope.link = $scope.stepsModelKTP[index];
            }
            var win = window.open();
            win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        };

        $scope.openRek = function(index) {
            if ($scope.stepsModelRek[index] == "Content/assets/img/pdf-icon.png") {
                if (typeof $scope.listReks[index] == "string" &&
                    $scope.listReks[index].includes(".pdf") &&
                    $scope.listReks[index] != null) {
                    $scope.link = $scope.listReks[index];
                } else { //newly uploaded file (not yet on server)
                    $scope.link = URL.createObjectURL($scope.listReks[index]);
                }
            } else {
                $scope.link = $scope.stepsModelRek[index];
            }
            var win = window.open();
            win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        };

        $scope.openLain = function(index) {
            if ($scope.stepsModelLain[index] == "Content/assets/img/pdf-icon.png") {
                if (typeof $scope.listLains[index] == "string" &&
                    $scope.listLains[index].includes(".pdf") &&
                    $scope.listLains[index] != null) {
                    $scope.link = $scope.listLains[index];
                } else { //newly uploaded file (not yet on server)
                    $scope.link = URL.createObjectURL($scope.listLains[index]);
                }
            } else {
                $scope.link = $scope.stepsModelLain[index];
            }
            var win = window.open();
            win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        };

        $scope.openNpwp = function(index) {
            if ($scope.stepsModelNpwp[index] == "Content/assets/img/pdf-icon.png") {
                if (typeof $scope.listNpwps[index] == "string" &&
                    $scope.listNpwps[index].includes(".pdf") &&
                    $scope.listNpwps[index] != null) {
                    $scope.link = $scope.listNpwps[index];
                } else { //newly uploaded file (not yet on server)
                    $scope.link = URL.createObjectURL($scope.listNpwps[index]);
                }
            } else {
                $scope.link = $scope.stepsModelNpwp[index];
            }
            var win = window.open();
            win.document.write('<iframe src="' + $scope.link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        };


        //#region FOR CV
        $scope.stepsModelCV = [];
        $scope.listCVs = []; //wk
      
        $scope.imageUploadCV = function(event) {
            var files = event.target.files; //to get FileList object, the actual image file

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var size = files[i].size;
                var filetype = files[i].type;
                var reader = new FileReader();   //panggil FileReader supaya bisa..
                if (!(filetype == 'image/jpeg' || filetype == 'image/png' || filetype == 'application/pdf')) {
                   swalAlert.message('i', 'Pastikan file yang diupload berformat jpg / pdf / image file');
                } else if (size > $scope.maxSize * megabyte) {
                    swalAlert.message('i', `Ukuran file maksimal ${$scope.maxSize} MB!`);
                }
                else {
                    reader.onload = $scope.imageCvIsLoaded;  //..manggil onload terus
                    reader.readAsDataURL(file);              //manggil readAsDataURL jadi bisa muncul di browser dg bentuk data:image/jpeg;base64,/ dan base64 nya
                    $scope.listCVs.push(file); //wk
                }

            }
        }
        $scope.testShowPdf = [];
        $scope.imageCvIsLoaded = function(e) {
            $scope.$apply(function() {
                $scope.pdfIcon = "Content/assets/img/pdf-icon.png";
                if (e.target.result.includes("application/pdf")) {
                    $scope.stepsModelCV.push($scope.pdfIcon);
                    $scope.testShowPdf.push(e.target.result);
                } else {
                    $scope.stepsModelCV.push(e.target.result);
                    $scope.testShowPdf.push(e.target.result);
                }
            });
        };

        $scope.deleteImageCV = function(index) {
            // remove the row specified in 
            $scope.deleted = [];
            $scope.pathDel = $scope.listCVs.splice(index, 1);
            $scope.stepsModelCV.splice(index, 1);

            var nameDel = $scope.listCVsNames.splice(index, 1)[0];
            $scope.deleted.push({ 'loginName': $scope.loginName, 'FileName': nameDel });

            $http.post('api/FileUpload/DeleteDokumenByName', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");
                } else {
                    console.log("gagal ngapus");
                }
            });
        };
        //#endregion

        //#region FOR IJAZAH
        $scope.stepsModelIjazah = [];
        $scope.listIjazahs = [];

        $scope.imageUploadIjazah = function(event) {
            var files = event.target.files; //FileList object

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var size = files[i].size;
                var filetype = files[i].type;
                var reader = new FileReader();

                if (!(filetype == 'image/jpeg' || filetype == 'image/png' || filetype == 'application/pdf')) {
                    swalAlert.message('i', 'Pastikan file yang diupload berformat jpg / pdf / image file');
                } else if (size > $scope.maxSize * megabyte) {
                    swalAlert.message('i', `Ukuran file maksimal ${$scope.maxSize} MB!`);
                } else {
                    reader.onload = $scope.imageIjazahIsLoaded;
                    reader.readAsDataURL(file);
                    $scope.listIjazahs.push(file);
                }
            }
        };


        $scope.imageIjazahIsLoaded = function(e) {
            $scope.$apply(function() {
                $scope.pdfIcon = "Content/assets/img/pdf-icon.png";
                if (e.target.result.includes("application/pdf")) {
                    $scope.stepsModelIjazah.push($scope.pdfIcon);
                } else {
                    $scope.stepsModelIjazah.push(e.target.result);
                }
            });
        };

        $scope.deleteImageIjazah = function (index) {
            // remove the row specified in index
            $scope.deleted = [];
            $scope.pathDel = $scope.listIjazahs.splice(index, 1);
            $scope.stepsModelIjazah.splice(index, 1);
            
            var nameDel = $scope.listIjazahsNames.splice(index, 1)[0];
            $scope.deleted.push({ 'loginName': $scope.loginName, 'FileName': nameDel });

            $http.post('api/FileUpload/DeleteDokumenByName', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");
                } else {
                    console.log("gagal ngapus");
                }
            });
        };
        //#endregion

        //#region FOR FOTO
        $scope.stepsModelFoto = [];
        $scope.listFotos = [];

        $scope.imageUploadFoto = function(event) {
            var files = event.target.files; //FileList object

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var size = files[i].size;
                var filetype = files[i].type;
                var reader = new FileReader();

                if (!(filetype == 'image/jpeg' || filetype == 'image/png')) {
                    swalAlert.message('i', 'Pastikan file yang diupload berformat jpg / png / image file');
                } else if (size > $scope.maxSize * megabyte) {
                    swalAlert.message('i', `Ukuran file maksimal ${$scope.maxSize} MB!`);
                } else {
                    reader.onload = $scope.imageFotoIsLoaded;
                    reader.readAsDataURL(file);
                    $scope.listFotos.push(file);
                }

            }
        };

        $scope.imageFotoIsLoaded = function(e) {
            $scope.$apply(function() {
                $scope.stepsModelFoto.push(e.target.result);
            });
        };

        $scope.deleteImageFoto = function (index) {
            // remove the row specified in index
            $scope.deleted = [];
            $scope.pathDel = $scope.stepsModelFoto.splice(index, 1);
            $scope.nameDel = $scope.listFotosNames.splice(index, 1)[0];
            $scope.deleted.push({ 'loginName': $scope.loginName, 'FileName': $scope.nameDel });

            $http.post('api/FileUpload/DeleteDokumenByName', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");
                } else {
                    console.log("gagal ngapus");
                }
            });
        };
        //#endregion FOR FOTO

        //#region FOR KTP
        $scope.stepsModelKTP = [];
        $scope.listKtps = [];

        $scope.imageUploadKTP = function(event) {
            var files = event.target.files; //FileList object

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var size = files[i].size;
                var filetype = files[i].type;
                var reader = new FileReader();

                if (!(filetype == 'image/jpeg' || filetype == 'image/png' || filetype == 'application/pdf')) {
                    swalAlert.message('i', 'Pastikan file yang diupload berformat jpg / png / image file');
                } else if (size > $scope.maxSize * megabyte) {
                    swalAlert.message('i', `Ukuran file maksimal ${$scope.maxSize} MB!`);
                } else if ($scope.listKtps.length > 0) {
                    $scope.deleteImageKTP(i);

                    reader.onload = $scope.imageKTPIsLoaded;
                    reader.readAsDataURL(file);
                    $scope.listKtps.push(file);
                } else {
                    reader.onload = $scope.imageKTPIsLoaded;
                    reader.readAsDataURL(file);
                    $scope.listKtps.push(file);
                }
            }
        };

        $scope.imageKTPIsLoaded = function(e) {
            $scope.$apply(function() {
                $scope.pdfIcon = "Content/assets/img/pdf-icon.png";
                if (e.target.result.includes("application/pdf")) {
                    $scope.stepsModelKTP.push(($scope.pdfIcon));
                } else {
                    $scope.stepsModelKTP.push(e.target.result);
                }
            });
        };

        $scope.deleteImageKTP = function (index) {
            // remove the row specified in index
            $scope.deleted = [];
            $scope.pathDel = $scope.listKtps.splice(index, 1);
            $scope.stepsModelKTP.splice(index, 1);

            var nameDel = $scope.listKtpsNames.splice(index, 1)[0];
            $scope.deleted.push({ 'loginName': $scope.loginName, 'FileName': nameDel });

            $http.post('api/FileUpload/DeleteDokumenByName', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");
                } else {
                    console.log("gagal ngapus");
                }
            });
        };
        //#endregion

        //#region FOR REKNEING
        $scope.stepsModelRek = [];
        $scope.listReks = [];

        $scope.imageUploadRek = function(event) {
            var files = event.target.files; //FileList object

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var size = files[i].size;
                var filetype = files[i].type;
                var reader = new FileReader();

                if (!(filetype == 'image/jpeg' || filetype == 'image/png' || filetype == 'application/pdf')) {
                    swalAlert.message('i', 'Pastikan file yang diupload berformat jpg / pdf / image file');
                } else if (size > $scope.maxSize * megabyte) {
                    swalAlert.message('i', `Ukuran file maksimal ${$scope.maxSize} MB!`);
                } else {
                    reader.onload = $scope.imageRekeningIsLoaded;
                    reader.readAsDataURL(file);
                    $scope.listReks.push(file);
                }
            }
        };

        $scope.imageRekeningIsLoaded = function(e) {
            $scope.$apply(function() {
                $scope.pdfIcon = "Content/assets/img/pdf-icon.png";
                if (e.target.result.includes("application/pdf")) {
                    $scope.stepsModelRek.push($scope.pdfIcon);
                } else {
                    $scope.stepsModelRek.push(e.target.result);
                }
            });
        };

        $scope.deleteImageRek = function (index) {
            // remove the row specified in index
            $scope.deleted = [];
            $scope.pathDel = $scope.listReks.splice(index, 1);
            $scope.stepsModelRek.splice(index, 1);

            var nameDel = $scope.listReksNames.splice(index, 1)[0];
            $scope.deleted.push({ 'loginName': $scope.loginName, 'FileName': nameDel });

            $http.post('api/FileUpload/DeleteDokumenByName', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");
                } else {
                    console.log("gagal ngapus");
                }
            });
        };
        //#endregion FOR REKNEING

        //#region FOR DOKUMEN LAIN
        $scope.stepsModelLain = [];
        $scope.listLains = [];

        $scope.imageUploadLain = function(event) {
            var files = event.target.files; //FileList object

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var size = files[i].size;
                var filetype = files[i].type;
                var reader = new FileReader();

                if (!(filetype == 'image/jpeg' || filetype == 'image/png' || filetype == 'application/pdf')) {
                    swalAlert.message('i', 'Pastikan file yang diupload berformat jpg / pdf / image file');
                } else if (size > $scope.maxSize * megabyte) {
                    swalAlert.message('i', `Ukuran file maksimal ${$scope.maxSize} MB!`);
                } else {
                    reader.onload = $scope.imageLainIsLoaded;
                    reader.readAsDataURL(file);
                    $scope.listLains.push(file);
                }

            }
        };

        $scope.imageLainIsLoaded = function(e) {
            $scope.$apply(function() {
                $scope.pdfIcon = "Content/assets/img/pdf-icon.png";
                if (e.target.result.includes("application/pdf")) {
                    $scope.stepsModelLain.push($scope.pdfIcon);
                } else {
                    $scope.stepsModelLain.push(e.target.result);
                }
            });
        };

        $scope.deleteImageLain = function (index) {
            // remove the row specified in index
            
            $scope.deleted = [];
            $scope.pathDel = $scope.listLains.splice(index, 1);
            $scope.stepsModelLain.splice(index, 1);

            $scope.nameDel = $scope.listLainsNames.splice(index, 1)[0];
            $scope.deleted.push({ 'LoginName': $scope.loginName, 'FileName': $scope.nameDel });

            $http.post('api/FileUpload/DeleteDokumenByName', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");
                    } else {
                    console.log("gagal ngapus");
                }
            });
        };
        //#endregion

        //#region FOR DOKUMEN NPWP
        $scope.stepsModelNpwp = [];
        $scope.listNpwps = [];

        $scope.imageUploadNpwp = function(event) {
            var files = event.target.files; //FileList object
            for (var i = 0; i < files.length; i++) {

                var file = files[i];
                var size = files[i].size;
                var filetype = files[i].type;
                var reader = new FileReader();

                if (!(filetype == 'image/jpeg' || filetype == 'image/png' || filetype == 'application/pdf')) {
                    swalAlert.message('i', 'Pastikan file yang diupload berformat jpg / pdf / image file');
                } else if (size > $scope.maxSize * megabyte) {
                    swalAlert.message('i', `Ukuran file maksimal ${$scope.maxSize} MB!`);
                } else if ($scope.listNpwps.length > 0) {
                    $scope.deleteImageNpwp(i);

                    reader.onload = $scope.imageNpwpIsLoaded;
                    reader.readAsDataURL(file);
                    $scope.listNpwps.push(file);
                } else {
                    reader.onload = $scope.imageNpwpIsLoaded;
                    reader.readAsDataURL(file);
                    $scope.listNpwps.push(file);
                }
            }
        };

        $scope.imageNpwpIsLoaded = function(e) {
            $scope.$apply(function() {
                $scope.pdfIcon = "Content/assets/img/pdf-icon.png";
                if (e.target.result.includes("application/pdf")) {
                    $scope.stepsModelNpwp.push($scope.pdfIcon);
                } else {
                    $scope.stepsModelNpwp.push(e.target.result);
                }
            });
        };

        $scope.deleteImageNpwp = function (index) {
            // remove the row specified in index

            $scope.deleted = [];
            $scope.pathDel = $scope.listNpwps.splice(index, 1);
            $scope.stepsModelNpwp.splice(index, 1);

            var nameDel = $scope.listNpwpsNames.splice(index, 1)[0];
            $scope.deleted.push({ 'loginName': $scope.loginName, 'FileName': nameDel });

            $http.post('api/FileUpload/DeleteDokumenByName', $scope.deleted).then(function (response) {
                if (response.data.isSucceed) {
                    console.log("berhasil ngapus");
                    } else {
                    console.log("gagal ngapus");
                }
            });
        };
        //#endregion FOR DOKUMEN NPWP
        console.log($scope.statusKandidat[0]);

        var params = {
            'loginName': $scope.loginName,
            'cv': $scope.stepsModelCV,
            'ijazah': $scope.stepsModelIjazah,
            'foto': $scope.stepsModelFoto,
            'ktp': $scope.stepsModelKTP,
            'rekening': $scope.stepsModelRek,
            'lain': $scope.stepsModelLain
        };

        $scope.uploadFile = function() {
            $rootScope.test = [];
            var i;

            var fd = new FormData();
            fd.append('LoginName', $scope.loginName);

            //looping each CV element
            i = 1; //wk
            $scope.listCVs.forEach(function(elem) {
                fd.append('CV' + i++, elem);
            }); //end wk


            //looping each ijazah element
            i = 1;
            $scope.listIjazahs.forEach(function(elem) {
                fd.append('IJAZAH' + i++, elem);
            });

            //looping each foto element
            i = 1;
            $scope.listFotos.forEach(function(elem) {
                fd.append('FOTO', elem);
            });

            //looping each ktp element
            i = 1;
            $scope.listKtps.forEach(function(elem) {
                fd.append('KTP', elem);
            });

            //looping each rekening element
            i = 1;
            $scope.listReks.forEach(function(elem) {
                fd.append('REKENING' + i++, elem);
            });

            //looping each dokumenlain element
            i = 1;
            $scope.listLains.forEach(function(elem) {
                fd.append('LAIN-LAIN' + i++, elem);
            });

            i = 1;
            $scope.listNpwps.forEach(function(elem) {
                fd.append('NPWP' + i++, elem);
            });

            if ($scope.listCVs.length == 0) {
                $rootScope.test.push("CV <br>");
            }
            if ($scope.listIjazahs.length == 0) {
                $rootScope.test.push("ijazah <br>");
            }
            if ($scope.listFotos.length == 0) {
                $rootScope.test.push("foto <br>");
            }
            if ($scope.listKtps.length == 0) {
                $rootScope.test.push("ktp <br>");
            }
            if ($scope.listReks.length == 0) {
                $rootScope.test.push("rekening <br>");
            }
            if ($scope.listNpwps.length == 0 && localStorageService.get('submitNPWP') == "yes") {
                $rootScope.test.push("npwp <br>");
            }

            if ($scope.listCVs.length == 0 || $scope.listIjazahs == 0 || $scope.listFotos == 0 || $scope.listKtps == 0 || $scope.listReks == 0) {
                swalAlert.message('i', "silahkan upload file terlebih dahulu");
            } else if ($scope.listNpwps.length == 0 && localStorageService.get('submitNPWP') == "yes") {
                swalAlert.message('i', "silahkan upload file npwp terlebih dahulu");
            } else {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                //baru di pos
                $http.post('api/FileUpload/CobaSubmit',
                    fd,
                    {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }).then(function SuccesCallbBack(response) {
                        if (response.data.isSucceed == true) {
                            swalAlert.message('s', response.data.message);
                            $state.go('rekrutmenPTKP');
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        } else {
                            swalAlert.message('e', response.data.message);
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        }
                    },
                    function errorCallback(response) {
                        swalAlert.message('e', response.data.ExceptionMessage);
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    });
            }
        };

        $scope.lihatDocument = function (fileId) {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            $http({
                    method: 'GET',
                    url: 'api/RecruitmentForm/GeneratePDF',
                    params: {
                        loginName: $scope.loginName
                    }
                })
                .then(function(response) {
                    if (response.data.isSucceed) {
                        window.open('/File/' + response.data.CustomField.filename, '_blank');
                    } else {
                        swalAlert.message('i', 'Tidak Ada Data / Terjadi Kesalahan');
                    }
                    return response;
                }).finally(function() {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                });
        };


        $scope.simpanDocument = function() {

            $scope.status = localStorageService.get('statusKandidat');
            if ($scope.status == null) $scope.status = "null";
            if ($scope.syaratKetentuan == undefined) {
                swalAlert.message('e', "Harap menyetujui syarat dan ketentuan terlebih dahulu");
            } else if (localStorageService.get('statusDataPribadi') != "done" ||
                localStorageService.get('statusKontak') != "done" ||
                localStorageService.get('statusDataPendidikan') != "done" ||
                localStorageService.get('statusDataPekerjaan') != "done" ||
                localStorageService.get('statusDataDokumen') != "done" ||
                //localStorageService.get('statusDataPsikotes') != "done" ||
                localStorageService.get('statusDataPapikostik') != "done" ||
                localStorageService.get('statusDataPTKP') != "done") {
                swalAlert.message('e', "Data Formulir Aplikasi tidak lengkap, harap lengkapi data terlebih dahulu");
            } else if (localStorageService.get('isUploadNPWP') == "no" && localStorageService.get('submitNPWP') == "yes") {
                swalAlert.message('e', "harap lengkapi data NPWP terlebih dahulu");
            } else {
                $scope.get = $http({
                    method: 'GET',
                    url: 'api/FileUpload/GetDokumenPDF',
                    params: {
                        loginName: $scope.loginName
                    }
                }).then(function(res) {
                    $scope.Path = res.data;
                    $scope.Path.forEach(function(element) {
                    });

                    if ($scope.Path.length == 0) {
                        swalAlert.message('i', "Silahkan lihat dokumen terlebih dahulu");
                    } else {
                        swalAlert.confirmPDF(function(isConfirmed) {
                            if (isConfirmed.value) {
                                $('.spinner').fadeIn(500);
                                $(".OverlaySpinner").fadeIn(500);
                                $http({
                                    method: 'POST',
                                    url: 'api/Account/toSendEmail',
                                    params: {
                                        loginName: $scope.loginName,
                                        name: $scope.DisplayName,
                                        email: $scope.Email,
                                        status: $scope.status,
                                        type: "PDFSUBMIT"
                                    }
                                }).then(function(res) {

                                    swalAlert.message('s', "Data formulir aplikasi berhasil disubmit");
                                    $('.spinner').fadeOut(500);
                                    $(".OverlaySpinner").fadeOut(500);

                                    $state.go('homeNew', { reload: true });
                                });
                            }
                        });
                    }
                });
            }
        };
    }
    
})(angular.module('SunLifeApp'));