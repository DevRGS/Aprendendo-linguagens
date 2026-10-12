// verifica: o aviso da aula optional (get num Optional vazio)
// espera: excecao NoSuchElementException
// erro-contem: No value present
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        Optional<String> vazio = Optional.empty();
        System.out.println(vazio.get());
    }
}
