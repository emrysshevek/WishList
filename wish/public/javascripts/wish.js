var app = angular.module('app', ['ui.router']);

app.factory('user', function() {
    var username = '';
    var token = '';

    return {
        username: username,
        token: token
    }
});

app.factory('chosenBoard', function() {
    var boardName = '';

    return {
        name: boardName,
    }
})

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

            }).state('boards', {
                url: '/boards',
                templateUrl: '/boards.html',
                controller: 'BoardsCtrl'
            }).state('items', {
                url: '/items',
                templateUrl: '/items.html',
                controller: 'ItemsCtrl'
            });

        $urlRouterProvider.otherwise('login');
    }
]);

app.controller('LoginCtrl', function($scope, $http, $window, $location, $state, user) {
    console.log("in Login");

    $scope.login = function() {
        var username = $("#username").val();
        var password = $("#password").val();
        var request = { username: username, password: password };
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
                user.username = username;
                user.token = response.data.token;
                $state.go('boards');
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

    $scope.searchBoards = []

    $scope.search = function() {
        var owner = $("#username").val();
        var boardName = $("#boardName").val();
        if (owner || boardName) {
            var url = "/board?owner=" + owner + "&board=" + boardName;
            console.log(url);
            $http({
                method: "GET",
                url: url,
            }).then(function(response) {
                console.log(response);
                $scope.searchBoards = response.data;
            });
        }
    }
});

app.controller('BoardsCtrl', function($scope, $http, $state, user, chosenBoard) {
    console.log("in home.html");
    console.log("user: " + user.username + " token: " + user.token);
    $scope.boards = [];

    var url = "/board?owner=" + user.username;

    $http.get(url).then(function(response) {
        $scope.boards = response.data;
        console.log($scope.boards);
    });

    $scope.goToBoard = function(board) {
        console.log(board);
        console.log("go to board");
        chosenBoard.name = board.boardName;
        $state.go('items')
    }

    $scope.edit = function(board) {
        console.log("edit");
    }

    $scope.delete = function(board) {
        console.log("delete");
    }

});

app.controller('ItemsCtrl', function($scope, $http, $state, user, chosenBoard) {
    console.log("in list.html");
    
    $scope.edit = function(board) {
        console.log("Item edit");
    }
    
    $scope.delete = function(board) {
        console.log(" Item delete");
        
    }
    console.log(chosenBoard);
});
