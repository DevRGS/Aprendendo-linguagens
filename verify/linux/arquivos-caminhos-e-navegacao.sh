#!/usr/bin/env bash
# Conferência de: arquivos/caminhos-e-navegacao
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
mkdir aulas
touch aulas/nota.txt aulas/.rascunho
cd aulas
printf '%s\n' 'Arquivos, incluindo ocultos:'
ls -A
cd ..
printf '%s\n' 'Voltei à pasta pai.'
