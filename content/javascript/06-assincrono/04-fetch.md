# fetch, HTTP e leitura de JSON

`fetch(url)` devolve uma promise com uma Response. **HTTP 404/500 não rejeita automaticamente essa promise**: confira `response.ok` (status entre 200 e 299). Falhas de rede/CORS podem rejeitar; a leitura `response.json()` também é assíncrona e pode rejeitar se o corpo não for JSON válido.

O exemplo usa uma URL `data:` com JSON criado no próprio código, para você testar sem API de terceiros, conta ou internet. Isso demonstra a leitura de uma resposta; não simula todas as características de um servidor HTTP. As Responses com status 200 e 404 são construídas separadamente só para observar `ok`. A função carregarJSON recebe uma URL, confere a resposta e devolve a leitura JSON.

Para ler um arquivo seu, salve `dados.json` com `{"curso":"JavaScript"}` junto do HTML, abra pelo **servidor local da introdução** e use `fetch("./dados.json")` dentro de uma função async. Não espere que a mesma requisição relativa funcione abrindo o HTML por file://.

CORS é uma regra aplicada pelo navegador a origens diferentes. Um servidor precisa permitir a leitura quando necessário. `mode: "no-cors"` normalmente produz uma resposta opaca, cujo corpo seu código não consegue ler; não resolve a necessidade de consumir JSON bloqueado.

## Execute e observe

```javascript
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
```

Saída das chamadas de `console.log`:

```text
JavaScript
true
false
```

## Sua vez

No exemplo, mude o conteúdo da URL data para um texto que não seja JSON e observe o tratamento da falha.

<details>
<summary>Ver uma solução comentada</summary>

A chamada de fetch ainda pode resolver com uma Response bem-sucedida, mas response.json rejeita. O catch registra a falha de leitura; a redação do erro varia por navegador.

</details>

## Fontes

- [MDN — usando fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN — preparar servidor local](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server)
