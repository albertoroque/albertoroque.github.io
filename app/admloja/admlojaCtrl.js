angular.module('proj.admloja', [])

.config(function ($routeProvider) {
    $routeProvider
        .when('/loja/entrar', {
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/entrar.tpl.html'
        })

        .when('/loja/:idloja/inicio', {
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/inicio.tpl.html'
        })


        .when('/loja/:idloja/categoria', {
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/categoria.tpl.html'
        })
})


.controller('AdmLojaCtrl', function ($scope, $rootScope, $location, $mdDialog, LojaService) {
           

    //-------------------------------------------------------------
    // DADOS LOJA
    //-------------------------------------------------------------

    $scope.escolherSetorDialog = function (ev, idloja) {

        $scope.setoresDisponiveis = ['Skateshop', 'Artigos Eletronics', 'Sapatilhas', 'Fotografia e Design', 'Surfshop', 'Moda Casual', 'Artigos Esportivos', 'Perfumaria'];

        $mdDialog.show({
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/escolherSetorDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function () { }, function () { });
    };

    $scope.escolherSetor = function(setor){
        $scope.setorEscolhido = setor;
    }

    $scope.hideDialog = function(){
        $mdDialog.hide();
    }



    //-------------------------------------------------------------
    // CATEGORIA
    //-------------------------------------------------------------

    $scope.opcoesCategoriaDialog = function (ev, idcategoria) {

        $scope.categoria = 'Camisas Importadas';

        $mdDialog.show({
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/opcoesCategoriaDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function () {}, function () {});
    };

})

