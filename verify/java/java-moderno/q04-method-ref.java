// verifica: java.java-moderno.q04 (String::toUpperCase no map)
// saida:
// [ANA, BIA]
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = List.of("ana", "bia");
        List<String> grandes = nomes.stream().map(String::toUpperCase).toList();
        System.out.println(grandes);
    }
}
