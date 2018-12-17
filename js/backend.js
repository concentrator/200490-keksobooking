'use strict';
(function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 1000;

  var addXhrLoadHandler = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });
  };
  var addXhrErrorHandler = function (xhr, onError) {
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
  };
  var addXhrTimeoutHandler = function (xhr, onError, time) {
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = time;
  };
  var apiRequest = function (url, method, onLoad, onError, body) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    addXhrLoadHandler(xhr, onLoad, onError);
    addXhrErrorHandler(xhr, onError);
    addXhrTimeoutHandler(xhr, onError, TIMEOUT);
    xhr.open(method, url);
    xhr.send(body);
  };

  window.backend = {
    load: function (onLoad, onError) {
      apiRequest(LOAD_URL, 'GET', onLoad, onError);
    },
    save: function (data, onLoad, onError) {
      apiRequest(SAVE_URL, 'POST', onLoad, onError, data);
    }
  };
})();
