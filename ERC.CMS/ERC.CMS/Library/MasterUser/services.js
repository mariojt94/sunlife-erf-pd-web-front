
app.service('masterUserService', function ($http) {

    this.getUser = function(LoginName) {
        var res = $http.get('/api/Account/' + LoginName);
        return res;
    };
    this.getUsers = function() {
        var res = $http.get('/api/Account');
        return res;
    }

    this.getUser = function (LoginName) {
        var res = $http.post('/api/Account', LoginName);
        return res;
    };

    this.addUser = function(LoginName) {
        var res = $http.post({
            url: "/api/Account/Submit",
            params: {
                LoginName: JSON.stringify(LoginName)
            }
        });
        return res;
    }
});
 