// verifica: a aula iteracao (for-each e for com índice)
// saida:
// Ana
// Bia
// Caio
// 0: Ana
// 1: Bia
// 2: Caio
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Bia", "Caio");
        for (String nome : nomes) {
            System.out.println(nome);
        }
        for (int i = 0; i < nomes.size(); i++) {
            System.out.println(i + ": " + nomes.get(i));
        }
    }
}
