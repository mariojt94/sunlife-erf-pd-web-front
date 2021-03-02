(function (app) {
    'use strict';

    app.controller('profileAccountController', function ($window, $scope, $http, $state, authService, localStorageService, swalAlert) {
        $scope.loginName = localStorageService.get('LoginName');
        $scope.dataEdit = {};

        $http({
            method: 'GET',
            url: 'api/Profile/GetProfilePicture',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.AccountData = res.data;
            //console.log($scope.AccountData);
            $scope.PicPath = res.data.Path;
         });

        $http({
            method: 'GET',
            url: 'api/Profile/GetAccountForProfile',
            params: {
                loginName: $scope.loginName
            }
        }).then(function (res) {
            $scope.AccountData = res.data;
            $scope.namaLengkap = $scope.AccountData.DisplayName;
            $scope.namaDepan = $scope.AccountData.NamaDepan;
            $scope.namaBelakang = $scope.AccountData.NamaBelakang;
            $scope.email = $scope.AccountData.Email;
            $scope.phoneNo = $scope.AccountData.PhoneNo;
            $scope.sourceCandidate = $scope.AccountData.RefName;
            //$scope.AccountData.loginName = $scope.loginName;
            //console.log($scope.AccountData);
            
            //$scope.dataEdit.push($scope.namaLengkap, $scope.namaDepan, $scope.namaBelakang, $scope.email, $scope.noTelp, $scope.loginName);
        });


        $scope.editProfile = function () {
            $scope.dataEdit = {
                'loginName': $scope.loginName,
                'namaDepan': $scope.namaDepan,
                'namaBelakang': $scope.namaBelakang,
                'email': $scope.email,
                'phoneNo': $scope.phoneNo
            };
            if ($scope.dataEdit.namaDepan == "" || $scope.dataEdit.namaDepan == null ||
                $scope.dataEdit.namaBelakang == "" || $scope.dataEdit.namaBelakang == null ||
                $scope.dataEdit.phoneNo == "" ||
                $scope.dataEdit.phoneNo == null) {
                swalAlert.message('e', "Silahkan lengkapi data terlebih dahulu");
            }else if ($scope.dataEdit.email == "" ||
                $scope.dataEdit.email == null) {
                swalAlert.message('e', "Silahkan masukan email dengan Format yang sesuai");
            } else {
                $http.post('api/Profile/UpdateAccountProfile', $scope.dataEdit)
                    .then(function(response) {
                        //console.log(response);
                        if (response.data.isSucceed) {
                            swalAlert.message('s', response.data.message);
                            $state.go('profile');
                        } else {
                            swalAlert.message('e', response.data.message);
                        }
                    });
            }
        }
    });
})(angular.module('SunLifeApp'));