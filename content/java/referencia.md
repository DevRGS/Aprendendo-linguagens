# Referência rápida de Java

Resumo para consultar durante os estudos. Os detalhes de cada assunto estão nas aulas.

## Tipos primitivos

| Tipo | Tamanho | Observação |
|---|---|---|
| `byte` | 8 bits | −128 a 127 |
| `short` | 16 bits | −32.768 a 32.767 |
| `int` | 32 bits | inteiro padrão |
| `long` | 64 bits | sufixo `L` |
| `float` | 32 bits | sufixo `f` |
| `double` | 64 bits | decimal padrão |
| `char` | 16 bits | aspas simples: `'A'` |
| `boolean` | não definido | `true` ou `false` |

## Modificadores de acesso

| Modificador | Mesma classe | Mesmo pacote | Subclasse em outro pacote | Qualquer lugar |
|---|---|---|---|---|
| `public` | ✓ | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| *(nenhum)* | ✓ | ✓ | ✗ | ✗ |
| `private` | ✓ | ✗ | ✗ | ✗ |

## Palavras-chave de orientação a objetos

- `extends`: herda de **uma** classe.
- `implements`: implementa uma ou mais interfaces.
- `abstract`: classe que não pode ser instanciada, ou método sem corpo.
- `final`: variável que não muda, método que não pode ser sobrescrito ou classe que não pode ser herdada.
- `static`: pertence à classe, não a cada objeto.
- `this`: referência ao objeto atual. `super`: referência à superclasse.
- `instanceof`: testa o tipo de um objeto.

## Exceções

- `Throwable` é a raiz. Abaixo dela ficam `Error` (problemas graves, em geral da JVM, que não se costuma tratar) e `Exception`.
- **Unchecked:** `RuntimeException`, `Error` e as subclasses deles. O tratamento é opcional.
- **Checked:** todas as outras, como `Exception` e `IOException`. O compilador exige tratar (`try`/`catch`) ou declarar (`throws`).
- `throw` lança uma exceção; `throws` declara na assinatura do método que ela pode ser lançada.
- `finally` executa com ou sem exceção.
- O try-with-resources (Java 7+) fecha sozinho, na ordem inversa, os recursos `AutoCloseable` declarados entre parênteses.

## Coleções: quando usar

| Coleção | Use quando |
|---|---|
| `ArrayList` | lista de uso geral; acesso rápido por índice |
| `LinkedList` | muitas inserções e remoções nas pontas |
| `HashSet` | valores únicos, sem ordem garantida |
| `LinkedHashSet` | valores únicos, na ordem de inserção |
| `TreeSet` | valores únicos, em ordem crescente |
| `HashMap` | pares chave → valor, sem ordem garantida |
| `LinkedHashMap` | pares chave → valor, na ordem de inserção |
| `TreeMap` | pares chave → valor, ordenados pela chave |

## Interfaces funcionais (Java 8+)

| Interface | Formato |
|---|---|
| `Predicate<T>` | `T → boolean` |
| `Function<T, R>` | `T → R` |
| `Consumer<T>` | `T → void` |
| `Supplier<T>` | `() → T` |
| `BiFunction<A, B, R>` | `(A, B) → R` |
| `Comparator<T>` | `(T, T) → int` |

## Streams

- Operações intermediárias (só rodam quando há uma terminal): `filter`, `map`, `sorted`, `distinct`, `limit`, `skip`.
- Operações terminais: `forEach`, `collect`, `toList()` (Java 16+), `count`, `anyMatch`, `allMatch`, `reduce`.
- `sum()` e `average()` existem nos streams numéricos, como `IntStream`.

## Pegadinhas clássicas

- `10 / 3` dá `3` (divisão entre inteiros).
- Compare textos com `.equals()`, nunca com `==`.
- `switch` com `:` e sem `break` continua nos `case` seguintes (fall-through).
- `arr.length` não tem parênteses; `texto.length()` tem.
- `s.toUpperCase()` não altera `s`: `String` é imutável, então reatribua (`s = s.toUpperCase();`).
- `i++` usa o valor atual e só depois incrementa.
- `Optional.get()` lança `NoSuchElementException` se estiver vazio; prefira `orElse`.
- Em `List<Integer>`, `remove(1)` remove a **posição** 1; para remover o valor, use `remove(Integer.valueOf(1))`.
- Remover itens de uma lista dentro do for-each quebra o laço: use `Iterator.remove()` ou `removeIf`.
- `nextInt()` seguido de `nextLine()` devolve uma linha vazia: descarte a quebra de linha com um `nextLine()` extra.
- `split` recebe expressão regular: `"a.b.c".split(".")` dá um array vazio; use `split("\\.")`.
