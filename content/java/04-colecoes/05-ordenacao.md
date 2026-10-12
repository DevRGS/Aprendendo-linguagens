# Ordenação

## Ordem natural

`Collections.sort(lista)` ordena pela **ordem natural**: números em ordem crescente e textos em ordem alfabética (com as maiúsculas antes das minúsculas).

```java
List<Integer> numeros = new ArrayList<>(List.of(5, 2, 9, 1));
Collections.sort(numeros);
System.out.println(numeros);   // [1, 2, 5, 9]
```

Para arrays, use `Arrays.sort(array)`.

> [!NOTE]
> `Collections.sort` altera a própria lista. Com uma lista imutável, como a de `List.of`, ele lança `UnsupportedOperationException`; copie antes para um `ArrayList`.

## Uma ordem que você escolhe: `Comparator`

```java
class Pessoa {
    private String nome;
    private int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    String getNome() { return nome; }

    int getIdade() { return idade; }

    @Override
    public String toString() { return nome + " (" + idade + ")"; }
}
```

Não existe uma ordem natural para pessoas: `Collections.sort(pessoas)` nem compila (*no suitable method found for sort*). Você diz como comparar com um **`Comparator`**:

```java
List<Pessoa> pessoas = new ArrayList<>(List.of(
    new Pessoa("Caio", 30), new Pessoa("Ana", 25), new Pessoa("Bia", 30)));

pessoas.sort(Comparator.comparing(Pessoa::getNome));
System.out.println(pessoas);   // [Ana (25), Bia (30), Caio (30)]

pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).reversed());
System.out.println(pessoas);   // [Bia (30), Caio (30), Ana (25)]

pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).thenComparing(Pessoa::getNome));
System.out.println(pessoas);   // [Ana (25), Bia (30), Caio (30)]
```

- `Pessoa::getNome` é uma **referência de método**: "use o `getNome` de cada pessoa". O módulo Java Moderno explica esse recurso.
- `Comparator.comparing(...)` compara pelo valor que a função devolve. `comparingInt`, `comparingLong` e `comparingDouble` fazem o mesmo com números, sem convertê-los em objetos.
- `.reversed()` inverte a ordem, e `.thenComparing(...)` desempata.

> [!NOTE]
> A ordenação de listas é **estável**: elementos empatados mantêm a ordem em que já estavam. Por isso, no segundo exemplo, Bia continua antes de Caio.

## Ordem natural para a sua classe: `Comparable`

Se a classe tem uma ordem "óbvia", ela pode implementar `Comparable` e definir o método `compareTo`, que devolve um número **negativo** se `this` vem antes, **zero** se empatam e **positivo** se `this` vem depois:

```java
class Produto implements Comparable<Produto> {
    private String nome;
    private double preco;

    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    @Override
    public int compareTo(Produto outro) {
        return Double.compare(this.preco, outro.preco);   // pelo preço
    }

    @Override
    public String toString() { return nome; }
}

List<Produto> produtos = new ArrayList<>(List.of(
    new Produto("caderno", 20.0), new Produto("caneta", 3.5), new Produto("mochila", 120.0)));
Collections.sort(produtos);
System.out.println(produtos);   // [caneta, caderno, mochila]
```

`Double.compare(a, b)` e `Integer.compare(a, b)` já devolvem negativo, zero ou positivo.
