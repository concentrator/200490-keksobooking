'use strict';

(function () {
  var NOT_FOR_GUESTS = 100;
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = mapFiltersContainer.querySelector('.map__filters');
  var filterSelectInputs = mapFiltersContainer.querySelectorAll('select');
  var filterFieldsets = mapFiltersContainer.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var avatarInput = adForm.querySelector('#avatar');
  var avatarDrag = adForm.querySelector('.ad-form-header__drop-zone');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var priceInput = adForm.querySelector('#price');
  var typeSelect = adForm.querySelector('#type');
  var checkInSelect = adForm.querySelector('#timein');
  var checkOutSelect = adForm.querySelector('#timeout');
  var roomSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var imageInput = adForm.querySelector('#images');
  var imageDrag = adForm.querySelector('.ad-form__drop-zone');
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
    nodes.forEach(function (node) {
      node.setAttribute('disabled', '');
    });
  };
  // Удаляет атрибут disabled у коллекции элементов
  var removeDisabledAttr = function (nodes) {
    nodes.forEach(function (node) {
      node.removeAttribute('disabled');
    });
  };

  // Загрузка аватарки через инпут
  var onAvatarChange = function (evt) {
    var file = evt.target.files[0];
    window.image.preview(file, avatarPreview);
  };

  // Загрузка аватарки драг'н'дропом
  var onAvatarDrop = function (evt) {
    evt.preventDefault();
    var file = evt.dataTransfer.files[0];
    window.image.preview(file, avatarPreview);
    window.image.avatar.push(file);
  };

  // Отмена действия браузера по умолчанию
  var onDragOver = function (evt) {
    evt.preventDefault();
  };

  // Загрузка фоток через инпут (множоственно)
  var onImageChange = function (evt) {
    window.image.handleMultiply(evt.target.files);
  };

  // Загрузка фоток драг'н'дропом (множественно)
  var onDropMultiply = function (evt) {
    evt.preventDefault();
    window.image.handleMultiply(evt.dataTransfer.files);
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
    if (rooms === NOT_FOR_GUESTS) {
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

  var setFormDataImages = function (images, data, key) {
    if (images.length) {
      images.forEach(function (image, i) {
        if (i === 0) {
          data.set(key, image);
        } else {
          data.append(key, image);
        }
      });
    }
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    var data = new FormData(evt.target);

    setFormDataImages(window.image.avatar, data, 'avatar');
    setFormDataImages(window.image.photos, data, 'images');

    window.backend.save(data, function () {
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
    window.image.clear();
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
      avatarInput.addEventListener('change', onAvatarChange);
      avatarDrag.addEventListener('dragover', onDragOver);
      avatarDrag.addEventListener('drop', onAvatarDrop);
      onTypeSelectInput();
      typeSelect.addEventListener('input', onTypeSelectInput);
      checkInSelect.addEventListener('input', onCheckInSelectInput);
      checkOutSelect.addEventListener('input', onCheckOutSelectInput);
      onRoomSelectInput();
      roomSelect.addEventListener('input', onRoomSelectInput);
      imageInput.addEventListener('change', onImageChange);
      imageDrag.addEventListener('dragover', onDragOver);
      imageDrag.addEventListener('drop', onDropMultiply);
      resetButton.addEventListener('click', onAdFormReset);
      window.filter.init();
    }
  };
})();
