
angular.module('proj.erro', ['ngRoute'])

.config(function($routeProvider) {

    $routeProvider       
        .when('/erro/404', {
            controller: 'ErroCtrl',
            templateUrl: 'app/erro/partials/erro.tpl.html'
        });

    
})


.controller('ErroCtrl', function ($scope, $location) {        
  
})