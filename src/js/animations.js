export function animations() {

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const hasReducedMotionPreference = localStorage.getItem('animating') === "false";
  const button = document.querySelector('#festive-animation-ani-toggle');

  function mQDetection() {
    if (mediaQuery.matches) {
      document.body.classList.add('allows-animation');
      document.body.classList.add('show-animation-controls');
      localStorage.setItem('animating', 'true');
    } else {
      document.body.classList.remove('allows-animation');
      document.body.classList.remove('show-animation-controls');
      localStorage.setItem('animating', 'false');
    }
  }

  if (mediaQuery.matches && !hasReducedMotionPreference) {
    document.body.classList.add('allows-animation');
    document.body.classList.add('show-animation-controls');
    button.textContent = "Animation pausieren";

  } else {
    document.body.classList.remove('allows-animation');
    button.textContent = "Animation starten";
  }

  if (hasReducedMotionPreference) {
    button.textContent = "Animation starten";
  }

  if (localStorage.getItem('animating') === 'false') {
    document.body.classList.remove('allows-animation');
    document.body.classList.add('show-animation-controls');
    button.textContent = "Animation starten";
  }

  mQDetection();

  mediaQuery.addEventListener('change', () => {
    mQDetection();
  });

  button.addEventListener('click', () => {

      if (document.body.classList.contains('allows-animation')) {
        // Animation ausstellen
        document.body.classList.remove('allows-animation');
        localStorage.setItem('animating', 'false');
        button.textContent = "Animation starten";
      } else {
        // Animation anstellen
        document.body.classList.add('allows-animation');
        localStorage.setItem('animating', 'true');
        button.textContent = "Animation pausieren";

      }
    }
  )
}
