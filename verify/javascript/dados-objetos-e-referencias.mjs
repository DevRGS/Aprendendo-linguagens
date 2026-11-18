// Exemplo da aula dados/objetos-e-referencias
{
const pessoa = { nome: "Ana", pontos: 2 };
const outra = pessoa;
outra.pontos += 1;
const chave = "nome";
console.log(pessoa.pontos);
console.log(pessoa[chave]);
console.log(pessoa === outra);
console.log(pessoa === { nome: "Ana", pontos: 3 });
}
