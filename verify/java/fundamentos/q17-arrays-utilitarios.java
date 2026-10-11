// verifica: java.fundamentos.q17, f14 e a aula arrays (sort, toString, copyOf, fill)
// saida:
// [1, 2, 3]
// [1, 2]
// [7, 7, 7]
import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] valores = {3, 1, 2};
        Arrays.sort(valores);
        System.out.println(Arrays.toString(valores));
        int[] copia = Arrays.copyOf(valores, 2);
        System.out.println(Arrays.toString(copia));
        Arrays.fill(valores, 7);
        System.out.println(Arrays.toString(valores));
    }
}
