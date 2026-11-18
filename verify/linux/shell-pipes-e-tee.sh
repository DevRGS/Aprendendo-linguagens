#!/usr/bin/env bash
# Conferência de: shell/pipes-e-tee
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
printf '%s\n' 'azul' 'verde' 'azul' > cores.txt
LC_ALL=C sort cores.txt | uniq | tee resumo.txt
printf '%s\n' 'Linhas do resumo:'
wc -l < resumo.txt

# Solução adicional da seção Sua vez.
printf '%s\n' 'amarelo' | tee -a resumo.txt
