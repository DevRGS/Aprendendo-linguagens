// verifica: java.colecoes.q15, f10 e a aula iteracao (remover dentro do for-each)
// espera: excecao ConcurrentModificationException
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>(List.of("", "Ana", "", "Bia"));
        for (String n : nomes) {
            if (n.isEmpty()) {
                nomes.remove(n);
            }
        }
    }
}
