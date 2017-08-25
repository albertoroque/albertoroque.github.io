angular.module('proj.cliente', [])

.config(function ($routeProvider) {
    $routeProvider
        .when('/lojasseguidas', {
            controller: 'ClienteCtrl',
            templateUrl: 'app/cliente/partials/lojasseguidas.tpl.html',
        })
        .when('/notificacoes', {
            controller: 'ClienteCtrl',
            templateUrl: 'app/cliente/partials/notificacoes.tpl.html',
        })
        .when('/login', {
            controller: 'ClienteCtrl',
            templateUrl: 'app/cliente/partials/login.tpl.html',
        });
})

.controller('ClienteCtrl', function ($scope, $rootScope, $location, $mdDialog, $mdMedia, ClienteService, ClienteAuthStore) {

    var i = 0;

    function callby(name) {
        //console.warn(name, i++);
    }

    //---------------------------------------------------------
    //-------- SESSÃO DO USUÁRIO ------------------------------
    //---------------------------------------------------------

    // Mostra dialogo com dados do Cliente e algumas ações
    //    
    $scope.verPerfil = function(){
         $mdDialog.show({
            controller: 'ClienteCtrl',
            templateUrl: 'app/cliente/partials/perfilDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,
            clickOutsideToClose: true
        })
    }

    // CHAMADA INICIAL DE START DA SDK DO FACEBOOK
    //    
    $scope.FBclienteIsLogado = function () {

        $scope.dadosFB = {};
                        
        try {

            var fb_sdk = FB;

            if (fb_sdk != null) {
                $scope.obterDadosFBOnScope();
            }

        } catch (e) {
            
            $(window).load(function () {
                $scope.obterDadosFBOnScope();                
            })

        }       
    }

    // CAPTURA DADOS DO FACEBOOK NO ClienteService
    //
    $scope.obterDadosFBOnScope = function () {

        callby('obterDadosFBOnScope');
        
        ClienteService.obterDadosFB()

            .then(function (dados) {

                console.log(dados);

                $scope.dadosFB.nome = dados.dadosperfil.name;
                $scope.dadosFB.email = dados.dadosperfil.email;
                $scope.dadosFB.idsocial = dados.dadosperfil.id;  
                $scope.dadosFB.fotoperfil = dados.dadosperfil.picture.data.url;              
                $scope.dadosFB.siglaredesocial = "fb";  
                              
                //auth FB data
                $scope.authClientFb($scope.dadosFB);
            })

            .catch(function (dados) {
                
                //---IMPORTANT----
                if (dados.statusFB == 'unknown' || dados.statusFB == 'not_authorized') {

                    $scope.showFBLogin = true; //show LOGIN BTN     

                } else {

                    $scope.erroLogin = true;//show !ERRO!                
                }

                $scope.verificandoIsLogin = false;//hide loading
            })
    }

    // FAZ A AUTENTICAÇÃO DE USUÁRIO DO FACEBOOK NO BANCO DO CATÁLOKO
    //
    $scope.authClientFb = function(dadosFb){

        callby('authClienteFB');

        ClienteService.authClienteSocial(dadosFb)

            .then(function (response) {

                var isnewuser = false;            

                response.isNewUser == "true" ? isnewuser = true : '';

                //auth userkey
                $scope.auth(response.Key, isnewuser);
            })

            .catch(function (response){
                
                $scope.erroLogin = true;
                $scope.verificandoIsLogin = false;
                console.log('authClienteFb --- ERRO:');
            })
    }
    
    
    // AUTENTICAÇÃO DE USUÁRIO
    //    
    $scope.auth = function(keypass, isnew){

        callby('auth');

        ClienteService.auth(keypass)

            .then(function(response){
                                   
                response.keypass = keypass;
            
                ClienteAuthStore.set(response);            
            
                $rootScope.getDadosCliente();

                $rootScope.clienteIsLogado();

                if (isnew) {
                    //{ TO DO } Apresentação para novos usuários
                    console.warn('PREPARAR APRESENTAÇÃO PARA NOVOS USUÁRIOS');
                }
            })
            .catch(function (response){
                
                $scope.erroLogin = true;
                $scope.verificandoIsLogin = false;

                console.warn('$auth --- ERRO:');
            })
    }

    // INIT FB LOGIN: ATUALIZA DADOS DO CLIENTE DO COOKIE STORE PARA $ROOTSCOPE
    //
    $rootScope.getDadosCliente = function(){
        $rootScope.SESSION_CLI = ClienteAuthStore.get();   
    }
   
    
    // ATUALIZA DADOS GLOBAIS DE CONTROLE DE SESSÃO
    //
    $rootScope.clienteIsLogado = function () {         
        
        callby('ISlogado');

        $scope.verificandoIsLogin = true;        
        $scope.erroLogin = false;
        $scope.showFBLogin = false;
        
        var keypass = ClienteAuthStore.getKeypass();        

        // TESTE LOGIN
        if (keypass != null && keypass != undefined && keypass != '') {

            //autenticação no servidor (KEYPASS)
            ClienteService.auth(keypass)

                .then(function (response) {                    
                    $rootScope.getDadosCliente();//cookies -> $scope                    
                    $rootScope.SESSION_CLI_ON = true;//show perfil
                    $scope.verificandoIsLogin = false;//hide loading                                        
                })

                .catch(function (response) {                    
                    $scope.erroLogin = true;//show !ERRO!
                    $scope.verificandoIsLogin = false;//hide loading                                        
                })

        // TESTA LOGIN FACEBOOK
        } else {            

            $scope.FBclienteIsLogado();//Função para carregamento de dados do FB;
            
            $rootScope.SESSION_CLI_ON = false; //atualiza variável global                        
        }          
    }

    // ATUALIZA DADOS DE SESSÃO
    //
    $rootScope.updateSession = function () {
        return isClienteLogado();
    }
    

    // LOGOUT 
    //
    $scope.authClienteLogout = function(){
        
        FB.init({
            appId: window.FBid,
            cookie: true,
            xfbml: true,
            version: 'v2.8'
        })

        ClienteAuthStore.clear();

        FB.getLoginStatus(function (response) {           

            //console.log('GET LOGIN STATUS', response);

            if (response.status === 'connected') {
                FB.logout(function (resp) {

                    console.log(resp);

                    location.reload();
                })
            }
        })
        
    }


    // $SCOPE Verifica cliente logado por cookie
    //
    $scope.isClienteLogado = function () {

        return isClienteLogado();
    }

    // FUNCTION Verifica cliente logado por cookie
    //
    function isClienteLogado(){
        
        var keypass = ClienteAuthStore.getKeypass();        

        if (keypass != null && keypass != 'undefined' && keypass != '') {
            $rootScope.SESSION_CLI_ON = true;
            $rootScope.SESSION_CLI = ClienteAuthStore.get();

            return true;
        } else {

            $rootScope.SESSION_CLI_ON = false;

            return false;
        }

        return false;
    }


    

    //---------------------------------------------------------
    //-------- SEGUIR LOJA -------------------------------
    //---------------------------------------------------------

    // Verifica se o usuário ja está seguindo a loja respectiva
    //
    $scope.checkSeguindoLoja = function (idloja) {

        $scope.seguindoFlag = 0;
        
        ClienteService.checkSeguindoLoja($rootScope.SESSION_CLI.keypass, idloja)
        .then(function (response) {

            console.log(response);

            if (response.checkseguindo === true) {
                
                $scope.seguindoFlag = 1;
                console.log("ESTOU SEGUINDO", $scope.seguindoFlag);
            } else {

                $scope.seguindoFlag = 2;                
                console.log("NÃO SEGUINDO", $scope.seguindoFlag);
            }                        
        })
        .catch(function (response) {            
            console.log(response);
            $rootScope.showToast(response);
        })        
    }

    // Segue a loja
    //
    $scope.checkinLoja = function (idloja) {

        ClienteService.checkinLoja($rootScope.SESSION_CLI.keypass, idloja)
            .then(function (response) {
                $scope.seguindoFlag = 1;            
                $rootScope.showToast(response.message);
            })
            .catch(function (response) {
                $scope.checkSeguindoLoja(idloja);
                $rootScope.showToast(response.message);
            
            })
    }

    // Deixa de seguir a loja
    //
    $scope.checkoutLoja = function (idloja) {

        ClienteService.checkoutLoja($rootScope.SESSION_CLI.keypass, idloja)
        .then(function (response) {
            $scope.seguindoFlag = 2;
            console.log(response);
            $rootScope.showToast(response.message);
        })
        .catch(function (response) {
            console.log(response);
            $rootScope.showToast(response.message);
        })

    }


    //---------------------------------------------------------
    //-------- LOGIN AUTOMÁTICO -------------------------------
    //---------------------------------------------------------
   
    // Função para abrir popUp para seguir loja, e caso não tenha conta, pedir para lojar no facebook
    //
    $scope.showLogin = function(){
                
        var continuelink = (window.location.href).replace("#", "$");

        var url = "#/login?continue=" + continuelink;        

        window.open(url, '_self');        
    }

    //
    //
    $scope.carregarLogin = function () {
                        
        $scope.verificandoIsLogin = true;

        var continuelink = $location.search().continue.replace("$", "#");

        $scope.continuelink = continuelink;


        if ($rootScope.SESSION_CLI_ON) {
            window.open(continuelink, '_self');            
        } else {
            $scope.FBclienteIsLogado();            
        }

    }

    //
    //
    $scope.redirectPageLogin = function () {
        window.open($scope.continuelink, '_self');
    }
  

    //---------------------------------------------------------
    //-------- LOJAS SEGUIDAS ---------------------------------
    //---------------------------------------------------------
    
    // Carrega lojas seguida de acordo com o usuário logado
    //
    $scope.carregarLojasSeguidas = function(){

        $scope.carregandoLojasSeguidas = true;
        $scope.listaLojas = {};

        if(isClienteLogado()){
            ClienteService.obterLojasSeguidas(ClienteAuthStore.getKeypass())
            .then(function(response)
            {
                console.log(response);
                $scope.pageLojasSeguidas = response;                
                $scope.carregandoLojasSeguidas = false;
            })
            .catch(function(response){
                console.log(response);
                $scope.carregandoLojasSeguidas = false;
            })
        }else{
             $scope.carregandoLojasSeguidas = false;
        }
        
    }


    //---------------------------------------------------------
    //-------- NOTIFICAÇÕES -----------------------------------
    //---------------------------------------------------------

    //
    //
    $scope.carregarNotificacoes = function () {

        // liga alerta de notificações
        $rootScope.turnOnNotification();

        $scope.carregandoNotificacoes = true;
        $scope.listaAtividades = {};

        var key = ClienteAuthStore.getKeypass();

        if (isClienteLogado()) {

            ClienteService.obterNotificacoes(key)
            .then(function (response) {                                                
                filtrarNotificacoes(response.notificacoes, response.ultimoCheck);
                $scope.carregandoNotificacoes = false;
            })
            .catch(function (response) {                
                $scope.carregandoNotificacoes = false;
            })

        } else {
            $scope.carregandoNotificacoes = false;
        }


        //
        //
        function filtrarNotificacoes(notificacoes, ultimaEntrada) {

            $scope.notificacoesNew = [];

            $scope.notificacoesOld = [];
                        
            var dateUltimaEntrada = new Date(ultimaEntrada);            

            for (i in notificacoes) {
                                                          
                var dateNotificacao = new Date(notificacoes[i].dataCriacao);                

                if (dateUltimaEntrada < dateNotificacao) {

                    $scope.notificacoesNew.push(notificacoes[i]);

                } else {

                    $scope.notificacoesOld.push(notificacoes[i]);
                }                
            }

        }


    }
})


