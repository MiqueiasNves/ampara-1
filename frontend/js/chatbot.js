/* ===================================== */
/* ELEMENTOS */
/* ===================================== */

const chatForm =
  document.getElementById("chat-form");

const chatInput =
  document.getElementById("chat-input");

const chatMessages =
  document.getElementById("chat-messages");


/* ===================================== */
/* ENVIAR MENSAGEM */
/* ===================================== */

chatForm.addEventListener("submit", async (event) => {

  event.preventDefault();


  /* ===================================== */
  /* PEGA TEXTO */
  /* ===================================== */

  const userMessage =
    chatInput.value.trim();


  if (userMessage === "") return;


  /* ===================================== */
  /* MOSTRA USUÁRIO */
  /* ===================================== */

  addMessage(userMessage, "user");


  /* ===================================== */
  /* LIMPA INPUT */
  /* ===================================== */

  chatInput.value = "";


  try {

    /* ===================================== */
    /* ENVIA PARA BACKEND */
    /* ===================================== */

    /* ===================================== */
/* TYPING INDICATOR */
/* ===================================== */

const typingElement =
  document.createElement("div");

typingElement.classList.add(
  "message",
  "bot"
);

typingElement.innerHTML = `

  <div class="typing">

    <span></span>
    <span></span>
    <span></span>

  </div>

`;

chatMessages.appendChild(
  typingElement
);

chatMessages.scrollTop =
  chatMessages.scrollHeight;

    const response = await fetch(
      "/chat",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: userMessage
        })

      }
    );


    /* ===================================== */
    /* RESPOSTA */
    /* ===================================== */

    const data = await response.json();


    /* ===================================== */
    /* MOSTRA IA */
    /* ===================================== */

    /* REMOVE TYPING */

typingElement.remove();

    addMessage(data.reply, "bot");


  } catch (error) {

    console.error(error);

    addMessage(
      "Erro ao conectar com o servidor.",
      "bot"
    );

  }

});


/* ===================================== */
/* FUNÇÃO MENSAGEM */
/* ===================================== */

function addMessage(message, sender) {

  const messageElement =
    document.createElement("div");


  /* ========================= */
  /* CLASSES */
  /* ========================= */

  messageElement.classList.add("message");

  messageElement.classList.add(sender);


  /* ========================= */
  /* HORÁRIO */
  /* ========================= */

  const currentTime =
    new Date().toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );


  /* ========================= */
  /* HTML */
  /* ========================= */

  messageElement.innerHTML = `

    <div class="message-content">

      <p>${message}</p>

      <span class="message-time">
        ${currentTime}
      </span>

    </div>

  `;


  /* ========================= */
  /* ADICIONA NO CHAT */
  /* ========================= */

  chatMessages.appendChild(messageElement);


  /* ========================= */
  /* AUTO SCROLL */
  /* ========================= */

  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}
