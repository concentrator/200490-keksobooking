'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var adForm = document.querySelector('.ad-form');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var imageContainer = adForm.querySelector('.ad-form__photo-container');
  var adFormUpload = adForm.querySelector('.ad-form__upload');
  var imagePreview = adForm.querySelector('.ad-form__photo');
  var defaultAvatar = avatarPreview.src;
  window.image = {

    avatar: [],
    photos: [],

    preview: function (file, img) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          img.src = reader.result;
        });
        reader.readAsDataURL(file);
      }
    },

    handleMultiply: function (imageList) {
      var fragment = document.createDocumentFragment();
      imagePreview.remove();
      Array.prototype.forEach.call(imageList, function (image) {
        var preview = document.createElement('img');
        var imageBlock = imagePreview.cloneNode();
        window.image.preview(image, preview);
        window.image.photos.push(image);
        imageBlock.appendChild(preview);
        fragment.appendChild(imageBlock);
      });
      imageContainer.appendChild(fragment);
    },

    clear: function () {
      imageContainer.innerHTML = '';
      imageContainer.appendChild(adFormUpload);
      imageContainer.appendChild(imagePreview);
      avatarPreview.src = defaultAvatar;
      window.image.photos = [];
    }
  };

})();
