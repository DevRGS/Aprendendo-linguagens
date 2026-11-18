#!/usr/bin/env bash
# Conferência de: texto/ler-arquivos
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
printf '%s\n' 'estudar' 'praticar' 'revisar' > agenda.txt
head -n 1 agenda.txt
tail -n 1 agenda.txt
