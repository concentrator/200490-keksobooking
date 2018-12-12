'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var priceInput = adForm.querySelector('#price');
  var typeSelect = adForm.querySelector('#type');
  var checkInSelect = adForm.querySelector('#timein');
  var checkOutSelect = adForm.querySelector('#timeout');
  var roomSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');

  window.addFormValidator = function () {

    // Устанавливает цену в соответствии с типом жилья
    typeSelect.addEventListener('input', function (evt) {
      var type = evt.target.value.toString();
      priceInput.placeholder = window.data.AccomodationType[type.toUpperCase()].minPrice;
      priceInput.min = window.data.AccomodationType[type.toUpperCase()].minPrice;
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
})();
