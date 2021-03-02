(function (app) {
    'use strict';

    app.service('aesService', aesService);
    aesService.$inject = ['$q']
    function aesService($q) {
        return {
            encrypt: function (myString) {
                var key = CryptoJS.enc.Utf8.parse('8080808080808080');
                //var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
                var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
                var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(myString), key,
                    {
                        keySize: 128 / 8,
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                return (encrypted.toString());
            }
        }
    };
})(angular.module('SunLifeApp'));