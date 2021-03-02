(function () {
    'use strict';
    var app = angular.module('SunLifeApp', ['ui.router', 'ngAnimate', 'ngSanitize']);

    //app.constant('ngAuthSettings', {
    //    clientId: 'ngAuthApp'
    //});

    //app.run(function ($rootScope, authService, $state, $http, $q) {

    //});

    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    'header': {
                        templateUrl: 'ClientApp/views/dashboard/header.html'
                    },
                    'content': {
                        templateUrl: 'ClientApp/views/dashboard/index.html',
                        controller: ''
                    },
                    'footer': {
                        templateUrl: 'ClientApp/views/dashboard/footer.html'
                    }
                }
            })
          .state('apakatamereka', {
              url: '/apakatamereka',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/apakatamereka/header.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/apakatamereka/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/apakatamereka/footer.html'
                  }
              }
          })
          .state('iburumahtangga', {
              url: '/apakatamereka/1',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/apakatamereka/sub-header.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/apakatamereka/iburumahtangga/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/apakatamereka/footer.html'
                  }
              }
          })
          .state('pengusaha', {
              url: '/apakatamereka/2',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/apakatamereka/sub-header.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/apakatamereka/pengusaha/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/apakatamereka/footer.html'
                  }
              }
          })
          .state('karyakaryi', {
              url: '/apakatamereka/3',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/apakatamereka/sub-header.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/apakatamereka/karyawan/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/apakatamereka/footer.html'
                  }
              }
          })
          .state('brightergen', {
              url: '/apakatamereka/4',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/apakatamereka/sub-header.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/apakatamereka/karyawan/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/apakatamereka/footer.html'
                  }
              }
          })
          .state('pensiunan', {
              url: '/apakatamereka/5',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/apakatamereka/sub-header.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/apakatamereka/pensiunan/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/apakatamereka/footer.html'
                  }
              }
          })
          .state('konsepbisnis', {
              url: '/konsepbisnis',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                      templateUrl: 'ClientApp/views/konsepbisnis/header.html'
                  },
                  'content': {
                      templateUrl: "ClientApp/views/konsepbisnis/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/konsepbisnis/footer.html'
                  }
              }
          }).state('peluangbisnis', {
              url: '/konsepbisnis/1',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/konsepbisnis/peluangbisnis/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/konsepbisnis/footer.html'
                  }
              }
          }).state('modalusaha', {
              url: '/konsepbisnis/2',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/konsepbisnis/modalusaha/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/konsepbisnis/footer.html'
                  }
              }
          }).state('carakerja', {
              url: '/konsepbisnis/3',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/konsepbisnis/carakerja/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/konsepbisnis/footer.html'
                  }
              }
          }).state('targetmarket', {
              url: '/konsepbisnis/4',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/konsepbisnis/targetmarket/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/konsepbisnis/footer.html'
                  }
              }
          }).state('kompensasibenefit', {
              url: '/kompensasidanbenefit',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/kompensasibenefit/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/kompensasibenefit/footer.html'
                  }
              }
          }).state('karirbisnis', {
              url: '/kompensasidanbenefit/1',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/kompensasibenefit/karirbisnis/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/kompensasibenefit/footer.html'
                  }
              }
          }).state('kompensasi', {
              url: '/kompensasidanbenefit/2',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/kompensasibenefit/kompensasi/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/kompensasibenefit/footer.html'
                  }
              }
          }).state('benefit', {
              url: '/kompensasidanbenefit/3',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/kompensasibenefit/benefit/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/kompensasibenefit/footer.html'
                  }
              }
          }).state('sun-exellence', {
              url: '/kompensasidanbenefit/3/1',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/kompensasibenefit/benefit/sun-exellence.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/kompensasibenefit/footer.html'
                  }
              }
          }).state('rookie-experience', {
              url: '/kompensasidanbenefit/3/2',
              //controller: 'menuCtrl',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/kompensasibenefit/benefit/rookie-experience.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/kompensasibenefit/footer.html'
                  }
              }
          }).state('mdrt', {
              url: '/kompensasidanbenefit/3/3',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/kompensasibenefit/benefit/mdrt.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/kompensasibenefit/footer.html'
                  }
              }
          }).state('tentang', {
              url: '/tentang',
              views: {
                  'header': {
                  },
                  'content': {
                      templateUrl: "ClientApp/views/tentang/index.html",
                      //controller: 'aajiController'
                  },
                  'footer': {
                      templateUrl: 'ClientApp/views/tentang/footer.html'
                  }
              }
          }) 
        
        $urlRouterProvider.otherwise('/home');
    });

    //app.config(function ($httpProvider) {
    //    $httpProvider.interceptors.push('authInterceptorService');
    //});

    //app.run(['authService', function (authService, $window) {
    //    authService.fillAuthData();
    //}]);
})();