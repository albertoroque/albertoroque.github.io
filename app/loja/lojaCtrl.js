angular.module('proj.loja', [])

.config(function ($routeProvider) {
    $routeProvider
        .when('/loja', {
            controller: 'LojaCtrl',
            templateUrl: 'app/loja/partials/loja.tpl.html'
        })
        .when('/buscarlojas', {
            controller: 'BuscarLojasCtrl',
            templateUrl: 'app/loja/partials/buscarlojas.tpl.html'
        })
        .when('/produto', {
            controller: 'LojaCtrl',
            templateUrl: 'app/loja/partials/produto.tpl.html'
        });    
})


.controller('LojaCtrl', function ($scope, $rootScope, $location, $mdDialog, LojaService) {
           

})



.controller('BuscarLojasCtrl', function ($scope, $rootScope, $location, $mdDialog, LojaService) {
    
    $scope.lojas = {};

    $scope.repeatTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    $scope.lojas.products = [];


    //
    //
    //
    $scope.carregarLojas = function () {

        LojaService.obterProdutosLoja()
        .then(function (data) {
            
            for (var i = 0; i < $scope.repeatTest.length; i++) {
                $scope.repeatTest[i] = {};
                $scope.repeatTest[i].produtosPreview = data.produtos;
            }           
        })
        .catch(function () {

        })
    }


});