# Executar o projeto completo: API de estudos

O projeto para download reúne tudo o que foi estudado: contas, sessões, CRUDSQL, paginação e uma interface JavaScript. Você não precisa montar dezenas de fragmentos para ter uma versão funcional; o pacote contém a fonte completa e os testes.

## Instalação do zero

1. Baixe e extraia o ZIP indicado abaixo.
2. Abra terminal na pasta api-estudos e confira Node/npm.
3. Execute npm ci para instalar exatamente as dependências registradas.
4. Execute npm test e leia o resumo.
5. Execute npm start e abra http://127.0.0.1:3000/ (ou a origem configurada).
6. Crie uma conta de laboratório, adicione/edite/conclua/exclua e recarregue.

No diretório etapas há versões menores de HTTP, Express e banco em memória. Use-as para comparar o mecanismo central com a implementação final. Não execute dois servidores na mesma porta ao mesmo tempo.

O README fornece os comandos equivalentes de PowerShell e Bash, inclusive manutenção do cookie e CSRF. Isso permite testar a API mesmo se houver um erro de interface. Não compartilhe arquivos de sessão, senhas de laboratório que você reutilizou indevidamente ou o banco com hashes.

## Um roteiro de estudo do código

Comece em uma ação da tela e siga o fluxo até a consulta SQL. Depois faça o caminho inverso pela resposta. Altere uma regra pequena, escreva um caso que deveria mudar e rode os testes. Evite mudar autenticação, contrato e esquema ao mesmo tempo sem saber qual diferença produziu uma falha.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Prática guiada

Execute do ZIP extraído em uma pasta nova. Faça o CRUD tanto pela tela quanto por um dos roteiros de terminal. Anote qual arquivo foi responsável por cada comportamento.

<details>
<summary>Conferir resultado e solução</summary>

O ZIP deve funcionar com npm ci e npm start sem copiar arquivos da central. Os testes do pacote usam bancos temporários; suas tarefas pessoais são criadas somente ao executar o servidor final.

</details>

## Fontes

- [Express 5 — API](https://expressjs.com/en/5x/api/)
- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
- [Node — testes](https://nodejs.org/api/test.html)
