// verifica: f05 e a aula lambdas (ler variável efetivamente final; somar com stream)
// saida:
// true
// 6
import java.util.List;
import java.util.function.Predicate;

class Main {
    public static void main(String[] args) {
        int limite = 3;
        Predicate<String> curto = s -> s.length() <= limite;
        System.out.println(curto.test("Ana"));

        int total = List.of(1, 2, 3).stream().mapToInt(n -> n).sum();
        System.out.println(total);
    }
}
