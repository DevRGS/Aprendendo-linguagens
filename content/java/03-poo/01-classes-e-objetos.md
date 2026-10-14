# Classes e objetos

Até aqui, todo o código ficou dentro do `main`. Programas maiores organizam dados e comportamentos em **classes**.

- **Classe** é o molde: diz quais dados (**atributos**) e quais ações (**métodos**) uma coisa tem.
- **Objeto** é uma coisa concreta feita a partir do molde. Cada objeto guarda os próprios valores.

```java
class Pessoa {
    String nome;   // atributo
    int idade;     // atributo

    void apresentar() {   // método
        System.out.println("Oi, eu sou " + nome + " e tenho " + idade + " anos.");
    }
}
```

## Criando objetos com `new`

```java
Pessoa ana = new Pessoa();
ana.nome = "Ana";
ana.idade = 30;
ana.apresentar();   // Oi, eu sou Ana e tenho 30 anos.

Pessoa caio = new Pessoa();
caio.nome = "Caio";
caio.apresentar();  // Oi, eu sou Caio e tenho 0 anos.
```

O operador `new` cria o objeto na memória e devolve uma **referência** para ele. O ponto (`.`) acessa os atributos e os métodos daquele objeto.

> [!NOTE]
> Atributos que não recebem valor começam com o **valor padrão**: `0` para números, `false` para `boolean`, o caractere nulo para `char` e `null` para objetos (como `String`). Por isso `caio.idade` vale `0`. Já as variáveis locais, declaradas dentro de métodos, não têm valor padrão.

## Variáveis guardam referências

Uma variável cujo tipo é uma classe não guarda o objeto em si, e sim o "endereço" dele. Copiar a variável copia o endereço:

```java
Pessoa a = new Pessoa();
a.nome = "Ana";
Pessoa b = a;          // b aponta para o MESMO objeto
b.nome = "Bia";
System.out.println(a.nome);  // Bia
```

Pelo mesmo motivo, `==` entre objetos compara referências: dois objetos criados com `new` são diferentes para o `==`, mesmo que tenham os mesmos dados.

## `null`: nenhuma referência

```java
Pessoa p = null;   // p não aponta para objeto nenhum
p.apresentar();    // lança NullPointerException
```

> [!CAUTION]
> Chamar um método ou acessar um atributo por uma referência `null` compila, mas lança `NullPointerException` quando o programa roda.

## Imprimindo um objeto

`System.out.println(ana)` chama o método `toString()` do objeto. Se a classe não define o seu, o padrão mostra o nome da classe, um `@` e um código, algo como `Pessoa@1b6d3586`. Na aula de herança você vai ver como escrever o seu próprio `toString()`.
