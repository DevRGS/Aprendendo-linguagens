# Enviar uma branch

Uma proposta pode ser publicada sem mexer na branch principal. O primeiro push pode também configurar a referência remota usada para acompanhar o trabalho.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 15) && cd "$aula"
```

Use o remoto descartável origin do kit. A branch de proposta receberá um arquivo próprio.

## E1 · Preveja e experimente

```bash
git switch -c glossario
echo 'Clone: cópia com histórico.' > termos.txt
git add termos.txt
git commit -m 'Define clone no glossário'
git push -u origin glossario
```

**Confira.** O remoto passa a anunciar glossario. A opção -u configura o acompanhamento para essa branch local.

## E2 · Investigue uma variação

Verifique a proposta a partir da pasta do outro colaborador.

**Solução comentada.** `git -C ../colega fetch origin` e `git -C ../colega show origin/glossario:termos.txt` recuperam a definição.

## E3 · Aplique em outra situação

Comprove que main publicada continua sem termos.txt.

**Solução comentada.** `git ls-tree --name-only origin/main` lista README.md. Compare com `git ls-tree --name-only origin/glossario`, que inclui termos.txt.

[Preparação e fontes oficiais](#/git/referencia)
