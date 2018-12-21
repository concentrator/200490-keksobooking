'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var PROPS = ['avatar', 'title', 'type', 'features', 'description', 'photos'];
  var TEXT_PROPS = ['address', 'price', 'capacity', 'time'];

  var setProperties = function (prop, card, ad) {
    var fragment = document.createDocumentFragment();
    var elem;
    if (TEXT_PROPS.indexOf(prop) >= 0) {
      elem = card.querySelector('.popup__text--' + prop);
    } else {
      elem = card.querySelector('.popup__' + prop);
    }
    var offerProp = '';
    // Предварительная проверка для свойств avatar, capacity, time
    if (prop === 'avatar' && ad.author.avatar !== '') {
      offerProp = ad.author.avatar;
    // Проверка на "вместимость" - наличие данных о комнатах и гостях (начение записываем сразу)
    } else if (prop === 'capacity' && (ad.offer.rooms !== '' || ad.offer.guests !== '')) {
      offerProp = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    // Проверка на время заезда и выезда (значение записываем сразу)
    } else if (prop === 'time' && (ad.offer.checkin !== '' || ad.offer.checkout !== '')) {
      offerProp = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    } else {
      offerProp = ad.offer[prop];
    }
    // Проверка, что для свойства есть данные
    if (Array.isArray(offerProp) && offerProp.length > 0 || offerProp !== '') {
      if (prop === 'price') {
        elem.textContent = offerProp + '₽/ночь';
      } else if (prop === 'type') {
        // Тип жилья ставим в соответствии с объектом AccomodationType
        var typeTitle = window.data.AccomodationType[ad.offer.type.toUpperCase()].title;
        elem.textContent = typeTitle;
      } else if (prop === 'features') {
        offerProp.forEach(function (feature) {
          fragment.appendChild(card.querySelector('.popup__feature--' + feature));
        });
        elem.innerHTML = '';
        elem.appendChild(fragment);
      } else if (prop === 'photos') {
        var photoElem = elem.querySelector('img');
        // Удаляем пустую фотку
        photoElem.remove();
        offerProp.forEach(function (photoSrc) {
          var photo = photoElem.cloneNode(true);
          photo.src = photoSrc;
          fragment.appendChild(photo);
        });
        elem.appendChild(fragment);
        // Для все остальных записываем просто текст
      } else if (prop === 'avatar') {
        elem.src = offerProp;
      } else {
        elem.textContent = offerProp;
      }
    } else {
      elem.remove();
    }
  };

  var renderAdCard = function (ad) {
    // Генератор карточки объявления
    var cardElement = adCardTemplate.cloneNode(true);
    PROPS.concat(TEXT_PROPS).forEach(function (prop) {
      setProperties(prop, cardElement, ad);
    });
    return cardElement;
  };

  var cardEscHandler = function (evt) {
    window.util.isEscEvent(evt, window.card.close);
  };

  window.card = {
    insert: function (ad) {
      var adCard = map.insertBefore(renderAdCard(ad), mapFiltersContainer);
      window.map.openedCard = adCard;
      var closeButton = adCard.querySelector('.popup__close');
      closeButton.addEventListener('click', this.close);
      document.addEventListener('keydown', cardEscHandler);
    },
    // Закрывает карточку объявления
    close: function () {
      window.map.openedCard.remove();
      window.map.openedCard = null;
      window.map.activePin.classList.remove('map__pin--active');
      window.map.activePin = null;
      document.removeEventListener('keydown', cardEscHandler);
    }
  };

})();
