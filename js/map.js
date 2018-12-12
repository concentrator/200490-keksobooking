'use strict';

(function () {

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
    var propertyType = window.data.AccomodationType[ad.offer.type.toUpperCase()].title;
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

  // Определяет координаты метки
  var getPinlLocation = function (pin) {
    var pinDimensions = window.util.getElementDimensions(pin);
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
    window.util.removeDisabledAttr(filterSelectInputs);
    adForm.classList.remove('ad-form--disabled');
    window.util.removeDisabledAttr(filterFieldsets);
    window.util.removeDisabledAttr(adFormFieldsets);
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
    window.util.isEscEvent(evt, closeMapCard);
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

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    if (!isMapActive) {
      // Получаем случайные объявления
      var randomAds = window.data.getAds(window.data.sampleData, 8);
      activateMap();
      window.addFormValidator();
      printMapPins(randomAds);
      // Навешиваем обработчики клика на все отрисованные метки
      var pins = map.querySelectorAll('.map__pin:not\(.map__pin--main\)');
      for (var i = 0; i < pins.length; i++) {
        setPinClickHandler(pins[i], randomAds[i]);
      }
    }
    setLocationByPin(mainPin);

    var pinDimensions = window.util.getElementDimensions(evt.target);
    var maxCoordX = window.util.MAP_WIDTH - Math.floor(pinDimensions.width / 2);
    var minCoordX = 0 - Math.floor(pinDimensions.width / 2);
    var maxCoordY = window.util.MAP_MAX_HEIGHT - pinDimensions.height;
    var minCoordY = window.util.MAP_MIN_HEIGHT - pinDimensions.height;

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
})();
