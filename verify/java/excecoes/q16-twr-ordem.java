// verifica: java.excecoes.q16 (o bloco roda e os recursos fecham na ordem inversa)
// saida:
// 1BA
class Main {
    public static void main(String[] args) {
        try (Recurso a = new Recurso("A"); Recurso b = new Recurso("B")) {
            System.out.print("1");
        }
    }
}

class Recurso implements AutoCloseable {
    private final String nome;

    Recurso(String nome) {
        this.nome = nome;
    }

    @Override
    public void close() {
        System.out.print(nome);
    }
}
