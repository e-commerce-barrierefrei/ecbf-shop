import "./js/mega-menu-metageeky";
import "./js/resize";
import  "./js/ecbf-combobox-search";
import { isMobile, toggleAriaExpanded } from "./js/_helpers";
import { initCarousel } from "./js/carousel";
import { sorting } from "./js/sorting";
import { formManagement } from "./js/form-management";
import { cart } from "./js/cart";

// eslint-disable-next-line
const mainSearchToggle = document.getElementById("main-search-toggle");
const cookieModal = document.querySelector("#cookie-modal");
const cartModal = document.querySelector("#cart-modal");
const urlParams = new URLSearchParams(window.location.search);
// eslint-disable-next-line
const cookieModalTrigger = document.querySelector("[data-cookie-modal-trigger]");
const cartModalTriggers = document.querySelectorAll("[data-cart-modal-trigger]");
const triggerBigImageDialog = document.querySelector('#trigger-big-image-dialog');
const bigImageDialog = document.querySelector('#big-image');

// Warenkorb
  cart();
  // eslint-disable-next-line no-undef
  PetiteVue.createApp().mount("#content");

  // Dialoge
  if (triggerBigImageDialog) {
    triggerBigImageDialog.addEventListener('click', function() {
      bigImageDialog.showModal();
    })
  }

  if (bigImageDialog) {
    bigImageDialog.addEventListener('click', function (event) {
      let rect = bigImageDialog.getBoundingClientRect();
      let isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
        && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        bigImageDialog.close();
      }
    });
  }

  cartModalTriggers.forEach((cartModalTrigger) => {
    cartModalTrigger.addEventListener('click', () => {
      cartModal.showModal();
    })
  })

  // Vermeide, dass sich der Cookie Modal per ESC schließen lässt, was das Standardverhalten bei modalen Dialogen ist
  cookieModal.addEventListener('cancel', (event) => {
    event.preventDefault();
  });




  // Debug
  if (urlParams.get("debug") === "hauptnav") {
    document.querySelector('.mega-menu-toggle').setAttribute('aria-expanded', 'true');
  }

  if (urlParams.get("debug") === "combobox") {
    setTimeout(() => {
      if (document.body.classList.contains("mobile")) {
        document.querySelector('#main-search-toggle').setAttribute('aria-expanded', 'true');
        document.querySelector('[role="listbox"]').style.width = document.querySelector('[role="combobox"]').getBoundingClientRect().width + "px";
      }
      document.querySelector('[role="combobox"]').setAttribute('aria-expanded', 'true');
    }, 500);
  }

  if (urlParams.get("debug") === "warenkorb") {
    cartModal.showModal();
  }

  if (urlParams.get("debug") === "cookiedialog") {
    cookieModal.showModal();
  }

// Erkenne die grobe Design-Ausprägung
  isMobile();

// Mein-Konto-Ausklappbereich im Header
  toggleAriaExpanded(document.querySelector('.account--widget__button'));


if (document.getElementById("c")) {
  initCarousel();
}

if (document.querySelector("[data-order]")) {
  formManagement();
}

if (document.querySelector("#produktliste")) {
  sorting();
}







