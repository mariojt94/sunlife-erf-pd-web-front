(function (app) {
    'use strict';

    app.controller('menuCtrl', function ($window, $scope, $http, $state, authService, localStorageService, swalAlert) {
        $scope.username = (authService.authentication.userName);
        $scope.rolename = (authService.authentication.roleName);


        var originatorEv;

        $scope.$mdMenu ={
open: this.open
        }


        setTimeout(function () {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            $http({
                method: 'GET',
                url: '/api/Account/GetUser/',
                params: { loginName: $scope.username },
            })
        .then(function (response) {
            $scope.roleName = response.data.RoleName;// == "admin" ? 1 : 0;
            $scope.roleId = response.data.RoleID;// == "admin" ? 1 : 0;
            $scope.DisplayName = response.data.DisplayName;
            $scope.Photo = response.data.Photo

            //bind link by role name
            $http({
                method: 'GET',
                url: 'api/RoleMenu/GetCurrentRoleMenu',
                params: { RoleId: $scope.roleId },
            })
            .then(function (response) {
                $scope.listLink = response.data;
                
                //console.log($scope.listLink);
                // untuk save access menu by role ke localstorage
                //var data = $scope.listLink;                
                //var accessmenu = [];
                //var length = $scope.listLink.length;
                //for (var i = 0; i < length; i++) {
                //    accessmenu.push(
                //        {
                //            'RoleId': $scope.roleId,
                //            'MenuId': data[i].MenuId,
                //            'MenuName': data[i].MenuName,
                //            'Link': data[i].Link,
                //            'View': data[i].View,
                //            'Add': data[i].Add,
                //            'Edit': data[i].Edit,
                //            'Delete': data[i].Delete
                //        });
                //};
                //localStorageService.set('AccessMenu', accessmenu);
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
            }, function (response) {
                $scope.status = response.status;
            });
        }, function (response) {
            $scope.user = response.data || 'Request failed';
            $scope.status = response.status;
            $('.spinner').fadeOut(500);
            $(".OverlaySpinner").fadeOut(500);
        });

        }, 100);

        $scope.isEnable

        $scope.gotoJadwalAaji = function () {
            localStorage.setItem('shortCutAaji', '1');
            $state.go('jadwalAaji');
        }

        $scope.chooseMenu = function (evt) {
        }
        $scope.setMenuActive = function () {
            var currentUrl = $window.location.hash;
            var listMenu = ['location', 'team', 'account', 'ExamResult', 'bank', 'aml', 'google', 'city', 'cekaaji', 'hierarki', 'examLocation', 'jadwalAajiCms', 'account']

            if (currentUrl.indexOf("location") != -1 || currentUrl.indexOf("team") != -1 || currentUrl.indexOf("account") != -1 || currentUrl.indexOf("jadwalAajiCms") != -1
                || currentUrl.indexOf("ExamResult") != -1 || currentUrl.indexOf("bank") != -1 || currentUrl.indexOf("examLocation") != -1 || currentUrl.indexOf("cekaaji") != -1
                || currentUrl.indexOf("aml") != -1 || currentUrl.indexOf("google") != -1 || currentUrl.indexOf("city") != -1 || currentUrl.indexOf("hierarki") != -1
                ) {
                $('.side-menu ul li:nth-child(1)').addClass('active');
            } else if (currentUrl.indexOf("documentCheck") != -1) {
                $('.side-menu ul li:nth-child(2)').addClass('active');
            } else if (currentUrl.indexOf("DownloadCms") != -1) {
                $('.side-menu ul li:nth-child(3)').addClass('active');
            } else if (currentUrl.indexOf("UserRoleCms") != -1) {
                $('.side-menu ul li:nth-child(5)').addClass('active');
            } else if (currentUrl.indexOf("DokumenStatusCms") != -1) {
                $('.side-menu ul li:nth-child(4)').addClass('active');
            }
        }
        $scope.setMenuActive();
        $scope.cekIsAllow = function (str) {
            var result = false;
            if ($scope.listLink) {

                //for (var i = $scope.listLink.length - 1; i >= 0; --i) {
                //    if ($scope.listLink[i].Link.toLowerCase().indexOf(str.toLowerCase()) != -1) {
                //        result = true; break;
                //    }
                //}
                var temp = $scope.listLink.filter(x=>x.MenuName == str)
                if (temp && temp.length > 0) {
                    result = true;
                }
            }

            return result;
        }

        var $h3s = $('.side-menu ul li').click(function () {
            var h = $("a", this)[0].innerText;
            var cekLink = '';
            if (h == 'UPLOAD') {
                cekLink = "#!/location"
            } else if (h == 'DOKUMEN CEK') {
                cekLink = "#!/documentCheck"
            } else if (h == 'DOWNLOAD') {
                cekLink = "#!/DownloadCms"
            } else if (h == 'DOKUMEN STATUS') {
                cekLink = "#!/DokumenStatusCms"
            } else if (h == 'USER ROLE') {
                cekLink = "#!/UserRoleCms"
            } else if (h == 'DASHBOARD') {
                cekLink = "#!/HomePageCms"
            }

            //if ($scope.cekIsAllow(cekLink)) {
            if (cekLink && cekLink.length > 2 && cekLink != null) {
                window.location.href = cekLink;
            }
            //} else {
            //    swalAlert.message('i', 'you cant access this');
            //  }
        });

        var $homebuttonss = $('.menu-profile ul li').click(function () {
            var h = '#!/homePageCMS';
            if ($scope.rolename == 'Admin') {
                //if ($scope.cekIsAllow(h)) {
                window.location.href = h;
                //} else {
                //    swalAlert.message('i', 'you cant access this');
                //}
            }
        });
    });

})(angular.module('SunLifeApp'));