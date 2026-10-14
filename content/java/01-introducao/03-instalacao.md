# Instalando o JDK e escolhendo um editor

## 1. Instale o JDK 21

Duas opções gratuitas e confiáveis:

- **Eclipse Temurin**, no site adoptium.net: escolha a versão 21 (LTS) para o seu sistema.
- **Oracle JDK**, no site oracle.com/java.

No Windows e no macOS, o instalador cuida de quase tudo. No Linux, o gerenciador de pacotes da distribuição costuma ter o JDK 21.

## 2. Confira no terminal

Abra um terminal novo (o Prompt de Comando ou o PowerShell, no Windows) e digite:

```text
java -version
javac -version
```

Os dois comandos devem mostrar a versão 21. Se o `javac` não for encontrado, o JDK não está instalado ou a pasta `bin` dele não está no **PATH**, a lista de pastas onde o sistema procura programas.

> [!TIP]
> Muitas ferramentas também procuram a variável de ambiente `JAVA_HOME`, que deve apontar para a pasta do JDK (sem o `bin` no final).

## 3. Escolha onde escrever o código

- **IntelliJ IDEA Community:** gratuito, completo e feito para Java.
- **VS Code** com o *Extension Pack for Java*: leve, bom para quem já usa o VS Code.
- **Eclipse IDE:** gratuito e tradicional em empresas.

Qualquer um serve. Até um editor de texto simples funciona, desde que você compile pelo terminal.

## 4. Teste rápido com o jshell

```text
jshell
jshell> 1 + 2
$1 ==> 3
jshell> /exit
```

O `jshell` mostra o resultado de cada linha na hora. É ótimo para experimentar enquanto você estuda.
