// verifica: a dica da aula try-with-resources (Java 9+: recurso criado antes, nunca reatribuído)
// saida:
// abrindo R
// usando R
// fechando R
class Main {
    public static void main(String[] args) {
        Recurso r = new Recurso("R");
        try (r) {
            System.out.println("usando R");
        }
    }
}

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
