#!/usr/bin/env bash
set -eu
kit=$(cd "$(dirname "$0")/.." && pwd)
aula=$(bash "$kit/preparar.sh" 13)
cd "$aula"
# Estabeleça o ponto inicial documentado.
cp "$kit/projeto/inicial/README.md" README.md
git add README.md
git commit -m 'Recebe guia inicial do leitor'
git push origin main
git switch -c guia
printf 'Guia de estudos\nAbra README.md.\n' > README.md
git add README.md
git commit -m 'Nomeia o arquivo a abrir'
git push -u origin guia
# O comentário pede o programa usado para a leitura.
printf 'Guia de estudos\nAbra README.md em um editor de texto.\n' > README.md
git diff
git add README.md
git diff --cached
git commit -m 'Explica a abertura no editor após revisão'
git push origin guia
git switch main
git merge --ff-only guia
git tag -a guia-v1 -m 'Guia revisado'
git push origin main guia-v1
bash "$kit/projeto/verificar.sh" ../central.git
