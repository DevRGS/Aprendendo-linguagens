// Exemplo da aula assincrono/promises
{
const resultado = Promise.resolve(4);
resultado
  .then(numero => numero * 2)
  .then(numero => console.log(numero))
  .catch(() => console.log("Falha"));
console.log("Registrado");
}
