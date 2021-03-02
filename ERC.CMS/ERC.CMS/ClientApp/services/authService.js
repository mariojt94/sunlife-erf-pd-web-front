(function (app) {

    'use strict';
    app.factory('authService', ['$http', '$rootScope', '$q', 'localStorageService', 'ngAuthSettings', 'aesService', function ($http, $rootScope, $q, localStorageService, ngAuthSettings, aesService) {

        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            roleName: "",
            typeStyle: "",
            loginHistoryId: ""
        };

        var _login = function (loginData) {
            var currentUsername = aesService.encrypt(loginData.userName);
            var currentPassword = aesService.encrypt(loginData.password);

            var data = "grant_type=password&username=" + currentUsername //loginData.userName
                + "&password=" + currentPassword
                + "&client_id=" + ngAuthSettings.clientId;

            var deferred = $q.defer();

            //$http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            $http.post('/token', data, { })
                .then(function SuccessCallBack(response) {
                    localStorageService.set('authorizationData', { token: response.data.access_token, userName: response.data.userName, roleName: response.data.roleName, loginHistoryId: response.data.loginHistoryId });
                    _authentication.isAuth = true;
                    _authentication.userName = currentUsername; //loginData.userName;
                    _authentication.roleName = localStorageService.get('authorizationData').roleName;
                    _authentication.loginHistoryId = localStorageService.get('authorizationData').loginHistoryId;
                    deferred.resolve(response);
                }, function errorCallback(err) {
                    _logOut();
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        var _logOut = function () {

            localStorage.removeItem('ls.authorizationData');
            localStorage.removeItem('ls.LoginData');
            localStorage.removeItem('ls.LoginName');
            localStorage.removeItem('ls.statusDataPribadi');
            localStorage.removeItem('ls.statusKontak');
            localStorage.removeItem('ls.statusDataKeluarga');
            localStorage.removeItem('ls.statusDataPendidikan');
            localStorage.removeItem('ls.statusDataPekerjaan');
            localStorage.removeItem('ls.statusDataDokumen');
            localStorage.removeItem('ls.statusDataPsikotes');
            //localStorageService.remove('ls.authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
        };

        var _updateLoginHistory = function () {
            var deferred = $q.defer();
            $http.post('/api/LoginHistory/UpdateLoginHistoryLogoutDate?loginHistoryId=' + localStorageService.get('authorizationData').loginHistoryId)
                .then(function SuccessCallBack(response) {
                    deferred.resolve(response);
                }, function errorCallback(err) {
                    deferred.reject(err);
                });
        }

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.roleName = authData.roleName;
                _authentication.typeStyle = authData.typeStyle;
                _authentication.loginHistoryId = authData.loginHistoryId;
                $rootScope.layout = authData.typeStyle;
            }
        };

        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.updateLoginHistory = _updateLoginHistory;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }]);
})(angular.module('SunLifeApp'));