# Criar e inspecionar um commit

Um commit dá uma identidade à fotografia do índice e registra autoria, mensagem e os commits pais. Mensagens curtas que explicam a mudança ajudam outra pessoa a navegar no histórico.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 4) && cd "$aula"
```

Há um commit inicial. Você produzirá mais dois, cada um com um objetivo observável.

## E1 · Preveja e experimente

```bash
echo 'Abra o editor.' >> README.md
git add README.md
git commit -m 'Explica a abertura do editor'
git show --stat --oneline HEAD
```

**Confira.** O resumo exibe sua mensagem e README.md. HEAD designa o commit atual neste contexto.

## E2 · Investigue uma variação

Crie um glossário e registre-o separadamente.

**Solução comentada.** Use `echo 'Índice: próxima fotografia.' > glossario.txt`, `git add glossario.txt` e `git commit -m 'Define índice no glossário'`.

## E3 · Aplique em outra situação

Identifique os dois arquivos atingidos pelos dois commits, do mais novo para o mais antigo.

**Solução comentada.** Rode `git log -2 --name-only --oneline`. O glossário aparece primeiro e README.md depois. Os hashes da sua máquina podem variar.

[Preparação e fontes oficiais](#/git/referencia)
