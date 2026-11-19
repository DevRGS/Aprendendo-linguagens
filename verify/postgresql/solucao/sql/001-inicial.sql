CREATE TABLE IF NOT EXISTS usuarios (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario text UNIQUE NOT NULL,
  sal text NOT NULL,
  hash text NOT NULL
);
CREATE TABLE IF NOT EXISTS sessoes (
  token_hash text PRIMARY KEY,
  usuario_id integer NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  csrf text NOT NULL,
  expira_em bigint NOT NULL
);
CREATE TABLE IF NOT EXISTS tarefas (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id integer NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo text NOT NULL CHECK (length(trim(titulo)) BETWEEN 1 AND 120),
  concluida boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS tarefas_por_usuario ON tarefas(usuario_id, id DESC);
CREATE INDEX IF NOT EXISTS sessoes_por_expiracao ON sessoes(expira_em);
