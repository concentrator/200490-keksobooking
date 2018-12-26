'use strict';
(function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502
  };

  var addXhrLoadHandler = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case Code.SUCCESS:
          onLoad(xhr.response);
          break;
        case Code.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case Code.UNAUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case Code.FORBIDDEN:
          error = 'Доступ запрещен';
          break;
        case Code.NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        case Code.INTERNAL_SERVER_ERROR:
          error = 'Внутренняя ошибка сервера';
          break;
        case Code.BAD_GATEWAY:
          error = 'Неверный ответ сервера';
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
