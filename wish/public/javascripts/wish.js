var app = angular.module('app', ['ui.router']);

app.factory('user', function() {
    var getUsername = function() {
        var username = sessionStorage.getItem('username');
        if (!username) {
            username = "";
        }
        return username;

    }
    var getToken = function() {
        var token = sessionStorage.getItem('token');
        if (!token) {
            token = ""
        }
        return token;
    }
    var getOwner = function() {
        var owner = sessionStorage.getItem('owner');
        if (owner) {
            if (owner = 'true') {
                return true;
            }
        }
        return false;
    }

    var setUsername = function(username) {
        sessionStorage.setItem('username', username.toString());
    }
    var setToken = function(token) {
        sessionStorage.setItem('token', token.toString());
    }
    var setOwner = function(owner) {
        sessionStorage.setItem('owner', owner.toString());
    }

    var reset = function() {
        sessionStorage.setItem('username', "");
        sessionStorage.setItem('token', "");
        sessionStorage.setItem('owner', "false");
    }

    return {
        getUsername: getUsername,
        getToken: getToken,
        getOwner: getOwner,
        setUsername: setUsername,
        setToken: setToken,
        setOwner: setOwner,
        reset: reset
    }
});

app.factory('chosenBoard', function() {
    var getName = function() {
        var name = sessionStorage.getItem('chosenBoard');
        if (!name) {
            name = "";
        }
        return name;
    }

    var setName = function(name) {
        sessionStorage.setItem('chosenBoard', name);
    }


    return {
        getName: getName,
        setName: setName
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
    user.reset();

    $scope.login = function() {
        var username = $("#username").val();
        var password = $("#password").val();
        if (username && password) {
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
                    user.setUsername(username);
                    user.setToken(response.data.token);
                    user.setOwner(true);
                    $state.go('boards');
                }
            });
            $("#username").val("");
            $("#password").val("");

        }
    };
});

app.controller('RegisterCtrl', function($scope, $http, user) {
    console.log("in register");
    user.reset();

    $scope.register = function() {
        var username = $("#username").val();
        var password = $("#password").val();

        if (username && password) {
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
                    user.setUsername(username);
                    user.setToken(response.data.token);
                    user.setOwner(true);
                }
            });
            $("#username").val("");
            $("#password").val("");
        }
    }

});

app.controller('SearchCtrl', function($scope, $http, $state, user) {
    console.log("in Search");
    user.reset();

    $scope.searchBoards = []
    $scope.hasPassword = false;
    $scope.selectedBoard;

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

    $scope.goToBoard = function() {
        console.log("goToBoard");
        console.log($scope.selectedBoard);
        if ($scope.selectedBoard) {
            if ($scope.hasPassword) {
                if ($scope.password != $scope.selectedBoard.password) {
                    $scope.password = "";
                }
                else {
                    user.setUsername($scope.selectedBoard.owner);
                    user.setOwner(false);
                    $state.go("items");
                }
            }
            else {
                user.setUsername($scope.selectedBoard.owner);
                user.setOwner(false);
                $state.go("items");
            }
        }
    }
});

app.controller('BoardsCtrl', function($scope, $http, $state, user, chosenBoard) {
    console.log("in home.html");
    console.log("user: " + user.getUsername() + " token: " + user.getToken());
    console.log("is owner: " + user.getOwner());

    $scope.boards = [];
    $scope.isOwner = user.getOwner();

    var url = "/board?owner=" + user.getUsername();

    $http.get(url).then(function(response) {
        $scope.boards = response.data;
        console.log($scope.boards);
    });

    $scope.goToBoard = function(board) {
        console.log(board);
        console.log("go to board");
        chosenBoard.setName(board.boardName);
        $state.go('items')
    }

    $scope.edit = function(board) {
        console.log("edit");
    }

    $scope.delete = function(board) {
        console.log("delete");
    }

    $scope.addBoard = function() {
        $scope.addItemScreen = true;
        console.log("add board");
    }

});

app.controller('ItemsCtrl', function($scope, $http, $state, user, chosenBoard) {
    console.log("in list.html");

    $scope.addItem = function() {
        $scope.addItemScreen = true;
        console.log("addItem");
    }

    $scope.clearFields = function() {
        console.log("clear");
        $scope.name = null;
        $scope.imgURL = null;
        $scope.theDescription = null;
        $scope.link = null;
        console.log("addItem");
    }

    $scope.submitItem = function() {
        var title = $("#name").val();
        var url = $("#url").val();
        $scope.add(title, url);
        //$scope.get();
        $scope.clearFields();
        $scope.addItemScreen = false;
        console.log("submit");
    }

    $scope.cancelItem = function() {
        $scope.addItemScreen = false;
        $scope.clearFields();
        console.log("cancel");
    }

    $scope.get = function() {
        // $.getJSON('comment/all', function(data) {
        //     console.log(data);
        //     var everything = "<ul>";
        //     for (var comment in data) {
        //         var com = data[comment];
        //         everything += "<li> Name: " + com.Name + " -- Comment: " + com.Comment + "</li>";
        //     }
        //     everything += "</ul>";
        //     $("#comments").html(everything);
        // });
    }

    $scope.isOwner = function() {
        return user.getOwner();
    }

    $scope.add = function(title, url, description, link) {
        var myobj = { chosenBoard, picture: url, title: title, description: description, link: link, boolean: true };
        var jobj = JSON.stringify(myobj);
        $("#json").text(jobj);
        var url = "item";
        $.ajax({
            url: url,
            type: "POST",
            data: jobj,
            contentType: "application/json; charset=utf-8",
            success: function(data, textStatus) {
                console.log(textStatus);
            }
        });
    }

    $scope.edit = function(item) {
        console.log("Item edit");
    }

    $scope.delete = function(item) {
        console.log(" Item delete");

    }
    console.log(chosenBoard);
});
