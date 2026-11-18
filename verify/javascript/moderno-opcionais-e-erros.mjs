// Exemplo da aula moderno/opcionais-e-erros
{
const perfil = { pontos: 0 };
console.log(perfil.endereco?.cidade ?? "Não informada");
console.log(perfil.pontos ?? 10);
console.log(perfil.pontos || 10);
try {
  throw new Error("Entrada inválida");
} catch (erro) {
  console.log(erro.message);
}
}
