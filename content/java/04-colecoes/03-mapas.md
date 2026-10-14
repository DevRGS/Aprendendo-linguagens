# Mapas

Um **mapa** (`Map`) guarda pares **chave e valor**, como um dicionário: a partir da chave, você encontra o valor. As chaves não se repetem.

```java
Map<String, Integer> estoque = new HashMap<>();
estoque.put("caneta", 10);
estoque.put("caderno", 5);
estoque.put("caneta", 7);                     // chave repetida: troca o valor

System.out.println(estoque.get("caneta"));    // 7
System.out.println(estoque.get("borracha"));  // null (a chave não existe)
System.out.println(estoque.size());           // 2
```

## Operações comuns

| Método | O que faz |
|---|---|
| `put(k, v)` | guarda o par; se a chave já existe, troca o valor |
| `get(k)` | devolve o valor, ou `null` se a chave não existe |
| `getOrDefault(k, padrao)` | devolve o valor, ou `padrao` se a chave não existe |
| `containsKey(k)` | `true` se a chave existe |
| `remove(k)` | remove o par |
| `keySet()`, `values()`, `entrySet()` | as chaves, os valores e os pares |

## Contando ocorrências

Um uso clássico: contar quantas vezes cada palavra aparece.

```java
String[] palavras = {"sol", "lua", "sol", "mar", "sol"};
Map<String, Integer> contagem = new TreeMap<>();
for (String p : palavras) {
    contagem.put(p, contagem.getOrDefault(p, 0) + 1);
}
System.out.println(contagem);   // {lua=1, mar=1, sol=3}
```

## Percorrendo um mapa

```java
for (Map.Entry<String, Integer> par : contagem.entrySet()) {
    System.out.println(par.getKey() + ": " + par.getValue());
}
// lua: 1
// mar: 1
// sol: 3
```

## Qual implementação?

As mesmas três ideias dos conjuntos, agora para as chaves:

| Implementação | Ordem das chaves |
|---|---|
| `HashMap` | nenhuma ordem garantida (a mais usada) |
| `LinkedHashMap` | a ordem de inserção |
| `TreeMap` | a ordem natural das chaves |

> [!TIP]
> `Map.of("a", 1, "b", 2)` (Java 9+) cria um mapa pequeno que não pode ser alterado, como o `List.of`.
