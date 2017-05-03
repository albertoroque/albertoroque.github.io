angular.module('Proj', [
  	'ngRoute',
    'ngMaterial',
    'ngCookies',
    'ngAnimate',
    'ngMessages',
    'proj.home',
    'proj.loja',
    'proj.buscar',
    'proj.erro',
    'proj.admloja'
])

//-------- LOAGIN INICIAL ---------
//---------------------------------
.directive("mAppLoading", ['$animate',
    function ($animate) {
        return ({
            link: link,
            restrict: "C"
        });
        function link(scope, element, attributes) {
            $(element).fadeOut(1000);
        }
    }
])

//-------- CONFIG TEMA--------------
//---------------------------------
.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('indigo');

})

//---- REDIRECT INICIAL ------------
//-----------------------------------
.config([
  '$routeProvider', '$httpProvider',
  function ($routeProvider, $httpProvider) {

      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];

      $routeProvider
        .when('/', {
            redirectTo: '/home'
        })
        .otherwise({
            redirectTo: '/erro/404'
        });

  }
])


.controller('CatalokoCtrl', function ($scope, $rootScope, $mdToast, $mdMedia, $location, $mdDialog, HomeService) {


    //----CONTROLE TOPO PÁGINA----------
    //-----------------------------------
    $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
        $(".conteudo-principal").animate({ scrollTop: 0 }, 200);
    });

    $rootScope.$mdMedia = $mdMedia;

    //------ VOLTAR PÁGINA---------------
    //-----------------------------------
    $rootScope.voltarPagina = function () {
        window.history.back();
    }


    //------VER PÁGINA DO PRODUTO ------
    //-----------------------------------
    $scope.verLoja = function () {
        window.open('#/loja', '_self');
    }

    //------VER PÁGINA DO PRODUTO ------
    //-----------------------------------
    $scope.verProduto = function () {
        window.open('#/produto', '_self');
    }


    //--------ABRIR MENU-----------------
    $scope.openMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    //-------- ESCONDE DIALOG -------
    $scope.hideDialog = function () {
        $mdDialog.hide();
    }

    //------------------------------------
    //OPEN APP PAGE
    //
    $rootScope.openPageApp = function (app) {

        var facebook_appAndroid = "fb://page/1630215507273478";
        var facebook_appiOS = "fb://profile/1630215507273478";
        var facebook_url = "https://facebook.com/LAworldsports";
        var instagram_url = "http://instagram.com/_u/l.aworldsports/";
        var instagram_app = "instagram://user?username=l.aworldsports";
        var messenger_ = "http://m.me/LAworldsports";

        var os = {
            android: navigator.userAgent.match(/Android/i),
            ios: navigator.userAgent.match(/iPhone|iPad|iPod/i)
        };

        //mobile
        if (os.android || os.ios) {
            if (app == 'instagram') {
                window.open(instagram_app);
            }
            if (app == 'fb') {
                if (os.ios) {
                    window.open(facebook_appiOS);
                }
                if (os.android) {
                    window.open(facebook_appAndroid);
                }
            }
            if (app == 'messenger') {
                window.open(messenger_, "_blank");
            }
            //desktop               
        } else {
            if (app == 'instagram') {
                window.open(instagram_url);
            }
            if (app == 'fb') {
                window.open(facebook_url);
            }
            if (app == 'messenger') {
                window.open(messenger_, "_blank");
            }
        }

    }

    //------------------
    //TOAST
    //
    $rootScope.toast = function (conteudo) {
        var position = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        $mdToast.show(
        $mdToast.simple()
            .content(conteudo)
            .position(position)
            .hideDelay(3000)
        );
    };

    //-------------------------
    // CARREGA NOTÍCIA NA MODAL OU ABRE LINK
    //


    //
    // CAPTURA O ANO CORRENTE DO SERVIDOR E APRESENTA NO RODAPÉ
    //
    $scope.currentYear = (new Date).getFullYear();

})

.controller('MenuCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, $log) {


    $scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }

})



.controller('ImageCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, $log, ImageService) {


    var btn, inputFile, processMsg, urlPreview, fileUploaderUrl, token, presentationDefinitionContent, card, maxWidth, maxSize, pathIMAGE;

    //
    //
    //
    $rootScope.initiateFileUpload = function(event) {
                                               
        btn = $("#" + event.currentTarget.id);        

        inputFile = $(btn.val());               
        fileUploaderUrl = btn.attr("data-file-uploader-url");
        token = btn.attr("data-token");

        //console.log(inputFile, fileUploaderUrl, token);
                
        maxWidth = 1280; //px
        maxSize = 200000; // +- 200kb

        inputFile.change(function (evt) {
            evt.preventDefault();
            
            var files = $(this).get(0).files;

            if (files.length > 0) {

                var imageToUp = files[0];

                imageToUp.virtualPath = URL.createObjectURL(evt.target.files[0]);

                if (imageToUp.size > maxSize) {
                    resizeImage(imageToUp);
                } else {
                   pathIMAGE = uploadImage(imageToUp);
                }
                
                $scope.IMAGE_PATH = pathIMAGE;                
            }            
        })

        inputFile.click();
    }


    function resizeImage(imageToUp) {
        img = new Image();

        img.src = imageToUp.virtualPath;
        
        img.onload = function () {

            var canvas = document.createElement('canvas');
            var engCtx = canvas.getContext('2d');

            var size = 0;
            var i = 1;

            do {
                var basewidth = maxWidth / i;

                //guarda proporção da altura em relação a largura/1280
                var heightProp = ($(img)[0].height / ($(img)[0].width / basewidth));

                canvas.width = basewidth;
                canvas.height = heightProp;

                engCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

                var imgBase64 = canvas.toDataURL('image/jpeg');

                var fileBlob = dataURItoBlob(imgBase64);

                var size = fileBlob.size;

                i++;
            }
            while (size > maxSize)
            
            uploadImage(fileBlob);
            
        }
    }

    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    function uploadImage(imageToUp) {

        $scope.IMAGE_MSG = "Carregando..";

        //FORM DATA
        var data = new FormData();
        data.append("file", imageToUp);
              
        fileUploaderUrl = fileUploaderUrl + "?token=" + token;        
        
        ImageService.carregarImagem(data, fileUploaderUrl)
        .then(function (data) {
            console.log('STATIC PATH', data);
            $scope.IMAGE_MSG = "";
            $scope.IMAGE_PATH = data;
        })

        .catch(function (erro) {
            console.warn('IMAGE ENGINE', erro);
        })       
    }
})


.service('ImageService', function ($http, $q) {
    return {

        carregarImagem: function (data, urlUpload) {

            var d = $q.defer();

            //AJAX UP IMG
            $.ajax({
                type: "POST",
                url: urlUpload,
                contentType: false,
                processData: false,
                cache: false,
                data: data, //imagem renderizada
                success: function (messages) {

                    var str_filename = "";

                    for (i = 0; i < messages.length; i++) {
                        str_filename = messages[i].Path;
                    }

                    d.resolve(str_filename);
                },

                error: function (jqXHR, textStatus, err) {
                    d.reject(err);
                }
            });            

            return d.promise;
        }

    }
})





 
