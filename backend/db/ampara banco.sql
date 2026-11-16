use ampara;

ALTER TABLE usuario ADD COLUMN senha_hash VARCHAR(255) NULL AFTER email;