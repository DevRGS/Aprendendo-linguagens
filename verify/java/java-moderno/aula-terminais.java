// verifica: a tabela de operações terminais da aula streams
// saida:
// 2
// true
// false
// true
// Optional[Ana]
// Ana Bia Caio
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Bia", "Caio");
        System.out.println(nomes.stream().filter(n -> n.length() == 3).count());
        System.out.println(nomes.stream().anyMatch(n -> n.startsWith("C")));
        System.out.println(nomes.stream().allMatch(n -> n.length() == 3));
        System.out.println(nomes.stream().noneMatch(n -> n.isEmpty()));
        System.out.println(nomes.stream().findFirst());
        nomes.stream().forEach(n -> System.out.print(n + " "));
    }
}
