# O que é Java

Java é uma linguagem de programação criada nos anos 1990 pela Sun Microsystems, hoje parte da Oracle. Ela roda em sistemas de bancos, lojas virtuais, aplicativos Android, servidores e muito mais.

## Compilada para bytecode

Em muitas linguagens, o código vira instruções para um processador específico. Em Java é diferente:

1. Você escreve o código-fonte em arquivos `.java`.
2. O compilador `javac` transforma esse código em **bytecode**, guardado em arquivos `.class`.
3. A **JVM** (Java Virtual Machine) lê e executa esse bytecode.

```text
Ola.java  --javac-->  Ola.class (bytecode)  --JVM-->  programa rodando
```

> [!NOTE]
> Enquanto o programa roda, a JVM traduz as partes mais usadas do bytecode para código de máquina. Esse tradutor é o compilador JIT, e é um dos motivos de Java ser rápido.

## Escreva uma vez, rode em qualquer lugar

Como o bytecode não depende do processador nem do sistema operacional, o mesmo `.class` roda no Windows, no Linux e no macOS. Basta ter uma JVM instalada. Esse é o lema *write once, run anywhere*.

## Versões e LTS

Sai uma versão nova do Java a cada seis meses. Algumas são **LTS** (*Long-Term Support*, suporte de longo prazo) e recebem correções por muitos anos: 8, 11, 17, 21 e 25.

> [!TIP]
> Este curso usa o **Java 21**, uma versão LTS muito usada no mercado. Quando um recurso só existir a partir de certa versão, a aula avisa, por exemplo: "Java 16+".
