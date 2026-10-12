// verifica: a nota da aula streams (a lista de toList não pode ser alterada)
// espera: excecao UnsupportedOperationException
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> r = List.of(1, 2).stream().toList();
        r.add(3);
    }
}
