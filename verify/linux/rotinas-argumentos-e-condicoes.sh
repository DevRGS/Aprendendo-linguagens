#!/usr/bin/env bash
# Conferência de: rotinas/argumentos-e-condicoes
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
cat > saudar.sh <<'EOF'
#!/usr/bin/env bash
nome=${1:-Visitante}
if [ "$nome" = Visitante ]; then
    printf '%s\n' 'Informe seu nome na próxima vez.'
else
    printf 'Olá, %s!\n' "$nome"
fi
EOF
bash saudar.sh 'Ana Silva'
bash saudar.sh
