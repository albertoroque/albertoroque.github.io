
angular.module('proj.image', [])

.controller('ImageCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, $log, $q) {


    var btn, inputFile, processMsg, urlPreview, fileUploaderUrl, token, presentationDefinitionContent, card, maxWidth, maxSize, pathIMAGE;

    $rootScope.initiateFileUpload = function (event) {

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
                    resizeImage(imageToUp, $scope);
                } else {
                    uploadImage(imageToUp, $scope);
                }

                //uploadImage(imageToUp, $scope);
            }
        })

        inputFile.click();
    }


    function resizeImage(imageToUp, $scope) {
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

            uploadImage(fileBlob, $scope);

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

    function uploadImage(imageToUp, $scope) {

        //FORM DATA
        var data = new FormData();
        data.append("file", imageToUp);

        var urlUpload = fileUploaderUrl + "?token=" + token;

        //ImageService.carregarImagem(data, fileUploaderUrl)
        //.then(function (data) {
        //    console.log('Imagem on Static', data);            
        //    $scope.IMAGE_PATH = data;
        //})

        //.catch(function (erro) {
        //    console.warn('IMAGE ENGINE', erro);
        //})

        $.ajax({
            type: "POST",
            url: urlUpload,
            contentType: false,
            processData: false,
            cache: false,
            data: data, //IMAGEM RENDERIZADA
            xhr: function () {
                //Código baseado em http://stackoverflow.com/questions/15410265/file-upload-progress-bar-with-jquery
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        console.log(percentComplete);
                        $scope.IMAGE_MSG = percentComplete + '% concluído';
                        $scope.$apply();
                        if (percentComplete === 100) {

                        }
                    }
                }, false);

                return xhr;
            },
            success: function (messages) {
                var str_filename = "";
                for (i = 0; i < messages.length; i++) {
                    str_filename = messages[i].Path;
                }
                $scope.IMAGE_PATH = str_filename;
                $scope.$apply();
                console.log($scope.IMAGE_PATH);
            },

            complete: function () {
                $scope.IMAGE_MSG = 'Concluído';
                $scope.$apply();
            },
            error: function (jqXHR, textStatus, err) {
                console.log('ERRO', err);
            }
        })
    }
})
