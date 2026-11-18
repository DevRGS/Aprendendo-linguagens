// Exemplo da aula dados/json
{
const original = { nome: "Ana", ativa: true };
const texto = JSON.stringify(original);
console.log(texto);
const lido = JSON.parse(texto);
console.log(lido.nome);
console.log(typeof texto);
try {
  JSON.parse("{invalido}");
} catch (erro) {
  console.log(erro.name);
}
}
