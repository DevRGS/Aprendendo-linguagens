# Instalar Node.js e preparar o projeto

Até aqui o navegador executou seu JavaScript. Agora outro processo executará o **servidor**: Node.js. Ele recebe pedidos HTTP e acessa o banco. O navegador continua responsável por DOM e interação; não recebe acesso direto ao arquivo SQLite nem segredos do servidor.

## 1. Instalar e verificar

No site oficial do Node, selecione uma versão **LTS** e o seu sistema/arquitetura. Em Windows, use o instalador oficial e suas opções de instalação; em macOS, o pacote oficial ou o método documentado; em Linux, siga o método compatível com sua distribuição ou os binários oficiais. Não é necessário instalar WSL apenas para aprender Node no Windows.

Feche e reabra o terminal e execute `node --version` e `npm --version`. Esses comandos pertencem ao **PowerShell/terminal**, não ao console do navegador. Se não forem encontrados, confira a instalação e o PATH; não tente resolver instalando pacotes aleatórios. O projeto exige Node 22.13 ou posterior, foi conferido inicialmente em 22.23.4 e pode emitir aviso experimental de SQLite nessa linha. Consulte sempre a documentação da versão usada.

## 2. Entender os arquivos

`package.json` declara o projeto, scripts e dependências. `package-lock.json` registra as versões resolvidas. `node_modules` contém os pacotes instalados e pode ser recriado; não é o lugar para editar seu código. A configuração `type: module` e os arquivos .mjs usam ESM, com import/export.

## 3. Instalar e iniciar

Depois de extrair o projeto, entre na pasta com `cd`, execute **npm ci**, depois **npm test** e finalmente **npm start**. O ci usa o lockfile e falha se os manifestos estiverem incompatíveis; não é um comando para atualizar dependências. O start mantém o servidor ativo: abra http://127.0.0.1:3000/ e pare com Ctrl+C no terminal.

Você verá contas, tarefas e autenticação já prontas no projeto final. As próximas aulas desmontam essas partes em etapas menores. Não é preciso compreender todas antes de conseguir executá-lo. Não use senhas pessoais no laboratório.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Prática guiada

Extraia o ZIP em uma pasta nova, confira versões, rode os três comandos e abra a tela. Pare e inicie novamente. Localize os scripts em package.json.

<details>
<summary>Conferir resultado e solução</summary>

A página deve mostrar o formulário de acesso. Se aparecer EADDRINUSE, outro processo ocupa a porta: encerre seu servidor anterior ou configure outra porta e origem conforme o README. Não apague o banco para resolver um conflito de porta.

</details>

## Fontes

- [Node — instalação oficial](https://nodejs.org/en/download)
- [npm — instalação reproduzível com npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)
- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
