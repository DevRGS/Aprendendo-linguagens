// verifica: q01, q06, f01 e a aula listas (add, size, get e as operações da tabela)
// saida:
// [Ana, Bia, Caio]
// 3
// Ana
// [pera, maçã, uva]
// [pera, maçã, kiwi]
// [pera, kiwi]
// true
// -1
// false
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bia");
        nomes.add("Caio");
        System.out.println(nomes);
        int total = nomes.size();
        System.out.println(total);
        System.out.println(nomes.get(0));

        List<String> frutas = new ArrayList<>();
        frutas.add("maçã");
        frutas.add("uva");
        frutas.add(0, "pera");
        System.out.println(frutas);
        frutas.set(2, "kiwi");
        System.out.println(frutas);
        frutas.remove("maçã");
        System.out.println(frutas);
        System.out.println(frutas.contains("kiwi"));
        System.out.println(frutas.indexOf("uva"));
        System.out.println(frutas.isEmpty());
    }
}
