// verifica: java.java-moderno.q03, f05 e a aula lambdas (a lambda não altera variável local)
// espera: erro-de-compilacao
// erro-contem: local variables referenced from a lambda expression must be final or effectively final
import java.util.List;

class Main {
    public static void main(String[] args) {
        int total = 0;
        List.of(1, 2, 3).forEach(n -> total += n);
    }
}
