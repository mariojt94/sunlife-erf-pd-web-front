(function (app) {
    'use strict';

    app.controller('createAccountController', createAccountController);
    createAccountController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$state', 'authService', 'localStorageService', 'swalAlert'];

    function createAccountController($scope, myService, $http, $uibModal, $log, $document, $window, $state, authService, localStorageService, swalAlert) {
        $scope.account = {
            NamaDepan: "",
            NamaBelakang: "",
            Email: "",
            PhoneNo: "",
            RecruitmentSrc: "",
            Password: "",
            RePassword: ""
        }

        $scope.cityList = null;

        $http({
            method: 'GET',
            url: '/api/Recruitment/GetRecruitmentSource'
        }).then(function (res) {
            $scope.listRecruitmentSource = res.data;
        });

        $scope.hapusNol = function() {
            if ($scope.account.PhoneNo == "0") {
                $scope.account.PhoneNo = "";
            }
        }

        $scope.account.PhoneNo = "+62" + $scope.account.PhoneNo;
        //tombol kirim:
        $scope.ok = function(formData) {
            var data = formData;

            /*   if (data.NamaDepan === "" || data.NamaBelakang === "" || data.Email === "" || data.Telp === "" || data.RecruitmentSrc === "" || data.Password === !data.RePassword)*/
/*            $http.get('api/Account/GetEmailDate', formData.Email).then(function(res) {
                console.log(res);
            });*/
            $http({
                method: 'GET',
                url: '/api/Account/GetEmailDate',
                params: {
                    email: formData.Email
                }
            }).then(function(res) {
                var dateNow = new Date();
                if (res.data != null) {
                    var createDate = new Date(res.data.CreatedWhen);
                    var valDate = new Date(createDate.setDate(createDate.getDate() + 90));
                }


                if ($scope.account.NamaDepan == "" ||
                    $scope.account.NamaDepan == undefined) {
                    var myEl = angular.element(document.getElementById('namaDepan'));
                    myEl.addClass('form-control f-danger');
                }
                if ($scope.account.NamaBelakang == "" ||
                    $scope.account.NamaBelakang == undefined) {
                    var myEl = angular.element(document.getElementById('namaBelakang'));
                    myEl.addClass('form-control f-danger');
                }
                if ($scope.account.Email == "" ||
                    $scope.account.Email == undefined) {
                    var myEl = angular.element(document.getElementById('email'));
                    myEl.addClass('form-control f-danger');
                }
                if ($scope.account.PhoneNo == "" ||
                    $scope.account.PhoneNo == undefined) {
                    var myEl = angular.element(document.getElementById('telp'));
                    myEl.addClass('form-control f-danger');
                }
                if ($scope.account.Password == "" ||
                    $scope.account.Password == undefined) {
                    var myEl = angular.element(document.getElementById('password'));
                    myEl.addClass('form-control f-danger');
                }
                if ($scope.account.RePassword == "" ||
                    $scope.account.RePassword == undefined) {
                    var myEl = angular.element(document.getElementById('repassword'));
                    myEl.addClass('form-control f-danger');
                }

                if (data.Password !== data.RePassword) {
                    swalAlert.message('e', 'Kata Sandi tidak sesuai');
                } else if ($scope.account.NamaDepan == "" ||
                    $scope.account.NamaDepan == undefined ||
                    $scope.account.NamaBelakang == "" ||
                    $scope.account.NamaBelakang == undefined ||
                    $scope.account.Email == "" ||
                    $scope.account.Email == undefined ||
                    $scope.account.PhoneNo == "" ||
                    $scope.account.PhoneNo == undefined ||
                    $scope.account.Password == "" ||
                    $scope.account.Password == undefined ||
                    $scope.account.SourceCandidate == "" ||
                    $scope.account.SourceCandidate == undefined) {
                    swalAlert.message('e', 'silahkan lengkapi data terlebih dahulu');
                } else if (!$scope.account.Email.includes('@')) {
                    swalAlert.message('e', 'Format email tidak sesuai');
                } else if ($scope.SyaratKetentuan == undefined) {
                    swalAlert.message('e', 'mohon menyetujui syarat dan ketentuan');
                } else if (dateNow < valDate) {
                    console.log(valDate);
                    swalAlert.message('e', "email sudah terdaftar");
                }
                else {
                    $('.spinner').fadeIn(500);
                    $(".OverlaySpinner").fadeIn(500);

                    var res2 = $http.post('api/Account/Submit', formData) //pake add Account, Account nyambung ke user
                        .then(function SuccessCallBack(response) {
                            if (response.data.isSucceed) {
                                //$window.alert(response.data.message); 
                                swalAlert.message('s', response.data.message);
                                window.location.href = "#!/login";
                            } else {
                                swalAlert.message('e', response.data.message);
                            }
                        },
                            function errorCallback(response) {
                                swalAlert.message('e', response.data.ExceptionMessage);
                            }).finally(function () {
                                $('.spinner').fadeOut(500);
                                $(".OverlaySpinner").fadeOut(500);
                            });
                    //clearForm();
                }
            });
        };


    }
})(angular.module('SunLifeApp'));