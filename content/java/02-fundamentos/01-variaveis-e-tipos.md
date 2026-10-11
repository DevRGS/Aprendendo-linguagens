# Variáveis e tipos primitivos

Uma **variável** é um espaço na memória com um **nome**, um **tipo** e um **valor**. Em Java, o tipo vem antes do nome e não muda depois:

```java
int idade = 25;          // número inteiro
double altura = 1.75;    // número com casas decimais
boolean estudando = true;
char inicial = 'R';      // um único caractere, entre aspas simples
String nome = "Rafael";  // texto, entre aspas duplas
```

> [!NOTE]
> Java é **estaticamente tipado**: o compilador confere os tipos antes de o programa rodar. Guardar um texto numa variável `int` é erro de compilação.

## Os 8 tipos primitivos

| Tipo | Tamanho | Faixa / uso | Exemplo |
|---|---|---|---|
| `byte` | 8 bits | −128 a 127 | `byte b = 100;` |
| `short` | 16 bits | −32.768 a 32.767 | `short s = 2000;` |
| `int` | 32 bits | cerca de −2,1 bilhões a 2,1 bilhões (uso geral) | `int x = 42;` |
| `long` | 64 bits | inteiros enormes; use o sufixo `L` | `long n = 10_000_000_000L;` |
| `float` | 32 bits | decimal com menos precisão; sufixo `f` | `float f = 1.5f;` |
| `double` | 64 bits | decimal padrão do Java | `double d = 3.14;` |
| `char` | 16 bits | um caractere (padrão Unicode) | `char c = 'A';` |
| `boolean` | não definido pela especificação | `true` ou `false` | `boolean ok = true;` |

> [!TIP]
> O `_` dentro de números, como em `10_000_000_000L`, só facilita a leitura. Ele é aceito desde o Java 7.

## `String` não é primitivo

`String` é uma **classe** (`java.lang.String`). É por isso que ela tem métodos, como `nome.length()` e `nome.toUpperCase()`. Na aula sobre Strings você vai ver por que textos se comparam com `.equals()`, e não com `==`.

## Variáveis locais precisam de valor antes do uso

Uma variável declarada dentro de um método (variável **local**) não recebe valor automático. Ler a variável antes de dar um valor a ela é erro de compilação:

```java
int total;
System.out.println(total); // erro: variable total might not have been initialized
```

> [!WARNING]
> Valores padrão (como `0` para `int` e `false` para `boolean`) só existem para **atributos de classes** e **posições de arrays**, nunca para variáveis locais.

## Constantes com `final`

```java
final double PI = 3.14159;
PI = 3; // erro de compilação: uma variável final não pode receber outro valor
```
