// verifica: q09, q14 e as aulas conjuntos e ordenacao (na ordem natural, acentuadas vão depois do z; o Collator pt-BR dá a ordem alfabética)
// saida:
// [faca, zebra, ética]
// [Ana, bruno, Érica, ética, faca, zebra]
import java.text.Collator;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.TreeSet;

class Main {
    public static void main(String[] args) {
        System.out.println(new TreeSet<>(List.of("ética", "faca", "zebra")));

        List<String> nomes = new ArrayList<>(List.of("ética", "faca", "zebra", "Érica", "Ana", "bruno"));
        nomes.sort(Collator.getInstance(Locale.forLanguageTag("pt-BR")));
        System.out.println(nomes);
    }
}
