'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var addressInput = adForm.querySelector('#address');
  var MapRect = {
    LEFT: 0,
    RIGHT: 1200,
    TOP: 130,
    BOTTOM: 630
  };

  var Coordinate = function (x, y, constraints) {
    this.x = x;
    this.y = y;
    this._constraints = constraints;
  };

  Coordinate.prototype.setX = function (x) {
    if (x >= this._constraints.left &&
        x <= this._constraints.right) {
      this.x = x;
    }
  };

  Coordinate.prototype.setY = function (y) {
    if (y >= this._constraints.top &&
        y <= this._constraints.bottom) {
      this.y = y;
    }
  };

  window.map = {
    isActive: false,
    openedCard: null,
    activePin: null,

    // Активирует карту
    activate: function () {
      map.classList.remove('map--faded');
      if (!this.mainPinInitialOffset) {
        this.mainPinInitialOffset = window.pin.getOffset(mainPin);
      }
      this.isActive = true;
      setLocationByPin(mainPin);
    },
    clear: function () {
      if (this.isActive) {
        if (this.openedCard) {
          window.card.close();
        }
        window.pin.remove();
      }
    },
    // Деактивирует карту
    reset: function () {
      this.clear();
      map.classList.add('map--faded');
      if (this.mainPinInitialOffset) {
        window.pin.setOffset(mainPin, this.mainPinInitialOffset);
      }
      setLocationByPin(mainPin);
      this.isActive = false;
    }
  };

  var init = function () {
    if (!window.map.isActive) {
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
    var location = window.pin.getLocation(pin);
    addressInput.value = location.x + ', ' + location.y;
  };

  var MoveArea = function (left, top, right, bottom) {
    var pinDimensions = window.util.getElementDimensions(mainPin);
    this.left = left - Math.floor(pinDimensions.width / 2);
    this.top = top - pinDimensions.height;
    this.right = right - Math.floor(pinDimensions.width / 2);
    this.bottom = bottom - pinDimensions.height;
  };

  var pinMoveArea = new MoveArea(MapRect.LEFT, MapRect.TOP, MapRect.RIGHT, MapRect.BOTTOM);

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = new Coordinate(evt.clientX, evt.clientY);
    var shift = new Coordinate(startCoords.x, startCoords.y);
    var move = new Coordinate(mainPin.offsetLeft, mainPin.offsetTop, pinMoveArea);

    init(); // Инициализация карты

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      shift.x = startCoords.x - moveEvt.clientX;
      shift.y = startCoords.y - moveEvt.clientY;

      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;

      move.setX(mainPin.offsetLeft - shift.x);
      move.setY(mainPin.offsetTop - shift.y);

      mainPin.style.left = move.x + 'px';
      mainPin.style.top = move.y + 'px';

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
