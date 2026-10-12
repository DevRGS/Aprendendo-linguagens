// verifica: q13, f08, f09 e a aula mapas (contagem com getOrDefault; percorrer com entrySet)
// saida:
// {lua=1, mar=1, sol=3}
// lua: 1
// mar: 1
// sol: 3
import java.util.Map;
import java.util.TreeMap;

class Main {
    public static void main(String[] args) {
        String[] palavras = {"sol", "lua", "sol", "mar", "sol"};
        Map<String, Integer> contagem = new TreeMap<>();
        for (String p : palavras) {
            contagem.put(p, contagem.getOrDefault(p, 0) + 1);
        }
        System.out.println(contagem);
        for (Map.Entry<String, Integer> par : contagem.entrySet()) {
            System.out.println(par.getKey() + ": " + par.getValue());
        }
    }
}
