import {toggleAriaExpanded} from './_helpers';


export function megaMenu() {
    const navMain = document.getElementById('nav-main');
    const navMainButtons = navMain.querySelectorAll('.expando-trigger');
    const navMainLinks = navMain.querySelectorAll('.sektion');

    navMainButtons.forEach((navMainButton) => {
        navMainButton.addEventListener('click', () => {
            toggleAriaExpanded(navMainButton);
        });
    });

    // Registriere Event Listener, der auf die ESC-Taste hört und dann alle offenen Menüpunkte schließt
    navMainLinks.forEach((navMainLink) => {
        navMainLink.addEventListener('focusin', () => {
            navMainButtons.forEach((navMainButton) => {
                navMainButton.setAttribute('aria-expanded', 'false');
            });
        });
    });

    // Registriere Event Listener, der auf die ESC-Taste hört und dann alle offenen Menüpunkte schließt
    navMain.addEventListener('keyup', (event) => {
        if (event.code === "Escape") {
            navMainButtons.forEach((navMainButton) => {
                navMainButton.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Wenn eine Navigationssektion fokussiert wird, klappe alle eventuell offenen zu


    //
    // navMainSections.forEach((navMainSection) => {
    //     let navMainSectionLink = navMainSection.querySelector('a');
    //
    //     navMainSectionLink.setAttribute('role', 'button');
    //     navMainSectionLink.setAttribute('aria-expanded', 'false');
    //
    //     navMainSectionLink.addEventListener('click', (event) => {
    //         event.preventDefault();
    //         toggleAriaExpanded(navMainSectionLink);
    //     });
    //
    //     // `role="button"` verspricht eine Aktivierung mit Enter und Leertaste. Wir lösen das Versprechen ein:
    //     navMainSectionLink.addEventListener('keyup', (event) => {
    //
    //         if (event.code === "Space") {
    //
    //             // Schließe alle anderen offenen Menüs, wenn das aktuelle Menü geschlossen ist
    //             if (navMainSectionLink.getAttribute('aria-expanded') === "false") {
    //                 navMainSections.forEach((navMainSection) => {
    //                     navMainSection.querySelector('a').setAttribute('aria-expanded', 'false');
    //                 });
    //             }
    //
    //
    //             // Öffne oder schließe das aktuelle Menü
    //             toggleAriaExpanded(navMainSectionLink);
    //         }
    //     });
    //
    //     // Klappe Menüpunkt bei mouseenter auf, aber nur in der Desktop-Variante
    //     navMainSection.addEventListener('mouseenter', () => {
    //         if (document.body.classList.contains("desktop")) {
    //             navMainSectionLink.setAttribute('aria-expanded', 'true');
    //         }
    //     });
    //
    //     // Klappe Menüpunkt bei mouseleave zu, aber nur in der Desktop-Variante
    //     navMainSection.addEventListener('mouseleave', () => {
    //         if (document.body.classList.contains("desktop")) {
    //             navMainSectionLink.setAttribute('aria-expanded', 'false');
    //         }
    //     });
    //

    //
    //     // Wenn eine Navigationssektion fokussiert wird, klappe alle eventuell offenen zu
    //     navMainSectionLink.addEventListener('focusin', () => {
    //         if (document.body.classList.contains("desktop") ) {
    //             navMainSections.forEach((navMainSection) => {
    //                 navMainSection.querySelector('a').setAttribute('aria-expanded', 'false');
    //             });
    //         }
    //     });
    // })
}
