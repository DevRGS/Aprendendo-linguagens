# Cliente fetch e mesma origem

O frontend deixa de ser a fonte definitiva dos dados. Ele envia JSON à API, recebe representações e atualiza a tela. O banco continua privado no servidor. Um arquivo .env colocado no frontend ou uma senha embutida no bundle não seria um segredo.

O projeto serve HTML/CSS/JS e /api no mesmo host/porta. Caminhos relativos como /api/tarefas usam essa origem. Portanto abra a interface pelo endereço do Node, **não pelo servidor Python da etapa inicial da trilha**. Python não executaria essas rotas.

public/cliente.js concentra a comunicação. credentials:same-origin permite o cookie da sessão na origem correspondente. O token CSRF fica em memória e é acrescentado nas mutações; não é o cookie HttpOnly e não substitui login.

Fetch pode resolver em erro HTTP. O cliente verifica response.ok, tenta interpretar o contrato JSON e transforma falhas em mensagens. Antes do parse, trata 204 como ausência de corpo. Falha de rede pode ser ambígua em uma escrita: não reenvie um POST automaticamente sem um mecanismo de idempotência.

Se você separar frontend e API em origens diferentes no futuro, terá de projetar CORS/cookies/credenciais e HTTPS de forma consistente. Mode:no-cors não é uma solução para ler JSON bloqueado. Manter a mesma origem agora deixa o fluxo observável com menos configuração.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Dentro de uma função async do cliente já autenticado, usando createApiClient de public/cliente.js com o CSRF da sessão. A interface completa faz essa preparação em public/app.js.

```javascript
const created = await api.request('/api/tarefas', {
  method: 'POST',
  body: { titulo: 'Estudar API' },
});
console.log(created.id);
```

## Prática guiada

Na página do Node, abra Network e adicione uma tarefa. Confira URL, corpo JSON e cookie enviado sem tentar lê-lo por document.cookie.

<details>
<summary>Conferir resultado e solução</summary>

O pedido vai à mesma origem /api/tarefas. HttpOnly impede JavaScript de ler o token do cookie, mas o navegador ainda pode enviá-lo no pedido permitido.

</details>

## Fontes

- [MDN — fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [MDN — Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
