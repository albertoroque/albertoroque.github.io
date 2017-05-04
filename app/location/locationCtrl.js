
angular.module('proj.location', [])

.controller('LocationCtrl', function ($scope, $rootScope, $location, $mdDialog, LocationService) {        
  
    //-----------------------------------
    //  GEODECODER
    //-----------------------------------


    $rootScope.updateLocation = function () {
                        
        $mdDialog.show({
            controller: 'LocationCtrl',
            templateUrl: 'app/location/partials/locationDialog.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            preserveScope: true,            
            clickOutsideToClose: false
        })
        .then(function () {

        });
        
    }

    $scope.getPermissionLocation = function() {
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getLatLong, showError);
            $scope.location = {};            
        } else {
            $scope.localizationDialogPage = 4;            
        }
    }

    function getLatLong(position) {
        var latlong = position.coords.latitude + ',' + position.coords.longitude;
        //console.warn(latlong);
        LocationService.decodeGoogleMapsAPI(latlong)
        .then(function (data) {
           

            if (data.status == "OK") {
                if (data.results[0]) {
                    console.log(data.results[0]);

                    $scope.location.cidade = extractFromAddress(data.results[0].address_components, "locality", null);
                    $scope.location.bairro = extractFromAddress(data.results[0].address_components, "sublocality_level_1", null);
                    $scope.location.estado = extractFromAddress(data.results[0].address_components, "administrative_area_level_1", "short_name");
                    $scope.location.pais = extractFromAddress(data.results[0].address_components, "country", null);
                    
                    $scope.localizationDialogPage = 3;
                }
            } else {

                $scope.localizationDialogPage = 4;
                console.log("ERRO: Geocode was not successful for the following reason: " + data.status);
            }
        })

        .catch(function (err) {
            $scope.localizationDialogPage = 4;
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


    //$scope.confirmaLocalizaoDialog = function () {

    //    $mdDialog.show({
    //        controller: 'HomeCtrl',
    //        templateUrl: 'app/home/partials/confirmaLocalizacaoDialog.tpl.html',
    //        parent: angular.element(document.body),
    //        scope: $scope,
    //        preserveScope: true,
    //        clickOutsideToClose: false
    //    })
    //    .then(function () { }, function () { });
    //};

})