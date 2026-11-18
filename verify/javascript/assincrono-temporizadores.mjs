// Exemplo da aula assincrono/temporizadores
{
console.log("início");
setTimeout(() => console.log("temporizador"), 0);
Promise.resolve().then(() => console.log("microtarefa"));
console.log("fim");
}
