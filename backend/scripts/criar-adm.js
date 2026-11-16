'use strict';

/* =========================================================
   Ampara | Cria um administrador (ou troca a senha de um existente)

   Uso (dentro da pasta backend):
       node criar-admin.js "Nome do Admin" admin@exemplo.com

   A senha é pedida no terminal e não aparece na tela.
   Ela é guardada com hash (scrypt), do mesmo jeito que o servidor confere no login.
========================================================= */

require('dotenv').config();

const readline = require('readline');
const { Writable } = require('stream');
const mysql = require('mysql2/promise');
const { hashSenha } = require('./seguranca');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

// Pergunta escondendo o que é digitado (a saída do readline é descartada)
function pedirSenha(texto) {
  return new Promise((resolve) => {
    const mudo = new Writable({ write(chunk, enc, cb) { cb(); } });
    const rl = readline.createInterface({ input: process.stdin, output: mudo, terminal: true });
    process.stdout.write(texto);
    rl.question('', (resposta) => {
      rl.close();
      process.stdout.write('\n');
      resolve(resposta);
    });
  });
}

async function principal() {
  const nome = String(process.argv[2] || '').trim();
  const email = String(process.argv[3] || '').trim().toLowerCase();

  if (nome.length < 2 || nome.length > 100 || !EMAIL_RE.test(email) || email.length > 255) {
    console.error('Uso: node criar-admin.js "Nome do Admin" admin@exemplo.com');
    process.exit(1);
  }

  // ADMIN_SENHA existe só para automação/testes; no dia a dia a senha é digitada
  let senha = process.env.ADMIN_SENHA;
  if (!senha) {
    senha = await pedirSenha('Senha do administrador (mínimo 8 caracteres): ');
    const confirmacao = await pedirSenha('Repita a senha: ');
    if (senha !== confirmacao) {
      console.error('As senhas não conferem. Nada foi alterado.');
      process.exit(1);
    }
  }
  if (senha.length < 8 || senha.length > 200) {
    console.error('A senha precisa ter de 8 a 200 caracteres. Nada foi alterado.');
    process.exit(1);
  }

  const conexao = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ampara',
    charset: 'utf8mb4'
  });

  try {
    // só cria se ainda não existir (se você já tem a tabela admin, ela não é alterada)
    await conexao.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome         VARCHAR(100) NOT NULL,
        email        VARCHAR(255) NOT NULL,
        senha        VARCHAR(255) NOT NULL,
        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_admin_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    const hash = await hashSenha(senha);
    const [existentes] = await conexao.execute('SELECT id FROM admin WHERE email = ?', [email]);

    if (existentes[0]) {
      await conexao.execute('UPDATE admin SET nome = ?, senha = ? WHERE id = ?', [nome, hash, existentes[0].id]);
      console.log('Administrador já existia: nome e senha atualizados (' + email + ').');
    } else {
      await conexao.execute('INSERT INTO admin (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);
      console.log('Administrador criado (' + email + '). Entre em pages/login-admin.html com esse e-mail e a senha.');
    }
  } finally {
    await conexao.end();
  }
}

principal().catch((e) => {
  console.error('Não foi possível criar o administrador:', e.message);
  process.exit(1);
});