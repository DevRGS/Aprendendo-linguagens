# try-with-resources

Arquivos, conexões com banco de dados e o próprio `Scanner` são **recursos**: precisam ser fechados depois do uso. Fechar no `finally` funciona, mas é verboso e fácil de esquecer.

Desde o Java 7, o **try-with-resources** fecha sozinho tudo o que for declarado entre parênteses logo depois do `try`:

```java
try (Scanner sc = new Scanner(Path.of("dados.txt"))) {
    System.out.println(sc.nextLine());
} catch (IOException e) {
    System.out.println("Erro ao ler: " + e.getMessage());
}
// aqui o Scanner já foi fechado, com exceção ou sem
```

## Como funciona

Serve qualquer classe que implemente a interface `AutoCloseable` (ou `Closeable`, que a estende). O Java chama o método `close()` ao sair do bloco:

```java
class Recurso implements AutoCloseable {
    private final String nome;

    Recurso(String nome) {
        this.nome = nome;
        System.out.println("abrindo " + nome);
    }

    @Override
    public void close() {
        System.out.println("fechando " + nome);
    }
}
```

```java
try (Recurso a = new Recurso("A"); Recurso b = new Recurso("B")) {
    System.out.println("usando");
}
// abrindo A
// abrindo B
// usando
// fechando B
// fechando A
```

- Vários recursos são separados por `;` e fechados na **ordem inversa** da abertura.
- O `close()` é chamado mesmo se o bloco lançar uma exceção. Se houver `catch` ou `finally`, eles rodam **depois** do fechamento.

> [!TIP]
> Desde o Java 9, um recurso criado antes pode ir direto nos parênteses, desde que a variável nunca seja reatribuída: `Recurso r = new Recurso("R"); try (r) { ... }`.
