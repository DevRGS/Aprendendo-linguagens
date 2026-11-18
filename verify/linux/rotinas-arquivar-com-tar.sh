#!/usr/bin/env bash
# Conferência de: rotinas/arquivar-com-tar
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
mkdir notas destino
printf '%s\n' 'Revisar Bash' > notas/plano.txt
tar -czf pacote.tar.gz notas
tar -tzf pacote.tar.gz
tar -xzf pacote.tar.gz -C destino
cat destino/notas/plano.txt
