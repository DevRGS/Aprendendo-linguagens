// verifica: q05, f03 e a tabela da aula lambdas (test, apply, accept e get)
// saida:
// true
// 3
// Oi, Ana
// 42
// 5
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

class Main {
    public static void main(String[] args) {
        Predicate<String> vazio = s -> s.isEmpty();
        Function<String, Integer> tamanho = s -> s.length();
        Consumer<String> saudar = nome -> System.out.println("Oi, " + nome);
        Supplier<Integer> resposta = () -> 42;
        BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;

        System.out.println(vazio.test(""));
        System.out.println(tamanho.apply("Ana"));
        saudar.accept("Ana");
        System.out.println(resposta.get());
        System.out.println(soma.apply(2, 3));
    }
}
