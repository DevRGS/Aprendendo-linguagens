#!/usr/bin/env bash
set -eu
remoto=${1:?Informe o caminho do remoto}
destino=$(mktemp -d)
git clone -q --branch guia-v1 "$remoto" "$destino/avaliacao"
cd "$destino/avaliacao"
test "$(git cat-file -t guia-v1)" = tag
test -z "$(git status --short)"
printf 'Guia de estudos\nAbra README.md em um editor de texto.\n' > "$destino/esperado"
diff -u "$destino/esperado" README.md
git merge-base --is-ancestor origin/guia guia-v1
git merge-base --is-ancestor guia-v1 origin/main
git show origin/guia~1:README.md | grep -Fx 'Abra README.md.'
echo 'Entrega conferida no clone limpo.'
