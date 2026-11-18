#!/usr/bin/env bash
# Conferência de: sistema/disco-e-memoria
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
printf '%s\n' 'conteúdo de teste' > pequeno.txt
df -h . > /dev/null
du -sh . > /dev/null
printf '%s\n' 'Consultas de disco concluídas.'
