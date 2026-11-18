#!/usr/bin/env bash
# Conferência de: rotinas/primeiro-script
set -eu
umask 077
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
cat > ola.sh <<'EOF'
#!/usr/bin/env bash
printf '%s\n' 'Olá do script!'
EOF
bash ola.sh
chmod u+x ola.sh
./ola.sh
