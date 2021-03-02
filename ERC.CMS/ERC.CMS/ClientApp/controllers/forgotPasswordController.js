(function (app) {
    'use strict';
    app.controller('forgotPasswordController', forgotPasswordController);

    forgotPasswordController.$inject = ['$scope', '$http', 'authService', 'swalAlert', '$state'];

    function forgotPasswordController($scope, $http, authService, swalAlert, $state) {
        //$scope.username = authService.authentication.userName;
        $scope.data = {
            LoginName: "",
            EmailOrNum: ""
        }

        $scope.submit = function(formData) {
            /*            $http.post('/api/Account/ChangePasswordUser', formData)
                         .then(function (response) {
                             if (response.data.isSucceed) {
                                 swalAlert.message('s', response.data.message);
                                 $cookies.remove("repository");
                                 location.reload();
                             } else {
                                 swalAlert.message('e', response.data.message);
                             }
                         });*/
            formData.Email = $scope.data.EmailOrNum;
            formData.LoginName = $scope.data.LoginName;

            if (formData.Email == undefined || formData.Email == "" || !$scope.data.Email.includes('@')) {
                swalAlert.message('e', 'No. Telepon / Email masih kosong');
            } else if (formData.LoginName == "" || formData.LoginName == undefined) {
                swalAlert.message('e', 'masukan login Name');
            } else {
            
            $http({
                method: 'GET',
                url: '/api/Account/GetEmailAndLoginName',
                //headers: { 'Content-Type': 'application/json; charset=UTF-8'},
                params: {
                    email: $scope.data.EmailOrNum,
                    loginName: $scope.data.LoginName
                }
            }).then(function(res) {
                if (res.data == null) {
                    swalAlert.message('e', 'email tidak sesuai');
                } else {

                    $('.spinner').fadeIn(500);
                    $(".OverlaySpinner").fadeIn(500);
                    $http.post('/api/Account/EmailChangePasswordAccount', formData)
                        .then(function(response) {
                            if (response.data.isSucceed == true) {
                                swalAlert.message('s', response.data.message);

                                $('.spinner').fadeOut(500);
                                $(".OverlaySpinner").fadeOut(500);

                                $state.go('auth');
                                $cookies.remove("repository");
                            } else {
                                swalAlert.message('e', response.data.message);
                                $('.spinner').fadeOut(500);
                                $(".OverlaySpinner").fadeOut(500);
                            }
                        });
                }
            });
        }
    }
    }

})(angular.module('SunLifeApp'));