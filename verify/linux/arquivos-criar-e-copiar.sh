#!/usr/bin/env bash
# Conferência de: arquivos/criar-e-copiar
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
mkdir -p projeto/notas
printf '%s\n' 'Revisar comandos' > projeto/notas/plano.txt
cp projeto/notas/plano.txt copia.txt
touch copia.txt
cat copia.txt

# Solução adicional da seção Sua vez.
cp -R projeto reserva
cat reserva/notas/plano.txt
