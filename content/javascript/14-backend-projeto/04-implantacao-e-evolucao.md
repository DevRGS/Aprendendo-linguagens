# HTTPS, implantação e evolução do banco

O laboratório está pronto para estudo local, não é uma promessa de segurança operacional completa. Para disponibilizar uma aplicação real, escolha um ambiente que execute Node e mantenha dados persistentes; GitHub Pages sozinho não faz isso. A hospedagem da central de aulas e a hospedagem da API são assuntos distintos.

## O que planejar

- HTTPS no acesso público e cookiesSecure; APP_ORIGIN deve coincidir com a origem real.
- Proxy com confiança configurada conscientemente, limites de pedidos e memória, monitoramento e logs sem credenciais/tokens.
- Segredos e configuração fora do frontend/repositório; permissões de arquivos, backups e restauração testada.
- Migrações versionadas e testes antes de atualizar aplicação, dependências ou runtime.
- Política de contas: recuperação de senha, verificação de identidade, revogação e administração, se o produto precisar.

O projeto não implementa envio de e-mail, recuperação de senha, papéis administrativos nem rate limit distribuído. Esses recursos precisam de desenho e testes próprios; não basta exibir um botão no HTML.

## Quando evoluir para PostgreSQL

SQLite é um banco real e permite aprender todo o CRUD deste curso. Um cenário com várias instâncias ou exigências diferentes pode escolher um servidor PostgreSQL. A migração inclui serviço, conexão/pool, driver, credenciais, dialeto/placeholders, migrações e transações. Preserve o contrato HTTP e substitua/teste a camada de repositório; o frontend não deveria aprender a senha do banco.

Para escalar, considere também o custo de consultas síncronas e hash de senha, concorrência, observabilidade e limites do armazenamento. Escolha pela necessidade medida do aplicativo, não pela ideia de que um nome de tecnologia elimina essas responsabilidades.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Prática guiada

Escreva quais decisões seriam necessárias para hospedar uma API de uma turma real. Separe o que o laboratório já implementa do que você ainda precisaria projetar.

<details>
<summary>Conferir resultado e solução</summary>

A API já demonstra contrato, SQL parametrizado, dono, sessão e CSRF. Infraestrutura HTTPS/proxy, operação, recuperação de conta e limites distribuídos exigem trabalho adicional. Nunca entregue credenciais de banco ao JavaScript do navegador.

</details>

## Fontes

- [Express — práticas de segurança](https://expressjs.com/en/advanced/best-practice-security/)
- [PostgreSQL — tutorial oficial](https://www.postgresql.org/docs/current/tutorial.html)
- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
- [OWASP — sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
