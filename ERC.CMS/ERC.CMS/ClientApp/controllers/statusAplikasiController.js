(function (app) {
    'use strict';
    app.controller('statusAplikasiController', function ($scope, $rootScope, $http, $state, authService, $window, swalAlert, $location, localStorageService) {
        $scope.loginName = localStorageService.get('LoginName');
        var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        var bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        var isValidated = true;
        $scope.viewSubmitAplikasi = false;

        $http({
            method: 'GET',
            url: 'api/Recruitment/GetStatusCandidate',
            params: {
                loginName: $scope.loginName
            }
        }).then(function(res) {
            if (res.data.Status == "REJECT") {
                swalAlert.message('i', "aplikasi anda telah ditolak. Terimakasih");
                isValidated = false;
                $state.go('homeNew');
                return;
            }
            else if (res.data.Status == "APPROVED") {
                swalAlert.message('s', "Data telah di approve");
                isValidated = false;
                $state.go('homeNew');
                return;
            }
        });

        if (!isValidated) {
            return;
        }

        $http({
            method: 'GET',
            url: 'api/FileUpload/GetDokumenPDF',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            //console.log(res);
            $scope.datas = res.data;
            $scope.datas.forEach(function (element) {
                $scope.tglSubmit = new Date(element.CreateDate);
                // $scope.bulan = $scope.tglSubmit.getMonth() + 1;
 
               function getBulanFunc() {
                    return bulan[$scope.tglSubmit.getMonth()];
               };

                function getHariFunc() {
                    return hari[$scope.tglSubmit.getDay()];
                }

                $scope.getBulan = getBulanFunc();
                $scope.getHari = getHariFunc();
                $scope.Tanggal = $scope.tglSubmit.getDate() + " " + $scope.getBulan + " " + $scope.tglSubmit.getFullYear();
                $scope.Jam = $scope.tglSubmit.getHours();
                $scope.Menit = ($scope.tglSubmit.getMinutes() < 10 ? '0' : '') + $scope.tglSubmit.getMinutes();
   
               console.log($scope.tglSubmit.getHours());
            });
        });

        $http({
            method: 'GET',
            url: 'api/Recruitment/GetStatusJadwalInterview',
            params: {
                loginName: $scope.loginName
            }
        }).then(function(res) {
            if (res.data.StatusJadwalInterview1 == null) {
                $scope.doesJadwal1Exist = false;
            } else {
                $scope.doesJadwal1Exist = true;
            }

            if (res.data.StatusJadwalInterview2 == null) {
                $scope.doesJadwal2Exist = false;
            } else {
                $scope.doesJadwal2Exist = true;
            }
        });

        $http({
            method: 'GET',
            url: 'api/Recruitment/GetJadwalInterview1',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
 
            //console.log(res);
            $scope.lokasi1 = res.data.LokasiInterview1;
            $scope.lokasi2 = res.data.LokasiInterview2;


/*            if (res.data.TanggalInterview1 != "0001-01-01T00:00:00") {
                $scope.GetTglInterview1 = new Date(res.data.TanggalInterview1);
            }

            if (res.data.TanggalInterview2 == "0001-01-01T00:00:00") {
                $scope.GetTglInterview2 = new Date(res.data.TanggalInterview2);
            }*/
            
            $scope.GetTglInterview1 = new Date(res.data.TanggalInterview1);
            $scope.GetJamInterview1 = res.data.WaktuInterview1;
            $scope.GetTglInterview2 = new Date(res.data.TanggalInterview2);
            $scope.GetJamInterview2 = res.data.WaktuInterview2;


            function getBulanFunc1() {
                return bulan[$scope.GetTglInterview1.getMonth()];
            };

            function getHariFunc1() {
                return hari[$scope.GetTglInterview1.getDay()];
            }
            function getBulanFunc2() {
                return bulan[$scope.GetTglInterview2.getMonth()];
            };

            function getHariFunc2() {
                return hari[$scope.GetTglInterview2.getDay()];
            }


            $scope.getBulanInterview1 = getBulanFunc1();
            $scope.getHariInterview1 = getHariFunc1();
            $scope.getBulanInterview2 = getBulanFunc2();
            $scope.getHariInterview2 = getHariFunc2();

            console.log($scope.getBulanInterview1);
            $scope.TanggalInterview1 = $scope.GetTglInterview1.getDate() + " " + $scope.getBulanInterview1 + " " + $scope.GetTglInterview1.getFullYear();
            $scope.JamInterview1 = $scope.GetJamInterview1;
            //$scope.JamInterview1 = $scope.GetTglInterview1.getHours();
            $scope.MenitInterview1 = ($scope.GetTglInterview1.getMinutes() < 10 ? '0' : '') + $scope.GetTglInterview1.getMinutes();
            $scope.TanggalInterview2 = $scope.GetTglInterview2.getDate() + " " + $scope.getBulanInterview2 + " " + $scope.GetTglInterview2.getFullYear();
            $scope.JamInterview2 = $scope.GetJamInterview2;
            //$scope.JamInterview2 = $scope.GetTglInterview2.getHours();
            $scope.MenitInterview2 = ($scope.GetTglInterview2.getMinutes() < 10 ? '0' : '') + $scope.GetTglInterview2.getMinutes();

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
                $scope.viewSubmitAplikasi = false;
            } else if (res.data.IsSubmittedPDF == true) {
                $scope.viewSubmitAplikasi = true;
            }
        });

        $http({
            method: 'GET',
            url: 'api/Recruitment/GetDataTraining',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.lokasi = res.data.VenueTraining;
            $scope.getTanggalTraining = new Date(res.data.TrainingDate);

            function getBulanTraining() {
                return bulan[$scope.getTanggalTraining.getMonth()];
            };

            function getHariTraining() {
                return hari[$scope.getTanggalTraining.getDay()];
            }

            $scope.getBulanTraining = getBulanTraining();
            $scope.getHariTraining = getHariTraining();
            $scope.TanggalTraining = $scope.getTanggalTraining.getDate() + " " + $scope.getBulanTraining + " " + $scope.getTanggalTraining.getFullYear();
        });

    });
})(angular.module('SunLifeApp'));