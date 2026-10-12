// verifica: java.colecoes.q20 e a aula ordenacao (Collections.sort e Arrays.sort)
// saida:
// [1, 2, 5, 9]
// [1, 2, 5, 9]
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> n = new ArrayList<>(List.of(5, 2, 9, 1));
        Collections.sort(n);
        System.out.println(n);

        int[] array = {5, 2, 9, 1};
        Arrays.sort(array);
        System.out.println(Arrays.toString(array));
    }
}
