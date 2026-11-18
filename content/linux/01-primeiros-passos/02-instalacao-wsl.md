# Instalando Ubuntu no Windows com WSL

**Usa Windows e ainda não tem Linux?** O WSL permite instalar Ubuntu e executar ferramentas Linux no próprio Windows. Quem já usa Linux nativo pode pular a instalação e fazer apenas a conferência final no próprio terminal. Se já tem Ubuntu no WSL, abra-o e confira; não é preciso reinstalar.

## 1. Confira o Windows

O caminho moderno abaixo exige **Windows 11** ou **Windows 10 versão 2004 ou posterior, build 19041 ou superior**, conforme a Microsoft. Pressione `Win+R`, digite `winver` e veja a versão/build. Para versões anteriores, consulte a instalação manual no guia oficial. WSL 2 também depende de suporte à virtualização.

Salve o que estiver fazendo: haverá uma reinicialização. É preciso internet e permissão de administrador para instalar. Em computador administrado por uma empresa ou escola, a conta pode não ter essa permissão.

## 2. Baixe e instale WSL e Ubuntu

No menu Iniciar, procure **PowerShell**, clique com o botão direito e escolha **Executar como administrador**. Aceite a solicitação do Windows. Execute **no PowerShell do Windows**:

```powershell
wsl --install -d Ubuntu
```

Esse comando baixa e instala os componentes necessários e a distribuição Ubuntu; você não precisa procurar um instalador em sites de terceiros. **Reinicie o computador** quando terminar. Se o WSL já existe, mas falta Ubuntu, a opção `-d Ubuntu` pede essa distribuição.

## 3. Abra Ubuntu e crie a conta Linux

Depois de reiniciar, abra **Ubuntu** pelo menu Iniciar. Aguarde a preparação inicial. Escolha um nome de usuário Linux simples, como `ana`, e crie uma senha, repetindo-a quando solicitado. Essa conta é separada da sua conta Windows.

> [!NOTE]
> Ao digitar a senha, **nada aparece, nem asteriscos**. É normal: digite e aperte Enter. Guarde a senha; ela será usada quando uma tarefa Linux realmente precisar de `sudo`.

## 4. Confira e saiba voltar

Em uma janela do **PowerShell**, confira as distribuições instaladas e a versão WSL (coluna VERSION):

```powershell
wsl --list --verbose
```

Ubuntu deve aparecer; instalações modernas usam WSL 2 por padrão. Para abrir Ubuntu a partir do PowerShell:

```powershell
wsl -d Ubuntu
```

Se a lista mostra outro nome, use exatamente o nome instalado com `-d`. No **terminal Ubuntu/Bash** recém-aberto, rode:

```bash
cd ~
pwd
printf '%s\n' 'Linux pronto!'
```

O caminho será o da sua pasta pessoal Linux, normalmente `/home/seu_usuario`. Prefira essa pasta para as práticas; não precisa trabalhar em `/mnt/c`, que dá acesso aos arquivos do Windows. Para fechar a sessão Linux, use `exit`; se abriu pelo PowerShell, você volta ao PowerShell.

## Se a instalação não completar

- **Parou em 0,0%:** o guia oficial oferece baixar a distribuição pela alternativa abaixo, no PowerShell como administrador. Use-a como alternativa, não como etapa obrigatória:

```powershell
wsl --install --web-download -d Ubuntu
```

- **Erro de virtualização, como 0x80370102:** consulte a solução de problemas da Microsoft. Pode faltar a Plataforma de Máquina Virtual ou virtualização no firmware; os passos de BIOS/UEFI dependem do fabricante. Confira também se reiniciou.
- **`wsl` não reconhecido ou Windows antigo:** confira `winver` e as etapas manuais no guia oficial.
- **Sem privilégio de administrador:** peça ajuda a quem administra o Windows.

Não é necessário remover ou redefinir uma distribuição para estudar. Uma redefinição pode apagar os arquivos Linux existentes.

## Sua vez

Abra Ubuntu, mostre sua pasta com `pwd`, imprima uma frase e feche com `exit`. Reabra pelo menu Iniciar para confirmar que sabe retornar. A prática do curso acontece nesse Ubuntu, e não no PowerShell.

<details>
<summary>Ver uma solução comentada</summary>

```bash
cd ~
pwd
printf '%s\n' 'Estou no Ubuntu'
exit
```

Esses quatro comandos pertencem à sessão Linux. Reabrir Ubuntu mantém sua conta e os arquivos.

</details>

## Fontes

- [Microsoft — instalar o WSL](https://learn.microsoft.com/pt-br/windows/wsl/install)
- [Microsoft — configurar o ambiente WSL](https://learn.microsoft.com/pt-br/windows/wsl/setup/environment)
- [Microsoft — comandos básicos do WSL](https://learn.microsoft.com/pt-br/windows/wsl/basic-commands)
- [Microsoft — solução de problemas do WSL](https://learn.microsoft.com/pt-br/windows/wsl/troubleshooting)
