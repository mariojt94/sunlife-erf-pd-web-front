(function (app) {
    'use strict';
    app.controller('changePasswordFromSettingController', changePasswordFromSettingController);
    changePasswordFromSettingController.$inject = ['$scope', '$http', 'authService', 'swalAlert', '$stateParams', 'localStorageService', '$state'];

    function changePasswordFromSettingController($scope,
        $http,
        authService,
        swalAlert,
        $stateParams,
        localStorageService,
        $state) {
        $scope.changePassData = {};
/*        $http.get("api/Account/GetUserFromForgot", $stateParams.link).then(function (res) {
                    JSON.stringify(res.data);
                });*/

        /*        $http.post('api/Account/ValidateChangePassLink', $scope.link, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
                    .then(function (response) {
         
                    });*/


        //$scope.username = authService.authentication.userName;
        /*        $scope.submit = function (formData)
                {
                    formData.LoginName = $scope.username;
                    $http.post('/api/Account/ValidateChangePasswordAccount', formData)
                    .then(function (response) {
                        if (response.data.isSucceed) {
                            swalAlert.message('s',response.data.message);
                            $cookies.remove("repository");
                            location.reload();
                        } else {
                            swalAlert.message('e', response.data.message);
                        }
                    });
                }*/


        $scope.submit = function() {
            $scope.changePassData.LoginName = localStorageService.get('LoginName');
            var isValidated = true;

            $http({
                method: 'GET',
                url: '/api/Account/GetPassword',
                params: {
                    loginName: $scope.changePassData.LoginName,
                    password: $scope.changePassData.InputOldPassword
                }
            }).then(function(res) {
                if (res.data == false) {
                    swalAlert.message('e', "password lama salah");
                    isValidated = false;
                    return;
                }
            });

            if (!isValidated) {
                return;
            }

            if ($scope.changePassData.InputOldPassword == null || $scope.changePassData.InputOldPassword == undefined) {
                swalAlert.message('e', "masukan password lama");
            } else if ($scope.changePassData.InputNewPassword == null ||
                $scope.changePassData.InputNewPassword == undefined) {
                swalAlert.message('e', "masukan password baru");
            } else if ($scope.changePassData.InputConfirmationNewPassword == null ||
                $scope.changePassData.InputConfirmationNewPassword == undefined) {
                swalAlert.message('e', "masukan konfirmasi password baru");
            } else if ($scope.changePassData.InputNewPassword != $scope.changePassData.InputConfirmationNewPassword) {
                swalAlert.message('e', "Pastikan konfirmasi password sudah sama");
            } else if ($scope.changePassData.InputOldPassword == $scope.changePassData.InputNewPassword) {
                swalAlert.message('e', "kata sandi baru tidak boleh sama dengan kata sandi lama");
            } else {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                $http.post("api/Account/ChangePasswordUser", $scope.changePassData).then(function(res) {
                    JSON.stringify(res.data);
                    if (res.data.isSucceed == true) {
                        swalAlert.message('s', res.data.message);
                        $state.go('homeNew');
                    } else {
                        swalAlert.message('e', response.data.message);
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    }
                });
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
            }
        }

}
})(angular.module('SunLifeApp'));