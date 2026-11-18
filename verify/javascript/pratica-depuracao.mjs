// Exemplo da aula pratica/depuracao
{
const entrada = "8";
console.log(entrada + 2);
console.log(typeof entrada);
const numero = Number(entrada);
if (!Number.isFinite(numero)) throw new Error("Número inválido");
console.log(numero + 2);
}
