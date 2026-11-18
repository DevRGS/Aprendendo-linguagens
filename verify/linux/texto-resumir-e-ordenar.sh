#!/usr/bin/env bash
# Conferência de: texto/resumir-e-ordenar
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
printf '%s\n' 'azul' 'verde' 'azul' > cores.txt
wc -l < cores.txt
LC_ALL=C sort cores.txt | uniq
printf '%s\n' 'Ana:8' 'Beto:7' | cut -d ':' -f 1
