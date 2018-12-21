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

  window.filter = {
    init: function () {
      mapFilters.addEventListener('input', onMapFiltersInput);
      housingFeatures = [];
    },

    update: function () {
      var price = housingPrice.value.toUpperCase();
      filteredAds = window.data.ads.filter(function (it) {
        return ((housingType.value === 'any') || (it.offer.type === housingType.value)) && // Тип жилья любой или выбранный
          ((it.offer.price >= PriceRange[price].min) && (it.offer.price < PriceRange[price].max)) && // Цена в диапазоне
          ((housingRooms.value === 'any') || (it.offer.rooms === parseInt(housingRooms.value, 10))) && // Кол-во комнат любое или выбарнное
          ((housingGuests.value === 'any') || (it.offer.guests === parseInt(housingGuests.value, 10))) && // Кол-во гостей любое или выбранное
          // Сравнение массивов опций жилья объявления и выбранных опций жилья в фильтре
          ((it.offer.features.filter(function (feature) {
            return housingFeatures.indexOf(feature) > -1;
          })).length >= housingFeatures.length);
      }).slice(0, MAP_PINS_AMOUNT);

      window.map.clear();
      window.pin.print(filteredAds);
    }
  };
})();
