// verifica: java.java-moderno.q11 (a ordem montada dá [50, 80])
// saida:
// [50, 80]
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(5, 2, 8, 1, 9);
        List<Integer> r = numeros.stream()
            .filter(n -> n > 3)
            .map(n -> n * 10)
            .sorted()
            .limit(2)
            .toList();
        System.out.println(r);
    }
}
