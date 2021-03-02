(function (app) {
    'use strict';
    app.controller('tentangSunlifeController', function ($scope, $rootScope, $http, $state, authService, $window, swalAlert, $location, localStorageService) {
        
        $scope.plajariLebihLanjut = function () {
            //$location.url('https://www.sunlife.co.id/ID/About+us?vgnLocale=in_ID');
            $window.location.href = "https://www.sunlife.co.id/ID/About+us?vgnLocale=in_ID";
            //document.getElementById("invitationLink").href = "https://www.sunlife.co.id/ID/About+us?vgnLocale=in_ID";
        }

        //================================IMAGE SLIDE SHOW=======================
        var slideIndex = 1;
        $scope.buttonNextClick = true;
        $scope.buttonPreviousClick = true;
        showDivs(slideIndex);

        $scope.plusDivs = function (n) {
            if (n > 0) {
                $scope.buttonNextClick = true;
                $scope.buttonPreviousClick = false;
            } else {
                $scope.buttonNextClick = false;
                $scope.buttonPreviousClick = true;
            }


            var x = document.getElementsByClassName("mySlides");
            var conditionButtonNext = x.length - 2;
            if ($scope.buttonNextClick & (slideIndex == conditionButtonNext)) {
                console.log(slideIndex);
            }
            else if ($scope.buttonPreviousClick & (slideIndex == 1 || slideIndex < 1)) {
                console.log(slideIndex);
            } else {
                console.log(slideIndex);
                showDivs(slideIndex += n);
            }


        }

        function showDivs(n) {

            var i;
            var x = document.getElementsByClassName("mySlides");

            // ini kan klo misalnya jumlah nextnya > 
            // dr jml banyaknya gambar di balikin lg ke gambar 1 (berguna untuk yang slide satu")
            /*if (n > x.length) {
                slideIndex = 1;
            }*/

            var conditionButtonNext = x.length - 2;

            if (n == conditionButtonNext) {
                $scope.buttonNextShow = false;
            }
            else {
                $scope.buttonNextShow = true;
            }

            if (n === 1 || n < 1) {
                $scope.buttonPreviousShow = false;
            } else {
                $scope.buttonPreviousShow = true;
            }           

            if (n <= conditionButtonNext & $scope.buttonNextClick) {
                //ini klo misalnya, sigambar di bawah 1, 
                //dia balik lg ke gambar paling ujung (berguna untuk yang slide satu")
                /*if (n < 1) {
                    slideIndex = x.length
                }*/

                for (i = 0; i < x.length; i++) {
                    x[i].style.display = "none";
                }

                //var sumViewImage = x.length - 2;
                var sumViewImage = 2;
                for (i = -1; i < sumViewImage; i++) {
                    var indexView = slideIndex + i;
                    /*if (indexView === x.length || indexView > x.length) {
                        indexView = 0;
                    }*/
                    x[indexView].style.display = "block";
                }
            }

            if ((n != 0 & $scope.buttonPreviousClick) & n >= 0) {
                //ini klo misalnya, sigambar di bawah 1, 
                //dia balik lg ke gambar paling ujung (berguna untuk yang slide satu")
                /*if (n < 1) {
                    slideIndex = x.length
                }*/

                for (i = 0; i < x.length; i++) {
                    x[i].style.display = "none";
                }

                //var sumViewImage = x.length - 2;
                var sumViewImage = 2;
                for (i = -1; i < sumViewImage; i++) {
                    var indexView = slideIndex + i;
                    /*if (indexView === x.length || indexView > x.length) {
                        indexView = 0;
                    }*/
                    x[indexView].style.display = "block";
                }
            }            

            //(berguna untuk yang slide satu")
            /*x[slideIndex - 1].style.display = "block";
            x[slideIndex - 0].style.display = "block";
            x[slideIndex + 1].style.display = "block";*/
        }

        //==================klik popup image Lightbox (Modal Image Gallery)===============

        $scope.openModal = function (n) {
        //function openModal() {
            document.getElementById("myModal").style.display = "block";
        }

        $scope.closeModal = function (n) {
        //function closeModal() {
            document.getElementById("myModal").style.display = "none";
        }

        var slideIndexPopup = 1;
        showSlides(slideIndexPopup);


        $scope.plusSlides = function (n) {
            showSlides(slideIndexPopup += n);
        }

        $scope.currentSlide = function (n) {
        //function currentSlide(n) {
            showSlides(slideIndexPopup = n);
        }

        function showSlides(n) {
            var i;
            var slides = document.getElementsByClassName("mySlides2");
            var dots = document.getElementsByClassName("demo");
            var captionText = document.getElementById("caption");
            if (n > slides.length) { slideIndexPopup = 1 }
            if (n < 1) { slideIndexPopup = slides.length }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndexPopup - 1].style.display = "block";
            dots[slideIndexPopup - 1].className += " active";
            captionText.innerHTML = dots[slideIndexPopup - 1].alt;
        }
        //===========================================================

        //function myFunction() {
        $scope.myFunction = function () {
            var dots = document.getElementById("dots");
            var moreText = document.getElementById("more1");
            var moreText2 = document.getElementById("more2");
            var btnText = document.getElementById("myBtn");

            if (dots.style.display === "none") {
                dots.style.display = "inline";
                btnText.innerHTML = "Lihat Selengkapnya"; //Read more
                moreText.style.display = "none";

                moreText2.style.display = "none";
            } else {
                dots.style.display = "none";
                btnText.innerHTML = "Lihat Lebih sedikit"; //Read less
                //moreText.style.display = "inline";
                moreText.style.display = "inline-flex";

                moreText2.style.display = "inline-flex";
            }
        }

    });
})(angular.module('SunLifeApp'));