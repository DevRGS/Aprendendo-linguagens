// verifica: q02, f02 e a árvore da aula o-que-sao
// saida:
// true
// true
// true
// true
// true
// true
// true
import java.io.IOException;

class Main {
    public static void main(String[] args) {
        Throwable[] t = {
            new OutOfMemoryError(), new StackOverflowError(), new IOException(),
            new ArithmeticException(), new NumberFormatException(), new ArrayIndexOutOfBoundsException()
        };
        System.out.println(t[0] instanceof Error);
        System.out.println(t[1] instanceof Error);
        System.out.println(t[2] instanceof Exception && !(t[2] instanceof RuntimeException));
        System.out.println(t[3] instanceof RuntimeException);
        System.out.println(t[4] instanceof IllegalArgumentException);
        System.out.println(t[5] instanceof IndexOutOfBoundsException);
        System.out.println(new RuntimeException() instanceof Exception);
    }
}
