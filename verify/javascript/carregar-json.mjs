// Mesma função apresentada na aula assincrono/fetch, isolada para conferir falhas.
export async function carregarJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return resposta.json();
}
