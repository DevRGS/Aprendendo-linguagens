# static e final

## `static`: da classe, não do objeto

Um atributo comum existe em cada objeto. Um atributo `static` existe **uma vez só**, na classe, e é compartilhado por todos os objetos.

```java
class Contador {
    static int total = 0;   // um só, da classe
    int id;                 // um em cada objeto

    Contador() {
        total++;
        id = total;
    }
}
```

```java
Contador a = new Contador();
Contador b = new Contador();
Contador c = new Contador();
System.out.println(Contador.total);  // 3
System.out.println(b.id);            // 2
```

Um método `static` também é da classe e é chamado pelo nome dela, sem criar objeto: `Math.max(3, 7)` e `Integer.parseInt("42")` são exemplos. O `main` é `static` porque a JVM o chama antes de existir qualquer objeto.

> [!CAUTION]
> Um método `static` não tem `this`, porque não há um objeto "atual". Por isso ele não usa diretamente atributos e métodos de instância. Em `Contador`, um método `static` que tentasse ler `id` daria *non-static variable id cannot be referenced from a static context*.

## `final`: não muda mais

| Onde | O que `final` impede |
|---|---|
| Variável ou atributo | receber outro valor depois do primeiro |
| Método | ser sobrescrito por subclasses |
| Classe | ser estendida (`String` é `final`, por exemplo) |

```java
final double taxa = 0.1;
taxa = 0.2;   // não compila: cannot assign a value to final variable taxa
```

Um atributo `final` precisa receber valor na declaração ou no construtor. Se um construtor deixar de atribuir, o código não compila.

`final` numa variável de objeto trava a **referência**, não o objeto:

```java
final int[] numeros = {1, 2, 3};
numeros[0] = 10;          // pode: muda o conteúdo do array
numeros = new int[3];     // não compila: tentaria trocar a referência
```

## Constantes

`static final` cria uma constante da classe. Por convenção, o nome fica em maiúsculas, com `_` entre as palavras:

```java
class Config {
    static final int MAX_TENTATIVAS = 3;
    static final String NOME_DO_APP = "Central";
}

System.out.println(Config.MAX_TENTATIVAS);  // 3
```
