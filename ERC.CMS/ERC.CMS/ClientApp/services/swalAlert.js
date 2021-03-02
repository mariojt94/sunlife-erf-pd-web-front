(function (app) {
    'use strict';

    app.service('swalAlert', swalAlert);
    swalAlert.$inject = ['$q'];
    function swalAlert($q) {
        return {
            message: function (type, text) {
                var listType = {
                    s: 'success',
                    e: 'error',
                    i: 'info',
                    d: 'danger',
                    q: 'question'
                }

                var title = 'Informasi';

                swal({
                    title: title,
                    text: text,
                    allowOutsideClick: false,
                    type: listType[type]
                })
            },
            confirm: function (callback) {
                swal({
                    title: 'Apakah anda yakin?',
                    text: 'Data yang sudah dihapus tidak dapat di kembalikan',
                    showCancelButton: true,
                    allowOutsideClick: false,
                    type: "warning",
                }).then(
              function (result) {
                  callback(result);
              }, function (dismiss) {
                  //nothing
              }
            );
            },
            confirmPDF: function (callback) {
                swal({
                    title: '',
                    text: 'Apakah anda yakin Akan mengirimkan dokumen?',
                    showCancelButton: true,
                    allowOutsideClick: false,
                    type: "info",
                }).then(
              function (result) {
                  callback(result);

              }, function (dismiss) {
                  //nothing
              }
            );
            },
            confirmPsikotes: function (callback) {
                swal({
                    title: '',
                    text: 'Apakah anda yakin Akan kembali? Data tidak akan tersimpan',
                    showCancelButton: true,
                    allowOutsideClick: false,
                    type: "info",
                }).then(
              function (result) {
                  callback(result);

              }, function (dismiss) {
                  //nothing
              }
            );
            },
            confirmCustom: function (text, callback) {
                swal({
                    title: 'INFORMASI',
                    text: text,
                    allowOutsideClick: false,
                    type: "info",
                }).then(
              function (result) {
                  callback(result);
              }, function (dismiss) {
                  //nothing
              }
            );
            },
            confirmCallback: function (text, callback) {
                swal({
                    title: 'INFORMASI',
                    text: text,
                    allowOutsideClick: false,
                    type: "info",
                }).then(
              function (result) {
                  callback(result);
              }, function (dismiss) {
                  //nothing
              }
            );
            },
            testapprove: function () {
                var q = $q.defer();
                var name = swal({
                    title: 'Alasan Reject?',
                    input: 'text',
                    showCancelButton: true,
                    allowOutsideClick: false,
                    inputValidator: (value) => {
                        return !value && 'Masukkan alasan anda menolak kandidat ini'
                    }
                });
                q.resolve(name);
                return q.promise;
            }
        }
    };
})(angular.module('SunLifeApp'));