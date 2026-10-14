// verifica: f04 e a tabela da aula lambdas (cada referência de método equivale à lambda)
// saida:
// OI OI
// linha 1
// linha 2
// 15
// true true
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

class Main {
    public static void main(String[] args) {
        Function<String, String> f1 = s -> s.toUpperCase();
        Function<String, String> f2 = String::toUpperCase;
        System.out.println(f1.apply("oi") + " " + f2.apply("oi"));

        Consumer<String> c1 = x -> System.out.println(x);
        Consumer<String> c2 = System.out::println;
        c1.accept("linha 1");
        c2.accept("linha 2");

        Function<String, Integer> p1 = s -> Integer.parseInt(s);
        Function<String, Integer> p2 = Integer::parseInt;
        System.out.println(p1.apply("7") + p2.apply("8"));

        Supplier<List<String>> n1 = () -> new ArrayList<>();
        Supplier<List<String>> n2 = ArrayList::new;
        System.out.println(n1.get().isEmpty() + " " + n2.get().isEmpty());
    }
}
