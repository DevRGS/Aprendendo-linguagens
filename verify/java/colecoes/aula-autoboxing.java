// verifica: f02 e a aula listas (int vira Integer e volta sozinho)
// saida:
// 7
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> notas = new ArrayList<>();
        notas.add(7);
        int primeira = notas.get(0);
        System.out.println(primeira);
    }
}
