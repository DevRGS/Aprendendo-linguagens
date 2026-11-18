#!/usr/bin/env bash
# Conferência de: arquivos/mover-e-remover
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
mkdir entrega
printf '%s\n' 'Primeira versão' > rascunho.txt
mv rascunho.txt entrega/final.txt
cat entrega/final.txt
rm -- entrega/final.txt
rmdir entrega
printf '%s\n' 'Diretório vazio removido.'
