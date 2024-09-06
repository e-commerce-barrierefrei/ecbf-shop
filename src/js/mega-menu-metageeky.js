/* Folgendes ist ein nur leicht angepasstes https://github.com/metageeky/mega-menu
unter https://www.mozilla.org/en-US/MPL/2.0/ */

import * as hoverintent from "hoverintent";

window.addEventListener('load', function(event) {
  // REWRITE NAV TO BE CLOSEST megamenu
  let megamenu = document.querySelector('.mega-menu');
  let responsiveWidth = parseInt(megamenu.getAttribute('data-responsive-width'));

  // toggle button for the responsive menu
  let responsive = megamenu.querySelector('button.responsive-toggle');
  responsive.addEventListener('click', function(evt) {
    // open menu
    if(evt.target.getAttribute('aria-expanded') == 'false') {
      evt.target.setAttribute('aria-expanded', 'true');
      megamenu.setAttribute('data-menu-state', 'focus');
    }
    // close menu
    else {
      evt.target.setAttribute('aria-expanded', 'false');
      megamenu.setAttribute('data-menu-state', 'closed');
    }
  });

  // events for the top-level menu buttons for dropdowns
  let triggers = megamenu.querySelectorAll('button.mega-menu-toggle');
  const urlParams = new URLSearchParams(window.location.search);

  for(let e of triggers) {
    //click events for the top-level menu buttons for dropdowns

    // Wenn kein Debug Parameter, der eine Nur-Hover-Navi auf dem Desktop simulieren soll, oder unabhängig davon mobil:
    if (urlParams.get("debug") !== "nur-hover-hauptnav" || document.body.classList.contains('mobile')) {

      e.addEventListener('click', function(evt) {
        let opened_menu = megamenu.querySelector('.mega-menu .mega-menu-toggle[aria-expanded="true"]');
        // in the case of hover open, a click just switches the state to focus open
        // only happens in non-responsive mode
        if (megamenu.getAttribute('data-menu-state') == 'hover') {
          megamenu.setAttribute('data-menu-state', 'focus');
          responsive.setAttribute('aria-expanded', 'true');
          evt.target.focus();
          return;
        }

        // close any sub menus opened previously
        if (opened_menu != null && evt.target != opened_menu) {
          // close other opened_menu
          opened_menu.setAttribute('aria-expanded', 'false');
        }

        // open menu
        if (evt.target.getAttribute('aria-expanded') == 'false') {
          evt.target.setAttribute('aria-expanded', 'true');
          megamenu.setAttribute('data-menu-state', 'focus');
          responsive.setAttribute('aria-expanded', 'true');
        }
        // close menu
        else {
          evt.target.setAttribute('aria-expanded', 'false');
          megamenu.setAttribute('data-menu-state', 'closed');
          if (document.body.offsetWidth > responsiveWidth)
            responsive.setAttribute('aria-expanded', 'false');
        }
      });

    }
  //}

    // hover
    hoverintent(e,
      function(evt) {
        if(document.body.offsetWidth <= responsiveWidth)
          return;
        // ignore hover effects if menu has been opened by focus
        if(megamenu.getAttribute('data-menu-state') == 'focus')
          return;
        megamenu.setAttribute('data-menu-state', 'hover');
        evt.target.setAttribute('aria-expanded', 'true');
      },
      function(evt) {
        if(document.body.offsetWidth <= responsiveWidth)
          return;
        // if a focus in the menu has happened, take precedent
        if(megamenu.getAttribute('data-menu-state') == 'focus')
          return;
        // if relatedTarget is an open mega-sub-menu, don't close
        if(evt.relatedTarget != null && evt.relatedTarget.classList.contains('mega-sub-menu'))
          return;
        megamenu.setAttribute('data-menu-state', 'closed');
        evt.target.setAttribute('aria-expanded', 'false');
      }).options({timeout: 200, interval: 50,});

  }

  // blur used to detect if focus has moved out of the mega menu
  let focusables = megamenu.querySelectorAll('.mega-sub-menu a, button.mega-menu-toggle');
  for(let e of focusables) {
    e.addEventListener('blur', function(evt) {
      if(megamenu.getAttribute('data-menu-state') != 'focus')
        return;
      // detect window change and don't close things
      if(document.activeElement === this)
        return;

      // if click on non-clickable, close the menu
      if(evt.relatedTarget == null) {
        megamenu.setAttribute('data-menu-state', 'closed');
        megamenu.querySelector('.mega-menu-toggle[aria-expanded="true"]').setAttribute('aria-expanded', 'false');
        responsive.setAttribute('aria-expanded', 'false');
      }
      // focus moved to another focusable element not in the mega menu
      else if(evt.relatedTarget != null && evt.relatedTarget.closest('.mega-menu') == null) {
        megamenu.setAttribute('data-menu-state', 'closed');
        megamenu.querySelector('.mega-menu-toggle[aria-expanded="true"]').setAttribute('aria-expanded', 'false');
        responsive.setAttribute('aria-expanded', 'false');
      }
    });
  }


  let subs = megamenu.querySelectorAll('div.mega-sub-menu');
  for(let e of subs) {
    e.addEventListener('focus', function(evt) {
      // if in hover state and click on the opened menu, switch to focus with focus on toggle
      if(megamenu.getAttribute('data-menu-state') == 'hover') {
        megamenu.setAttribute('data-menu-state', 'focus');
        evt.target.previousElementSibling.focus();
      }
      // move the focus back to whatever what lost focus when the sub-menu was clicked
      else if(megamenu.getAttribute('data-menu-state') == 'focus' && evt.relatedTarget != null) {
        evt.relatedTarget.focus();
      }
    });
  }



  let submenus = document.querySelectorAll('button.mega-menu-toggle + div.mega-sub-menu');
  for(let e of submenus) {
    // handle hovering moving from opened sub-menu to the toggle button that controls it
    e.addEventListener('mouseleave', function(evt) {
      if(document.body.offsetWidth <= responsiveWidth)
        return;
      if(megamenu.getAttribute('data-menu-state') == 'focus')
        return;
      // target is the div.sub-menu, related target is the toggle button before it
      if(evt.relatedTarget != null && evt.relatedTarget == evt.target.previousElementSibling)
        return;

      megamenu.setAttribute('data-menu-state', 'closed');
      let open_toggle_button = document.querySelector('.mega-menu button[aria-expanded="true"]');
      if(open_toggle_button)
        open_toggle_button.setAttribute('aria-expanded','false');
    });
  }

  let menuLinks = document.querySelectorAll('button.mega-menu-toggle + div.mega-sub-menu a');
  for(let e of menuLinks) {
    e.addEventListener('focus', function(evt) {
      // if already having focus in the mega menu, not an issue
      if(megamenu.getAttribute('data-menu-state') == 'focus')
        return;
      // set focus state
      megamenu.setAttribute('data-menu-state', 'focus');
      responsive.setAttribute('aria-expanded', 'true');
    });
  }

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape') {
      let menu = document.querySelector('.mega-menu');

      if(document.body.offsetWidth <= responsiveWidth) {
        // responsive mode
        //if there is a focused element, reset focus to responsive toggle
        if(	document.activeElement != null &&
          document.activeElement != document.body &&
          document.activeElement.closest('.mega-menu') !== null
        ) {
          menu.querySelector('.responsive-toggle').focus();
        }

        // set all things to close
        for(let b of menu.querySelectorAll('button[aria-expanded="true"]'))
          b.setAttribute('aria-expanded','false');
      }
      else {
        // desktop mode
        let bu1 = menu.querySelector('button.mega-menu-toggle[aria-expanded="true"]');

        bu1?.setAttribute('aria-expanded','false');
        bu1?.focus();

        menu.setAttribute('data-hover-open', 'false');
        menu.setAttribute('data-menu-state', 'closed');
      }
    }
  });
});
