# JDK, JRE e JVM

Três siglas aparecem o tempo todo quando se fala de Java. Uma está dentro da outra:

| Sigla | Nome | O que é |
|---|---|---|
| **JVM** | Java Virtual Machine | A máquina virtual que executa o bytecode |
| **JRE** | Java Runtime Environment | JVM + bibliotecas padrão: o necessário para *rodar* programas |
| **JDK** | Java Development Kit | JRE + ferramentas para *desenvolver*: `javac`, `jar`, `jshell`, `javadoc`... |

> [!IMPORTANT]
> Para programar, instale sempre o **JDK**. Só com a JRE não há o compilador `javac`.

A partir do Java 11, a Oracle deixou de distribuir uma JRE separada. Hoje o caminho normal é instalar o JDK, que já traz tudo.

## O que a JVM faz por você

- **Executa o bytecode** no sistema em que está instalada.
- **Gerencia a memória:** o *garbage collector* (coletor de lixo) libera sozinho a memória de objetos que o programa não usa mais. Em Java, você não precisa liberar memória manualmente.
- **Verifica o bytecode** antes de executar, o que traz mais segurança.

## As ferramentas do JDK que você vai usar

- `javac`: compila arquivos `.java` em `.class`.
- `java`: executa um programa e, desde o Java 11, roda direto um programa de um arquivo `.java` só.
- `jshell`: terminal interativo para testar trechos de código (Java 9+).
- `jar`: empacota vários `.class` num arquivo `.jar`.
