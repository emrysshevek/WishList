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
            if (owner === 'true') {
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

app.controller('RegisterCtrl', function($scope, $http, $state, user) {
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
                    $state.go("boards");
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
    // $scope.hasPassword = false;
    $scope.password = "";
    $scope.selectedBoard;

    $scope.search = function() {
        var owner = $("#username").val();
        var boardName = $("#boardName").val();
        if (owner || boardName) {
            var url = "/board?owner=" + owner + "&board=" + boardName;
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
            if ($scope.selectedBoard.settings.hasPassword) {
                if ($("#password").val() !== $scope.selectedBoard.password) {
                    $("#password").val("");
                }
                else {
                    user.setUsername($scope.selectedBoard.owner);
                    user.setOwner(false);
                    $("#password").val("");
                    $state.go("items");
                }
            }
            else {
                user.setUsername($scope.selectedBoard.owner);
                user.setOwner(false);
                $("#password").val("");
                $state.go("items");
            }
        }
    }
});

app.controller('BoardsCtrl', function($scope, $http, $state, user, chosenBoard) {
    var editID = "";
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
        editID = board._id;
        console.log(board);
        $scope.editName = board.boardName;
        $scope.editRequirePassword = board.settings.hasPassword;
        $scope.editPassword = board.password;
        $scope.editBoardScreen = true;
    }

    $scope.delete = function(board) {
        console.log("delete");
    }

    $scope.addBoard = function() {
        $scope.addBoardScreen = true;
        console.log("add board");
    }

    $scope.isOwner = function() {
        return user.getOwner();
    };

    $scope.cancelItem = function() {
        $scope.addBoardScreen = false;
        $scope.clearFields();
        console.log("cancel");
    };

    $scope.clearFields = function() {
        console.log("clear");
        $scope.name = "";
        $scope.password = "";
        $scope.requirePassword = false;
        console.log("addItem");
    };

    $scope.submitBoard = function() {
        var boardName = $("#name").val();
        var hasPassword = $scope.requirePassword;
        var password = $scope.password;
        if (boardName && (!hasPassword || (hasPassword && password))) {
            console.log(boardName, hasPassword, password);
            $scope.add(boardName, hasPassword, password);
            // $scope.getAll();
            $scope.clearFields();
            $scope.addBoardScreen = false;
            console.log("submit");
        }
    };

    $scope.add = function(name, hasPassword, password) {
        console.log(name);
        var myobj = { owner: user.getUsername(), boardName: name, password: password, settings: { hasPassword: hasPassword, hide: false }, items: [] };
        var jobj = JSON.stringify(myobj);
        $("#json").text(jobj);
        var URL = "/board";
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

});

app.controller('ItemsCtrl', function($scope, $compile, $http, $state, user, chosenBoard) {
    var editID = "";
    console.log("in list.html");
    console.log("is owner: " + user.getOwner());

    $scope.items = [];
    $scope.allItems = [];
    $scope.boardName = chosenBoard.getName();

    var url = "/item?board=" + chosenBoard.getName();

    $scope.getAll = function() {
        $http.get(url).then(function(response) {
            $scope.items = response.data;
            $scope.allItems = $scope.items;
            console.log(response.data);
        });
    };

    $scope.getAll();

    $scope.addItem = function() {
        $scope.addItemScreen = true;
        console.log("addItem");
    };

    $("#filter").keyup(function() {
        $scope.items = $scope.allItems;
        if ($scope.filter == "") {
            $scope.$apply();
            return;
        }
        var oldItems = [];
        var search = $scope.filter;
        var regex = search;
        for (var item in $scope.items) {
            console.log($scope.items[item].title);
            var res = $scope.items[item].title.toLowerCase().match(new RegExp(regex, 'gi'));
            console.log(res);
            console.log(regex);
            if (res != null) {
                oldItems.push($scope.items[item]);
            }
        }
        $scope.items = oldItems;
        $scope.$apply();
        console.log($scope.items);
    });

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
        $http.get('item/:' + chosenBoard.getName() + query, function(data) {});
    }

    $scope.isOwner = function() {
        console.log("isOwner() output: " + user.getOwner());
        return user.getOwner();
    };

    $scope.notOwner = function() {
        return !$scope.isOwner();
    };

    $scope.add = function(title, url, description, theLink) {
        console.log(chosenBoard.getName());
        var myobj = { board: chosenBoard.getName(), picture: url, title: title, theDescription: description, link: theLink, boolean: true };
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
        var url = "item?id=" + editID + "&name=" + $scope.editName + "&pic=" + $scope.editImgURL + "&desc=" + $scope.editTheDescription + "&link=" + $scope.editLink;
        $http.put(url).then(function(response) {
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
