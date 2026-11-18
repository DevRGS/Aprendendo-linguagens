#!/usr/bin/env bash
# Conferência de: texto/buscar-texto
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
printf '%s\n' 'INFO início' 'ERRO disco' 'erro rede' > eventos.txt
grep -in 'erro' eventos.txt
printf '%s\n' 'a.b' 'axb' > pontos.txt
grep -F 'a.b' pontos.txt
