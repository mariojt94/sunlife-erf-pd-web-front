(function (app) {
    'use strict';

    app.controller('loginController', function ($scope, $rootScope, $http, $state, authService, $window, swalAlert, $location, localStorageService) {
        //if ($location.path().indexof('login' >= 0)) {
        //    console.log('enter login');
        //    return;
            //if (authservice && authservice.authentication && authservice.authentication.rolename) {
            //    if (authservice.authentication.rolename.touppercase() == "admin") {
            //        $state.go('homepagecms');
            //    }
            //    else if (authservice.authentication.rolename != "") {
            //        $state.go('home');
            //    }
            //} 
        //}
        $(".password-field").click(function () {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
        $scope.login = function () {
/*            $scope.myObj = {
                "border-color": "red"
            }*/
            if ($scope.loginData == undefined) {
                var myEl = angular.element(document.getElementById('loginName'));
                var myEl2 = angular.element(document.getElementById('password-field'));
                myEl.addClass('form-control f-danger');
                myEl2.addClass('form-control-password f-danger');
                swalAlert.message('i', 'silahkan isi username dan password');
            } else if ($scope.loginData.password == undefined) {
                var myEl = angular.element(document.getElementById('password-field'));
                myEl.addClass('form-control-password f-danger');
                swalAlert.message('i', 'silahkan isi username dan password');
            } else if ($scope.loginData.userName == undefined) {
                var myEl = angular.element(document.getElementById('loginName'));
                myEl.addClass('form-control f-danger');
                swalAlert.message('i', 'silahkan isi username dan password');
            } else {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);
                authService.login($scope.loginData).then(function (response) {
                       var roleName = localStorageService.get('authorizationData').roleName;
                       if (roleName != "Candidate") {
                           swalAlert.message('e', "anda tidak memilki hak akses");
                           $('.spinner').fadeOut(500);
                           $(".OverlaySpinner").fadeOut(500);
                            return;
                        }
                        //$rootScope.layout = authService.authentication.typeStyle;
/*                $(document).attr("title", "E-Recruitment");
                if (authService.authentication.roleName === "Admin") {
                    $state.go('homePageCMS');
                    //$state.go('homeNew');
                }
                else {
                    $state.go('home');
                }*/
                        //$window.localStorage.setItem('LoginName', $scope.loginData.userName);
                    localStorageService.set('LoginName', $scope.loginData.userName.toUpperCase());
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                        $state.go('homeNew');
                        Idle.watch();

                    },
                    function (err) {
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                        $scope.message = err.data.error_description;
                        swalAlert.message('e', $scope.message);
 
                    });
            }
        };

        $scope.ForgotPassword = function () {
            $state.go('forgotPassword');
        };
    });
})(angular.module('SunLifeApp'));