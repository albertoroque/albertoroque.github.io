angular.module('proj.shoppings', [])

.config(function ($routeProvider, ngMetaProvider) {
    $routeProvider
        .when('/shoppings', {
            controller: 'ShoppingsCtrl',
            templateUrl: 'app/shoppings/partials/shoppings.tpl.html',
        })

        .when('/shoppings/:idlocal', {
            controller: 'ShoppingsCtrl',
            templateUrl: 'app/shoppings/partials/local.tpl.html',
        })
})


.controller('ShoppingsCtrl', function ($scope, $rootScope, $routeParams, $location, $mdDialog, $mdMedia, AuthSearch, ShoppingsService) {
    
    // Faz a verificação de troca de cidade dentro do 
    //
    $scope.watchLocationChange = function () {

        $rootScope.LOCATION_ON = false;

        $scope.$watch('LOCATION_ON', function (newValue, oldValue) {
            if ($rootScope.LOCATION_ON) {
                $scope.carregaShopping();
            }
        })
    }

    //
    //
    $scope.carregaShopping = function () {

        $scope.cidade = "";
        $scope.$mdMedia = $mdMedia;

        var geodata = AuthSearch.getGeo();

        // verifica se o usuário tem dados de localizacao
        if (geodata == undefined) {
            $scope.cidade = "São Paulo";
        } else {            
            $scope.cidade = geodata.cidade;            
        }

        $scope.carregaShoppingsCidade($scope.cidade);
    }

    //
    //
    $scope.carregaShoppingsCidade = function (cidade) {
       
        $scope.shoppingPage = {};

        $scope.shoppingPage.carregando = true;
        $scope.shoppingPage.erro = false;

        ShoppingsService.obterLocaisPorCidade(cidade)
        .then( function(dados){            
            $scope.cidadeDados = dados;
            $scope.shoppingPage.carregando = false;

            $scope.shoppingPage.wallpaper = $rootScope.resolveCidadeWallpaper(cidade);
        })
        .catch( function(erro){            
            $scope.shoppingPage.erro = true;
            $scope.shoppingPage.erroMsg = erro;
            $scope.shoppingPage.carregando = false;
        })
       
    }

    // 
    //
    $scope.msgNotLocation = function () {

        $mdDialog.show({
            controller: 'BuscarCtrl',
            templateUrl: 'app/buscar/partials/buscaNotLocationDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            clickOutsideToClose: false
        })
        .then(function () { }, function () { });
    }

    
    //----------------------
    // LOCAL (pesquisando lojas em um shopping|local)
    //----------------------
           

    //
    //
    $scope.carregaLocal = function () {

        var idlocal = $routeParams.idlocal;  

        $scope.localCarregando = true;
        $scope.localErro = false;

        ShoppingsService.obterLocalPorId(idlocal)
        .then( function(dados){            
            $scope.local = dados;
            $scope.localCarregando = false; 
            console.log(dados);           
        })
        .catch( function(erro){            
            $scope.localErro = true;
            $scope.localErroMsg = erro || "Opa, algo de errado aconteceu!";
            $scope.localCarregando = false;
           
        })        
    }


});