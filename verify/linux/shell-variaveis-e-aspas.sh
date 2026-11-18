#!/usr/bin/env bash
# Conferência de: shell/variaveis-e-aspas
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
nome='Ana Silva'
printf '%s\n' '$nome'
printf '<%s>\n' "$nome"
arquivo='minhas notas.txt'
printf '%s\n' 'revisão' > "$arquivo"
cat "$arquivo"

# Solução adicional da seção Sua vez.
assunto=Linux
printf '%s\n' "Estudo $assunto"
