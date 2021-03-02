(function (app) {
    'use strict';

    app.service('_pdfCreate', function ($q) {
        return {
            toPngObj: function(arr, callback, callbackErr, callbackProgress, index){
                var self = this, total = arr.length;
                if (typeof callback != 'function') callback = function(){}
                if (typeof callbackErr != 'function') callbackErr = function(){}
                if (typeof callbackProgress != 'function') callbackProgress = function(){}
                index = index || 0;
                self.toPng(arr[index]).then(function(img){
                    var percent = Math.round(index * 100 / total);
                    arr[index] = img;
                    index++;
                    if (index < total){
                        callbackProgress(index + "/" + total);
                        self.toPngObj(arr, callback, callbackErr, callbackProgress, index);
                    }else{
                        console.info("Successfull generate all images");
                        callback(arr);
                    }
                }, function(err){
                    console.error("Error Generating image for id: " + arr[index], err);
                    callbackErr(err);
                });
            },
            toPng: function(elementId){
                var imgData, q = $q.defer(),
                canvas = document.createElement("canvas"),
                element = document.getElementById(elementId),
                ctxPDF = canvas.getContext("2d");
                ctxPDF.fillStyle = "#FFFFFF";
                ctxPDF.fillRect(0, 0, 1055, 1800);
                canvas.setAttribute("width", "1050");
                canvas.setAttribute("height", "1490");
                window.canvasss = canvas = canvas;
                domtoimage.toPng(element).then(function(imgSrc){
                    var image = new Image();
                    image.src = imgSrc;
                    setTimeout(function(){
                        ctxPDF.drawImage(image, 0, 0, 1055, 1800);
                        imgData = canvas.toDataURL("image/jpeg", 1.0);
                    }, 500);
                    setTimeout(function(){
                        q.resolve(canvas);
                    }, 1000);
                }, function(err){
                    q.reject(err);
                });
                return q.promise;
            },
            create: function(pages, dataSource){
                var q = $q.defer();
                var pdf = new jsPDF("p", "px", [595, 842], true);
                dataSource = dataSource || 'blob';
                for (var i = 0; i < pages.length; i++) {
                    var temp = pages[i]
                    pdf.addImage(temp, 'JPEG', 0, 0);
                    if (pages[i + 1] != undefined){
                        pdf.addPage();
                    }               
                }
                if (dataSource == 'file'){
                    pdf.output('save', 'perjanjian keagenan.pdf');
                    q.resolve({
                        as: 'file',
                        data: 'Your file has been saved'
                    });
                }else if (dataSource == 'blob'){
                    var contentFile = pdf.output('blob');
                    var reader = new FileReader();
                    reader.readAsDataURL(contentFile); 
                    reader.onloadend = function(){
                        q.resolve({
                            as: 'blob',
                            data: reader.result
                        });
                    }
                }
                return q.promise;
            }

        //return {
        //    toPngObj: function (arr, callback, callbackErr, index) {
        //        var self = this, total = arr.length;
        //        index = index || 0;
        //        console.info("Generating image for id: " + arr[index]);
        //        self.toPng(arr[index]).then(function (img) {
        //            arr[index] = img;
        //            index++;
        //            if (index < total) {
        //                self.toPngObj(arr, callback, callbackErr, index);
        //            } else {
        //                console.info("Successfull generate all images");
        //                callback(arr);
        //            }
        //        }, function (err) {
        //            callbackErr(err);
        //        });
        //    },
        //    toPng: function (elementId) {
        //        var q = $q.defer(),
        //        canvas = document.createElement("canvas"),
        //        element = document.getElementById(elementId),
        //        ctxPDF = canvas.getContext("2d");


        //        ctxPDF.fillStyle = "#FFFFFF";

        //        ctxPDF.fillRect(0, 0, 1055, 1800);
        //        canvas.setAttribute("width", "1050");
        //        canvas.setAttribute("height", "1490");

        //                //ctxPDF.fillRect(0, 0, element.clientWidth,  element.clientHeight);
        //                //canvas.setAttribute("width",  element.clientWidth);
        //                //canvas.setAttribute("height",  element.clientHeight);
        //        var specialElementHandlers = {
        //            // element with id of "bypass" - jQuery style selector
        //            '.btnClear': function (element, renderer) {
        //                // true = "handled elsewhere, bypass text extraction"
        //                return true
        //            }
        //        };

        //        domtoimage.toPng(element, {
        //            width: element.clientWidth,
        //            height: element.clientHeight

        //        }).then(function (imgSrc) {
        //            var image = new Image();
        //            image.src = imgSrc;
        //            setTimeout(function () {

        //                ctxPDF.drawImage(image, 0, 0, 1055, 1800);
        //                                //ctxPDF.drawImage(image, 0, 0, element.clientWidth, element.clientHeight);
        //                var imgDataOne = canvas.toDataURL("image/jpeg", 1.0);
        //            }, 500);
        //            setTimeout(function () {
        //                q.resolve(canvas);
        //            }, 1000);
        //        }, function (err) {
        //            q.reject(err);
        //        });
        //        return q.promise;

        //    },
        //    create: function (pages, dataSource) {
        //        var q = $q.defer();
        //        //var pdf = new jsPDF("p", "px", [720, 1700], true);
        //        var pdf = new jsPDF("p", "px", [595, 842], true);
        //        //var pdf = new jsPDF("p", "px", [1240 , 1754], true);

        //        dataSource = dataSource || 'blob';

        //        for (var i = 0; i < pages.length; i++) {
        //            var temp = pages[i]
        //            pdf.addImage(temp, 'JPEG', 0, 0);
        //            if (pages[i + 1] != undefined) {
        //                pdf.addPage();
        //            }
        //        }
        //        if (dataSource == 'file') {
        //            pdf.output('save', 'perjanjian keagenan.pdf');
        //            q.resolve({
        //                as: 'file',
        //                data: 'Your file has been saved'
        //            });
        //        } else if (dataSource == 'blob') {
        //            var contentFile = pdf.output('blob');
        //            var reader = new FileReader();
        //            reader.readAsDataURL(contentFile);
        //            reader.onloadend = function () {
        //                q.resolve({
        //                    as: 'blob',
        //                    data: reader.result
        //                });
        //            }
        //        }
        //        return q.promise;
        //    }
        }
    });
})(angular.module('SunLifeApp'));