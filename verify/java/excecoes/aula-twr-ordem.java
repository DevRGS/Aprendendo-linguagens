// verifica: f11, f12 e a aula try-with-resources (close automático, na ordem inversa)
// saida:
// abrindo A
// abrindo B
// usando
// fechando B
// fechando A
class Main {
    public static void main(String[] args) {
        try (Recurso a = new Recurso("A"); Recurso b = new Recurso("B")) {
            System.out.println("usando");
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
