// verifica: q10, f06 e a aula conjuntos (LinkedHashSet na ordem de inserção; TreeSet na ordem natural)
// saida:
// [uva, maçã, banana]
// [banana, maçã, uva]
import java.util.LinkedHashSet;
import java.util.List;
import java.util.TreeSet;

class Main {
    public static void main(String[] args) {
        List<String> entrada = List.of("uva", "maçã", "banana", "uva");
        System.out.println(new LinkedHashSet<>(entrada));
        System.out.println(new TreeSet<>(entrada));
    }
}
