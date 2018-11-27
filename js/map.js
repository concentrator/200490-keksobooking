'use strict';

var map = document.querySelector('.map');
var mapPinsBlock = document.querySelector('.map__pins');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var adCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var PIN_WIDTH = 50;
// var PIN_HEIGHT = 70;
var MAP_WHIDTH = 1200;
var MAP_MIN_HEIGHT = 130;
var MAP_MAX_HEIGHT = 630;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;

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
  // type: ['palace', 'flat', 'house', 'bungalo'],
  checkin: ['12:00', '13:00', '14:00'],
  checkout: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

// Случайное перемешивание массива
var shuffleArray = function (a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

// Генератор случайных чисел от min до max включительно
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создаем ссылка на аватарки
var getAvatars = function () {
  var avatars = [];
  for (var i = 0; i < 8; i++) {
    avatars.push('img/avatars/user0' + (i + 1) + '.png');
  }
  return shuffleArray(avatars);
};

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

var getFeatures = function (features) {
  var propertyFeatures = [];
  shuffleArray(features);
  var featuresQuantity = getRandomIntInclusive(1, features.length);
  for (var i = 0; i < featuresQuantity; i++) {
    propertyFeatures.push(features[i]);
  }
  return propertyFeatures;
};

var getArrayIndex = function (array, index) {
  var multiplier = 0;
  if (!array[index]) {
    multiplier = Math.floor(index / array.length);
  }
  return index - array.length * multiplier;
};

// Генерируем случайные объявления
var getAds = function (data, quantity) {
  var ads = [];

  data.avatar = getAvatars(); // Добавляем аватарки в объект с данными

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

    // Генерируем координаты с учетом ширины и высоты маркера
    var x = getRandomIntInclusive(0, MAP_WHIDTH - PIN_WIDTH);
    var y = getRandomIntInclusive(MAP_MIN_HEIGHT, MAP_MAX_HEIGHT);
    var price = getRandomIntInclusive(PRICE_MIN, PRICE_MAX); // Генерируем цену
    var rooms = getRandomIntInclusive(ROOMS_MIN, ROOMS_MAX); // Генерируем кол-во комнат
    var guests = rooms * getRandomIntInclusive(1, 3); // Генерируем кол-во гостей
    var photos = data.photos.slice(0); // Клонируем массив с фотками

    // Пишем данные в объект
    ad.author.avatar = data.avatar[getArrayIndex(data.avatar, j)];
    ad.offer.title = data.title[getArrayIndex(data.title, j)];
    ad.offer.address = x + ', ' + y;
    ad.offer.price = price;
    ad.offer.type = getPropertyType(ad.offer.title);
    ad.offer.rooms = rooms;
    ad.offer.guests = guests;
    ad.offer.checkin = data.checkin[getRandomIntInclusive(0, data.checkin.length - 1)];
    ad.offer.checkout = data.checkout[getRandomIntInclusive(0, data.checkout.length - 1)];
    ad.offer.features = getFeatures(data.features);
    ad.offer.photos = shuffleArray(photos);
    ad.location.x = x;
    ad.location.y = y;

    ads.push(ad);
  }
  // console.log(ads);
  return ads;
};

var renderMapPin = function (ad) {
  // Создаем элемент метки
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + ad.location.x + 'px; top: ' + ad.location.y + 'px;';
  var pinImage = pinElement.querySelector('img');
  pinImage.src = ad.author.avatar;
  pinImage.alt = ad.offer.title;
  return pinElement;
};

var renderAdCard = function (ad) {
  var cardElement = adCardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = ad.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  var propertyType = '';
  if (ad.offer.type === 'flat') {
    propertyType = 'Квартира';
  } else if (ad.offer.type === 'bungalo') {
    propertyType = 'Бунгало';
  } else if (ad.offer.type === 'house') {
    propertyType = 'Дом';
  } else if (ad.offer.type === 'palace') {
    propertyType = 'Дворец';
  }
  cardElement.querySelector('.popup__type').textContent = propertyType;
  cardElement.querySelector('.popup__text--capacity')
  .textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time')
  .textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  var cardElementFeatures = cardElement.querySelector('.popup__features');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ad.offer.features.length; i++) {
    var itemFeature = ad.offer.features[i].toLowerCase();
    fragment.appendChild(cardElement.querySelector('.popup__features .popup__feature--' + itemFeature));
  }
  cardElementFeatures.innerHTML = '';
  cardElementFeatures.appendChild(fragment);

  cardElement.querySelector('.popup__description').textContent = ad.offer.description;
  var cardElementPhotosBlock = cardElement.querySelector('.popup__photos');
  var cardElementPhoto = cardElementPhotosBlock.querySelector('img');
  cardElementPhotosBlock.removeChild(cardElementPhoto);
  for (var j = 0; j < ad.offer.photos.length; j++) {
    var itemPhotoSrc = ad.offer.photos[j];
    var photo = cardElementPhoto.cloneNode(true);
    photo.src = itemPhotoSrc;
    fragment.appendChild(photo);
  }
  cardElementPhotosBlock.appendChild(fragment);
  cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
  return cardElement;
};

var printMapPins = function (adsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adsArray.length; i++) {
    fragment.appendChild(renderMapPin(adsArray[i]));
  }
  mapPinsBlock.appendChild(fragment);
};

var randomAds = getAds(sampleData, 8);

map.classList.remove('map--faded');

printMapPins(randomAds);

map.insertBefore(renderAdCard(randomAds[0]), mapFiltersContainer);
