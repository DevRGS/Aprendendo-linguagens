#!/usr/bin/env bash
# Conferência de: rotinas/repeticao-e-projeto
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
mkdir reserva
printf '%s\n' 'ler' 'praticar' > 'minhas notas.txt'
printf '%s\n' 'revisar' > resumo.txt
for arquivo in *.txt; do
    [ -f "$arquivo" ] || continue
    cp -- "$arquivo" reserva/
    linhas=$(wc -l < "$arquivo")
    printf '%s: %s\n' "$arquivo" "$linhas"
done
