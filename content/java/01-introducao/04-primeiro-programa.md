# Seu primeiro programa

## O código

Crie um arquivo chamado **`Ola.java`** com este conteúdo:

```java
public class Ola {
    public static void main(String[] args) {
        System.out.println("Olá!");
    }
}
```

- `public class Ola`: declara uma classe pública chamada `Ola`. Em Java, todo código fica dentro de classes.
- `public static void main(String[] args)`: o método por onde o programa começa. A assinatura precisa ser exatamente essa.
- `System.out.println("Olá!");`: imprime o texto e pula uma linha. Toda instrução termina com `;`.

> [!IMPORTANT]
> Uma classe `public` precisa estar num arquivo com **o mesmo nome**, inclusive nas maiúsculas: `public class Ola` vai em `Ola.java`. Se o nome não bater, o `javac` acusa: *class Ola is public, should be declared in a file named Ola.java*.

## Compilar e executar

No terminal, dentro da pasta do arquivo:

```text
javac Ola.java     (gera Ola.class)
java Ola           (executa, sem a extensão)
```

Desde o Java 11, para programas de um arquivo só, dá para pular o `javac`:

```text
java Ola.java
```

## print, println e comentários

```java
System.out.print("a");     // imprime sem pular linha
System.out.println("b");   // imprime e pula linha
System.out.println("c");
// saída:
// ab
// c

/* comentário de
   várias linhas */

/** comentário de documentação (Javadoc) */
```

## Erros comuns de quem está começando

- **Esquecer o `;`** no fim da instrução.
- **Trocar maiúsculas e minúsculas:** Java diferencia `System` de `system`, e `system.out.println` não compila.
- **Dar ao arquivo um nome diferente do da classe pública.**
- **Esquecer de salvar** o arquivo antes de compilar.
