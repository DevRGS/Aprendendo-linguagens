// Exemplo da aula assincrono/async-await
{
async function listarTemas() {
  return ["JS", "DOM"];
}
async function iniciar() {
  try {
    const temas = await listarTemas();
    console.log(temas.length);
    throw new Error("Falha simulada");
  } catch (erro) {
    console.log(erro.message);
  } finally {
    console.log("Finalizado");
  }
}
iniciar();
}
