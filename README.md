# Ampara

Plataforma web em português de apoio emocional e informação sobre saúde mental. Reúne conteúdos educativos, um chat com inteligência artificial (**Ampara IA**, com Google Gemini), contas de usuário, cadastro de **profissionais** (psicólogos, psiquiatras, terapeutas) com aprovação pela equipe, agendamento de consultas e um painel administrativo.

> ⚠️ A Ampara **não substitui** acompanhamento psicológico ou médico. A IA não faz diagnóstico nem indica tratamento. Em emergência, procure ajuda imediata: **CVV 188** (24 h, gratuito) ou **SAMU 192**.

Projeto acadêmico, derivado de [anecouto/ampara](https://github.com/anecouto/ampara).

---

## Funcionalidades

**Para todos**
- Conteúdos sobre saúde mental, ansiedade, depressão, burnout, estresse, autoestima, sono e rede de apoio.
- Chat com a Ampara IA (Gemini), com instruções de acolhimento e encaminhamento ao CVV/SAMU.
- Lista de profissionais aprovados, com filtro por especialidade e modalidade.

**Usuário**
- Cadastro e login (senha com hash `scrypt`, sessão por token).
- **Minha área**: buscar profissional, agendar e cancelar consultas.
- Menu do topo mostra o usuário logado em todas as páginas.

**Profissional**
- Cadastro próprio em `cadastro-profissional.html` (fica *pendente* até a aprovação).
- Login unificado (a mesma tela de login do usuário).
- **Área do profissional**: consultas marcadas, com dados do paciente, e cancelamento.
- Se for desativado pelo admin, perde o acesso na hora.

**Administrador**
- Login real, com e-mail e senha conferidos no servidor (sessão de 2 horas).
- **Gerenciar profissionais**: aprovar, editar, desativar e excluir os profissionais cadastrados pelo site (junto com os de demonstração do navegador). Quem tem consultas não pode ser excluído; marque como *Inativo*.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | HTML, CSS e JavaScript puro |
| Backend | Node.js + Express |
| Banco de dados | MySQL (`mysql2`) |
| IA | Google Gemini (`@google/generative-ai`) |
| Segurança | hash de senha `scrypt` e token assinado HMAC-SHA256 (`seguranca.js`) |

---

## Estrutura

```
ampara/
├── backend/
│   ├── server.js            # API, regras e entrega do site
│   ├── seguranca.js         # hash de senha e tokens
│   ├── criar-admin.js       # cria/atualiza o administrador
│   ├── profissionais.sql    # referência das tabelas de profissionais e consultas
│   ├── package.json
│   └── .env                 # NÃO vai para o GitHub
├── frontend/
│   ├── index.html
│   ├── assets/images/
│   ├── css/                 # style.css, chat.css, acesso-usuario.css...
│   ├── js/
│   │   ├── api.js               # cliente da API e sessões (usuário/admin)
│   │   ├── acesso-usuario.js    # ícone de acesso na home
│   │   ├── usuario-menu.js      # menu do usuário nas demais páginas
│   │   ├── chatbot.js           # chat com a Ampara IA
│   │   ├── profissionais-dados.js
│   │   └── script.js
│   └── pages/               # conteúdos, login, cadastro, áreas e painel admin
└── Documentos/
```

---

## Como rodar

### 1. Requisitos
- [Node.js](https://nodejs.org) (versão LTS) e MySQL 8.
- Chave da API do Gemini: <https://aistudio.google.com>.

### 2. Banco de dados
No MySQL (Workbench, por exemplo), crie o banco e as tabelas base:

```sql
CREATE DATABASE IF NOT EXISTS ampara CHARACTER SET utf8mb4;
USE ampara;

CREATE TABLE IF NOT EXISTS usuario (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  senha_hash   VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuario_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mensagens (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  remetente_id    INT NOT NULL,
  destinatario_id INT NOT NULL,
  mensagem        TEXT NOT NULL,
  data_envio      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS conteudos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  titulo       VARCHAR(200) NOT NULL,
  corpo        TEXT NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'rascunho',
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

As tabelas `profissional` e `consulta` são criadas sozinhas quando o servidor liga; a tabela `admin`, pelo `criar-admin.js`.

### 3. Variáveis de ambiente
Crie `backend/.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=ampara
JWT_SECRET=uma-frase-longa-e-secreta-com-16-ou-mais-caracteres
GEMINI_API_KEY=sua_chave
GEMINI_MODEL=gemini-3.8-flash
```

> `JWT_SECRET` é obrigatório (mínimo 16 caracteres). O nome do modelo do Gemini muda com o tempo: se o terminal mostrar `ERRO GEMINI ... model ... no longer available`, troque `GEMINI_MODEL` pelo modelo que a mensagem recomendar.

### 4. Instalar e iniciar
```bash
cd backend
npm install express mysql2 cors dotenv @google/generative-ai
node criar-admin.js "Seu Nome" seuemail@exemplo.com   # pede a senha no terminal
node server.js
```

Abra **http://localhost:3000**. Use sempre esse endereço (e não o arquivo `.html` direto nem o Live Server): a sessão de login é guardada por endereço.

> **Windows/PowerShell:** se `npm` der erro de "execução de scripts desabilitada", rode uma vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ou use `npm.cmd`.

### 5. Testando o fluxo completo
1. `pages/cadastro-profissional.html`: cadastre um profissional (fica pendente).
2. `pages/login-admin.html`: entre como administrador e aprove em *Gerenciar profissionais*.
3. Entre como esse profissional na tela de login normal e abra a *Área do profissional*.
4. Crie uma conta de usuário, agende uma consulta com ele e cancele em *Minha área*.
5. Em *Converse com a Ampara*, mande uma mensagem para a IA.

---

## Principais rotas da API

| Método | Rota | Quem usa |
|---|---|---|
| POST | `/api/cadastro`, `/api/login` | usuário e profissional (login unificado) |
| GET | `/api/me` | sessão atual |
| POST | `/api/chat` | chat com a IA |
| POST | `/api/profissionais/cadastro` | cadastro de profissional |
| GET | `/api/profissionais` | lista pública (só aprovados, sem e-mail/telefone) |
| POST/GET | `/api/consultas` | usuário agenda e lista |
| PATCH | `/api/consultas/:id/cancelar` | usuário cancela |
| GET/PATCH | `/api/profissional/consultas...` | área do profissional |
| POST | `/api/admin/login` | administrador |
| GET/PATCH/PUT/DELETE | `/api/admin/profissionais...` | painel admin |

---

## Limitações conhecidas
- Outras telas do admin (usuários, serviços, relatórios) e o gerenciamento de conteúdos ainda usam dados locais do navegador, sem ligação com o servidor.
- "Novo profissional" no painel admin cria apenas um registro local (sem senha); profissionais reais se cadastram pela tela própria.
- O código do servidor foi testado com um banco simulado; vale validar os fluxos no MySQL real do seu ambiente.

---

## Segurança
- Nunca envie o `.env` nem a chave do Gemini para o GitHub (confira se `.env` está no `.gitignore`).
- Senhas são guardadas só como hash; o e-mail dos profissionais não aparece na lista pública.

---

## Contribuição
1. Faça um fork do repositório.
2. Crie uma branch: `git checkout -b minha-melhoria`.
3. Faça os commits e envie: `git push origin minha-melhoria`.
4. Abra um Pull Request.

## Créditos
Projeto acadêmico derivado de [anecouto/ampara](https://github.com/anecouto/ampara), com contribuições de estudantes da Universidade Cruzeiro do Sul.
