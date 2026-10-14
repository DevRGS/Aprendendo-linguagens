// verifica: f09 e a aula optional (isPresent, isEmpty, orElse, map e ifPresent)
// saida:
// true
// true
// sem e-mail
// ANA@EXEMPLO.COM
// Enviando para ana@exemplo.com
// true
import java.util.Optional;

class Main {
    static Optional<String> buscarEmail(String nome) {
        if ("Ana".equals(nome)) {
            return Optional.of("ana@exemplo.com");
        }
        return Optional.empty();
    }

    public static void main(String[] args) {
        Optional<String> email = buscarEmail("Ana");
        Optional<String> nada = buscarEmail("Zé");

        System.out.println(email.isPresent());
        System.out.println(nada.isEmpty());
        System.out.println(nada.orElse("sem e-mail"));
        System.out.println(email.map(String::toUpperCase).orElse("?"));
        email.ifPresent(e -> System.out.println("Enviando para " + e));
        nada.ifPresent(e -> System.out.println("não deveria aparecer"));
        System.out.println(nada.map(String::toUpperCase).isEmpty());
    }
}
