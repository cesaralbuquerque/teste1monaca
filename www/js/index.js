var app = {

    getCameraTakePicture: function(){
        
        navigator.camera.getPicture(onSuccess, app.onFail, {  
          quality: 100, 
          destinationType: Camera.DestinationType.DATA_URL,
          targetWidth: 800,
          correctOrientation: true, 
          saveToPhotoAlbum: true
        });  
        
        function onSuccess(imageData) { 
          var image = document.getElementById('myImage'); 
          image.src = "data:image/jpeg;base64," + imageData; 
        }  
    },
    
    getGeolocation: function(){
        
        navigator.geolocation.getCurrentPosition(onSuccess, app.onFail, { enableHighAccuracy: true });

       
       function onSuccess(position) { 
          var location = document.getElementById('pLocation'); 
          pLocation.innerHTML = 'Latitude: ' + position.coords.latitude  + '<br>Longitude: ' + position.coords.longitude ; 
          getWeather(position.coords.latitude, position.coords.longitude);
       }  
       
       function getWeather(latitude, longitude) {
        // Get a free key at http://openweathermap.org/. Replace the "Your_Key_Here" string with that key.
            var OpenWeatherAppKey = "9df79a93df0729512c35887e0f75931e";
        
            var queryString =
              'http://api.openweathermap.org/data/2.5/weather?lat='
              + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=metric&lang=pt';
        
            $.getJSON(queryString, function (results) {
        
                if (results.weather.length) {
                    
                    weather = results;
                    var fullWeatherInfo;
                    fullWeatherInfo = 'Cidade: '+ results.name;
                    fullWeatherInfo += '<br>Temperatura: ' + results.main.temp;
                    fullWeatherInfo += '<br>Velocidade do vento: ' + results.wind.speed;
                    fullWeatherInfo += '<br>Umidade do ar: ' + results.main.humidity;
                    fullWeatherInfo += '<br>Previsão: ' + results.weather[0].description;
                    
                    var sunriseDate = new Date(results.sys.sunrise);
                    var sunsetDate = new Date(results.sys.sunset);
                    fullWeatherInfo += '<br>Nascer do sol: ' + sunriseDate.toLocaleTimeString() + 'AM';
                    fullWeatherInfo += '<br>Por do sol: ' + sunsetDate.toLocaleTimeString() + 'PM';
                    
                    ons.notification.toast({message: fullWeatherInfo, timeout: 10000});
                }
            }).fail(function (err) {
                app.onFail(err);
            });
       }
       
    },
    
    getAudioRecord: function(){
        navigator.device.capture.captureAudio(onSuccess, app.onFail, {limit:1});
        
        function onSuccess(mediaFiles) {
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                file = mediaFiles[i].localURL;
            }
        }
    },
    
    playAudio: function(){        
        var media = new Media(file, function(e){
            media.release();
        });
        media.play();
         
    },
    
    saveWeather: function(){
        var weatherResult = monaca.cloud.Collection("Weather");
        var friendUserOid = "x00000000-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
        var permission = {};
        permission[friendUserOid] = "r";
    
        weatherResult.insert({'resultado':weather}, permission)
        .done(function(result)
        {
           ons.notification.toast({message: 'registro salvo', timeout: 2000});
           
            $.ajax
            ({
                type: "GET",
                url: "http://desenv.benner.com.br/siscon/api/teste/1",
                dataType: 'text',
                async: false,
                data: "teste",
                success: function (){
                   alert('Thanks for your comment!');
                }
            });
        })
        .fail(function(err)
        {
           app.onFail(err);
        });
        
    },
    
    onFail: function(message){
        alert('Failed because: ' + message);
    },

    init: function(){
        document.getElementById('cameraTakePicture').addEventListener('click', this.getCameraTakePicture, false);
        document.getElementById('getGeolocation').addEventListener('click', this.getGeolocation, false);
        document.getElementById('audioRecord').addEventListener('click', this.getAudioRecord, false);
        document.getElementById('audioPlay').addEventListener('click', this.playAudio, false);
        document.getElementById('save').addEventListener('click', this.saveWeather, false);
    }
    
};

document.addEventListener('deviceready', function(){    
    app.init();
    var file, weather;
}, false);
