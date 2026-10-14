// verifica: java.strings.q08, f05 e o alerta da aula metodos-de-string (split recebe expressão regular)
// saida:
// 0
// 3
// [a, b, c]
import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        System.out.println("a.b.c".split(".").length);
        System.out.println("a.b.c".split("\\.").length);
        System.out.println(Arrays.toString("a.b.c".split("\\.")));
    }
}
