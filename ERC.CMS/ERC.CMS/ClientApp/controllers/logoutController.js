(function (app) {
    'use strict';

    app.controller('logoutController', function ($scope, $state, authService, $window, $location, myService, Idle, localStorageService) {

        $scope.logOut = function () {
            

            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            authService.logOut();
            $state.go('auth');
            $window.location.reload();
            Idle.watch();

        }

        $scope.changePassword = function () {
            $state.go('changePassword');
        }

        $scope.authentication = authService.authentication;

        //ini supaya bisa digunakan di controller lain, karena menggunakan myService
        $scope.loading = myService;

    });
})(angular.module('SunLifeApp'));