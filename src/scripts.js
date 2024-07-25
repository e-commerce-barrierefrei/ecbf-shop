import "./js/mega-menu-metageeky";
import "./js/resize";

// Custom Elements
import  "./js/ecbf-combobox-search";


import { isMobile, toggleAriaExpanded } from "./js/_helpers";
import { initCarousel } from "./js/carousel";
import { animations } from "./js/animations";

import { sorting } from "./js/sorting";
import { formManagement } from "./js/form-management";

let mainSearchToggle = document.getElementById("main-search-toggle");

const cookieModal = document.querySelector("#cookie-modal");
const cartModal = document.querySelector("#cart-modal");
//const cookieModal = document.querySelector("#cookie-modal");
const cookieModalTrigger = document.querySelector("[data-cookie-modal-trigger]");
const cartModalTriggers = document.querySelectorAll("[data-cart-modal-trigger]");


cartModalTriggers.forEach((cartModalTrigger) => {
  cartModalTrigger.addEventListener('click', () => {
    cartModal.showModal();
  })
})


cookieModalTrigger.addEventListener('click', () => {
  cookieModal.showModal();
});

// Vermeide, dass sich der Cookie Modal per ESC schließen lässt, was das Standardverhalten bei modalen Dialogen ist
cookieModal.addEventListener('cancel', (event) => {
  event.preventDefault();
});




const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("cookiebanner") === "1") {
  cookieModal.showModal();
}

if (document.getElementById("c")) {
  initCarousel();
}

if (document.querySelector(".xmas")) {
  animations();
}

if (document.querySelector("[data-order]")) {
  formManagement();
}

if (document.querySelector("#produktliste")) {
  sorting();
}





isMobile();

import { cart } from "./js/cart";

cart();


import jsondata from '../data.json';
console.log(jsondata);

// eslint-disable-next-line no-undef
PetiteVue.createApp().mount("#content");

const triggerBigImageDialog = document.querySelector('#trigger-big-image-dialog');
const bigImageDialog = document.querySelector('#big-image');

if (triggerBigImageDialog) {
  triggerBigImageDialog.addEventListener('click', function() {
    bigImageDialog.showModal();
  })
}
