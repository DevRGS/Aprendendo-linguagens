#!/usr/bin/env bash
# Conferência de: shell/status-e-condicoes
set -u
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
printf '%s\n' 'Linux' > temas.txt
grep -F 'SQL' temas.txt
estado=$?
printf 'Status: %s\n' "$estado"
grep -qF 'Linux' temas.txt && printf '%s\n' 'Tema encontrado.'
grep -qF 'Java' temas.txt || printf '%s\n' 'Java não aparece.'
