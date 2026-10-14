// verifica: java.java-moderno.q10 (joining põe o separador só entre os itens)
// saida:
// a, b, c
import java.util.stream.Collectors;
import java.util.stream.Stream;

class Main {
    public static void main(String[] args) {
        System.out.println(Stream.of("a", "b", "c").collect(Collectors.joining(", ")));
    }
}
