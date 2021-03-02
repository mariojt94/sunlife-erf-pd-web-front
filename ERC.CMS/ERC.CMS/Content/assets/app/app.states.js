var sunlife = angular.module('sunlife',
                            ['ui.router',
                             'ngHamburger',
                             'ui.swiper',
                             'ui.bootstrap',
                             'ui.utils'
                            ]);
sunlife.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('login', {
      url: '/',
      title: 'Login',
      views: {
        'header': {
          templateUrl: 'pages/header-login.html'
        },
        'content': {
          templateUrl: 'pages/content-login.html'
        },
        'footer': {
          templateUrl: 'pages/footer-login.html'
        }
      }
    })
    .state('create-account', {
      url: '/create-account',
      // controller: 'menuCtrl',
      views: {
        // 'header': {
        //   templateUrl: 'pages/navbar.html'
        // },
        'content': {
          templateUrl: 'pages/content-create-account.html'
        }
      }
    })
    .state('forgot-account', {
      url: '/forgot-account',
      // controller: 'menuCtrl',
      views: {
        // 'header': {
        //   templateUrl: 'pages/navbar.html'
        // },
        'content': {
          templateUrl: 'pages/content-create-forgot.html'
        }
      }
    })
    .state('dashboard', {
      url: '/dashboard',
      controller: 'menuCtrl',
      views: {
        'header': {
          templateUrl: 'pages/navbar.html'
        },
        'content': {
          templateUrl: 'pages/content-dashboard.html',
          controller: 'slidedashboardCtrl'
        }
      }
    })
    .state('dashboard-lead', {
      url: '/dashboard-lead',
      views: {
        'header': {
          templateUrl: 'pages/navbar.html'
        },
        'content': {
      url: '/dashboard-lead',
          templateUrl: 'pages/content-dashboard-lead.html',
           controller: 'leadCtrl'
        }
      }
    })
    .state('dashboard-rec', {
      url: '/dashboard-rec',
      views: {
        'header': {
          templateUrl: 'pages/navbar.html'
        },
        'content': {
          templateUrl: 'pages/content-dashboard-rec.html',
           controller: 'dashCtrl'
        }
      }
    })
    .state('aplikasi', {
      url: '/aplikasi',
      controller: 'menuCtrl',
      views: {
        'header': {
          templateUrl: 'pages/navbar-other.html'
        },
        'content': {
          templateUrl: 'pages/content-aplikasi.html',
          controller: 'slidedashboardCtrl'
        }
      }
    })
    .state('profil', {
      url: '/profil',
      views: {
        'header': {
          templateUrl: 'pages/navbar-other.html'
        },
        'content': {
          templateUrl: 'pages/content-profil.html'
        }
      }
    })
    .state('ubah-profil', {
      url: '/ubah-profil',
      views: {
        'header': {
          templateUrl: 'pages/navbar-other.html'
        },
        'content': {
          templateUrl: 'pages/content-profil-ubah.html'
        }
      }
    })
    .state('pengaturan', {
      url: '/pengaturan',
      views: {
        'header': {
          templateUrl: 'pages/navbar-other.html'
        },
        'content': {
          templateUrl: 'pages/content-setting.html'
        }
      }
    })
    .state('tentang-kami', {
      url: '/tentang-kami',
      views: {
        'header': {
          templateUrl: 'pages/navbar-other.html'
        },
        'content': {
          templateUrl: 'pages/content-tentang-kami.html'
        }
      }
    })
    .state('data-pribadi', {
      url: '/data-pribadi',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-pribadi.html'
        }
      }
    })
    .state('data-kontak', {
      url: '/data-kontak',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-kontak.html'
        }
      }
    })
    .state('data-keluarga', {
      url: '/data-keluarga',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-keluarga.html'
        }
      }
    })
    .state('data-pendidikan', {
      url: '/data-pendidikan',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-pendidikan.html'
        }
      }
    })
    .state('data-pekerjaan', {
      url: '/data-pekerjaan',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-pekerjaan.html'
        }
      }
    })
    .state('data-dokumen', {
      url: '/data-dokumen',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-dokumen.html'
        }
      }
    })
    .state('data-psikotes', {
      url: '/data-psikotes',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-psikotes.html'
        }
      }
    })
    .state('data-psikotes-start', {
      url: '/data-psikotes-start',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-psikotes-start.html'
        }
      }
    })
    .state('data-psikotes-finish', {
      url: '/data-psikotes-finish',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-psikotes-finish.html'
        }
      }
    })
    .state('data-review', {
      url: '/data-review',
      views: {
        'header': {
          templateUrl: 'pages/navbar-gabung.html'
        },
        'content': {
          templateUrl: 'pages/content-data-review.html'
        }
      }
    })
    .state('detail-candidates', {
      url: '/detail-candidates',
      views: {
        'header': {
          templateUrl: 'pages/navbar.html'
        },
        'content': {
          templateUrl: 'pages/content-data-candidates.html'
        }
      }
    })
    .state('detail-lead', {
      url: '/detail-lead',
      views: {
        'header': {
          templateUrl: 'pages/navbar.html'
        },
        'content': {
          templateUrl: 'pages/content-data-lead.html'
        }
      }
    })
});
