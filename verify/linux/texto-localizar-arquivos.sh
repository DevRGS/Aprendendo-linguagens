#!/usr/bin/env bash
# Conferência de: texto/localizar-arquivos
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
mkdir -p notas antigas
touch notas/a.txt antigas/b.txt notas/foto.png
find . -type f -name '*.txt' | sort
