"use strict";

(function () {
  var categories = document.querySelectorAll(".requirements__parameter--category");
  [].forEach.call(categories, function (category, i, arr) {
    var innerWrapper = document.createElement("div");
    innerWrapper.className = "jsInnerWrapper";
    innerWrapper.innerHTML = category.innerHTML;
    category.innerHTML = "";
    category.appendChild(innerWrapper);
  });
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
    [].forEach.call(categories, function (category, i, arr) {
      if (i === 2 || i === 3) {
        var innerWrapper = category.querySelector(".jsInnerWrapper");
        var CATEGORY_PADDING = 40;
        var TOP_STOP_DISTANCE = getCoords(category).top - header.offsetHeight;
        var BOTTOM_STOP_DISTANCE = getCoords(category).top + category.offsetHeight - header.offsetHeight - innerWrapper.offsetHeight - 2 * CATEGORY_PADDING;
        if (pageYOffset >= TOP_STOP_DISTANCE
            && pageYOffset < BOTTOM_STOP_DISTANCE
            && !innerWrapper.classList.contains("jsFixed")) {
          innerWrapper.style.marginTop = "0";
          innerWrapper.style.top = getCoords(innerWrapper).top - getCoords(category).top + header.offsetHeight + "px";
          innerWrapper.style.left = getCoords(innerWrapper).left + "px";
          innerWrapper.classList.add("jsFixed");
        } else if ((pageYOffset >= BOTTOM_STOP_DISTANCE
                    || pageYOffset < TOP_STOP_DISTANCE)
                    && innerWrapper.classList.contains("jsFixed")) {
          innerWrapper.classList.remove("jsFixed");
          if (pageYOffset >= BOTTOM_STOP_DISTANCE) {
            innerWrapper.style.marginTop = BOTTOM_STOP_DISTANCE - TOP_STOP_DISTANCE + "px";
          } else if (pageYOffset <= TOP_STOP_DISTANCE) {
            innerWrapper.style.marginTop = "0";
          }
        }
      }
    })
    if (pageYOffset === 0) {
      header.uncompress();
    } else {
      header.compress();
    }
  }

  var purchasesForm = document.querySelector(".form-section__form--order");
  var fileLabel = purchasesForm.querySelector(".form__label--documents");
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
          case "mp4":
          case "avi":
          case "3gp":
          case "ogg":
          case "flv":
            var video = document.createElement("div");
            video.className = "form__icon form__icon--video";
            fileLabel.appendChild(video);
            if (uploadedFile.name.length > MAX_FILE_NAME_CHARACTERS) {
              video.innerHTML = uploadedFile.name.slice(0, MAX_FILE_NAME_CHARACTERS) + "...";
            } else {
              video.innerHTML = uploadedFile.name;
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
          purchasesForm.insertBefore(cloneFileLabel, fileLabel);
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

  var deliveryTypeSelect = document.querySelector(".form__input--delivery-type");
  var deliveryInfoBlock = document.querySelector(".form__info-block--delivery");
  deliveryInfoBlock.show = show;
  deliveryInfoBlock.hide = hide;

  deliveryTypeSelect.onchange = function () {
    var n = this.options.selectedIndex;
    switch (this.options[n].getAttribute("value")) {
      case "Железной дорогой":
        if (deliverableSelect.options.selectedIndex === 1) {
          yesDeliverableInfoBlock.show();
          if (!yesDeliverableInfoBlock.classList.contains("form__info-block--deliverable-with-neighboor") &&
              deliveryTypeSelect.options.selectedIndex !== 0) {
            yesDeliverableInfoBlock.classList.add("form__info-block--deliverable-with-neighboor");
            if (!deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor")) {
              deliveryInfoBlock.classList.add("form__info-block--purchases-with-neighboor")
            }
          } else if (yesDeliverableInfoBlock.classList.contains("form__info-block--deliverable-with-neighboor") &&
                     deliveryTypeSelect.options.selectedIndex === 0) {
            yesDeliverableInfoBlock.classList.remove("form__info-block--deliverable-with-neighboor");
            if (deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor")) {
              deliveryInfoBlock.classList.remove("form__info-block--purchases-with-neighboor")
            }
          }
          if (!deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor") &&
              deliveryTypeSelect.options.selectedIndex !== 0) {
            deliverableInfoBlock.classList.add("form__info-block--purchases-with-neighboor");
          } else if (deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor") &&
                     deliveryTypeSelect.options.selectedIndex === 0) {
            deliveryInfoBlock.classList.remove("form__info-block--purchases-with-neighboor");
          }
        }
        deliveryInfoBlock.show();
        break;
      case "Автотранспортом":
        if (deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor")) {
          deliveryInfoBlock.classList.remove("form__info-block--purchases-with-neighboor");
        }
        if (yesDeliverableInfoBlock.classList.contains("form__info-block--deliverable-with-neighboor")) {
          yesDeliverableInfoBlock.classList.remove("form__info-block--deliverable-with-neighboor");
        }
        if (noDeliverableInfoBlock.classList.contains("form__info-block--deliverable-with-neighboor")) {
          noDeliverableInfoBlock.classList.remove("form__info-block--deliverable-with-neighboor");
        }
        yesDeliverableInfoBlock.hide();
        deliveryInfoBlock.show();
    }
  }

  var deliverableSelect = document.querySelector(".form__input--deliverable");
  var noDeliverableInfoBlock = document.querySelector(".form__info-block--no-deliverable");
  noDeliverableInfoBlock.show = show;
  noDeliverableInfoBlock.hide = hide;
  var yesDeliverableInfoBlock = document.querySelector(".form__info-block--yes-deliverable");
  yesDeliverableInfoBlock.show = show;
  yesDeliverableInfoBlock.hide = hide;
  var deliveryType = document.querySelector(".form__label--delivery-type");
  deliveryType.show = show;
  deliveryType.hide = hide;

  deliverableSelect.onchange = function () {
    var n = this.options.selectedIndex;
    switch (this.options[n].getAttribute("value")) {
      case "Не могу доставить":
        deliveryType.hide();
        yesDeliverableInfoBlock.hide();
        noDeliverableInfoBlock.show();
        if (noDeliverableInfoBlock.classList.contains("form__info-block--deliverable-with-neighboor")) {
          noDeliverableInfoBlock.classList.remove("form__info-block--deliverable-with-neighboor")
        }
        if (deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor")) {
          deliveryInfoBlock.classList.remove("form__info-block--purchases-with-neighboor");
        }
        if (yesDeliverableInfoBlock.classList.contains("form__info-block--deliverable-with-neighboor")) {
          yesDeliverableInfoBlock.classList.remove("form__info-block--deliverable-with-neighboor")
        }
        break;
      case "Могу доставить":
        deliveryType.show();
        noDeliverableInfoBlock.hide();
        if (deliveryTypeSelect.options.selectedIndex === 2) {
          yesDeliverableInfoBlock.show();
          if (!yesDeliverableInfoBlock.classList.contains("form__info-block--deliverable-with-neighboor") &&
              deliveryTypeSelect.options.selectedIndex !== 0) {
            yesDeliverableInfoBlock.classList.add("form__info-block--deliverable-with-neighboor")
            if (!deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor")) {
              deliveryInfoBlock.classList.add("form__info-block--purchases-with-neighboor");
            }
          } else if (yesDeliverableInfoBlock.classList.contains("form__info-block--deliverable-with-neighboor") &&
                     deliveryTypeSelect.options.selectedIndex === 0) {
             yesDeliverableInfoBlock.classList.remove("form__info-block--deliverable-with-neighboor")
             if (deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor")) {
               deliveryInfoBlock.classList.remove("form__info-block--purchases-with-neighboor");
            }
          }
          if (!deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor") &&
              deliveryTypeSelect.options.selectedIndex !== 0) {
            deliveryInfoBlock.classList.add("form__info-block--purchases-with-neighboor");
          } else if (deliveryInfoBlock.classList.contains("form__info-block--purchases-with-neighboor") &&
                     deliveryTypeSelect.options.selectedIndex === 0) {
            deliveryInfoBlock.classList.remove("form__info-block--purchases-with-neighboor");
          }
        }
        break;
      default:
        yesDeliverableInfoBlock.hide();
        noDeliverableInfoBlock.hide();
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

  var activeMenuLink = document.querySelector(".menu__item--active .menu__link");
  activeMenuLink.onclick = function (e) {
    return false;
  }

  var servicesMenuLink = document.querySelector(".menu__link--services");
  servicesMenuLink.onclick = function (e) {
    return false;
  }

  function show() {
    if (!this.classList.contains("jsShow")) {
      this.classList.add("jsShow");
    }
  };

  function hide() {
    if (this.classList.contains("jsShow")) {
      this.classList.remove("jsShow");
    }
  };

  function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }
})();