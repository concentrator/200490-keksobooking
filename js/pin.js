'use strict';

(function () {
  var mapPinsBlock = document.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mainPin = document.querySelector('.map__pin--main');

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

  // Устанавливает обработчик клика по метке
  var addPinClickHandler = function (pin, ad) {
    pin.addEventListener('click', function () {
      var activePin = window.map.activePin;
      var adCard = window.map.openedCard;
      // Выполняется только при клике по НЕактивной метке
      if (pin !== activePin) {
        if (adCard) {
          // Если другая карточка уже открыта - удаляем ее
          window.card.close();
        }
        window.card.insert(ad);
        window.pin.setActivePin(pin);
      }
    });
  };

  // Рисуем метки на карте из массива объявлений
  var printMapPins = function (adsArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < adsArray.length; i++) {
      if (adsArray[i].hasOwnProperty('offer')) {
        var pin = renderMapPin(adsArray[i]);
        // Навешиваем обработчики клика на все отрисованные метки
        addPinClickHandler(pin, adsArray[i]);
        fragment.appendChild(pin);
      }
    }
    mapPinsBlock.appendChild(fragment);
  };

  // Определяет координаты отрисовки метки
  var getPinOffset = function (pin) {
    var pinOffset = {
      x: pin.offsetLeft,
      y: pin.offsetTop
    };
    return pinOffset;
  };

  var setPinOffset = function (pin, coords) {
    pin.style.left = coords.x + 'px';
    pin.style.top = coords.y + 'px';
  };

  // Определяет координаты метки
  var getPinlLocation = function (pin) {
    var pinDimensions = window.util.getElementDimensions(pin);
    var pinOffset = getPinOffset(pin);

    var location = {
      x: pinOffset.x + Math.floor(pinDimensions.width / 2),
      y: pinOffset.y + Math.floor(pinDimensions.height)
    };
    if (!window.map.isMapActive && pin === mainPin) {
      location.y = pinOffset.y + Math.floor(pinDimensions.height / 2);
    }
    return location;
  };

  var setActivePin = function (pin) {
    pin.classList.add('map__pin--active');
    window.map.activePin = pin;
  };

  var removePins = function () {
    var mapOverlay = mapPinsBlock.querySelector('.map__overlay');
    mapPinsBlock.innerHTML = '';
    mapPinsBlock.appendChild(mapOverlay);
    mapPinsBlock.appendChild(mainPin);
  };

  window.pin = {
    printMapPins: printMapPins,
    getPinOffset: getPinOffset,
    setPinOffset: setPinOffset,
    getPinlLocation: getPinlLocation,
    setActivePin: setActivePin,
    removePins: removePins
  };

})();
