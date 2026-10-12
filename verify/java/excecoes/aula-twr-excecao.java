// verifica: q17 e a aula try-with-resources (fecha mesmo com exceção, antes do catch e do finally)
// saida:
// abrindo A
// fechando A
// tratando falhou
// finally
class Main {
    public static void main(String[] args) {
        try (Recurso a = new Recurso("A")) {
            throw new IllegalStateException("falhou");
        } catch (IllegalStateException e) {
            System.out.println("tratando " + e.getMessage());
        } finally {
            System.out.println("finally");
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
