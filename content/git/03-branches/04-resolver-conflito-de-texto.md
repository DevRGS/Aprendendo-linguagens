# Resolver conflito de texto

Dois autores partiram da mesma instrução e a substituíram na mesma linha. O Git preserva as versões e pede uma decisão humana. A solução deve comunicar as duas maneiras válidas de abrir o guia.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 12) && cd "$aula"
```

main agora orienta pelo terminal. docs orienta pelo editor. O conflito durante E1 é esperado. Execute cada linha no Bash interativo.

## E1 · Preveja e experimente

```bash
git merge docs
git status --short
cat README.md
```

**Confira.** O merge para com conflito. O status mostra UU e o arquivo contém as duas propostas entre marcadores.

## E2 · Investigue uma variação

Antes de editar, recupere o texto de cada lado e compare as intenções.

**Solução comentada.** `git show :2:README.md` apresenta a versão de main e `git show :3:README.md` a versão de docs neste merge.

## E3 · Aplique em outra situação

Escreva uma instrução que preserve os dois caminhos, retire os marcadores e conclua.

**Solução comentada.** Use `echo 'Abra o guia pelo terminal ou no editor.' > README.md`, `git add README.md` e `git commit -m 'Concilia as duas formas de abrir o guia'`. Confira `git log -1 --format=%P`: o merge tem dois pais. Repita a preparação para testar a resolução em outra cópia.

[Preparação e fontes oficiais](#/git/referencia)
