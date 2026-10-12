// verifica: java.colecoes.q16, f10 e a aula iteracao (Iterator remove só os vazios)
// saida:
// [Ana, Bia]
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>(List.of("", "Ana", "", "Bia"));
        Iterator<String> it = nomes.iterator();
        while (it.hasNext()) {
            String n = it.next();
            if (n.isEmpty()) {
                it.remove();
            }
        }
        System.out.println(nomes);
    }
}
