// Exemplo da aula funcoes/callbacks-e-arrow
{
const dobrar = numero => numero * 2;
function aplicar(valor, operacao) {
  return operacao(valor);
}
console.log(aplicar(4, dobrar));
const triplicar = numero => {
  return numero * 3;
};
console.log(triplicar(3));
}
