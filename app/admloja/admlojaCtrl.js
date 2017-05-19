/// <reference path="partials/cadastroloja/editarLocalizacaoConfirmDialog.tpl.html" />
angular.module('proj.admloja', [])

.config(function ($routeProvider) {
    $routeProvider
        .when('/loja/entrar', {
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/entrar.tpl.html'
        })

        .when('/loja/cadastro', {
            controller: 'CadastroCtrl',
            templateUrl: 'app/admloja/partials/cadastroloja/cadastro.tpl.html'
        })

        .when('/loja/:idloja/inicio', {
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/inicio.tpl.html'
        })

         .when('/loja/:idloja/editar', {
             controller: 'CadastroCtrl',
             templateUrl: 'app/admloja/partials/cadastroloja/editar.tpl.html'
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
            controller: 'CadastroProdutoCtrl',
            templateUrl: 'app/admloja/partials/produtoeditar.tpl.html'
        })

        .when('/loja/:idloja/produto/novo', {
            controller: 'CadastroProdutoCtrl',
            templateUrl: 'app/admloja/partials/produtoNovo.tpl.html'
        })                
})


.controller('AdmLojaCtrl', function ($scope, $rootScope, $location, $routeParams, $mdDialog, AdmLojaService, AuthStore) {

    //-------------------------------------------------------------
    // test ------- NAVIGATION
    //-------------------------------------------------------------
    
    $scope.editarProduto = function (idproduto) {
        window.open("#/loja/1/produto/" + idproduto + "/editar", "_self");
    }

    //-------------------------------------------------------------
    // LOGIN
    //-------------------------------------------------------------

    //
    //
    $scope.carregaLogin = function(){
        var indexMessage = $location.search().msg;

        if (indexMessage == 1) {
            $scope.loginMessage = "Agora entre com o nome de usuário e senha cadastrados";
        } else {
            $scope.loginMessage = "Catáloko - Seu catálogo online!";
        }
    }

    // Entra com login e senha da loja e redireciona para página inicial    
    //
    $scope.logarLoja = function (entrar) {
        
        $scope.carregandoLogin = true;
        $scope.loginError = "";

        AdmLojaService.auth(entrar)
            .then(function (result) {
                var conta = {};
                conta.keypass = result.keypass;

                if (result.idLoja != null) {
                    conta.idloja = result.idLoja;
                }

                AuthStore.set(conta);                
                $rootScope.irPara("loja/" + AuthStore.get().idloja + "/inicio");
                $scope.carregandoLogin = false;
                $rootScope.showToast('Bem-vindo ao painel de gerenciamento da sua loja');

            })
            .catch(function (result) {
                
                $scope.carregandoLogin = false;
                $scope.loginError = "Usuário ou senha estão incorretos";

            })        
    }
    
    //-------------------------------------------------------------
    // FOTO PERFIL
    //-------------------------------------------------------------

    //
    //
    $scope.editarFotoperfilLoja = function (ev) {
        $mdDialog.show({
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/editarFotoPerfilDialog.tpl.html',
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
    $scope.salvarFotoperfil = function (newfoto) {

        //console.log($scope.dadosLoja.fotoperfil);

        var dataFoto = {};
        dataFoto.newfoto = newfoto;

        AdmLojaService.salvarFotoPerfilLoja(AuthStore.get().idloja, dataFoto)
        .then(function (result) {
            $scope.trocarfotoperfilShow = 2;
            console.log(result);
        })
        .catch(function (result) {
            $scope.trocarfotoperfilShow = 2;
            console.log(result);
        })        
    }


    //-------------------------------------------------------------
    // DADOS LOJA
    //-------------------------------------------------------------

    // Carrega dados loja inicial
    //
    $scope.carregaLojaInicio = function () {

        $scope.carregandoInicio = true;
        
        var idloja = $routeParams.idloja;

        AdmLojaService.obterDadosLoja(idloja)
        .then(function (dadosloja) {

            $scope.dadosLoja = dadosloja;            
            console.log(dadosloja);
            $scope.carregandoInicio = false;
        })
        .catch(function (result) {
            $scope.showToast(result);
            $scope.terminarSessao();
            console.log(result);
            $scope.carregandoInicio = false;
        })
    }

    // Deslogar
    //
    $scope.terminarSessao = function(){        
        AuthStore.clear();
        $rootScope.irPara("loja/entrar");
    }



    //-------------------------------------------------------------
    // SETOR
    //-------------------------------------------------------------

    // Mostra dialogo para escolha de Setor
    //
    $scope.escolherSetorDialog = function (ev, idloja) {
        
        $scope.carregandoSetoresDialog = true;

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

        AdmLojaService.obterSetores()
          .then(function (result) {
              $scope.setoresDisponiveis = result;
              $scope.carregandoSetoresDialog = false;
          })
          .catch(function () {
            $scope.carregandoSetoresDialog = false;
          })
    };
    

    // Aponta qual setor a loja escolheu antes de salvar
    //
    $scope.escolherSetor = function (setor) {        
        $scope.setorEscolhido = setor.titulo;
        $scope.setorEscolhidoId = setor.id;
    }

    // Salvar setor na loja, mostra tela de sucesso e atualiza loja
    //
    $scope.salvarSetor = function () {                
        AdmLojaService.salvarSetor(AuthStore.get().idloja, $scope.setorEscolhidoId)
        .then(function (result) {
            console.log('OK', result);
            $scope.escolherSetorDialogShow = 2;
            $scope.carregaLojaInicio();
        })
        .catch(function (result) {
            $scope.escolherSetorDialogShow = 3;            
        })        
    }
    

    //-------------------------------------------------------------
    // CATEGORIA
    //-------------------------------------------------------------

    //
    //
    $scope.opcoesCategoriaDialog = function (ev, categoria) {
        
        $scope.opcaocategoria = categoria;

        $mdDialog.show({
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/opcoesCategoriaDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function () { }, function () { });
    };

    //
    //
    $scope.cadastroCategoriaDialog = function (ev, idcategoria) {
        
        $scope.salvandoCategoria = false;

        $mdDialog.show({
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/dialogs/cadastroCategoriaDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function () { }, function () { });     
    };

    //
    //
    $scope.dicaCategoriaDialog = function (ev) {
        
        $scope.salvandoCategoria = false;
        
        $mdDialog.show({
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/dialogs/dicasCategoriaDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function () { }, function () { });     
    };


    //
    //
    $scope.carregaCategorias = function () {

        $scope.categoriasDisponiveis = {};

        AdmLojaService.obterCategorias(AuthStore.get().idloja)
        .then(function (result) {
            $scope.categoriasDisponiveis = result;
        })        
    }


    //
    //
    $scope.salvarCategoria = function (dadosCategoria) {

        console.log(dadosCategoria);

        $scope.salvandoCategoria = true;

        AdmLojaService.salvarCategoria(AuthStore.get().idloja, dadosCategoria)
        .then(function (result) {
            console.log(result);
            $scope.hideDialog();
            $rootScope.showToast(result);            
            $scope.carregarGerenciaCategoria();
            $scope.salavandoCategoria = true;
        })
        .catch(function (result) {
            console.log(result);
            $scope.cadastroCategoriaMsgError = result.Message;
            if ($scope.ckErrorsReg == null) {
                $scope.ckErrorsReg = [];
            } else {
                for (var e in $scope.ckErrorsReg) {
                    $scope[$scope.ckErrorsReg[e]] = "";
                }
            }

            if (result.ModelError != null) {
                for (var i in result.ModelError) {
                    const campo = result.ModelError[i].campo;
                    $scope.ckErrorsReg.push(campo);
                    $scope[campo] = result.ModelError[i].erro;
                }
            }
            $scope.salavandoCategoria = true;
        })
    }


    //
    //
    $scope.editarCategoria = function (dadosCategoria) {
        console.log(dadosCategoria);

        AdmLojaService.editarCategoria(AuthStore.get().idloja, dadosCategoria)
        .then(function (result) {
            console.log(result);
            $rootScope.showToast(result);
            $scope.hideDialog();
            $scope.carregarGerenciaCategoria();
        })
        .catch(function (result) {
            $rootScope.showToast(result);            
            $scope.hideDialog();
        })
    }

    //
    //
    $scope.desativarCategoria = function (dadosCategoria) {
        console.log(dadosCategoria);
    }

    //
    //
    $scope.carregarGerenciaCategoria = function () {
        $scope.carregandoCategoria = true;

        $scope.idloja = AuthStore.get().idloja;

        AdmLojaService.obterTodasCategorias(AuthStore.get().idloja)
       .then(function (result) {

           console.log(result);

           $scope.categorias = result.categoriaAtivas;

           $scope.categoriasInativas = result.categoriaInativas;
           
           $scope.carregandoCategoria = false;
       })
        .catch(function (result) {
            $scope.carregandoCategoria = false;
        })

    }


    //-------------------------------------------------------------
    // LISTA DE PRODUTOS
    //-------------------------------------------------------------

    // Carrega produtos ativos da LOJA
    //
    $scope.carregaProdutos = function () {

        $scope.carregandoListaProdutos = true;

        $scope.idLoja = $routeParams.idloja;

         AdmLojaService.obterProdutosLoja(AuthStore.get().idloja)
            .then(function (result) {
                console.log(result);
                $scope.carregandoListaProdutos = false;
                $scope.listaProdutos = result;
                $scope.listaProdutos.idLoja = AuthStore.get().idloja;
                $scope.carregaCategoriasLoja();
            })
            .catch(function (result) {
                $scope.carregandoListaProdutos = false;
                $scope.errorListaProdutos = result;
            })         
    }

    // Mostra previsualização de produtos
    //
    $scope.previewProdutoDialog = function (ev, idproduto) {

        console.log(idproduto);

        $scope.carregandoPreviewProduto = true;

        AdmLojaService.obterProduto(idproduto)
        .then(function (result) {
            
            console.log(result);

            $scope.previewProduto = result.produto;

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

            $scope.carregandoPreviewProduto = true;
        })
        .catch(function (result) {
            $rootScope.showToast(result);
        })


    }

    // Carrega categorias disponíveis
    //
    $scope.carregaCategoriasLoja = function () {

        AdmLojaService.obterCategorias(AuthStore.get().idloja)
        .then(function (result) {
            $scope.categoriasDisponiveis = result;
        })
    }  

    // Filtra produtos por categoria informada em um selectbox
    //
    $scope.filtarProdutosCategoria = function (idcategoria) {

        $scope.carregandoListaProdutos = true;
        
        AdmLojaService.obterProdutosLojaPorCategoria(AuthStore.get().idloja, idcategoria)
           .then(function (result) {
               $scope.carregandoListaProdutos = false;
               $scope.listaProdutos = result;               
           })
           .catch(function (result) {
               $scope.carregandoListaProdutos = false;
               $scope.errorListaProdutos = result;
           })
    }

    // Limpa pesquisa e retorna ao estado inicial
    //
    $scope.filtrarProdutosLimpar = function () {
        $scope.termoPesquisaProdutos = "";
        $scope.carregaProdutos();
        $scope.filterProdutos = 0;
    }


    

})


.controller('CadastroProdutoCtrl', function ($scope, $rootScope, $mdDialog, $routeParams, AdmProdutoService, AdmLojaService, AuthStore) {

    //-------------------------------------------------------------
    // EDITAR PRODUTO
    //-------------------------------------------------------------


    // Carrega página de edição de produto com dados para edição
    //
    $scope.carregarProdutoEditar = function () {

        $scope.carregandoProdutoEdicao = true;

        var idproduto = $routeParams.idproduto;

        console.log(idproduto);
        
        AdmLojaService.obterProduto(idproduto)
        .then(function (result) {
            console.log(result);
            result.produto.preco = result.produto.preco.replace(",", ".");
            $scope.dadosProduto = result.produto;
            $scope.dadosProduto.linkfoto = $scope.dadosProduto.fotoPrincipal;            
            console.log($scope.dadosProduto);
            //carrega categorias para edição
            $scope.carregaCategoriasProduto();
            $scope.carregandoProdutoEdicao = false;
        })
        .catch(function (result) {
            $rootScope.showToast(result);
            $scope.carregandoProdutoEdicao = false;
        })

    }

    // Salva novos dados do produtos
    //
    $scope.salvarEdicoesProduto = function (dadosProduto) {

        console.log(dadosProduto);

        $scope.salvandoEdicaoDadosProduto = true;

        AdmProdutoService.salvarEdicaoProduto(dadosProduto.id, dadosProduto)
        .then(function (result) {                       
            $scope.salvandoEdicaoDadosProduto = false;
            console.log(result);
            $rootScope.showToast(result.message);
            $rootScope.irPara("/loja/" + result.dadosProduto.idLoja + "/produto");
        })
        .catch(function (result) {

            console.log(result);

            $scope.singleError = result.Message;
            if ($scope.ckErrorsReg == null) {
                $scope.ckErrorsReg = [];
            } else {
                for (var e in $scope.ckErrorsReg) {
                    $scope[$scope.ckErrorsReg[e]] = "";
                }
            }

            if (result.ModelError != null) {
                for (var i in result.ModelError) {
                    const campo = result.ModelError[i].campo;
                    $scope.ckErrorsReg.push(campo);
                    $scope[campo] = result.ModelError[i].erro;
                }
            }
            console.log(result);

            $scope.salvandoEdicaoDadosProduto = false;
        })
    }
    
    // Dialogo para adicionar imagem ao produto
    //
    $scope.adicionarFotoProdutoDialog = function (ev) {

        $scope.novafotoperfil = "/img/defaultProd.png";

        $mdDialog.show({
            controller: 'CadastroProdutoCtrl',
            templateUrl: 'app/admloja/partials/dialogs/adicionarFotoProdutoDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
         .then(function () {

         }, function () { });
    }

    // Salvar foto da imagem
    //
    $scope.salvarNovaFotoProduto = function (novafotolink) {

        dadosMedia = {};
        dadosMedia.link = novafotolink;

        AdmProdutoService.salvarMidiaProduto($scope.dadosProduto.id, dadosMedia)
        .then( function (result){
            console.log(result);
            $scope.hideDialog();
            $scope.showToast(result);
            $scope.carregarProdutoEditar();
        })
        .catch(function (result) {
            $scope.adicionarfotoproduto = 3;
            console.log(result);
        })        
    }

    // Excluir foto da imagem
    //
    $scope.excluirFotoProduto = function (idproduto, idmedia) {
        
        AdmProdutoService.excluirMidiaProduto($scope.dadosProduto.id, idmedia)
        .then(function (result) {
            console.log(result);
            $scope.hideDialog();
            $scope.showToast(result);
            $scope.carregarProdutoEditar();
        })
        .catch(function (result) {
            $scope.hideDialog();
            console.log(result + ".Tente novamente mais tarde.");
        })
    }

    // Mostra dialog para excluir uma foto do produto
    //
    $scope.excluirFotoProdutoDialog = function (ev, mediaProduto) {

        $scope.mediaProduto = mediaProduto;

        console.log(mediaProduto);

        $mdDialog.show({
            controller: 'CadastroProdutoCtrl',
            templateUrl: 'app/admloja/partials/dialogs/excluirFotoProdutoDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
         .then(function () {

         }, function () { });
    }


    //-------------------------------------------------------------
    // NOVO PRODUTO
    //-------------------------------------------------------------

    // Carrega dados para começar o cadastro do produto
    //
    $scope.carregarProdutoNovo = function () {
        $scope.dadosProduto = {};
        $scope.dadosProduto.linkfoto = "img/defaultProd.png";
    }

    // Carrega categorias disponíveis da loja
    //
    $scope.carregaCategoriasProduto = function () {

        $scope.categoriasDisponiveis = {};

        AdmLojaService.obterCategorias(AuthStore.get().idloja)
        .then(function (result) {
            $scope.categoriasDisponiveis = result;
        })
    }

    // Salvar produto
    //
    $scope.salvarProduto = function (dadosProduto) {

        //console.log(dadosProduto);

        $scope.salvandoDadosProduto = true;

        AdmProdutoService.salvarProduto(AuthStore.get().idloja, dadosProduto)
        .then(function (result) {            

            $scope.dadosNovoProduto = result.dadosProduto;

            $mdDialog.show({
                controller: 'AdmLojaCtrl',
                templateUrl: 'app/admloja/partials/dialogs/cadastroProdutoConfirmDialog.tpl.html',
                parent: angular.element(document.body),
                scope: $scope,
                preserveScope: true,                
                fullscreen: true,
                clickOutsideToClose: false
            })
            .then(function () { }, function () { });

            $scope.salvandoDadosProduto = false;
        })
        .catch(function (result) {
            $scope.singleError = result.Message;
            if ($scope.ckErrorsReg == null) {
                $scope.ckErrorsReg = [];
            } else {
                for (var e in $scope.ckErrorsReg) {
                    $scope[$scope.ckErrorsReg[e]] = "";
                }
            }

            if (result.ModelError != null) {
                for (var i in result.ModelError) {
                    const campo = result.ModelError[i].campo;
                    $scope.ckErrorsReg.push(campo);
                    $scope[campo] = result.ModelError[i].erro;
                }
            }
            console.log(result);

            $scope.salvandoDadosProduto = false;
        })
    }

    // Mostra regras para cadastro de produtos
    //
    $scope.regrasProdutoDialog = function () {
        $mdDialog.show({
            controller: 'AdmLojaCtrl',
            templateUrl: 'app/admloja/partials/dialogs/regrasProdutoDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            fullscreen: true,
            clickOutsideToClose: false
        })
          .then(function () { }, function () { });
    }

})


.controller('CadastroCtrl', function ($scope, $rootScope, $mdDialog, $routeParams, $mdToast, AdmLojaService, AuthStore, LocationService) {

    $scope.cadastrando = false;

    //CADASTRO DE LOJA
    $scope.cadastrarLoja = function (dadosLoja) {

        $scope.cadastrando = true;        
        AdmLojaService.cadastrarLoja(dadosLoja)
            .then(function (result) {
                console.log(result);                
                $scope.cadastrando = false;
                $rootScope.irPara("loja/entrar");
                $rootScope.showToast("Agora para entrar na sua loja entre com o nome de usuário e senha que acabou de cadastrar");
            })
            .catch(function (result) {                               
                $scope.singleError = result.Message;                
                if ($scope.ckErrorsReg == null) {
                    $scope.ckErrorsReg = [];
                } else {
                    for (var e in $scope.ckErrorsReg) {
                        $scope[$scope.ckErrorsReg[e]] = "";
                    }
                }

                if (result.ModelError != null) {
                    for(var i in result.ModelError ){
                        const campo = result.ModelError[i].campo;
                        $scope.ckErrorsReg.push(campo);
                        $scope[campo] = result.ModelError[i].erro;                        
                    }
                }
                console.log(result);                
                $scope.cadastrando = false;
            })
    }

    // CARREGA DADOS DA LOJA PARA EDIÇÃO
    //
    $scope.carregarEditarLoja = function(){

        // loading da página
        $scope.carregandoEditarLoja = true;

        $scope.carregandoEndereco = false;

        $scope.editarLocalizaoShow = 0;

        // loading da procura automatica da localizacao
        $scope.carregandoLocalizacaoShow = false;

        var idloja = $routeParams.idloja;

        AdmLojaService.obterDadosLoja(idloja)
        .then(function (dadosloja) {

            console.log(dadosloja);

            $scope.dadosLoja = dadosloja;
            
            $scope.carregandoEditarLoja = false;         
        })
        .catch(function (result) {                        
            console.log(result);
            $scope.carregandoEditarLoja = false;
        })

    }


    // SALVA DADOS DA LOJA 
    // Obs: passar todos os dados disponíveis da loja nessa função
    //
    $scope.salvarEdicaoLoja = function () {
                
        $scope.salvandoEdicaoLoja = true;

        AdmLojaService.editarLoja(AuthStore.get().idloja, $scope.dadosLoja)
        .then(function (result) {
            console.log(result);
            $rootScope.showToast("Dados da loja estão atualizados");
            $scope.salvandoEdicaoLoja = false;
        })
        .catch(function (result) {
            $scope.singleError = result.Message;
            if ($scope.ckErrorsReg == null) {
                $scope.ckErrorsReg = [];
            } else {
                for (var e in $scope.ckErrorsReg) {
                    $scope[$scope.ckErrorsReg[e]] = "";
                }
            }
            if (result.ModelError != null) {
                for (var i in result.ModelError) {
                    const campo = result.ModelError[i].campo;
                    $scope.ckErrorsReg.push(campo);
                    $scope[campo] = result.ModelError[i].erro;
                }
            }
            console.log(result);
            $scope.salvandoEdicaoLoja = false;
           
        })

    }

    // SALVA NOVA LOCALIZACAO     
    //
    $scope.salvarLojaLocalizao = function () {
        
        $scope.buttonLoadingSalvarLojaLocalizao = true;

        AdmLojaService.editarLojaLocalizacao(AuthStore.get().idloja, $scope.dadosLocal)
        .then(function (result) {
            console.log(result);            
            $scope.editarLojaConfirmDialogShow = 2;
            $scope.buttonLoadingSalvarLojaLocalizao = false;
            
        })
        .catch(function (result) {            
            console.log(result);
            $scope.editarLojaConfirmDialogShow = 3;
            $scope.buttonLoadingSalvarLojaLocalizao = false;
        })

    }

    // ADDRESS
    //
    $scope.procurarLocalizacaoPorEndereco = function (dadosEndereco, address) {

        $scope.carregandoEndereco = true;
        if (address == null) {
            address = dadosEndereco.logradouro + ", " + dadosEndereco.numero + " " + dadosEndereco.bairro + " " + dadosEndereco.cidade;
        }
                
        LocationService.decodeAddressGoogleMapsAPI(address)
        .then(function (result) {
            
            if (result.status == "OK") {
                console.log('-------------OBTER POR ADDRESS SUCESSO');
                console.warn(result);
                $scope.extractLocationData(result);
                $scope.carregandoEndereco = false;
            } else {
                console.log('-------------ERROR DE STATUS AO OBTER ADDRESS');
                console.warn(result.status);
                $scope.carregandoEndereco = false;
            }
        })
        .catch(function (result) {
            console.log('-------------ERRO AO OBTER ADDRESS');
            console.log(result);
            $scope.carregandoEndereco = false;
        })
        
    }

    // CEP
    //
    $scope.procurarLocalizacaoPorCep = function (dadosCep) {

        $scope.carregandoEndereco = true;

        LocationService.decodeCepAPI(dadosCep.cep)
          .then(function (result) {

              console.log('-------------CEP RESULT');
              console.log( result);

              var newAddress = result.address + ", " + dadosCep.numero + " " + result.district + " - " + result.city;
              $scope.procurarLocalizacaoPorEndereco(null, newAddress);              
          })
          .catch(function (result) {
              console.warn('ERRO CEP DECODER', result);
              $scope.carregandoEndereco = false;
          })
    }

    // GPS
    //
    $scope.procurarLocalizacaoPorLatLng = function () {
       
        console.log('PROCURAR LATLONG');

        $scope.editarLocalizaoShowGpsCarregando = 2;

        if (navigator.geolocation) {            
            navigator.geolocation.getCurrentPosition(getLatLong, showError, { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 });            
        } else {
            console.log('------------ ERRO AO CHAMAR NAVIGATOR GEOLOCATION');
        }

        function getLatLong(position) {
            var latlong = position.coords.latitude + ',' + position.coords.longitude;
            LocationService.decodeGoogleMapsAPI(latlong)
            .then(function (data) {
                $scope.extractLocationData(data);
            })

            .catch(function (err) {                
                console.warn('--------ERRO DECODE  LATLONG');
            })
        }

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log(error, 'PERMI DENIED');
                    $scope.locationMsgError = "Permissão negada. Por favor, atualize o site e ative seu GPS. Se possível limpe o histórico do navegador.";                    
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log(error, 'UNAVAILABLE');
                    $scope.locationMsgError = "Por favor, atualize o site e ative seu GPS.";                    
                    break;
                case error.TIMEOUT:
                    console.log(error, 'TIME OUT');
                    $scope.locationMsgError = "Acho que a resposta do GPS demorou um pouco, tente de novo!";                    
                    break;
                case error.UNKNOWN_ERROR:
                    console.log(error, 'UNNKOW ERROR');
                    $scope.locationMsgError = "Aconteceu algum erro desconhecido. Vamos cuidar disso em breve!";                    
                    break;
            }
        }

    }

    // Mostra opção de preenchimento de dados de localização
    //
    $scope.mostrarPopUpOpcoesLocalizacao = function (opcaolocalizacao) {

        console.log(opcaolocalizacao);
                  
        $scope.editarLocalizaoShow = opcaolocalizacao;
        $mdDialog.show({
            controller: 'LocationCtrl',
            templateUrl: 'app/admloja/partials/cadastroloja/editarLocalizacaoOptionsDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,                    
            clickOutsideToClose: true,
            fullscreen: true
        })
        .then(function () { });                
                                      
    }

    // CONFIRMA DADOS NO GOOGLE MAPS PODENDO SALVAR
    //
    $scope.mostrarPopUpMapaConfirm = function () {
                  
        $mdDialog.show({
            controller: 'LocationCtrl',
            templateUrl: 'app/admloja/partials/cadastroloja/editarLocalizacaoConfirmDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,                    
            clickOutsideToClose: true
        })
        .then(function () { });                
                                      
    }

    // CARREGA MAPA GOOGLE MAPS
    //
    $scope.renderizarMapa = function (idMap) {
        
        if ($scope.dadosLocal == null) {            
            $scope.dadosLocal = {};            
            $scope.dadosLocal.latitude = $scope.dadosLoja.latitude;
            $scope.dadosLocal.longitude = $scope.dadosLoja.longitude;            
        }

        var myOptions = {
            zoom: 17,
            center: new google.maps.LatLng($scope.dadosLocal.latitude, $scope.dadosLocal.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        idMap == null || idMap == "" ? idMap = "gmaps_canvas" : true;
            
        map = new google.maps.Map(document.getElementById(idMap), myOptions);

        marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng($scope.dadosLocal.latitude, $scope.dadosLocal.longitude)
        });


        var mapDescriptionAskContent;

        if ($scope.dadosLocal.logradouro != null && $scope.dadosLocal.bairro != null) {            
            mapDescriptionAskContent = "?";
        } else {            
            mapDescriptionAskContent = "!";
        }

        infowindow = new google.maps.InfoWindow({
            content: '<strong>Sua loja está aqui'+ mapDescriptionAskContent +'</strong>'
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        infowindow.open(map, marker);

        google.maps.event.addDomListener(window, 'load');
    }

    //
    //
    $scope.extractLocationData = function (data) {

        $scope.dadosLocal = {};

        if (data.status == "OK") {
            if (data.results[0]) {

                //console.log('========DATA MAPS',data.results[0]);

                $scope.dadosLocal.numero = extractFromAddress(data.results[0].address_components, "street_number", null);
                $scope.dadosLocal.logradouro = extractFromAddress(data.results[0].address_components, "route", null);
                $scope.dadosLocal.cidade = extractFromAddress(data.results[0].address_components, "administrative_area_level_2", null);
                $scope.dadosLocal.bairro = extractFromAddress(data.results[0].address_components, "sublocality_level_1", null);
                $scope.dadosLocal.estado = extractFromAddress(data.results[0].address_components, "administrative_area_level_1", null);
                $scope.dadosLocal.pais = extractFromAddress(data.results[0].address_components, "country", null);                

                if (data.results[0].geometry.bounds != null) {
                    $scope.dadosLocal.latitude = data.results[0].geometry.bounds.northeast.lat;
                    $scope.dadosLocal.longitude = data.results[0].geometry.bounds.northeast.lng;
                }
                if (data.results[0].geometry.location != null) {
                    $scope.dadosLocal.latitude = data.results[0].geometry.location.lat;
                    $scope.dadosLocal.longitude = data.results[0].geometry.location.lng;
                }
                
                console.log("======== DATA EXTRACT FROM MAPS", $scope.dadosLocal);

                $scope.mostrarPopUpMapaConfirm();
            }
        } else {

        }

        //Extrai determinada parte do endereço completo.
        function extractFromAddress(components, type, typename) {
            for (var i = 0; i < components.length; i++)
                for (var j = 0; j < components[i].types.length; j++)
                    if (components[i].types[j] == type) {
                        if (typename == "short_name") {
                            return components[i].short_name;
                        } else {
                            return components[i].long_name;
                        }
                    }

            return "";
        }
    }
})