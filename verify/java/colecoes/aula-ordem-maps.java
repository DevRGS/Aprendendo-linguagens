// verifica: q14 e a tabela da aula mapas (LinkedHashMap na ordem de inserção; TreeMap na ordem das chaves)
// saida:
// {banana=1, abacaxi=2, caju=3}
// {abacaxi=2, banana=1, caju=3}
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> inserido = new LinkedHashMap<>();
        inserido.put("banana", 1);
        inserido.put("abacaxi", 2);
        inserido.put("caju", 3);
        System.out.println(inserido);
        System.out.println(new TreeMap<>(inserido));
    }
}
