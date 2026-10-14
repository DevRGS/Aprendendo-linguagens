// verifica: a tabela de operações intermediárias da aula streams
// saida:
// [4, 1, 3, 2]
// [4, 1]
// [2, 1]
// [4, 4, 3, 2, 1, 1]
import java.util.Comparator;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(4, 1, 4, 3, 2, 1);
        System.out.println(numeros.stream().distinct().toList());
        System.out.println(numeros.stream().limit(2).toList());
        System.out.println(numeros.stream().skip(4).toList());
        System.out.println(numeros.stream().sorted(Comparator.reverseOrder()).toList());
    }
}
