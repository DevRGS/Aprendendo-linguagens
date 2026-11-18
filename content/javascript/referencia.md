# Referência rápida de JavaScript

Esta trilha começa no navegador e usa JavaScript moderno amplamente disponível. ECMAScript define a linguagem; DOM, eventos, fetch e localStorage são APIs do ambiente. Os oito módulos iniciais não exigem Node.js. A etapa de backend exige Node e não fornece document automaticamente.

## Preparar o ambiente

Abra as ferramentas de desenvolvedor do Chrome/Firefox e selecione Console. Digite os exemplos curtos ou crie arquivos próprios num editor de texto simples, em UTF-8. Confira a extensão real: index.html é diferente de index.html.txt. O console pode mostrar undefined como retorno de console.log, além da mensagem impressa.

Para repetir declarações let/const no console, use o bloco `{ ... }` indicado nas aulas. Imports estáticos de módulos não podem ficar dentro desse bloco. Não é preciso desativar proteções de colagem do navegador.

Scripts clássicos simples podem funcionar por arquivo local. Para módulos, fetch local e armazenamento previsível, sirva a pasta de estudo por HTTP. Com Python 3 instalado, no Windows/PowerShell:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

No Linux/macOS:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra http://127.0.0.1:8000/ e deixe o terminal aberto; Ctrl+C para parar. Se a porta estiver ocupada, troque no comando e na URL. Se Python estiver ausente, a [aula do servidor local](#/javascript/introducao/servidor-local) explica a preparação e aponta os downloads oficiais. WSL é opcional.

## Variáveis, tipos e decisões

| Forma | Significado |
|---|---|
| `const nome = "Ana"` | Associação sem reatribuição; objetos internos não são congelados |
| `let pontos = 0` | Variável com escopo de bloco que pode ser reatribuída |
| `typeof valor` | Tipo observado; `typeof null` é a exceção histórica `"object"` |
| `Number(texto)` | Conversão numérica explícita; vazio pode virar 0 |
| `String(valor)` | Conversão para string |
| `Number.isFinite(n)` | Verificar número finito, sem coerção de texto |
| `Number.isNaN(n)` | Verificar NaN numérico |
| `===` / `!==` | Igualdade/desigualdade sem coerção de tipos |
| `&&` / `\|\|` | Curto-circuito; retornam operandos, não sempre booleanos |
| `??` | Usar o padrão apenas para null/undefined |
| `obj?.campo` | Interromper o acesso nesse nível null/undefined |

```javascript
{
  const entrada = "8";
  const numero = Number(entrada);
  if (entrada.trim() !== "" && Number.isFinite(numero)) {
    console.log(numero + 2);
  } else {
    console.log("Entrada inválida");
  }
}
```

Strings são imutáveis; métodos como trim retornam novo texto. Template literals usam crases e `${expressao}`. `"8" + 2` concatena e produz `"82"`; `Number("8") + 2` soma e produz 10. NaN não é igual a si mesmo por ===.

If decide por truthy/falsy. Valores como false, 0, string vazia, null, undefined e NaN são falsy; arrays/objetos são truthy mesmo vazios. Switch compara estritamente; break evita continuar por casos seguintes quando esse é o objetivo.

## Funções e laços

```javascript
{
  function somar(a, b = 0) {
    return a + b;
  }
  const dobrar = n => n * 2;
  for (const numero of [1, 2, 3]) {
    console.log(dobrar(somar(numero, 1)));
  }
}
```

- Parâmetros estão na definição; argumentos, na chamada. Padrões de parâmetro entram para undefined/omissão, não para todo null.
- Return devolve o resultado; console.log apenas imprime. Sem retorno explícito, uma função comum devolve undefined.
- Uma arrow com bloco precisa de return. Para objeto literal numa expressão: `nome => ({ nome })`.
- Uma callback pode ser síncrona ou assíncrona. Passe a função, não o resultado de executá-la antecipadamente.
- For...of percorre valores; for...in percorre nomes de propriedades enumeráveis. Break encerra; continue avança à próxima iteração.
- Closure preserva acesso ao ambiente léxico da função. Captura variáveis, não apenas uma fotografia imutável do valor.

## Arrays e objetos

| API | Efeito |
|---|---|
| `lista.push(valor)` / `pop()` | Acrescentar/remover no fim, alterando o array |
| `lista.slice()` | Copiar o array de forma rasa |
| `lista.splice(...)` | Remover/inserir alterando o array |
| `lista.map(fn)` | Novo array dos resultados |
| `lista.filter(teste)` | Novo array dos elementos selecionados |
| `lista.reduce(fn, inicial)` | Acumular um resultado; inicial trata também o vazio |
| `lista.slice().sort((a, b) => a - b)` | Ordenar números numa cópia |
| `pessoa[chave]` | Acessar a propriedade cujo nome vem da expressão |
| `Object.keys(pessoa)` | Nomes de propriedades próprias enumeráveis de string |
| `{ ...pessoa }` / `[...lista]` | Cópias rasas |
| `JSON.stringify(dados)` | Serializar dados compatíveis para string |
| `JSON.parse(texto)` | Interpretar JSON; pode lançar SyntaxError |

Sort altera o array e, sem comparador, usa ordem baseada na representação textual. Map/filter não impedem efeitos colaterais de callbacks escritas para alterar objetos. Objetos internos continuam compartilhados em uma cópia rasa. Comparação === entre objetos verifica identidade.

JSON não preserva funções, undefined, todos os recursos de datas/classes ou ciclos. Depois de parse, valide o formato e os tipos de negócio; sintaxe válida não garante estrutura correta.

## DOM e eventos

| API | Uso |
|---|---|
| `document.querySelector("#id")` | Primeiro elemento ou null |
| `document.querySelectorAll(".item")` | NodeList estática |
| `elemento.textContent = texto` | Mostrar texto sem interpretar HTML |
| `document.createElement("li")` | Criar um elemento fora da árvore |
| `pai.append(filho)` | Inserir ou mover o nó |
| `elemento.classList.add("ativo")` | Acrescentar classe; a aparência depende do CSS |
| `botao.addEventListener("click", fn)` | Registrar callback de evento |
| `form.addEventListener("submit", fn)` | Tratar intenção de envio |
| `evento.preventDefault()` | Cancelar ação padrão cancelável |
| `campo.value` | Ler valor textual de um campo |

Prefira botões reais com type explícito, labels nos campos e feedback textual. Target é o alvo original do evento; currentTarget é o elemento cujo listener executa. Não forneça texto digitado diretamente a innerHTML. Exemplos completos estão no módulo DOM; os fragmentos da tabela pressupõem elementos existentes.

## Assíncrono

```javascript
{
  async function carregar(url) {
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json();
  }
  const url = "data:application/json," + encodeURIComponent('{"tema":"JS"}');
  carregar(url)
    .then(dados => console.log(dados.tema))
    .catch(erro => console.log(erro.message));
}
```

- SetTimeout agenda uma tarefa posterior; atraso 0 não interrompe o trecho atual. ClearTimeout cancela o agendamento pendente.
- Then devolve outra promise. Return alimenta a próxima etapa; throw pode rejeitá-la. Catch trata rejeição; finally ajuda na limpeza.
- Async sempre devolve promise. Await suspende a função, sem transformar trabalho síncrono pesado em outra thread.
- Promise.all acompanha operações; rejeitar o resultado conjunto não cancela automaticamente as demais.
- Fetch normalmente resolve inclusive em HTTP 404/500: confira ok/status. Rede/CORS e a leitura JSON podem falhar separadamente. No-cors não libera leitura de um corpo opaco.

## Classes, módulos e persistência

Classes se apoiam em protótipos. New chama o constructor; um método normal recebe this conforme a chamada. Passar um método sem receptor pode perder o this esperado; uma wrapper `() => objeto.metodo()` preserva a chamada. Arrow não cria this próprio.

Em módulos, use export/import no nível superior; carregue o ponto de entrada com `<script type="module" src="app.mjs"></script>` por HTTP. Caminhos relativos incluem extensão e prefixo ./ ou ../. Cada módulo tem seu escopo e roda em modo estrito.

LocalStorage guarda strings por origem (protocolo/host/porta), sem sincronização remota automática. Use chave própria, JSON e validação. Trate acesso negado, limite e dados inválidos; removeItem apaga uma chave, enquanto clear apaga todas. Os dados podem ser removidos e não são um backup garantido.

O [projeto final](#/javascript/pratica/projeto-final) fornece um HTML completo de lista de estudos, com entrada validada, texto literal, marcação/remoção, persistência e tratamento de falhas.

## Backend: Node, API e banco de dados

A etapa de backend acrescenta seis módulos com um projeto real: **navegador → API Node/Express → SQLite**. O banco fica no servidor; o frontend não recebe suas credenciais nem abre o arquivo SQL diretamente.

[Baixar o projeto completo API de estudos](content/javascript/projetos/api-estudos.zip) · [Ler o README do projeto](content/javascript/projetos/api-estudos/README.md) · [Começar a etapa Node](#/javascript/node/instalacao-node)

Extraia o pacote, entre na pasta api-estudos e use um Node LTS compatível com 22.13+. No terminal:

```bash
node --version
npm --version
npm ci
npm test
npm start
```

Abra http://127.0.0.1:3000/, crie uma conta de estudo e faça o CRUD. Ctrl+C encerra o servidor. O README traz instalação, PowerShell/curl e configuração de outra porta/origem. Node 22 pode emitir aviso experimental de node:sqlite; os exemplos também foram conferidos na linha 26 LTS.

| Operação | Rota | Resultado |
|---|---|---|
| Saúde | GET /api/saude | 200 |
| Cadastro | POST /api/usuarios | 201; conflito 409 |
| Login | POST /api/sessao | 200, cookie e token CSRF |
| Restaurar sessão | GET /api/sessao | 200 ou 401 |
| Logout | DELETE /api/sessao | 204, revoga sessão |
| Listar | GET /api/tarefas?limit=20&offset=0 | 200 com itens, total, limit, offset |
| Ler uma | GET /api/tarefas/:id | 200 ou 404 |
| Criar | POST /api/tarefas | 201, representação e Location |
| Atualizar campos | PATCH /api/tarefas/:id | 200 |
| Excluir | DELETE /api/tarefas/:id | 204 sem corpo |

O JSON de tarefa tem id, titulo, concluida. POST aceita titulo; PATCH aceita titulo e/ou concluida booleano. O dono vem da sessão. Título tem 1–120 caracteres após trim; campos extras são rejeitados. Os erros usam `{erro:{codigo,mensagem}}`, sem stack/SQL no cliente.

| Status | Contrato do projeto |
|---|---|
| 400 | Entrada ou JSON inválido |
| 401 | Sessão/autenticação necessária |
| 403 | Origem ou proteção CSRF recusada |
| 404 | Recurso ausente ou alheio |
| 409 | Nome de usuário já usado |
| 413 /415 | Corpo grande /tipo de conteúdo não aceito |
| 429 | Limite de autenticação, com Retry-After |
| 500 /503 | Falha interna genérica /autenticação ocupada |

### SQL parametrizado e propriedade

```javascript
const row = db.prepare(
  'SELECT id, titulo, concluida FROM tarefas WHERE usuario_id = ? AND id = ?'
).get(userId, id);
```

O trecho pertence ao repositório com conexão/esquema já abertos. Dados e SQL são separados; toda operação de tarefa filtra usuário/id. Listagem tem LIMIT/OFFSET validados e ordem por id decrescente. Transações usam BEGIN, COMMIT e ROLLBACK; versão do esquema é registrada. Para cópia simples, pare o laboratório e copie a pasta data; em uso com WAL, use um mecanismo consistente e teste restauração.

### Sessão e frontend

Senhas são derivadas com scrypt/salt/custo, não guardadas em texto puro. Token de sessão aleatório fica em cookie HttpOnly/SameSite=Strict; só seu hash está no banco. A sessão expira em 8 h e o logout revoga o token. Secure é ativado na configuração HTTPS de produção.

Mutações exigem Origin configurada; as autenticadas também exigem X-CSRF-Token da sessão. O token CSRF fica na memória do cliente e não substitui o cookie. A API não abre CORS curinga; CORS não substitui autenticação/autorização.

O cliente usa credenciais da mesma origem e trata 204 antes de ler JSON. Em 401 pede novo acesso; em falha de rede não repete POST automaticamente. A interface utiliza textContent, mensagens e bloqueio de pedidos sobrepostos na aba. O exemplo não promete versionamento de toda alteração entre clientes diferentes.

O laboratório não hospeda uma API no GitHub Pages. Publicação real exige serviço Node, HTTPS/proxy, configuração, segredos, backup, migrações e revisão de operação/segurança. Não inclui recuperação de senha, verificação de e-mail ou limitador distribuído. Evoluir para PostgreSQL exige testar driver, pool, dialeto, credenciais e migrações no servidor.

## Fontes e créditos

Textos, perguntas e exemplos originais em português. Fontes consultadas em 16/11/2026:

- [MDN — Guia JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide) e [ECMAScript 2026](https://tc39.es/ecma262/2026/).
- [MDN — DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model), [eventos](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [módulos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) e [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- [MDN — servidor local](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server), [Python — downloads](https://www.python.org/downloads/) e [http.server](https://docs.python.org/3/library/http.server.html).
- Backend: [Node](https://nodejs.org/api/), [Express 5](https://expressjs.com/en/5x/api/), [SQLite](https://www.sqlite.org/lang.html), [OWASP senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) e [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
