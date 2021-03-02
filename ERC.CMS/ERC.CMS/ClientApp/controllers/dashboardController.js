(function (app) {
    'use strict';

    app.controller('dashboardController', dashboardController);
    dashboardController.$inject = ['$scope', 'myService', '$http', '$templateCache', '$uibModal', '$log', '$document', '$state', 'authService', '$window','swalAlert'];

    app.component('photoUploadComponent', {
        templateUrl: 'photoUpload.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function ($http, $scope, $window, $base64, swalAlert) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                var dataResolve = $ctrl.resolve.items;

                $ctrl.cancel = function () {
                    $ctrl.dismiss();
                };

                $ctrl.uploadFile = function () {

                    $http.post('/api/Account/ChangeUserPhoto',
                    { LoginName: dataResolve.username, Photo: 'data:' + $scope.photoFile.filetype + ";base64," + $scope.photoFile.base64 })
                    .then(function SuccesCallbBack(response) {
                        if (response.data.isSucceed) {
                            //$window.alert(response.data.message);
                            swalAlert.message('s',response.data.message);
                            $window.location.reload();
                            $ctrl.close();
                        }
                        else
                        {
                            //$window.alert(response.data.message);
                            swalAlert.message('e', response.data.message);
                        }
                    }, function errorCallback(response) {
                        //$window.alert(response.data.exceptionMessage);
                        swalAlert.message('e',response.data.exceptionMessage);
                    });

                };

            }
        }
    });

    function dashboardController($scope, myService, $http, $templateCache, $uibModal, $log, $document, $state, authService, $window) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;

        $scope.username = authService.authentication.userName;
        $http({
            method: 'GET',
            url: '/api/Account/GetUser/',
            params: { loginName: $scope.username },
        })
        .then(function (response) {
            $scope.userData = response.data;
            $scope.IsPD = response.data.IsPD;
            $scope.businessType = response.data.TypeName;
            $scope.businessTypeId = response.data.TypeID;
            $scope.DisplayName = response.data.DisplayName;
            $scope.NoKTP = response.data.NoKTP;

            $http({
                method: 'GET',
                url: '/api/dashboard/GetTop5UserExamByLearningType',
                params: { businessTypeId: $scope.businessTypeId },
            })
            .then(function (response) {
                $scope.LearningTypeList = response.data;
            }, function (response) {
                $scope.LearningTypeList = response.data || 'Request failed';
                $scope.status = response.status;
            });

            if ($scope.IsPD == true) {
                $http({
                    method: 'GET',
                    url: '/api/Certificate/GetUserCertificatePD',
                    params: { loginName: $scope.username },
                })
                .then(function (response) {
                    $scope.userCertificate = response.data;
                }, function (response) {
                    $scope.userCertificate = response.data || 'Request failed';
                    $scope.status = response.status;
                });
            }
            else
            {
                $http({
                    method: 'GET',
                    url: '/api/Certificate/GetUserCertificate',
                    params: { loginName: $scope.username },
                })
                .then(function (response) {
                    $scope.userCertificate = response.data;
                }, function (response) {
                    $scope.userCertificate = response.data || 'Request failed';
                    $scope.status = response.status;
                });
            }

        }, function (response) {
            $scope.user = response.data || 'Request failed';
            $scope.status = response.status;
        });

        $scope.ActivitySummary = null;


        
        var fillActivitySummary = function () {
            
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            $http({
                method: 'GET',
                url: '/api/Dashboard/GetActivitySummary/',
                params: { loginname: $scope.username, month: 12, year: 2017 },
            }).then(function (response) {
                
            }).finally(function () {
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
            });
        }
        fillActivitySummary();
    };

})(angular.module('SunLifeApp'));
