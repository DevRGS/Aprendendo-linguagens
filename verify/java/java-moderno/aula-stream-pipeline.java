// verifica: q06, f06 e a aula streams (o pipeline com toList e com collect)
// saida:
// [50, 80, 90]
// [50, 80, 90]
import java.util.List;
import java.util.stream.Collectors;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(5, 2, 8, 1, 9);
        List<Integer> resultado = numeros.stream()
            .filter(n -> n > 3)
            .map(n -> n * 10)
            .sorted()
            .toList();
        System.out.println(resultado);

        List<Integer> antigo = numeros.stream()
            .filter(n -> n > 3)
            .map(n -> n * 10)
            .sorted()
            .collect(Collectors.toList());
        System.out.println(antigo);
    }
}
