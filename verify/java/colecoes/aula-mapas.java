// verifica: q12, f07 e a aula mapas (put substitui; get de chave ausente é null; containsKey e remove)
// saida:
// 7
// null
// 2
// true
// false
import java.util.HashMap;
import java.util.Map;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> estoque = new HashMap<>();
        estoque.put("caneta", 10);
        estoque.put("caderno", 5);
        estoque.put("caneta", 7);
        System.out.println(estoque.get("caneta"));
        System.out.println(estoque.get("borracha"));
        System.out.println(estoque.size());
        System.out.println(estoque.containsKey("caderno"));
        estoque.remove("caderno");
        System.out.println(estoque.containsKey("caderno"));
    }
}
