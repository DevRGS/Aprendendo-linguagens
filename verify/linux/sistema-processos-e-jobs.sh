#!/usr/bin/env bash
# Conferência de: sistema/processos-e-jobs
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
sleep 30 &
pid=$!
kill -TERM "$pid"
wait "$pid" 2>/dev/null || :
printf '%s\n' 'Meu processo de treino terminou.'
