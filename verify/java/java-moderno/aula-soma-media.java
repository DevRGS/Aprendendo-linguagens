// verifica: java.java-moderno.q08 e a aula streams (mapToInt, sum e average)
// saida:
// 25
// 5.0
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(5, 2, 8, 1, 9);
        int soma = numeros.stream().mapToInt(Integer::intValue).sum();
        double media = numeros.stream().mapToInt(n -> n).average().orElse(0);
        System.out.println(soma);
        System.out.println(media);
    }
}
