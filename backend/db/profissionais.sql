-- =========================================================
-- Ampara | Tabelas de profissionais e consultas
-- Rodar UMA vez no MySQL (Workbench, DBeaver ou terminal) no banco do projeto.
-- O nome do banco é o mesmo do seu .env (DB_NAME; padrão: ampara).
-- =========================================================

USE ampara;

-- Profissionais (psicólogos, psiquiatras...). Entram como 'pendente' e só
-- conseguem entrar no site depois de aprovados ('ativo').
CREATE TABLE IF NOT EXISTS profissional (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(100) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  senha_hash      VARCHAR(255) NOT NULL,
  tipo            VARCHAR(40)  NOT NULL,            -- profissão (ex.: Psicólogo(a))
  registro        VARCHAR(30)  NOT NULL,            -- ex.: CRP 06/123456
  especialidade   VARCHAR(60)  NOT NULL,
  modalidade      VARCHAR(40)  NOT NULL,
  valor           DECIMAL(8,2) NOT NULL DEFAULT 0,
  disponibilidade VARCHAR(80)  NOT NULL,
  bio             VARCHAR(400) NOT NULL,
  telefone        VARCHAR(20)  NULL,
  status          ENUM('pendente','ativo','inativo') NOT NULL DEFAULT 'pendente',
  data_criacao    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_profissional_email (email),
  UNIQUE KEY uq_profissional_registro (registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Consultas marcadas por usuários com profissionais.
-- data_hora é sempre guardada em UTC. Sem FOREIGN KEY de propósito: assim não
-- depende do tipo exato da coluna usuario.id da sua tabela.
CREATE TABLE IF NOT EXISTS consulta (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT NOT NULL,
  profissional_id INT UNSIGNED NOT NULL,
  data_hora       DATETIME NOT NULL,
  observacao      VARCHAR(300) NULL,
  status          ENUM('agendada','cancelada') NOT NULL DEFAULT 'agendada',
  cancelada_por   ENUM('usuario','profissional') NULL,
  data_criacao    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_consulta_usuario (usuario_id),
  KEY idx_consulta_profissional (profissional_id, data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- APROVAR PROFISSIONAIS (enquanto o painel admin não usa o servidor)
-- =========================================================
-- Ver quem está esperando aprovação:
--   SELECT id, nome, email, tipo, registro FROM profissional WHERE status = 'pendente';
--
-- Aprovar (confira o registro no site do conselho antes!):
--   UPDATE profissional SET status = 'ativo' WHERE id = 1;
--
-- Desativar:
--   UPDATE profissional SET status = 'inativo' WHERE id = 1;
