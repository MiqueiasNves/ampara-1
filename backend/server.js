/* ===================================== */
/* IMPORTAÇÕES */
/* ===================================== */

const express = require("express");

const cors = require("cors");
const path = require("path");


require("dotenv").config();

const {
  GoogleGenerativeAI
} = require("@google/generative-ai");


/* ===================================== */
/* GEMINI */
/* ===================================== */

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro"
});


/* ===================================== */
/* APP */
/* ===================================== */

const app = express();


/* ===================================== */
/* CONFIGURAÇÕES */
/* ===================================== */

app.use(cors());

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

/* ===================================== */
/* ROTA TESTE */
/* ===================================== */

app.get("/", (req, res) => {

  res.send(
    "Servidor da Ampara funcionando 💚"
  );

});


/* ===================================== */
/* ROTA CHAT */
/* ===================================== */

app.post("/chat", async (req, res) => {

  try {

    /* ===================================== */
    /* MENSAGEM USUÁRIO */
    /* ===================================== */

    const userMessage = req.body.message;


    /* ===================================== */
    /* PROMPT DA IA */
    /* ===================================== */

    const prompt = `
    Você é a Ampara, uma inteligência artificial
    acolhedora especializada em apoio emocional.

    Sua função é:
    - acolher emocionalmente
    - conversar com empatia
    - incentivar autocuidado
    - evitar julgamentos
    - nunca substituir psicólogos
    - recomendar ajuda profissional em casos graves

    Seja:
    - gentil
    - humana
    - calma
    - acolhedora
    - objetiva

    Mensagem do usuário:
    ${userMessage}
    `;


    /* ===================================== */
    /* GERA RESPOSTA */
    /* ===================================== */

    const result = await model.generateContent(
      prompt
    );

    const response =
      result.response.text();


    /* ===================================== */
    /* ENVIA PARA FRONTEND */
    /* ===================================== */

    res.json({

      reply: response

    });


  } catch (error) {

    console.error(
      "ERRO GEMINI:",
      error.response?.data || error.message || error
    );

    res.status(500).json({

      reply:
        "Desculpe, ocorreu um erro ao conversar com a Ampara."

    });

  }

});


/* ===================================== */
/* PORTA */
/* ===================================== */

const PORT = process.env.PORT || 3000;

/* ===================================== */
/* INICIAR SERVIDOR */
/* ===================================== */

app.listen(PORT, () => {

  console.log(
    `Servidor rodando na porta ${PORT} 🚀`
  );

});
