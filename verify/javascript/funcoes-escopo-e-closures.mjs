// Exemplo da aula funcoes/escopo-e-closures
{
function criarContador() {
  let quantidade = 0;
  return () => {
    quantidade += 1;
    return quantidade;
  };
}
const primeiro = criarContador();
const segundo = criarContador();
console.log(primeiro());
console.log(primeiro());
console.log(segundo());
}
