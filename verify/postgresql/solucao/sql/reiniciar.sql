-- Executar por psql. Apenas o esquema de exercícios da base dedicada é refeito.
\set ON_ERROR_STOP on
SELECT current_database() IN ('central_lab','central_lab_test') AS base_correta \gset
\if :base_correta
BEGIN;
DROP SCHEMA IF EXISTS caderno CASCADE;
CREATE SCHEMA caderno;
SET search_path TO caderno;
CREATE TABLE alunos (
  id integer PRIMARY KEY,
  nome text UNIQUE NOT NULL
);
CREATE TABLE leituras (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  aluno_id integer NOT NULL REFERENCES alunos(id),
  tema text NOT NULL,
  minutos integer NOT NULL CHECK (minutos > 0),
  feita boolean NOT NULL DEFAULT false
);
INSERT INTO alunos VALUES (1,'Ana'),(2,'Bia'),(3,'Caio');
INSERT INTO leituras(aluno_id,tema,minutos,feita) VALUES
  (1,'Git',10,true), (1,'SQL',20,false), (2,'Git',10,true);
COMMIT;
\else
\echo Use somente central_lab ou central_lab_test.
\quit
\endif
