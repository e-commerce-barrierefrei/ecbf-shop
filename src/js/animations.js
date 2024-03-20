export function animations() {

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const hasReducedMotionPreference = localStorage.getItem('animating') === "false";
    const button = document.querySelector('#xmas-ani-toggle');

    if (mediaQuery.matches ) {
        document.body.classList.add('allows-animation');
        document.body.classList.add('show-animation-controls');
    } else {
        document.body.classList.remove('allows-animation');
    }

    if (hasReducedMotionPreference) {
        button.setAttribute('aria-pressed', 'true');
    }

    if (localStorage.getItem('animating') === 'false') {
        document.body.classList.remove('allows-animation');
        document.body.classList.add('show-animation-controls');
    }


    mediaQuery.addEventListener('change', () => {
        if (mediaQuery.matches) {
            document.body.classList.add('allows-animation');
            document.body.classList.add('show-animation-controls');
            localStorage.setItem('animating', 'true');
        } else {
            document.body.classList.remove('allows-animation');
            document.body.classList.remove('show-animation-controls');
            localStorage.setItem('animating', 'false');
        }
    });


    button.addEventListener('click', () => {

            if (button.getAttribute('aria-pressed') === "false") {
                // Animation ausstellen
                document.body.classList.remove('allows-animation');
                button.setAttribute('aria-pressed', 'true');
                localStorage.setItem('animating', 'false');
            } else {
                // Animation anstellen
                document.body.classList.add('allows-animation');
                button.setAttribute('aria-pressed', 'false');
                localStorage.setItem('animating', 'true');

            }
        }
    )
}
