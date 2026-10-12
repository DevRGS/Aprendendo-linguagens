// verifica: a aula conjuntos (LinkedHashSet tira repetidos e mantém a ordem)
// saida:
// [3, 1, 2]
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

class Main {
    public static void main(String[] args) {
        List<Integer> comRepetidos = List.of(3, 1, 3, 2, 1);
        Set<Integer> unicos = new LinkedHashSet<>(comRepetidos);
        System.out.println(unicos);
    }
}
