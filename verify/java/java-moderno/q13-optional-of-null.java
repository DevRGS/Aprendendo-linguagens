// verifica: java.java-moderno.q13, f10 e a tabela da aula optional (Optional.of recusa null)
// espera: excecao NullPointerException
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        String nome = null;
        Optional<String> o = Optional.of(nome);
        System.out.println(o);
    }
}
