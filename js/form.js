'use strict';

(function () {
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = mapFiltersContainer.querySelector('.map__filters');
  var filterSelectInputs = mapFiltersContainer.querySelectorAll('select');
  var filterFieldsets = mapFiltersContainer.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var priceInput = adForm.querySelector('#price');
  var typeSelect = adForm.querySelector('#type');
  var checkInSelect = adForm.querySelector('#timein');
  var checkOutSelect = adForm.querySelector('#timeout');
  var roomSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var resetButton = adForm.querySelector('.ad-form__reset');
  // Клонирует селект с количеством гостей
  var capacityOptions = capacitySelect.cloneNode(true);

  var disabledInputs = [
    filterSelectInputs,
    filterFieldsets,
    adFormFieldsets
  ];

  // Добавляет атрибут disabled у коллекции элементов
  var addDisabledAttr = function (nodes) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('disabled', '');
    }
  };
  // Удаляет атрибут disabled у коллекции элементов
  var removeDisabledAttr = function (nodes) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].removeAttribute('disabled');
    }
  };
  // Устанавливает цену в соответствии с типом жилья
  var onTypeSelectInput = function () {
    var type = typeSelect.value.toString();
    priceInput.placeholder = window.data.AccomodationType[type.toUpperCase()].minPrice;
    priceInput.min = window.data.AccomodationType[type.toUpperCase()].minPrice;
  };

  var onCheckInSelectInput = function (evt) {
    checkOutSelect.value = evt.target.value;
  };

  var onCheckOutSelectInput = function (evt) {
    checkInSelect.value = evt.target.value;
  };

  // Проверка на соответствие количества комнат и гостей
  var onRoomSelectInput = function () {
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

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(evt.target), function () {
      onAdFormReset();
      window.util.showSuccess();
    }, function (error) {
      window.util.showError(error);
    });
  };

  var onAdFormReset = function (evt) {
    if (evt && evt.target === resetButton) {
      evt.preventDefault();
    }
    adForm.reset();
    mapFilters.reset();
    onTypeSelectInput();
    onRoomSelectInput();
    adForm.classList.add('ad-form--disabled');
    window.util.runFunctionRepeatedly(addDisabledAttr, disabledInputs);
    window.map.reset();
  };

  window.form = {
    init: function () {
      adForm.classList.remove('ad-form--disabled');
      window.util.runFunctionRepeatedly(removeDisabledAttr, disabledInputs);
      adForm.addEventListener('submit', onFormSubmit);
      onTypeSelectInput();
      typeSelect.addEventListener('input', onTypeSelectInput);
      checkInSelect.addEventListener('input', onCheckInSelectInput);
      checkOutSelect.addEventListener('input', onCheckOutSelectInput);
      onRoomSelectInput();
      roomSelect.addEventListener('input', onRoomSelectInput);
      resetButton.addEventListener('click', onAdFormReset);
      window.filter.init();
    }
  };
})();
