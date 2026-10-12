// verifica: java.java-moderno.q09, f07 e a aula streams (sem operação terminal, nada roda; só o "fim" aparece)
// saida:
// fim
import java.util.stream.Stream;

class Main {
    public static void main(String[] args) {
        Stream.of("a", "b", "c")
            .peek(s -> System.out.print(s))
            .filter(s -> !s.equals("b"));
        System.out.println("fim");
    }
}
