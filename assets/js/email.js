document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");
  const inviaButton = document.getElementById("inviaButton");

  // Funzione per aggiornare lo stato del pulsante "Invia"
  // Verrà chiamata dopo la validazione dei campi e dopo la verifica reCAPTCHA
  function updateSubmitButtonState() {
    let formFieldsValid = true;

    // Controlla la validità dei campi del modulo
    inputs.forEach((input) => {
      if (input.type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value.trim())) {
          formFieldsValid = false;
        }
      } else {
        if (input.value.trim() === "") {
          formFieldsValid = false;
        }
      }
    });

    // Controlla se il token reCAPTCHA è disponibile
    // grecaptcha.getResponse() restituisce una stringa se verificato, vuota altrimenti
    const recaptchaVerified = grecaptcha.getResponse() !== "";

    // Il pulsante è abilitato solo se tutti i campi sono validi E reCAPTCHA è verificato
    inviaButton.disabled = !(formFieldsValid && recaptchaVerified);
    console.log(
      `Form Fields Valid: ${formFieldsValid}, reCAPTCHA Verified: ${recaptchaVerified}, Button Disabled: ${inviaButton.disabled}`
    );
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("Submit button clicked");

    const nome = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const subject = document.getElementById("subject").value;
    const cellulare = document.getElementById("contact-phone").value;
    const messaggio = document.getElementById("contact-message").value;

    console.log("Dati registrati:");
    console.log("Nome:", nome);
    console.log("Email:", email);
    console.log("Cellulare:", cellulare);
    console.log("Messaggio:", messaggio);
    console.log("Soggetto:", subject);

    const recaptchaResponse = grecaptcha.getResponse(); // Ottiene il token dal widget
    if (!recaptchaResponse) {
      alert("Per favore, completa la verifica reCAPTCHA.");
      return; // Blocca l'invio se l'utente non ha verificato
    }

    const emailData = {
      service_id: "service_lgaigdl",
      template_id: "template_sngknjd",
      template_params: {
        nome,
        email,
        subject,
        cellulare,
        messaggio,
        "g-recaptcha-response": recaptchaResponse,
      },
    };

    try {
      inviaButton.disabled = true;
      await emailjs.send(
        emailData.service_id,
        emailData.template_id,
        emailData.template_params
      );
      const aziendaMessage = document.getElementById("aziendaMessage");
      aziendaMessage.textContent = "Informazioni inviate con successo!";
      aziendaMessage.style.color = "green";

      document.getElementById("contact-name").value = "";
      document.getElementById("contact-email").value = "";
      document.getElementById("subject").value = "";
      document.getElementById("contact-phone").value = "";
      document.getElementById("contact-message").value = "";

      // Resetta reCAPTCHA e riabilita/disabilita il pulsante
      grecaptcha.reset();
      updateSubmitButtonState(); // Aggiorna lo stato del pulsante dopo il reset
    } catch (error) {
      console.error("Errore nell'invio dell'email:", error);
      const aziendaMessage = document.getElementById("aziendaMessage");
      aziendaMessage.textContent =
        "Si è verificato un errore durante l'invio. Riprova.";
      aziendaMessage.style.color = "red"; // Messaggio di errore rosso
      // Riabilita il pulsante in caso di errore
      inviaButton.disabled = false;
    }
  });

  inviaButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.dispatchEvent(new Event("submit"));
  });

  //-------------------------------------------

  // Ottieni tutti i campi obbligatori
  const inputs = form.querySelectorAll("input, textarea");

  // Aggiungi ascoltatori su ogni campo
  inputs.forEach((input) => {
    input.addEventListener("input", updateSubmitButtonState);
  });

  // --- CALLBACK DI RECAPTCHA: Chiamata quando l'API è caricata e pronta ---
  // window.recaptchaLoaded = function () {
  //   console.log("reCAPTCHA API caricata e pronta!");
  //   // Questa funzione viene chiamata quando l'API è pronta.
  //   // Ora, `grecaptcha.getResponse()` dovrebbe essere disponibile.
  //   updateSubmitButtonState(); // Inizializza lo stato del pulsante
  // };

  // --- CALLBACK DI RECAPTCHA: Chiamata quando l'utente completa la verifica ---
  window.recaptchaVerified = function (response) {
    console.log("reCAPTCHA verificato con successo! Token:", response);
    // Questo `response` è il token, ma lo prendiamo da grecaptcha.getResponse()
    // per coerenza nella funzione updateSubmitButtonState.
    updateSubmitButtonState(); // Aggiorna lo stato del pulsante dopo la verifica
  };

  // --- CALLBACK DI RECAPTCHA: Chiamata quando il token scade ---
  window.recaptchaExpired = function () {
    console.warn("reCAPTCHA token scaduto. Per favore, rifai la verifica.");
    updateSubmitButtonState(); // Disabilita il pulsante o chiedi nuova verifica
  };

  // Disabilita invio form se non valido (opzionale ma consigliato)
  form.addEventListener("submit", function (e) {
    if (button.disabled) {
      e.preventDefault();
    }
  });
});
