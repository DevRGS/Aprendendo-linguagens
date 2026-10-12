// verifica: a dica da aula mapas (Map.of não pode ser alterado)
// espera: excecao UnsupportedOperationException
import java.util.Map;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> m = Map.of("a", 1, "b", 2);
        m.put("c", 3);
    }
}
