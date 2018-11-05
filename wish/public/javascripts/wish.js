var app = angular.module('app', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: '/main.html',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise('main');
    }
]);

app.controller('MainCtrl', function($scope, $http) {
    console.log("in Main");

    $scope.login = function() {
        var url = "/login";
        $http.get(url).then(function(response) {

        });
        console.log("logged in");
    }

});
