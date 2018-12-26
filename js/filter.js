'use strict';

(function () {
  var PriceRange = {
    ANY: {
      min: 0,
      max: Infinity
    },
    LOW: {
      min: 0,
      max: 10000
    },
    MIDDLE: {
      min: 10000,
      max: 50000
    },
    HIGH: {
      min: 50000,
      max: Infinity
    }
  };
  var DEBOUNCE_INTERVAL = 500;
  var MAP_PINS_AMOUNT = 5;
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = mapFiltersContainer.querySelector('.map__filters');
  var housingType = mapFiltersContainer.querySelector('#housing-type');
  var housingPrice = mapFiltersContainer.querySelector('#housing-price');
  var housingRooms = mapFiltersContainer.querySelector('#housing-rooms');
  var housingGuests = mapFiltersContainer.querySelector('#housing-guests');
  var housingFeaturesFieldset = mapFiltersContainer.querySelector('#housing-features');

  var filteredAds;
  var housingFeatures;

  var lastTimeout;
  var debounce = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  };

  var onMapFiltersInput = function (evt) {
    if (evt.target.parentElement === housingFeaturesFieldset) {
      if (!evt.target.checked) {
        housingFeatures.splice(housingFeatures.indexOf(evt.target.value), 1);
      } else {
        housingFeatures.push(evt.target.value);
      }
    }
    debounce(window.filter.update);
  };

  var isHousingTypeMatch = function (type) {
    return ((housingType.value === 'any') || (type === housingType.value)); // Тип жилья любой или выбранный
  };

  var isPriceRangeMatch = function (offerPrice) {
    var price = housingPrice.value.toUpperCase();
    return ((offerPrice >= PriceRange[price].min) && (offerPrice < PriceRange[price].max)); // Цена в диапазоне
  };

  var isRoomsNumberMatch = function (rooms) {
    return ((housingRooms.value === 'any') || (rooms === parseInt(housingRooms.value, 10))); // Кол-во комнат любое или выбарнное
  };

  var isGuestsNumberMatch = function (guests) {
    return ((housingGuests.value === 'any') || (guests === parseInt(housingGuests.value, 10))); // Кол-во гостей любое или выбранное
  };

  var isFeaturesSetMatch = function (features) {
    // Сравнение массивов опций жилья объявления и выбранных опций жилья в фильтре
    return ((features.filter(function (feature) {
      return housingFeatures.indexOf(feature) > -1;
    })).length >= housingFeatures.length);
  };

  window.filter = {
    init: function () {
      mapFilters.addEventListener('input', onMapFiltersInput);
      housingFeatures = [];
    },

    update: function () {
      filteredAds = window.data.ads.filter(function (it) {
        return isHousingTypeMatch(it.offer.type) &&
        isPriceRangeMatch(it.offer.price) &&
        isRoomsNumberMatch(it.offer.rooms) &&
        isGuestsNumberMatch(it.offer.guests) &&
        isFeaturesSetMatch(it.offer.features);
      }).slice(0, MAP_PINS_AMOUNT);
      window.map.clear();
      window.pin.print(filteredAds);
    }
  };
})();
