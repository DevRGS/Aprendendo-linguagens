#!/usr/bin/env bash
# Conferência de: arquivos/aspas-e-curingas
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
touch 'minhas notas.txt' resumo.txt imagem.png .segredo.txt
printf '<%s>\n' *.txt
printf '<%s>\n' '*.txt'

# Solução adicional da seção Sua vez.
cp "minhas notas.txt" "copia das notas.txt"
