# Ignorar arquivos gerados

Logs gerados por ferramentas podem ocupar a listagem de mudanças. Um padrão de .gitignore permite excluir arquivos ainda não rastreados da descoberta normal de novos caminhos.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 8) && cd "$aula"
```

O arquivo README.md já faz parte da versão inicial. Crie um arquivo que simula a saída de uma ferramenta.

## E1 · Preveja e experimente

```bash
echo 'resultado local' > execucao.log
echo '*.log' > .gitignore
git status --short
git check-ignore -v execucao.log
```

**Confira.** O arquivo .gitignore aparece como novo. check-ignore indica o padrão que alcança execucao.log.

## E2 · Investigue uma variação

Acrescente README.md à regra e edite esse arquivo já rastreado. Ele some do status?

**Solução comentada.** Execute `echo README.md >> .gitignore`, `echo 'Teste' >> README.md` e `git status --short`. A edição continua visível porque o arquivo já estava rastreado.

## E3 · Aplique em outra situação

Refaça a regra para ignorar só os logs, inclua-a no próximo commit e preveja o efeito em outro clone.

**Solução comentada.** Execute `echo '*.log' > .gitignore`, `git add .gitignore` e `git commit -m 'Ignora logs locais'`. A regra passa com o projeto. O log gerado fica na máquina.

[Preparação e fontes oficiais](#/git/referencia)
