var app = angular.module('app', ['ui.router']);

app.factory('user', function() {
    var username = '';
    var token = '';
    var owner = false;

    var reset = function() {
        username = '';
        token = '';
        owner = false;
    }

    return {
        username: username,
        token: token,
        owner: owner,
        reset: reset
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
                    user.username = username;
                    user.token = response.data.token;
                    user.owner = true;
                    $state.go('boards');
                }
            });
            $("#username").val("");
            $("#password").val("");

        }
    };
});

app.controller('RegisterCtrl', function($scope, $http) {
    console.log("in register");

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
    console.log("is owner: " + user.owner);
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

app.controller('ItemsCtrl', function($scope, $compile, $http, $state, user, chosenBoard) {
    var editID = "";
    console.log("in list.html");
    $scope.items = [];
    $scope.boardName = chosenBoard.name;

    var url = "/item?board=" + chosenBoard.name;

    $scope.getAll = function() {
        $http.get(url).then(function(response) {
            $scope.items = response.data;
        });
    };

    $scope.getAll();

    $scope.addItem = function() {
        $scope.addItemScreen = true;
        console.log("addItem");
    };

    $scope.clearFields = function() {
        console.log("clear");
        $scope.name = "";
        $scope.imgURL = "";
        $scope.theDescription = "";
        $scope.link = "";
        console.log("addItem");
    };

    $scope.cancelItem = function() {
        $scope.addItemScreen = false;
        $scope.clearFields();
        console.log("cancel");
    };

    $scope.submitItem = function() {
        var title = $("#name").val();
        var url = $("#url").val();
        var description = $("#theDescription").val();
        var link = $("#link").val();
        console.log(title, url, description, link);
        $scope.add(title, url, description, link);
        $scope.getAll();
        $scope.clearFields();
        $scope.addItemScreen = false;
        console.log("submit");
    };

    $scope.get = function() {
        $http.get('item/:' + chosenBoard + query, function(data) {});
    }

    $scope.isOwner = function() {
        return user;
    };

    $scope.add = function(title, url, description, theLink) {
        console.log(chosenBoard.name);
        var myobj = { board: chosenBoard.name, picture: url, title: title, theDescription: description, link: theLink, boolean: true };
        var jobj = JSON.stringify(myobj);
        $("#json").text(jobj);
        var URL = "item";
        $.ajax({
            url: URL,
            type: "POST",
            data: jobj,
            contentType: "application/json; charset=utf-8",
            success: function(data, textStatus) {
                console.log(textStatus);
            }
        });
    };
    

    $scope.submitEdit = function() {
        console.log("HELOO");
        $http.put("item?id=" + editID + "&name=" + $scope.editName + "&pic=" + $scope.editImgURL + "&desc=" + $scope.editTheDescription + "&link=" + $scope.editLink).then(function(response) {
            console.log(response);
        });
        $scope.getAll();
        $scope.editItemScreen = false;
        console.log("Item edit submit");
    };
    
    $scope.cancelEdit = function() {
        $scope.editItemScreen = false;
        console.log("Item edit cancel");
    }
    
    $scope.edit = function(item) {
        editID = item._id;
        console.log(item);
        $scope.editName = item.title;
        $scope.editImgURL = item.picture;
        $scope.editTheDescription = item.theDescription;
        $scope.editLink = item.link;
        $scope.editItemScreen = true;
    }

    $scope.delete = function(item) {
        console.log("Item delete");
        var id = item._id;
        console.log(item);
        $.ajax({
            url: 'item?id=' + id,
            type: 'DELETE',
            success: function(data) {
                console.log("delete successful");
            }
        });
        $scope.getAll();
    };
    console.log(chosenBoard);
});
