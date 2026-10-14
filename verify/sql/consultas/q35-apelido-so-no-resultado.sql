-- verifica: sql.consultas.q35 (na tabela, a coluna continua nome: aluno não existe)
-- banco: escola
-- espera: erro no such column: aluno
SELECT aluno FROM alunos;
