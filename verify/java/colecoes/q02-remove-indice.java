// verifica: java.colecoes.q02 (remove(1) remove a posição 1)
// saida:
// [5, 1]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = new ArrayList<>(List.of(5, 7, 1));
        numeros.remove(1);
        System.out.println(numeros);
    }
}
