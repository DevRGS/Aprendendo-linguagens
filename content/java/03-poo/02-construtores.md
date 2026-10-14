# Construtores

Criar o objeto e depois preencher atributo por atributo é cansativo e fácil de esquecer. O **construtor** recebe os dados já na criação.

```java
class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {   // construtor
        this.nome = nome;
        this.idade = idade;
    }
}

Pessoa ana = new Pessoa("Ana", 30);
```

- O construtor tem **o mesmo nome da classe** e **nenhum tipo de retorno** (nem `void`).
- Ele roda automaticamente a cada `new`.

## `this`: o próprio objeto

Dentro da classe, `this` é a referência ao objeto que está sendo usado. Em `this.nome = nome`, `this.nome` é o atributo e `nome` é o parâmetro.

> [!WARNING]
> Sem o `this`, a linha `nome = nome;` atribui o parâmetro a ele mesmo, e o atributo continua `null`. O código compila, mas não faz o que você queria.

## O construtor padrão

Se a classe **não declara nenhum** construtor, o compilador cria um sem parâmetros, que não faz nada. Por isso `new Pessoa()` funcionava na aula anterior.

> [!IMPORTANT]
> Assim que você declara um construtor, o padrão deixa de existir. Na classe acima, que só declara `Pessoa(String nome, int idade)`, `new Pessoa()` não compila: *constructor Pessoa in class Pessoa cannot be applied to given types*.

## Vários construtores

Uma classe pode ter vários construtores, desde que os parâmetros sejam diferentes (isso se chama **sobrecarga**). Um construtor pode chamar outro com `this(...)`:

```java
class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    Pessoa(String nome) {
        this(nome, 0);    // chama o construtor de cima
    }
}

Pessoa bia = new Pessoa("Bia");
System.out.println(bia.nome + ", " + bia.idade);  // Bia, 0
```

> [!NOTE]
> No Java 21, `this(...)` precisa ser a **primeira instrução** do construtor. Se vier depois de outra linha, o `javac` acusa: *call to this must be first statement in constructor*. Versões mais novas do Java passaram a permitir algumas instruções antes dessa chamada, mas este curso segue o Java 21.
