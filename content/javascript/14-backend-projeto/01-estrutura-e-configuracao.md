# Organizar arquivos, configuração e dependências

Separar responsabilidades permite testar e alterar uma parte sem misturar tudo. src/server.mjs trata processo/configuração/listener; app.mjs descreve HTTP; database.mjs concentra SQL; errors.mjs valida e padroniza falhas; security.mjs deriva senhas e resolve tokens. No frontend, cliente.js conhece o contrato HTTP e app.js conhece elementos e eventos.

O processo recebe PORT, APP_ORIGIN e DATABASE_PATH. O arquivo .env é uma conveniência local carregada pelo Node, não uma forma mágica de tornar qualquer texto secreto. Nunca coloque .env em public nem o envie ao repositório; .env.example só mostra configurações de exemplo sem senha embutida.

No Windows copie com Copy-Item .env.example .env; no Linux/macOS, cp .env.example .env. Reinicie após editar. Ao mudar a porta, mude também origem e URL. O processo verifica valores básicos e exige origem HTTPS quando configura cookiesSecure.

O servidor serve somente public. Servir a raiz inteira poderia expor código, banco, lockfiles ou configuração. A central entrega o ZIP como material de estudo; isso não significa que a API esteja rodando dentro do GitHub Pages.

O package-lock deve acompanhar o exemplo para npm ci ser reproduzível. Uma atualização de dependência é uma mudança a verificar, não um comando automático de correção em produção. O projeto está fixado em Express 5.3.0 nesta entrega.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Prática guiada

Abra a árvore do projeto e localize cada fronteira. Copie .env.example para .env, configure uma segunda porta/origem e abra o endereço correspondente.

<details>
<summary>Conferir resultado e solução</summary>

O banco continua privado fora de public. Se acessar pela porta antiga ou trocar só o host, você poderá ter origem/cookie diferentes; mantenha a configuração e a URL alinhadas.

</details>

## Fontes

- [Node — instalação oficial](https://nodejs.org/en/download)
- [npm — instalação reproduzível com npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)
- [Express — práticas de segurança](https://expressjs.com/en/advanced/best-practice-security/)
