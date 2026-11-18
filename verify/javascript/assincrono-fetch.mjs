// Exemplo da aula assincrono/fetch
{
async function carregarJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return resposta.json();
}
async function carregar() {
  const url = "data:application/json," + encodeURIComponent('{"curso":"JavaScript"}');
  try {
    const dados = await carregarJSON(url);
    console.log(dados.curso);
    const sucesso = new Response('{}', { status: 200 });
    console.log(sucesso.ok);
    const ausente = new Response("Não encontrado", { status: 404 });
    console.log(ausente.ok);
  } catch (erro) {
    console.log(`Falha: ${erro.message}`);
  }
}
carregar();
}
