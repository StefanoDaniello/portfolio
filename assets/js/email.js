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
      aziendaMessage.style.color = "red"; // Messaggio di errore rosso
      // Riabilita il pulsante in caso di errore
      inviaButton.disabled = false;
    }
  });

  inviaButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.dispatchEvent(new Event("submit"));
  });
});

//-------------------------------------------

// Ottieni tutti i campi obbligatori
const inputs = form.querySelectorAll("input, textarea");

// Aggiungi ascoltatori su ogni campo
inputs.forEach((input) => {
  input.addEventListener("input", updateSubmitButtonState);
});

// Inizializza lo stato del pulsante al caricamento della pagina
// Questo deve essere chiamato DOPO che lo script reCAPTCHA è caricato
// e il widget è stato renderizzato.
// reCAPTCHA ha un callback `onload` o puoi usare `grecaptcha.ready`
grecaptcha.ready(function () {
  updateSubmitButtonState();
});

// Funzione chiamata da reCAPTCHA quando la verifica è completata
// (per reCAPTCHA v2 "Non sono un robot")
window.recaptchaCallback = function () {
  updateSubmitButtonState();
};

// Disabilita invio form se non valido (opzionale ma consigliato)
form.addEventListener("submit", function (e) {
  if (button.disabled) {
    e.preventDefault();
  }
});
