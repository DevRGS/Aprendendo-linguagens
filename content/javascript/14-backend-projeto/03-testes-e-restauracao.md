# Conferir isolamento, reinício e restauração

Uma demonstração feliz não prova que o aplicativo mantém o contrato em condições ruins. Execute npm test e confira os casos de duas contas, títulos com aspas, respostas 204, JSON inválido, corpo grande, sessão antiga após logout e limite de autenticação.

O teste de persistência cria um arquivo temporário, grava, fecha a aplicação e abre outra instância no mesmo caminho. Só então verifica os dados. Isso diferencia persistência real de uma variável que sobreviveu dentro do mesmo processo.

Uma restauração deve ser planejada com um diretório de destino separado, para não sobrescrever sua única cópia. No laboratório, pare o processo, copie a pasta data para um local protegido, configure DATABASE_PATH para uma cópia e verifique leitura/schema antes de considerar a cópia utilizável. Não trate uma cópia sem teste de restauração como garantia.

O projeto recusa uma versão de esquema maior que conhece. Se mudar a estrutura, escreva uma migração e teste um banco da versão anterior. Apagar o arquivo e criar outro pode ser útil apenas num laboratório descartável explicitamente escolhido, mas não é uma migração de dados.

Testes locais não substituem observação no navegador. Valide Enter, checkbox, foco, apresentação móvel e como a pessoa recupera a interface depois de erro. Também não comprovam a política de um proxy/serviço externo que não participa do laboratório.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Prática guiada

Crie uma tarefa, pare o processo, faça uma cópia protegida e teste a cópia por DATABASE_PATH sem apagar o arquivo original. Compare com o caso de reinício no teste automatizado.

<details>
<summary>Conferir resultado e solução</summary>

Você deve observar o mesmo registro na cópia e continuar com o original intacto. Mantenha o serviço parado durante essa cópia simples e proteja a pasta que contém hashes e sessões.

</details>

## Fontes

- [Node — testes](https://nodejs.org/api/test.html)
- [SQLite — backup](https://www.sqlite.org/backup.html)
- [SQLite — transações](https://www.sqlite.org/lang_transaction.html)
