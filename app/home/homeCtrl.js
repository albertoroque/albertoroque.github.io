angular.module('proj.home', [])

.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            controller: 'HomeCtrl',
            templateUrl: 'app/home/partials/home.tpl.html'
        });
})


.controller('HomeCtrl', function ($scope, $rootScope, $location, $mdDialog, HomeService) {
           

});