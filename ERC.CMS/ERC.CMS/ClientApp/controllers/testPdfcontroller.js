(function (app) {
    'use strict';
    app.controller('testPdfcontroller', testPdfcontroller);

    testPdfcontroller.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$location', 'localStorageService', '$stateParams', '_pdfCreate', '$q','$filter'];


    function testPdfcontroller($scope, myService, $http, $uibModal, $log, $document, $window, $location, localStorageService, $stateParams, _pdfCreate, $q, $filter) {
        var $ctrl = this;

        $scope.getData = function () {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            var candidateid = localStorageService.get('CandidateId');
            //var candidateid = $stateParams.id;
            $http({
                method: 'GET',
                url: 'api/RecruitmentForm/GeneratePDF',
                params: { CandidateId: candidateid }
            })
            .then(function (response) {
                $scope.PdfData = response.data;

                $scope.currentDay = "";
                var day = new Date($scope.PdfData.CandidateData.SubmitDate).getDay();

                if (day === 0) {
                    $scope.currentDay = 'Minggu';
                } else if (day === 1) {
                    $scope.currentDay = 'Senin';
                } else if (day === 2) {
                    $scope.currentDay = 'Selasa';
                } else if (day === 3) {
                    $scope.currentDay = 'Rabu';
                } else if (day === 4) {
                    $scope.currentDay = 'Kamis';
                } else if (day === 5) {
                    $scope.currentDay = 'Jumat';
                } else if (day === 6) {
                    $scope.currentDay = 'Sabtu';
                }
                $scope.PdfData.CandidateData.DayOfSubmitDate = $scope.currentDay;
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
            });
        }

        $scope.getData();
        
        $scope.test = function () {
            $(".spinner").fadeIn(100);
            $(".OverlaySpinnerPdf").fadeIn(100);
            $('#preview').hide();
            $('#printPdf').show();
            $("#printPdf").css("overflow-y", "hidden");
            var pageToprint = ["page-1", "page-2", "page-3", "page-4", "page-5", "page-6", "page-7", "page-8", "page-9", "page-10", "page-11", "page-12", "page-13", "page-14", "page-15", "page-16", "page-17", "page-18"];

            if ($scope.PdfData.CandidateData.NPWPNo && $scope.PdfData.CandidateData.NPWPNo.length > 10) { //jika ada npwp
                pageToprint = pageToprint.concat("page-19")
            }

            _pdfCreate.toPngObj(pageToprint, function (pages) {
                _pdfCreate.create(pages, 'file').then(function (data) {

                    $('#preview').show();
                    $('#printPdf').hide();
                    $(".spinner").fadeOut(400);
                    $(".OverlaySpinnerPdf").fadeOut(400);
                    $("#appiddd").css("overflow-y", "");
                    $rootScope.pdfResult = data.data;
                });
            }, function (err) {
                console.error(err);
            });
        }

   
        //$scope.test = function () {
        //    $('.spinner').fadeIn(500);
        //    $(".OverlaySpinner").fadeIn(500);
        //    $('.btnClear').hide();
        //    $('#page-1').show();
        //    $('#page-2').show();
        //    $('#page-3').show();
        //    $('#page-4').show();
        //    $('#page-10').show();
        //    $('#page-11').show();
        //    $('#page-12').show();
        //    $('#page-13').show();
        //    $('#page-14').show();
        //    $('#page-15').show();
        //    $('#page-16').show();
        //    $('#page-17').show();

        //    _pdfCreate.toPngObj(["page-1", "page-2", "page-3", "page-4", "page-5", "page-6", "page-7", "page-8", "page-9", "page-10", "page-11", "page-12", "page-13", "page-14", "page-15", "page-16", "page-17"], function (pages) {
        //        _pdfCreate.create(pages, 'file').then(function (data) {
        //            $('.btnClear').show();
        //            $('#page-1').hide();
        //            $('#page-2').hide();
        //            $('#page-3').hide();
        //            $('#page-4').hide();
        //            $('#page-10').hide();
        //            $('#page-11').hide();
        //            $('#page-12').hide();
        //            $('#page-13').hide();
        //            $('#page-14').hide();
        //            $('#page-15').hide();
        //            $('#page-16').hide();
        //            $('#page-17').hide();

        //            $rootScope.pdfResult = data.data;
        //            window.top.close();
        //            $('.spinner').fadeOut(500);
        //            $(".OverlaySpinner").fadeOut(500);
        //        });
        //    }, function(err){
        //        console.error(err);
        //    });
        //}
    }
})(angular.module('SunLifeApp'));