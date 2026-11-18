# Terminal, Linux e Bash

O **terminal** é a janela em que você digita e lê texto. O **shell** interpreta os comandos. Nesta trilha, usamos o shell **Bash** em um sistema **GNU/Linux**, diretamente ou pelo Ubuntu no WSL. Ubuntu é uma distribuição Linux: reúne o sistema e ferramentas para usá-lo.

Uma janela do Windows Terminal pode abrir PowerShell ou Ubuntu. A aparência da janela não garante qual shell está rodando. Comandos como `Get-Location` são do PowerShell; os exemplos `bash` deste curso devem rodar no Linux/Ubuntu.

## Abrir e reconhecer o ambiente

No Linux, procure o aplicativo Terminal. No Ubuntu Desktop, `Ctrl+Alt+T` costuma abri-lo. No Windows, siga a próxima aula para instalar e abrir Ubuntu. Não é necessário WSL para quem já usa Linux.

O texto antes da área de digitação é o **prompt**, por exemplo `ana@pc:~$`. Ele varia. **Não digite esse prefixo nem o `$`** ao copiar comandos. Depois de digitar, aperte Enter. Um comando pode terminar sem imprimir nada; isso sozinho não significa erro.

No Bash, `printf` imprime texto conforme um formato. Aqui, `%s` recebe o texto e `\n` pula uma linha. Aspas mantêm o texto como um argumento.

## Experimente no seu terminal

Execute:

```bash
printf '%s\n' 'Olá, terminal!'
```

Saída esperada:

```text
Olá, terminal!
```

## Sua vez

Abra o terminal Linux e troque o texto do exemplo pelo seu nome. Se ainda está no PowerShell, vá à aula de instalação antes de continuar.

<details>
<summary>Ver uma solução comentada</summary>

```bash
printf '%s\n' 'Meu nome é Ana'
```

O primeiro argumento é o formato; o segundo é o texto que será impresso.

</details>

## Fontes

- [Ubuntu — primeiros passos na linha de comando](https://ubuntu.com/desktop/docs/en/26.04/tutorial/the-linux-command-line-for-beginners/)
- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
