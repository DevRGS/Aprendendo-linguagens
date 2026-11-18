# Login, sessão, cookie, expiração e logout

No login, a API busca a conta e deriva a senha recebida com o salt armazenado. timingSafeEqual compara os bytes esperados; para nome inexistente, uma derivação também é feita e a mensagem de credenciais inválidas é a mesma. Isso reduz uma diferença óbvia de comportamento, sem prometer que toda resposta HTTP tenha tempo idêntico.

Depois do sucesso, o servidor gera um token aleatório de 32 bytes para a sessão. O navegador recebe o valor no cookie; o banco guarda apenas seu SHA256, o usuário, um token CSRF separado e a expiração. Usar SHA256 para indexar um token aleatório de 256 bits é diferente de usá-lo para proteger uma senha humana previsível.

O cookie é HttpOnly, SameSite=Strict e Path=/. HttpOnly impede leitura por JavaScript; não impede o navegador de enviá-lo em requisições permitidas. Secure é usado no modo HTTPS de produção. No laboratório HTTP local, o projeto usa o cookie sem Secure para permitir a demonstração na origem informada.

A sessão dura 8 h no servidor. Expirar o cookie no navegador não substitui conferir a expiração no banco. O login rotaciona a sessão anterior apresentada por esse navegador; logout apaga o registro e limpa o cookie. Outras sessões válidas da mesma conta podem continuar existindo.

GET /api/sessao devolve identidade pública e CSRF. O frontend restaura a conta por essa rota após recarga, em vez de confiar em um booleano salvo no navegador. Não há JWT nem token de sessão em localStorage neste projeto.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Configuração de cookie usada após gravar a sessão em src/app.mjs. cookieName/raw vêm da sessão gerada e secureCookies da configuração validada; o banco continua responsável por expiração/revogação.

```javascript
res.cookie(cookieName, raw, {
  httpOnly: true,
  sameSite: 'strict',
  secure: secureCookies,
  path: '/',
  maxAge: 8 * 60 * 60 * 1000,
});
```

## Prática guiada

Faça login, recarregue, saia e tente consultar tarefas pelo terminal usando o cookie antigo. Inspecione os atributos no painel de cookies do navegador.

<details>
<summary>Conferir resultado e solução</summary>

Após logout, o cookie antigo não autoriza mais: a API retorna 401 porque o registro foi revogado. HttpOnly não permite obter o segredo por document.cookie, mas o navegador mostra os atributos nas ferramentas apropriadas.

</details>

## Fontes

- [OWASP — sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN — Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
- [Node — crypto](https://nodejs.org/api/crypto.html)
