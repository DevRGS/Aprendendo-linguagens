// Exemplo da aula moderno/desestruturacao-e-spread
{
const pessoa = { nome: "Ana", endereco: { cidade: "Recife" } };
const { nome } = pessoa;
const copia = { ...pessoa, nome: "Bia" };
copia.endereco.cidade = "Olinda";
console.log(nome);
console.log(pessoa.nome);
console.log(pessoa.endereco.cidade);
console.log(copia.nome);
}
