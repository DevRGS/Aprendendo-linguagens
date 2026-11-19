#!/usr/bin/env bash
# Imprime somente o caminho do novo laboratório na saída padrão.
set -eu
numero=${1:-}
case "$numero" in
  [1-9]|1[0-9]|20) ;;
  *) echo 'Uso: bash preparar.sh N (de 1 a 20)' >&2; exit 2 ;;
esac
lab=$(mktemp -d)
(
  set -eu
  cd "$lab"
  mkdir aluna
  cd aluna
  if [ "$numero" -eq 1 ]; then exit 0; fi
  git init -q -b main
  identidade() {
    git config --local user.name 'Lia do laboratório'
    git config --local user.email 'lia@example.invalid'
    git config --local commit.gpgsign false
    git config --local tag.gpgsign false
  }
  identidade
  echo 'Abra o guia.' > README.md
  git add README.md
  git commit -qm 'Cria a primeira instrução'
  case "$numero" in
    6|7) echo 'Confira a pasta.' >> README.md
      git add README.md
      if [ "$numero" -eq 7 ]; then git commit -qm 'Orienta a conferência da pasta'; else echo 'Nota local.' > notas.txt; fi ;;
    10|11|12)
      git switch -qc docs
      if [ "$numero" -eq 12 ]; then echo 'Abra o guia no editor.' > README.md; else echo 'Use um editor.' > editor.txt; fi
      git add .
      git commit -qm 'Descreve o editor'
      git switch -q main
      if [ "$numero" -eq 12 ]; then echo 'Abra o guia pelo terminal.' > README.md; git commit -qam 'Descreve o terminal'; fi ;;
  esac
  if [ "$numero" -ge 13 ]; then
    git init -q --bare -b main ../central.git
    git remote add origin ../central.git
    git push -qu origin main
    git clone -q ../central.git ../colega
    (cd ../colega && identidade)
    if [ "$numero" -eq 14 ]; then
      (cd ../colega && echo 'Confira a extensão.' >> README.md && git commit -qam 'Esclarece a extensão' && git push -q)
    fi
    if [ "$numero" -eq 16 ]; then
      git switch -qc docs
      echo 'Abra o arquivo.' >> README.md
      git commit -qam 'Explica a abertura do guia'
    fi
    if [ "$numero" -ge 17 ]; then
      echo 'Use o arquivo ausente.' >> README.md
      git commit -qam 'Indica arquivo que ainda não existe'
      git push -q
    fi
    if [ "$numero" -ge 18 ]; then git revert --no-edit HEAD; git push -q; fi
    if [ "$numero" -eq 20 ]; then git tag -a v1.0 -m 'Guia revisado'; git push -q origin v1.0; fi
  fi
) >&2
printf '%s\n' "$lab/aluna"
