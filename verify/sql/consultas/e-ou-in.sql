-- verifica: f07 e a aula e-ou (IN)
-- banco: escola
-- saida:
-- nome | cidade
-- Bruno | Natal
-- Diego | Fortaleza
-- Elisa | Natal
-- Heitor | Fortaleza
-- João | Natal
SELECT nome, cidade FROM alunos WHERE cidade IN ('Natal', 'Fortaleza');
