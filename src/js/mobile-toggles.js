import { toggleAriaExpanded } from './_helpers';
export function mobileToggles() {
    const mainNavToggle = document.getElementById('main-nav-toggle');
    const mainSearchToggle = document.getElementById('main-search-toggle');

    // Eingeklappt starten
    mainNavToggle.setAttribute('aria-expanded', 'false');
    mainSearchToggle.setAttribute('aria-expanded', 'false');

    // Klick-Event ändert `aria-expanded`-Wert
    mainNavToggle.addEventListener('click', () => toggleAriaExpanded(mainNavToggle));
    mainSearchToggle.addEventListener('click', () => toggleAriaExpanded(mainSearchToggle));
}

