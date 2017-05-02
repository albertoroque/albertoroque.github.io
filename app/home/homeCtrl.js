angular.module('proj.home', [])

.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            controller: 'HomeCtrl',
            templateUrl: 'app/home/partials/home.tpl.html'
        });
})


.controller('HomeCtrl', function ($scope, $rootScope, $location, $mdDialog, HomeService) {
           
    $scope.carregaHome = function(){

    
    }


    $scope.testarAuth = function () {

        $scope.keypassView = "";

        var keypass = "ASDASDASDASD";

        HomeService.TestarAuth(keypass)

            .then(function (data) {

                console.log(data);

                $scope.keypassView = data;
            })
            .catch(function () {

            })
        

    }


    //-----------------------------------------
    //  SLIDER
    //-----------------------------------------

    $scope.loadSlider = function (firstImage) {        
        $scope.sliderImage = firstImage;
        $scope.sliderIndex = 1;

        var sliderGroupBtn = '.slider-control-btn';

        var sliderIndexTotal = $(sliderGroupBtn).length;

        $($(sliderGroupBtn)[0]).css("background-color", "#444");


        // CHANGE ON CONTROLE
        $scope.sliderChange = function (event, indexBtn) {            
            $(sliderGroupBtn).css("background-color", "rgba(84, 84, 84, 0.6)");
            $scope.sliderImage = event.target.attributes.dataimage.value;                        
            $(event.target).css("background-color", "#444");
            $scope.sliderIndex = indexBtn;

            console.log($scope.sliderIndex);
        }

        // CHANGE ON CONTROLE
        $scope.nextSlide = function () {
            $scope.sliderIndex++;
            if (sliderIndexTotal < $scope.sliderIndex) {
                $scope.sliderIndex = 1;
            }                        
            changeSliderByIndex($scope.sliderIndex);
        }

        $scope.prevSlide = function () {
            $scope.sliderIndex--;


            if ($scope.sliderIndex < 1) {
                $scope.sliderIndex = sliderIndexTotal;
            }

            console.log($scope.sliderIndex);

            changeSliderByIndex($scope.sliderIndex);
        }

        function changeSliderByIndex(index) {
            var classNextBtn = ".slideIndex" + index;
            $(sliderGroupBtn).css("background-color", "rgba(84, 84, 84, 0.6)");
            $scope.sliderImage = $(classNextBtn).attr("dataimage");
            $(classNextBtn).css("background-color", "#444");

        }
    }

    //-----------------------------------
    //  GEODECODER
    //-----------------------------------


    $scope.getLocation = function () {
        
        $rootScope.toast("Procurando sua localização...");

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(getLatLong, showError);

            $scope.location = {};
            
        } else {
            $scope.location = "Seu browser não suporta Geolocalização.";
        }       
    }

    function getLatLong(position) {                

        var latlong = position.coords.latitude + ',' + position.coords.longitude;

        console.warn(latlong);

        HomeService.decodeGoogleMapsAPI(latlong)
        .then(function (data) {

            console.log(data);

            if (data.status == "OK") {
                if (data.results[0]) {

                    $scope.location.cidade = extractFromAddress(data.results[0].address_components, "locality");
                    $scope.location.bairro = extractFromAddress(data.results[0].address_components, "sublocality_level_1");
                    $scope.location.estado = extractFromAddress(data.results[0].address_components, "administrative_area_level_1");
                    $scope.location.pais = extractFromAddress(data.results[0].address_components, "country");

                    $scope.confirmaLocalizaoDialog();
                }
            } else {
                alert("Geocode was not successful for the following reason: " + data.status);
            }
        })

        .catch(function (err) {
            console.warn("ERRO GEOLOCATION");
        })
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Usuário rejeitou a solicitação de Geolocalização.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Localização indisponível.");
                break;
            case error.TIMEOUT:
                alert("O tempo da requisição expirou.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Algum erro desconhecido aconteceu.");
                break;
        }
    }

    //Extrai determinada parte do endereço completo.
    function extractFromAddress(components, type) {
        for (var i = 0; i < components.length; i++)
            for (var j = 0; j < components[i].types.length; j++)
                if (components[i].types[j] == type) return components[i].long_name;
        return "";
    }


    $scope.confirmaLocalizaoDialog = function () {
        
        $mdDialog.show({
            controller: 'HomeCtrl',
            templateUrl: 'app/home/partials/confirmaLocalizacaoDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,           
            clickOutsideToClose: false
        })
        .then(function () { }, function () { });
    };

    


   
});