# API de estudos — Node, Express e SQLite

Projeto executável da etapa de backend da trilha JavaScript. O navegador chama uma API Node; somente a API abre o banco SQLite. Cada conta acessa suas próprias tarefas. O banco fica no seu computador de estudo, não no GitHub Pages da central.

## 1. Preparar e executar

1. Instale uma versão **LTS do Node.js**, pelo [site oficial](https://nodejs.org/en/download), compatível com Node 22.13 ou posterior. Os exemplos foram inicialmente conferidos em Node 22.23.4. npm acompanha as distribuições oficiais usuais.
2. Abra um terminal novo e confira `node --version` e `npm --version`. Esses comandos são do terminal, não do console do navegador. Se não forem encontrados, confira a instalação/PATH e reabra o terminal.
3. Extraia o ZIP e entre na pasta `api-estudos`, onde está package.json. Não execute os comandos dentro do ZIP sem extraí-lo.
4. Execute:

```bash
npm ci
npm test
npm start
```

O primeiro comando baixa a versão de Express e dependências fixadas no lockfile. O segundo executa testes HTTP com bancos temporários; ele não usa suas tarefas reais. O terceiro inicia o servidor. Deixe o terminal aberto e abra **http://127.0.0.1:3000/**. Cadastre uma conta com nome de 3–30 caracteres (letra inicial; letras/números/_/-) e senha de 12–128 caracteres. Não use uma senha real de outro serviço.

Adicione uma tarefa, mude o título, marque como concluída, recarregue e exclua. Use Sair para revogar a sessão. Ctrl+C no terminal encerra o servidor; suas tarefas continuam no arquivo do banco. `npm start` novamente abre o mesmo arquivo.

O módulo `node:sqlite` é experimental na linha Node 22 e pode exibir um ExperimentalWarning. Esse aviso não significa que a API deixou de iniciar; consulte a documentação da sua versão e mantenha o runtime compatível. As chamadas usadas aqui são síncronas e servem a um laboratório pequeno: consultas longas bloqueariam o processo.

## 2. Configuração local

Sem `.env`, os padrões são porta 3000, origem `http://127.0.0.1:3000` e banco `./data/estudos.sqlite`. Para personalizar, copie `.env.example` para `.env`.

No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux/macOS:

```bash
cp .env.example .env
```

Edite o arquivo no seu editor e reinicie o servidor. Se trocar a porta, atualize também APP_ORIGIN e o endereço do navegador. A origem não inclui caminho nem barra final. `localhost` e `127.0.0.1` são hosts diferentes para cookies/origem; use o endereço que o servidor informa. Não exponha esse laboratório diretamente na internet.

O projeto carrega `.env` com a API do Node; não é necessário instalar dotenv. Não há senha padrão, JWT secreto compartilhado ou conta de administrador embutida. Os tokens de sessão são gerados aleatoriamente.

## 3. O que cada arquivo faz

```text
src/server.mjs       lê configuração, inicia HTTP local e encerra recursos
src/app.mjs          middleware, rotas e contrato de erros
src/database.mjs     esquema/migrações 1 e 2, SQL parametrizado e filtro por proprietário
src/errors.mjs       validação de objetos, credenciais, títulos e parâmetros
src/security.mjs     scrypt, tokens e comparação de CSRF
public/index.html    formulários e lista
public/app.js        estado de interface e eventos de CRUD/login/logout
public/cliente.js    fetch, credenciais, CSRF e tratamento de respostas
public/style.css     apresentação e adaptação à largura pequena
etapas/              exemplos iniciais menores, executáveis separadamente
test/api.test.mjs    integração com HTTP real e banco temporário
data/                criado ao executar; banco pessoal do laboratório
```

Importar app.mjs só cria a fábrica; ela não abre uma porta automaticamente. Isso permite aos testes escolher porta livre e banco separado. Somente public é servido como arquivo estático. O banco, `.env` e código do servidor não ficam nessa pasta.

## 4. Etapas menores

Pare qualquer servidor anterior antes de usar a mesma porta 3000.

```bash
npm run etapa:http
```

Abra http://127.0.0.1:3000/api/saude. Esse primeiro servidor usa node:http e responde `{ "ok": true }`; outra rota devolve 404. Pare com Ctrl+C.

```bash
npm run etapa:express
```

Abra http://127.0.0.1:3000/api/ola/Ana para ver a rota com parâmetro. Esse exemplo não tem banco nem autenticação; não é a API final. Pare com Ctrl+C.

```bash
npm run etapa:banco
```

Esse exemplo cria um banco **em memória**, insere uma tarefa com parâmetro `?`, mostra a linha e fecha. O projeto final usa o mesmo tipo de conexão com um arquivo persistente.

## 5. Contrato da API final

| Método e caminho | Entrada/resultado |
|---|---|
| GET /api/saude | 200 com ok |
| POST /api/usuarios | JSON usuario/senha →201; repetido 409 |
| POST /api/sessao | JSON usuario/senha →200, usuário público, csrf e Set-Cookie |
| GET /api/sessao | Cookie válido →200 com usuário/csrf; ausente/expirado 401 |
| DELETE /api/sessao | Cookie/CSRF/origem →204, revoga e limpa cookie |
| GET /api/tarefas?limit=20&offset=0 | Cookie →200 com itens, total, limit, offset |
| GET /api/tarefas/:id | Cookie →200; ausente/alheio 404 |
| POST /api/tarefas | JSON titulo →201 com tarefa e Location |
| PATCH /api/tarefas/:id | JSON titulo e/ou concluida boolean →200 |
| DELETE /api/tarefas/:id | 204 sem corpo |

Toda mutação exige `Origin` igual a APP_ORIGIN. Depois do login, as mutações protegidas também exigem cookie e `X-CSRF-Token`. O navegador preenche Origin em requisições apropriadas; você não precisa nem pode configurar esse cabeçalho livremente no fetch do frontend. No terminal, informe-o explicitamente.

O título tem 1–120 caracteres após trim. POST aceita somente titulo; PATCH aceita titulo/concluida e exige algum campo. O cliente nunca escolhe usuario_id. Limit é 1–50 e offset 0–1.000.000; resultados vêm por id decrescente. Uma lista pode mudar entre páginas se outro pedido inserir/excluir dados; isso é paginação por offset, não uma fotografia transacional das páginas.

Erros têm formato:

```json
{"erro":{"codigo":"VALIDACAO","mensagem":"O título deve ter de 1 a 120 caracteres."}}
```

400 indica entrada/JSON inválido;401 requer sessão; 403 indica origem/CSRF;404 recurso ausente ou alheio;409 conflito;413 corpo acima de 16 KiB;415 Content-Type incorreto;429 limite de autenticação;500 falha interna;503 autenticação momentaneamente ocupada. Nenhuma resposta 500 inclui stack ou SQL.

## 6. Fazer CRUD pelo PowerShell

Primeiro execute `npm start` em outro terminal. Estes comandos usam apenas uma conta de estudo. Não copie uma senha pessoal.

```powershell
$apiBase = 'http://127.0.0.1:3000'
$cabecalhos = @{ Origin = $apiBase }
$credenciais = @{ usuario = 'ana'; senha = 'senha-de-estudo-123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$apiBase/api/usuarios" -Headers $cabecalhos -ContentType 'application/json' -Body $credenciais
$login = Invoke-RestMethod -Method Post -Uri "$apiBase/api/sessao" -Headers $cabecalhos -ContentType 'application/json' -Body $credenciais -SessionVariable sessao
$cabecalhos['X-CSRF-Token'] = $login.csrf
$nova = @{ titulo = 'Estudar CRUD' } | ConvertTo-Json
$tarefa = Invoke-RestMethod -Method Post -Uri "$apiBase/api/tarefas" -Headers $cabecalhos -WebSession $sessao -ContentType 'application/json' -Body $nova
Invoke-RestMethod -Uri "$apiBase/api/tarefas" -WebSession $sessao
$mudanca = @{ concluida = $true } | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri "$apiBase/api/tarefas/$($tarefa.id)" -Headers $cabecalhos -WebSession $sessao -ContentType 'application/json' -Body $mudanca
Invoke-RestMethod -Method Delete -Uri "$apiBase/api/tarefas/$($tarefa.id)" -Headers $cabecalhos -WebSession $sessao
Invoke-RestMethod -Method Delete -Uri "$apiBase/api/sessao" -Headers $cabecalhos -WebSession $sessao
```

Se a conta já existe, o cadastro devolve 409; use o login com a senha conhecida. Respostas 204 não têm JSON para imprimir. Em erro, PowerShell pode apresentar uma exceção HTTP: confira o status/corpo. A senha e os tokens desses exercícios são dados locais; não coloque os arquivos de sessão nem `.env` em um repositório público.

## 7. Fazer CRUD por curl no Bash

```bash
API_BASE=http://127.0.0.1:3000
curl -i -H "Origin: $API_BASE" -H 'Content-Type: application/json' --data '{"usuario":"bia","senha":"senha-de-estudo-123"}' "$API_BASE/api/usuarios"
curl -sS -c cookies.txt -o sessao.json -H "Origin: $API_BASE" -H 'Content-Type: application/json' --data '{"usuario":"bia","senha":"senha-de-estudo-123"}' "$API_BASE/api/sessao"
CSRF=$(node -p "JSON.parse(require('node:fs').readFileSync('sessao.json','utf8')).csrf")
curl -i -b cookies.txt -H "Origin: $API_BASE" -H "X-CSRF-Token: $CSRF" -H 'Content-Type: application/json' --data '{"titulo":"Estudar CRUD"}' "$API_BASE/api/tarefas"
curl -sS -b cookies.txt "$API_BASE/api/tarefas"
```

Use o id retornado para atualizar e excluir; o exemplo seguinte supõe que você guardou esse id em TAREFA_ID:

```bash
TAREFA_ID=1
curl -i -X PATCH -b cookies.txt -H "Origin: $API_BASE" -H "X-CSRF-Token: $CSRF" -H 'Content-Type: application/json' --data '{"concluida":true}' "$API_BASE/api/tarefas/$TAREFA_ID"
curl -i -X DELETE -b cookies.txt -H "Origin: $API_BASE" -H "X-CSRF-Token: $CSRF" "$API_BASE/api/tarefas/$TAREFA_ID"
curl -i -X DELETE -b cookies.txt -H "Origin: $API_BASE" -H "X-CSRF-Token: $CSRF" "$API_BASE/api/sessao"
```

Troque 1 pelo id da resposta: não presuma que um banco já usado começa nele. cookies.txt e sessao.json contêm material temporário da sessão; apague-os depois e não os compartilhe. Os testes automáticos reproduzem o contrato com fetch, sem depender do shell.

## 8. Como as proteções se conectam

SQL usa placeholders e valores separados. Autenticação deriva hashes com scrypt e salt aleatório; o custo configurado é N32768/r8/p3, alternativa descrita pela OWASP, com maxmem de 64 MiB. A comparação usa timingSafeEqual; login de nome ausente faz a mesma derivação e devolve a mesma mensagem genérica de credenciais inválidas.

Cada sessão tem token aleatório de 256 bits no cookie; apenas seu SHA256 fica no banco. Ela expira em 8 h, é rotacionada no novo login deste navegador e é apagada no logout. SHA256 é adequado aqui para indexar um token aleatório de alta entropia; não seria substituto de scrypt para senhas humanas. Um token CSRF separado é exigido em mutações autenticadas. O token CSRF fica só na memória do cliente e vem de uma sessão válida; não é o token do cookie.

HttpOnly impede ler o cookie por JavaScript; SameSite=Strict reduz envio entre sites. Secure é ativado com NODE_ENV=production e exige APP_ORIGIN HTTPS. A autenticação não basta para autorizar: toda consulta de tarefas filtra usuário **e** id. Tentar um id alheio dá 404. CORS não é autenticação e nenhum curinga é habilitado.

Há limite de 10 pedidos de cadastro/login por IP em 5 minutos e no máximo 2 derivações de senha simultâneas por processo. A limitação usa memória local e não é uma política distribuída de produção. O processo não confia automaticamente em X-Forwarded-For. Cabeçalhos de conteúdo/CSP evitam usos comuns de marcação ativa; o frontend usa textContent para dados.

## 9. Banco, backup e evolução

O arquivo fica em data/estudos.sqlite. O esquema tem usuarios, sessoes e tarefas, com FK e índice por proprietário. `PRAGMA user_version` registra a versão atual 2; a migração 2 mantém os dados da versão 1 e evita reutilizar ids de tarefas por meio de AUTOINCREMENT; o projeto recusa um número de versão maior que conhece. Mudanças futuras exigem migrações numeradas e teste de atualização, não apagar o banco para fazer o erro sumir.

Para um backup simples deste laboratório, pare o servidor com Ctrl+C e copie a pasta data para outro local protegido. SQLite em WAL pode usar arquivos -wal/-shm enquanto está aberto; não trate uma cópia arbitrária de apenas um arquivo em uso como backup consistente. Em sistemas ativos, use a API de backup/ferramenta apropriada e valide restauração.

Para PostgreSQL, é preciso servidor/pool, driver, credenciais em variáveis de ambiente, placeholders/dialeto diferentes e migrações. Preserve os contratos HTTP e teste o repositório com o novo banco; não é só mudar o caminho do arquivo.

## 10. Limites antes de produção

Este é um laboratório local. Para hospedar uma aplicação real, planeje HTTPS/proxy, configuração segura de origem e cookies, segredos, armazenamento persistente/backup, monitoramento, migrações, limites distribuídos, recuperação de conta e revisão de segurança. Não há recuperação de senha, verificação de e-mail, papéis de administrador ou proteção operacional completa. Não publique o servidor no GitHub Pages: Pages serve arquivos estáticos, não processos Node.

Fontes principais: [Node](https://nodejs.org/api/), [Express 5](https://expressjs.com/en/5x/api/), [SQLite](https://www.sqlite.org/lang.html), [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods), [OWASP senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) e [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

Títulos contendo o caractere NUL (U+0000) são rejeitados com 400 antes de chegar ao SQLite, evitando truncamento ou erro interno. Essa validação vale tanto na criação quanto na edição.
