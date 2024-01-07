var x = document.getElementById("your_location");
function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  };
  
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
};

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude, longitude);
    x.innerHTML = "Ваши координаты:" + "<br>Широта:" + position.coords.latitude + "<br>Долгота:" + position.coords.longitude;
    
};
// Дождёмся загрузки API и готовности DOM.
getLocation();
var myMap;
navigator.geolocation.getCurrentPosition(function(position) {
    // Создаем карту и указываем текущие координаты в качестве центра
    var map = new ymaps.Map("map", {
        center: [position.coords.latitude, position.coords.longitude],
        zoom: 15,
        controls: ['searchControl', 'routePanelControl', 'default']
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Создаем метку с текущим местоположением пользователя
    var placemark = new ymaps.Placemark([position.coords.latitude, position.coords.longitude], {
        hintContent: 'Ваше местоположение',
        balloonContent: 'Вы находитесь здесь'
    });

    // Добавляем метку на карту
    map.geoObjects.add(placemark);
    

        // Создаем экземпляр класса ymaps.control.SearchControl
        mySearchControl = new ymaps.control.SearchControl({
          options: {
              noPlacemark: true
          }
      }),
  // Результаты поиска будем помещать в коллекцию.
      mySearchResults = new ymaps.GeoObjectCollection(null, {
          hintContentLayout: ymaps.templateLayoutFactory.createClass('$[properties.name]')
      });
  myMap.controls.add(mySearchControl);
  myMap.geoObjects.add(mySearchResults);
  // При клике по найденному объекту метка становится красной.
  mySearchResults.events.add('click', function (e) {
      e.get('target').options.set('preset', 'islands#redIcon');
  });
  // Выбранный результат помещаем в коллекцию.
  mySearchControl.events.add('resultselect', function (e) {
      var index = e.get('index');
      mySearchControl.getResult(index).then(function (res) {
         mySearchResults.add(res);
      });
  }).add('submit', function () {
          mySearchResults.removeAll();
      })
    
    document.getElementById('destroyButton').onclick = function () {
      // Для уничтожения используется метод destroy.
      myMap.destroy()
      };
;})

