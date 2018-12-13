'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adForm = document.querySelector('.ad-form');
  var addressInput = adForm.querySelector('#address');

  window.map = {
    isMapActive: false,
    openedCard: null,
    activePin: null
  };

  // Активирует карту
  var activateMap = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.util.runFunctionRepeatedly(window.form.removeDisabledAttr, window.form.disabledInputs);
    window.map.isMapActive = true;
  };

  // Устанавливает координаты метки в поле адреса
  var setLocationByPin = function (pin) {
    var location = window.pin.getPinlLocation(pin);
    addressInput.value = location.x + ', ' + location.y;
  };

  var insertAdCard = function (ad) {
    var mapCard = map.insertBefore(window.card.renderAdCard(ad), mapFiltersContainer);
    window.map.openedCard = mapCard;
    var closeButton = mapCard.querySelector('.popup__close');
    closeButton.addEventListener('click', window.card.closeMapCard);
    document.addEventListener('keydown', window.card.documentEscHandler);
  };

  // Устанавливает обработчик клика по метке
  var setPinClickHandler = function (pin, ad) {
    pin.addEventListener('click', function () {
      var activePin = window.map.activePin;
      var mapCard = window.map.openedCard;
      // Выполняется только при клике по НЕактивной метке
      if (pin !== activePin) {
        if (mapCard) {
          // Если другая карточка уже открыта - удаляем ее
          window.card.closeMapCard();
        }
        insertAdCard(ad);
        window.pin.setActivePin(pin);
      }
    });
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    if (!window.map.isMapActive) {
      // Получаем случайные объявления
      var randomAds = window.data.getAds(window.data.sampleData, 8);
      activateMap();
      window.form.addFormValidator();
      window.pin.printMapPins(randomAds);
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
