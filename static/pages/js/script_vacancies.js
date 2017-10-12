"use strict";

(function () {
  var header = document.querySelector("header");
  header.compress = function () {
    if (!this.classList.contains("header--compact")) {
      this.classList.add("header--compact");
    }
  };
  header.uncompress = function () {
    if (this.classList.contains("header--compact")) {
      this.classList.remove("header--compact");
    }
  };

  window.onscroll = function (e) {
    if (pageYOffset === 0) {
      header.uncompress();
    } else {
      header.compress();
    }
  }

  var vacanciesForm = document.querySelector(".form-section__form--application");
  var fileLabel = vacanciesForm.querySelector(".form__label--documents");
  var fileInput = fileLabel.querySelector(".form__input--documents");
  var countOfUploadedFiles = 0;
  fileInput.onchange = function (e) {
    var uploadedFiles = this.files;
    countOfUploadedFiles += uploadedFiles.length;
    var MAX_FILES_COUNT = 2;
    var MAX_FILE_NAME_CHARACTERS = 20;
    if (countOfUploadedFiles <= MAX_FILES_COUNT) {
      [].forEach.call(uploadedFiles, function (uploadedFile, i, arr) {
        switch (uploadedFile.name.split(".")[uploadedFile.name.split(".").length - 1]) {
          case "png":
          case "jpg":
            var image = document.createElement("div");
            image.className = "form__icon form__icon--image";
            fileLabel.appendChild(image);
            if (uploadedFile.name.length > MAX_FILE_NAME_CHARACTERS) {
              image.innerHTML = uploadedFile.name.slice(0, MAX_FILE_NAME_CHARACTERS) + "...";
            } else {
              image.innerHTML = uploadedFile.name;
            }
            break;
          default:
            var application = document.createElement("div");
            application.className = "form__icon form__icon--document";
            fileLabel.appendChild(application);
            if (uploadedFile.name.length > MAX_FILE_NAME_CHARACTERS) {
              application.innerHTML = uploadedFile.name.slice(0, MAX_FILE_NAME_CHARACTERS) + "...";
            } else {
              application.innerHTML = uploadedFile.name;
            }
          }
        if (countOfUploadedFiles < MAX_FILES_COUNT) {
          var cloneFileLabel = fileLabel.cloneNode(true);
          fileLabel.classList.add("jsHide");
          vacanciesForm.insertBefore(cloneFileLabel, fileLabel);
          fileLabel = cloneFileLabel;
          var cloneFileInput = cloneFileLabel.querySelector(".form__input--documents");
          cloneFileInput.setAttribute("name", "document" + (i + 2));
          cloneFileInput.onchange = fileInput.onchange;
        } else {
          fileLabel.onclick = function (e) {
            alert("Нельзя загрузить больше " + MAX_FILES_COUNT + " файлов");

            return false;
          }
        }
      });
    } else {
      alert("Нельзя загрузить больше " + MAX_FILES_COUNT + " файлов");
    }
  }

  var selects = document.querySelectorAll("select");
  [].forEach.call(selects, function (select, i, arr) {
    select.addEventListener("change", function (e) {
      if (!select.classList.contains("jsSelectChanged")) {
        select.classList.add("jsSelectChanged");
      }
    });
  });

  var form = document.querySelector("form");
  var fieldLastName = form.querySelector("input[name=\"last_name\"]");
  var fieldFirstName = form.querySelector("input[name=\"first_name\"]");
  var fieldPatronym = form.querySelector("input[name=\"patronym\"]");
  var fieldPhone = form.querySelector("input[name=\"phone\"]");
  var fieldEmail = form.querySelector("input[name=\"email\"]");
  var fieldCity = form.querySelector("input[name=\"city\"]");
  var fieldStreet = form.querySelector("input[name=\"street\"]");
  form.onsubmit = function (e) {
    if (fieldLastName.value) {
      localStorage.setItem("lastName", fieldLastName.value);
    }
    if (fieldFirstName.value) {
      localStorage.setItem("firstName", fieldFirstName.value);
    }
    if (fieldPatronym.value) {
      localStorage.setItem("patronym", fieldPatronym.value);
    }
    if (fieldPhone.value) {
      localStorage.setItem("phone", fieldPhone.value);
    }
    if (fieldEmail.value) {
      localStorage.setItem("email", fieldEmail.value);
    }
    if (fieldCity.value) {
      localStorage.setItem("city", fieldCity.value);
    }
    if (fieldStreet.value) {
      localStorage.setItem("street", fieldStreet.value);
    }
  }
  if (localStorage.getItem("lastName")) {
    fieldLastName.value = localStorage.getItem("lastName");
  }
  if (localStorage.getItem("firstName")) {
    fieldFirstName.value = localStorage.getItem("firstName");
  }
  if (localStorage.getItem("patronym")) {
    fieldPatronym.value = localStorage.getItem("patronym");
  }
  if (localStorage.getItem("phone")) {
    fieldPhone.value = localStorage.getItem("phone");
  }
  if (localStorage.getItem("email")) {
    fieldEmail.value = localStorage.getItem("email");
  }
  if (localStorage.getItem("city")) {
    fieldCity.value = localStorage.getItem("city");
  }
  if (localStorage.getItem("street")) {
    fieldStreet.value = localStorage.getItem("street");
  }

  var activeMenuLink = document.querySelector(".menu__item--active .menu__link");
  activeMenuLink.onclick = function (e) {
    return false;
  }

  var servicesMenuLink = document.querySelector(".menu__link--services");
  servicesMenuLink.onclick = function (e) {
    return false;
  }
})();