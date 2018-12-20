'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var renderAdCard = function (ad) {
    // Генератор карточки объявления
    var cardElement = adCardTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();
    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    // Тип жилья ставим в соответствии с объектом AccomodationType
    var propertyType = window.data.AccomodationType[ad.offer.type.toUpperCase()].title;
    cardElement.querySelector('.popup__type').textContent = propertyType;
    cardElement.querySelector('.popup__text--capacity')
    .textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time')
    .textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    var cardElementFeatures = cardElement.querySelector('.popup__features');
    // Добавляем параметры жилья в цикле
    if (ad.offer.features.length > 0) {
      for (var i = 0; i < ad.offer.features.length; i++) {
        var itemFeature = ad.offer.features[i].toLowerCase();
        fragment.appendChild(cardElement.querySelector('.popup__features .popup__feature--' + itemFeature));
      }
      cardElementFeatures.innerHTML = '';
      cardElementFeatures.appendChild(fragment);
    } else {
      cardElementFeatures.remove();
    }
    var cardElementDescription = cardElement.querySelector('.popup__description');
    if (ad.offer.description) {
      cardElementDescription.textContent = ad.offer.description;
    } else {
      cardElementDescription.remove();
    }
    var cardElementPhotosBlock = cardElement.querySelector('.popup__photos');
    if (ad.offer.photos.length > 0) {
      // Удаляем пустую фотку
      var cardElementPhoto = cardElementPhotosBlock.querySelector('img');
      cardElementPhoto.remove();
      for (var j = 0; j < ad.offer.photos.length; j++) {
        var itemPhotoSrc = ad.offer.photos[j];
        var photo = cardElementPhoto.cloneNode(true);
        photo.src = itemPhotoSrc;
        fragment.appendChild(photo);
      }
      cardElementPhotosBlock.appendChild(fragment);
    } else {
      cardElementPhotosBlock.remove();
    }
    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
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
