#!/usr/bin/env bash
# Conferência de: sistema/identidade-e-permissoes
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
printf '%s\n' 'anotação pessoal' > privado.txt
chmod 600 privado.txt
stat -c '%a' privado.txt
chmod u+x privado.txt
stat -c '%a' privado.txt

# Solução adicional da seção Sua vez.
chmod u-x privado.txt
stat -c '%a' privado.txt
