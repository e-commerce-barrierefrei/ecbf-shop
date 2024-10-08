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

          liveRegion.textContent = "Password sichtdata-input";
        } else {
          passwordInput.setAttribute("type", "password");
          target.setAttribute("aria-pressed", "false");

          liveRegion.textContent = "Password unsichtdata-input";
        }
      });
    });

    /**
     * @param {Event} e
     */
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // requiredFields nicht cachen!
      requiredFields = document.querySelectorAll(".data-input [aria-required='true']");
      emailFields = document.querySelectorAll("input[type='email']");

      // Loope durch alle Pflichtfelder

      /**
       * @param {HTMLInputElement} requiredField
       */
      requiredFields.forEach((requiredField) => {

         // Ist "requiredField" ein Fieldset, in dem ein Input ausgewählt ist?
        let requiredFieldsetisChecked = requiredField.tagName === "FIELDSET" && requiredField.value;

        // Erkenne nicht ausgefüllte oder nicht gecheckte Pflichtfelder oder Radiogroups in Fehlerzustand
        const fieldInputEmptyThoughRequired = (!requiredField.checked && requiredField.value === "") || !!requiredFieldsetisChecked;

        // Finde die ID der Fehlermeldung heraus
        let idRefRequired = requiredField.getAttribute("data-required-error");

        if (fieldInputEmptyThoughRequired) {
          // Setze unausgefüllte Pflichtfelder in einen semantischen Fehlerzustand
          requiredField.setAttribute("aria-invalid", "true");

          // Assoziiere den Fehlerneldungstext
          requiredField.setAttribute("aria-describedby", idRefRequired);

          // Macht die Fehlermeldungen auch visuell sichtdata-input
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

      if (!document.querySelectorAll('.data-input .form__error:not([hidden])').length) {
        window.location.href = 'zusammenfassung.html';

        let address_salutation = document.querySelector('input[name="address.radiogroup.salutation"]:checked').value;
        localStorage.setItem('address.salutation', address_salutation);

        let address_firstName = document.getElementById('address.firstName').value;
        localStorage.setItem('address.firstName', address_firstName);

        let address_lastName = document.getElementById('address.lastName').value;
        localStorage.setItem('address.lastName', address_lastName);

        let address_company = document.getElementById('address.company').value;
        localStorage.setItem('address.company', address_company);

        let address_address1 = document.getElementById('address.address1').value;
        localStorage.setItem('address.address1', address_address1);

        let address_address2 = document.getElementById('address.address2').value;
        localStorage.setItem('address.address2', address_address2);

        let address_zipCode = document.getElementById('address.zipCode').value;
        localStorage.setItem('address.zipCode', address_zipCode);

        let address_city = document.getElementById('address.city').value;
        localStorage.setItem('address.city', address_city);

        let address_email = document.getElementById('address.email').value;
        localStorage.setItem('address.email', address_email);

        if (document.querySelector('input[name="addressIsInvoiceAddress"]:checked')) {
          let addressIsInvoiceAddress = document.querySelector('input[name="addressIsInvoiceAddress"]:checked').value;

          if (addressIsInvoiceAddress === "on") {
            localStorage.setItem('addressIsInvoiceAddress', addressIsInvoiceAddress);
          } else {
            localStorage.setItem('addressIsInvoiceAddress', "off");
          }
        } else {
          localStorage.removeItem("addressIsInvoiceAddress");
        }

        let address_invoice_salutation = document.querySelector('input[name="address-invoice.radiogroup.salutation"]:checked').value;
        localStorage.setItem('address-invoice.salutation', address_invoice_salutation);

        let address_invoice_firstName = document.getElementById('address-invoice.firstName').value;
        localStorage.setItem('address-invoice.firstName', address_invoice_firstName);

        let address_invoice_lastName = document.getElementById('address-invoice.lastName').value;
        localStorage.setItem('address-invoice.lastName', address_invoice_lastName);

        let address_invoice_company = document.getElementById('address-invoice.company').value;
        localStorage.setItem('address-invoice.company', address_invoice_company);

        let address_invoice_address1 = document.getElementById('address-invoice.address1').value;
        localStorage.setItem('address-invoice.address1', address_invoice_address1);

        let address_invoice_address2 = document.getElementById('address-invoice.address2').value;
        localStorage.setItem('address-invoice.address2', address_invoice_address2);

        let address_invoice_zipCode = document.getElementById('address-invoice.zipCode').value;
        localStorage.setItem('address-invoice.zipCode', address_invoice_zipCode);

        let address_invoice_city = document.getElementById('address-invoice.city').value;
        localStorage.setItem('address-invoice.city', address_invoice_city);

        let address_invoice_email = document.getElementById('address-invoice.email').value;
        localStorage.setItem('address-invoice.email', address_invoice_email);

      } else {

        let errorAmount = document.querySelectorAll('.data-input .form__error:not([hidden])').length;

        // Kommuniziere, dass Eingabefehler aufgetreten sind per Dokumententitel und Live Region
        document.title = `${errorAmount} Fehler bei der Eingabe` + document.title;
        document.querySelector('#filter-live-region').textContent = `${errorAmount} Fehler bei der Eingabe`;

        // Finde das erste fehlerhafte Feld und fokussiere es
        if ( document.querySelector('input[aria-invalid="true"]')) {
          document.querySelector('input[aria-invalid="true"]').focus();
        }
      }
    });
  });
}
