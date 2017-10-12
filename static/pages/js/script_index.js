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

  var activeMenuLink = document.querySelector(".menu__item--active .menu__link");
  activeMenuLink.onclick = function (e) {
    return false;
  }

  var servicesMenuLink = document.querySelector(".menu__link--services");
  servicesMenuLink.onclick = function (e) {
    return false;
  }
})();