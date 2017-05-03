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

        .when('/loja/:idloja/produto', {
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/produtos.tpl.html'
        })

        .when('/loja/:idloja/produto/:idproduto/editar', {
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/produtoeditar.tpl.html'
        })

        .when('/loja/:idloja/produto/novo', {
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/produtoNovo.tpl.html'
        })
})


.controller('AdmLojaCtrl', function ($scope, $rootScope, $location, $mdDialog, LojaService) {
           
    //-------------------------------------------------------------
    // NAVIGATION
    //-------------------------------------------------------------

    $scope.logarLoja = function () {
        window.open("#/loja/1/inicio", "_self");
    }

    $scope.editarProduto = function (idproduto) {
        window.open("#/loja/1/produto/" + idproduto + "/editar", "_self");
    }


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


    //-------------------------------------------------------------
    // LISTA DE PRODUTOS
    //-------------------------------------------------------------

    $scope.carregaProdutos = function () {

    }

    $scope.previewProdutoDialog = function (ev, idproduto) {

        $mdDialog.show({
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/previewProdutoDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            fullscreen: true,
            clickOutsideToClose: true
        })
        .then(function () { }, function () { });
    }
    
    // Carrega categorias disponíveis
    //
    $scope.carregaCategoriasLoja = function () {
        $scope.filtroCategorias = ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4'];
    }

    //
    //
    $scope.filtarProdutosTexto = function (termoPesquisaProdutos) {
        
        if (termoPesquisaProdutos.length > 3) {
            console.log(termoPesquisaProdutos);
        }            
    }

    //
    //
    $scope.filtarProdutosCategoria = function (categoria) {
        console.log(categoria);
    }

    $scope.filtrarProdutosLimpar = function () {
        console.log('LIMPEI');
    }


    //-------------------------------------------------------------
    // EDITAR PRODUTO
    //-------------------------------------------------------------
       
    
    // Carrega página de edição de produto com dados para edição
    //
    $scope.carregarProdutoEditar = function () {

        $scope.produtoEdicao = {};

        $scope.produtoEdicao.titulo = "Tênis DC Mandy OFERTA";

        $scope.produtoEdicao.preco = 190.23;

        $scope.produtoEdicao.descricao = "";
       
    }
    
    // Carrega categorias disponíveis para edição do produto
    //
    $scope.carregarProdutoEditarCategoria = function () {
        $scope.produtoEdicao.categorias = ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4'];
    }


    //-------------------------------------------------------------
    // NOVO PRODUTO
    //-------------------------------------------------------------

    // Carrega dados para começar o cadastro do produto
    //
    $scope.carregarProdutoNovo = function () {
        $scope.produtoNovo = {};
        $scope.produtoNovo.linkfoto = "img/defaultProd.png";
    }

    // Carrega categorias disponíveis da loja
    //
    $scope.carregarProdutoNovoCategoria = function () {
        $scope.produtoNovo.categorias = ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4'];
    }

    // Salvar produto
    //
    $scope.salvarProduto = function(produtoNovo){

        console.log(produtoNovo);

    }

    $scope.carregarFoto = function () {

    }


    

})

