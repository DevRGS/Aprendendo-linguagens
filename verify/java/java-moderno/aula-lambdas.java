// verifica: q01, f01 e a aula lambdas (um, dois e nenhum parâmetro; lambda com bloco)
// saida:
// 8
// 5
// Olá!
// false
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.Predicate;

class Main {
    public static void main(String[] args) {
        Function<Integer, Integer> dobro = x -> x * 2;
        BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;
        Runnable ola = () -> System.out.println("Olá!");
        Predicate<String> longo = s -> {
            int tamanho = s.length();
            return tamanho > 5;
        };

        System.out.println(dobro.apply(4));
        System.out.println(soma.apply(2, 3));
        ola.run();
        System.out.println(longo.test("Java"));
    }
}
