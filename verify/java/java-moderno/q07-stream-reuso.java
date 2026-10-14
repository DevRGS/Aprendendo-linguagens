// verifica: java.java-moderno.q07, f08 e a aula streams (stream usado duas vezes)
// espera: excecao IllegalStateException
// erro-contem: stream has already been operated upon or closed
import java.util.List;
import java.util.stream.Stream;

class Main {
    public static void main(String[] args) {
        Stream<Integer> s = List.of(1, 2, 3).stream();
        System.out.println(s.count());
        System.out.println(s.toList());
    }
}
