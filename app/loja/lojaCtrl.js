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
            controller: 'ProdutoCtrl',
            templateUrl: 'app/loja/partials/produto.tpl.html'
        });    
})


.controller('LojaCtrl', function ($scope, $rootScope, $location, $mdDialog, LojaService, ngMeta) {
           
    $scope.carregarLoja = function () {
        ngMeta.setTitle('Christ Boardshop', ' | Catáloko');
        ngMeta.setTag('og:image', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTHeCK18EjU8dQnKzYMt14-j2gfUYMA_oib8IJy3IMfu0GzPcy');
    }    
    
})



.controller('ProdutoCtrl', function ($scope, $rootScope, $location) {
    $scope.produto = {};
    $scope.produto.imagePresentation = "http://static.classictennis.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/d/c/dc-shoes-landau-s-303010-bgm-00.jpg";    
    $scope.mudarImagemPresentation = function (event) {
        console.log(event);
        console.log(event.target.style.backgroundImage.replace(/(url\(|\)|")/g, ''));
        $scope.produto.imagePresentation = event.target.style.backgroundImage.replace(/(url\(|\)|")/g, '');
    }

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