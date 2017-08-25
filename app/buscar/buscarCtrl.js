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


.controller('BuscarCtrl', function ($scope, $rootScope, $routeParams, $location, $mdDialog, BuscarService, AuthSearch, UserStore) {
    
    // inicio de busca = 1
    // produtos encontrados = 2
    // carregando busca = 3
    // busca n�o retornou produtos = 4
    // erro na pesquisa = 5
    $scope.feedbackBusca = 1;

    $scope.resultadosBusca = [];
        
    // Buscar lojas, produtos e marcas
    //
    $scope.buscarOnEnter = function (termo) {        
        $rootScope.irPara("buscar/" + termo);
    };
 
    // Ao n�o encontrar produtos, assistir mudan�a na localiza��o caso
    //
    $scope.watchLocationChange = function () {
        $rootScope.LOCATION_ON = false;
        $scope.$watch('LOCATION_ON', function (newValue, oldValue) {
            if ($rootScope.LOCATION_ON) {                
                $scope.carregarBusca();
            }
        })
    }

    //
    //
    $scope.carregarBusca = function () {
       
        var geodata = AuthSearch.getGeo();
                
        // verifica se o usu�rio tem dados de localiza��o
        if (geodata == undefined) {
            $scope.msgNotLocation(); 
            $rootScope.LOCATION_ON = false;
            $scope.watchLocationChange();
        } 

        var termo = $routeParams.termourl;        

        if (termo != null) {
            
            $scope.feedbackBusca = 3;

            $scope.termo = termo;
            
            //adicionar mais um termo na busca
            UserStore.setBuscaRecente(termo);

            BuscarService.obterPesquisar(termo, geodata)
            .then(function (data) {

                if (data.totalProdutos > 0) {

                    $scope.resultadosBusca = data;

                    console.log(data);
                    
                    $scope.feedbackBusca = 2;                        

                } else {
                    $scope.feedbackBusca = 4;
                }                                        
            })
            .catch(function (data) {
                $scope.feedbackBusca = 5;
            })

        } else {
            termo = null;                
            $scope.buscasRecentes = UserStore.getBuscaRecente();                
        }
                        
    };

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
    
    // Abre dialogo de configura��o de RAIO de pesquisa
    //
    $scope.configurarPesquisaDialog = function (ev) {

        $scope.buscalojaconfig = AuthSearch.getGeo();

        if ($scope.buscalojaconfig.raiokm == null) {
            $scope.buscalojaconfig.raiokm = 2;
        }
       
        $mdDialog.show({
            controller: 'BuscarCtrl',
            templateUrl: 'app/buscar/partials/buscaConfigDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function () { }, function () { });      
    }

    // Atualiza dados de busca (SOMENTE RAIO)
    //
    $scope.atualizaDadosBuscaLocalizacao = function (geodata) {        

        if (geodata.setor != null) {
            geodata.idSetor = geodata.setor.id;
        }

        AuthSearch.setGeo($scope.buscalojaconfig);
        
        $scope.hideDialog();

        //refresh na busca
        $scope.carregarBusca();
    }

    //
    //
    $scope.limparBusca = function(){
        $scope.resultadosBusca = [];
        $scope.termo = "";
    }

        

});