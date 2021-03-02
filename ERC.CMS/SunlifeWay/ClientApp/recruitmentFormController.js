(function (app) {
    'use strict';
    app.controller('recruitmentFormController', recruitmentFormController);
    app.controller('popUpManagerCtrl', popUpManagerCtrl);
    app.controller('popUpLocationController2', popUpLocationController2);


    recruitmentFormController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$stateParams', '$state', 'authService', '$compile', '$timeout', 'swalAlert', '$q'];
    photoUploadController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$base64', '$stateParams', 'swalAlert'];
    popUpManagerCtrl.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];
    popUpExamLocationController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];
    popUpCalendarController.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', '$compile', '$timeout', 'uiCalendarConfig', 'swalAlert'];
    popUpLocationController2.$inject = ['$scope', 'myService', '$http', '$uibModal', '$log', '$document', '$window', 'swalAlert'];

    app.component('photoUploadComponent64', {
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

                var typeFile = dataResolve.PhotoType;

                $ctrl.uploadFile64 = function () {
                    var foto = $scope.photoFile;
                    var size = foto.filesize;
                    var filetype = foto.filetype;
                    if (!(filetype == 'image/jpeg' || filetype == 'image/png')) {
                        //alert('Pastikan file yang diupload berformat jpg / png / image file');
                        swalAlert.message('i', 'Pastikan file yang diupload berformat jpg / png / image file');
                    } else if (size > 1000000) {
                        swalAlert.message('i', 'Max Size 1 MB !')
                    }
                    else {
                        $('.spinner').fadeIn(500);
                        $(".OverlaySpinner").fadeIn(500);
                        $http.post('api/FileUpload/Base64Image',
                        { Base64String: 'data:' + foto.filetype + ";base64," + foto.base64 })
                        .then(function SuccesCallbBack(response) {
                            if (response.data.isSucceed) {
                                var str = response.data.returnValue;
                                var strSplit = str.split('#');
                                if (typeFile === 'KTP') {
                                    dataResolve.photoKtpId = strSplit[0];
                                    dataResolve.photoKtp = strSplit[1];
                                }
                                else if (typeFile === 'DIRI') {
                                    dataResolve.photoDiriId = strSplit[0];
                                    dataResolve.photoDiri = strSplit[1];
                                }
                                else if (typeFile === 'NPWP') {
                                    dataResolve.photoNpwpId = strSplit[0];
                                    dataResolve.photoNpwp = strSplit[1];
                                }
                                else if (typeFile === 'KK') {
                                    dataResolve.photoKkId = strSplit[0];
                                    dataResolve.photoKk = strSplit[1];
                                }
                                else if (typeFile === 'TABUNGAN') {
                                    dataResolve.photoBukuTabunganId = strSplit[0];
                                    dataResolve.photoBukuTabungan = strSplit[1];
                                }
                                else if (typeFile === 'TRANSFER') {
                                    dataResolve.photoBuktiTransferId = strSplit[0];
                                    dataResolve.photoBuktiTransfer = strSplit[1];
                                }
                                // alert(response.data.message); sesuai uat 8 mart hilangkan info sukses upload
                                $ctrl.cancel();
                            }
                            else {
                                //alert(response.data.message);
                                swalAlert.message('e', response.data.message);
                            }
                        }, function errorCallback(response) {
                            swalAlert.message('e', response.data.exceptionMessage);
                        }).finally(function () {
                            $('.spinner').fadeOut(500);
                            $(".OverlaySpinner").fadeOut(500);
                        });
                    }
                };

            }
        }
    });

    app.component('managerComponent', {
        templateUrl: 'managerPopUp.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpManagerCtrl
    });

    app.component('photoUploadContent', {
        templateUrl: 'photoUploadContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: photoUploadController
    });

    app.component('calendarComponent', {
        templateUrl: 'calendarContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpCalendarDetailController
    });

    app.component('examLocationComponent', {
        templateUrl: 'examLocationContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpExamLocationController
    });

    app.component('locationComponent2', {
        templateUrl: 'locationContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: popUpLocationController2
    });

    function photoUploadController($scope, myService, $http, $uibModal, $log, $document, $window, $base64, $stateParams, swalAlert) {
        var $ctrl = this;
        $ctrl.animationsEnabled = true;
        $scope.candidateId = $stateParams.candidateid;


        $ctrl.uploadFile = function () {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            var file = $scope.myFile;
            var fd = new FormData();
            fd.append('file', file);
            $http.post('api/UploadFileDataPelengkap/UploadFile', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function SuccesCallbBack(response) {
                if (response.data.isSucceed) {
                    var str = response.data.returnValue;
                    var strSplit = str.split('#');
                    if (typeFile === 'KTP') {
                        dataResolve.photoKtpId = strSplit[0];
                        dataResolve.photoKtp = strSplit[1];
                    }
                    else if (typeFile === 'DIRI') {
                        dataResolve.photoDiriId = strSplit[0];
                        dataResolve.photoDiri = strSplit[1];
                    }
                    else if (typeFile === 'NPWP') {
                        dataResolve.photoNpwpId = strSplit[0];
                        dataResolve.photoNpwp = strSplit[1];
                    }
                    else if (typeFile === 'KK') {
                        dataResolve.photoKkId = strSplit[0];
                        dataResolve.photoKk = strSplit[1];
                    }
                    else if (typeFile === 'TABUNGAN') {
                        dataResolve.photoBukuTabunganId = strSplit[0];
                        dataResolve.photoBukuTabungan = strSplit[1];
                    }
                    else if (typeFile === 'TRANSFER') {
                        dataResolve.photoBuktiTransferId = strSplit[0];
                        dataResolve.photoBuktiTransfer = strSplit[1];
                    }
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                    swalAlert.message('s', response.data.message);
                    $ctrl.close();
                }
                else {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                    swalAlert.message('e', response.data.message);
                }
                //dataResolve.loadPhoto();
            }, function errorCallback(response) {
                swalAlert.message('e', response.data.ExceptionMessage);
            });
        };

        $ctrl.uploadFileBase64 = function () {
            //$http.post('/api/Account/ChangeUserPhoto',
            //{ Photo: 'data:' + $scope.photoFile.filetype + ";base64," + $scope.photoFile.base64 })
            //.then(function SuccesCallbBack(response) {
            //    if (response.data.isSucceed) {
            //        $window.alert(response.data.message);
            //    }
            //    else {
            //        $window.alert(response.data.message);
            //    }
            //}, function errorCallback(response) {
            //    $window.alert(response.data.exceptionMessage);
            //});
            var tes = $scope.photoFile;
        };



    }

    function recruitmentFormController($scope, myService, $http, $uibModal, $log, $document, $window, $stateParams, $state, authService, $compile, $timeout, swalAlert, $q) {

        $scope.$watch('tandaTanganUpload1', function (newValue, oldValue) {
            if (newValue) {
                var b64ttd = 'data:' + newValue.filetype + ";base64," + newValue.base64;
                $scope.tandanTangan1 = b64ttd;
            }
        });
        $scope.$watch('tandaTanganUpload2', function (newValue, oldValue) {
            if (newValue) {
                var b64ttd = 'data:' + newValue.filetype + ";base64," + newValue.base64;
                $scope.tandanTangan2 = b64ttd;
            }
        });

        // percobaan pindah js
        //var wrapper = document.getElementById("signature-pad");
        //var clearButton = wrapper.querySelector("[data-action=clear]");
        //var canvas = wrapper.querySelector("canvas");

        //var wrapper2 = document.getElementById("signature-pad2");
        //var clearButton2 = wrapper2.querySelector("[data-action=clear]");
        //var canvas2 = wrapper2.querySelector("canvas");

        //var signaturePad = new SignaturePad(canvas, {
        //    backgroundColor: 'rgb(255, 255, 255)'
        //});

        //var signaturePad2 = new SignaturePad(canvas2, {
        //    backgroundColor: 'rgb(255, 255, 255)'
        //});

        //clearButton.addEventListener("click", function (event) {
        //    signaturePad.clear();
        //});

        //clearButton2.addEventListener("click", function (event) {
        //    signaturePad2.clear();
        //});

        function resizeCanvas() {
            var ratio = Math.max(window.devicePixelRatio || 1, 1);

            //canvas.width = canvas.offsetWidth * ratio;
            //canvas.height = canvas.offsetHeight * ratio;
            //canvas.getContext("2d").scale(ratio, ratio);
            //signaturePad.clear();

            //canvas2.width = canvas2.offsetWidth * ratio;
            //canvas2.height = canvas2.offsetHeight * ratio;
            //canvas2.getContext("2d").scale(ratio, ratio);
            //signaturePad2.clear();
        }
        //window.onresize = resizeCanvas;
        //resizeCanvas();


        var $ctrl = this;

        var collapse = false;

        $scope.currentPagePerjanjianAgen = 1;
        //console.log($scope.currentPagePerjanjianAgen);
        $scope.PerjanjianPage = function (page, status) {
            if (collapse) {
                $('.general-layoutfixed-container').scrollTop(0);
            } else {
                $('#suratPerjanjian').scrollTop(0);
            }
            if (page == 1) {
                $('#page-1').show();
                $('#page-2').hide();
                $('#page-3').hide();
            } else if (page == 2) {
                $('#page-1').hide();
                $('#page-2').show();
                $('#page-3').hide();
            } else if (page == 3) {
                $('#page-1').hide();
                $('#page-2').hide();
                $('#page-3').show();
            } else if (page > 3) {
                $scope.moveNext(12);
                if (collapse) {
                    $scope.setCollapse();
                }

            }

            if (status == 'next') {
                $scope.isPerjanjianPage = false;
                $scope.currentPagePerjanjianAgen += 1;
                if ($scope.currentPagePerjanjianAgen === 4) {
                    $scope.currentPagePerjanjianAgen = 3;
                }

            } else if (status == 'back') {
                $scope.isPerjanjianPage = true;
                $scope.currentPagePerjanjianAgen -= 1;

            }
        };

        $scope.PerjanjianPage(1);

        $scope.setCollapse = function () {
            if (collapse) {
                $('#btnPreview').text('Perbesar Tampilan');
                setMenuLarger();
                collapse = false;
            } else {
                $('#btnPreview').text('Tampilkan Menu');
                collapse = true;
                setMenuSmaller();
            }
        }

        var setMenuSmaller = function () {
            //$('#leftMenu').removeClass('col-md-3').addClass('col-md-1');
            $('#leftMenu').hide();
            $('#suratPerjanjian').removeClass('div2');
            $('#rightMenu').removeClass('col-md-9').addClass('col-md-11');
        }

        var setMenuLarger = function () {
            //$('#leftMenu').removeClass('col-md-1').addClass('col-md-3');
            $('#leftMenu').show();
            $('#suratPerjanjian').addClass('div2');
            $('#rightMenu').removeClass('col-md-11').addClass('col-md-9');
        }

        //dependency
        $scope.listDependencies = [];
        var clearDependencies = function () {

            $scope.dependency.Status = "";
            $scope.dependency.Name = "";
            $scope.dependency.BirthDate = "";

        }
        $scope.addDependency = function (data) {
            if (!data ||
                    data.Status === undefined || data.Status === "" ||
                    data.Name === undefined || data.Name === "" ||
                    data.BirthDate === undefined || data.BirthDate === ""
                ) {
                swalAlert.message('i', 'Pastikan data tanggungan sudah terisi dengan lengkap');
                return false;
            } else {

                var id = $scope.listDependencies.length + 1;
                $scope.listDependencies.push({
                    Id: id,
                    Status: data.Status,
                    Name: data.Name,
                    BirthDate: data.BirthDate
                });
                clearDependencies();
                return true;
            }

        }

        //education
        $scope.listEducation = [];

        var clearEducation = function () {
            $scope.education.InstitutionName = "";
            $scope.education.YearFrom = "";
            $scope.education.YearTo = "";
            $scope.education.Level = "";
        }

        $scope.addEducation = function (data) {
            if (data === undefined || data.InstitutionName === undefined || data.InstitutionName === "" || data.YearFrom === undefined || data.YearFrom === "" ||
                data.YearTo === undefined || data.YearTo === "" || data.Level === undefined || data.Level === "") {
                swalAlert.message('i', 'Harap isi data Pendidikan dengan lengkap');
                return false;
            } else {

                var id = $scope.listEducation.length + 1;
                $scope.submitted4 = false;
                $scope.listEducation.push({
                    Id: id,
                    InstitutionName: data.InstitutionName,
                    YearFrom: data.YearFrom,
                    YearTo: data.YearTo,
                    Level: data.Level
                });
                clearEducation();
                return true;
            }
        }

        //experience

        $scope.listExperience = [];

        var clearExperience = function () {
            $scope.experience.CompanyName = "";
            $scope.experience.QuitReason = "";
            $scope.experience.Position = "";
            $scope.experience.ToDate = "";
            $scope.experience.FromDate = "";

        }
        $scope.addExperience = function (data) {

            if (data === null || data === undefined ||
                    data.CompanyName === undefined || data.CompanyName === "" ||
                    data.QuitReason === undefined || data.QuitReason === "" || !data.Position || !data.FromDate || !data.ToDate
                ) {
                swalAlert.message('i', 'Pastikan data pengalaman sudah terisi dengan lengkap');
                return false;
            } else {
                var id = $scope.listExperience.length + 1;
                $scope.listExperience.push({
                    Id: id,
                    CompanyName: data.CompanyName,
                    QuitReason: data.QuitReason,
                    Position: data.Position,
                    ToDate: data.ToDate,
                    FromDate: data.FromDate
                });
                clearExperience();
                $scope.submitted5 = false;
                return true;
            }
        }

        //work experience

        $scope.listWorkExperienceInInsurance = [];

        var clearWorkExperience = function () {
            $scope.workExperience.CompanyName = "";
            $scope.workExperience.LastPosition = "";
            $scope.workExperience.MainOfficeAddress = "";
            $scope.workExperience.HasBeenJoinFor = "";
            $scope.workExperience.TerminateDate = "";
            $scope.workExperience.OldAgentCode = "";
        }
        $scope.addWorkExperience = function (data) {

            //if (
            //        data === undefined || data === null ||
            //        data.LastPosition === undefined || data.LastPosition === "" ||
            //        data.MainOfficeAddress === undefined || data.MainOfficeAddress === "" ||
            //        data.CompanyName === undefined || data.CompanyName === "" ||
            //        data.HasBeenJoinFor === undefined || data.HasBeenJoinFor === "" ||
            //        data.TerminateDate === undefined || data.TerminateDate === "" ||
            //        data.OldAgentCode === undefined || data.OldAgentCode === ""
            //    ) {
            //    alert('Pastikan data pengalaman bekerja di bidang asuransi sudah terisi dengan lengkap');
            //    return false;
            //} else {
            var id = $scope.listWorkExperienceInInsurance.length + 1;
            $scope.listWorkExperienceInInsurance.push({
                Id: id,
                CompanyName: data.CompanyName,
                LastPosition: data.LastPosition,
                MainOfficeAddress: data.MainOfficeAddress,
                HasBeenJoinFor: data.HasBeenJoinFor,
                TerminateDate: moment(data.TerminateDate),
                OldAgentCode: data.OldAgentCode
            });
            clearWorkExperience();
            $scope.submitted6 = false;
            return true;
            //}
        }

        //relation

        $scope.listRelation = [];

        var clearRelation = function () {
            $scope.relation.Name = "";
            $scope.relation.Relation = "";
            $scope.relation.CompanyName = "";
            $scope.relation.Position = "";
            $scope.relation.Year = "";

        }
        $scope.addRelation = function (data) {

            if (
                    data === undefined || data === null ||
                    data.Name === undefined || data.Name === "" ||
                    data.Relation === undefined || data.Relation === "" ||
                    data.CompanyName === undefined || data.CompanyName === "" ||
                    data.Position === undefined || data.Position === "" ||
                    data.Year === undefined || data.Year === ""
                ) {
                swalAlert.message('i', 'Pastikan data pengalaman bekerja di bidang asuransi sudah terisi dengan lengkap');
                return false;
            } else {
                var id = $scope.listRelation.length + 1;
                $scope.listRelation.push({
                    Id: id,
                    Name: data.Name,
                    Relation: data.Relation,
                    CompanyName: data.CompanyName,
                    Position: data.Position,
                    Year: data.Year
                });
                clearRelation();
                $scope.submitted7 = false;
                return true;
            }
        }

        //reference

        $scope.listReference = [];

        var clearReference = function () {
            $scope.reference.Name = "";
            $scope.reference.Organization = "";
            $scope.reference.Relation = "";
            $scope.reference.PhoneNumber = "";
            $scope.reference.HasKnownFor = "";

        }
        $scope.addReference = function (data) {

            //if (
            //        data === null || data === undefined ||
            //        data.Name === undefined || data.Name === "" ||
            //        data.Organization === undefined || data.Organization === "" ||
            //        data.Relation === undefined || data.Relation === "" ||
            //        data.PhoneNumber === undefined || data.PhoneNumber === "" ||
            //        data.HasKnownFor === undefined || data.HasKnownFor === ""
            //    ) {
            //    alert('Pastikan data referensi sudah terisi dengan benar');
            //    return false;
            //} else {
            var id = $scope.listReference.length + 1;
            $scope.listReference.push({
                Id: id,
                Name: data.Name,
                Relation: data.Relation,
                PhoneNumber: '62' + data.PhoneNumber,
                Organization: data.Organization,
                HasKnownFor: data.HasKnownFor
            });
            clearReference();
            $scope.submitted8 = false;
            return true;
            //}
        }

        $ctrl.animationsEnabled = true;
        $scope.ispendingdocument = 0;
        $scope.ispendingdocument = $stateParams.ispendingdocument;

        if ($stateParams.candidateid !== undefined || $stateParams.candidateid !== null) {
            $scope.candidateId = $stateParams.candidateid;
        } else {
            $scope.candidateId = localStorageService.get('CandidateId');
        }

        var fillNotifPendingDoc = function (candidateid) {
            $http({
                method: 'GET',
                url: 'api/PendingDocument/GetNotifPendingDocument',
                params: { CandidateId: candidateid }
            })
            .then(function (response) {
                $scope.notifpendingdocument = response.data;

            });
        };

        if ($scope.ispendingdocument !== null) {
            fillNotifPendingDoc($scope.candidateId);
        }

        if ($stateParams.ispendingdocument !== undefined) {
            $scope.isPendingDocument = $stateParams.ispendingdocument;
        }

        //untuk ptkp
        $scope.setGender = function () {
            if ($scope.candidate.Gender === 'P') {
                $scope.selectedGender = 'WANITA';
            } else {
                $scope.selectedGender = 'LAKI-LAKI';
            }
        }

        //watch selected gender 
        $scope.$watch("selectedGender", function (newValue, oldValue) {
            if (newValue && newValue != oldValue) {
                clearPTKP();
            }
        });

        //#region current date for aggrement letter
        var currentdate = new Date();
        $scope.currentDate = currentdate.getDate() + ' - ' + Number(currentdate.getMonth() + 1) + ' - ' + currentdate.getFullYear();
        var day = currentdate.getDay();
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

        //#endregion
        //#region PTKP-------------------------------------------------------------------------------
        $scope.ptkp = [];
        $scope.cb = [];

        $scope.listPTKP = [
            { id: '0', value: 'Hanya dikenakan PTKP di PT Sun Life Financial Indonesia' },
            { id: '1', value: 'Telah dikenakan PTKP sehubungan dengan pekerjaan di perusahaan lain' }
        ];

        var generateSelectedPTKP = function (selectedptkp) {
            var length = $scope.listPTKP.length;
            var data = $scope.listPTKP;
            for (var i = 0; i < length; i++) {
                if (data[i].value === selectedptkp) {
                    $scope.ptkp[i] = true;
                }
            }
        }


        var clearPTKPHeader = function () {
            var length = $scope.listPTKP.length;
            for (var i = 0; i < length; i++) {
                $scope.ptkp[i] = false;
            }
        }

        $scope.checkPTKPHeader = function (index) {
            clearPTKPHeader();
            $scope.ptkp[index] = true;
        }

        var fillPTKPDetail = function () {
            $http({
                method: 'GET',
                url: 'api/RecruitmentForm/GetPTKP'
            })
                .then(function (response) {
                    $scope.listPTKPDetail = response.data;

                });
        };

        fillPTKPDetail();

        var generateSelectedPTKPDetail = function (selectedptkpdetail) {
            $scope.cb[selectedptkpdetail] = true;
        }

        var clearPTKP = function () {
            var length = $scope.listPTKPDetail.length;
            var data = $scope.listPTKPDetail;
            for (var i = 0; i < length; i++) {
                var index = data[i].Id;
                $scope.cb[index] = false;
            }
        }

        $scope.checkPTKP = function (index) {
            clearPTKP();
            $scope.cb[index] = true;
            $scope.selectedPTKP = index;
        }

        var generatePTKP = function () {
            var length = $scope.listPTKP.length;
            for (var i = 0; i < length; i++) {
                if ($scope.ptkp[i]) {
                    $scope.candidate.PTKPHeader = $scope.listPTKP[i].value;
                }
            }

            var length = $scope.listPTKPDetail.length;
            var data = $scope.listPTKPDetail;
            for (var i = 0; i < length; i++) {
                var index = data[i].Id;
                if ($scope.cb[index]) {
                    $scope.candidate.PTKPDetail = data[i].Id;
                }
            }
        }

        var loadPTKP = function () {

            var length = $scope.listPTKPDetail.length;
            var data = $scope.listPTKPDetail;
            for (var i = 0; i < length; i++) {
                var index = data[i].Id;
                if ($scope.candidate.PTKPDetail === index) {
                    $scope.selectedGender = data[i].Gender;
                }
            }
        }

        //#endregion akhir PTKP-------------------------------------------------------------------------------
        $scope.isSameData = false;
        $scope.isShow = true;
        $scope.sameData = function () {

            if ($scope.isSameData) {
                $scope.candidate.CurrentPostalCode = $scope.candidate.PostalCode;
                $scope.candidate.CurrentAddress = $scope.candidate.HomeAddress;
                $scope.candidate.CurrentCityCode = $scope.candidate.CityCode;
                $scope.isShow = false;
            } else {
                $scope.candidate.CurrentPostalCode = "";
                $scope.candidate.CurrentAddress = "";
                $scope.candidate.CurrentCityCode = "";
                $scope.isShow = true;
            }
        }

        //OLD
        $scope.listGenderPTKP = [
            { id: 'LAKI-LAKI', value: 'LAKI-LAKI' },
            { id: 'WANITA', value: 'WANITA' }
        ];

        //new
        $scope.listGender = [
            { id: 'L', value: 'LAKI-LAKI' },
            { id: 'P', value: 'PEREMPUAN' }
        ];

        $scope.listReligion = [
            { id: 'Islam', value: 'Islam' },
            { id: 'Kristen Protestan', value: 'Kristen Protestan' },
            { id: 'Kristen Katolik', value: 'Kristen Katolik' },
            { id: 'Hindu', value: 'Hindu' },
            { id: 'Budha', value: 'Budha' }
        ];

        $scope.listMaritalStatus = [
            { id: 'Belum Menikah', value: 'Belum Menikah' },
            { id: 'Menikah', value: 'Menikah' },
            { id: 'Duda/Janda', value: 'Duda/Janda' },
            { id: 'Cerai', value: 'Cerai' }
        ];
        $scope.listPropertyOwnership = [
            { id: 'Milik Sendiri', value: 'Milik Sendiri' },
            { id: 'Tinggal Dengan Orang Tua', value: 'Tinggal Dengan Orang Tua' },
            { id: 'Indekos/Mengontrak', value: 'Indekos/Mengontrak' }
        ];

        $scope.listDependencies = [];
        $scope.listExamType = [];
        $scope.candidate = {
            AajiExam:
                {
                    ExamType: 'Paper',
                    ExamLocationId: '',
                    ExamLocationName: '',
                    AajiExamId: '',
                    AajiExamDate: ''
                }
        };

        $scope.changeAaji = function () {
            $scope.candidate.AajiExam.ExamLocationId = '';
            $scope.candidate.AajiExam.ExamLocationName = '';
            $scope.candidate.AajiExam.AajiExamId = '';
            $scope.candidate.AajiExam.AajiExamDate = '';
        };

        var fillExamType = function () {
            $scope.selectedexamtype = 1;
            var examType1 = { Id: 'Paper', Name: 'Paper' };
            var examType2 = { Id: 'Online', Name: 'Online' };
            $scope.listExamType.push(examType1);
            $scope.listExamType.push(examType2);
        }

        fillExamType();

        $scope.managerData = null;

        var fillManageData = function () {
            $http({
                method: 'GET',
                url: 'api/RecuitmentForm/GetManagerData',
                params: { candidateid: $scope.candidateId }
            })
            .then(function (response) {
                $scope.managerData = response.data;
            });
        };

        //fillManageData();

        $scope.test = true;

        $scope.listExperience = [];
        $scope.listReference = [];
        $scope.listWorkExperienceInInsurance = [];
        $scope.listRelation = [];

        function getDataCandidate(id) {
            var q = $q.defer();
            $http({ method: 'get', url: 'api/RecuitmentForm/GetCandidate', params: { candidateId: id } }).then(function (response) {
                //$scope.candidate = response.data;
                q.resolve(response);
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        }

        getCandidate($scope.candidateId);

        $scope.selectedMenu = 0;
        $scope.listkota = null;
        var fillCity = function () {
            $http({
                method: 'GET',
                url: 'api/City/GetCity'
            })
                .then(function (response) {
                    $scope.listkota = response.data;
                });
        };
        fillCity();

        var showButtonAddLocation = function (bool) {
            var newThings = {
                AgentLocationCode: '#AddNew',
                AgentLocation: '--- Add New Location ---'
            }

            if (bool) {
                var result = false;
                for (var i = $scope.listlocation.length - 1; i >= 0; --i) {
                    if ($scope.listlocation[i].AgentLocationCode == "#AddNew") {
                        result = true;
                    }
                }
                if (result == false) {
                    $scope.listlocation.splice(0, 0, newThings);
                }
            } else {
                for (var i = $scope.listlocation.length - 1; i >= 0; --i) {
                    if ($scope.listlocation[i].AgentLocationCode == "#AddNew") {
                        $scope.listlocation.splice(i, 1);
                    }
                }
            }
        }

        $scope.listlocation = null;
        var fillLocation = function () {
            $http({
                method: 'GET',
                url: 'api/Location/GetLocation'
            })
                .then(function (response) {
                    $scope.listlocation = response.data;
                    if (Number($scope.candidate.Level) === 5) {
                        showButtonAddLocation(true);
                    }
                });
        };
        fillLocation();

        $scope.$watch('candidate.LocationCode', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal == '#AddNew') {
                $scope.openPopUpLocation();
            }
        }, true);



        $scope.listbank = null;
        var fillBank = function () {
            $http({
                method: 'GET',
                url: 'api/Bank/GetBank'
            })
                .then(function (response) {
                    $scope.listbank = response.data;
                });
        };
        fillBank();

        //#region navigasi switch menu
        function clearMenu() {
            $scope.menu0 = false;
            $scope.menu1 = false;
            $scope.menu2 = false;
            $scope.menu3 = false;
            $scope.menu4 = false;
            $scope.menu5 = false;
            $scope.menu6 = false;
            $scope.menu7 = false;
            $scope.menu8 = false;
            $scope.menu9 = false;
            $scope.menu10 = false;
            $scope.menu11 = false;
            $scope.menu12 = false;
            $scope.menu14 = false;
        }
        clearMenu();
        $scope.menu0 = true;
        //validate marital status 

        $scope.setMaritalStatus = function () {
            if ($scope.candidate.MaritalStatus !== 'Menikah') {
                $scope.candidate.SpouseName = "";
                $scope.candidate.SpouseBirthDate = "";
                $('#txtSpouseName').prop('required', true);
                $('#txtSpouseBirthDate').prop('required', true);
            } else {
                $('#txtSpouseName').prop('required', false);
                $('#txtSpouseBirthDate').prop('required', false);
            }
        }
        //validate masing2 sub
        var validateSubMenu = function (menu) {
            var status = false;
            if (Number(menu) === 1) {
                status = validateDataCabang();
            } else if (Number(menu) === 2) {
                status = validateDataPribadi();
            } else if (Number(menu) === 3) {
                status = validateDataKeluarga();
            } else if (Number(menu) === 4) {
                status = validateDataPendidikan();
            } else if (Number(menu) === 5) {
                status = validateDataPekerjaan();
            } else if (Number(menu) === 9) {
                status = validateDokumen();
            } else if (Number(menu) === 10) {
                status = validateDataPTKP();
            }
            return status;
        }
        //validasi data cabang

        var validateDataCabang = function () {
            var status = true;

            if ($scope.candidate.LocationCode === undefined || $scope.candidate.LocationCode === "" || $scope.candidate.LocationCode === null) {
                status = false;
            }
            return status;
        }
        //validasi data pribadi
        var validateDataPribadi = function () {
            var status = true;
            $scope.candidate.BirthDate = $('#candidateBirthDate').val();
            if ($scope.candidate.AgentName === undefined || $scope.candidate.AgentName === "") {
                status = false;
            } else if ($scope.candidate.Gender === undefined || $scope.candidate.Gender === "") {
                status = false;
            } else if ($scope.candidate.HomeAddress === undefined || $scope.candidate.HomeAddress === "" || $scope.candidate.HomeAddress === null) {
                status = false;
            } else if ($scope.candidate.CityName === undefined || $scope.candidate.CityName === "" || $scope.candidate.CityName === null) {
                status = false;
            } else if ($scope.candidate.PostalCode === undefined || $scope.candidate.PostalCode === "") {
                status = false;
            } else if ($scope.candidate.CurrentAddress === undefined || $scope.candidate.CurrentAddress === "" || $scope.candidate.CurrentAddress === null) {
                status = false;
            } else if ($scope.candidate.CurrentCityCode === undefined || $scope.candidate.CurrentCityCode === "" || $scope.candidate.CurrentCityCode === null) {
                status = false;
            } else if ($scope.candidate.CurrentPostalCode === undefined || $scope.candidate.CurrentPostalCode === "" || $scope.candidate.CurrentPostalCode === null) {
                status = false;
            } else if ($scope.candidate.PropertyOwnershipStatus === undefined || $scope.candidate.PropertyOwnershipStatus === "" || $scope.candidate.PropertyOwnershipStatus === null) {
                status = false;
            } else if ($scope.candidate.KTPNo === undefined || $scope.candidate.KTPNo === "" || $scope.candidate.KTPNo === null) {
                status = false;
            } else if ($scope.candidate.Religion === undefined || $scope.candidate.Religion === "" || $scope.candidate.Religion === null) {
                status = false;
            } else if ($scope.candidate.HomePhone === undefined || $scope.candidate.HomePhone === "" || $scope.candidate.HomePhone === null) {
                status = false;
            } else if ($scope.candidate.Email === undefined || $scope.candidate.Email === "" || $scope.candidate.Email === null) {
                status = false;
            } else if (!$scope.candidate.BirthDate) {
                status = false;
            }
                //} else if ($scope.candidate.BirthDate === undefined || $scope.candidate.BirthDate === "" || $scope.candidate.BirthDate === null) {
                //    status = false;
                //}
                //else if ($scope.candidate.NPWPName === undefined || $scope.candidate.NPWPName === "" || $scope.candidate.NPWPName === null) {
                //    status = false;
                //}
            else if ($scope.candidate.BankAccountName === undefined || $scope.candidate.BankAccountName === "" || $scope.candidate.BankAccountName === null) {
                status = false;
            } else if ($scope.candidate.BankAccountNo === undefined || $scope.candidate.BankAccountNo === "" || $scope.candidate.BankAccountNo === null) {
                status = false;
            } else if ($scope.candidate.Income === undefined || $scope.candidate.Income === "" || $scope.candidate.Income === null) {
                status = false;
            } else if ($scope.candidate.BankCode === undefined || $scope.candidate.BankCode === "" || $scope.candidate.BankCode === null) {
                status = false;
            } else if ($scope.candidate.Branch === undefined || $scope.candidate.Branch === "" || $scope.candidate.Branch === null) {
                status = false;
            }
            return status;
        }
        // validasi data keluarga
        var validateDataKeluarga = function () {
            var status = true;
            if ($scope.candidate.MaritalStatus === "" || $scope.candidate.MaritalStatus === null || $scope.candidate.MaritalStatus === undefined) {
                status = false;
            } else if ($scope.candidate.MaritalStatus === "Menikah") {
                if ($scope.candidate.SpouseName === "" || $scope.candidate.SpouseName === null || $scope.candidate.SpouseName === undefined) {
                    status = false;
                } else if ($scope.candidate.SpouseBirthDate === "" || $scope.candidate.SpouseBirthDate === null || $scope.candidate.SpouseBirthDate === undefined) {
                    status = false;
                }
            }
            return status;
        }
        //validasi data pendidikan

        var validateDataPendidikan = function () {
            var status = true;
            if ($scope.listEducation === undefined || $scope.listEducation.length === 0 || $scope.listEducation.length === null) {
                status = false;
            }
            return status;
        }

        var validateDataPekerjaan = function () {
            var status = true;
            if ($scope.listExperience === undefined || $scope.listExperience.length === 0 || $scope.listExperience.length === null) {
                status = false;
            }
            return status;
        }

        var validateDataPTKP = function () {

            //var status = true;
            //if ((Number($scope.PTKPDetail) === 0 || $scope.PTKPHeader === null)) {
            //    status = false;
            //}

            generateSelectedPTKPDetail($scope.candidate.PTKPDetail);

            //edit npwp tidak mandatory
            var status = false;
            if ($scope.candidate.NPWPNo) {
                if ($scope.ptkp.length == 2) {
                    for (var i = 0; i < $scope.cb.length; i++) {
                        if ($scope.cb[i] == true) {
                            status = true;
                        }
                    }
                }
            } else {
                status = true;
            }

            return status;
        }

        var validateDokumen = function () {
            var status = true;
            //photonpwp tidak mandatory
            if ($scope.photoKtpId === 0 || $scope.photoDiriId === 0 || $scope.photoBuktiTransferId === 0 || $scope.photoBukuTabunganId === 0) {
                status = false;
            }
            return status;
        }

        $scope.validateSignature = function () {
            var status = true;
            //var size1 = $scope.tandaTanganUpload1.filesize;
            //var size2 = $scope.tandaTanganUpload2.filesize;
            //var filetype1 = $scope.tandaTanganUpload1.filetype;
            //var filetype2 = $scope.tandaTanganUpload2.filetype;
            //if ((!(filetype1 == 'image/jpeg' || filetype1 == 'image/png')) && (!(filetype2 == 'image/jpeg' || filetype2 == 'image/png'))) {
            //    alert('Pastikan file yang diupload berformat jpg / png / image file');
            //} else if (size > 1000000) {
            //    alert('Max Size 1 MB !')
            //}
            if (!$scope.tandaTanganUpload1 || !$scope.tandaTanganUpload2 || (!($scope.tandaTanganUpload2.filetype == 'image/jpeg' || $scope.tandaTanganUpload2.filetype == 'image/png') || $scope.tandaTanganUpload2.filesize > 1000000 || $scope.tandaTanganUpload1.filesize > 1000000)) {
                status = false;
            }

            if ($scope.candidate.Status == 'DRAFT') {
                if ($scope.candidate.RecruiterSignature && $scope.candidate.CandidateSignature) {
                    status = true;
                } else {
                    status = false;
                }
            }
            return status;
        }

        $scope.candidate.Pertanyaan1 = null;
        $scope.candidate.Pertanyaan2 = null;
        $scope.candidate.Pertanyaan3 = null;
        $scope.candidate.Pertanyaan4 = null;

        $scope.isAgree = false;

        $scope.moveNext = function (index) {
            if (index === 1) {
                if (validateSubMenu(index)) {
                    $scope.selectedMenu = index;
                    clearMenu();
                    $scope.menu1 = true;
                } else {
                    swalAlert.message('i', 'Harap isi data Cabang dan Perekrut dengan Lengkap');
                }
            }
            else if (index === 2) {
                var BirthDate = $('#candidateBirthDate').val();
                if (validateSubMenu(index)) {
                    $scope.selectedMenu = index;
                    clearMenu();
                    $scope.menu2 = true;
                } else {
                    if ($scope.candidate.Income === null || $scope.candidate.Income === undefined || $scope.candidate.Income === "") {
                        swalAlert.message('i', 'Harap Isi Data Pribadi dengan Lengkap');
                    } else if (!BirthDate || BirthDate != 'Invalid date') {
                        swalAlert.message('i', 'Harap Isi Data Pribadi dengan Lengkap');
                        $('#candidateBirthDate').val(null);
                    } else {
                        var strLengthIncome = $scope.candidate.Income.toString().length;
                        if (strLengthIncome >= 10) {
                            swalAlert.message('i', 'Data penghasilan tidak benar');
                        }
                        //else {
                        //    swalAlert.message('i', 'Harap Isi Data Pribadi dengan Lengkap');
                        //}
                    }
                }
            }
            else if (index === 3) {

                //add by mukti
                var data = {
                    Status: null,
                    Name: null,
                    BirthDate: null
                };

                if (($scope.candidate.MaritalStatus !== "Belum Menikah")) {
                    var row = $('#tableInputDependencies tr').length;
                    if (row > $scope.listDependencies.length) {
                        if ($scope.dependency && Object.keys($scope.dependency).length > 0) {
                            data = $scope.dependency;

                            if (!(!data.Status && !data.Name && !data.BirthDate)) {
                                $scope.submitted3 = true;
                                var result = $scope.addDependency(data);
                                if (!result) {
                                    return;
                                }
                            }
                        }
                    }
                }
                //end by mukti

                if (validateSubMenu(index)) {
                    $scope.selectedMenu = index;
                    clearMenu();
                    $scope.menu3 = true;
                } else {
                    swalAlert.message('i', 'Harap Isi Data Keluarga Lengkap');
                }

                $('.general-layoutfixed-container').scrollTop(0);
            }
            else if (index === 4) {

                //add by mukti
                var data = {
                    InstitutionName: null,
                    YearFrom: null,
                    YearTo: null,
                    Level: null
                };

                var row = $('#tableInputEducation tr').length;
                if (row > $scope.listEducation.length) {
                    if ($scope.education && Object.keys($scope.education).length > 0) {
                        //cek jika salah satu ada yg diisi berarti cek validasi
                        data = $scope.education;
                        if ((data.InstitutionName && data.YearFrom && data.YearTo && data.Level) || (!data.InstitutionName || !data.YearFrom || !data.YearTo || !data.Level)) {
                            $scope.submitted4 = true;
                            var result = $scope.addEducation(data);
                            if (!result) {
                                return
                            }
                        }
                    };
                }
                //end add by mukti

                if (validateSubMenu(index)) {
                    $scope.selectedMenu = index;
                    clearMenu();
                    $scope.menu4 = true;
                } else {
                    swalAlert.message('i', 'Harap Isi Minimal 1 Data Pendidikan (Terakhir)');
                    $scope.submitted4 = true;
                    $('#addEducationInstitutionName').addClass('ng-invalid');
                    $('#addEducationYearFrom').addClass('ng-invalid');
                    $('#addEducationYearTo').addClass('ng-invalid');
                    $('#addEducationLevel').addClass('ng-invalid');
                }
            }
            else if (index === 5) {
                //add by mukti
                var data = { CompanyName: null, QuitReason: null, Position: null, ToDate: null, FromDate: null };

                var row = $('#tableInputExperience tr').length;
                if (row > $scope.listExperience.length) {
                    if ($scope.experience && Object.keys($scope.experience).length > 0) {
                        //cek jika salah satu ada yg diisi berarti cek validasi
                        data = $scope.experience;
                        if ((data.CompanyName && data.QuitReason && data.Position && data.ToDate && data.FromDate) || (!data.CompanyName || !data.QuitReason || !data.Position || !data.ToDate || !data.FromDate)) {
                            $scope.submitted5 = true;
                            var result = $scope.addExperience(data);
                            if (!result) {
                                return
                            }
                        }
                    };
                }
                //end add by mukti

                if (validateSubMenu(index)) {
                    $scope.selectedMenu = index;
                    clearMenu();
                    $scope.menu5 = true;
                } else {
                    swalAlert.message('i', 'Harap Isi Minimal 1 Data Pekerjaan (Terakhir)');
                    $scope.submitted5 = true;
                    $('#addExperienceCompanyName').addClass('ng-invalid');
                    $('#addExperienceQuitReason').addClass('ng-invalid');
                    $('#addExperiencePosition').addClass('ng-invalid');
                    $('#addExperienceFromDate').addClass('ng-invalid');
                    $('#addExperienceToDate').addClass('ng-invalid');
                }
            }
            else if (index === 6) {
                //add by mukti
                var data = {
                    LastPosition: null,
                    MainOfficeAddress: null,
                    CompanyName: null,
                    HasBeenJoinFor: null,
                    TerminateDate: null,
                    OldAgentCode: null
                };


                var row = $('#tableInputWorkExperience tr').length;
                if (row > $scope.listWorkExperienceInInsurance.length) {
                    if ($scope.workExperience && Object.keys($scope.workExperience).length > 0) {
                        //cek jika salah satu ada yg diisi berarti cek validasi
                        data = $scope.workExperience;
                        if (!(!data.LastPosition && !data.MainOfficeAddress && !data.CompanyName && !data.HasBeenJoinFor && !data.TerminateDate && !data.OldAgentCode)) {
                            $scope.submitted6 = true;
                            var result = $scope.addWorkExperience(data);
                            if (!result) {
                                return
                            }
                        }
                    };
                }
                //end add by mukti

                $scope.selectedMenu = index;
                clearMenu();
                $scope.menu6 = true;
            }

            else if (index === 7) {

                //add by mukti
                var data = { Name: null, Relation: null, CompanyName: null, Position: null, Year: null };

                var row = $('#tableInputRelation tr').length;
                if (row > $scope.listRelation.length) {
                    if ($scope.relation && Object.keys($scope.relation).length > 0) {
                        //cek jika salah satu ada yg diisi berarti cek validasi
                        data = $scope.relation;
                        if (!(!data.Name && !data.Relation && !data.CompanyName && !data.Position && !data.Year)) {
                            $scope.submitted7 = true;
                            var result = $scope.addRelation(data);
                            if (!result) {
                                return
                            }
                        }
                    };
                }
                //end add by mukti


                $scope.selectedMenu = index;
                clearMenu();
                $scope.menu7 = true;
            }
            else if (index === 8) {

                //add by mukti
                var data = { Name: null, Organization: null, Relation: null, PhoneNumber: null, HasKnownFor: null };

                var row = $('#tableInputReference tr').length;
                if (row > $scope.listReference.length) {
                    if ($scope.reference && Object.keys($scope.reference).length > 0) {
                        //cek jika salah satu ada yg diisi berarti cek validasi
                        data = $scope.reference;
                        if (!(!data.Name && !data.Organization && !data.Relation && !data.PhoneNumber && !data.HasKnownFor)) {
                            $scope.submitted8 = true;
                            var result = $scope.addReference(data);
                            if (!result) {
                                return
                            }
                        }
                    };
                }
                //end add by mukti


                $scope.selectedMenu = index;
                clearMenu();
                $scope.menu8 = true;
            }
            else if (index === 9) {
                if (validateSubMenu(index)) {
                    //cek apakah ada data npwp
                    if ($scope.candidate.NPWPNo) {
                        $scope.selectedMenu = index;
                        clearMenu();
                        $scope.menu9 = true;
                    } else {
                        $scope.selectedMenu = 10;
                        clearMenu();
                        $scope.menu10 = true;
                    }

                    $('.general-layoutfixed-container').scrollTop(0);
                } else {
                    swalAlert.message('i', 'Dokumen Pelengkap Harus Diunggah');
                }
            }
            else if (index === 10) {
                //if ($scope.photoBuktiTransferId === 0) {
                //    var status = confirm('Bukti Transfer belum diunggah, unggah sekarang ?');
                //    if (status) {
                //        clearMenu();
                //        $scope.menu8 = true;
                //        $scope.selectedMenu = 8;
                //    } else {
                //        $scope.selectedMenu = 11;
                //        clearMenu();
                //        $scope.menu11 = true;
                //    }
                //}
                //else
                if (validateSubMenu(index)) {
                    $scope.selectedMenu = index;
                    clearMenu();
                    $scope.menu10 = true;
                }
                else {
                    swalAlert.message('i', 'Harap isi Data PTKP dengan lengkap');
                }
            }
            else if (index === 11) {
                $scope.selectedMenu = index;
                clearMenu();
                $scope.menu11 = true;
            }
            else if (index === 12) {
                $scope.selectedMenu = index;
                clearMenu();
                $scope.menu12 = true;
            }
            else if (index === 14) {
                $scope.selectedMenu = index;
                clearMenu();
                $scope.menu14 = true;
            }


            $('.general-layoutfixed-container').scrollTop(0);
            //else if (index === 8) {
            //    if (true) {
            //        $scope.selectedMenu = index;
            //        clearMenu();
            //        $scope.menu8 = true;
            //    } else {
            //        alert('Harap Isi Data Keluarga Lengkap');
            //    }
            //}
        }

        $scope.switchMenu = function (index) {
            $scope.selectedMenu = index;
            clearMenu();
            if (index === 0)
                $scope.menu0 = true;
            else if (index === 1)
                $scope.menu1 = true;
            else if (index === 2)
                $scope.menu2 = true;
            else if (index === 3)
                $scope.menu3 = true;
            else if (index === 4)
                $scope.menu4 = true;
            else if (index === 5)
                $scope.menu5 = true;
            else if (index === 6)
                $scope.menu6 = true;
            else if (index === 7)
                $scope.menu7 = true;
            else if (index === 8)
                $scope.menu8 = true;
            else if (index === 9)
                $scope.menu9 = true;
            else if (index === 9)
                $scope.menu9 = true;
            else if (index === 10) {
                //if ($scope.photoBuktiTransferId === 0) {
                //    var status = confirm('Bukti Transfer belum diunggah, unggah sekarang ?');
                //    if (status) {
                //        clearMenu();
                //        $scope.menu8 = true;
                //        $scope.selectedMenu = 8;
                //    } else {
                //        $scope.selectedMenu = 11;
                //        clearMenu();
                //        $scope.menu11 = true;
                //    }
                //}
                //else {
                $scope.menu10 = true;
                //}
            }
            else if (index === 11) {
                $scope.menu11 = true;
            }
            else if (index === 12)
                $scope.menu12 = true;
            else if (index === 14)
                $scope.menu14 = true;
        }
        //#endregion navigasi switch menu
        $scope.selectedlokasi = "";

        $scope.photoKtpId = 0;
        $scope.photoDiriId = 0;
        $scope.photoNpwpId = 0;
        $scope.photoKkId = 0;
        $scope.photoBukuTabunganId = 0;
        $scope.photoBuktiTransferId = 0;

        function convertDate(date) {
            var convertedDate;
            if (date) {
                var birthdate = new Date(date);
                var curr_date = d.getDate();
                var curr_month = d.getMonth(); curr_month++;
                var curr_year = d.getFullYear();
                convertedDate = (curr_date + "-" + curr_month + "-" + curr_year);
            }
            return convertedDate;
        }

        //utk rubah format tanggal lahir
        $scope.$watch('candidate.BirthDate', function () {
            var s = $scope.candidate.BirthDate
            if (s) {
                $scope.candidate.BirthDate = moment(s).format('MM/DD/YYYY');
            }
        })

        //$scope.getDataCandidate = function (id) {
        //    var q = $q.defer();
        //    $http({ method: 'get', url: 'api/RecuitmentForm/GetCandidate', params: { candidateId: candidateid } }).then(function (response) {
        //        //$scope.candidate = response.data;
        //        q.resolve(response);
        //    }, function (err) {
        //        q.reject(err);
        //    });
        //    return q.promise;
        //}

        function getCandidate(candidateid) {
            $('.spinner').fadeIn(500);
            $(".OverlaySpinner").fadeIn(500);
            //$http({ method: 'get', url: 'api/mobile/RecuitmentForm/GetCandidate', params: { candidateId: candidateid } }).
            //$http({ method: 'get', url: 'api/RecuitmentForm/GetCandidate', params: { candidateId: candidateid } }).
            getDataCandidate(candidateid).then(function (response) {
                $scope.candidate = response.data;

                if ($scope.candidate.CurrentPostalCode == 0) {
                    $scope.candidate.CurrentPostalCode = "";
                }

                if ($scope.candidate.Status == 'DRAFT') {
                    if ($scope.candidate.SpouseBirthDate) {
                        console.log('ada spouse birthdate draft');
                        $scope.candidate.SpouseBirthDate = $scope.candidate.SpouseBirthDate.substring(0, $scope.candidate.SpouseBirthDate.indexOf('T'))
                        console.log($scope.candidate.SpouseBirthDate);
                    }
                } else {
                    console.log('ada spouse birthdate ');
                }

                loadPTKP();

                $scope.listEducation = response.data.Educations;
                $scope.listExperience = response.data.Experiences;

                if (Number($scope.candidate.NPWPNo) === 0) {
                    $scope.candidate.NPWPNo = "";
                } else {
                    //load ptkp
                    if ($scope.candidate.PTKPHeader == 'Hanya dikenakan PTKP di PT Sun Life Financial Indonesia') {
                        $scope.ptkp[0] = true;
                        $scope.ptkp[1] = false;
                    } else if ($scope.candidate.PTKPHeader == 'Telah dikenakan PTKP sehubungan dengan pekerjaan di perusahaan lain') {
                        $scope.ptkp[0] = false;
                        $scope.ptkp[1] = true;
                    }
                    //$scope.checkPTKP($scope.cb);
                }
                if (Number($scope.candidate.Income) === 0) {
                    $scope.candidate.Income = "";
                }

                $scope.loadPhoto();
                $scope.candidate.AajiExam = response.data.AajiExam;
                $scope.listReference = response.data.References;
                $scope.listRelation = response.data.Relations;
                $scope.listWorkExperienceInInsurance = response.data.WorkExperiences;
                $scope.listDependencies = response.data.Dependencies;
                //set default gender in ptkp
                $scope.setGender();
                if ($scope.candidate.PTKPHeader !== null || $scope.candidate.PTKPHeader !== undefined) {
                    generateSelectedPTKP($scope.candidate.PTKPHeader);
                }
                if (($scope.candidate.PTKPDetail !== null || $scope.candidate.PTKPDetail !== undefined) && $scope.candidate.PTKPDetail != 0) {
                    generateSelectedPTKPDetail($scope.candidate.PTKPDetail);
                }

                if ($scope.candidate.CandidateSignature !== null) {
                    //signaturePad2.fromDataURL($scope.candidate.CandidateSignature);
                    $scope.tandanTangan2 = $scope.candidate.CandidateSignature;
                }

                if ($scope.candidate.RecruiterSignature !== null) {
                    $scope.tandanTangan1 = $scope.candidate.RecruiterSignature;
                    //signaturePad.fromDataURL($scope.candidate.RecruiterSignature);
                }


                if (Number($scope.candidate.Level) === 5) {
                    showButtonAddLocation(true);
                }

            }).finally(function () {
                $('.spinner').fadeOut(500);
                $(".OverlaySpinner").fadeOut(500);
            });
        }

        $scope.getCandidateManager = function (candidateroleid, candidaterolehierarkilevel, candidaterolename) {
            //jagain ketika candidateroleid lebih kecil di banding recruiterroleid
            console.log(candidateroleid + ' ' + candidaterolehierarkilevel + ' ' + candidaterolename);
            if ($scope.candidate !== undefined) {
                //5 = AD maka ada tambah branch
                if (Number(candidateroleid) === 5) {
                    //add menu location
                    showButtonAddLocation(true);
                    $scope.candidate.isAd = true;
                } else {
                    $scope.candidate.isAd = false;
                    showButtonAddLocation(false);
                }
                $scope.candidate.LevelName = candidaterolename;
                if (Number(candidaterolehierarkilevel) >= Number($scope.candidate.HierarkiLevel)) {
                    $http({
                        method: 'GET',
                        url: 'api/RecuitmentForm/GetManagerData',
                        params: { candidateRoleId: candidateroleid }
                    })
                    .then(function (response) {
                        var data = response.data;

                        $scope.candidate.ManagerAgentCode = data.AgentCode;
                        $scope.candidate.ManagerName = data.DisplayName;
                        $scope.candidate.ManagerLocation = data.AgentLocation;
                        $scope.candidate.ManagerPosition = data.ManagerPosition;

                    });
                } else {
                    $scope.candidate.ManagerAgentCode = $scope.candidate.RecruiterAgentCode;
                    $scope.candidate.ManagerName = $scope.candidate.RecruiterName;
                    $scope.candidate.ManagerLocation = $scope.candidate.AgencyDirector;
                    $scope.candidate.ManagerPosition = $scope.candidate.RecruiterPosition;
                }
            }
            $scope.candidate.RoleName = candidaterolename;

        }

        function getListDependencies(candidateid) {
            var ListDependencies = [];
            var length = $scope.listDependencies.length;
            for (var i = 0; i < length; i++) {
                var model = {
                    Id: $scope.listDependencies[i].Id,
                    Status: $scope.listDependencies[i].Status,
                    Name: $scope.listDependencies[i].Name,
                    BirthDate: $scope.listDependencies[i].BirthDate,
                    StatusData: $scope.listDependencies[i].StatusData
                };
                ListDependencies.push(model);
            }
            return ListDependencies;
        }

        function getListEducation(candidateid) {
            var listEducation = [];

            var length = $scope.listEducation.length;
            for (var i = 0; i < length; i++) {
                var model = {
                    Id: $scope.listEducation[i].Id,
                    CandidateId: candidateid,
                    InstitutionName: $scope.listEducation[i].InstitutionName,
                    YearFrom: $scope.listEducation[i].YearFrom,
                    YearTo: $scope.listEducation[i].YearTo,
                    Level: $scope.listEducation[i].Level
                };
                listEducation.push(model);
            }
            return listEducation;

        }

        //function getListExperience(candidateid) {
        //    var listExperience = [];
        //    var length = $scope.listExperience.length;
        //    for (var i = 0; i < length; i++) {
        //        var model = {
        //            Id: $scope.listExperience[i].Id,
        //            CandidateId: candidateid,
        //            CompanyName: $scope.listExperience[i].CompanyName,
        //            CompanyAddress: $scope.listExperience[i].CompanyAddress,
        //            Position: $scope.listExperience[i].Position,
        //            EarlySalary: $scope.listExperience[i].EarlySalary,
        //            LastSalary: $scope.listExperience[i].LastSalary,
        //            QuitReason: $scope.listExperience[i].QuitReason,
        //            FromDate: $scope.listExperience[i].FromDate,
        //            ToDate: $scope.listExperience[i].ToDate,
        //        };
        //        listExperience.push(model);
        //    }
        //    return listExperience;
        //}

        //function getListReferences(candidateid) {
        //    var listReference = [];
        //    var length = $scope.listReference.length;
        //    for (var i = 0; i < length; i++) {
        //        var model = {
        //            Id: $scope.listReference[i].Id,
        //            CandidateId: candidateid,
        //            Name: $scope.listReference[i].Name,
        //            Organization: $scope.listReference[i].Organization,
        //            Relation: $scope.listReference[i].Relation,
        //            PhoneNumber: $scope.listReference[i].PhoneNumber,
        //            HasKnownFor: $scope.listReference[i].HasKnownFor
        //        };
        //        listReference.push(model);
        //    }
        //    return listReference;
        //}

        function getList(candidateid) {
            var listReference = [];
            var length = $scope.listReference.length;
            for (var i = 0; i < length; i++) {
                var model = {
                    Id: $scope.listReference[i].Id,
                    CandidateId: candidateid,
                    Name: $scope.listReference[i].Name,
                    Organization: $scope.listReference[i].Organization,
                    Relation: $scope.listReference[i].Relation,
                    PhoneNumber: $scope.listReference[i].PhoneNumber,
                    HasKnownFor: $scope.listReference[i].HasKnownFor,
                    StatusData: $scope.listReference[i].StatusData
                };
                listReference.push(model);
            }
            return listReference;
        }

        function getListExperience(candidateid) {
            var listExperience = [];
            var length = $scope.listExperience.length;
            for (var i = 0; i < length; i++) {
                var model = {
                    Id: $scope.listExperience[i].Id,
                    CandidateId: candidateid,
                    CompanyName: $scope.listExperience[i].CompanyName,
                    Position: $scope.listExperience[i].Position,
                    QuitReason: $scope.listExperience[i].QuitReason,
                    FromDate: $scope.listExperience[i].FromDate,
                    ToDate: $scope.listExperience[i].ToDate,
                    StatusData: $scope.listExperience[i].StatusData
                };
                listExperience.push(model);
            }
            return listExperience;
        }

        function getListReference(candidateid) {
            var listReference = [];
            var length = $scope.listReference.length;
            for (var i = 0; i < length; i++) {
                var model = {
                    Id: $scope.listReference[i].Id,
                    CandidateId: candidateid,
                    Name: $scope.listReference[i].Name,
                    Organization: $scope.listReference[i].Organization,
                    Relation: $scope.listReference[i].Relation,
                    PhoneNumber: $scope.listReference[i].PhoneNumber,
                    HasKnownFor: $scope.listReference[i].HasKnownFor,
                    StatusData: $scope.listReference[i].StatusData
                };
                listReference.push(model);
            }
            return listReference;
        }

        function getListRelation(candidateid) {
            var listRelation = [];
            var length = $scope.listRelation.length;
            for (var i = 0; i < length; i++) {
                var model = {
                    Id: $scope.listRelation[i].Id,
                    CandidateId: candidateid,
                    Name: $scope.listRelation[i].Name,
                    Relation: $scope.listRelation[i].Relation,
                    CompanyName: $scope.listRelation[i].CompanyName,
                    Position: $scope.listRelation[i].Position,
                    Year: $scope.listRelation[i].Year,
                    StatusData: $scope.listRelation[i].StatusData
                };
                listRelation.push(model);
            }
            return listRelation;
        }

        function getListWorkExperience(candidateid) {
            var listWorkExperience = [];
            var length = $scope.listWorkExperienceInInsurance.length;
            for (var i = 0; i < length; i++) {
                var model = {
                    Id: $scope.listWorkExperienceInInsurance[i].Id,
                    CandidateId: candidateid,
                    CompanyName: $scope.listWorkExperienceInInsurance[i].CompanyName,
                    LastPosition: $scope.listWorkExperienceInInsurance[i].LastPosition,
                    MainOfficeAddress: $scope.listWorkExperienceInInsurance[i].MainOfficeAddress,
                    HasBeenJoinFor: $scope.listWorkExperienceInInsurance[i].HasBeenJoinFor,
                    TerminateDate: $scope.listWorkExperienceInInsurance[i].TerminateDate,
                    OldAgentCode: $scope.listWorkExperienceInInsurance[i].OldAgentCode,
                    StatusData: $scope.listWorkExperienceInInsurance[i].StatusData
                };
                listWorkExperience.push(model);
            }
            return listWorkExperience;
        }

        $scope.deleteEducation = function (id) {
            //find education index by id

            var status = confirm("Apakah anda yakin akan menghapus data ?");

            if (status) {

                var data = $scope.listEducation;
                var length = data.length;
                var index = 0;
                for (var i = 0; i < length; i++) {
                    if (id === data[i].Id) {
                        index = i;
                    }
                }
                $scope.listEducation.splice(index, 1);
            }

        }

        $scope.deleteExperience = function (id) {

            var status = confirm("Apakah anda yakin akan menghapus data ?");
            if (status) {
                //find education index by id
                var data = $scope.listExperience;
                var length = data.length;
                var index = 0;
                for (var i = 0; i < length; i++) {
                    if (id === data[i].Id) {
                        index = i;
                    }
                }
                $scope.listExperience.splice(index, 1);

            }
        }

        $scope.deleteReference = function (id) {

            var status = confirm("Apakah anda yakin akan menghapus data ?");
            if (status) {
                var data = $scope.listReference;
                var length = data.length;
                var index = 0;
                for (var i = 0; i < length; i++) {
                    if (id === data[i].Id) {
                        index = i;
                    }
                }
                $scope.listReference.splice(index, 1);

            }
        }

        $scope.deleteRelation = function (id) {
            var status = confirm("Apakah anda yakin akan menghapus data ?");
            if (status) {
                var data = $scope.listRelation;
                var length = data.length;
                var index = 0;
                for (var i = 0; i < length; i++) {
                    if (id === data[i].Id) {
                        index = i;
                    }
                }
                $scope.listRelation.splice(index, 1);
            }
        }

        $scope.deleteWorkExperienceInInsurance = function (id) {
            var status = confirm("Apakah anda yakin akan menghapus data ?");
            if (status) {
                var data = $scope.listWorkExperienceInInsurance;
                var length = data.length;
                var index = 0;
                for (var i = 0; i < length; i++) {
                    if (id === data[i].Id) {
                        index = i;
                    }
                }
                $scope.listWorkExperienceInInsurance.splice(index, 1);
            }
        }

        $scope.deleteDependency = function (id) {
            var status = confirm("Apakah anda yakin akan menghapus data ?");
            if (status) {
                var data = $scope.listDependencies;
                var length = data.length;
                var index = 0;
                for (var i = 0; i < length; i++) {
                    if (id === data[i].Id) {
                        index = i;
                    }
                }
                $scope.listDependencies.splice(index, 1);
            }
        }

        $scope.background = [];

        //$scope.loadBackgroundQuestion = function () {
        //    $http({
        //        method: 'GET',
        //        url: 'api/BackgroundQuestion/GetAllBackgroundQuestion'
        //    })
        //    .then(function (response) {
        //        $scope.Question = response.data;
        //        $scope.totalQuestion = response.data.length;
        //    });
        //}

        $scope.openPopupDependency = function () {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'dependencyContent.html',
                controller: popUpDependencyController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        }

        $scope.PhotoType = "";
        $scope.photoKtp = null;
        $scope.photoDiri = null;
        $scope.photoNpwp = null;
        $scope.photoKk = null;
        $scope.photoBukuTabungan = null;
        $scope.photoBuktiTransfer = null;

        $scope.loadPhoto = function () {
            var candidateid = $scope.candidateId;
            $http({
                method: 'GET',
                url: 'api/FilePelengkap/LoadPhoto',
                params: { candidateId: candidateid }
            })
            .then(function (response) {
                var file = response.data;
                for (var i = 0; i < file.length; i++) {
                    if (file[i].Type === 'KTP') {
                        $scope.photoKtpId = file[i].FileID;
                        //$scope.photoKtp = file[i].Path;
                        $scope.photoKtp = file[i].Base64;
                    }
                    if (file[i].Type === 'FotoDiri') {
                        $scope.photoDiriId = file[i].FileID;
                        $scope.photoDiri = file[i].Base64;
                    }
                    if (file[i].Type === 'NPWP') {
                        $scope.photoNpwpId = file[i].FileID;
                        $scope.photoNpwp = file[i].Base64;
                    }
                    if (file[i].Type === 'KK') {
                        $scope.photoKkId = file[i].FileID;
                        $scope.photoKk = file[i].Base64;
                    }
                    if (file[i].Type === 'TABUNGAN') {
                        $scope.photoBukuTabunganId = file[i].FileID;
                        $scope.photoBukuTabungan = file[i].Base64;
                    }
                    if (file[i].Type === 'TRANSFER') {
                        $scope.photoBuktiTransferId = file[i].FileID;
                        $scope.photoBuktiTransfer = file[i].Base64;
                    }
                }
            });
        }

        $scope.saveAll = function (formData) {
            if (validateDataCabang() && validateDataPribadi() && validateDataKeluarga() && validateDataPendidikan() && validateDataPekerjaan() && validateDataPTKP() && validateDokumen() && $scope.validateSignature()) {
                $('.spinner').fadeIn(500);
                $(".OverlaySpinner").fadeIn(500);

                if ((formData.Status != 'DRAFT' && formData.NPWPNo) || formData.NPWPNo) {
                    formData.NPWPNo = formData.NPWPNo.replace(/\./g, '').replace(/-/g, '');
                }

                formData.CandidateId = $scope.candidateId;
                /// get list dependencies di data keluarga
                var listDependencies = getListDependencies(formData);
                formData.Dependencies = listDependencies;
                //get list education
                var listEducation = getListEducation(formData.CandidateId);
                formData.Educations = listEducation;
                //get list experience
                var listExperience = getListExperience(formData.CandidateId);
                formData.Experiences = listExperience;
                ////get list reference 
                var listReference = getListReference(formData.CandidateId);
                formData.References = listReference;
                ////get list work experience in insurance
                var listWorkExperiences = getListWorkExperience(formData.CandidateId);
                formData.WorkExperiences = listWorkExperiences;
                //// get list relation who work in insurance
                var listRelations = getListRelation(formData.CandidateId);
                formData.Relations = listRelations;
                //get id data pelengkap 
                formData.photoKtpId = $scope.photoKtpId;
                formData.photoDiriId = $scope.photoDiriId;
                formData.photoNpwpId = $scope.photoNpwpId;
                formData.photoKkId = $scope.photoKkId;
                formData.photoBukuTabunganId = $scope.photoBukuTabunganId;
                formData.photoBuktiTransferId = $scope.photoBuktiTransferId;
                //generate data ptkp
                generatePTKP();
                formData.PTKPHeader = $scope.candidate.PTKPHeader;
                formData.PTKPDetail = $scope.candidate.PTKPDetail;

                //get data signature from live signature
                //formData.RecruiterSignature = signaturePad.toDataURL("image/jpeg");
                //formData.CandidateSignature = signaturePad2.toDataURL("image/jpeg");

                //from upload file
                formData.RecruiterSignature = $scope.tandanTangan1;
                formData.CandidateSignature = $scope.tandanTangan2;

                //aaji exam id
                if (formData.AajiExam !== null) {
                    formData.AajiExamId = formData.AajiExam.AajiExamId;

                }

                //is pending doc
                if ($scope.isPendingDocument !== undefined || $scope.isPendingDocument !== null) {
                    formData.isPendingDocument = $scope.isPendingDocument;
                }

                //tambahan buat ispending
                if (formData.Status === 'DRAFT') {
                    formData.isPendingDocument = 1;
                }

                //var res = $http.post('api/mobile/RecuitmentForm/Submit', formData)
                var res = $http.post('api/RecuitmentForm/Submit', formData)
                .then(function SuccessCallBack(response) {
                    if (response.data.isSucceed) {
                        var msg = response.data.message;
                        //get user model
                        $scope.username = authService.authentication.userName;
                        $http({
                            method: 'GET',
                            url: '/api/Account/GetUser/',
                            params: { loginName: $scope.username },
                        }).then(function (response) {

                            var recruiterloginname = response.data.LoginName;
                            var managerloginname = response.data.ManagerLoginName
                            // insert proses add recruitment form activity log
                            var status = "Proses Add Recruitment Form";
                            var modelUser = {
                                CandidateID: formData.CandidateId,
                                RecruiterLoginName: recruiterloginname,
                                ManagerLoginName: managerloginname,
                                Status: status
                            };

                            $http.post('api/ActvityLog/WriteActivityLog', modelUser)
                                .then(function SuccesCallbBack(response) {

                                    //insert manager approval
                                    var status2 = "Proses";
                                    var modelUser2 = {
                                        CandidateID: formData.CandidateId,
                                        RecruiterLoginName: recruiterloginname,
                                        ManagerLoginName: managerloginname,
                                        Status: status2
                                    };

                                    $http.post('api/CandidateStatus/AddManagerApproval', modelUser2)
                                        .then(function SuccesCallbBack(response) {
                                            //$window.alert(msg); //disable alert sesuai hasil pentest

                                            $state.go('detailcontact', { id: formData.CandidateId });
                                            localStorageService.set('CandidateId', candidateId);
                                            $ctrl.close();
                                        }, function errorCallback(response) {
                                            swalAlert.message('e', response.data.ExceptionMessage);
                                        });

                                }, function errorCallback(response) {
                                    swalAlert.message('e', response.data.ExceptionMessage);
                                });
                        });
                    }
                    else {
                        swalAlert.message('e', response.data.message);
                    }
                }, function errorCallback(response) {
                    swalAlert.message('e', response.data.ExceptionMessage);
                }).finally(function () {
                    $('.spinner').fadeOut(500);
                    $(".OverlaySpinner").fadeOut(500);
                });
            } else {
                swalAlert.message('i', 'Pastikan semua data telah terisi dengan benar');
            }
        }

        $scope.gambar = "";
        $scope.gambar2 = "";


        //Upload File
        $scope.openPhotoPopUp = function (type) {
            $scope.PhotoType = type;
            var modalInstance = $uibModal.open({
                component: 'photoUploadContent',
                size: 'md',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        };

        $scope.openPhotoPopUp64 = function (filePelengkap) {
            $scope.PhotoType = filePelengkap;
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'photoUploadComponent64',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            })
            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                //$log.info('modal-component dismissed at: ' + new Date());
            });
        };
        //End Upload File

        // open popup manager
        $scope.lookup = function () {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'directManagerPopUp.html',
                controller: popUpManagerCtrl,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        }

        // open popup exam location
        $scope.openPopupExamLocation = function () {

            if ($scope.candidate.AajiExam === undefined) {
                swalAlert.message('i', 'Harap pilih jenis ujian terlebih dahulu !');
            } else {
                var isExist = false;
                var examType = $scope.candidate.AajiExam.ExamType;
                angular.forEach($scope.listkotatest, function (country) {
                    if (country.ExamType.toLowerCase().indexOf(examType.toLowerCase()) >= 0) {
                        isExist = true;
                    }
                });

                if (!isExist) {
                    swalAlert.message('i', 'Data kota dengan jenis ujian ' + examType + ' kosong !');
                    return;
                }

                $scope.modalInstance = $uibModal.open({
                    templateUrl: 'examLocationContent.html',
                    controller: popUpExamLocationController,
                    windowClass: 'app-modal-window',
                    resolve: {
                        items: function () {
                            return $scope;
                        }
                    }
                });
            }
        }

        $scope.openPopUpPickCalendar = function () {
            if ($scope.candidate.AajiExam === undefined || $scope.candidate.AajiExam.ExamLocationId === undefined) {
                swalAlert.message('i', 'Harap pilih Lokasi Ujian atau Jenis Ujian terlebih dahulu !');
            } else {
                var ExamType = $scope.candidate.AajiExam.ExamType;
                var limitDay = (ExamType.toLowerCase() == 'paper' ? 10 : 5);
                $('#inputExamDate').datepicker('option', 'minDate', limitDay);
                $('#inputExamDate').datepicker("show");
            }
        }

        // open popup calendar
        //$scope.openPopUpPickCalendar = function () {
        //    if ($scope.candidate.AajiExam === undefined || $scope.candidate.AajiExam.ExamLocationId === undefined) {
        //        swalAlert.message('i', 'Harap pilih Lokasi Ujian atau Jenis Ujian terlebih dahulu !');
        //    } else {
        //        $scope.modalInstance = $uibModal.open({
        //            templateUrl: 'pickCalendarContent.html',
        //            controller: popUpCalendarController,
        //            windowClass: 'app-modal-window',
        //            resolve: {
        //                items: function () {
        //                    return $scope;
        //                }
        //            }
        //        });
        //    }
        //}

        //document.getElementById("agreement").onscroll = function () { scrollAgreement() };
        //var scrollAgreement = function () {
        //    var height = $('#agreement').scrollTop();
        //    if (Number(height) > 200) {
        //        $('#aggrement').prop('disabled', false);

        //        $('#lbl_Agreement').addClass('aktif');
        //        $('#lbl_Agreement').removeClass('nonaktif');
        //    } else {
        //        $('#lbl_Agreement').addClass('nonaktif');
        //        $('#lbl_Agreement').removeClass('aktif');
        //        $('#aggrement').prop('disabled', true);
        //    }
        //}

        $('#cb_Agreement').click(function () {
            if ($(this).hasClass('disabled')) {
                $(this).prop('checked', false);
            }
        });

        //open pop up
        $scope.openPopUpLocation = function (formData) {
            var data;
            if (formData !== null) {
                data = formData;

                $scope.model = data;
            } else {
                $scope.model = null;
            }
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                component: 'locationComponent2',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                //$log.info('modal-component dismissed at: ' + new Date());
            });
        };

        $scope.listkotatest = [];

        var loadListExamLocation = function () {
            $http({ method: 'GET', url: 'api/ExamLocation/GetAllListExamLocationPortal' }).
               then(function (response) {
                   $scope.listkotatest = response.data;
               });
        }

        loadListExamLocation();

    }

    function popUpManagerCtrl($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;
        $scope.loading = myService;

        $scope.selectedItem = null;
        $scope.filterOptions2 = {
            agentCode: "",
            displayName: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions2 = {
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData2 = function (data, page, pageSize, length) {
            $scope.managerData = data;
            $scope.totalServerItems = length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //filter manager based on business type dropdown
        $scope.getPagedDataAsync2 = function (pageSize, page, agentcode, displayname) {
            setTimeout(function () {
                var data;
                $http({ method: 'GET', url: 'api/Account/GetManager', params: { agentCode: agentcode, displayName: displayname, page: page, rowsPage: pageSize } }).
                    then(function (response) {
                        if (response.data.length <= 0) {
                            $scope.myData = response.data;
                            $scope.totalServerItems = 0;
                        }
                        $scope.setPagingData2(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
                    });
            }, 100);
        };

        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);

        $scope.$watch('pagingOptions2', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.agentCode, $scope.filterOptions2.displayName);
            }
        }, true);

        $scope.search2 = function (agentcode, displayname) {
            $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, agentcode, displayname);
        };
        $scope.clearFilter2 = function (pageSize, currentPage) {
            $scope.filterOptions2.filterText = "";
            $scope.getPagedDataAsync2(pageSize, currentPage);
        };

        $scope.grid2Options = {
            data: 'managerData',
            enablePaging: true,
            totalServerItems: 'totalServerItems',
            showFooter: true,
            enableRowSelection: true,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions2,
            filterOptions: $scope.filterOptions2,
            columnDefs: [
                { field: 'AgentCode', displayName: 'Kode Agen' },
                { field: 'DisplayName', displayName: 'Nama' }
            ],
            afterSelectionChange: function (row, event) {
                var i = row.rowIndex;
                if (row.selected) {
                    $scope.selectedItem = row.selectionProvider.selectedItems;
                }
            },
        };
        $scope.cancelManager = function () {
            $scope.$resolve.items.modalInstance.close();
        };

        $scope.okManager = function () {
            if ($scope.selectedItem !== null) {
                $scope.$resolve.items.candidate.ManagerAgentCode = $scope.selectedItem[0].AgentCode;
                $scope.$resolve.items.candidate.DisplayName = $scope.selectedItem[0].DisplayName;
                $scope.$resolve.items.modalInstance.close();
            }
            else {
                swalAlert.message('i', 'Please Choose !!!');
            }
        };
    }

    //ini buat pop up exam location
    function popUpExamLocationController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;
        var examtype = $scope.$resolve.items.candidate.AajiExam.ExamType;

        //var validateLocation = function (string) {
        //    string = string.Name + ' - ' + string.CityName;
        //    angular.forEach($scope.$resolve.items.listkotatest, function (country) {
        //        var comb = country.Name + ' - ' + country.CityName;
        //        if (comb.toLowerCase().indexOf(string.toLowerCase()) >= 0 && country.ExamType.toLowerCase().indexOf(examtype.toLowerCase()) >= 0 && country.Id.toLowerCase().indexOf(examtype.toLowerCase()) >= 0) {
        //            return true;
        //        }
        //    });
        //    return false;
        //}

        $scope.complete = function (string) {
            var output = [];
            $scope.filterCountry = null;
            angular.forEach($scope.$resolve.items.listkotatest, function (country) {
                if (!string || string === ' ') {
                    if (country.ExamType.toLowerCase().indexOf(examtype.toLowerCase()) >= 0) {
                        output.push(country);
                    }
                } else {
                    if (country.Name.toLowerCase().indexOf(string.toLowerCase()) >= 0 && country.ExamType.toLowerCase().indexOf(examtype.toLowerCase()) >= 0) {
                        output.push(country);
                    }
                }
            });

            $scope.filterCountry = output;
        }
        $scope.showListKota = function () {
            $scope.cityyyId = null;
            $scope.complete(' ');
        }
        $scope.fillTextbox = function (string) {
            $scope.cityyyId = string.Id;
            $scope.cityyy = string.Name + ' - ' + string.CityName;
            $scope.filterCountry = null;
        }

        //start sementara ga dipake
        $scope.selectedItem = null;
        $scope.changeAaji2 = function () {
            $scope.$resolve.items.candidate.AajiExam.AajiExamId = '';
            $scope.$resolve.items.candidate.AajiExam.AajiExamDate = '';
        };
        //$scope.filterOptions2 = {
        //    cityCode: '',
        //    cityName: '',
        //    name: ''
        //}

        //$scope.totalServerItems = 0;
        //$scope.pagingOptions2 = {
        //    pageSize: 10,
        //    currentPage: 1
        //};
        //$scope.setPagingData2 = function (data, page, pageSize, length) {
        //    $scope.examLocationData = data;
        //    $scope.totalServerItems = length;
        //    if (!$scope.$$phase) {
        //        $scope.$apply();
        //    }
        //};
        //$scope.getPagedDataAsync2 = function (pageSize, page, cityname, name) {
        //    var examtype = $scope.$resolve.items.candidate.AajiExam.ExamType;
        //    setTimeout(function () {
        //        $('.spinner').fadeIn(500);
        //        $(".OverlaySpinner").fadeIn(500);
        //        if (cityname || name) {
        //            $http({ method: 'GET', url: 'api/ExamLocation/GetListExamLocationPortal', params: { page: page, rowspPage: pageSize, Name: name, CityName: cityname, ExamType: examtype } }).
        //                then(function (response) {
        //                    if (response.data.length <= 0) {
        //                        $scope.examLocationData = response.data;

        //                        $scope.totalServerItems = 0;
        //                    }

        //                    $scope.setPagingData2(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);

        //                }).finally(function () {
        //                    $('.spinner').fadeOut(500);
        //                    $(".OverlaySpinner").fadeOut(500);
        //                });
        //        }
        //        else {
        //            $http({ method: 'GET', url: 'api/ExamLocation/GetListExamLocationPortal', params: { page: page, rowspPage: pageSize, Name: name, CityName: cityname, ExamType: examtype } }).
        //                then(function (response) {

        //                    $scope.setPagingData2(response.data, page, pageSize, response.data.length > 0 ? response.data[0].Length : 0);
        //                }).finally(function () {
        //                    $('.spinner').fadeOut(500);
        //                    $(".OverlaySpinner").fadeOut(500);
        //                });
        //        }
        //    }, 100);
        //};
        //$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);
        //$scope.$watch('pagingOptions2', function (newVal, oldVal) {
        //    if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
        //        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.cityCode, $scope.filterOptions2.cityName, $scope.filterOptions2.name);
        //    }
        //}, true);
        //$scope.search2 = function (cityname, name) {
        //    $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, cityname, name);
        //};
        //$scope.clearFilter2 = function (pageSize, currentPage) {
        //    $scope.filterOptions2.cityCode = "";
        //    $scope.filterOptions2.cityName = "";
        //    $scope.filterOptions2.name = "";
        //    $scope.getPagedDataAsync2(pageSize, currentPage);
        //};
        //$scope.grid2Options = {
        //    data: 'examLocationData',
        //    enablePaging: true,
        //    totalServerItems: 'totalServerItems',
        //    showFooter: true,
        //    enableRowSelection: true,
        //    multiSelect: false,
        //    pagingOptions: $scope.pagingOptions2,
        //    filterOptions: $scope.filterOptions2,
        //    columnDefs: [
        //        { field: 'Id', visible: false },
        //        { field: 'CityId', visible: false },
        //        { field: 'Name', displayName: 'Nama Lokasi' },
        //        { field: 'CityName', displayName: 'Nama Kota' },

        //    ],
        //    afterSelectionChange: function (row, event) {
        //        var i = row.rowIndex;
        //        if (row.selected) {
        //            $scope.selectedItem = row.selectionProvider.selectedItems;
        //        }
        //    },
        //};
        //end sementara ga dipake

        $scope.cancelExamLocation = function () {
            $scope.$resolve.items.modalInstance.close();
        };
        $scope.okExamLocation = function () {
            //if ($scope.selectedItem !== null) {
            if ($scope.cityyyId) {
                $scope.changeAaji2();
                $scope.$resolve.items.candidate.AajiExam.ExamLocationId = $scope.cityyyId;
                $scope.$resolve.items.candidate.AajiExam.ExamLocationName = $scope.cityyy;
                $scope.$resolve.items.modalInstance.close();
            };
        }
    }

    function popUpCalendarController($scope, myService, $http, $uibModal, $log, $document, $window, $compile, $timeout, uiCalendarConfig, swalAlert) {

        var $ctrl = this;
        var examType = "";
        var examLocationId = "";


        $ctrl.$onInit = function () {
            examType = $scope.$resolve.items.candidate.AajiExam.ExamType;
            examLocationId = $scope.$resolve.items.candidate.AajiExam.ExamLocationId;
            $scope.fillExamAajiExam(examType, examLocationId);
        };

        //$scope.listExamType = [];

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.month = date.getMonth() + 1;
        $scope.year = date.getFullYear();

        $scope.finalexam = [];
        $scope.eventSources = [$scope.finalexam];

        $scope.fillExamAajiExam = function (selectedexamtype, selectedcity) {
            if (selectedexamtype !== null && selectedcity !== null) {
                $scope.finalexam.length = 0;
                $http({
                    method: 'GET',
                    url: 'api/AajiExam/GetScheduleAajiExam',
                    params: { month: $scope.month, year: $scope.year, examtype: examType, cityid: examLocationId }
                })
                    .then(function (response) {
                        var data = response.data;
                        if (data !== null) {
                            var length = data.length;
                            for (var i = 0; i < length; i++) {
                                $scope.finalexam.push(data[i]);
                            }
                        } else {
                            $scope.finalexam = [];
                        }
                    });
            };
        }

        //-------------------------------------------------------------------------------------------------
        ///* alert on eventClick */
        $scope.alertOnEventClick = function (date, jsEvent, view) {

            var vm = {
                Id: date.id,
                Title: date.start,
                Description: date.ExamLocationName + ' ' + date.RegisteredUser + ' ' + date.Note,
                Date: date.start
            };
            $scope.openPopUpCalendarDetail(vm);

        };
        $scope.renderCalendar = function (calendar) {
            $timeout(function () {
                if (uiCalendarConfig.calendars[calendar]) {
                    uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
            });
        };
        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: false,
                header: {
                    left: '',
                    center: 'title',
                    right: 'prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };
        //open pop up detail
        $scope.openPopUpCalendarDetail = function (formData) {
            var data;
            if (formData !== null) {
                data = formData;
                $scope.model = data;
            } else {
                $scope.model = null;
            }
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'calendarContent.html',
                controller: popUpCalendarDetailController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        }
        // open popup city
        $scope.openPopUpCity = function () {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'cityContent.html',
                controller: popUpCityController,
                windowClass: 'app-modal-window',
                resolve: {
                    items: function () {
                        return $scope;
                    }
                }
            });
        }

        var generateDisplayDate = function () {
            var candidateid = $scope.$resolve.items.candidateId;
            if (candidateid !== null || candidateid !== undefined) {
                $http({
                    method: 'GET',
                    url: 'api/Aaji/GetAajiByCandidate',
                    params: { CandidateId: candidateid }
                })
                .then(function (response) {
                    $scope.scheduleaaji = response.data;
                });
            }
        }

        generateDisplayDate();
    }

    function popUpCalendarDetailController($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;
        var candidateid = "";
        $ctrl.$onInit = function () {
            $scope.aaji = $scope.$resolve.items.model;
            candidateid = $scope.$resolve.items.$resolve.items.candidateId;
        };

        ////Button Save:
        $scope.ok = function (formData) {
            var status = confirm("Apakah anda yakin akan memilih tanggal ujian ini ? ");
            if (status) {


                formData.CandidateId = candidateid;
                formData.AajiExamId = formData.Id;
                var res = $http.post('api/RecruitmentForm/RescheduleAajiExam', formData)
                   .then(function SuccessCallBack(response) {
                       if (response.data.isSucceed) {
                           $scope.$resolve.items.$resolve.items.candidate.AajiExam.AajiExamId = formData.Id;
                           $scope.$resolve.items.$resolve.items.candidate.AajiExam.AajiExamDate = formData.Date;
                           swalAlert.message('s', response.data.message);
                           $scope.$resolve.items.generateDisplayDate();
                           $ctrl.close();
                       }
                       else {
                           $scope.$resolve.items.$resolve.items.candidate.AajiExam.AajiExamId = "";
                           $scope.$resolve.items.$resolve.items.candidate.AajiExam.AajiExamDate = "";
                           swalAlert.message('e', response.data.message);
                       }
                   }, function errorCallback(response) {
                       swalAlert.message('e', response.data.ExceptionMessage);
                   });


                $scope.cancel();
            }
        };

        $scope.cancel = function () {

            //close current form
            $scope.$resolve.items.modalInstance.close();
            //close calendar form
            $scope.$resolve.items.$close();
        };
    }

    function popUpLocationController2($scope, myService, $http, $uibModal, $log, $document, $window, swalAlert) {
        var $ctrl = this;
        var candidateid = 0;


        $ctrl.$onInit = function () {

            var dataResolve = $ctrl.resolve.items;
            candidateid = dataResolve.candidateId;
        };

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        function sortLocation() {
            $ctrl.resolve.items.listlocation.sort(function (a, b) {
                var aa = typeof a.AgentLocation == "string" ? a.AgentLocation.toLowerCase() : a.AgentLocation;
                var bb = typeof b.AgentLocation == "string" ? b.AgentLocation.toLowerCase() : a.AgentLocation;
                if (aa < bb)
                    return -1;
                if (aa > bb)
                    return 1;
                return 0;
            });
        }

        //Button Save:
        $ctrl.ok = function (formData) {
            // di tambah is approved = false dan candidateid dikarenakan yang input bukan admin langsung
            formData.IsApproved = false;
            formData.CandidateId = candidateid;
            formData.AgentLocationCode = guid();
            var res = $http.post('api/Location/Submit', formData)
                .then(function SuccessCallBack(response) {
                    if (response.data.isSucceed) {
                        var data = $ctrl.resolve.items;
                        data.listlocation.push({
                            AgentLocationCode: formData.AgentLocationCode,
                            AgentLocation: formData.AgentLocation
                        });

                        data.candidate.LocationCode = formData.AgentLocationCode;
                        sortLocation();
                        //$window.alert(response.data.message);
                        swalAlert.message('s', response.data.message);

                        $ctrl.close();
                    }
                    else {
                        //$window.alert(response.data.message);
                        swalAlert.message('e', response.data.message);
                    }
                }, function errorCallback(response) {
                    //$window.alert(response.data.ExceptionMessage);
                    swalAlert.message('e', response.data.ExceptionMessage);
                });
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
            $ctrl.resolve.items.candidate.LocationCode = null;
            //$ctrl.resolve.items.search();
        };
    }

})(angular.module('SunLifeApp'));