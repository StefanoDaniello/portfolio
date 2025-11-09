document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");
  const inviaButton = document.getElementById("inviaButton");
  const inputs = form.querySelectorAll("input, textarea"); // Tutti gli input e textarea del form

  // Funzione per mostrare un messaggio di errore per un campo specifico
  function showError(inputElement, message) {
    const formGroup = inputElement.closest(".form-group");
    if (formGroup) {
      formGroup.classList.add("error"); // Aggiunge la classe per il bordo rosso
      const errorMessageDiv = formGroup.querySelector(".error-message");
      if (errorMessageDiv) {
        errorMessageDiv.textContent = message;
      }
    }
  }

  // Funzione per nascondere un messaggio di errore per un campo specifico
  function hideError(inputElement) {
    const formGroup = inputElement.closest(".form-group");
    if (formGroup) {
      formGroup.classList.remove("error"); // Rimuove la classe del bordo rosso
      const errorMessageDiv = formGroup.querySelector(".error-message");
      if (errorMessageDiv) {
        errorMessageDiv.textContent = ""; // Svuota il messaggio di errore
      }
    }
  }

  // Funzione di validazione per un singolo campo
  function validateInput(input) {
    let isValid = true;
    let errorMessage = "";

    if (input.value.trim() === "") {
      isValid = false;
      errorMessage = "Questo campo non può essere vuoto.";
    } else if (input.id === "contact-email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value.trim())) {
        isValid = false;
        errorMessage = "Inserisci un'email valida.";
      }
    }

    if (!isValid) {
      showError(input, errorMessage);
    } else {
      hideError(input);
    }
    return isValid;
  }

  /**
   * Controlla se tutti gli input sono validi e se reCAPTCHA è completo.
   * Abilita o disabilita il pulsante di invio di conseguenza.
   */
  function updateSubmitButtonState() {
    let allInputsValid = true;

    // Controlla la validità di tutti gli input
    inputs.forEach((input) => {
      // Usiamo 'validateInput' per controllare se i campi sono compilati correttamente.
      if (!validateInput(input)) {
        allInputsValid = false;
      }
    });

    // Controlla reCAPTCHA. Se grecaptcha non è caricato, lo consideriamo non valido.
    const recaptchaComplete =
      typeof grecaptcha !== "undefined" && grecaptcha.getResponse() !== "";

    // Se tutti i campi sono validi E reCAPTCHA è completo, abilita il pulsante.
    if (allInputsValid && recaptchaComplete) {
      inviaButton.disabled = false;
    } else {
      inviaButton.disabled = true;
    }
  }

  // Aggiungi ascoltatori di input per nascondere gli errori in tempo reale
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      hideError(input); // Nascondi l'errore appena l'utente digita
    });
    // Quando l'utente esce dal campo, facciamo la validazione e aggiorniamo lo stato
    // input.addEventListener("blur", function () {
    //   validateInput(input);
    //   updateSubmitButtonState(); // Aggiorna lo stato del pulsante
    // });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("Submit button clicked");

    let formValid = true;
    let firstInvalidInput = null; // Per lo scroll

    // Pulisci tutti gli errori prima di una nuova validazione
    inputs.forEach((input) => hideError(input));
    hideError(document.querySelector(".g-recaptcha")); // Puliamo anche l'eventuale errore del captcha

    // Valida tutti i campi
    inputs.forEach((input) => {
      if (!validateInput(input)) {
        formValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = input; // Salva il primo input non valido
        }
      }
    });

    // Valida reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    const recaptchaContainer = document.querySelector(".g-recaptcha");
    if (!recaptchaResponse) {
      formValid = false;
      showError(
        recaptchaContainer,
        "Per favore, completa la verifica reCAPTCHA."
      );
      if (!firstInvalidInput) {
        firstInvalidInput = recaptchaContainer; // Se il captcha è il primo errore
      }
    } else {
      hideError(recaptchaContainer);
    }

    // Se il form non è valido, blocca l'invio e scorri
    if (!formValid) {
      if (firstInvalidInput) {
        // Scorrere fino al primo elemento con errore
        firstInvalidInput.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      const aziendaMessage = document.getElementById("aziendaMessage");
      aziendaMessage.textContent =
        "Compila tutti i campi obbligatori e completa il reCAPTCHA.";
      aziendaMessage.style.color = "red";
      return; // Blocca l'invio del form
    }

    // Se il form è valido, procedi con l'invio (il resto del tuo codice emailjs)
    const nome = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const subject = document.getElementById("subject").value;
    const cellulare = document.getElementById("contact-phone").value;
    const messaggio = document.getElementById("contact-message").value;

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

      updateSubmitButtonState(); // Aggiorna lo stato del pulsante dopo il reset

      // Pulisci i campi
      inputs.forEach((input) => (input.value = ""));
      // Resetta reCAPTCHA e riabilita/disabilita il pulsante
      grecaptcha.reset();
    } catch (error) {
      console.error("Errore nell'invio dell'email:", error);
      const aziendaMessage = document.getElementById("aziendaMessage");
      aziendaMessage.textContent =
        "Si è verificato un errore durante l'invio. Riprova.";
      aziendaMessage.style.color = "red"; // Messaggio di errore rosso
      // Riabilita il pulsante in caso di errore
    }
  });

  //-------------------------------------------

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
});
