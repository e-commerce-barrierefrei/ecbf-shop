import { toggleAriaExpanded } from "./_helpers";

let mainSearchToggle = document.getElementById("main-search-toggle"),
  resizeFunc;

mainSearchToggle.setAttribute('aria-expanded', 'false');
toggleAriaExpanded(mainSearchToggle);


function resizeEndHappened(){
  if (window.getComputedStyle(mainSearchToggle).display !== "none") {

    mainSearchToggle.setAttribute('aria-expanded', 'false');
    toggleAriaExpanded(mainSearchToggle);
  }
}

window.onresize = function(){
  clearTimeout(resizeFunc);
  resizeFunc = setTimeout(resizeEndHappened, 100);
};
