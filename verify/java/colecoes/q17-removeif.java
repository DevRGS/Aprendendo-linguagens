// verifica: java.colecoes.q17 e a aula iteracao (removeIf)
// saida:
// [Ana, Bia]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>(List.of("", "Ana", "", "Bia"));
        nomes.removeIf(n -> n.isEmpty());
        System.out.println(nomes);
    }
}
