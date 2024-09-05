import { validateEmail } from "./_helpers";

export function formManagement() {
  let forms = document.querySelectorAll("[data-order]"),
    requiredFields,
    emailFields,
    registerUserCheckBox,
    passwordField1,
    passwordField2,
    passwordFieldHideShows,
    registerUserArea;

  forms.forEach((form) => {
    registerUserCheckBox = document.querySelector("#registerUser");
    passwordField1 = document.getElementById("logonData.loginPassword");
    passwordField1 = document.getElementById("logonData.loginPassword");
    passwordField2 = document.getElementById("logonData.loginPasswordRepeat");
    passwordFieldHideShows = document.querySelectorAll(".passwordHideShow");
    registerUserArea = document.getElementById("registerUserArea");

    registerUserCheckBox.addEventListener("change", (e) => {
      if (e.target.checked) {
        registerUserArea.removeAttribute("hidden");
      } else {
        registerUserArea.setAttribute("hidden", true);
      }
    });

    /**
     * @param {HTMLElement} passwordFieldHideShow
     */
    passwordFieldHideShows.forEach((passwordFieldHideShow) => {
      /**
       * @param {Event} e
       */
      passwordFieldHideShow.setAttribute("aria-pressed", "false");

      passwordFieldHideShow.addEventListener("click", (e) => {
        /** @const {HTMLElement} */
        const target = e.target;
        const liveRegion = target.nextElementSibling,
          passwordInput = target.previousElementSibling;


        if (passwordInput.getAttribute("type") === "password") {
          passwordInput.setAttribute("type", "text");
          target.setAttribute("aria-pressed", "true");

          liveRegion.textContent = "Password sichtbar";
        } else {
          passwordInput.setAttribute("type", "password");
          target.setAttribute("aria-pressed", "false");

          liveRegion.textContent = "Password unsichtbar";
        }
      });
    });

    /**
     * @param {Event} e
     */
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // requiredFields nicht cachen!
      requiredFields = document.querySelectorAll("[aria-required='true']");
      emailFields = document.querySelectorAll("input[type='email']");

      // Loope durch alle Pflichtfelder

      /**
       * @param {HTMLInputElement} requiredField
       */
      requiredFields.forEach((requiredField) => {

        // Ist "requiredField" ein Fieldset, in dem ein Input ausgewählt ist?
        let requiredFieldsetisChecked = requiredField.tagName === "FIELDSET" && !requiredField.querySelector("input:checked");

        // Erkenne nicht ausgefüllte oder nicht gecheckte Pflichtfelder oder Radiogroups in Fehlerzustand
        const fieldInputEmptyThoughRequired = (!requiredField.checked && requiredField.value === "") || !!requiredFieldsetisChecked;

        // Finde die ID der Fehlermeldung heraus
        let idRefRequired = requiredField.getAttribute("data-required-error");

        if (fieldInputEmptyThoughRequired) {
          // Setze unausgefüllte Pflichtfelder in einen semantischen Fehlerzustand
          requiredField.setAttribute("aria-invalid", "true");

          // Assoziiere den Fehlerneldungstext
          requiredField.setAttribute("aria-describedby", idRefRequired);

          // Macht die Fehlermeldungen auch visuell sichtbar
          document.getElementById(idRefRequired).removeAttribute("hidden");

          // Feld ausgefüllt? Dann etwaigen Fehlerzustand auflösen:
        } else {

            // Verknüpfung mit Fehlermeldung auflösen
            requiredField.removeAttribute("aria-describedby");
            document.getElementById(idRefRequired).setAttribute("hidden", true);

            // Semantischen Fehlerzustand auflösen
            requiredField.removeAttribute("aria-invalid");
        }

        let idRefMismatch = passwordField2.getAttribute(
          "data-pw-mismatch-error"
        );

        // Wenn beide Passwortfelder ausgefüllt sind, aber nicht übereinstimmen:
        if (
          passwordField1.value &&
          passwordField2.value &&
          passwordField1.value !== passwordField2.value
        ) {
          passwordField2.setAttribute("aria-describedby", idRefMismatch);
          passwordField2.setAttribute("aria-invalid", "true");
          document.getElementById(idRefMismatch).removeAttribute("hidden");
        } else if (
          // Wenn beide Passwortfelder ausgefüllt sind und übereinstimmen:
          passwordField1.value &&
          passwordField2.value &&
          passwordField1.value === passwordField2.value
        ) {
          // Verknüpfung mit Fehlermeldung auflösen
          passwordField2.removeAttribute("aria-describedby");
          document.getElementById(idRefMismatch).setAttribute("hidden", true);

          // Semantischen Fehlerzustand auflösen
          passwordField2.removeAttribute("aria-invalid");
        }

        // Loope durch alle E-Mail-Eingabefelder

        /**
         * @param {HTMLElement} emailField
         */
        emailFields.forEach((emailField) => {
          // Hole die ID der Fehlermeldung
          let idRefEmail = emailField.getAttribute("data-email-syntax-error");

          if (emailField.value && !validateEmail(emailField.value)) {
            // Wenn E-Mail-Adresse nicht der üblichen E-Mail-Syntax entspricht:
            emailField.setAttribute("aria-describedby", idRefEmail);
            document.getElementById(idRefEmail).removeAttribute("hidden");
          } else {
            // Wenn E-Mail der  üblichen E-Mail-Syntax entspricht:
            emailField.removeAttribute("aria-invalid");
            emailField.removeAttribute("aria-describedby");
            document.getElementById(idRefEmail).hidden = true;
          }
        });
      });

      if (document.querySelectorAll("[aria-required]").length === document.querySelectorAll(".form__error[hidden]").length) {
        alert("Formular erfolgreich versandt")
      }
    });
  });
}
