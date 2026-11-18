# REST, status e testes pelo terminal

Uma API REST costuma representar recursos com URLs e operações com métodos. Aqui o recurso é **tarefa**: GET lista/lê, POST cria, PATCH altera campos e DELETE remove. PUT costuma representar substituição completa; não trate PUT e PATCH como sinônimos sem definir o contrato. O projeto implementa PATCH.

## Resultados combinados com o cliente

POST /api/tarefas retorna 201 e Location com o caminho criado. GET/PATCH bem-sucedidos retornam 200 e JSON. DELETE retorna 204 **sem corpo**; chamar response.json nesse resultado causaria um erro de leitura. Um status pertence à resposta HTTP, não a um campo inventado dentro do JSON.

Erros usam um contrato estável: 400 para dados inválidos, 401 para autenticação ausente, 403 para origem/token de proteção, 404 para recurso ausente/alheio e 409 para conflito. O frontend usa status e uma mensagem, sem depender de stack ou texto interno do banco.

## Inspecionar sem depender da interface

O README do projeto tem uma sequência completa para PowerShell e outra para Bash/curl. Execute-a com o servidor final ativo. No PowerShell, Invoke-RestMethod com WebSession conserva o cookie; no Bash, curl usa cookies.txt. Os exemplos incluem Origin e token CSRF, que serão explicados no módulo de autenticação. Não omita esses campos ao testar a API final.

Idempotência se refere ao efeito pretendido de repetir uma operação, não a respostas byte a byte iguais: repetir DELETE pode dar 404 depois da primeira remoção, embora o recurso continue ausente. POST de criação não é reenviado automaticamente pelo cliente do projeto, pois uma falha de rede pode ocorrer depois de a gravação já ter acontecido.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Prática guiada

Use a saúde sem login. Depois siga o cadastro/login no README e crie uma tarefa. Anote status, Location, id e resposta de exclusão.

<details>
<summary>Conferir resultado e solução</summary>

Você deve observar 200 na saúde, 201 ao criar e 204 ao excluir. Guarde o id da resposta; não presuma que será 1. Arquivos de cookie/sessão do terminal são temporários e não devem ser compartilhados.

</details>

## Fontes

- [MDN — métodos HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [MDN — status HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [MDN — fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
