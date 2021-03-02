(function () {
    'use strict';
    var app = angular.module('SunLifeApp', ['ngIdle', 'ui.router', 'LocalStorageModule', 'base64', 'naif.base64', 'ngCookies', 'ngAnimate', 'ngSanitize', 'ngGrid', 'angular.filter', 'ui.tinymce', 'ngHamburger', 'ui.swiper', 'chart.js', 'ui.calendar', 'ui.bootstrap', 'ui.utils.masks','ui.mask']);
    app.service('roleAccess', function () {
        var listLink = [];

        var addListLink = function (newObj) {
            listLink = [];
            listLink.push(newObj);
        };

        var cekIsAllow = function (str) {
            var result = false;
            if ($scope.listLink) {
                var temp = $scope.listLink.filter(x=>x.MenuName == str)
                if (temp && temp.length > 0) {
                    result = true;
                }
            }
            return result;
        };

        return {
            addListLink: addListLink,
            getListLink: getListLink,
        };
    });
    app.factory('myService', function () {
        return {

        };
    });

    app.constant('ngAuthSettings', {
        clientId: 'ngAuthApp'
    });

    app.config(['KeepaliveProvider', 'IdleProvider', 'TitleProvider', function (KeepaliveProvider, IdleProvider, TitleProvider) {
        TitleProvider.enabled(false); // it is enabled by default
        IdleProvider.idle(950); //ini default nya 15 menit
        //IdleProvider.timeout(5);
        KeepaliveProvider.interval(10);
    }]);

    //var validateState = function () {
    //    var defer = $q.defer();
    //    if (authService.authentication.roleName == 'Admin') {
    //        defer.resolve();
    //    } else {
    //        defer.reject("Access blocked");
    //        $location.path('/');
    //    };
    //    return defer.promise;
    //}

    app.run(function ($rootScope, Idle, authService, $state, $http, $q, $location, swalAlert) {
        Idle.watch();
        $rootScope.$on('IdleStart', function () {/* Display modal warning or sth */
            if (authService.authentication.roleName) {
                authService.logOut();
                 //location.reload();
                //Idle.unwatch();/* Logout user */
                $state.go('auth');
               
            }
        });
        // $rootScope.$on('IdleTimeout', function () {
        //if (authService.authentication.roleName) {
        //    authService.logOut();
        //    //Idle.unwatch();/* Logout user */
        //    $state.go('auth');
        //}
        //Idle.watch();
        //});

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            var fUrl = (fromState.url);
            var tUrl = (toState.url);
            var exceptionLink = ['^', '/sunlife', '/login', '/invitation/:link']
            var defer = $q.defer();
            if (exceptionLink.indexOf(tUrl) == -1) {
                if (authService.authentication.roleName == 'Admin') {
                    $http({ method: 'GET', url: 'api/RoleMenu/GetAccess', params: { link: tUrl } }).
                          then(function (response) {
                              if (!response.data.isSucceed) {
                                  event.preventDefault();
                                  defer.reject();
                                  swalAlert.confirmCustom(response.data.message, function (isConfirmed) {
                                      if (isConfirmed) {

                                      }
                                  });
                                  return $state.go('homePageCMS');

                              } else {
                                  defer.resolve();
                              };
                          });
                } else if (authService.authentication.roleName) {
                    //cek jika tujuan url ada yg ke admin .. langsung redirect
                }
            }
        });   //end rootscope
    });

    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('sunlife', {
                url: '/sunlife',
                views: {
                    'content': {
                        templateUrl: 'ClientApp/views/landingpage/dashboard.html'
                    }
                }
            })
            .state('auth', {
                url: '/login',
                views: {
/*                    'header': {
                        templateUrl: 'ClientApp/views/Home/header-login.html'
                    },*/
                    'content': {
                        templateUrl: 'ClientApp/views/Home/content-login.html',
                        controller: 'loginController'
                    }/*,
                    'footer': {
                        templateUrl: 'ClientApp/views/Home/footer-login.html'
                    }*/
                }
            })

            .state('createAccount', { 
                url: '/createAccount',
                //controller: 'menuCtrl',
                views: {
                    /*                'header': {
                                        templateUrl: 'ClientApp/views/shared/navbar.html'
                                    },*/
                    'content': {
                        templateUrl: "ClientApp/views/Home/content-create-account.html",
                        controller: 'createAccountController'
                    }
                }
            })

            .state('forgotPassWord', {    
                url: '/forgotPassword',
                controller: 'menuController',
                views: {
                    'content': {
                        templateUrl: "ClientApp/views/Home/content-create-forgot.html",
                        controller: 'forgotPasswordController'
                    }
                }
            })

        .state('homeNew', {
            url: '/homeNew',
            controller: 'menuController',
            cache:false,
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/dashboard/navbar.html',
                    controller: 'menuController'
                },
                'content': {
                    templateUrl: 'ClientApp/views/dashboard/content-dashboard.html',
                    controller: 'rekrutmenDashboardController'
                    //controller: 'rekrutmenDataDokumenController'
                }
            }
        })
        .state('about', {
            url: '/about',
            controller: 'menuController',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                    controller: 'menuController'
                },
                'content': {
                    templateUrl: "ClientApp/views/about/content-tentang-kami.html",
                    controller: ''
                }
            }
        })
            .state('applicantStatus', {
                url: '/status',
                controller: 'menuController',
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: "ClientApp/views/applicantStatus/content-aplikasi.html",
                        controller: 'statusAplikasiController'
                    }
                }
            })
            .state('webTentangSunlife', {
                url: '/tentangSunlife',
                controller: 'menuController',
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: "ClientApp/views/tentangSunlife/content-tentangSunlife.html",
                        controller: 'tentangSunlifeController'
                    }
                }
            })
        .state('profile', {
            url: '/profile',
            controller: 'menuController',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                    controller: 'menuController'
                },
                'content': {
                    //templateUrl: "ClientApp/views/profiling/Index.html",
                    controller: 'profileAccountController',
                    templateUrl: "ClientApp/views/profile/content-profil.html"
                }
            }
        })

        .state('changeProfile', {
            url: '/changeProfile',
            controller: 'menuController',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                    controller: 'menuController'
                },
                'content': {
                    //templateUrl: "ClientApp/views/profiling/Index.html",
                    controller: 'profileAccountController',
                    templateUrl: "ClientApp/views/profile/content-profil-ubah.html"
                }
            }
        })

        .state('rekrutmenDataPribadi', {
            url: '/data-pribadi',
           // params: { 'candidateid': null },
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                    controller: 'menuController'
                },
                'content': {
                    templateUrl: 'ClientApp/views/rekrutmenDataPribadi/content-data-pribadi.html',
                    controller: 'rekrutmenDataPribadiController'
                }
            }
        })
            .state('rekrutmenKontak', {
                url: '/data-kontak',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenKontak/content-data-kontak.html',
                        controller: 'rekrutmenKontakController'
                    }
                }
            })
            .state('rekrutmenDataKeluarga', {
                url: '/data-keluarga',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenDataKeluarga/content-data-keluarga.html',
                        controller: 'rekrutmenDataKeluargaController'
                    }
                }
            })
            .state('rekrutmenPendidikan', {
                url: '/data-pendidikan',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenPendidikan/content-data-pendidikan.html',
                        controller: 'rekrutmenDataPendidikanController'
                    }
                }
            })
            .state('rekrutmenPekerjaan', {
                url: '/data-pekerjaan',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenPekerjaan/content-data-pekerjaan.html',
                        controller: 'rekrutmenDataPekerjaanController'
                    }
                }
            })
            .state('rekrutmenDokumen', {
                url: '/data-dokumen',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenDokumen/content-data-dokumen.html',
                        controller: 'rekrutmenDataDokumenController'
                    }
                }
            })
            .state('rekrutmenPsikotes', {
                    url: '/data-psikotes',
                    // params: { 'candidateid': null },
                    views: {
                        'header': {
                            templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                            controller: 'menuController'
                        },
                        'content': {
                            templateUrl: 'ClientApp/views/rekrutmenPsikotes/content-data-psikotes.html',
                            controller: 'rekrutmenPsikotesMulaiController'
                        }
                    }
                })
                .state('rekrutmenPsikotesMulai', {
                        url: '/data-psikotes-start',
                        // params: { 'candidateid': null },
                        views: {
                            'header': {
                                templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                                controller: 'menuController'
                            },
                            'content': {
                                templateUrl: 'ClientApp/views/rekrutmenPsikotes/content-data-psikotes-start.html',
                                controller: 'rekrutmenPsikotesMulaiController'
                            }
                        }
                })
            .state('rekrutmenPsikotesFinish', {
                url: '/data-psikotes-finish',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenPsikotes/content-data-psikotes-finish.html',
                        controller: 'rekrutmenPsikotesMulaiController'
                    }
                }
            })
            .state('rekrutmenPapikostik', {
                url: '/data-papikostik',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenPapikostik/content-data-papikostik.html',
                        controller: 'rekrutmenPapikostikMulaiController'
                    }
                }
            })
            .state('rekrutmenReview', {
                url: '/data-review',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenReview/content-data-review.html',
                        controller: 'rekrutmenDataDokumenController'
                    }
                }
            })
            .state('rekrutmenPTKP', {
                url: '/data-ptkp',
                // params: { 'candidateid': null },
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/navbar-other.html',
                        controller: 'menuController'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/rekrutmenDataPTKP/content-data-PTKP.html',
                        controller: 'rekrutmenDataPTKPController'
                    }
                }
            })
        .state('profilingResult', {
            url: '/profilingResult',
            params: { 'Point': null, 'RecPosition': null, 'ReadResultOnly': null },
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: 'ClientApp/views/Profiling/content-profiling-result.html',
                    controller: 'resultProfilingAgentController'
                }
            }
        })
        .state('city', {
            url: '/city',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/city/Index.html",
                    controller: 'cityController'
                }
            }
        })
        .state('fileupload', {
            url: '/fileupload',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/fileUpload/index.html",
                    controller: 'fileUploadController'
                }
            }
        })
        .state('team', {
            url: '/myteam',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: 'ClientApp/views/account/myteam.html'
                }
            }
        })
        .state('account', {
            url: '/account',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html',
                    controller: 'menuController'
                },
                'content': {
                    templateUrl: "ClientApp/views/account/index.html",
                    controller: 'accountController'
                }
            }
            //,
            //resolve: {
            //    validate: function($q, $location) {
            //        return validateState();
            //    }   
            //}
        })
        .state('changePassword', {
            url: '/changePassword/:link',
            views: {
  /*              'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },*/
                'content': {
                    templateUrl: "ClientApp/views/changePassword/content-setting-forgot.html",
                    controller: 'changePasswordController'
                }
            }
        })

            .state('changePasswordFromSetting', {
                url: '/changePasswordFromSetting/',
                views: {
                    'header': {
                                      templateUrl: 'ClientApp/views/dashboard/navbar.html',
                                      controller: 'menuController'
                                  },
                    'content': {
                        templateUrl: "ClientApp/views/changePassword/content-setting.html",
                        controller: 'changePasswordFromSettingController'
                    }
                }
            })

        .state('contact', {
            url: '/contact',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: 'ClientApp/views/contact/content-contact.html',
                    controller: 'contactController'
                }
            }
        })
        .state('addcontact', {    //addcontact
            url: '/addContact',
            controller: 'menuCtrl',
            views: {
/*                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html'
                },*/
                'content': {
                    templateUrl: "ClientApp/views/contact/content-create-account.html",
                    controller: 'contactController'
                }
            }
        })
        .state('detailcontact', {
            url: '/detailContact',
            params: { 'id': null },
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl',
                },
                'content': {
                    templateUrl: 'ClientApp/views/contact/content-detail-kontak.html',
                    controller: 'detailContactController'
                }
            }
        })
        .state('recruitment', {
            url: '/recruitmentForm',
            params: { 'candidateid': null, 'ispendingdocument': null },
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: "ClientApp/views/recruitmentForm/index.html",
                    controller: 'recruitmentFormController'
                }
            }
        })
        .state('approval', {
            url: '/approvalForm',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: 'ClientApp/views/approvalForm/content-persetujuan.html',
                    controller: 'approvalFormController'
                }
            }
        })
        .state('detailapproval', {
            url: '/detailApproval',
            params: { 'id': null, 'candidateId': null },
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: "ClientApp/views/approvalForm/detail_approval.html",
                    //controller: 'detailApprovalFormController'
                }
            }
        })
        .state('homePage', {
            url: '/homePage',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: "ClientApp/views/dashboard/home.html",
                    controller: 'homePageController'
                }
            }
        })
        .state('jadwalAaji', {
            url: '/jadwalAaji',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: 'ClientApp/views/jadwalAaji/content-aaji.html',
                    controller: 'CalendarCtrl'
                }
            }
        })
        .state('messages', {
            url: '/messages',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: "ClientApp/views/messages/index.html",
                    controller: 'messagesController'
                }
            }
        })
        .state('jadwalAajiCms', {
            url: '/jadwalAajiCms',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/jadwalAajiCms/index.html",
                    controller: 'jadwalAajiCmsController'
                }
            }
        })
        .state('faqFront', {
            url: '/faqFront',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: 'ClientApp/views/faq/content-faq.html',
                    controller: 'faqFrontController'
                }
            }
        })
        .state('bank', {
            url: '/bank',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/bank/index.html",
                    controller: 'bankController'
                }
            }
        })
        .state('country', {
            url: '/country',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/country/index.html",
                    controller: 'countryController'
                }
            }
        })
            .state('teamcms', {
                url: '/team',
                controller: 'menuCtrl',
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/shared/navbarCms.html'
                    },
                    'content': {
                        templateUrl: "ClientApp/views/team/Index.html",
                        controller: 'teamController'
                    }
                }
            })
            .state('locationcms', {
                url: '/location',
                controller: 'menuCtrl',
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/shared/navbarCms.html'
                    },
                    'content': {
                        templateUrl: "ClientApp/views/location/index.html",
                        controller: 'locationController'
                    }
                }
            })
            .state('examLocationCms', {
                url: '/examLocation',
                controller: 'menuCtrl',
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/shared/navbarCms.html'
                    },
                    'content': {
                        templateUrl: "ClientApp/views/examlocation/index.html",
                        controller: 'examLocationController'
                    }
                }
            })
            .state('roleCms', {
                url: '/role',
                controller: 'menuCtrl',
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/shared/navbarCms.html'
                    },
                    'content': {
                        templateUrl: "ClientApp/views/role/index.html",
                        controller: 'roleController'
                    }
                }
            })
            .state('menuCms', {
                url: '/menu',
                controller: 'menuCtrl',
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/shared/navbarCms.html'
                    },
                    'content': {
                        templateUrl: "ClientApp/views/menu/index.html",
                        controller: 'menuController'
                    }
                }
            })
        .state('hierarki', {
            url: '/hierarki',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/approval/hierarki.html",
                    controller: 'hierarkiController'
                }
            }
        })
        .state('approvalRule', {
            url: '/approvalRule',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/approval/approvalRules.html",
                    controller: 'approvalRulesController'
                }
            }
        })
        .state('documentCheckCms', {
            url: '/documentCheck',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/documentCheck/Index.html",
                    controller: 'documentCheckController'
                }
            }
        })
        .state('documentCheckDetailCms', {
            url: '/documentCheckDetail',
            controller: 'menuCtrl',
            params: { 'candidateid': null },
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/documentCheckDetail/Index.html",
                    //controller: 'documentCheckController'
                }
            }
        })
        .state('groupCms', {
            url: '/groupCms',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/group/index.html",
                    controller: 'groupController'
                }
            }
        })
        .state('usergroupCms', {
            url: '/usergroupCms',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/userGroup/index.html",
                    controller: 'usergroupController'
                }
            }
        })
        .state('groupmenuCms', {
            url: '/groupmenuCms',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/groupMenu/index.html",
                    controller: 'groupMenuController'
                }
            }
        })
        .state('globalconfiguration', {
            url: '/globalconfiguration',
            controller: "menuCtrl",
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/globalconfiguration/index.html",
                    controller: 'globalConfigurationController'
                }
            }
        })
        .state('profilingmatrix', {
            url: '/profilingmatrix',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/profilingmatrix/index.html",
                    controller: 'profilingMatrixController'
                }
            }
        })
        .state('provincecms', {
            url: '/province',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/province/Index.html",
                    controller: 'provinceController'
                }
            }
        })
        .state('ExamResult', {
            url: '/ExamResult',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/examresult/index.html",
                    controller: 'examResultController'
                }
            }
        })
        .state('agentactive', {
            url: '/agentactive',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/agentactive/index.html",
                    controller: 'agentActiveController'
                }
            }
        })
        .state('approvalaaji', {
            url: '/approvalaaji',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/approvalaaji/Index.html",
                    controller: 'approvalAajiController'
                }
            }
        })
        .state('approvaltracking', {
            url: '/approvalTracking',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/approvalTracking/Index.html",
                    controller: 'approvalTrackingController'
                }
            }
        })
        .state('rolehierarki', {
            url: '/roleHierarki',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/roleHierarki/Index.html",
                    controller: 'roleHierarkiController'
                }
            }
        })
        .state('homePageCMS', {
            url: '/homePageCMS',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/dashboardcms/home.html",
                    controller: 'homePageCMSController'
                }
            }
        })
        .state('pendingDocument', {
            url: '/pendingDocument',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: "ClientApp/views/pendingDocument/content-pending-doc.html",
                    controller: 'pendingDocumentController'
                }
            }
        })
        .state('generatePdf', {
            url: '/generatePdf',
            params: { 'candidateid': null },
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbar.html',
                    controller: 'menuCtrl'
                },
                'content': {
                    templateUrl: "ClientApp/views/pdf/pdfperjanjian.html",
                    controller: 'pdfPerjanjianController'
                }
            }
        })
        .state('documentPreview', {
            url: '/documentPreview',
            params: { 'id': null },
            views: {
                //'header': {
                //    templateUrl: 'ClientApp/views/shared/navbar.html',
                //    controller: 'menuCtrl'
                //},
                'content': {
                    //templateUrl: "ClientApp/views/testPdf/testPdf.html",
                    templateUrl: "ClientApp/views/previewDocument/index.html",
                    controller: 'testPdfcontroller'
                }
            }
        })
        .state('versionCms', {
            url: '/versionCms',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/versionCms/index.html",
                    controller: 'versionCmsController'
                }
            }
        })
        .state('DokumenStatusCms', {
            url: '/DokumenStatusCms',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/applicantStatus/Index.html",
                    controller: 'applicantStatusController'
                }
            }
        })
        .state('userRole', {
            url: '/UserRoleCms',
            controller: 'menuCtrl',
            views: {
                'header': {
                    templateUrl: 'ClientApp/views/shared/navbarCms.html'
                },
                'content': {
                    templateUrl: "ClientApp/views/userRole/Index.html",
                    controller: 'userRoleController'
                }
            }
        })
          .state('uploadCms', {
              url: '/UploadCms',
              controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/shared/navbarCms.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/uploadCms/Index.html",
                      controller: 'uploadCmsController'
                  }
              }
          })
          .state('download', {
              url: '/DownloadCms',
              controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/shared/navbarCms.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/download/Index.html",
                      controller: 'downloadController'
                  }
              }
          })
          .state('aml', {
              url: '/aml',
              controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/shared/navbarCms.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/aml/Index.html",
                      controller: 'amlController'
                  }
              }
          })
          .state('google', {
              url: '/google',
              controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/shared/navbarCms.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/aml/IndexGoogl.html",
                      controller: 'googleController'
                  }
              }
          })
          .state('cekaaji', {
              url: '/cekaaji',
              controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/shared/navbarCms.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/aaji/index.html",
                      controller: 'aajiController'
                  }
              }
          }).state('seminar', {
              url: '/seminarCms',
              controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/shared/navbarCms.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/seminar/seminarCms.html",
                      controller: 'seminarController'
                  }
              }
          }).state('invitation', {
              url: '/invitation/:link',
              //params: { 'candidateid': null, 'seminarid': null },
              //params: { 'link' : null },
              views: {
                  'content': {
                      templateUrl: 'ClientApp/views/invitation/index.html',
                      controller: 'seminarInvitationController'
                  }
              }
          })
        $urlRouterProvider.otherwise('/login');
    });


    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.run(['authService', function (authService, $window) {
        authService.fillAuthData();
    }]);
})();