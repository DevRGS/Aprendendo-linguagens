# Atalhos e sua pasta de laboratório

Você não precisa redigitar tudo. No Bash interativo, **seta para cima** recupera comandos anteriores; **Tab** tenta completar nomes. Se mais de um nome combina, pode ser necessário digitar mais letras. **Ctrl+R** pesquisa o histórico. Use **Ctrl+C** para cancelar a linha ou interromper um programa em primeiro plano; não é o atalho de copiar do terminal. Em muitos terminais Linux, copiar/colar é `Ctrl+Shift+C`/`Ctrl+Shift+V`.

`history` mostra o histórico disponível da sessão. Revise um comando recuperado antes de executar. Não coloque senhas ou tokens em comandos: eles podem ficar no histórico.

## Um laboratório separado

As aulas que criam arquivos começam com uma pasta nova feita por `mktemp -d`. O modelo `XXXXXX` é substituído por caracteres que tornam o nome único. Guardamos o caminho em uma variável chamada `LAB`; `cd "$LAB"` entra nessa pasta. Você estudará variáveis com mais calma depois.

> [!IMPORTANT]
> Faça as práticas nos arquivos que você criou no laboratório. Use `pwd` para conferir onde está. Cada aula prepara seus próprios dados: você pode começar por qualquer uma sem depender dos arquivos de outra aula.

As pastas de laboratório continuam no seu disco depois de fechar o terminal. O curso não apaga essas pastas automaticamente. Você pode identificá-las e removê-las depois pelo gerenciador de arquivos.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
mkdir treino
cd treino
printf '%s\n' 'Pasta de treino criada.'
```

Saída esperada:

```text
Pasta de treino criada.
```

## Sua vez

Rode `pwd` e veja o caminho do laboratório. Digite `cd tr` e aperte Tab para completar `treino` quando estiver na pasta que contém esse diretório. Se estiver dentro de `treino`, rode `cd ..` antes.

<details>
<summary>Ver uma solução comentada</summary>

`cd ..` vai à pasta pai; nela, `cd tr` seguido de Tab encontra `treino`. O caminho do laboratório muda em cada execução.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
- [Ubuntu — primeiros passos na linha de comando](https://ubuntu.com/desktop/docs/en/26.04/tutorial/the-linux-command-line-for-beginners/)
