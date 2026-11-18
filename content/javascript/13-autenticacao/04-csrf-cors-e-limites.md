# CSRF, CORS e limites de autenticação

Cookies são enviados pelo navegador em contextos permitidos. Isso exige pensar em **CSRF**: um site diferente pode tentar provocar uma ação com as credenciais da pessoa. O projeto combina origem esperada, SameSite e um token de proteção independente da sessão.

Toda mutação da API exige Origin exatamente igual a APP_ORIGIN. Cadastro/login também seguem essa regra para evitar entrada em uma conta imposta por outra origem. Depois do login, operações protegidas exigem X-CSRF-Token da sessão. O frontend recebe esse token em JSON de uma sessão válida e o mantém só em memória.

Não tente definir Origin manualmente no fetch do navegador: ele controla esse cabeçalho. No terminal de teste, o cliente precisa fornecê-lo. Abrir o HTML por file:// ou por um host diferente pode produzir uma origem incompatível; o caminho correto é usar a URL servida pelo Node.

CORS regula leitura entre origens no navegador; não prova identidade nem substitui autorização, e clientes de terminal não ficam sujeitos à mesma barreira. O exemplo não abre CORS para qualquer site. Se uma arquitetura futura separar origens, configure uma lista explícita, credenciais e política de cookies coerentes; curinga com credenciais não é um atalho válido.

O limite local é 10 pedidos de cadastro/login por IP em 5 minutos; excesso retorna 429/Retry-After. O estado fica na memória de um processo, então não é um limitador distribuído de produção. A API também limita hashes simultâneos. Proxies confiáveis e limites globais exigem configuração explícita; o app não confia automaticamente em X-Forwarded-For.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Condição central do middleware csrf em src/app.mjs, executada depois da autenticação. equalToken valida o formato e compara bytes; a verificação de Origin ocorre em outro middleware anterior.

```javascript
if (!equalToken(req.get('x-csrf-token'), req.session.csrf)) {
  throw new ApiError(403, 'CSRF', 'Token de proteção inválido. Recarregue a sessão.');
}
```

## Prática guiada

No terminal, repita uma mutação autenticada sem X-CSRF-Token e depois com Origin de outro site. Use um laboratório novo se quiser observar o limite de tentativas sem bloquear sua própria sessão de estudo.

<details>
<summary>Conferir resultado e solução</summary>

As mutações incompletas/fora de origem recebem 403. Limite de autenticação recebe 429 com um tempo para esperar. CORS não seria suficiente para proteger uma API de chamadas diretas por terminal.

</details>

## Fontes

- [OWASP — prevenção de CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [OWASP — sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Express — práticas de segurança](https://expressjs.com/en/advanced/best-practice-security/)
