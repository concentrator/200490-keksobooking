'use strict';

(function () {

  var ESC_KEYCODE = 27;

  window.util = {
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
    }
  };
})();
