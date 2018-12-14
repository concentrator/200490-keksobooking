'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var addressInput = adForm.querySelector('#address');

  window.map = {
    MAP_WIDTH: 1200,
    MAP_MIN_HEIGHT: 130,
    MAP_MAX_HEIGHT: 630,
    isMapActive: false,
    openedCard: null,
    activePin: null,

    setMapNavigationArea: function () {
      var pinDimensions = window.util.getElementDimensions(mainPin);
      var pinArea = {
        minCoordX: 0 - Math.floor(pinDimensions.width / 2),
        minCoordY: this.MAP_MIN_HEIGHT - pinDimensions.height,
        maxCoordX: this.MAP_WIDTH - Math.floor(pinDimensions.width / 2),
        maxCoordY: this.MAP_MAX_HEIGHT - pinDimensions.height
      };
      return pinArea;
    },
    // Активирует карту
    activateMap: function () {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.util.runFunctionRepeatedly(window.form.removeDisabledAttr, window.form.disabledInputs);
      this.isMapActive = true;
    },
    init: function () {
      if (!this.isMapActive) {
        // Получаем случайные объявления
        var randomAds = window.data.getAds(window.data.sampleData, 8);
        this.activateMap();
        window.form.addFormValidator();
        window.pin.printMapPins(randomAds);
      }
      setLocationByPin(mainPin);
    }
  };

  // Устанавливает координаты метки в поле адреса
  var setLocationByPin = function (pin) {
    var location = window.pin.getPinlLocation(pin);
    addressInput.value = location.x + ', ' + location.y;
  };

  var pinMoveArea = window.map.setMapNavigationArea();

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    window.map.init();

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
  });

  setLocationByPin(mainPin);
})();
