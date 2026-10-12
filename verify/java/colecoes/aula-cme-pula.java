// verifica: a aula iteracao (quando não lança exceção, o for-each pula itens)
// saida:
// [Ana, ]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>(List.of("Ana", "", ""));
        for (String n : nomes) {
            if (n.isEmpty()) {
                nomes.remove(n);
            }
        }
        System.out.println(nomes);
    }
}
