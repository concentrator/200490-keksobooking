'use strict';

(function () {
  var main = document.body.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorPopup = null;
  var successPopup = null;
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  window.util = {
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    // Случайное перемешивание массива
    shuffleArray: function (a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    },
    // Генератор случайных чисел от min до max включительно
    getRandomIntInclusive: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // Возвращает индекс массива в начало, если элементы в массиве закончились, а перебор продолжается
    // (для случайных данных)
    getArrayIndex: function (array, index) {
      var multiplier = 0;
      if (!array[index]) {
        multiplier = Math.floor(index / array.length);
      }
      return index - array.length * multiplier;
    },
    runFunctionRepeatedly: function (func, arr) {
      for (var i = 0; i < arr.length; i++) {
        func(arr[i]);
      }
    },
    // Определяет размеры элемента
    getElementDimensions: function (element) {
      var dimensions = {
        width: element.clientWidth,
        height: element.clientHeight
      };
      return dimensions;
    },
    showSuccess: function () {
      if (!successPopup) {
        successPopup = successTemplate.cloneNode(true);
        successPopup.addEventListener('click', closeSuccess);
      }
      main.appendChild(successPopup);
      document.addEventListener('keydown', successEscHandler);
    },
    showError: function (error) {
      if (!errorPopup) {
        errorPopup = errorTemplate.cloneNode(true);
        var closeButton = errorPopup.querySelector('.error__button');
        closeButton.addEventListener('click', closeError);
      }
      errorPopup.querySelector('p').textContent = error;
      main.appendChild(errorPopup);
      document.addEventListener('keydown', errorEscHandler);
    }
  };

  var successEscHandler = function (evt) {
    window.util.isEscEvent(evt, closeSuccess);
  };
  var closeSuccess = function () {
    successPopup.remove();
    document.removeEventListener('keydown', successEscHandler);
  };

  var errorEscHandler = function (evt) {
    window.util.isEscEvent(evt, closeError);
  };
  var closeError = function () {
    errorPopup.remove();
    document.removeEventListener('keydown', errorEscHandler);
  };
})();
