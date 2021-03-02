(function(app) {
    'use strict';
    app.controller('rekrutmenPapikostikMulaiController',
        function ($window, $scope, $http, $state, authService, localStorageService, swalAlert, $cookies) {
            $scope.hasil = {};
            $scope.answers = [];
            $scope.loginName = localStorageService.get('LoginName');
            $scope.papikostikPage = true;
            $scope.papikostikPageStart = false;
            $scope.pilihA = 'A';
            $scope.pilihB = 'B';
            $scope.cookiesJawabanPapikostik = [];
            $scope.cookiesJawabanPapikostik2 = [];
            $scope.jumlahSoalYangTerjawab = 0;
            var kondisiPindahPage = [];

            //nilai default paging
            $scope.pagingOptions = {
                pageSize: 5,
                currentPage: 1
            };

            $scope.GetPapikostikSoal = function () {
                $http({
                    method: 'GET',
                    url: '/api/Recruitment/GetPapikostikSoal',
                    params: {
                        loginName: $scope.loginName
                    }
                }).then(function (res) {
                    $scope.soalPapikostik = res.data;

                    if (res.data != null) {

                        $http({
                            method: 'GET',
                            url: '/api/Recruitment/GetPapikostikJawaban',
                            params: {
                                loginName: $scope.loginName
                            }
                        }).then(function (res2) {
                            if (res2.data != null) {    
                                var splitJawabanPapikostik = res2.data.split('|')

                                var hapusSplitJawabanPapikostik = "";
                                while (splitJawabanPapikostik.indexOf("") != -1) {
                                    hapusSplitJawabanPapikostik = splitJawabanPapikostik.splice(splitJawabanPapikostik.indexOf(record => record == ""), 1);
                                }

                                for (var index = 0; index <= splitJawabanPapikostik.length; index++) {

                                    if (splitJawabanPapikostik[index] != null || splitJawabanPapikostik[index] != undefined) {
                                        $scope.cookiesJawabanPapikostik.push(splitJawabanPapikostik[index]); 
                                    }

                                    var page = $scope.pagingOptions.currentPage * 5;
                                    $scope.jumlahSoalYangTerjawab = $scope.cookiesJawabanPapikostik.length;
                                    if ($scope.jumlahSoalYangTerjawab == page) {
                                        $scope.pagingOptions.currentPage = $scope.pagingOptions.currentPage + 1;                                        
                                    }  

                                }               
                                
                                if ($scope.cookiesJawabanPapikostik.length == 90) { //20 soal, 90 soal
                                    $scope.papikostikPage = false;
                                    $scope.papikostikPageStart = false;
                                    $scope.papikostikFinish = true;
                                } else {
                                    $scope.setPagingNew(true);

                                    $scope.papikostikPage = false;
                                    $scope.papikostikPageStart = true;
                                    $scope.papikostikFinish = false;
                                }
                                //$state.go('rekrutmenPapikostikFinish');
                            } else {
                                $scope.setPagingNew(true);
                                //$state.go('rekrutmenPapikostik');
                            }          
                        });
                    } else {
                        console.log('Tidak ada soal');
                    }
                });
            }                       

            //mengatur bagian isi table
            $scope.setPagingNew = function (kondisiMasukCookies) {

                $scope.newMyData = $scope.soalPapikostik;
                if ($scope.newMyData) {
                    var maxPage = Math.ceil($scope.newMyData.length / $scope.pagingOptions.pageSize);
                    if ($scope.pagingOptions.currentPage > maxPage) {
                        $scope.pagingOptions.currentPage = 1;
                    }
                    var begin = ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;
                    var end = begin + $scope.pagingOptions.pageSize;
                    $scope.myDataFilter = $scope.newMyData.slice(begin, end);
                }

                if (kondisiMasukCookies) {
                    $scope.getCookiesSoalDanJawaban();
                }
            };

            $scope.changeRowA1 = function (noSoal, pilihan, isPagePapisKotik) {

                if (pilihan == 'A') {

                    var indexValue = $scope.answers.findIndex(record => record.NoSoal === noSoal);
                    var data = {};
                    if (indexValue >= 0) {
                        //var a = $scope.answers.splice($scope.answers.indexOf(record => record.NoSoal === noSoal), 1);
                        var a = $scope.answers.splice($scope.answers.findIndex(record => record.NoSoal === noSoal), 1);

                        data = { "NoSoal": noSoal, "pilihan": pilihan, "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } else {

                        data = { "NoSoal": noSoal, "pilihan": pilihan, "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    if (isPagePapisKotik) {

                        var cookiesJawabanPapikostik = "cookiesJawabanPapikostik" + noSoal;
                        $scope[cookiesJawabanPapikostik] = pilihan;
                        console.log("$scope.cookiesJawabanPapikostik" + noSoal + "=" + $scope[cookiesJawabanPapikostik]);

                        $cookies.put(cookiesJawabanPapikostik, pilihan);
                    }
                    

                } else {
                    var indexValue = $scope.answers.findIndex(record => record.NoSoal === noSoal);
                    var data = {};
                    if (indexValue >= 0) {
                        var a = $scope.answers.splice($scope.answers.findIndex(record => record.NoSoal === noSoal), 1);

                        data = { "NoSoal": noSoal, "pilihan": pilihan, "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } else {

                        data = { "NoSoal": noSoal, "pilihan": pilihan, "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    if (isPagePapisKotik) {
                        var cookiesJawabanPapikostik = "cookiesJawabanPapikostik" + noSoal;
                        //$window.alert('angularAlert')

                        $cookies.put(cookiesJawabanPapikostik, pilihan);
                    }

                }

                if (isPagePapisKotik) {

                    var panjangAnswers = $scope.answers.length;
                    var jumlahMaxSoalPerPageYangDijawab = 5 * $scope.pagingOptions.currentPage;
                    //if (panjangAnswers == jumlahMaxSoalPerPageYangDijawab) { // pake ini klo misalnya setiap masuk menu papikostik dia juga push data answernya, jd jumlahMaxSoalPerPageYangDijawab nya ini ngikutin per jumlah page yang harus di isi
                    if (panjangAnswers == 5) { // pakei ini klo kondisinya hanya setiap dia ngisi 5 soal baru di simpan datanya.

                        $('.spinner').fadeIn(500);
                        $(".OverlaySpinner").fadeIn(500);
                        var listjawabanPapikostik = $scope.answers;
                        var res = $http.post('api/Recruitment/SaveJawabanSoalPapikostik', listjawabanPapikostik)
                            .then(function (response) {
                                console.log(response);

                                if (response.data.isSucceed) {
                                    $('.spinner').fadeOut(500);
                                    $(".OverlaySpinner").fadeOut(500);
                                    $state.reload();
                                    //swalAlert.message('s', response.data.message);

                                    //hapus all cookies (data yang sudah di simpan, cookiesnya di hapus)
                                    var cookies = $cookies.getAll();
                                    angular.forEach(cookies, function (v, k) {
                                        $cookies.remove(k);
                                    });

                                    $scope.pagingOptions.currentPage = $scope.pagingOptions.currentPage + 1;
                                    $scope.setPagingNew(false);

                                } else {
                                    $('.spinner').fadeOut(500);
                                    $(".OverlaySpinner").fadeOut(500);
                                    $state.reload();

                                    swalAlert.message('e', "Tidak Menyimpan data papikostik");
                                    console.log("Tidak Menyimpan data papikostik");
                                    console.log(response.data.message);
                                }
                                $state.reload();
                            });
                    } 
                }               

            }

            $scope.startPapikostik = function () {
                $scope.papikostikPage = false;
                $scope.papikostikPageStart = true;
                $scope.papikostikFinish = false;
            }          

            // ini untuk mengambil cookies dari soal yang pernah dia jawab            
            $scope.getCookiesSoalDanJawaban = function () {
                var jumlahMaxSoalPerPageYangDijawab = 5 * $scope.pagingOptions.currentPage;
                var nilaiIndex = jumlahMaxSoalPerPageYangDijawab - 4;
                var panjangAnswers = 0;
                for (var index = nilaiIndex; index <= jumlahMaxSoalPerPageYangDijawab; index++) {

                    var cookiesJawabanPapikostik = "cookiesJawabanPapikostik" + index;
                    var getCookiesJawabanPapikostik = $cookies.get(cookiesJawabanPapikostik);
                    $scope.cookiesJawabanPapikostik.push(getCookiesJawabanPapikostik);   
                    if (getCookiesJawabanPapikostik != null || getCookiesJawabanPapikostik != undefined) {
                        kondisiPindahPage.push(getCookiesJawabanPapikostik);
                    }
                                        
                    if (getCookiesJawabanPapikostik != null || getCookiesJawabanPapikostik != undefined) {
                        $scope.changeRowA1(index, getCookiesJawabanPapikostik, false);
                    }

                    panjangAnswers = kondisiPindahPage.length + $scope.jumlahSoalYangTerjawab;
                    if (panjangAnswers == jumlahMaxSoalPerPageYangDijawab) {                                                    
                        $scope.pagingOptions.currentPage = $scope.pagingOptions.currentPage + 1;
                        $scope.setPagingNew(true);                                       
                    }
                }
                if (panjangAnswers == 0) {
                    $scope.papikostikPage = true;
                    $scope.papikostikPageStart = false;
                    $scope.papikostikFinish = false;
                }
            }

            $scope.GetPapikostikSoal();

            //BACK FOR THE FIRST TIME
            $scope.firstBack = function () {
               // swalAlert.confirmPsikotes(function (isConfirmed) {
                    //if (isConfirmed.value) {
                        //$state.go('rekrutmenPsikotes');
                        $state.go('rekrutmenPTKP');
                    //}
                //});
            }

            $scope.nextToReview = function () {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                //var loginName = $scope.loginName;
                //var res = $http.post('api/Recruitment/SaveIsFinishPapikostik', loginName)
                $http({
                    method: 'POST',
                    url: 'api/Recruitment/SaveIsFinishPapikostik',
                    params: {
                        loginName: $scope.loginName
                    }
                }).then(function (response) {
                        console.log(response);

                        if (response.data.isSucceed) {
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                            //$state.reload();
                            //swalAlert.message('s', response.data.message);

                            $state.go('rekrutmenReview');

                        } else {
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                            $state.reload();

                            swalAlert.message('e', "Tidak Menyimpan data papikostik");
                            console.log("Tidak Menyimpan data papikostik");
                            console.log(response.data.message);
                        }
                        //$state.reload();
                });

            }

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

            //==========================================================Batas Kodingan Papikostik====================================================
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
                    console.log($scope.statusKontak);
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
                    console.log($scope.statusKontak);
                }
            });

            $scope.getKontak = $http({
                method: 'GET',
                url: 'api/Recruitment/GetKontak',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                console.log(res.data);
                if (res.data != null && res.data.length != 0) {
                    $scope.statusKontak = true;
                } else {
                    $scope.statusKontak = false;
                    console.log($scope.statusKontak);
                }
            });

            //$scope.GetCandidateDataKeluarga = $http({
            //    method: 'GET',
            //    url: 'api/Recruitment/GetCandidateDataKeluarga',
            //    params: {
            //        loginName: $scope.loginName
            //    }
            //}).then(function (res) {
            //    console.log(res.data);
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
                console.log(res.data);
                if (res.data != null && res.data.length != 0) {
                    $scope.statusDataPendidikan = true;
                } else {
                    $scope.statusDataPendidikan = false;
                    // console.log($scope.statusDataKeluarga);
                }
            });

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
                console.log(res.data);
                if (res.data != null && res.data.length != 0) {

                    $scope.GetCandidateExperienceBahasa = $http({
                        method: 'GET',
                        url: 'api/Recruitment/GetCandidateExperienceBahasa',
                        params: {
                            loginName: $scope.loginName
                        }
                    }).then(function (res) {
                        console.log(res.data);
                        if (res.data != null && res.data.length != 0) {
                            $scope.GetCandidateExperienceMinat = $http({
                                method: 'GET',
                                url: 'api/Recruitment/GetCandidateExperienceMinat',
                                params: {
                                    loginName: $scope.loginName
                                }
                            }).then(function (res) {
                                console.log(res.data);
                                if (res.data != null && res.data.length != 0) {
                                    $scope.GetCandidateExperiencePlusMin = $http({
                                        method: 'GET',
                                        url: 'api/Recruitment/GetCandidateExperiencePlusMin',
                                        params: {
                                            loginName: $scope.loginName
                                        }
                                    }).then(function (res) {
                                        console.log(res.data);
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
                    console.log(res);
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
                    console.log(res);
                    $scope.statusDataReview = false;
                } else {
                    $scope.statusDataReview = true;
                }
            });

            var isValidated = true;
            $http({
                method: 'GET',
                url: '/api/Recruitment/GetPsikotesHasil',
                params: {
                    loginName: $scope.loginName
                }
            }).then(function (res) {
                if (res.data != null) {

                    isValidated = false;
                    return;

                }
            });

            //#endregion

            //#region ini Yang di comment            

            //#region jumlah DISC
            //buat simpen jumlah masing D I S C
            /*$scope.MostDominant = 0;
            $scope.MostInfluence = 0;
            $scope.MostSteadiness = 0;
            $scope.MostConscientiousness = 0;

            $scope.LeastDominant = 0;
            $scope.LeastInfluence = 0;
            $scope.LeastSteadiness = 0;
            $scope.LeastConscientiousness = 0;

            $scope.MostStar = 0;
            $scope.LeastStar = 0;*/

            //#endregion
            
            //#region deklarasi view soal
            /*$scope.gantiPertanyaan1 = true;
            $scope.gantiPertanyaan2 = false;
            $scope.gantiPertanyaan3 = false;
            $scope.gantiPertanyaan4 = false;
            $scope.gantiPertanyaan5 = false;
            $scope.gantiPertanyaan6 = false;
            $scope.gantiPertanyaan7 = false;
            $scope.gantiPertanyaan8 = false;
            $scope.gantiPertanyaan9 = false;
            $scope.gantiPertanyaan10 = false;
            $scope.gantiPertanyaan11 = false;
            $scope.gantiPertanyaan12 = false;
            $scope.gantiPertanyaan13 = false;
            $scope.gantiPertanyaan14 = false;
            $scope.gantiPertanyaan15 = false;
            $scope.gantiPertanyaan16 = false;
            $scope.gantiPertanyaan17 = false;
            $scope.gantiPertanyaan18 = false;
            $scope.gantiPertanyaan19 = false;
            $scope.gantiPertanyaan20 = false;
            $scope.gantiPertanyaan21 = false;
            $scope.gantiPertanyaan22 = false;
            $scope.gantiPertanyaan23 = false;
            $scope.gantiPertanyaan24 = false;
            $scope.psikotesFinish = false;*/
            //#endregion
           
            //#region how it works
            /* scope changeRow dipanggil pas select radio button nya. jd if if ($scope.row1 == $scope.row2) $scope.row2 = undefined; itu buat
            supaya pas dipilih, yg laen ga kepilih(set ke undefined).
            
            if yg  if (($scope.row1 && $scope.row2) ngecek satu satu pasangan row berapa yg dipilih. dengan ngecek yg undefined yg mana.
            dikasi nilai 1 ama 2 untuk most dan least respectively.(dont ask why 1 and 2. its the only known way that works, if you find another way feel free to change)
            dsini:
            if ($scope.row1 == "1") {
                      var data = { "noPertanyaan": "1", "Row": "1", "Value": "1", "loginName": $scope.loginName};
                        $scope.answers.push(data);
            dan ditaro di data buat entarnya disimpen di db
            jadi bentuknya row 1 value 1 artinya: pertanyaan Mudah bergaul, ramah, mudah setuju dijawab most

            dipush di bufferHasil semuan rownya jadi bentuknya misalnya[1,2,0,0] terus di foreach buffernya.
            dikasi counter mulai dr 0, sebgai penanda buat row. jadi row 1 itu counter = 0. terus digabung ama nilai di buffer. 
            dicek kalo nilai gabungannya '01' berarti di row 1 dia pilih yg most. no.1 row 1 pilih most itu berarti nilai most S tambah 1
            setelah itu counter nambah jadi 1(counter = 1 now). digabung lagi ama buffer. dicek. misalnya ada jadi '12'
            berati di row 2 dia pilih least. no.1 row 2 pilh least itu berarti nilai least I ditambah 1

            terus tinggal buat scope pertanyaan yg sekarang false(jadi ga muncul) dan soal yg berikutnya jd true(muncul)
            
            ulangin buat tiap row di 23 pertanyaan sisanya
            */
            // #endregion

            // #region pertanyaan
            /*
            // #region pertanyaan 1
            
            
            $scope.changeRow2 = function() {
                if ($scope.row2 == $scope.row1) $scope.row1 = undefined;
                if ($scope.row2 == $scope.row3) $scope.row3 = undefined;
                if ($scope.row2 == $scope.row4) $scope.row4 = undefined;

                if ($scope.row1 && $scope.row2 !== undefined ||
                    $scope.row1 && $scope.row3 !== undefined ||
                    $scope.row1 && $scope.row4 !== undefined ||
                    $scope.row2 && $scope.row3 !== undefined ||
                    $scope.row2 && $scope.row4 !== undefined ||
                    $scope.row3 && $scope.row4 !== undefined) {

                    if ($scope.row1 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1, $scope.row2, $scope.row3, $scope.row4);
                    var counter = 0;

                    $scope.bufferHasil.forEach(function (elemen) {
                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan1 = false;
                    $scope.gantiPertanyaan2 = true;
                }
            }
            $scope.changeRow3 = function() {
                if ($scope.row3 == $scope.row1) $scope.row1 = undefined;
                if ($scope.row3 == $scope.row2) $scope.row2 = undefined;
                if ($scope.row3 == $scope.row4) $scope.row4 = undefined;

                if ($scope.row1 && $scope.row2 !== undefined ||
                    $scope.row1 && $scope.row3 !== undefined ||
                    $scope.row1 && $scope.row4 !== undefined ||
                    $scope.row2 && $scope.row3 !== undefined ||
                    $scope.row2 && $scope.row4 !== undefined ||
                    $scope.row3 && $scope.row4 !== undefined) {
                    if ($scope.row1 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1, $scope.row2, $scope.row3, $scope.row4);
                    var counter = 0;

                    $scope.bufferHasil.forEach(function (elemen) {
                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });
                    $scope.gantiPertanyaan1 = false;
                    $scope.gantiPertanyaan2 = true;
                }
            }
            $scope.changeRow4 = function() {
                if ($scope.row4 == $scope.row1) $scope.row1 = undefined;
                if ($scope.row4 == $scope.row2) $scope.row2 = undefined;
                if ($scope.row4 == $scope.row3) $scope.row3 = undefined;


                if ($scope.row1 && $scope.row2 !== undefined ||
                    $scope.row1 && $scope.row3 !== undefined ||
                    $scope.row1 && $scope.row4 !== undefined ||
                    $scope.row2 && $scope.row3 !== undefined ||
                    $scope.row2 && $scope.row4 !== undefined ||
                    $scope.row3 && $scope.row4 !== undefined) {
                    if ($scope.row1 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4 == "1") {
                        var data = { "noPertanyaan": "1", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4 == "2") {
                        var data = { "noPertanyaan": "1", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1, $scope.row2, $scope.row3, $scope.row4);
                    var counter = 0;

                    $scope.bufferHasil.forEach(function (elemen) {
                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan1 = false;
                    $scope.gantiPertanyaan2 = true;
                }
            }
            
            // #endregion
            // #region pertanyaan 2
            $scope.changeRow1a = function() {
                if ($scope.row1a == $scope.row2a) $scope.row2a = undefined;
                if ($scope.row1a == $scope.row3a) $scope.row3a = undefined;
                if ($scope.row1a == $scope.row4a) $scope.row4a = undefined;

                if ($scope.row1a && $scope.row2a !== undefined ||
                    $scope.row1a && $scope.row3a !== undefined ||
                    $scope.row1a && $scope.row4a !== undefined ||
                    $scope.row2a && $scope.row3a !== undefined ||
                    $scope.row2a && $scope.row4a !== undefined ||
                    $scope.row3a && $scope.row4a !== undefined) {

                    if ($scope.row1a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1a, $scope.row2a, $scope.row3a, $scope.row4a);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });
                    
                    $scope.gantiPertanyaan2 = false;
                    $scope.gantiPertanyaan3 = true;

                }
            }

            $scope.changeRow2a = function() {
                if ($scope.row2a == $scope.row1a) $scope.row1a = undefined;
                if ($scope.row2a == $scope.row3a) $scope.row3a = undefined;
                if ($scope.row2a == $scope.row4a) $scope.row4a = undefined;

                if ($scope.row1a && $scope.row2a !== undefined ||
                    $scope.row1a && $scope.row3a !== undefined ||
                    $scope.row1a && $scope.row4a !== undefined ||
                    $scope.row2a && $scope.row3a !== undefined ||
                    $scope.row2a && $scope.row4a !== undefined ||
                    $scope.row3a && $scope.row4a !== undefined) {

                    if ($scope.row1a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1a, $scope.row2a, $scope.row3a, $scope.row4a);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan2 = false;
                    $scope.gantiPertanyaan3 = true;
                }
            }
            $scope.changeRow3a = function() {
                if ($scope.row3a == $scope.row1a) $scope.row1a = undefined;
                if ($scope.row3a == $scope.row2a) $scope.row2a = undefined;
                if ($scope.row3a == $scope.row4a) $scope.row4a = undefined;

                if ($scope.row1a && $scope.row2a !== undefined ||
                    $scope.row1a && $scope.row3a !== undefined ||
                    $scope.row1a && $scope.row4a !== undefined ||
                    $scope.row2a && $scope.row3a !== undefined ||
                    $scope.row2a && $scope.row4a !== undefined ||
                    $scope.row3a && $scope.row4a !== undefined) {

                    if ($scope.row1a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "1", "Value": "1" };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "1", "Value": "2" };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "2", "Value": "1" };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "2", "Value": "2" };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "3", "Value": "1" };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "3", "Value": "2" };
                        $scope.answers.push(data);
                    } if ($scope.row4a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "4", "Value": "1" };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "4", "Value": "2" };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1a, $scope.row2a, $scope.row3a, $scope.row4a);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan2 = false;
                    $scope.gantiPertanyaan3 = true;
                }
            }
            $scope.changeRow4a = function() {
                if ($scope.row4a == $scope.row1a) $scope.row1a = undefined;
                if ($scope.row4a == $scope.row2a) $scope.row2a = undefined;
                if ($scope.row4a == $scope.row3a) $scope.row3a = undefined;


                if ($scope.row1a && $scope.row2a !== undefined ||
                    $scope.row1a && $scope.row3a !== undefined ||
                    $scope.row1a && $scope.row4a !== undefined ||
                    $scope.row2a && $scope.row3a !== undefined ||
                    $scope.row2a && $scope.row4a !== undefined ||
                    $scope.row3a && $scope.row4a !== undefined) {

                    if ($scope.row1a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4a == "1") {
                        var data = { "noPertanyaan": "2", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4a == "2") {
                        var data = { "noPertanyaan": "2", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1a, $scope.row2a, $scope.row3a, $scope.row4a);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan2 = false;
                    $scope.gantiPertanyaan3 = true;
                }
            }
            // #endregion
            //#region pertanyaan 3
            $scope.changeRow1b = function() {
                if ($scope.row1b == $scope.row2b) $scope.row2b = undefined;
                if ($scope.row1b == $scope.row3b) $scope.row3b = undefined;
                if ($scope.row1b == $scope.row4b) $scope.row4b = undefined;

                if ($scope.row1b && $scope.row2b !== undefined ||
                    $scope.row1b && $scope.row3b !== undefined ||
                    $scope.row1b && $scope.row4b !== undefined ||
                    $scope.row2b && $scope.row3b !== undefined ||
                    $scope.row2b && $scope.row4b !== undefined ||
                    $scope.row3b && $scope.row4b !== undefined) {

                    if ($scope.row1b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1b, $scope.row2b, $scope.row3b, $scope.row4b);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {
                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });


                    $scope.gantiPertanyaan3 = false;
                    $scope.gantiPertanyaan4 = true;
                }
            }

            $scope.changeRow2b = function() {
                if ($scope.row2b == $scope.row1b) $scope.row1b = undefined;
                if ($scope.row2b == $scope.row3b) $scope.row3b = undefined;
                if ($scope.row2b == $scope.row4b) $scope.row4b = undefined;

                if ($scope.row1b && $scope.row2b !== undefined ||
                    $scope.row1b && $scope.row3b !== undefined ||
                    $scope.row1b && $scope.row4b !== undefined ||
                    $scope.row2b && $scope.row3b !== undefined ||
                    $scope.row2b && $scope.row4b !== undefined ||
                    $scope.row3b && $scope.row4b !== undefined) {
                    if ($scope.row1b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1b, $scope.row2b, $scope.row3b, $scope.row4b);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {
                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });


                    $scope.gantiPertanyaan3 = false;
                    $scope.gantiPertanyaan4 = true;
                }
            }
            $scope.changeRow3b = function() {
                if ($scope.row3b == $scope.row1b) $scope.row1b = undefined;
                if ($scope.row3b == $scope.row2b) $scope.row2b = undefined;
                if ($scope.row3b == $scope.row4b) $scope.row4b = undefined;

                if ($scope.row1b && $scope.row2b !== undefined ||
                    $scope.row1b && $scope.row3b !== undefined ||
                    $scope.row1b && $scope.row4b !== undefined ||
                    $scope.row2b && $scope.row3b !== undefined ||
                    $scope.row2b && $scope.row4b !== undefined ||
                    $scope.row3b && $scope.row4b !== undefined) {
  
                    if ($scope.row1b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1b, $scope.row2b, $scope.row3b, $scope.row4b);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {
                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });


                    $scope.gantiPertanyaan3 = false;
                    $scope.gantiPertanyaan4 = true;
                }
            }
            $scope.changeRow4b = function() {
                if ($scope.row4b == $scope.row1b) $scope.row1b = undefined;
                if ($scope.row4b == $scope.row2b) $scope.row2b = undefined;
                if ($scope.row4b == $scope.row3b) $scope.row3b = undefined;


                if ($scope.row1b && $scope.row2b !== undefined ||
                    $scope.row1b && $scope.row3b !== undefined ||
                    $scope.row1b && $scope.row4b !== undefined ||
                    $scope.row2b && $scope.row3b !== undefined ||
                    $scope.row2b && $scope.row4b !== undefined ||
                    $scope.row3b && $scope.row4b !== undefined) {

                    if ($scope.row1b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4b == "1") {
                        var data = { "noPertanyaan": "3", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4b == "2") {
                        var data = { "noPertanyaan": "3", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1b, $scope.row2b, $scope.row3b, $scope.row4b);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {
                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });
                    console.log($scope.answers);

                    $scope.gantiPertanyaan3 = false;
                    $scope.gantiPertanyaan4 = true;
                }
            }
            //#endregion
            //#region pertanyaan 4
            $scope.changeRow1c = function() {
                if ($scope.row1c == $scope.row2c) $scope.row2c = undefined;
                if ($scope.row1c == $scope.row3c) $scope.row3c = undefined;
                if ($scope.row1c == $scope.row4c) $scope.row4c = undefined;

                if ($scope.row1c && $scope.row2c !== undefined ||
                    $scope.row1c && $scope.row3c !== undefined ||
                    $scope.row1c && $scope.row4c !== undefined ||
                    $scope.row2c && $scope.row3c !== undefined ||
                    $scope.row2c && $scope.row4c !== undefined ||
                    $scope.row3c && $scope.row4c !== undefined) {

                    if ($scope.row1c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                  
                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1c, $scope.row2c, $scope.row3c, $scope.row4c);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan4 = false;
                    $scope.gantiPertanyaan5 = true;
                }
            }

            $scope.changeRow22c = function() {
                if ($scope.row2c == $scope.row1c) $scope.row1c = undefined;
                if ($scope.row2c == $scope.row3c) $scope.row3c = undefined;
                if ($scope.row2c == $scope.row4c) $scope.row4c = undefined;

                if ($scope.row1c && $scope.row2c !== undefined ||
                    $scope.row1c && $scope.row3c !== undefined ||
                    $scope.row1c && $scope.row4c !== undefined ||
                    $scope.row2c && $scope.row3c !== undefined ||
                    $scope.row2a && $scope.row4c !== undefined ||
                    $scope.row2c && $scope.row4c !== undefined ||
                    $scope.row3c && $scope.row4c !== undefined) {
       
                    if ($scope.row1c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }


                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1c, $scope.row2c, $scope.row3c, $scope.row4c);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan4 = false;
                    $scope.gantiPertanyaan5 = true;
                }
            }

            $scope.changeRow33c = function() {
                if ($scope.row3c == $scope.row1c) $scope.row1c = undefined;
                if ($scope.row3c == $scope.row2c) $scope.row2c = undefined;
                if ($scope.row3c == $scope.row4c) $scope.row4c = undefined;

                if ($scope.row1c && $scope.row2c !== undefined ||
                    $scope.row1c && $scope.row3c !== undefined ||
                    $scope.row1c && $scope.row4c !== undefined ||
                    $scope.row2c && $scope.row3c !== undefined ||
                    $scope.row2c && $scope.row4c !== undefined ||
                    $scope.row3c && $scope.row4c !== undefined) {
                    if ($scope.row1c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }


                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1c, $scope.row2c, $scope.row3c, $scope.row4c);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan4 = false;
                    $scope.gantiPertanyaan5 = true;
                  }
            }

           
            $scope.changeRow44c = function() {
                if ($scope.row4c == $scope.row1c) $scope.row1c = undefined;
                if ($scope.row4c == $scope.row2c) $scope.row2c = undefined;
                if ($scope.row4c == $scope.row3c) $scope.row3c = undefined;


                if ($scope.row1c && $scope.row2c !== undefined ||
                    $scope.row1c && $scope.row3c !== undefined ||
                    $scope.row1c && $scope.row4c !== undefined ||
                    $scope.row2c && $scope.row3c !== undefined ||
                    $scope.row2c && $scope.row4c !== undefined ||
                    $scope.row3c && $scope.row4c !== undefined) {


                    if ($scope.row1c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4c == "1") {
                        var data = { "noPertanyaan": "4", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4c == "2") {
                        var data = { "noPertanyaan": "4", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }


                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1c, $scope.row2c, $scope.row3c, $scope.row4c);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan4 = false;
                    $scope.gantiPertanyaan5 = true;
                }
            }
            //#endregion
            //#region pertanyaan 5
            $scope.changeRow1d = function() {
                if ($scope.row1d == $scope.row2d) $scope.row2d = undefined;
                if ($scope.row1d == $scope.row3d) $scope.row3d = undefined;
                if ($scope.row1d == $scope.row4d) $scope.row4d = undefined;

                if ($scope.row1d && $scope.row2d !== undefined ||
                    $scope.row1d && $scope.row3d !== undefined ||
                    $scope.row1d && $scope.row4d !== undefined ||
                    $scope.row2d && $scope.row3d !== undefined ||
                    $scope.row2d && $scope.row4d !== undefined ||
                    $scope.row3d && $scope.row4d !== undefined) {
                    if ($scope.row1d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }


                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1d, $scope.row2d, $scope.row3d, $scope.row4d);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });


                    $scope.gantiPertanyaan5 = false;
                    $scope.gantiPertanyaan6 = true;
                }
            }

            $scope.changeRow2d = function() {
                if ($scope.row2d == $scope.row1d) $scope.row1d = undefined;
                if ($scope.row2d == $scope.row3d) $scope.row3d = undefined;
                if ($scope.row2d == $scope.row4d) $scope.row4d = undefined;

                if ($scope.row1d && $scope.row2d !== undefined ||
                    $scope.row1d && $scope.row3d !== undefined ||
                    $scope.row1d && $scope.row4d !== undefined ||
                    $scope.row2d && $scope.row3d !== undefined ||
                    $scope.row2d && $scope.row4d !== undefined ||
                    $scope.row3d && $scope.row4d !== undefined) {
                    if ($scope.row1d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }


                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1d, $scope.row2d, $scope.row3d, $scope.row4d);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });


                    $scope.gantiPertanyaan5 = false;
                    $scope.gantiPertanyaan6 = true;
                }
            }
            $scope.changeRow3d = function() {
                if ($scope.row3d == $scope.row1d) $scope.row1d = undefined;
                if ($scope.row3d == $scope.row2d) $scope.row2d = undefined;
                if ($scope.row3d == $scope.row4d) $scope.row4d = undefined;

                if ($scope.row1d && $scope.row2d !== undefined ||
                    $scope.row1d && $scope.row3d !== undefined ||
                    $scope.row1d && $scope.row4d !== undefined ||
                    $scope.row2d && $scope.row3d !== undefined ||
                    $scope.row2d && $scope.row4d !== undefined ||
                    $scope.row3d && $scope.row4d !== undefined) {
                    if ($scope.row1d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }


                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1d, $scope.row2d, $scope.row3d, $scope.row4d);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });


                    $scope.gantiPertanyaan5 = false;
                    $scope.gantiPertanyaan6 = true;
                }
            }
            $scope.changeRow4d = function() {
                if ($scope.row4d == $scope.row1d) $scope.row1d = undefined;
                if ($scope.row4d == $scope.row2d) $scope.row2d = undefined;
                if ($scope.row4d == $scope.row3d) $scope.row3d = undefined;


                if ($scope.row1d && $scope.row2d !== undefined ||
                    $scope.row1d && $scope.row3d !== undefined ||
                    $scope.row1d && $scope.row4d !== undefined ||
                    $scope.row2d && $scope.row3d !== undefined ||
                    $scope.row2d && $scope.row4d !== undefined ||
                    $scope.row3d && $scope.row4d !== undefined) {
                    if ($scope.row1d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4d == "1") {
                        var data = { "noPertanyaan": "5", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4d == "2") {
                        var data = { "noPertanyaan": "5", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }


                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1d, $scope.row2d, $scope.row3d, $scope.row4d);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });


                    $scope.gantiPertanyaan5 = false;
                    $scope.gantiPertanyaan6 = true;
                }
            }
            //#endregion
            //#region pertanyaan 6
            $scope.changeRow1e = function() {
                if ($scope.row1e == $scope.row2e) $scope.row2e = undefined;
                if ($scope.row1e == $scope.row3e) $scope.row3e = undefined;
                if ($scope.row1e == $scope.row4e) $scope.row4e = undefined;

                if ($scope.row1e && $scope.row2e !== undefined ||
                    $scope.row1e && $scope.row3e !== undefined ||
                    $scope.row1e && $scope.row4e !== undefined ||
                    $scope.row2e && $scope.row3e !== undefined ||
                    $scope.row2e && $scope.row4e !== undefined ||
                    $scope.row3e && $scope.row4e !== undefined) {

                    if ($scope.row1e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1e, $scope.row2e, $scope.row3e, $scope.row4e);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan6 = false;
                    $scope.gantiPertanyaan7 = true;
                }
            }

            $scope.changeRow2e = function() {
                if ($scope.row2e == $scope.row1e) $scope.row1e = undefined;
                if ($scope.row2e == $scope.row3e) $scope.row3e = undefined;
                if ($scope.row2e == $scope.row4e) $scope.row4e = undefined;

                if ($scope.row1e && $scope.row2e !== undefined ||
                    $scope.row1e && $scope.row3e !== undefined ||
                    $scope.row1e && $scope.row4e !== undefined ||
                    $scope.row2e && $scope.row3e !== undefined ||
                    $scope.row2e && $scope.row4e !== undefined ||
                    $scope.row3e && $scope.row4e !== undefined) {

                    if ($scope.row1e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1e, $scope.row2e, $scope.row3e, $scope.row4e);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan6 = false;
                    $scope.gantiPertanyaan7 = true;
                }
            }

            $scope.changeRow3e = function() {
                if ($scope.row3e == $scope.row1e) $scope.row1e = undefined;
                if ($scope.row3e == $scope.row2e) $scope.row2e = undefined;
                if ($scope.row3e == $scope.row4e) $scope.row4e = undefined;

                if ($scope.row1e && $scope.row2e !== undefined ||
                    $scope.row1e && $scope.row3e !== undefined ||
                    $scope.row1e && $scope.row4e !== undefined ||
                    $scope.row2e && $scope.row3e !== undefined ||
                    $scope.row2e && $scope.row4e !== undefined ||
                    $scope.row3e && $scope.row4e !== undefined) {
                    if ($scope.row1e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1e, $scope.row2e, $scope.row3e, $scope.row4e);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan6 = false;
                    $scope.gantiPertanyaan7 = true;
                }
            }
            $scope.changeRow4e = function() {
                if ($scope.row4e == $scope.row1e) $scope.row1e = undefined;
                if ($scope.row4e == $scope.row2e) $scope.row2e = undefined;
                if ($scope.row4e == $scope.row3e) $scope.row3e = undefined;


                if ($scope.row1e && $scope.row2e !== undefined ||
                    $scope.row1e && $scope.row3e !== undefined ||
                    $scope.row1e && $scope.row4e !== undefined ||
                    $scope.row2e && $scope.row3e !== undefined ||
                    $scope.row2e && $scope.row4e !== undefined ||
                    $scope.row3e && $scope.row4e !== undefined) {
                    if ($scope.row1e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4e == "1") {
                        var data = { "noPertanyaan": "6", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4e == "2") {
                        var data = { "noPertanyaan": "6", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1e, $scope.row2e, $scope.row3e, $scope.row4e);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    console.log($scope.answers);
                    $scope.gantiPertanyaan6 = false;
                    $scope.gantiPertanyaan7 = true;
                }
            }
            //#endregion
            //#region pertanyaan 7
            $scope.changeRow1f = function() {
                if ($scope.row1f == $scope.row2f) $scope.row2f = undefined;
                if ($scope.row1f == $scope.row3f) $scope.row3f = undefined;
                if ($scope.row1f == $scope.row4f) $scope.row4f = undefined;

                if ($scope.row1f && $scope.row2f !== undefined ||
                    $scope.row1f && $scope.row3f !== undefined ||
                    $scope.row1f && $scope.row4f !== undefined ||
                    $scope.row2f && $scope.row3f !== undefined ||
                    $scope.row2f && $scope.row4f !== undefined ||
                    $scope.row3f && $scope.row4f !== undefined) {

                    if ($scope.row1f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1f, $scope.row2f, $scope.row3f, $scope.row4f);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan7 = false;
                    $scope.gantiPertanyaan8 = true;
                }
            }

            $scope.changeRow2f = function() {
                if ($scope.row2f == $scope.row1f) $scope.row1f = undefined;
                if ($scope.row2f == $scope.row3f) $scope.row3f = undefined;
                if ($scope.row2f == $scope.row4f) $scope.row4f = undefined;

                if ($scope.row1f && $scope.row2f !== undefined ||
                    $scope.row1f && $scope.row3f !== undefined ||
                    $scope.row1f && $scope.row4f !== undefined ||
                    $scope.row2f && $scope.row3f !== undefined ||
                    $scope.row2f && $scope.row4f !== undefined ||
                    $scope.row3f && $scope.row4f !== undefined) {

                    if ($scope.row1f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1f, $scope.row2f, $scope.row3f, $scope.row4f);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan7 = false;
                    $scope.gantiPertanyaan8 = true;
                }
            }

            $scope.changeRow3f = function() {
                if ($scope.row3f == $scope.row1f) $scope.row1f = undefined;
                if ($scope.row3f == $scope.row2f) $scope.row2f = undefined;
                if ($scope.row3f == $scope.row4f) $scope.row4f = undefined;

                if ($scope.row1f && $scope.row2f !== undefined ||
                    $scope.row1f && $scope.row3f !== undefined ||
                    $scope.row1f && $scope.row4f !== undefined ||
                    $scope.row2f && $scope.row3f !== undefined ||
                    $scope.row2f && $scope.row4f !== undefined ||
                    $scope.row3f && $scope.row4f !== undefined) {
                    if ($scope.row1f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1f, $scope.row2f, $scope.row3f, $scope.row4f);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan7 = false;
                    $scope.gantiPertanyaan8 = true;
                }
            }
            $scope.changeRow4f = function() {
                if ($scope.row4f == $scope.row1f) $scope.row1f = undefined;
                if ($scope.row4f == $scope.row2f) $scope.row2f = undefined;
                if ($scope.row4f == $scope.row3f) $scope.row3f = undefined;


                if ($scope.row1f && $scope.row2f !== undefined ||
                    $scope.row1f && $scope.row3f !== undefined ||
                    $scope.row1f && $scope.row4f !== undefined ||
                    $scope.row2f && $scope.row3f !== undefined ||
                    $scope.row2f && $scope.row4f !== undefined ||
                    $scope.row3f && $scope.row4f !== undefined) {
                    if ($scope.row1f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4f == "1") {
                        var data = { "noPertanyaan": "7", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4f == "2") {
                        var data = { "noPertanyaan": "7", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1f, $scope.row2f, $scope.row3f, $scope.row4f);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan7 = false;
                    $scope.gantiPertanyaan8 = true;
                }
            }
            //#endregion
            //#region pertanyaan 8
            $scope.changeRow1g = function() {
                if ($scope.row1g == $scope.row2g) $scope.row2g = undefined;
                if ($scope.row1g == $scope.row3g) $scope.row3g = undefined;
                if ($scope.row1g == $scope.row4g) $scope.row4g = undefined;

                if ($scope.row1g && $scope.row2g !== undefined ||
                    $scope.row1g && $scope.row3g !== undefined ||
                    $scope.row1g && $scope.row4g !== undefined ||
                    $scope.row2g && $scope.row3g !== undefined ||
                    $scope.row2g && $scope.row4g !== undefined ||
                    $scope.row3g && $scope.row4g !== undefined) {

                    if ($scope.row1g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1g, $scope.row2g, $scope.row3g, $scope.row4g);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar+= 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan8 = false;
                    $scope.gantiPertanyaan9 = true;
                }
            }

            $scope.changeRow2g = function() {
                if ($scope.row2g == $scope.row1g) $scope.row1g = undefined;
                if ($scope.row2g == $scope.row3g) $scope.row3g = undefined;
                if ($scope.row2g == $scope.row4g) $scope.row4g = undefined;

                if ($scope.row1g && $scope.row2g !== undefined ||
                    $scope.row1g && $scope.row3g !== undefined ||
                    $scope.row1g && $scope.row4g !== undefined ||
                    $scope.row2g && $scope.row3g !== undefined ||
                    $scope.row2g && $scope.row4g !== undefined ||
                    $scope.row3g && $scope.row4g !== undefined) {
                    if ($scope.row1g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1g, $scope.row2g, $scope.row3g, $scope.row4g);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan8 = false;
                    $scope.gantiPertanyaan9 = true;
                }
            }

            $scope.changeRow3g = function() {
                if ($scope.row3g == $scope.row1g) $scope.row1g = undefined;
                if ($scope.row3g == $scope.row2g) $scope.row2g = undefined;
                if ($scope.row3g == $scope.row4g) $scope.row4g = undefined;

                if ($scope.row1g && $scope.row2g !== undefined ||
                    $scope.row1g && $scope.row3g !== undefined ||
                    $scope.row1g && $scope.row4g !== undefined ||
                    $scope.row2g && $scope.row3g !== undefined ||
                    $scope.row2g && $scope.row4g !== undefined ||
                    $scope.row3g && $scope.row4g !== undefined) {
                    if ($scope.row1g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1g, $scope.row2g, $scope.row3g, $scope.row4g);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan8 = false;
                    $scope.gantiPertanyaan9 = true;
                }
            }
            $scope.changeRow4g = function() {
                if ($scope.row4g == $scope.row1g) $scope.row1g = undefined;
                if ($scope.row4g == $scope.row2g) $scope.row2g = undefined;
                if ($scope.row4g == $scope.row3g) $scope.row3g = undefined;


                if ($scope.row1g && $scope.row2g !== undefined ||
                    $scope.row1g && $scope.row3g !== undefined ||
                    $scope.row1g && $scope.row4g !== undefined ||
                    $scope.row2g && $scope.row3g !== undefined ||
                    $scope.row2g && $scope.row4g !== undefined ||
                    $scope.row3g && $scope.row4g !== undefined) {
                    if ($scope.row1g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4g == "1") {
                        var data = { "noPertanyaan": "8", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4g == "2") {
                        var data = { "noPertanyaan": "8", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1g, $scope.row2g, $scope.row3g, $scope.row4g);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan8 = false;
                    $scope.gantiPertanyaan9 = true;
                }
            }
            //#endregion
            //#region pertanyaan 9
            $scope.changeRow1h = function() {
                if ($scope.row1h == $scope.row2h) $scope.row2h = undefined;
                if ($scope.row1h == $scope.row3h) $scope.row3h = undefined;
                if ($scope.row1h == $scope.row4h) $scope.row4h = undefined;

                if ($scope.row1h && $scope.row2h !== undefined ||
                    $scope.row1h && $scope.row3h !== undefined ||
                    $scope.row1h && $scope.row4h !== undefined ||
                    $scope.row2h && $scope.row3h !== undefined ||
                    $scope.row2h && $scope.row4h !== undefined ||
                    $scope.row3h && $scope.row4h !== undefined) {

                    if ($scope.row1h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1h, $scope.row2h, $scope.row3h, $scope.row4h);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan9 = false;
                    $scope.gantiPertanyaan10 = true;
                }
            }

            $scope.changeRow2h = function() {
                if ($scope.row2h == $scope.row1h) $scope.row1h = undefined;
                if ($scope.row2h == $scope.row3h) $scope.row3h = undefined;
                if ($scope.row2h == $scope.row4h) $scope.row4h = undefined;

                if ($scope.row1h && $scope.row2h !== undefined ||
                    $scope.row1h && $scope.row3h !== undefined ||
                    $scope.row1h && $scope.row4h !== undefined ||
                    $scope.row2h && $scope.row3h !== undefined ||
                    $scope.row2h && $scope.row4h !== undefined ||
                    $scope.row3h && $scope.row4h !== undefined) {

                    if ($scope.row1h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1h, $scope.row2h, $scope.row3h, $scope.row4h);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan9 = false;
                    $scope.gantiPertanyaan10 = true;
                }
            }

            $scope.changeRow3h = function() {
                if ($scope.row3h == $scope.row1h) $scope.row1h = undefined;
                if ($scope.row3h == $scope.row2h) $scope.row2h = undefined;
                if ($scope.row3h == $scope.row4h) $scope.row4h = undefined;

                if ($scope.row1h && $scope.row2h !== undefined ||
                    $scope.row1h && $scope.row3h !== undefined ||
                    $scope.row1h && $scope.row4h !== undefined ||
                    $scope.row2h && $scope.row3h !== undefined ||
                    $scope.row2h && $scope.row4h !== undefined ||
                    $scope.row3h && $scope.row4h !== undefined) {

                    if ($scope.row1h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1h, $scope.row2h, $scope.row3h, $scope.row4h);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan9 = false;
                    $scope.gantiPertanyaan10 = true;
                }
            }
            $scope.changeRow4h = function() {
                if ($scope.row4h == $scope.row1h) $scope.row1h = undefined;
                if ($scope.row4h == $scope.row2h) $scope.row2h = undefined;
                if ($scope.row4h == $scope.row3h) $scope.row3h = undefined;


                if ($scope.row1h && $scope.row2h !== undefined ||
                    $scope.row1h && $scope.row3h !== undefined ||
                    $scope.row1h && $scope.row4h !== undefined ||
                    $scope.row2h && $scope.row3h !== undefined ||
                    $scope.row2h && $scope.row4h !== undefined ||
                    $scope.row3h && $scope.row4h !== undefined) {
                    if ($scope.row1h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4h == "1") {
                        var data = { "noPertanyaan": "9", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4h == "2") {
                        var data = { "noPertanyaan": "9", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1h, $scope.row2h, $scope.row3h, $scope.row4h);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    console.log($scope.answers);
                    $scope.gantiPertanyaan9 = false;
                    $scope.gantiPertanyaan10 = true;
                }
            }
            //#endregion
            //#region pertanyaan 10
            $scope.changeRow1i = function() {
                if ($scope.row1i == $scope.row2i) $scope.row2i = undefined;
                if ($scope.row1i == $scope.row3i) $scope.row3i = undefined;
                if ($scope.row1i == $scope.row4i) $scope.row4i = undefined;

                if ($scope.row1i && $scope.row2i !== undefined ||
                    $scope.row1i && $scope.row3i !== undefined ||
                    $scope.row1i && $scope.row4i !== undefined ||
                    $scope.row2i && $scope.row3i !== undefined ||
                    $scope.row2i && $scope.row4i !== undefined ||
                    $scope.row3i && $scope.row4i !== undefined) {

                    if ($scope.row1i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1i, $scope.row2i, $scope.row3i, $scope.row4i);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan10 = false;
                    $scope.gantiPertanyaan11 = true;
                }
            }

            $scope.changeRow2i = function() {
                if ($scope.row2i == $scope.row1i) $scope.row1i = undefined;
                if ($scope.row2i == $scope.row3i) $scope.row3i = undefined;
                if ($scope.row2i == $scope.row4i) $scope.row4i = undefined;

                if ($scope.row1i && $scope.row2i !== undefined ||
                    $scope.row1i && $scope.row3i !== undefined ||
                    $scope.row1i && $scope.row4i !== undefined ||
                    $scope.row2i && $scope.row3i !== undefined ||
                    $scope.row2i && $scope.row4i !== undefined ||
                    $scope.row3i && $scope.row4i !== undefined) {

                    if ($scope.row1i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1i, $scope.row2i, $scope.row3i, $scope.row4i);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan10 = false;
                    $scope.gantiPertanyaan11 = true;
                }
            }

            $scope.changeRow3i = function() {
                if ($scope.row3i == $scope.row1i) $scope.row1i = undefined;
                if ($scope.row3i == $scope.row2i) $scope.row2i = undefined;
                if ($scope.row3i == $scope.row4i) $scope.row4i = undefined;

                if ($scope.row1i && $scope.row2i !== undefined ||
                    $scope.row1i && $scope.row3i !== undefined ||
                    $scope.row1i && $scope.row4i !== undefined ||
                    $scope.row2i && $scope.row3i !== undefined ||
                    $scope.row2i && $scope.row4i !== undefined ||
                    $scope.row3i && $scope.row4i !== undefined) {

                    if ($scope.row1i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1i, $scope.row2i, $scope.row3i, $scope.row4i);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan10 = false;
                    $scope.gantiPertanyaan11 = true;
                }
            }
            $scope.changeRow4i = function() {
                if ($scope.row4i == $scope.row1i) $scope.row1i = undefined;
                if ($scope.row4i == $scope.row2i) $scope.row2i = undefined;
                if ($scope.row4i == $scope.row3i) $scope.row3i = undefined;


                if ($scope.row1i && $scope.row2i !== undefined ||
                    $scope.row1i && $scope.row3i !== undefined ||
                    $scope.row1i && $scope.row4i !== undefined ||
                    $scope.row2i && $scope.row3i !== undefined ||
                    $scope.row2i && $scope.row4i !== undefined ||
                    $scope.row3i && $scope.row4i !== undefined) {

                    if ($scope.row1i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4i == "1") {
                        var data = { "noPertanyaan": "10", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4i == "2") {
                        var data = { "noPertanyaan": "10", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1i, $scope.row2i, $scope.row3i, $scope.row4i);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan10 = false;
                    $scope.gantiPertanyaan11 = true;
                }
            }
            //#endregion
            //#region pertanyaan 11
            $scope.changeRow1j = function() {
                if ($scope.row1j == $scope.row2j) $scope.row2j = undefined;
                if ($scope.row1j == $scope.row3j) $scope.row3j = undefined;
                if ($scope.row1j == $scope.row4j) $scope.row4j = undefined;

                if ($scope.row1j && $scope.row2j !== undefined ||
                    $scope.row1j && $scope.row3j !== undefined ||
                    $scope.row1j && $scope.row4j !== undefined ||
                    $scope.row2j && $scope.row3j !== undefined ||
                    $scope.row2j && $scope.row4j !== undefined ||
                    $scope.row3j && $scope.row4j !== undefined) {
             
                    if ($scope.row1j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1j, $scope.row2j, $scope.row3j, $scope.row4j);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan11 = false;
                    $scope.gantiPertanyaan12 = true;
                }
            }

            $scope.changeRow2j = function() {
                if ($scope.row2j == $scope.row1j) $scope.row1j = undefined;
                if ($scope.row2j == $scope.row3j) $scope.row3j = undefined;
                if ($scope.row2j == $scope.row4j) $scope.row4j = undefined;

                if ($scope.row1j && $scope.row2j !== undefined ||
                    $scope.row1j && $scope.row3j !== undefined ||
                    $scope.row1j && $scope.row4j !== undefined ||
                    $scope.row2j && $scope.row3j !== undefined ||
                    $scope.row2j && $scope.row4j !== undefined ||
                    $scope.row3j && $scope.row4j !== undefined) {

                    if ($scope.row1j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1j, $scope.row2j, $scope.row3j, $scope.row4j);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan11 = false;
                    $scope.gantiPertanyaan12 = true;
                }
            }

            $scope.changeRow3j = function() {
                if ($scope.row3j == $scope.row1j) $scope.row1j = undefined;
                if ($scope.row3j == $scope.row2j) $scope.row2j = undefined;
                if ($scope.row3j == $scope.row4j) $scope.row4j = undefined;

                if ($scope.row1j && $scope.row2j !== undefined ||
                    $scope.row1j && $scope.row3j !== undefined ||
                    $scope.row1j && $scope.row4j !== undefined ||
                    $scope.row2j && $scope.row3j !== undefined ||
                    $scope.row2j && $scope.row4j !== undefined ||
                    $scope.row3j && $scope.row4j !== undefined) {
                    if ($scope.row1j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1j, $scope.row2j, $scope.row3j, $scope.row4j);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan11 = false;
                    $scope.gantiPertanyaan12 = true;
                }
            }
            $scope.changeRow4j = function() {
                if ($scope.row4j == $scope.row1j) $scope.row1j = undefined;
                if ($scope.row4j == $scope.row2j) $scope.row2j = undefined;
                if ($scope.row4j == $scope.row3j) $scope.row3j = undefined;


                if ($scope.row1j && $scope.row2j !== undefined ||
                    $scope.row1j && $scope.row3j !== undefined ||
                    $scope.row1j && $scope.row4j !== undefined ||
                    $scope.row2j && $scope.row3j !== undefined ||
                    $scope.row2j && $scope.row4j !== undefined ||
                    $scope.row3j && $scope.row4j !== undefined) {
                    if ($scope.row1j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4j == "1") {
                        var data = { "noPertanyaan": "11", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4j == "2") {
                        var data = { "noPertanyaan": "11", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1j, $scope.row2j, $scope.row3j, $scope.row4j);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan11 = false;
                    $scope.gantiPertanyaan12 = true;
                }
            }
            //#endregion
            //#region pertanyaan 12
            $scope.changeRow1k = function() {
                if ($scope.row1k == $scope.row2k) $scope.row2k = undefined;
                if ($scope.row1k == $scope.row3k) $scope.row3k = undefined;
                if ($scope.row1k == $scope.row4k) $scope.row4k = undefined;

                if ($scope.row1k && $scope.row2k !== undefined ||
                    $scope.row1k && $scope.row3k !== undefined ||
                    $scope.row1k && $scope.row4k !== undefined ||
                    $scope.row2k && $scope.row3k !== undefined ||
                    $scope.row2k && $scope.row4k !== undefined ||
                    $scope.row3k && $scope.row4k !== undefined) {

                    if ($scope.row1k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
  
                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1k, $scope.row2k, $scope.row3k, $scope.row4k);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan12 = false;
                    $scope.gantiPertanyaan13 = true;
                }
            }

            $scope.changeRow2k = function() {
                if ($scope.row2k == $scope.row1k) $scope.row1k = undefined;
                if ($scope.row2k == $scope.row3k) $scope.row3k = undefined;
                if ($scope.row2k == $scope.row4k) $scope.row4k = undefined;

                if ($scope.row1k && $scope.row2k !== undefined ||
                    $scope.row1k && $scope.row3k !== undefined ||
                    $scope.row1k && $scope.row4k !== undefined ||
                    $scope.row2k && $scope.row3k !== undefined ||
                    $scope.row2k && $scope.row4k !== undefined ||
                    $scope.row3k && $scope.row4k !== undefined) {
                    if ($scope.row1k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1k, $scope.row2k, $scope.row3k, $scope.row4k);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan12 = false;
                    $scope.gantiPertanyaan13 = true;
                }
            }

            $scope.changeRow3k = function() {
                if ($scope.row3k == $scope.row1k) $scope.row1k = undefined;
                if ($scope.row3k == $scope.row2k) $scope.row2k = undefined;
                if ($scope.row3k == $scope.row4k) $scope.row4k = undefined;

                if ($scope.row1k && $scope.row2k !== undefined ||
                    $scope.row1k && $scope.row3k !== undefined ||
                    $scope.row1k && $scope.row4k !== undefined ||
                    $scope.row2k && $scope.row3k !== undefined ||
                    $scope.row2k && $scope.row4k !== undefined ||
                    $scope.row3k && $scope.row4k !== undefined) {
                    if ($scope.row1k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1k, $scope.row2k, $scope.row3k, $scope.row4k);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan12 = false;
                    $scope.gantiPertanyaan13 = true;
                }
            }
            $scope.changeRow4k = function() {
                if ($scope.row4k == $scope.row1k) $scope.row1k = undefined;
                if ($scope.row4k == $scope.row2k) $scope.row2k = undefined;
                if ($scope.row4k == $scope.row3k) $scope.row3k = undefined;


                if ($scope.row1k && $scope.row2k !== undefined ||
                    $scope.row1k && $scope.row3k !== undefined ||
                    $scope.row1k && $scope.row4k !== undefined ||
                    $scope.row2k && $scope.row3k !== undefined ||
                    $scope.row2k && $scope.row4k !== undefined ||
                    $scope.row3k && $scope.row4k !== undefined) {
                    if ($scope.row1k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4k == "1") {
                        var data = { "noPertanyaan": "12", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4k == "2") {
                        var data = { "noPertanyaan": "12", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1k, $scope.row2k, $scope.row3k, $scope.row4k);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });
                    console.log($scope.answers);
                    $scope.gantiPertanyaan12 = false;
                    $scope.gantiPertanyaan13 = true;
                }
            }
            //#endregion
            //#region pertanyaan 13
            $scope.changeRow1l = function() {
                if ($scope.row1l == $scope.row2l) $scope.row2l = undefined;
                if ($scope.row1l == $scope.row3l) $scope.row3l = undefined;
                if ($scope.row1l == $scope.row4l) $scope.row4l = undefined;

                if ($scope.row1l && $scope.row2l !== undefined ||
                    $scope.row1l && $scope.row3l !== undefined ||
                    $scope.row1l && $scope.row4l !== undefined ||
                    $scope.row2l && $scope.row3l !== undefined ||
                    $scope.row2l && $scope.row4l !== undefined ||
                    $scope.row3l && $scope.row4l !== undefined) {

                    if ($scope.row1l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1l, $scope.row2l, $scope.row3l, $scope.row4l);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan13 = false;
                    $scope.gantiPertanyaan14 = true;
                }
            }

            $scope.changeRow2l = function() {
                if ($scope.row2l == $scope.row1l) $scope.row1l = undefined;
                if ($scope.row2l == $scope.row3l) $scope.row3l = undefined;
                if ($scope.row2l == $scope.row4l) $scope.row4l = undefined;

                if ($scope.row1l && $scope.row2l !== undefined ||
                    $scope.row1l && $scope.row3l !== undefined ||
                    $scope.row1l && $scope.row4l !== undefined ||
                    $scope.row2l && $scope.row3l !== undefined ||
                    $scope.row2l && $scope.row4l !== undefined ||
                    $scope.row3l && $scope.row4l !== undefined) {
                    if ($scope.row1l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1l, $scope.row2l, $scope.row3l, $scope.row4l);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan13 = false;
                    $scope.gantiPertanyaan14 = true;
    }
            }

            $scope.changeRow3l = function() {
                if ($scope.row3l == $scope.row1l) $scope.row1l = undefined;
                if ($scope.row3l == $scope.row2l) $scope.row2l = undefined;
                if ($scope.row3l == $scope.row4l) $scope.row4l = undefined;

                if ($scope.row1l && $scope.row2l !== undefined ||
                    $scope.row1l && $scope.row3l !== undefined ||
                    $scope.row1l && $scope.row4l !== undefined ||
                    $scope.row2l && $scope.row3l !== undefined ||
                    $scope.row2l && $scope.row4l !== undefined ||
                    $scope.row3l && $scope.row4l !== undefined) {
                    if ($scope.row1l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1l, $scope.row2l, $scope.row3l, $scope.row4l);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan13 = false;
                    $scope.gantiPertanyaan14 = true;
                    
                }
            }
            $scope.changeRow4l = function() {
                if ($scope.row4l == $scope.row1l) $scope.row1l = undefined;
                if ($scope.row4l == $scope.row2l) $scope.row2l = undefined;
                if ($scope.row4l == $scope.row3l) $scope.row3l = undefined;


                if ($scope.row1l && $scope.row2l !== undefined ||
                    $scope.row1l && $scope.row3l !== undefined ||
                    $scope.row1l && $scope.row4l !== undefined ||
                    $scope.row2l && $scope.row3l !== undefined ||
                    $scope.row2l && $scope.row4l !== undefined ||
                    $scope.row3l && $scope.row4l !== undefined) {
                    if ($scope.row1l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4l == "1") {
                        var data = { "noPertanyaan": "13", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4l == "2") {
                        var data = { "noPertanyaan": "13", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1l, $scope.row2l, $scope.row3l, $scope.row4l);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan13 = false;
                    $scope.gantiPertanyaan14 = true;
                }
            }
            //#endregion
            //#region pertanyaan 14
            $scope.changeRow1m = function() {
                if ($scope.row1m == $scope.row2m) $scope.row2m = undefined;
                if ($scope.row1m == $scope.row3m) $scope.row3m = undefined;
                if ($scope.row1m == $scope.row4m) $scope.row4m = undefined;

                if ($scope.row1m && $scope.row2m !== undefined ||
                    $scope.row1m && $scope.row3m !== undefined ||
                    $scope.row1m && $scope.row4m !== undefined ||
                    $scope.row2m && $scope.row3m !== undefined ||
                    $scope.row2m && $scope.row4m !== undefined ||
                    $scope.row3m && $scope.row4m !== undefined) {

                    if ($scope.row1m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1m, $scope.row2m, $scope.row3m, $scope.row4m);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan14 = false;
                    $scope.gantiPertanyaan15 = true;
                }
            }

            $scope.changeRow2m = function() {
                if ($scope.row2m == $scope.row1m) $scope.row1m = undefined;
                if ($scope.row2m == $scope.row3m) $scope.row3m = undefined;
                if ($scope.row2m == $scope.row4m) $scope.row4m = undefined;

                if ($scope.row1m && $scope.row2m !== undefined ||
                    $scope.row1m && $scope.row3m !== undefined ||
                    $scope.row1m && $scope.row4m !== undefined ||
                    $scope.row2m && $scope.row3m !== undefined ||
                    $scope.row2m && $scope.row4m !== undefined ||
                    $scope.row3m && $scope.row4m !== undefined) {
                    if ($scope.row1m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1m, $scope.row2m, $scope.row3m, $scope.row4m);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan14 = false;
                    $scope.gantiPertanyaan15 = true;
   
                }
            }

            $scope.changeRow3m = function() {
                if ($scope.row3m == $scope.row1m) $scope.row1m = undefined;
                if ($scope.row3m == $scope.row2m) $scope.row2m = undefined;
                if ($scope.row3m == $scope.row4m) $scope.row4m = undefined;

                if ($scope.row1m && $scope.row2m !== undefined ||
                    $scope.row1m && $scope.row3m !== undefined ||
                    $scope.row1m && $scope.row4m !== undefined ||
                    $scope.row2m && $scope.row3m !== undefined ||
                    $scope.row2m && $scope.row4m !== undefined ||
                    $scope.row3m && $scope.row4m !== undefined) {
                    if ($scope.row1m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1m, $scope.row2m, $scope.row3m, $scope.row4m);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan14 = false;
                    $scope.gantiPertanyaan15 = true;
                }
            }
            $scope.changeRow4m = function() {
                if ($scope.row4m == $scope.row1m) $scope.row1m = undefined;
                if ($scope.row4m == $scope.row2m) $scope.row2m = undefined;
                if ($scope.row4m == $scope.row3m) $scope.row3m = undefined;


                if ($scope.row1m && $scope.row2m !== undefined ||
                    $scope.row1m && $scope.row3m !== undefined ||
                    $scope.row1m && $scope.row4m !== undefined ||
                    $scope.row2m && $scope.row3m !== undefined ||
                    $scope.row2m && $scope.row4m !== undefined ||
                    $scope.row3m && $scope.row4m !== undefined) {
                    if ($scope.row1m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4m == "1") {
                        var data = { "noPertanyaan": "14", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4m == "2") {
                        var data = { "noPertanyaan": "14", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1m, $scope.row2m, $scope.row3m, $scope.row4m);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan14 = false;
                    $scope.gantiPertanyaan15 = true;
                    }
            }
            //#endregion
            //#region pertanyaan 15
            $scope.changeRow1n = function() {
                if ($scope.row1n == $scope.row2n) $scope.row2n = undefined;
                if ($scope.row1n == $scope.row3n) $scope.row3n = undefined;
                if ($scope.row1n == $scope.row4n) $scope.row4n = undefined;

                if ($scope.row1n && $scope.row2n !== undefined ||
                    $scope.row1n && $scope.row3n !== undefined ||
                    $scope.row1n && $scope.row4n !== undefined ||
                    $scope.row2n && $scope.row3n !== undefined ||
                    $scope.row2n && $scope.row4n !== undefined ||
                    $scope.row3n && $scope.row4n !== undefined) {

                    if ($scope.row1n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    
                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1n, $scope.row2n, $scope.row3n, $scope.row4n);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan15 = false;
                    $scope.gantiPertanyaan16 = true;
                }
            }

            $scope.changeRow2n = function() {
                if ($scope.row2n == $scope.row1n) $scope.row1n = undefined;
                if ($scope.row2n == $scope.row3n) $scope.row3n = undefined;
                if ($scope.row2n == $scope.row4n) $scope.row4n = undefined;

                if ($scope.row1n && $scope.row2n !== undefined ||
                    $scope.row1n && $scope.row3n !== undefined ||
                    $scope.row1n && $scope.row4n !== undefined ||
                    $scope.row2n && $scope.row3n !== undefined ||
                    $scope.row2n && $scope.row4n !== undefined ||
                    $scope.row3n && $scope.row4n !== undefined) {
                    if ($scope.row1n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1n, $scope.row2n, $scope.row3n, $scope.row4n);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan15 = false;
                    $scope.gantiPertanyaan16 = true;
                }
            }

            $scope.changeRow3n = function() {
                if ($scope.row3n == $scope.row1n) $scope.row1n = undefined;
                if ($scope.row3n == $scope.row2n) $scope.row2n = undefined;
                if ($scope.row3n == $scope.row4n) $scope.row4n = undefined;

                if ($scope.row1n && $scope.row2n !== undefined ||
                    $scope.row1n && $scope.row3n !== undefined ||
                    $scope.row1n && $scope.row4n !== undefined ||
                    $scope.row2n && $scope.row3n !== undefined ||
                    $scope.row2n && $scope.row4n !== undefined ||
                    $scope.row3n && $scope.row4n !== undefined) {
                    if ($scope.row1n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1n, $scope.row2n, $scope.row3n, $scope.row4n);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan15 = false;
                    $scope.gantiPertanyaan16 = true;
                }
            }
            $scope.changeRow4n = function() {
                if ($scope.row4n == $scope.row1n) $scope.row1n = undefined;
                if ($scope.row4n == $scope.row2n) $scope.row2n = undefined;
                if ($scope.row4n == $scope.row3n) $scope.row3n = undefined;


                if ($scope.row1n && $scope.row2n !== undefined ||
                    $scope.row1n && $scope.row3n !== undefined ||
                    $scope.row1n && $scope.row4n !== undefined ||
                    $scope.row2n && $scope.row3n !== undefined ||
                    $scope.row2n && $scope.row4n !== undefined ||
                    $scope.row3n && $scope.row4n !== undefined) {
                    if ($scope.row1n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4n == "1") {
                        var data = { "noPertanyaan": "15", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4n == "2") {
                        var data = { "noPertanyaan": "15", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1n, $scope.row2n, $scope.row3n, $scope.row4n);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });
                    console.log($scope.answers);
                    $scope.gantiPertanyaan15 = false;
                    $scope.gantiPertanyaan16 = true;
                }
            }
            //#endregion
            //#region pertanyaan 16
            $scope.changeRow1o = function() {
                if ($scope.row1o == $scope.row2o) $scope.row2o = undefined;
                if ($scope.row1o == $scope.row3o) $scope.row3o = undefined;
                if ($scope.row1o == $scope.row4o) $scope.row4o = undefined;

                if ($scope.row1o && $scope.row2o !== undefined ||
                    $scope.row1o && $scope.row3o !== undefined ||
                    $scope.row1o && $scope.row4o !== undefined ||
                    $scope.row2o && $scope.row3o !== undefined ||
                    $scope.row2o && $scope.row4o !== undefined ||
                    $scope.row3o && $scope.row4o !== undefined) {

                    if ($scope.row1o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1o, $scope.row2o, $scope.row3o, $scope.row4o);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan16 = false;
                    $scope.gantiPertanyaan17 = true;
                }
            }

            $scope.changeRow2o = function() {
                if ($scope.row2o == $scope.row1o) $scope.row1o = undefined;
                if ($scope.row2o == $scope.row3o) $scope.row3o = undefined;
                if ($scope.row2o == $scope.row4o) $scope.row4o = undefined;

                if ($scope.row1o && $scope.row2o !== undefined ||
                    $scope.row1o && $scope.row3o !== undefined ||
                    $scope.row1o && $scope.row4o !== undefined ||
                    $scope.row2o && $scope.row3o !== undefined ||
                    $scope.row2o && $scope.row4o !== undefined ||
                    $scope.row3o && $scope.row4o !== undefined) {
                    if ($scope.row1o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1o, $scope.row2o, $scope.row3o, $scope.row4o);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan16 = false;
                    $scope.gantiPertanyaan17 = true;
                }
            }

            $scope.changeRow3o = function() {
                if ($scope.row3o == $scope.row1o) $scope.row1o = undefined;
                if ($scope.row3o == $scope.row2o) $scope.row2o = undefined;
                if ($scope.row3o == $scope.row4o) $scope.row4o = undefined;

                if ($scope.row1o && $scope.row2o !== undefined ||
                    $scope.row1o && $scope.row3o !== undefined ||
                    $scope.row1o && $scope.row4o !== undefined ||
                    $scope.row2o && $scope.row3o !== undefined ||
                    $scope.row2o && $scope.row4o !== undefined ||
                    $scope.row3o && $scope.row4o !== undefined) {
                    if ($scope.row1o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1o, $scope.row2o, $scope.row3o, $scope.row4o);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan16 = false;
                    $scope.gantiPertanyaan17 = true;
                }
            }
            $scope.changeRow4o = function() {
                if ($scope.row4o == $scope.row1o) $scope.row1o = undefined;
                if ($scope.row4o == $scope.row2o) $scope.row2o = undefined;
                if ($scope.row4o == $scope.row3o) $scope.row3o = undefined;


                if ($scope.row1o && $scope.row2o !== undefined ||
                    $scope.row1o && $scope.row3o !== undefined ||
                    $scope.row1o && $scope.row4o !== undefined ||
                    $scope.row2o && $scope.row3o !== undefined ||
                    $scope.row2o && $scope.row4o !== undefined ||
                    $scope.row3o && $scope.row4o !== undefined) {
                    if ($scope.row1o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4o == "1") {
                        var data = { "noPertanyaan": "16", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4o == "2") {
                        var data = { "noPertanyaan": "16", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1o, $scope.row2o, $scope.row3o, $scope.row4o);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan16 = false;
                    $scope.gantiPertanyaan17 = true;
                }
            }
            //#endregion
            //#region pertanyaan 17
            $scope.changeRow1p = function() {
                if ($scope.row1p == $scope.row2p) $scope.row2p = undefined;
                if ($scope.row1p == $scope.row3p) $scope.row3p = undefined;
                if ($scope.row1p == $scope.row4p) $scope.row4p = undefined;

                if ($scope.row1p && $scope.row2p !== undefined ||
                    $scope.row1p && $scope.row3p !== undefined ||
                    $scope.row1p && $scope.row4p !== undefined ||
                    $scope.row2p && $scope.row3p !== undefined ||
                    $scope.row2p && $scope.row4p !== undefined ||
                    $scope.row3p && $scope.row4p !== undefined) {

                    if ($scope.row1p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    
                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1p, $scope.row2p, $scope.row3p, $scope.row4p);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan17 = false;
                    $scope.gantiPertanyaan18 = true;
                }
            }

            $scope.changeRow2p = function() {
                if ($scope.row2p == $scope.row1p) $scope.row1p = undefined;
                if ($scope.row2p == $scope.row3p) $scope.row3p = undefined;
                if ($scope.row2p == $scope.row4p) $scope.row4p = undefined;

                if ($scope.row1p && $scope.row2p !== undefined ||
                    $scope.row1p && $scope.row3p !== undefined ||
                    $scope.row1p && $scope.row4p !== undefined ||
                    $scope.row2p && $scope.row3p !== undefined ||
                    $scope.row2p && $scope.row4p !== undefined ||
                    $scope.row3p && $scope.row4p !== undefined) {

                    if ($scope.row1p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1p, $scope.row2p, $scope.row3p, $scope.row4p);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan17 = false;
                    $scope.gantiPertanyaan18 = true;
                }
            }

            $scope.changeRow3p = function() {
                if ($scope.row3p == $scope.row1p) $scope.row1p = undefined;
                if ($scope.row3p == $scope.row2p) $scope.row2p = undefined;
                if ($scope.row3p == $scope.row4p) $scope.row4p = undefined;

                if ($scope.row1p && $scope.row2p !== undefined ||
                    $scope.row1p && $scope.row3p !== undefined ||
                    $scope.row1p && $scope.row4p !== undefined ||
                    $scope.row2p && $scope.row3p !== undefined ||
                    $scope.row2p && $scope.row4p !== undefined ||
                    $scope.row3p && $scope.row4p !== undefined) {
                    
                    if ($scope.row1p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1p, $scope.row2p, $scope.row3p, $scope.row4p);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan17 = false;
                    $scope.gantiPertanyaan18 = true;
                }
            }
            $scope.changeRow4p = function() {
                if ($scope.row4p == $scope.row1p) $scope.row1p = undefined;
                if ($scope.row4p == $scope.row2p) $scope.row2p = undefined;
                if ($scope.row4p == $scope.row3p) $scope.row3p = undefined;


                if ($scope.row1p && $scope.row2p !== undefined ||
                    $scope.row1p && $scope.row3p !== undefined ||
                    $scope.row1p && $scope.row4p !== undefined ||
                    $scope.row2p && $scope.row3p !== undefined ||
                    $scope.row2p && $scope.row4p !== undefined ||
                    $scope.row3p && $scope.row4p !== undefined) {
                    if ($scope.row1p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4p == "1") {
                        var data = { "noPertanyaan": "17", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4p == "2") {
                        var data = { "noPertanyaan": "17", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1p, $scope.row2p, $scope.row3p, $scope.row4p);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan17 = false;
                    $scope.gantiPertanyaan18 = true;
            }
            }
            //#endregion
            //#region pertanyaan 18
            $scope.changeRow1q = function() {
                if ($scope.row1q == $scope.row2q) $scope.row2q = undefined;
                if ($scope.row1q == $scope.row3q) $scope.row3q = undefined;
                if ($scope.row1q == $scope.row4q) $scope.row4q = undefined;

                if ($scope.row1q && $scope.row2q !== undefined ||
                    $scope.row1q && $scope.row3q !== undefined ||
                    $scope.row1q && $scope.row4q !== undefined ||
                    $scope.row2q && $scope.row3q !== undefined ||
                    $scope.row2q && $scope.row4q !== undefined ||
                    $scope.row3q && $scope.row4q !== undefined) {
                   
                    if ($scope.row1q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1q, $scope.row2q, $scope.row3q, $scope.row4q);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });
                    
                    $scope.gantiPertanyaan18 = false;
                    $scope.gantiPertanyaan19 = true;
                }
            }

            $scope.changeRow2q = function() {
                if ($scope.row2q == $scope.row1q) $scope.row1q = undefined;
                if ($scope.row2q == $scope.row3q) $scope.row3q = undefined;
                if ($scope.row2q == $scope.row4q) $scope.row4q = undefined;

                if ($scope.row1q && $scope.row2q !== undefined ||
                    $scope.row1q && $scope.row3q !== undefined ||
                    $scope.row1q && $scope.row4q !== undefined ||
                    $scope.row2q && $scope.row3q !== undefined ||
                    $scope.row2q && $scope.row4q !== undefined ||
                    $scope.row3q && $scope.row4q !== undefined) {
                    if ($scope.row1q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1q, $scope.row2q, $scope.row3q, $scope.row4q);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan18 = false;
                    $scope.gantiPertanyaan19 = true;
                }
            }

            $scope.changeRow3q = function() {
                if ($scope.row3q == $scope.row1q) $scope.row1q = undefined;
                if ($scope.row3q == $scope.row2q) $scope.row2q = undefined;
                if ($scope.row3q == $scope.row4q) $scope.row4q = undefined;

                if ($scope.row1q && $scope.row2q !== undefined ||
                    $scope.row1q && $scope.row3q !== undefined ||
                    $scope.row1q && $scope.row4q !== undefined ||
                    $scope.row2q && $scope.row3q !== undefined ||
                    $scope.row2q && $scope.row4q !== undefined ||
                    $scope.row3q && $scope.row4q !== undefined) {
                    if ($scope.row1q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1q, $scope.row2q, $scope.row3q, $scope.row4q);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan18 = false;
                    $scope.gantiPertanyaan19 = true;
                }
            }
            $scope.changeRow4q = function() {
                if ($scope.row4q == $scope.row1q) $scope.row1q = undefined;
                if ($scope.row4q == $scope.row2q) $scope.row2q = undefined;
                if ($scope.row4q == $scope.row3q) $scope.row3q = undefined;


                if ($scope.row1q && $scope.row2q !== undefined ||
                    $scope.row1q && $scope.row3q !== undefined ||
                    $scope.row1q && $scope.row4q !== undefined ||
                    $scope.row2q && $scope.row3q !== undefined ||
                    $scope.row2q && $scope.row4q !== undefined ||
                    $scope.row3q && $scope.row4q !== undefined) {
                    if ($scope.row1q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4q == "1") {
                        var data = { "noPertanyaan": "18", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4q == "2") {
                        var data = { "noPertanyaan": "18", "Row": "4", "Value": "2" };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1q, $scope.row2q, $scope.row3q, $scope.row4q);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan18 = false;
                    $scope.gantiPertanyaan19 = true;
                }
            }
            //#endregion
            //#region pertanyaan 19
            $scope.changeRow1r = function() {
                if ($scope.row1r == $scope.row2r) $scope.row2r = undefined;
                if ($scope.row1r == $scope.row3r) $scope.row3r = undefined;
                if ($scope.row1r == $scope.row4r) $scope.row4r = undefined;

                if ($scope.row1r && $scope.row2r !== undefined ||
                    $scope.row1r && $scope.row3r !== undefined ||
                    $scope.row1r && $scope.row4r !== undefined ||
                    $scope.row2r && $scope.row3r !== undefined ||
                    $scope.row2r && $scope.row4r !== undefined ||
                    $scope.row3r && $scope.row4r !== undefined) {

                    if ($scope.row1r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    
                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1r, $scope.row2r, $scope.row3r, $scope.row4r);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan19 = false;
                    $scope.gantiPertanyaan20 = true;
                }
            }

            $scope.changeRow2r = function() {
                if ($scope.row2r == $scope.row1r) $scope.row1r = undefined;
                if ($scope.row2r == $scope.row3r) $scope.row3r = undefined;
                if ($scope.row2r == $scope.row4r) $scope.row4r = undefined;

                if ($scope.row1r && $scope.row2r !== undefined ||
                    $scope.row1r && $scope.row3r !== undefined ||
                    $scope.row1r && $scope.row4r !== undefined ||
                    $scope.row2r && $scope.row3r !== undefined ||
                    $scope.row2r && $scope.row4r !== undefined ||
                    $scope.row3r && $scope.row4r !== undefined) {
                    if ($scope.row1r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1r, $scope.row2r, $scope.row3r, $scope.row4r);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan19 = false;
                    $scope.gantiPertanyaan20 = true;
                }
            }

            $scope.changeRow3r = function() {
                if ($scope.row3r == $scope.row1r) $scope.row1r = undefined;
                if ($scope.row3r == $scope.row2r) $scope.row2r = undefined;
                if ($scope.row3r == $scope.row4r) $scope.row4r = undefined;

                if ($scope.row1r && $scope.row2r !== undefined ||
                    $scope.row1r && $scope.row3r !== undefined ||
                    $scope.row1r && $scope.row4r !== undefined ||
                    $scope.row2r && $scope.row3r !== undefined ||
                    $scope.row2r && $scope.row4r !== undefined ||
                    $scope.row3r && $scope.row4r !== undefined) {
                    if ($scope.row1r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1r, $scope.row2r, $scope.row3r, $scope.row4r);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan19 = false;
                    $scope.gantiPertanyaan20 = true;
                }
            }
            $scope.changeRow4r = function() {
                if ($scope.row4r == $scope.row1r) $scope.row1r = undefined;
                if ($scope.row4r == $scope.row2r) $scope.row2r = undefined;
                if ($scope.row4r == $scope.row3r) $scope.row3r = undefined;


                if ($scope.row1r && $scope.row2r !== undefined ||
                    $scope.row1r && $scope.row3r !== undefined ||
                    $scope.row1r && $scope.row4r !== undefined ||
                    $scope.row2r && $scope.row3r !== undefined ||
                    $scope.row2r && $scope.row4r !== undefined ||
                    $scope.row3r && $scope.row4r !== undefined) {
                    if ($scope.row1r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4r == "1") {
                        var data = { "noPertanyaan": "19", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4r == "2") {
                        var data = { "noPertanyaan": "19", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1r, $scope.row2r, $scope.row3r, $scope.row4r);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan19 = false;
                    $scope.gantiPertanyaan20 = true;
                }
            }
            //#endregion
            //#region pertanyaan 20
            $scope.changeRow1s = function() {
                if ($scope.row1s == $scope.row2s) $scope.row2s = undefined;
                if ($scope.row1s == $scope.row3s) $scope.row3s = undefined;
                if ($scope.row1s == $scope.row4s) $scope.row4s = undefined;

                if ($scope.row1s && $scope.row2s !== undefined ||
                    $scope.row1s && $scope.row3s !== undefined ||
                    $scope.row1s && $scope.row4s !== undefined ||
                    $scope.row2s && $scope.row3s !== undefined ||
                    $scope.row2s && $scope.row4s !== undefined ||
                    $scope.row3s && $scope.row4s !== undefined) {

                    if ($scope.row1s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    
                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1s, $scope.row2s, $scope.row3s, $scope.row4s);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan20 = false;
                    $scope.gantiPertanyaan21 = true;
                }
            }

            $scope.changeRow2s = function() {
                if ($scope.row2s == $scope.row1s) $scope.row1s = undefined;
                if ($scope.row2s == $scope.row3s) $scope.row3s = undefined;
                if ($scope.row2s == $scope.row4s) $scope.row4s = undefined;

                if ($scope.row1s && $scope.row2s !== undefined ||
                    $scope.row1s && $scope.row3s !== undefined ||
                    $scope.row1s && $scope.row4s !== undefined ||
                    $scope.row2s && $scope.row3s !== undefined ||
                    $scope.row2s && $scope.row4s !== undefined ||
                    $scope.row3s && $scope.row4s !== undefined) {
                    if ($scope.row1s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1s, $scope.row2s, $scope.row3s, $scope.row4s);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan20 = false;
                    $scope.gantiPertanyaan21 = true;
                }
            }

            $scope.changeRow3s = function() {
                if ($scope.row3s == $scope.row1s) $scope.row1s = undefined;
                if ($scope.row3s == $scope.row2s) $scope.row2s = undefined;
                if ($scope.row3s == $scope.row4s) $scope.row4s = undefined;

                if ($scope.row1s && $scope.row2s !== undefined ||
                    $scope.row1s && $scope.row3s !== undefined ||
                    $scope.row1s && $scope.row4s !== undefined ||
                    $scope.row2s && $scope.row3s !== undefined ||
                    $scope.row2s && $scope.row4s !== undefined ||
                    $scope.row3s && $scope.row4s !== undefined) {
                    if ($scope.row1s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1s, $scope.row2s, $scope.row3s, $scope.row4s);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan20 = false;
                    $scope.gantiPertanyaan21 = true;
                }
            }
            $scope.changeRow4s = function() {
                if ($scope.row4s == $scope.row1s) $scope.row1s = undefined;
                if ($scope.row4s == $scope.row2s) $scope.row2s = undefined;
                if ($scope.row4s == $scope.row3s) $scope.row3s = undefined;


                if ($scope.row1s && $scope.row2s !== undefined ||
                    $scope.row1s && $scope.row3s !== undefined ||
                    $scope.row1s && $scope.row4s !== undefined ||
                    $scope.row2s && $scope.row3s !== undefined ||
                    $scope.row2s && $scope.row4s !== undefined ||
                    $scope.row3s && $scope.row4s !== undefined) {
                    if ($scope.row1s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4s == "1") {
                        var data = { "noPertanyaan": "20", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4s == "2") {
                        var data = { "noPertanyaan": "20", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1s, $scope.row2s, $scope.row3s, $scope.row4s);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan20 = false;
                    $scope.gantiPertanyaan21 = true;
                }
            }
            //#endregion
            //#region pertanyaan 21
            $scope.changeRow1t = function() {
                if ($scope.row1t == $scope.row2t) $scope.row2t = undefined;
                if ($scope.row1t == $scope.row3t) $scope.row3t = undefined;
                if ($scope.row1t == $scope.row4t) $scope.row4t = undefined;

                if ($scope.row1t && $scope.row2t !== undefined ||
                    $scope.row1t && $scope.row3t !== undefined ||
                    $scope.row1t && $scope.row4t !== undefined ||
                    $scope.row2t && $scope.row3t !== undefined ||
                    $scope.row2t && $scope.row4t !== undefined ||
                    $scope.row3t && $scope.row4t !== undefined) {

                    if ($scope.row1t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1t, $scope.row2t, $scope.row3t, $scope.row4t);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan21 = false;
                    $scope.gantiPertanyaan22 = true;
                }
            }

            $scope.changeRow2t = function() {
                if ($scope.row2t == $scope.row1t) $scope.row1t = undefined;
                if ($scope.row2t == $scope.row3t) $scope.row3t = undefined;
                if ($scope.row2t == $scope.row4t) $scope.row4t = undefined;

                if ($scope.row1t && $scope.row2t !== undefined ||
                    $scope.row1t && $scope.row3t !== undefined ||
                    $scope.row1t && $scope.row4t !== undefined ||
                    $scope.row2t && $scope.row3t !== undefined ||
                    $scope.row2t && $scope.row4t !== undefined ||
                    $scope.row3t && $scope.row4t !== undefined) {

                    if ($scope.row1t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1t, $scope.row2t, $scope.row3t, $scope.row4t);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan21 = false;
                    $scope.gantiPertanyaan22 = true;
                }
            }

            $scope.changeRow3t = function() {
                if ($scope.row3t == $scope.row1t) $scope.row1t = undefined;
                if ($scope.row3t == $scope.row2t) $scope.row2t = undefined;
                if ($scope.row3t == $scope.row4t) $scope.row4t = undefined;

                if ($scope.row1t && $scope.row2t !== undefined ||
                    $scope.row1t && $scope.row3t !== undefined ||
                    $scope.row1t && $scope.row4t !== undefined ||
                    $scope.row2t && $scope.row3t !== undefined ||
                    $scope.row2t && $scope.row4t !== undefined ||
                    $scope.row3t && $scope.row4t !== undefined) {

                    if ($scope.row1t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1t, $scope.row2t, $scope.row3t, $scope.row4t);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan21 = false;
                    $scope.gantiPertanyaan22 = true;
                }
            }
            $scope.changeRow4t = function() {
                if ($scope.row4t == $scope.row1t) $scope.row1t = undefined;
                if ($scope.row4t == $scope.row2t) $scope.row2t = undefined;
                if ($scope.row4t == $scope.row3t) $scope.row3t = undefined;


                if ($scope.row1t && $scope.row2t !== undefined ||
                    $scope.row1t && $scope.row3t !== undefined ||
                    $scope.row1t && $scope.row4t !== undefined ||
                    $scope.row2t && $scope.row3t !== undefined ||
                    $scope.row2t && $scope.row4t !== undefined ||
                    $scope.row3t && $scope.row4t !== undefined) {

                    if ($scope.row1t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4t == "1") {
                        var data = { "noPertanyaan": "21", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4t == "2") {
                        var data = { "noPertanyaan": "21", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1t, $scope.row2t, $scope.row3t, $scope.row4t);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastConscientiousness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan21 = false;
                    $scope.gantiPertanyaan22 = true;
                }
            }
            //#endregion
            //#region pertanyaan 22
            $scope.changeRow1u = function() {
                if ($scope.row1u == $scope.row2u) $scope.row2u = undefined;
                if ($scope.row1u == $scope.row3u) $scope.row3u = undefined;
                if ($scope.row1u == $scope.row4u) $scope.row4u = undefined;

                if ($scope.row1u && $scope.row2u !== undefined ||
                    $scope.row1u && $scope.row3u !== undefined ||
                    $scope.row1u && $scope.row4u !== undefined ||
                    $scope.row2u && $scope.row3u !== undefined ||
                    $scope.row2u && $scope.row4u !== undefined ||
                    $scope.row3u && $scope.row4u !== undefined) {

                    if ($scope.row1u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1u, $scope.row2u, $scope.row3u, $scope.row4u);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan22 = false;
                    $scope.gantiPertanyaan23 = true;
                }
            }

            $scope.changeRow2u = function() {
                if ($scope.row2u == $scope.row1u) $scope.row1u = undefined;
                if ($scope.row2u == $scope.row3u) $scope.row3u = undefined;
                if ($scope.row2u == $scope.row4u) $scope.row4u = undefined;

                if ($scope.row1u && $scope.row2u !== undefined ||
                    $scope.row1u && $scope.row3u !== undefined ||
                    $scope.row1u && $scope.row4u !== undefined ||
                    $scope.row2u && $scope.row3u !== undefined ||
                    $scope.row2u && $scope.row4u !== undefined ||
                    $scope.row3u && $scope.row4u !== undefined) {

                    if ($scope.row1u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1u, $scope.row2u, $scope.row3u, $scope.row4u);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan22 = false;
                    $scope.gantiPertanyaan23 = true;
                }
            }

            $scope.changeRow3u = function() {
                if ($scope.row3u == $scope.row1u) $scope.row1u = undefined;
                if ($scope.row3u == $scope.row2u) $scope.row2u = undefined;
                if ($scope.row3u == $scope.row4u) $scope.row4u = undefined;

                if ($scope.row1u && $scope.row2u !== undefined ||
                    $scope.row1u && $scope.row3u !== undefined ||
                    $scope.row1u && $scope.row4u !== undefined ||
                    $scope.row2u && $scope.row3u !== undefined ||
                    $scope.row2u && $scope.row4u !== undefined ||
                    $scope.row3u && $scope.row4u !== undefined) {

                    if ($scope.row1u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1u, $scope.row2u, $scope.row3u, $scope.row4u);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan22 = false;
                    $scope.gantiPertanyaan23 = true;
                }
            }
            $scope.changeRow4u = function() {
                if ($scope.row4u == $scope.row1u) $scope.row1u = undefined;
                if ($scope.row4u == $scope.row2u) $scope.row2u = undefined;
                if ($scope.row4u == $scope.row3u) $scope.row3u = undefined;


                if ($scope.row1u && $scope.row2u !== undefined ||
                    $scope.row1u && $scope.row3u !== undefined ||
                    $scope.row1u && $scope.row4u !== undefined ||
                    $scope.row2u && $scope.row3u !== undefined ||
                    $scope.row2u && $scope.row4u !== undefined ||
                    $scope.row3u && $scope.row4u !== undefined) {

                    if ($scope.row1u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4u == "1") {
                        var data = { "noPertanyaan": "22", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4u == "2") {
                        var data = { "noPertanyaan": "22", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1u, $scope.row2u, $scope.row3u, $scope.row4u);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastConscientiousness += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastDominant += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan22 = false;
                    $scope.gantiPertanyaan23 = true;
                }
            }
            //#endregion
            //#region pertanyaan 23
            $scope.changeRow1v = function() {
                if ($scope.row1v == $scope.row2v) $scope.row2v = undefined;
                if ($scope.row1v == $scope.row3v) $scope.row3v = undefined;
                if ($scope.row1v == $scope.row4v) $scope.row4v = undefined;

                if ($scope.row1v && $scope.row2v !== undefined ||
                    $scope.row1v && $scope.row3v !== undefined ||
                    $scope.row1v && $scope.row4v !== undefined ||
                    $scope.row2v && $scope.row3v !== undefined ||
                    $scope.row2v && $scope.row4v !== undefined ||
                    $scope.row3v && $scope.row4v !== undefined) {

                    if ($scope.row1v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    
                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1v, $scope.row2v, $scope.row3v, $scope.row4v);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan23 = false;
                    $scope.gantiPertanyaan24 = true;
                }
            }

            $scope.changeRow2v = function() {
                if ($scope.row2v == $scope.row1v) $scope.row1v = undefined;
                if ($scope.row2v == $scope.row3v) $scope.row3v = undefined;
                if ($scope.row2v == $scope.row4v) $scope.row4v = undefined;

                if ($scope.row1v && $scope.row2v !== undefined ||
                    $scope.row1v && $scope.row3v !== undefined ||
                    $scope.row1v && $scope.row4v !== undefined ||
                    $scope.row2v && $scope.row3v !== undefined ||
                    $scope.row2v && $scope.row4v !== undefined ||
                    $scope.row3v && $scope.row4v !== undefined) {

                    if ($scope.row1v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1v, $scope.row2v, $scope.row3v, $scope.row4v);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan23 = false;
                    $scope.gantiPertanyaan24 = true;
                }
            }

            $scope.changeRow3v = function() {
                if ($scope.row3v == $scope.row1v) $scope.row1v = undefined;
                if ($scope.row3v == $scope.row2v) $scope.row2v = undefined;
                if ($scope.row3v == $scope.row4v) $scope.row4v = undefined;

                if ($scope.row1v && $scope.row2u !== undefined ||
                    $scope.row1v && $scope.row3v !== undefined ||
                    $scope.row1v && $scope.row4v !== undefined ||
                    $scope.row2v && $scope.row3v !== undefined ||
                    $scope.row2v && $scope.row4v !== undefined ||
                    $scope.row3v && $scope.row4v !== undefined) {

                    if ($scope.row1v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1v, $scope.row2v, $scope.row3v, $scope.row4v);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan23 = false;
                    $scope.gantiPertanyaan24 = true;
                }
            }
            $scope.changeRow4v = function() {
                if ($scope.row4v == $scope.row1v) $scope.row1v = undefined;
                if ($scope.row4v == $scope.row2v) $scope.row2v = undefined;
                if ($scope.row4v == $scope.row3v) $scope.row3v = undefined;


                if ($scope.row1v && $scope.row2v !== undefined ||
                    $scope.row1v && $scope.row3v !== undefined ||
                    $scope.row1v && $scope.row4v !== undefined ||
                    $scope.row2v && $scope.row3v !== undefined ||
                    $scope.row2v && $scope.row4v !== undefined ||
                    $scope.row3v && $scope.row4v !== undefined) {

                    if ($scope.row1v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4v == "1") {
                        var data = { "noPertanyaan": "23", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4v == "2") {
                        var data = { "noPertanyaan": "23", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1v, $scope.row2v, $scope.row3v, $scope.row4v);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastDominant += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostConscientiousness += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostSteadiness += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastSteadiness += 1;
                        }
                        counter += 1;
                    });

                    $scope.gantiPertanyaan23 = false;
                    $scope.gantiPertanyaan24 = true;
                }
            }
            //#endregion
            //#region pertanyaan 24
            $scope.changeRow1w = function() {
                if ($scope.row1w == $scope.row2w) $scope.row2w = undefined;
                if ($scope.row1w == $scope.row3w) $scope.row3w = undefined;
                if ($scope.row1w == $scope.row4w) $scope.row4w = undefined;

                if ($scope.row1w && $scope.row2w !== undefined ||
                    $scope.row1w && $scope.row3w !== undefined ||
                    $scope.row1w && $scope.row4w !== undefined ||
                    $scope.row2w && $scope.row3w !== undefined ||
                    $scope.row2w && $scope.row4w !== undefined ||
                    $scope.row3w && $scope.row4w !== undefined) {

                    if ($scope.row1w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                   $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1w, $scope.row2w, $scope.row3w, $scope.row4w);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });
                    
                   $scope.gantiPertanyaan24 = false;
                    $scope.psikotesFinish = true;
                  
                }
            }

            $scope.changeRow2w = function() {
                if ($scope.row2w == $scope.row1w) $scope.row1w = undefined;
                if ($scope.row2w == $scope.row3w) $scope.row3w = undefined;
                if ($scope.row2w == $scope.row4w) $scope.row4w = undefined;

                if ($scope.row1w && $scope.row2w !== undefined ||
                    $scope.row1w && $scope.row3w !== undefined ||
                    $scope.row1w && $scope.row4w !== undefined ||
                    $scope.row2w && $scope.row3w !== undefined ||
                    $scope.row2w && $scope.row4w !== undefined ||
                    $scope.row3w && $scope.row4w !== undefined) {

                    if ($scope.row1w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1w, $scope.row2w, $scope.row3w, $scope.row4w);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });
             
                    $scope.gantiPertanyaan24 = false;
                    $scope.psikotesFinish = true;
                }
            }

            $scope.changeRow3w = function() {
                if ($scope.row3w == $scope.row1w) $scope.row1w = undefined;
                if ($scope.row3w == $scope.row2w) $scope.row2w = undefined;
                if ($scope.row3w == $scope.row4w) $scope.row4w = undefined;

                if ($scope.row1w && $scope.row2u !== undefined ||
                    $scope.row1w && $scope.row3w !== undefined ||
                    $scope.row1w && $scope.row4w !== undefined ||
                    $scope.row2w && $scope.row3w !== undefined ||
                    $scope.row2w && $scope.row4w !== undefined ||
                    $scope.row3w && $scope.row4w !== undefined) {
                    if ($scope.row1w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1w, $scope.row2w, $scope.row3w, $scope.row4w);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });
                 
                    $scope.gantiPertanyaan24 = false;
                    $scope.psikotesFinish = true;
                    }
            }
            $scope.changeRow4w = function() {
                if ($scope.row4w == $scope.row1w) $scope.row1w = undefined;
                if ($scope.row4w == $scope.row2w) $scope.row2w = undefined;
                if ($scope.row4w == $scope.row3w) $scope.row3w = undefined;


                if ($scope.row1w && $scope.row2w !== undefined ||
                    $scope.row1w && $scope.row3w !== undefined ||
                    $scope.row1w && $scope.row4w !== undefined ||
                    $scope.row2w && $scope.row3w !== undefined ||
                    $scope.row2w && $scope.row4w !== undefined ||
                    $scope.row3w && $scope.row4w !== undefined) {

                    if ($scope.row1w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "1", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row1w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "1", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "2", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row2w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "2", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "3", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row3w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "3", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    } if ($scope.row4w == "1") {
                        var data = { "noPertanyaan": "24", "Row": "4", "Value": "1", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }
                    if ($scope.row4w == "2") {
                        var data = { "noPertanyaan": "24", "Row": "4", "Value": "2", "loginName": $scope.loginName };
                        $scope.answers.push(data);
                    }

                    $scope.bufferHasil = [];
                    $scope.bufferHasil.push($scope.row1w, $scope.row2w, $scope.row3w, $scope.row4w);

                    var counter = 0;
                    $scope.bufferHasil.forEach(function (elemen) {

                        var rawNilai = counter.toString() + elemen;
                        if (rawNilai === '01') {
                            $scope.MostStar += 1;
                        } else if (rawNilai === '02') {
                            $scope.LeastSteadiness += 1;
                        } else if (rawNilai === '11') {
                            $scope.MostInfluence += 1;
                        } else if (rawNilai === '12') {
                            $scope.LeastInfluence += 1;
                        } else if (rawNilai === '21') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '22') {
                            $scope.LeastStar += 1;
                        } else if (rawNilai === '31') {
                            $scope.MostDominant += 1;
                        } else if (rawNilai === '32') {
                            $scope.LeastStar += 1;
                        }
                        counter += 1;
                    });
                    $scope.gantiPertanyaan24 = false;
                    $scope.psikotesFinish = true;
                }
            }
            //#endregion
            */
            // #endregion
            

            /*
            
            *//*BUTTON SAVE DI PAGE PSIKOTES FINISH*//*
            $scope.simpanPsikotes = function() {
                $scope.hasil = {
                    'loginName': $scope.loginName,
                    'mostD': $scope.MostDominant,
                    'mostI': $scope.MostInfluence,
                    'mostS': $scope.MostSteadiness,
                    'mostC': $scope.MostConscientiousness,
                    'mostStar': $scope.MostStar,
                    'leastD': $scope.LeastDominant,
                    'leastI': $scope.LeastInfluence,
                    'leastS': $scope.LeastSteadiness,
                    'leastC': $scope.LeastConscientiousness,
                    'leastStar': $scope.LeastStar,
                    'changeD': $scope.MostDominant - $scope.LeastDominant,
                    'changeI': $scope.MostInfluence - $scope.LeastInfluence,
                    'changeS': $scope.MostSteadiness - $scope.LeastSteadiness,
                    'changeC': $scope.MostConscientiousness - $scope.LeastConscientiousness

                }



                if (!isValidated) {
                    swalAlert.message('e', "Anda sudah mengikuti psikotes");
                    return;
                }

                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                $http.post('api/Psikotes/AddHasilPsikotes', $scope.hasil).then(function (res) {
                    console.log(res);

                    if (res.data.isSucceed) {
                        $http.post('api/Psikotes/AddJawabanPsikotes', $scope.answers).then(function (res) {
                            console.log(res);
                            if (res.data.isSucceed) {
                                localStorageService.set('statusPsikotes', res.data.isSucceed);
                                swalAlert.message('s', res.data.message);
                                $('.spinner').fadeOut(500);
                                $(".OverlaySpinner").fadeOut(500);
                                $state.go('rekrutmenReview');
                            } else {
                                $('.spinner').fadeOut(500);
                                $(".OverlaySpinner").fadeOut(500);
                                swalAlert.message('e', res.data.message);
                            }
                        });

                    } else {
                        swalAlert.message('e', res.data.message);
                    }
                });
            }
            */

            //#endregion
        });
})(angular.module('SunLifeApp'));