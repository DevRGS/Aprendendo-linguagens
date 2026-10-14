// verifica: a aula streams (joining; groupingBy com TreeMap::new, mapa ordenado pela chave)
// saida:
// Ana, Bia, Caio, Davi, Eva
// {3=[Ana, Bia, Eva], 4=[Caio, Davi]}
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

class Main {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Bia", "Caio", "Davi", "Eva");
        String juntos = nomes.stream().collect(Collectors.joining(", "));
        System.out.println(juntos);
        Map<Integer, List<String>> porTamanho = nomes.stream()
            .collect(Collectors.groupingBy(String::length, TreeMap::new, Collectors.toList()));
        System.out.println(porTamanho);
    }
}
