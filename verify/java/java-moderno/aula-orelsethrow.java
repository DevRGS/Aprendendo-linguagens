// verifica: a aula optional (orElseThrow num Optional vazio)
// espera: excecao NoSuchElementException
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        Optional<String> vazio = Optional.empty();
        System.out.println(vazio.orElseThrow());
    }
}
