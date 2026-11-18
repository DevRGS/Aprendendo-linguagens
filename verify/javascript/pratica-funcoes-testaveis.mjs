// Exemplo da aula pratica/funcoes-testaveis
{
function totalCentavos(itens) {
  return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
}
function conferir(atual, esperado) {
  if (atual !== esperado) throw new Error("Resultado incorreto");
}
conferir(totalCentavos([]), 0);
conferir(totalCentavos([{ preco: 250, quantidade: 2 }]), 500);
console.log("Dois casos passaram.");
}
