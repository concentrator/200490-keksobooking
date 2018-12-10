'use strict';

var map = document.querySelector('.map');
var isMapActive = false;
var mainPin = document.querySelector('.map__pin--main');
var mapPinsBlock = document.querySelector('.map__pins');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var adForm = document.querySelector('.ad-form');
var addressInput = adForm.querySelector('#address');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var adCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAP_WIDTH = 1200;
var MAP_MIN_HEIGHT = 130;
var MAP_MAX_HEIGHT = 630;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var ESC_KEYCODE = 27;

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

// Создает ссылки на аватарки
var getAvatars = function () {
  var avatars = [];
  for (var i = 0; i < 8; i++) {
    avatars.push('img/avatars/user0' + (i + 1) + '.png');
  }
  return shuffleArray(avatars);
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
  shuffleArray(features);
  var featuresQuantity = getRandomIntInclusive(1, features.length);
  for (var i = 0; i < featuresQuantity; i++) {
    propertyFeatures.push(features[i]);
  }
  return propertyFeatures;
};

// Возвращает индекс массива в начало, если элементы в массиве закончились, а перебор продолжается
// (для случайных данных)
var getArrayIndex = function (array, index) {
  var multiplier = 0;
  if (!array[index]) {
    multiplier = Math.floor(index / array.length);
  }
  return index - array.length * multiplier;
};

// Генерируем случайные объявления
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
    var x = getRandomIntInclusive(0, MAP_WIDTH);
    var y = getRandomIntInclusive(MAP_MIN_HEIGHT, MAP_MAX_HEIGHT);
    var price = getRandomIntInclusive(PRICE_MIN, PRICE_MAX); // Генерируем цену
    var rooms = getRandomIntInclusive(ROOMS_MIN, ROOMS_MAX); // Генерируем кол-во комнат
    var checkinTime = data.checkin[getRandomIntInclusive(0, data.checkin.length - 1)]; // Получаем случайных чекин
    var guests = getRandomIntInclusive(1, rooms); // Генерируем кол-во гостей
    var photos = data.photos.slice(0); // Клонируем массив с фотками

    // Пишем данные в объект
    ad.author.avatar = data.avatar[getArrayIndex(data.avatar, j)];
    ad.offer.title = data.title[getArrayIndex(data.title, j)];
    ad.offer.address = x + ', ' + y;
    ad.offer.price = price;
    ad.offer.type = getPropertyType(ad.offer.title);
    ad.offer.rooms = rooms;
    ad.offer.guests = guests;
    ad.offer.checkin = checkinTime;
    ad.offer.checkout = checkinTime; // Чекаут соответствует чекикну
    ad.offer.features = getFeatures(data.features);
    ad.offer.photos = shuffleArray(photos);
    ad.location.x = x;
    ad.location.y = y;

    ads.push(ad);
  }
  return ads;
};

var renderMapPin = function (ad) {
  // Создаем элемент метки
  var pinElement = mapPinTemplate.cloneNode(true);
  // Координаты метки вставляем с поправкой на размеры элемента
  pinElement.style = 'left: ' + (ad.location.x - PIN_WIDTH / 2) + 'px; top: ' + (ad.location.y - PIN_HEIGHT) + 'px;';
  var pinImage = pinElement.querySelector('img');
  pinImage.src = ad.author.avatar;
  pinImage.alt = ad.offer.title;
  return pinElement;
};

var renderAdCard = function (ad) {
  // Генератор карточки объявления
  var cardElement = adCardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = ad.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  // Тип жилья ставим в соответствии с объектом AccomodationType
  var propertyType = AccomodationType[ad.offer.type.toUpperCase()].title;
  cardElement.querySelector('.popup__type').textContent = propertyType;
  cardElement.querySelector('.popup__text--capacity')
  .textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time')
  .textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  var cardElementFeatures = cardElement.querySelector('.popup__features');
  // Добавляем параметры жилья в цикле
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ad.offer.features.length; i++) {
    var itemFeature = ad.offer.features[i].toLowerCase();
    fragment.appendChild(cardElement.querySelector('.popup__features .popup__feature--' + itemFeature));
  }
  cardElementFeatures.innerHTML = '';
  cardElementFeatures.appendChild(fragment);
  cardElement.querySelector('.popup__description').textContent = ad.offer.description;
  var cardElementPhotosBlock = cardElement.querySelector('.popup__photos');
  // Удаляем пустую фотку
  var cardElementPhoto = cardElementPhotosBlock.querySelector('img');
  cardElementPhoto.remove();
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

// Рисуем метки на карте из массива объявлений
var printMapPins = function (adsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adsArray.length; i++) {
    fragment.appendChild(renderMapPin(adsArray[i]));
  }
  mapPinsBlock.appendChild(fragment);
};

// Удаляет атрибут disabled у коллекции элементов
var removeDisabledAttr = function (nodes) {
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].removeAttribute('disabled');
  }
};

// Определяет размеры элемента
var getElementDimensions = function (element) {
  var dimensions = {
    width: element.clientWidth,
    height: element.clientHeight
  };
  return dimensions;
};

// Определяет координаты метки
var getPinlLocation = function (pin) {
  var pinDimensions = getElementDimensions(pin);
  var pinOffset = {
    x: pin.offsetLeft,
    y: pin.offsetTop
  };
  var location = {
    x: pinOffset.x + Math.floor(pinDimensions.width / 2),
    y: pinOffset.y + Math.floor(pinDimensions.height)
  };
  if (!isMapActive && pin === mainPin) {
    location.y = pinOffset.y + Math.floor(pinDimensions.height / 2);
  }
  return location;
};

// Активирует карту
var activateMap = function () {
  var filterSelectInputs = mapFiltersContainer.querySelectorAll('select');
  var filterFieldsets = mapFiltersContainer.querySelectorAll('fieldset');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  map.classList.remove('map--faded');
  removeDisabledAttr(filterSelectInputs);
  adForm.classList.remove('ad-form--disabled');
  removeDisabledAttr(filterFieldsets);
  removeDisabledAttr(adFormFieldsets);
  isMapActive = true;
};

// Устанавливает координаты метки в поле адреса
var setLocationByPin = function (pin) {
  var location = getPinlLocation(pin);
  addressInput.value = location.x + ', ' + location.y;
};

// Закрывает карточку объявления
var closeMapCard = function () {
  var mapCard = map.querySelector('.map__card');
  var activePin = map.querySelector('.map__pin--active');
  mapCard.remove();
  activePin.classList.remove('map__pin--active');
  document.removeEventListener('keydown', documentKeydownHandler);
};

var documentKeydownHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeMapCard();
  }
};

// Устанавливает обработчик клика по метке
var setPinClickHandler = function (pin, ad) {
  pin.addEventListener('click', function () {
    var mapCard = map.querySelector('.map__card');
    var activePin = map.querySelector('.map__pin--active');
    // Выполняется при клике по НЕактивной метке
    if (!pin.classList.contains('map__pin--active')) {
      if (mapCard) {
        // Если другая карточка уже открыта - удаляем ее
        mapCard.remove();
        activePin.classList.remove('map__pin--active');
      }
      mapCard = map.insertBefore(renderAdCard(ad), mapFiltersContainer);
      var closeButton = mapCard.querySelector('.popup__close');
      closeButton.addEventListener('click', closeMapCard);
      document.addEventListener('keydown', documentKeydownHandler);
      pin.classList.add('map__pin--active');
    }
  });
};

var addFormValidator = function () {
  var priceInput = adForm.querySelector('#price');
  var typeSelect = adForm.querySelector('#type');
  var checkInSelect = adForm.querySelector('#timein');
  var checkOutSelect = adForm.querySelector('#timeout');
  var roomSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  // Устанавливает цену в соответствии с типом жилья
  typeSelect.addEventListener('input', function (evt) {
    var type = evt.target.value.toString();
    priceInput.placeholder = AccomodationType[type.toUpperCase()].minPrice;
    priceInput.min = AccomodationType[type.toUpperCase()].minPrice;
  });

  checkInSelect.addEventListener('input', function (evt) {
    checkOutSelect.value = evt.target.value;
  });
  checkOutSelect.addEventListener('input', function (evt) {
    checkInSelect.value = evt.target.value;
  });
  // Клонируем селект с количеством гостей
  var capacityOptions = capacitySelect.cloneNode(true);

  // Проверка на соответствие количества комнат и гостей
  var roomsCapacitySync = function () {
    var rooms = parseInt(roomSelect.value, 10);
    var option;
    // Очищаем селект с гостями
    capacitySelect.innerHTML = '';
    if (rooms === 100) {
      option = capacityOptions.querySelector('option[value="0"]').cloneNode(true);
      capacitySelect.appendChild(option);
    // Если комнат не 100, то количество гостей соответствует количеству комнат
    } else {
      var fragment = document.createDocumentFragment();
      for (var i = rooms; i > 0; i--) {
        option = capacityOptions.querySelector('option[value="' + i + '"]').cloneNode(true);
        fragment.appendChild(option);
      }
      capacitySelect.appendChild(fragment);
    }
  };
  roomsCapacitySync();
  roomSelect.addEventListener('input', roomsCapacitySync);
};

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  if (!isMapActive) {
    // Получаем случайные объявления
    var randomAds = getAds(sampleData, 8);
    activateMap();
    addFormValidator();
    printMapPins(randomAds);
    // Навешиваем обработчики клика на все отрисованные метки
    var pins = map.querySelectorAll('.map__pin:not\(.map__pin--main\)');
    for (var i = 0; i < pins.length; i++) {
      setPinClickHandler(pins[i], randomAds[i]);
    }
  }
  setLocationByPin(mainPin);

  var pinDimensions = getElementDimensions(evt.target);
  var maxCoordX = MAP_WIDTH - Math.floor(pinDimensions.width / 2);
  var minCoordX = 0 - Math.floor(pinDimensions.width / 2);
  var maxCoordY = MAP_MAX_HEIGHT - pinDimensions.height;
  var minCoordY = MAP_MIN_HEIGHT - pinDimensions.height;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var coordX = mainPin.offsetLeft - shift.x;
    var coordY = mainPin.offsetTop - shift.y;

    if (coordX > maxCoordX || coordX < minCoordX) {
      shift.x = 0;
    }
    if (coordY > maxCoordY || coordY < minCoordY) {
      shift.y = 0;
    }

    mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';

    setLocationByPin(mainPin);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

setLocationByPin(mainPin);
