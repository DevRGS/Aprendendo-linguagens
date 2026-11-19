# Referência de TypeScript

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

## Ambiente

A API usa Node 22.13+ da série 22, SQLite e TypeScript 5.9.3. Rode os comandos na pasta que contém package.json.

- `npm ci` instala as versões fixadas.
- `npm run check` verifica sem emitir.
- `npm run build` compila tipos/ para dist/.
- `npm test` executa a suíte da API.
- `npm start` compila e inicia o servidor na solução.

## Começar a tipar

Rode o compilador, compare inferência e anotações e corrija uma atribuição incompatível.

- **Compilar e executar o primeiro arquivo.** A saída emitida é JavaScript executável pelo Node.

- **Descobrir tipos pela inicialização.** O inicializador numérico determina o tipo da variável neste contexto.

- **Declarar parâmetros e retorno.** A anotação depois do fechamento dos parâmetros indica o retorno.

- **Ler e corrigir um diagnóstico.** O valor e a anotação passam a concordar.

[Leitura oficial do módulo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

## Modelar registros

Descreva tarefas, alterações opcionais e resultados de sucesso ou falha.

- **Descrever a forma de uma tarefa.** O registro distingue concluída e pendente usando boolean.

- **Distinguir ausência e valor falso.** O marcador ? indica que a propriedade pode ser omitida.

- **Modelar sucesso e falha.** A etiqueta literal está nos dois formatos e tem valores diferentes.

- **Refinar um tipo antes de usá-lo.** typeof compara o nome do tipo de execução.

[Leitura oficial do módulo](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## Dados externos

Receba JSON como unknown e normalize a entrada antes de criar um registro.

- **Receber dados desconhecidos.** unknown impede pressupor a estrutura do valor.

- **Validar as propriedades de um objeto.** O teste explícito permite acessar chaves com segurança.

- **Separar a entrada do registro salvo.** O recurso atribui a identidade depois de validar a entrada.

- **Converter uma entrada ao domínio.** O título é aparado uma única vez antes da gravação.

[Leitura oficial do módulo](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## Contratos entre camadas

Organize módulos, modele promises e troque o repositório com um contrato comum.

- **Conectar arquivos e configuração.** outDir no tsconfig aponta para dist.

- **Descrever uma operação assíncrona.** Uma função async sempre devolve uma promessa.

- **Trocar o repositório preservando o contrato.** A compatibilidade estrutural permite implementações diferentes.

- **Reaproveitar um resultado com genéricos.** T é substituído pelo tipo concreto usado em cada aplicação.

[Leitura oficial do módulo](https://www.typescriptlang.org/docs/handbook/2/generics.html)

## Migração da API

Migre criação e leitura de tarefas e preserve os testes HTTP e a autorização.

- **Registrar o comportamento antes de migrar.** A criação devolve o registro novo com Location.

- **Migrar criação e leitura da tarefa.** A autenticação determina o dono no servidor.

- **Exercitar o contrato e um corpo malformado.** raw passa o texto diretamente ao corpo da requisição.

- **Entregar e reproduzir a migração.** O lock registra as versões concretas coerentes com o manifesto.

[Leitura oficial do módulo](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
