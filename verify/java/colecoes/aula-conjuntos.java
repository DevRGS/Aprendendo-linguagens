// verifica: q07, q08, f05 e a aula conjuntos (Set não guarda repetidos; add devolve false)
// saida:
// false
// 2
// true
import java.util.HashSet;
import java.util.Set;

class Main {
    public static void main(String[] args) {
        Set<String> tags = new HashSet<>();
        tags.add("java");
        tags.add("sql");
        boolean entrou = tags.add("java");
        System.out.println(entrou);
        System.out.println(tags.size());
        System.out.println(tags.contains("sql"));
    }
}
