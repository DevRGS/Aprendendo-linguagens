// verifica: java.colecoes.q11 (segundo put na mesma chave troca o valor)
// saida:
// 2 1
import java.util.HashMap;
import java.util.Map;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> m = new HashMap<>();
        m.put("a", 1);
        m.put("a", 2);
        System.out.println(m.get("a") + " " + m.size());
    }
}
