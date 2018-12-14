'use strict';

(function () {

  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;

  // Тестовые данные для объявлений
  var sampleData = {
    title: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],
    checkin: ['12:00', '13:00', '14:00'],
    checkout: ['12:00', '13:00', '14:00'],
    features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    photos: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ]
  };

  // Типы жилья
  var AccomodationType = {
    BUNGALO: {
      title: 'Бунгало',
      minPrice: 0
    },
    FLAT: {
      title: 'Квартира',
      minPrice: 1000
    },
    HOUSE: {
      title: 'Дом',
      minPrice: 5000
    },
    PALACE: {
      title: 'Дворец',
      minPrice: 10000
    }
  };

  // Создает ссылки на аватарки
  var getAvatars = function () {
    var avatars = [];
    for (var i = 0; i < 8; i++) {
      avatars.push('img/avatars/user0' + (i + 1) + '.png');
    }
    return window.util.shuffleArray(avatars);
  };

  // Присваивает тип жилья в соответствии с названием объявления (для случайных данных)
  var getPropertyType = function (title) {
    var propertyType = '';
    if (title.toLowerCase().includes('квартир')) {
      propertyType = 'flat';
    } else if (title.toLowerCase().includes('дворец')) {
      propertyType = 'palace';
    } else if (title.toLowerCase().includes('бунгал')) {
      propertyType = 'bungalo';
    } else {
      propertyType = 'house';
    }
    return propertyType;
  };

  // Генератор случайного массива параметров жилья
  var getFeatures = function (features) {
    var propertyFeatures = [];
    window.util.shuffleArray(features);
    var featuresQuantity = window.util.getRandomIntInclusive(1, features.length);
    for (var i = 0; i < featuresQuantity; i++) {
      propertyFeatures.push(features[i]);
    }
    return propertyFeatures;
  };

  // Генерирует случайные объявления
  var getAds = function (data, quantity) {
    var ads = []; // Создаем пустой массив для объявлений
    data.avatar = getAvatars(); // Добавляем аватарки в объект с данными
    // Цикл для генерации заданного количества объявлений
    for (var j = 0; j < quantity; j++) {
      // Создаем объект объявления
      var ad = {
        author: {
          avatar: ''
        },
        offer: {
          title: '',
          address: '',
          price: '',
          type: '',
          rooms: 0,
          guests: 0,
          checkin: '',
          checkout: '',
          features: '',
          description: '',
          photos: ''
        },
        location: {
          x: 0,
          y: 0
        }
      };

      // Генерируем координаты
      var x = window.util.getRandomIntInclusive(0, window.map.MAP_WIDTH);
      var y = window.util.getRandomIntInclusive(window.map.MAP_MIN_HEIGHT, window.map.MAP_MAX_HEIGHT);
      var price = window.util.getRandomIntInclusive(PRICE_MIN, PRICE_MAX); // Генерируем цену
      var rooms = window.util.getRandomIntInclusive(ROOMS_MIN, ROOMS_MAX); // Генерируем кол-во комнат
      var checkinTime = data.checkin[window.util.getRandomIntInclusive(0, data.checkin.length - 1)]; // Получаем случайных чекин
      var guests = window.util.getRandomIntInclusive(1, rooms); // Генерируем кол-во гостей
      var photos = data.photos.slice(0); // Клонируем массив с фотками

      // Пишем данные в объект
      ad.author.avatar = data.avatar[window.util.getArrayIndex(data.avatar, j)];
      ad.offer.title = data.title[window.util.getArrayIndex(data.title, j)];
      ad.offer.address = x + ', ' + y;
      ad.offer.price = price;
      ad.offer.type = getPropertyType(ad.offer.title);
      ad.offer.rooms = rooms;
      ad.offer.guests = guests;
      ad.offer.checkin = checkinTime;
      ad.offer.checkout = checkinTime; // Чекаут соответствует чекикну
      ad.offer.features = getFeatures(data.features);
      ad.offer.photos = window.util.shuffleArray(photos);
      ad.location.x = x;
      ad.location.y = y;

      ads.push(ad);
    }
    return ads;
  };

  window.data = {
    sampleData: sampleData,
    AccomodationType: AccomodationType,
    getAds: getAds
  };

})();
