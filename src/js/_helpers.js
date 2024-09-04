export function toggleAriaExpanded(el) {
  el.addEventListener('click', (e) => {
    let setExpanded = e.target.getAttribute("aria-expanded") === "true" ? "false" : "true";

    if (e.target.tagName === "BUTTON" || e.target.tagName === "A") {
      e.target.setAttribute("aria-expanded", setExpanded);
    }
  })
}

export function isMobile() {
  const mq = window.matchMedia("(max-width: 40em)");
  mq.matches ? setToMobile() : setToDesktop();
  mq.addEventListener("change", (event) =>
    event.matches ? setToMobile() : setToDesktop()
  );

  function setToDesktop() {
    document.body.classList.add("desktop");
    document.body.classList.remove("mobile");
  }

  function setToMobile() {
    document.body.classList.add("mobile");
    document.body.classList.remove("desktop");
  }
}

export function validateEmail(email) {
  var re =
    /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

  return re.test(email);
}
