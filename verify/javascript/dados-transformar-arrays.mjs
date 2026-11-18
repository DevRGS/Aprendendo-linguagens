// Exemplo da aula dados/transformar-arrays
{
const numeros = [2, 10, 3];
console.log(JSON.stringify(numeros.map(n => n * 2)));
console.log(JSON.stringify(numeros.filter(n => n >= 3)));
console.log(numeros.reduce((total, n) => total + n, 0));
console.log(JSON.stringify(numeros.slice().sort((a, b) => a - b)));
console.log(JSON.stringify(numeros));
}
