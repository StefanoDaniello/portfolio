document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");
  const inviaButton = document.getElementById("inviaButton");

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

    const emailData = {
      service_id: "service_lgaigdl",
      template_id: "template_sngknjd",
      template_params: {
        nome,
        email,
        subject,
        cellulare,
        messaggio,
      },
    };

    try {
      await emailjs.send(
        emailData.service_id,
        emailData.template_id,
        emailData.template_params
      );
      const aziendaMessage = document.getElementById("aziendaMessage");
      aziendaMessage.textContent = "Informazioni inviate con successo!";

      document.getElementById("contact-name").value = "";
      document.getElementById("contact-email").value = "";
      document.getElementById("subject").value = "";
      document.getElementById("contact-phone").value = "";
      document.getElementById("contact-message").value = "";
    } catch (error) {
      console.error("Errore nell'invio dell'email:", error);
    }
  });

  inviaButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.dispatchEvent(new Event("submit"));
  });
});

//-------------------------------------------

const form = document.getElementById("myForm");
const button = document.getElementById("inviaButton");

// Ottieni tutti i campi obbligatori
const inputs = form.querySelectorAll("input, textarea");

function validateForm() {
  let isValid = true;

  inputs.forEach((input) => {
    if (input.type === "email") {
      // Controllo email valido
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value.trim())) {
        isValid = false;
      }
    } else {
      if (input.value.trim() === "") {
        isValid = false;
      }
    }
  });

  button.disabled = !isValid;
}

// Aggiungi ascoltatori su ogni campo
inputs.forEach((input) => {
  input.addEventListener("input", validateForm);
});

// Disabilita invio form se non valido (opzionale ma consigliato)
form.addEventListener("submit", function (e) {
  if (button.disabled) {
    e.preventDefault();
  }
});
