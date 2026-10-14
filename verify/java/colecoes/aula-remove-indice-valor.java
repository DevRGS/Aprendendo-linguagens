// verifica: f03 e a aula listas (remove(int) é posição; remove(Integer) é valor)
// saida:
// [10, 1]
// [10]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = new ArrayList<>(List.of(10, 20, 1));
        numeros.remove(1);
        System.out.println(numeros);
        numeros.remove(Integer.valueOf(1));
        System.out.println(numeros);
    }
}
