// verifica: java.java-moderno.q12 (orElse num Optional vazio)
// saida:
// padrão
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        Optional<String> vazio = Optional.empty();
        System.out.println(vazio.orElse("padrão"));
    }
}
