//The controller is having 'crudService' dependency.
//This controller makes call to methods from the service 
app.controller('masterUserCtrl', function ($scope, $http, $templateCache) {
    //initialize();

    //function initialize() {
    //    $scope.LoginName = "test";
    //    $scope.Password = "test";
    //    $scope.RoleID = 0;
    //    $scope.TypeID = 0;
    //}

    $scope.fetch = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:56488/api/Account/Get',
            cache: $templateCache
        })
            .then(function (response) {
                $scope.data = response.data;

            }, function (response) {
                $scope.data = response.data || 'Request failed';
                $scope.status = response.status;
            });
    };

    //Function to Submit the form
    $scope.submitForm = function (formData) {
        //var user = {};
        //user.LoginName = $scope.LoginName;
        //user.Password = $scope.Password;
        //user.RoleID = $scope.RoleID;
        //user.TypeID = $scope.TypeID;

        //var masterUser = masterUserService.addUser(LoginName);
        //masterUser.then(function (d) {
        //    $scope.LoginName = d.data.LoginName;
        //    $scope.Password = d.data.Password;
        //    $scope.roleId = d.data.roleId;
        //}, function (err) {
        //    alert("Some Error Occured ");
        //});

        var res = $http.post('http://localhost:56488/api/Account/Submit', formData);
        res.success(function (data, status, headers, config) {
            $scope.message = data;
        });
        res.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({ data: data }));
        });

    };
    $scope.update = function (LoginName) {
        var user = {};
        user.LoginName = $scope.LoginName;
        user.Password = $scope.Password;
        user.RoleID = $scope.RoleID;
        user.TypeID = $scope.TypeID;

        var result = $http.post('http://localhost:56488/api/Account/PutUser', LoginName)
            .then(function (data, status, headers, config) {
                $scope.message = data;
            })
            .then(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({ data: data }));
            });

    }
    //Function to Cancel Form
    //$scope.cancelForm = function () {
    //    initialize();
    //};
});
