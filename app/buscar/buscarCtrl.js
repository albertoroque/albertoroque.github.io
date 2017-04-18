angular.module('proj.buscar', [])

.config(function ($routeProvider) {
    $routeProvider
        .when('/buscar', {
            controller: 'BuscarCtrl',
            templateUrl: 'app/buscar/partials/buscar.tpl.html'
        })

        .when('/buscar/:termourl', {
             controller: 'BuscarCtrl',
             templateUrl: 'app/buscar/partials/buscar.tpl.html'
        })

        .when('/buscaloja', {
            controller: 'BuscarCtrl',
            templateUrl: 'app/buscar/partials/buscar.tpl.html'
        });    
})


.controller('BuscarCtrl', function ($scope, $rootScope, $routeParams, $location, $mdDialog, BuscarService) {
        
    
    $scope.resultadosBusca = [];
    
    //
    // Buscar lojas, produtos e marcas
    //
    $scope.buscarOnEnter = function (termo) {

        BuscarService.obterPesquisar(termo)
        .then(function (data) {
            $scope.resultadosBusca = data.produtos;
            console.log(data);
        })
        .catch(function () { console.error('ERRO PESQUISA'); })

    };


    $scope.buscarOnURL = function () {

        var termo = $routeParams.termourl;

        if ($routeParams.termourl) {
            BuscarService.obterPesquisar(termo)
            .then(function (data) {
                $scope.resultadosBusca = data.produtos;
                console.log(data);
                $scope.termo = termo;
            })
            .catch(function () { console.error('ERRO PESQUISA URL'); })
        } else {
            termo = null;
        }
        
    };

    $scope.limparBusca = function(){
        $scope.resultadosBusca = [];
        $scope.termo = "";
    }

        

});