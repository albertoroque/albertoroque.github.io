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
        
        console.log(google);
        
        var geocoder = new google.maps.Geocoder;
    
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

    
    

    //Extrai determinada parte do endereço completo.
    function extractFromAddress(components, type) {
        for (var i = 0; i < components.length; i++)
            for (var j = 0; j < components[i].types.length; j++)
                if (components[i].types[j] == type) return components[i].long_name;
        return "";
    }
    
    $scope.getLocation = function(){
        
        var geocoder = new google.maps.Geocoder;
        
        if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(showPosition, showError);
        }
        else { $scope.locationDecoded = "Seu browser não suporta Geolocalização."; }
    }

    //Mostra as coordenadas - lat/lon e mostra o bairro + cidade.
    function showPosition(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) 
            {
                if (results[0]) 
                {

                	console.log(results[0]);
                    var cidade = extractFromAddress(results[0].address_components, "locality");
                    var bairro = extractFromAddress(results[0].address_components, "sublocality_level_1");
                    var est = extractFromAddress(results[0].address_components, "administrative_area_level_1");
                    var pais = extractFromAddress(results[0].address_components, "country");

                    console.log(cidade, bairro);                    

                    //x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
                    $scope.locationDecoded = "Bairro: " + bairro + "<br> Cidade: " + cidade + "<br> Estado e Pais: "+ est + " - " + pais	;
                }
            } 
            else 
            {
            	alert("Geocode was not successful for the following reason: " + status)
            }
        });
    }

    //Mostra erro, caso não seja possível utilizar a API, por N motivos.
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

   
});
