sunlife.controller('globalCtrl', function ($scope) {
 $scope.layout = 'konvensional';
  $scope.layouts = [
    { name: 'Konvensional', url: 'konvensional' },
    { name: 'PD', url: 'pd' },
    { name: 'Syariah', url: 'syariah' }
  ];
});

sunlife.controller('menuCtrl', function ($scope) {
  $scope.tgState = false;
});

sunlife.controller('slidedashboardCtrl', function ($scope) {
  $scope.slides = [];
});

sunlife.controller('tab-elearningCtrl', function ($scope,$window) {
  $scope.model = {
    name: 'Tabs'
  };
  $scope.kontak = [
	  {
	  	photo			: "ben.png",
	  	nama 			: "Ben Afleck",
	  	tgllahir	: "24 Januari 1993",
	  	pekerjaan : "Karyawan Swasta",
	  },
	  {
	  	photo			: "diana.png",
	  	nama 			: "Diana Prince",
	  	tgllahir	: "14 Desember 1992",
	  	pekerjaan : "Karyawan Swasta",
	  },
	  {
	  	photo			: "scarlet.png",
	  	nama 			: "Scarlet Johanson",
	  	tgllahir	: "4 Februari 1989",
	  	pekerjaan : "Ibu Rumah Tangga",
	  },
	  {
	  	photo			: "gustin.png",
	  	nama 			: "Grant Gustin",
	  	tgllahir	: "10 Oktober 1985",
	  	pekerjaan : "Supir Pribadi",
	  },
	  {
	  	photo			: "gustin.png",
	  	nama 			: "Grant Gustin",
	  	tgllahir	: "10 Oktober 1985",
	  	pekerjaan : "Supir Pribadi",
	  },
  ]
});

sunlife.controller('slideIntroductionCtrl', function ($scope) {
  $scope.slides = [];
});
// Video






// dataTable di Recruiter
sunlife.controller('dashCtrl',function($scope){
  $scope.data=[
        [
            "2 April 2019",
            "-",
            "BA0001",
            "Denis Agusta",
            "+6281234567890",
            "JobsDB",
            "-",
            "New"
        ]
    ]
$scope.dataTableOpt = {
  "aLengthMenu": [[5, 10, 15,-1], [5, 10, 15,'All']],
  };
});



sunlife.controller('leadCtrl',function($scope){
  $scope.data=[
        [
            "2 April 2019",
            "BA0001",
            "Denis Agusta",
            "+6281234567890",
            "JobsDB",
            "-",
            "New"
        ]
    ]
$scope.dataTableOpt = {
  "aLengthMenu": [[5, 10, 15,-1], [5, 10, 15,'All']],
  };
});
