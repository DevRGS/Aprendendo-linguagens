# Percorrer o CRUD completo entre navegador e banco

Agora confira o caminho inteiro: evento no navegador → cliente fetch → rota/middleware → repositório SQL → arquivo SQLite → JSON → DOM. Entender cada fronteira facilita descobrir onde um erro começou.

## Roteiro de ponta a ponta

1. Com npm start ativo, abra a origem informada e crie uma conta de laboratório.
2. Adicione "Revisar Node" e observe POST 201. A listagem seguinte deve incluí-la.
3. Mude o título e marque conclusão; os PATCH devem retornar 200.
4. Recarregue o navegador: GET/sessão e GET/tarefas restauram o que foi salvo.
5. Pare e reinicie o Node; abra a mesma origem. O banco e uma sessão ainda válida continuam no arquivo.
6. Exclua a tarefa; DELETE204 e nova consulta confirmam a ausência.

O projeto não usa localStorage para guardar tarefas ou o cookie de autenticação. Seus módulos anteriores continuam válidos como exemplo de CRUD local, mas este projeto usa persistência no servidor. Trocar de computador só mostraria os mesmos dados se ele alcançasse o mesmo servidor com uma conta válida; não há sincronização mágica entre bancos locais distintos.

Teste também um título que pareça HTML, como `<b>estudar</b>`. Ele deve aparecer literalmente. A entrada nunca vira script ou tag pelo renderizador. O README traz o contrato equivalente para chamadas por terminal, o que permite distinguir problemas de API de problemas apenas na tela.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Prática guiada

Execute o roteiro e identifique no código os arquivos de cada fronteira. Termine com logout e verifique que a próxima leitura da API exige login.

<details>
<summary>Conferir resultado e solução</summary>

public/app.js trata a ação; cliente.js monta HTTP; src/app.mjs valida/encaminha; database.mjs executa SQL. Logout revoga a sessão; só esconder a seção da interface não seria suficiente.

</details>

## Fontes

- [MDN — fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
- [MDN — métodos HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
