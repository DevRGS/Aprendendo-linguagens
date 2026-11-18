#!/usr/bin/env bash
# Conferência de: sistema/privilegios-e-sudo
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
mkdir meus-estudos
printf '%s\n' 'Arquivo da minha conta.' > meus-estudos/nota.txt
cat meus-estudos/nota.txt
