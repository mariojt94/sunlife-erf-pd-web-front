(function (app) {
    'use strict';
    app.controller('changePasswordController', changePasswordController);

    changePasswordController.$inject = ['$scope', '$http', 'authService', 'swalAlert', '$stateParams', '$window','$state'];

    function changePasswordController($scope, $http, authService, swalAlert, $stateParams, $window, $state) {

        //kalo mau http post ngirim string biasa doang, di sini mesti pake "=" dulu
        $scope.link = "=" + $stateParams.link;
        console.log($scope.link);
        $http.post('api/Account/ValidateChangePassLink',
                $scope.link,
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
            .then(function (response) {
                if (response.data.isSucceed === true) {
                    console.log("sukses");
                } else {
                    //swal yg ini bisa di then. ada yg engga, liat di swalalert.js
                    swal({
                        title: 'info',
                        text: "anda tidak memiliki hak akses"
                    }).then(function (res) {
                        if (res) {
                            console.log("ga boleh");
                            window.close();
                        }
                    });
                }
            });

        var reqLoginName = $http({ method: 'GET', url: 'api/Account/GetUserFromForgot', params: { link: $stateParams.link } }).then(
              function (response) {
                  console.log(response.data);
                  $scope.loginName = response.data;
                  return response.data;

              });
        reqLoginName.then(function (loginName) {
            console.log(loginName);

            //ini nge chain var nya pake then
            //refer to this : https://stackoverflow.com/questions/32912637/saving-an-http-response-object-as-a-scope-variable
            $scope.submit = function () {
                $scope.changePassData.loginName = loginName;
                $('.spinner').fadeIn(2500);
                $(".OverlaySpinner").fadeIn(2500);
                $http.post("api/Account/ChangePasswordUserForgot", $scope.changePassData).then(function (res) {
                    JSON.stringify(res.data);
                    if (res.data.isSucceed == true) {
                        swalAlert.message('i', res.data.message);
                        $('.spinner').fadeOut(2500);
                        $(".OverlaySpinner").fadeOut(2500);
                        /*$state.go('auth');
                        window.location = "http://104.154.84.84:1237/";*/
                        window.location.href = "#!/login";
                    } else {
                        swalAlert.message('e', res.data.message);
                        $('.spinner').fadeOut(500);
                        $(".OverlaySpinner").fadeOut(500);
                    }
                });
            }
        });


        
    }

})(angular.module('SunLifeApp'));