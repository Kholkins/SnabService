"use strict";

(function () {
  var goods = document.querySelectorAll(".goods__element");
  var goodHoverBorderTop = document.createElement("div");
  goodHoverBorderTop.className = "jsGoodHoverBorder jsGoodHoverBorder--Top";
  var goodHoverBorderBottom = document.createElement("div");
  goodHoverBorderBottom.className = "jsGoodHoverBorder jsGoodHoverBorder--Bottom";
  var goodHoverBorderLeft = document.createElement("div");
  goodHoverBorderLeft.className = "jsGoodHoverBorder jsGoodHoverBorder--Left";
  var goodHoverBorderRight = document.createElement("div");
  goodHoverBorderRight.className = "jsGoodHoverBorder jsGoodHoverBorder--Right";
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

  [].forEach.call(goods, function (item, i, arr) {
    item.product_id = i;

    item.metalType = item.parentElement.parentElement.parentElement.getAttribute("id");

    item.category = item.parentElement.parentElement.firstElementChild.innerHTML;

    var amountSection = item.querySelector(".goods__value--amount");
    var amountParameter = amountSection.querySelector("input");
    amountParameter.onchange = function (e) {
      if (parseInt(this.value) >= 0) {
        item.setAmount(parseInt(this.value));
      } else {
        item.setAmount(0);
      }
    }

    item.getAmount = function () {
      return parseInt(amountParameter.getAttribute("value"));
    }

    item.setAmount = function (newValue) {
      if (newValue !== parseInt(amountParameter.getAttribute("value"))) {
        amountParameter.setAttribute("value", newValue);

        var sumParameter = this.querySelector(".goods__parameter--sum");
        if (newValue) {
          sumParameter.innerHTML = newValue * parseInt(this.querySelector(".goods__parameter--price").innerHTML);

          cart.addItem(this);
          this.activateSelectedStyle();
        } else {
          sumParameter.innerHTML = "- - -";

          cart.removeItem(this);
          this.deactivateSelectedStyle();
        };

        if (cart.querySelector(".cart__sum")) {
          cart.removeChild(cart.querySelector(".cart__sum"));
        }
        var sum = document.createElement("p");
        sum.className = "cart__sum";
        sum.innerHTML = "<span class='cart__sum--key'>Итог:</span> <span class='cart__sum--value'>" + cart.getSum() + " <span class='ruble'>&#8399;</span>"
        cart.appendChild(sum);
      }
    }

    var increaseArrow = item.querySelector(".goods__arrow--up");
    increaseArrow.onclick = function () {
      var newValue = item.getAmount() + 1;
      amountParameter.value = newValue;
      amountParameter.onchange();
    };

    var decreaseArrow = item.querySelector(".goods__arrow--down");
    decreaseArrow.onclick = function () {
      if (item.getAmount() > 0) {
        var newValue = item.getAmount() - 1;
        amountParameter.value = newValue;
        amountParameter.onchange();
      };
    }

    item.onmouseenter = function (e) {
      if (!this.parentElement.querySelector(".jsGoodHoverBorder") && !this.querySelector(".goods__parameter--selected")) {
        this.parentElement.appendChild(goodHoverBorderTop);
        this.parentElement.appendChild(goodHoverBorderBottom);
        this.parentElement.appendChild(goodHoverBorderLeft);
        this.parentElement.appendChild(goodHoverBorderRight);
        goodHoverBorderTop.style.top = goodHoverBorderLeft.style.top = goodHoverBorderRight.style.top = getCoords(this).top + "px";
        goodHoverBorderBottom.style.top = getCoords(this).top + this.offsetHeight + "px";
        goodHoverBorderRight.style.left = getCoords(this).left + this.offsetWidth + "px";
        if (this.metalType === "Арматура") {
          goodHoverBorderTop.style.left = goodHoverBorderBottom.style.left = goodHoverBorderLeft.style.left = getCoords(this).left + this.querySelector(".goods__parameter:first-of-type").offsetWidth + "px";
          goodHoverBorderTop.style.width = goodHoverBorderBottom.style.width = this.offsetWidth - this.querySelector(".goods__parameter:first-of-type").offsetWidth + "px";
        } else {
          goodHoverBorderTop.style.left = goodHoverBorderBottom.style.left = goodHoverBorderLeft.style.left = getCoords(this).left + "px";
          goodHoverBorderTop.style.width = goodHoverBorderBottom.style.width = this.offsetWidth + "px";
        }
        goodHoverBorderLeft.style.height = goodHoverBorderRight.style.height = this.querySelector(".goods__parameter:last-of-type").offsetHeight + "px";
      }
    };

    item.onmouseleave = function (e) {
      if (this.parentElement.querySelector(".jsGoodHoverBorder")) {
        this.parentElement.removeChild(goodHoverBorderTop);
        this.parentElement.removeChild(goodHoverBorderBottom);
        this.parentElement.removeChild(goodHoverBorderLeft);
        this.parentElement.removeChild(goodHoverBorderRight);
      }
    };

    item.activateSelectedStyle = function () {
      if (this.getAmount()) {
        var parameters = this.querySelectorAll(".goods__parameter");
        [].forEach.call(parameters, function (parameter, i, arr) {
          if (!parameter.classList.contains("goods__parameter--selected")) {
            parameter.classList.add("goods__parameter--selected");
          }
        });
        if (this.querySelector(".goods__parameter--shape") && this.querySelector(".goods__parameter--shape").classList.contains("goods__parameter--selected")) {
          this.querySelector(".goods__parameter--shape").classList.remove("goods__parameter--selected");
        }
        this.onmouseleave();
      }
    }

    amountParameter.onfocus = function (e) {
      var amountSection = this.parentElement.parentElement;
      if (!amountSection.classList.contains("goods__parameter--focus") &&
          amountSection.classList.contains("goods__parameter--selected")) {
        amountSection.classList.add("goods__parameter--focus");
        amountSection.previousElementSibling.style.borderRightColor = "#b5daee";
      }
    }

    amountParameter.onblur = function (e) {
      var amountSection = this.parentElement.parentElement;
      if (amountSection.classList.contains("goods__parameter--focus")) {
        amountSection.classList.remove("goods__parameter--focus");
        amountSection.previousElementSibling.style.borderRightColor = "";
      }
    }

    item.deactivateSelectedStyle = function () {
      if (!this.getAmount()) {
        var parameters = this.querySelectorAll(".goods__parameter");
        this.querySelector(".goods__parameter--amount").previousElementSibling.style.borderRightColor = "";
        [].forEach.call(parameters, function (parameter, i, arr) {
          if (parameter.classList.contains("goods__parameter--selected")) {
            parameter.classList.remove("goods__parameter--selected");
          }
        });
        this.onmouseenter();
      }
    }
  });

  var cart = document.querySelector(".cart");

  cart.__findItem = function (item) {
    var cartItems = cart.querySelectorAll(".goods__element");
    for (var i = 0; i < cartItems.length; ++i) {
      if (item.product_id == cartItems[i].product_id) {
        return cartItems[i];
      }
    };
  }

  cart.__findTable = function (item) {
    var cartTables = document.querySelectorAll(".goods__table");
    var searchableTableCaption = item.metalType + " " + item.category;
    for (var i = 0; i < cartTables.length; ++i) {
      if (searchableTableCaption == cartTables[i].querySelector("caption").innerHTML) {
        return cartTables[i];
      }
    };
  }

  cart.__createTable = function (item) {
    var newTable = item.parentElement.parentElement.cloneNode(true);
    newTable.classList.add("goods__table--cart");
    var newTableBody = newTable.querySelector("tbody");
    if (newTable.querySelector(".jsGoodHoverBorder")) {
      newTableBody.removeChild(newTableBody.querySelector(".jsGoodHoverBorder--Top"));
      newTableBody.removeChild(newTableBody.querySelector(".jsGoodHoverBorder--Bottom"));
      newTableBody.removeChild(newTableBody.querySelector(".jsGoodHoverBorder--Left"));
      newTableBody.removeChild(newTableBody.querySelector(".jsGoodHoverBorder--Right"));
    }
    var newTableElements = newTable.querySelectorAll(".goods__element");
    [].forEach.call(newTableElements, function (newTableElement, i, arr) {
      newTableBody.removeChild(newTableElement);
    });
    var newTableCaption = newTable.querySelector("caption");
    newTableCaption.innerHTML = item.metalType + " " + item.category;
    cart.appendChild(newTable);

    return newTable;
  }

  cart.addItem = function (item) {
    if (!this.classList.contains("jsShow")) {
      this.classList.add("jsShow");
    }

    var cartItem = item.cloneNode(true);
    cartItem.product_id = item.product_id;
    cartItem.metalType = item.metalType;
    cartItem.category = item.category;
    cartItem.querySelector("input").setAttribute("form", "form");

    cartItem.onmouseenter = function (e) {
      if (!this.parentElement.querySelector(".jsGoodHoverBorder")) {
        this.parentElement.appendChild(goodHoverBorderTop);
        this.parentElement.appendChild(goodHoverBorderBottom);
        this.parentElement.appendChild(goodHoverBorderLeft);
        this.parentElement.appendChild(goodHoverBorderRight);
        goodHoverBorderTop.style.top = goodHoverBorderLeft.style.top = goodHoverBorderRight.style.top = getCoords(this).top + "px";
        goodHoverBorderBottom.style.top = getCoords(this).top + this.offsetHeight + "px";
        goodHoverBorderRight.style.left = getCoords(this).left + this.offsetWidth + "px";
        if (this.metalType === "Арматура") {
          goodHoverBorderTop.style.left = goodHoverBorderBottom.style.left = goodHoverBorderLeft.style.left = getCoords(this).left + this.querySelector(".goods__parameter:first-of-type").offsetWidth + "px";
          goodHoverBorderTop.style.width = goodHoverBorderBottom.style.width = this.offsetWidth - this.querySelector(".goods__parameter:first-of-type").offsetWidth + "px";
        } else {
          goodHoverBorderTop.style.left = goodHoverBorderBottom.style.left = goodHoverBorderLeft.style.left = getCoords(this).left + "px";
          goodHoverBorderTop.style.width = goodHoverBorderBottom.style.width = this.offsetWidth + "px";
        }
        goodHoverBorderLeft.style.height = goodHoverBorderRight.style.height = this.querySelector(".goods__parameter:last-of-type").offsetHeight + "px";
      }
    };

    cartItem.onmouseleave = function (e) {
      if (this.parentElement.querySelector(".jsGoodHoverBorder")) {
        this.parentElement.removeChild(goodHoverBorderTop);
        this.parentElement.removeChild(goodHoverBorderBottom);
        this.parentElement.removeChild(goodHoverBorderLeft);
        this.parentElement.removeChild(goodHoverBorderRight);
      }
    };

    if (item.metalType === "Арматура") {
      var shapeParameter = cartItem.querySelector(".goods__parameter--shape");
      if (shapeParameter) {
        shapeParameter.setAttribute("rowspan", "1");
      } else {
        var previousElement = item.previousElementSibling;
        while (!previousElement.querySelector(".goods__parameter--shape")) {
          previousElement = previousElement.previousElementSibling;
        }
        shapeParameter = document.createElement("td");
        shapeParameter.className = "goods__parameter goods__parameter--shape";
        cartItem.insertBefore(shapeParameter, cartItem.querySelector(".goods__parameter--diameter"));
        shapeParameter.innerHTML = previousElement.querySelector(".goods__parameter--shape").innerHTML;
      }
    }

    var amountSection = cartItem.querySelector(".goods__value--amount");
    var amountParameter = amountSection.querySelector("input");
    amountParameter.onchange = function (e) {
      if (parseInt(this.value) >= 0) {
        cartItem.setAmount(parseInt(this.value));
      } else {
        cartItem.setAmount(0);
      }
    }

    cartItem.getAmount = function () {
      return parseInt(amountParameter.getAttribute("value"));
    }

    cartItem.setAmount = function (newValue) {
      if (newValue !== parseInt(amountParameter.getAttribute("value"))) {
        amountParameter.value = newValue;

        var sumParameter = this.querySelector(".goods__parameter--sum");
        if (newValue) {
          sumParameter.innerHTML = newValue * parseInt(this.querySelector(".goods__parameter--price").innerHTML);
        } else {
          sumParameter.innerHTML = "- - -";
        };

        var amountParameterClone = this.querySelector("input");
        var amountParameterOriginal = item.querySelector("input");
        amountParameterOriginal.value = amountParameterClone.value;
        amountParameterOriginal.onchange();

        var sumParameterClone = this.querySelector(".goods__parameter--sum");
        var sumParameterOriginal = item.querySelector(".goods__parameter--sum");
        sumParameterOriginal.innerHTML = sumParameterClone.innerHTML;

        if (!this.getAmount()) {
          cart.removeItem(this);
        }

        if (cart.querySelector(".cart__sum")) {
          cart.removeChild(cart.querySelector(".cart__sum"));
        }
        var sum = document.createElement("p");
        sum.className = "cart__sum";
        sum.innerHTML = "<span class='cart__sum--key'>Итог:</span> <span class='cart__sum--value'>" + cart.getSum() + " <span class='ruble'>&#8399;</span>"
        cart.appendChild(sum);
      }
    }

    cartItem.onkeypress = function (e) {
      if (e.keyCode === 13) {
        amountParameter.onchange();
        return false;
      }
    }

    var increaseArrow = cartItem.querySelector(".goods__arrow--up");
    increaseArrow.onclick = function () {
      var newValue = item.getAmount() + 1;
      amountParameter.value = newValue;
      amountParameter.onchange();
      var amountParameterOriginal = item.querySelector("input");
      amountParameterOriginal.value = newValue;
      amountParameterOriginal.onchange();
    };

    var decreaseArrow = cartItem.querySelector(".goods__arrow--down");
    decreaseArrow.onclick = function () {
      if (cartItem.getAmount() > 0) {
        var newValue = item.getAmount() - 1;
        amountParameter.value = newValue;
        amountParameter.onchange();
        var amountParameterOriginal = item.querySelector("input");
        amountParameterOriginal.value = newValue;
        amountParameterOriginal.onchange();
      };
    }

    if (this.__findItem(item)) {
      this.__findItem(item).setAmount(item.getAmount());
    } else if (this.__findTable(item)) {
      this.__findTable(item).querySelector("tbody").appendChild(cartItem);
    } else {
      this.__createTable(item).querySelector("tbody").appendChild(cartItem);
    }
  }

  cart.removeItem = function (item) {
    if (this.__findItem(item).parentElement.children.length < 3) {
      this.__findTable(item).parentElement.removeChild(this.__findTable(item));
    } else {
      this.__findItem(item).parentElement.removeChild(this.__findItem(item));
    }

    var cartItems = this.querySelectorAll(".goods__element");
    if (cartItems.length === 0 && this.classList.contains("jsShow")) {
      this.classList.remove("jsShow");
    }
  }

  cart.getSum = function () {
    var result = 0;
    var cartItems = this.querySelectorAll(".goods__element");
    for (var i = 0; i < cartItems.length; ++i) {
      result += parseInt(cartItems[i].querySelector(".goods__parameter--sum").innerHTML);
    }

    return result;
  }

  var deliveryInfoBlock = document.querySelector(".form__info-block--delivery");
  deliveryInfoBlock.show = show;
  deliveryInfoBlock.hide = hide;

  var stationLabel = document.querySelector(".form__label--station");
  stationLabel.show = show;
  stationLabel.hide = hide;

  var addressLabel = document.querySelector(".form__label--address");
  addressLabel.show = show;
  addressLabel.hide = hide;

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

  var deliveryTypeSelect = document.querySelector(".form__input--delivery");
  var deliveryTypeOptions = deliveryTypeSelect.querySelectorAll("option");

  deliveryTypeSelect.onchange = function () {
    var n = this.options.selectedIndex;
    switch (this.options[n].getAttribute("value")) {
      case "Самовывозом":
        addressLabel.hide();
        stationLabel.hide();
        deliveryInfoBlock.show();
        break;
      case "Железной дорогой":
        deliveryInfoBlock.hide();
        addressLabel.hide();
        stationLabel.show();
        break;
      case "Автотранспортом":
        deliveryInfoBlock.hide();
        stationLabel.hide();
        addressLabel.show();
    }
  }

  var goodsMenu = document.querySelector(".goods__menu");
  var goodsSectionsBlock = document.querySelector(".goods__sections");
  var lastGoodsTable = goodsSectionsBlock.querySelector(".goods__section:last-child").querySelector(".goods__table:last-child");
  var topGoodsMenuCoords = getCoords(goodsMenu).top;
  var header = document.querySelector("header");
  var FIXED_MENU_MARGIN_TOP = 20;
  var BOTTOM_STOP_DISTANCE  = getCoords(lastGoodsTable).top + lastGoodsTable.offsetHeight - goodsMenu.offsetHeight - FIXED_MENU_MARGIN_TOP - header.offsetHeight;
  var TOP_STOP_DISTANCE = topGoodsMenuCoords - header.offsetHeight - FIXED_MENU_MARGIN_TOP;

  var goodsItems = goodsMenu.querySelectorAll(".goods__item");
  [].forEach.call(goodsItems, function (goodsItem, i, arr) {
    goodsItem.activate = function () {
      if (!this.classList.contains("goods__item--active")) {
        this.classList.add("goods__item--active");
      }
    }
    goodsItem.deactivate = function () {
      if (this.classList.contains("goods__item--active")) {
        this.classList.remove("goods__item--active");
      }
    }
  });

  window.onscroll = function (e) {
    if (pageYOffset >= TOP_STOP_DISTANCE
        && pageYOffset < BOTTOM_STOP_DISTANCE
        && !goodsMenu.classList.contains("goods__menu--fixed")) {
      goodsMenu.style.marginTop = "80px";
      goodsMenu.classList.add("goods__menu--fixed");
    } else if ((pageYOffset >= BOTTOM_STOP_DISTANCE
                || pageYOffset < TOP_STOP_DISTANCE)
                && goodsMenu.classList.contains("goods__menu--fixed")) {
      goodsMenu.classList.remove("goods__menu--fixed");
      if (pageYOffset >= BOTTOM_STOP_DISTANCE) {
        goodsMenu.style.marginTop = 113 + BOTTOM_STOP_DISTANCE - TOP_STOP_DISTANCE + "px";
      } else if (pageYOffset <= TOP_STOP_DISTANCE) {
        goodsMenu.style.marginTop = "113px";
      }
    }
    var goodsSections = goodsSectionsBlock.querySelectorAll(".goods__section");
    [].forEach.call(goodsSections, function (goodsSection, i, arr) {
      if (pageYOffset >= getCoords(goodsSection).top - header.offsetHeight
          && pageYOffset < getCoords(goodsSection).top + goodsSection.offsetHeight - header.offsetHeight) {
        goodsItems[i].activate();
      } else {
        goodsItems[i].deactivate();
      }
    });

    if (pageYOffset === 0) {
      header.uncompress();
    } else {
      header.compress();
    }
  }

  var salesForm = document.querySelector(".form-section__form--order");
  var fileLabel = salesForm.querySelector(".form__label--documents");
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
          case "pdf":
          case "doc":
          case "docx":
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
          salesForm.insertBefore(cloneFileLabel, fileLabel);
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
      console.log("change");
      if (!select.classList.contains("jsSelectChanged")) {
        console.log("add");
        select.classList.add("jsSelectChanged");
      }
    });
  });

  function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }

  // event.type должен быть keypress
  function getChar(event) {
    if (event.which == null) { // IE
      if (event.keyCode < 32) return null; // спец. символ
      return String.fromCharCode(event.keyCode)
    }

    if (event.which != 0 && event.charCode != 0) { // все кроме IE
      if (event.which < 32) return null; // спец. символ
      return String.fromCharCode(event.which); // остальные
    }

    return null; // спец. символ
  }
})();