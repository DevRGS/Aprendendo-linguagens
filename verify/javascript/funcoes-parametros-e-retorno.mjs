// Exemplo da aula funcoes/parametros-e-retorno
{
function calcularTotal(preco, quantidade = 1) {
  return preco * quantidade;
}
console.log(calcularTotal(10, 3));
console.log(calcularTotal(10));
}
