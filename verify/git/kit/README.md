# Laboratório de Git e GitHub

Use Bash e Git 2.28 ou superior. No Windows, use Git Bash ou o Bash no WSL.
Cada aula da Central indica um número entre 1 e 20. Abra a pasta que contém
este arquivo no terminal e execute a preparação indicada na aula. Por exemplo:

```bash
kit=$PWD
aula=$(bash preparar.sh 2) && cd "$aula"
git status
```

Cada chamada cria uma pasta de treino nova dentro do diretório temporário do sistema. Guarde o material que quiser manter antes de uma limpeza de temporários. Para preparar outra aula, volte com `cd "$kit"`. Os remotos de simulação ficam dentro do laboratório.

Para a entrega final, abra projeto/README.md. O material inclui o guia inicial,
uma revisão de exemplo, uma solução comentada e a verificação em clone limpo.
