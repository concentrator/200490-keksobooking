'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var addressInput = adForm.querySelector('#address');
  var MAP_WIDTH = 1200;
  var MAP_MIN_HEIGHT = 130;
  var MAP_MAX_HEIGHT = 630;

  window.map = {
    isMapActive: false,
    openedCard: null,
    activePin: null,

    // Активирует карту
    activate: function () {
      map.classList.remove('map--faded');
      if (!this.mainPinInitialOffset) {
        this.mainPinInitialOffset = window.pin.getPinOffset(mainPin);
      }
      this.isMapActive = true;
      setLocationByPin(mainPin);
    },
    clear: function () {
      if (this.isMapActive) {
        if (this.openedCard) {
          window.card.close();
        }
        window.pin.removePins();
      }
    },
    // Деактивирует карту
    reset: function () {
      this.clear();
      map.classList.add('map--faded');
      if (this.mainPinInitialOffset) {
        window.pin.setPinOffset(mainPin, this.mainPinInitialOffset);
      }
      setLocationByPin(mainPin);
      this.isMapActive = false;
    }
  };

  var init = function () {
    if (!window.map.isMapActive) {
      // Загружает объявления с сервера вызывает отрисовку меток
      window.backend.load(
          function (response) {
            window.data.ads = response;
            window.map.activate();
            window.form.init();
            window.filter.update();
          }, function (error) {
            window.util.showError(error);
          });
    }
  };

  // Устанавливает координаты метки в поле адреса
  var setLocationByPin = function (pin) {
    var location = window.pin.getPinlLocation(pin);
    addressInput.value = location.x + ', ' + location.y;
  };

  var setMapNavigationArea = function () {
    var pinDimensions = window.util.getElementDimensions(mainPin);
    var pinNavArea = {
      minCoordX: 0 - Math.floor(pinDimensions.width / 2),
      minCoordY: MAP_MIN_HEIGHT - pinDimensions.height,
      maxCoordX: MAP_WIDTH - Math.floor(pinDimensions.width / 2),
      maxCoordY: MAP_MAX_HEIGHT - pinDimensions.height
    };
    return pinNavArea;
  };

  var pinMoveArea = setMapNavigationArea();

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    init();

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

      if (coordX > pinMoveArea.maxCoordX || coordX < pinMoveArea.minCoordX) {
        shift.x = 0;
      }
      if (coordY > pinMoveArea.maxCoordY || coordY < pinMoveArea.minCoordY) {
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
  };

  window.onload = function () {
    setLocationByPin(mainPin);
    mainPin.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, window.map.init);
    });
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
  };
})();
