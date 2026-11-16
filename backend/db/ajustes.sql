-- =========================================================
-- Ampara | Ajustes no banco (rode UMA vez, depois do banco_ampara.sql)
-- =========================================================

USE ampara;

-- 1) Usuário precisa de senha para entrar (guarda só o hash, nunca a senha).
ALTER TABLE usuario
  ADD COLUMN senha_hash VARCHAR(255) NULL AFTER email;

-- 2) Admin: a senha estava como UNIQUE, então dois admins não poderiam
--    ter a mesma senha (e isso revelaria senhas repetidas). Remove a regra.
--    Se der erro de índice inexistente, rode SHOW INDEX FROM admin;
--    e use o nome que aparecer em Key_name para a coluna senha.
ALTER TABLE admin
  DROP INDEX senha;

-- 3) Conferir
DESCRIBE usuario;
DESCRIBE admin;
