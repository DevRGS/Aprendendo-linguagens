// Exemplo da aula moderno/classes-e-this
{
class Contador {
  constructor() {
    this.valor = 0;
  }
  incrementar() {
    this.valor += 1;
    return this.valor;
  }
}
const contador = new Contador();
console.log(contador.incrementar());
const outro = new Contador();
console.log(outro.valor);
const executar = () => contador.incrementar();
console.log(executar());
}
