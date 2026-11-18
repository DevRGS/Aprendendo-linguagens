# Privilégios: quando usar sudo

O usuário **root** tem privilégios administrativos. Isso é diferente do diretório raiz `/`. Seu trabalho diário pode usar uma conta comum, sem executar tudo como administrador.

`sudo comando` solicita executar um comando como outro usuário, normalmente root, conforme a política do sistema. Ele não faz parte do Bash e pode nem estar instalado. A conta precisa ter autorização; conhecer uma senha não garante permissão.

No Ubuntu criado pelo WSL, a conta inicial normalmente tem autorização para `sudo`. Quando houver solicitação, a senha é a **senha Linux**, e nada aparece ao digitá-la. A autenticação pode ficar válida por algum tempo, dependendo da política: não espere que cada uso peça senha.

## Antes de acrescentar sudo

1. Leia o erro e confira o caminho com `pwd` e `ls`.
2. Veja proprietário/permissões com `ls -l`.
3. Decida se a tarefa realmente exige administração. Criar suas notas na pasta pessoal não exige.

Evite usar uma sessão root permanente ou acrescentar `sudo` só para fazer um exemplo funcionar. As práticas desta trilha trabalham com arquivos do próprio usuário e **não precisam de sudo**. Um erro de nome, sintaxe ou arquivo inexistente também não é resolvido por privilégio.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
mkdir meus-estudos
printf '%s\n' 'Arquivo da minha conta.' > meus-estudos/nota.txt
cat meus-estudos/nota.txt
```

Saída esperada:

```text
Arquivo da minha conta.
```

## Sua vez

No seu Ubuntu/Linux, rode `whoami`, `id` e `ls -ld .`. Identifique sua conta e os campos de proprietário/grupo. Não copie nomes ou IDs do exemplo de outra pessoa.

<details>
<summary>Ver uma solução comentada</summary>

Os resultados são próprios da sua máquina. `whoami` mostra o usuário efetivo; `id` acrescenta identificadores/grupos e `ls -ld .` mostra o diretório atual em detalhes.

</details>

## Fontes

- [sudo — manual oficial](https://www.sudo.ws/docs/man/sudo.man/)
- [Ubuntu — primeiros passos na linha de comando](https://ubuntu.com/desktop/docs/en/26.04/tutorial/the-linux-command-line-for-beginners/)
- [Microsoft — configurar o ambiente WSL](https://learn.microsoft.com/pt-br/windows/wsl/setup/environment)
