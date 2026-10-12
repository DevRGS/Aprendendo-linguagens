// verifica: a aula ordenacao (Collections.sort numa lista de List.of)
// espera: excecao UnsupportedOperationException
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> n = List.of(5, 2, 9, 1);
        Collections.sort(n);
    }
}
