#!/usr/bin/env bash
# Conferência de: primeiros-passos/atalhos-e-laboratorio
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
mkdir treino
cd treino
printf '%s\n' 'Pasta de treino criada.'
