#!/usr/bin/env bash
# Conferência de: shell/redirecionamentos
set -u
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
printf '%s\n' 'primeira' > notas.txt
printf '%s\n' 'segunda' >> notas.txt
cat notas.txt
cat inexistente.txt 2> erros.txt
estado=$?
if [ "$estado" -ne 0 ] && [ -s erros.txt ]; then
    printf '%s\n' 'Falha registrada no arquivo de erros.'
fi
