var app = angular.module('app', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'LoginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'RegisterCtrl'
            }).state('search', {
                url: '/search',
                templateUrl: '/search.html',
                controller: 'SearchCtrl'
            });

        $urlRouterProvider.otherwise('login');
    }
]);

app.controller('LoginCtrl', function($scope, $http) {
    console.log("in Login");

    $scope.login = function() {
        var request = { username: $("#username").val(), password: $("#password").val() };
        console.log(request);
        var url = "/login";
        $http({
            method: "POST",
            url: url,
            data: request
        }).then(function(response) {
            var success = response.data.success;
            console.log(success);
            if (!success) {
                $("#username").addClass("is-invalid").removeClass("is-valid");
                $("#password").addClass("is-invalid").removeClass("is-valid");
            }
            else {
                console.log(response.data.token);
            }
        });
        $("#username").val("");
        $("#password").val("");
    }

});

app.controller('RegisterCtrl', function($scope, $http) {
    console.log("in register");

    $scope.register = function() {
        var username = $("#username").val();
        var password = $("#password").val();
        if (username || password) {

            var request = { username: $("#username").val(), password: $("#password").val() };
            console.log(request);
            var url = "/register";
            $http({
                method: "POST",
                url: url,
                data: request
            }).then(function(response) {
                var success = response.data.success;
                console.log(success);
                if (!success) {
                    $("#username").addClass("is-invalid").removeClass("is-valid");
                    $("#password").addClass("is-invalid").removeClass("is-valid");
                }
                else {
                    console.log(response.data.token);
                }
            });
            $("#username").val("");
            $("#password").val("");
        }
    }

});

app.controller('SearchCtrl', function($scope, $http) {
    console.log("in Search");

    $scope.search = function() {
        var request = { username: $("#username").val(), password: $("#password").val() };
        console.log(request);
        var url = "/login";
        $http({
            method: "POST",
            url: url,
            data: request
        }).then(function(response) {
            var success = response.data.success;
            console.log(success);
            if (!success) {
                $("#username").addClass("is-invalid").removeClass("is-valid");
                $("#password").addClass("is-invalid").removeClass("is-valid");
            }
            else {
                console.log(response.data.token);
            }
        });
        $("#username").val("");
        $("#password").val("");
    }

});
