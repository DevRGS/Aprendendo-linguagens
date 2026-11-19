# Reproduzir a partir de clone limpo

O avaliador precisa reproduzir a entrega usando apenas o remoto e uma marca documentada. Um arquivo esquecido na máquina do autor desaparece nessa conferência.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 20) && cd "$aula"
```

Há uma tag v1.0 publicada no cenário. Para o desafio final, consulte também projeto/README.md no kit. Ele contém um guia inicial, a observação de revisão, a solução e uma variação.

## E1 · Preveja e experimente

```bash
git clone --branch v1.0 ../central.git ../avaliacao
git -C ../avaliacao status --short
cat ../avaliacao/README.md
git -C ../avaliacao rev-parse HEAD
```

**Confira.** O clone aponta para o commit da tag, geralmente em HEAD destacado. O status começa limpo e o guia diz Abra o guia.

## E2 · Investigue uma variação

Acrescente uma instrução em aluna sem registrá-la. O avaliador a recebe?

**Solução comentada.** Use `echo 'Só local.' >> README.md` e compare com `cat ../avaliacao/README.md`. A cópia entregue pela tag permanece igual.

## E3 · Aplique em outra situação

Repita o desafio de projeto com o material inicial. Entregue instruções de clone, nome da tag, justificativa de revisão e provas do conteúdo.

**Solução comentada.** Use o roteiro de projeto/README.md e confira com projeto/verificar.sh. O aceite compara conteúdo e relações entre commits. Explique por que editar, preparar, registrar e publicar são ações diferentes.

[Preparação e fontes oficiais](#/git/referencia)
