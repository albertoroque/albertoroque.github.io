/// <reference path="partials/buscaLojaConfigDialog.tpl.html" />
angular.module('proj.loja', [])

.config(function ($routeProvider) {
    $routeProvider
        .when('/l/:conta', {
            controller: 'LojaCtrl',
            templateUrl: 'app/loja/partials/loja.tpl.html'
        })
        .when('/buscarlojas', {
            controller: 'BuscarLojasCtrl',
            templateUrl: 'app/loja/partials/buscarlojas.tpl.html'
        })
        .when('/produto/:idproduto', {
            controller: 'ProdutoCtrl',
            templateUrl: 'app/loja/partials/produto.tpl.html'
        });    
})


.controller('LojaCtrl', function ($scope, $rootScope, $routeParams, $location, $mdDialog, $mdMedia, $anchorScroll, LojaService, ngMeta, UserStore, anchorSmoothScroll) {
          
    
    $scope.$mdMedia = $mdMedia;

    // Carrega loja inicialmente
    //
    $scope.carregarLoja = function () {

        $scope.dadosProdutos = {};

        $scope.carregandoLoja = true;

        $scope.carregandoProdutos = true;

        var conta = $routeParams.conta;

        LojaService.obterLoja(conta)
        .then(function (result) {                                    

            $scope.dadosLoja = result.dadosLoja;
            $scope.dadosCategorias = result.dadosCategoria;                        
            $scope.carregandoLoja = false;

            $scope.filtrarProdutoPorCategoria(result.dadosLoja.id, 0, undefined);

            //conta vs
            $scope.contaVs(result.dadosLoja.id);
        })
        .catch(function (result) {
            $scope.carregandoLoja = false;
            $scope.carregandoProdutos = false;

        })

        // definir META TAGS
        function definirNgMeta(nomeloja, fotoperfil){
            ngMeta.setTitle(nomeloja, ' | Catáloko');
            ngMeta.setTag('og:image', fotoperfil);
        }        
    }
    
    // Filtra produtos da vitrine por categoria 
    //
    $scope.filtrarProdutoPorCategoria = function (idloja, idcategoria, ev) {
                
        limparCategorias();

        $scope.limpaProdutos();

        var btnCategoriaClick = false, btnCategoria;

        // Aciona animação do botão de categoria
        if (ev != undefined) {
            var btnCategoriaClick = true;
            goToElement('ranking-category-mousewheel');
            btnCategoria = $(ev.currentTarget);
            btnCategoria.addClass("chips-btn-clicked");
            btnCategoria.addClass("chips-btn-waiting");                        
        }
                        
        LojaService.obterProdutosPorCategoria(idloja, idcategoria)
        .then(function (result) {            
            $scope.dadosProdutos = result;            
            $scope.carregandoProdutos = false;
            btnCategoriaClick ? activeBtnCategoria(btnCategoria) : "";            
        })
        .catch(function (result) {
            $scope.carregandoProdutos = false;
        })
    }

    //
    //
    $scope.limpaProdutos = function () {
        $scope.dadosProdutos = {};
        $scope.carregandoProdutos = true;
    }

    // Realiza ancora para elementos dentro da página com animação
    //
    function goToElement(eID) {        
        anchorSmoothScroll.scrollTo(eID);
    }

    // Ativa botão de categoria clicado (aplica css clicked)
    //
    function activeBtnCategoria(btnCategoria) {
        btnCategoria.removeClass("chips-btn-waiting");
    }

    // Limpa css de categorias para atribuir novo CLICKED LINK
    //
    function limparCategorias() {        
        $(".ranking-category-table-btn").removeClass("chips-btn-clicked");        
    }

    // Conta um VS para loja
    //
    $scope.contaVs = function (idloja) {
        if (UserStore.setLojaVs(idloja)) {            
            LojaService.lojaCountVs(idloja)
            .then(function (result) {})            
        } 
    }

    // Mostra informações da loja em Dialog
    //
    $scope.showInfoLoja = function (ev) {
        $mdDialog.show({
            controller: 'LojaCtrl',
            templateUrl: 'app/loja/partials/lojaInfoDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
       .then(function () { }, function () { });
    }

    // Mostra dialog do Produtos
    //
    $scope.showProduto = function (ev, idproduto) {

        $rootScope.showProdutoId = idproduto;

        console.log('SHOW PRODUTO', idproduto);

        $mdDialog.show({
            controller: 'ProdutoCtrl',
            templateUrl: 'app/loja/partials/previewProdutoDialog.tpl.html',
            parent: angular.element(document.body),           
            fullscreen: true,            
            targetEvent: ev,
            preserveScope: true,
            clickOutsideToClose: true
        })
       .then(function () { 
           $rootScope.updateSession();
       }, function () { });
    }
    
})



.controller('ProdutoCtrl', function ($scope, $rootScope, $routeParams, $location, LojaService) {
    
   
    // carrega página do produto
    //
    $scope.carregarProduto =  function(){

        $scope.carregandoProduto = true;

        var idproduto;

        $scope.isDialog = false;      
                
        // Instancia página de produto por URL
        if ($routeParams.idproduto != undefined) {            
            idproduto = $routeParams.idproduto;            

            // Instancia página de produto por SHOWDIALOG
        } else if ($rootScope.showProdutoId != undefined || $rootScope.showProdutoId != null) {
            idproduto = $rootScope.showProdutoId;
            $scope.isDialog = true;                        
        }        

         LojaService.obterProduto(idproduto)
         .then(function(data){
            
            $scope.produto = data.produto;
            $scope.dadosLoja = data.dadosLoja;

            $scope.produto.fotoOriginal = data.produto.fotoPrincipal;

            $scope.produto.temFotosSecundarias = false;

            $scope.produto.fotoSecundarias.length > 0 ? $scope.produto.temFotosSecundarias = true : $scope.produto.temFotosSecundarias = false;            

            $scope.carregandoProduto = false;

            // obtem dados da loja
            LojaService.obterLojaPorId($scope.produto.idLoja)
             .then(function (data) {
                 $scope.produto.dadosLoja = data.dadosLoja;                 
             })             

         })
         .catch(function(data){            
            $scope.carregandoProduto = false;
         })        

    }
    
    //mudar visualização de foto
    //
    $scope.mudarImagemPresentation = function (event) {        
        $scope.produto.fotoPrincipal = event.target.style.backgroundImage.replace(/(url\(|\)|")/g, '');
    }

    //
    //
    $scope.mudarFotoOriginal = function(){
         $scope.produto.fotoPrincipal = $scope.produto.fotoOriginal;
    }

    //
    //
    $scope.hideProductDialog = function () {
        $rootScope.hideDialog();
    }
   
})



.controller('BuscarLojasCtrl', function ($scope, $rootScope, $location, $mdDialog, $filter, $mdMedia, LojaService, AuthSearch) {
    
    $scope.lojas = {};
    $scope.lojas.products = [];

    $scope.mdMedia = $mdMedia;

    // show para Botão de Pesquisa por Geo

    // lojasShowGeoAction -- DADOS
    //
    // Não tenho dados de GEO = 1
    // Tenho dados de GEO = 2
    // Mostrando lista de LOJAS = 3
    //
    $scope.lojasShowGeoAction = 1;
    $scope.isBuscaGeo = false;

    $scope.hidelojasShow = true;

    
    // Carrega dados necesário para busca por nome e por localização
    //
    $scope.carregarBuscarLoja = function () {       

        if (AuthSearch.getGeo() != null) {
            $scope.lojasShowGeoAction = 2;
            $rootScope.LOCATION_ON = true;
        } else {            
            $scope.watchLocationChange();
        }
    }

    // Assisti mudanças na variável de controle LOCATION_ON do controller LocationCtrl
    //
    $scope.watchLocationChange = function () {

        $rootScope.LOCATION_ON = false;

        $scope.$watch('LOCATION_ON', function (newValue, oldValue) {
            if ($rootScope.LOCATION_ON) {
                console.warn('LOCATION CHANGE', $rootScope.LOCATION_ON);                
                $scope.buscarLojasGeo();
            }
        })
    }

    // Busca lojas por Geolocalização
    //
    $scope.buscarLojasGeo = function () {
        
        var geodata = AuthSearch.getGeo();                

        $scope.lojasShowGeoAction = 4;

        $scope.isBuscaGeo = true;

        if(geodata.longitude == null && geodata.latitude == null){
            $scope.raiokm = null;
        } else {
            $scope.raiokm = geodata.raiokm;
        }

        LojaService.obterLojasPorGeo(geodata)
            .then(function (result) {
                $scope.lojasShowGeoAction = 3;
                $scope.resultadoPesquisa = result;                
            })
            .catch(function (result) {                
                $scope.msgErro = result;
                $scope.lojasShowGeoAction = 5;
            })
    }


    // Define qual setor de loja filtrar
    //
    $scope.buscarLojasSetor = function (idsetor) {

        var geodata = AuthSearch.getGeo();

        geodata.idSetor = idsetor;

        AuthSearch.setGeo(geodata);
        
        $scope.buscarLojasGeo();
    }

   
    // Busca loja por nome
    //
    $scope.buscarLojaNome = function (termo) {       
        
        $scope.isBuscaGeo = false;

        $scope.lojasShowGeoAction = 4;
        LojaService.obterLojasPorNome(termo)
        .then(function (result) {
            $scope.lojasShowGeoAction = 3;
            $scope.raiokm = 0;
            $scope.resultadoPesquisa = result;           
        })
        .catch(function (result) {            
            $scope.msgErro = result;            
            $scope.lojasShowGeoAction = 5;
        })                
    }
    
    //
    //
    $scope.configurarPesquisaDialog = function (ev) {

        $scope.buscalojaconfig = AuthSearch.getGeo();

        if ($scope.buscalojaconfig.raiokm == null) {
            $scope.buscalojaconfig.raiokm = 2;
        }       

        $mdDialog.show({
            controller: 'LojaCtrl',
            templateUrl: 'app/loja/partials/buscaLojaConfigDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function () { }, function () { });                
    }

    //
    //
    $scope.atualizaDadosBuscaLocalizacao = function (geodata) {
        
        if(geodata.setor != null){
            geodata.idSetor = geodata.setor.id;
        }        
        
        AuthSearch.setGeo($scope.buscalojaconfig);
        $scope.hideDialog();
        $scope.buscarLojasGeo();
    }

});