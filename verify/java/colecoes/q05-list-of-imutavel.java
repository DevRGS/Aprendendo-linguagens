// verifica: java.colecoes.q05, f04 e a aula listas (List.of não aceita add)
// espera: excecao UnsupportedOperationException
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> cores = List.of("azul", "verde");
        cores.add("roxo");
    }
}
